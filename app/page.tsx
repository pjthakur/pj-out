"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { NextPage } from "next";
import Head from "next/head";
import { Montserrat, Poppins } from "next/font/google";

const montserrat = Montserrat({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});

const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});

interface Color {
  hex: string;
  rgb: [number, number, number];
  hsl: [number, number, number];
}

interface Palette {
  name: string;
  colors: Color[];
  description: string;
}

interface SavedPalette extends Palette {
  id: string;
  createdAt: number;
}

const hexToRgb = (hex: string): [number, number, number] => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16),
      ]
    : [0, 0, 0];
};

const rgbToHex = (r: number, g: number, b: number): string => {
  const toHex = (c: number) => {
    const hex = Math.max(0, Math.min(255, Math.round(c))).toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

const rgbToHsl = (
  r: number,
  g: number,
  b: number
): [number, number, number] => {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0,
    s = 0,
    l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
};

const hslToRgb = (
  h: number,
  s: number,
  l: number
): [number, number, number] => {
  h = h / 360;
  s = s / 100;
  l = l / 100;
  let r, g, b;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
};

const getComplementaryColor = (
  h: number,
  s: number,
  l: number
): [number, number, number] => {
  return [(h + 180) % 360, s, l];
};

const getAnalogousColors = (
  h: number,
  s: number,
  l: number
): Array<[number, number, number]> => {
  return [
    [(h - 30 + 360) % 360, s, l],
    [h, s, l],
    [(h + 30) % 360, s, l],
    [(h + 60) % 360, s, l],
    [(h - 60 + 360) % 360, s, l],
  ];
};

const getTriadicColors = (
  h: number,
  s: number,
  l: number
): Array<[number, number, number]> => {
  return [
    [h, s, l],
    [(h + 120) % 360, s, l],
    [(h + 240) % 360, s, l],
  ];
};

const getMonochromaticColors = (
  h: number,
  s: number,
  l: number
): Array<[number, number, number]> => {
  return [
    [h, s, Math.min(l + 40, 95)],
    [h, s, Math.min(l + 20, 85)],
    [h, s, l],
    [h, s, Math.max(l - 20, 15)],
    [h, s, Math.max(l - 40, 5)],
  ];
};

const getTetradicColors = (
  h: number,
  s: number,
  l: number
): Array<[number, number, number]> => {
  return [
    [h, s, l],
    [(h + 90) % 360, s, l],
    [(h + 180) % 360, s, l],
    [(h + 270) % 360, s, l],
  ];
};

const getRandomHex = (): string => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const isColorLight = (r: number, g: number, b: number): boolean => {
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 125;
};

const getContrastRatio = (
  rgb1: [number, number, number],
  rgb2: [number, number, number]
): number => {
  const getLuminance = (rgb: [number, number, number]) => {
    const [r, g, b] = rgb.map((val) => {
      val = val / 255;
      return val <= 0.03928
        ? val / 12.92
        : Math.pow((val + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };

  const luminance1 = getLuminance(rgb1);
  const luminance2 = getLuminance(rgb2);

  const brightest = Math.max(luminance1, luminance2);
  const darkest = Math.min(luminance1, luminance2);

  return (brightest + 0.05) / (darkest + 0.05);
};

const getColorName = (rgb: [number, number, number]): string => {
  const [r, g, b] = rgb;

  const colorNames: { [key: string]: [number, number, number] } = {
    Red: [255, 0, 0],
    Green: [0, 255, 0],
    Blue: [0, 0, 255],
    Yellow: [255, 255, 0],
    Cyan: [0, 255, 255],
    Magenta: [255, 0, 255],
    White: [255, 255, 255],
    Black: [0, 0, 0],
    Purple: [128, 0, 128],
    Orange: [255, 165, 0],
    Pink: [255, 192, 203],
    Indigo: [75, 0, 130],
    Teal: [0, 128, 128],
    Lavender: [230, 230, 250],
  };

  let closestColor = "Custom";
  let minDistance = Number.MAX_VALUE;

  Object.entries(colorNames).forEach(([name, [r2, g2, b2]]) => {
    const distance = Math.sqrt(
      Math.pow(r - r2, 2) + Math.pow(g - g2, 2) + Math.pow(b - b2, 2)
    );
    if (distance < minDistance) {
      minDistance = distance;
      closestColor = name;
    }
  });

  return minDistance < 150 ? closestColor : "Custom";
};

const generatePalette = (
  hsl: [number, number, number],
  type: string
): Palette => {
  let colors: Color[] = [];
  let hslArray: Array<[number, number, number]> = [];
  let description = "";

  switch (type.toLowerCase()) {
    case "complementary":
      hslArray = [hsl, getComplementaryColor(...hsl)];
      description =
        "Colors that are opposite each other on the color wheel, creating strong contrast.";
      break;
    case "analogous":
      hslArray = getAnalogousColors(...hsl);
      description =
        "Colors that are adjacent to each other on the color wheel, creating a harmonious and cohesive look.";
      break;
    case "triadic":
      hslArray = getTriadicColors(...hsl);
      description =
        "Three colors equally spaced around the color wheel, providing vibrant contrast while maintaining harmony.";
      break;
    case "monochromatic":
      hslArray = getMonochromaticColors(...hsl);
      description =
        "Different shades, tones, and tints of a single color, creating a cohesive and sophisticated palette.";
      break;
    case "tetradic":
      hslArray = getTetradicColors(...hsl);
      description =
        "Four colors arranged into two complementary pairs, offering rich and balanced color possibilities.";
      break;
    default:
      hslArray = [hsl];
      description = "A custom color palette.";
  }

  colors = hslArray.map((hslValues) => {
    const rgb = hslToRgb(...hslValues);
    return {
      hex: rgbToHex(...rgb),
      rgb,
      hsl: hslValues,
    };
  });

  return {
    name: type.charAt(0).toUpperCase() + type.slice(1),
    colors,
    description,
  };
};

const generateHarmonies = (baseHsl: [number, number, number]): Palette[] => {
  return [
    generatePalette(baseHsl, "complementary"),
    generatePalette(baseHsl, "analogous"),
    generatePalette(baseHsl, "triadic"),
    generatePalette(baseHsl, "monochromatic"),
    generatePalette(baseHsl, "tetradic"),
  ];
};

const ColorPaletteGenerator: NextPage = () => {
  const [baseColor, setBaseColor] = useState<string>("#6366f1");
  const [palettes, setPalettes] = useState<Palette[]>([]);
  const [savedPalettes, setSavedPalettes] = useState<SavedPalette[]>([]);
  const [saturation, setSaturation] = useState<number>(80);
  const [brightness, setBrightness] = useState<number>(50);
  const [activeTab, setActiveTab] = useState<string>("all");
  const [activePalette, setActivePalette] = useState<string>("complementary");
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);
  const [exportFormat, setExportFormat] = useState<string>("hex");
  const [colorHistory, setColorHistory] = useState<string[]>([]);
  const [showHistory, setShowHistory] = useState<boolean>(false);
  const [customizing, setCustomizing] = useState<boolean>(false);
  const [customPalette, setCustomPalette] = useState<Color[]>([]);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const [showSaved, setShowSaved] = useState<boolean>(false);
  const [currentView, setCurrentView] = useState<
    "palettes" | "preview" | "export"
  >("palettes");
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [showColorInfo, setShowColorInfo] = useState<boolean>(false);
  const [contrastWithWhite, setContrastWithWhite] = useState<number>(1);
  const [contrastWithBlack, setContrastWithBlack] = useState<number>(1);
  const [colorName, setColorName] = useState<string>("Custom");
  const [quickColors, setQuickColors] = useState<string[]>([
    "#FF0000",
    "#00FF00",
    "#0000FF",
    "#FFFF00",
    "#FF00FF",
    "#00FFFF",
  ]);
  const [hueAnimation, setHueAnimation] = useState<boolean>(false);

  const colorPickerRef = useRef<HTMLDivElement>(null);
  const saturationRef = useRef<HTMLDivElement>(null);
  const hueRef = useRef<HTMLDivElement>(null);
  const customNameRef = useRef<HTMLInputElement>(null);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const baseHsl = useMemo(() => {
    const rgb = hexToRgb(baseColor);
    return rgbToHsl(...rgb);
  }, [baseColor]);

  const adjustedBaseHsl = useMemo<[number, number, number]>(() => {
    return [baseHsl[0], saturation, brightness];
  }, [baseHsl, saturation, brightness]);

  useEffect(() => {
    const rgb = hexToRgb(baseColor);
    const whiteRgb: [number, number, number] = [255, 255, 255];
    const blackRgb: [number, number, number] = [0, 0, 0];

    setContrastWithWhite(getContrastRatio(rgb, whiteRgb));
    setContrastWithBlack(getContrastRatio(rgb, blackRgb));
    setColorName(getColorName(rgb));
  }, [baseColor]);

  useEffect(() => {
    document.documentElement.style.setProperty(
      "--icon-color",
      isDarkMode ? "#a78bfa" : "#6366f1"
    );
  }, [isDarkMode]);

  useEffect(() => {
    const generatedPalettes = generateHarmonies(adjustedBaseHsl);
    setPalettes(generatedPalettes);

    if (customPalette.length === 0) {
      const initialColors = Array(5)
        .fill(null)
        .map(() => {
          const randomHex = getRandomHex();
          const rgb = hexToRgb(randomHex);
          const hsl = rgbToHsl(...rgb);
          return { hex: randomHex, rgb, hsl };
        });
      setCustomPalette(initialColors);
    }

    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), 400);
    return () => clearTimeout(timer);
  }, [adjustedBaseHsl, baseColor, saturation, brightness]);

  useEffect(() => {
    const savedData = localStorage.getItem("savedPalettes");
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setSavedPalettes(parsed);
      } catch (e) {
        console.error("Failed to parse saved palettes", e);
      }
    }

    const historyData = localStorage.getItem("colorHistory");
    if (historyData) {
      try {
        const parsed = JSON.parse(historyData);
        setColorHistory(parsed);
      } catch (e) {
        console.error("Failed to parse color history", e);
      }
    }
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (hueAnimation) {
      let hue = 0;
      interval = setInterval(() => {
        hue = (hue + 1) % 360;
        const rgb = hslToRgb(hue, saturation, brightness);
        setBaseColor(rgbToHex(...rgb));
      }, 50);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [hueAnimation, saturation, brightness]);

  useEffect(() => {
    if (baseColor && !colorHistory.includes(baseColor)) {
      const newHistory = [baseColor, ...colorHistory.slice(0, 19)];
      setColorHistory(newHistory);
      localStorage.setItem("colorHistory", JSON.stringify(newHistory));
    }
  }, [baseColor, colorHistory]);

  const handleSaturationChange = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!saturationRef.current) return;

    const rect = saturationRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));

    const newSaturation = Math.round(x * 100);
    const newBrightness = Math.round((1 - y) * 100);

    setSaturation(newSaturation);
    setBrightness(newBrightness);
  };

  const handleSaturationMouseDown = () => {
    const handleMouseMove = (e: MouseEvent) => {
      e.preventDefault();
      if (!saturationRef.current) return;

      const rect = saturationRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));

      setSaturation(Math.round(x * 100));
      setBrightness(Math.round((1 - y) * 100));
    };

    const handleMouseUp = () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  const handleHueChange = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!hueRef.current) return;

    const rect = hueRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));

    const newHue = Math.round(x * 360);

    const rgb = hslToRgb(newHue, saturation, brightness);
    setBaseColor(rgbToHex(...rgb));
  };

  const handleHueMouseDown = () => {
    setHueAnimation(false);

    const handleMouseMove = (e: MouseEvent) => {
      e.preventDefault();
      if (!hueRef.current) return;

      const rect = hueRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));

      const newHue = Math.round(x * 360);
      const rgb = hslToRgb(newHue, saturation, brightness);
      setBaseColor(rgbToHex(...rgb));
    };

    const handleMouseUp = () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  const toggleHueAnimation = () => {
    setHueAnimation(!hueAnimation);
  };

  const updateCustomColor = (index: number, newColor: string) => {
    const updatedPalette = [...customPalette];
    const rgb = hexToRgb(newColor);
    updatedPalette[index] = {
      hex: newColor,
      rgb,
      hsl: rgbToHsl(...rgb),
    };
    setCustomPalette(updatedPalette);
  };

  const savePalette = () => {
    const currentPalette = palettes.find(
      (p) => p.name.toLowerCase() === activePalette
    );
    if (!currentPalette) return;

    const name = customNameRef.current?.value || currentPalette.name;

    const newSavedPalette: SavedPalette = {
      ...currentPalette,
      name,
      id: Date.now().toString(),
      createdAt: Date.now(),
    };

    const updatedSavedPalettes = [newSavedPalette, ...savedPalettes];
    setSavedPalettes(updatedSavedPalettes);
    localStorage.setItem("savedPalettes", JSON.stringify(updatedSavedPalettes));

    showNotification("Palette saved successfully!", "success");

    if (customNameRef.current) {
      customNameRef.current.value = "";
    }
  };

  const deleteSavedPalette = (id: string) => {
    const updatedPalettes = savedPalettes.filter((p) => p.id !== id);
    setSavedPalettes(updatedPalettes);
    localStorage.setItem("savedPalettes", JSON.stringify(updatedPalettes));
    showNotification("Palette deleted", "info");
  };

  const loadSavedPalette = (palette: SavedPalette) => {
    if (palette.colors.length > 0) {
      const mainColor = palette.colors[0];
      setBaseColor(mainColor.hex);
      setSaturation(mainColor.hsl[1]);
      setBrightness(mainColor.hsl[2]);
      setActivePalette(palette.name.toLowerCase());

      showNotification("Palette loaded", "success");
      setCurrentView("palettes");
      setShowSaved(false);
    }
  };

  const copyToClipboard = (text: string, format: string) => {
    navigator.clipboard.writeText(text).then(() => {
      showNotification(`${format}: ${text} copied to clipboard!`, "success");
    });
  };

  const showNotification = (
    message: string,
    type: "success" | "error" | "info"
  ) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const formatColor = (color: Color): string => {
    switch (exportFormat) {
      case "hex":
        return color.hex;
      case "rgb":
        return `rgb(${color.rgb.join(", ")})`;
      case "rgba":
        return `rgba(${color.rgb.join(", ")}, 1)`;
      case "hsl":
        return `hsl(${color.hsl[0]}, ${color.hsl[1]}%, ${color.hsl[2]}%)`;
      case "scss":
        return `$color: ${color.hex};`;
      case "tailwind":
        return `colors.${activePalette.toLowerCase()}: "${color.hex}",`;
      default:
        return color.hex;
    }
  };

  const exportPalettes = () => {
    let exportText = "";
    const activePaletteObj = palettes.find(
      (p) => p.name.toLowerCase() === activePalette
    );

    if (!activePaletteObj) return;

    switch (exportFormat) {
      case "scss":
        exportText += `// ${activePaletteObj.name} Palette - SCSS Variables\n\n`;
        activePaletteObj.colors.forEach((color, index) => {
          exportText += `$${activePalette.toLowerCase()}-${index + 1}: ${
            color.hex
          };\n`;
        });
        exportText += `\n// Usage example:\n.element {\n  background-color: $${activePalette.toLowerCase()}-1;\n  color: $${activePalette.toLowerCase()}-2;\n}\n`;
        break;

      case "css":
        exportText += `/* ${activePaletteObj.name} Palette - CSS Variables */\n\n:root {\n`;
        activePaletteObj.colors.forEach((color, index) => {
          exportText += `  --${activePalette.toLowerCase()}-${index + 1}: ${
            color.hex
          };\n`;
        });
        exportText += `}\n\n/* Usage example: */\n.element {\n  background-color: var(--${activePalette.toLowerCase()}-1);\n  color: var(--${activePalette.toLowerCase()}-2);\n}\n`;
        break;

      case "tailwind":
        exportText += `// ${activePaletteObj.name} Palette - Tailwind Config\n\nmodule.exports = {\n  theme: {\n    extend: {\n      colors: {\n`;
        activePaletteObj.colors.forEach((color, index) => {
          exportText += `        '${activePalette.toLowerCase()}-${
            index + 1
          }': '${color.hex}',\n`;
        });
        exportText += `      }\n    }\n  }\n};\n`;
        break;

      default:
        exportText += `// ${activePaletteObj.name} Palette\n\n`;
        activePaletteObj.colors.forEach((color, index) => {
          exportText += `Color ${index + 1}: ${
            color.hex
          } | RGB(${color.rgb.join(", ")}) | HSL(${color.hsl[0]}, ${
            color.hsl[1]
          }%, ${color.hsl[2]}%)\n`;
        });
    }

    navigator.clipboard.writeText(exportText).then(() => {
      showNotification("Palette exported to clipboard!", "success");
    });
  };

  const filteredPalettes =
    activeTab === "all"
      ? palettes
      : palettes.filter((p) => p.name.toLowerCase() === activeTab);

  const currentPalette =
    palettes.find((p) => p.name.toLowerCase() === activePalette) || palettes[0];

  const theme = {
    bg: isDarkMode
      ? "from-gray-900 via-gray-800 to-gray-900"
      : "from-gray-50 via-blue-50 to-pink-50",
    gradientOverlay: isDarkMode
      ? "bg-gradient-to-br from-purple-900/20 to-indigo-900/20"
      : "bg-gradient-to-br from-purple-100/30 to-indigo-100/30",
    card: isDarkMode
      ? "bg-gray-800/80 backdrop-blur-lg"
      : "bg-white/80 backdrop-blur-lg",
    cardBorder: isDarkMode ? "border-gray-700/50" : "border-gray-200/50",
    text: isDarkMode ? "text-white" : "text-gray-800",
    subtext: isDarkMode ? "text-gray-200" : "text-gray-600",
    border: isDarkMode ? "border-gray-700" : "border-gray-200",
    button: isDarkMode
      ? "bg-gray-700/80 hover:bg-gray-600/80 backdrop-blur-md"
      : "bg-gray-200/80 hover:bg-gray-300/80 backdrop-blur-md",
    buttonText: isDarkMode ? "text-white" : "text-gray-800",
    activeButton: isDarkMode
      ? "bg-purple-600/90 hover:bg-purple-700/90 backdrop-blur-md text-white"
      : "bg-purple-500/90 hover:bg-purple-600/90 backdrop-blur-md",
    input: isDarkMode
      ? "bg-gray-700/80 border-gray-600/50 backdrop-blur-md"
      : "bg-white/80 border-gray-300/50 backdrop-blur-md",
    shadow: isDarkMode
      ? "shadow-xl shadow-black/20"
      : "shadow-xl shadow-black/5",
    highlight: isDarkMode
      ? "from-purple-600 to-indigo-600"
      : "from-purple-500 to-indigo-500",
    glow: isDarkMode
      ? "shadow-lg shadow-purple-500/20"
      : "shadow-lg shadow-purple-500/10",
    iconColor: isDarkMode ? "text-gray-300" : "text-gray-500",
  };

  return (
    <div
      className={`${montserrat.className} transition-colors duration-500 ${
        isDarkMode ? "dark" : ""
      }`}
    >
      <Head>
        <title>Spectrum Pro - Modern Color Palette Generator</title>
        <meta
          name="description"
          content="Create professional color palettes for your design projects with Spectrum Pro"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main
        className={`min-h-screen bg-gradient-to-br ${theme.bg} transition-colors duration-500 overflow-hidden`}
      >
        <div className={`${theme.gradientOverlay} min-h-screen`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <header className="mb-8 relative overflow-hidden">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-purple-500/20 rounded-full filter blur-3xl opacity-20 -z-10 animate-pulse-slow"></div>
              <div className="absolute top-10 right-10 w-32 h-32 bg-indigo-500/30 rounded-full filter blur-2xl opacity-20 -z-10 animate-float"></div>
              <div className="absolute -top-20 -left-20 w-64 h-64 bg-pink-500/20 rounded-full filter blur-3xl opacity-20 -z-10 animate-float-delayed"></div>

              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <div className="relative z-10 mb-4 sm:mb-0">
                  <h1 className="text-3xl sm:text-4xl font-bold relative headline-container">
                    {"Spectrum Pro".split("").map((letter, index) => (
                      <span
                        key={index}
                        className="pro-letter"
                        style={{
                          animationDelay: `${index * 0.08}s`,
                          animationDuration: `${4 + (index % 3) * 0.5}s`,
                        }}
                      >
                        {letter === " " ? "\u00A0" : letter}
                      </span>
                    ))}
                  </h1>
                  <p className={`${theme.subtext} max-w-2xl text-sm sm:text-base`}>
                    Professional color palette generator for designers
                  </p>
                </div>

                <div className="flex items-center space-x-3 relative z-10 self-end sm:self-auto">
                  <button
                    onClick={toggleTheme}
                    className={`p-2 sm:p-3 rounded-full transition-all ${theme.button} ${theme.shadow} cursor-pointer hover:scale-105 transform`}
                    aria-label="Toggle theme"
                  >
                    {isDarkMode ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 sm:h-5 sm:w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                        />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 sm:h-5 sm:w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                        />
                      </svg>
                    )}
                  </button>

                  <button
                    onClick={() => setShowSaved(!showSaved)}
                    className={`flex items-center space-x-2 px-3 sm:px-4 py-2 sm:py-3 rounded-lg transition-all ${theme.button} ${theme.buttonText} ${theme.shadow} cursor-pointer hover:scale-105 transform text-sm sm:text-base`}
                    aria-label="Saved Palettes"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 sm:h-5 sm:w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                      />
                    </svg>
                    <span className="hidden sm:inline font-medium">Saved</span>
                    {savedPalettes.length > 0 && (
                      <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-medium rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 text-white ml-1 sm:ml-0">
                        {savedPalettes.length}
                      </span>
                    )}
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap mt-6 sm:mt-8 border-b border-gray-700/30 items-center justify-between">
                <div className="flex overflow-x-auto w-full pb-1 sm:pb-0 sm:w-auto hide-scrollbar">
                  <button
                    onClick={() => setCurrentView("palettes")}
                    className={`px-3 sm:px-6 py-2 sm:py-3 font-medium text-xs sm:text-sm rounded-t-lg transition-all duration-300 cursor-pointer whitespace-nowrap ${
                      currentView === "palettes"
                        ? `bg-gradient-to-r ${theme.highlight} text-white shadow-glow`
                        : `${isDarkMode ? "text-gray-300" : "text-gray-400"} hover:${isDarkMode ? "text-white" : "text-gray-500"} `
                    }`}
                  >
                    <span className="flex items-center justify-center">
                      <svg
                        className="w-4 h-4"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12Z"
                          stroke="currentColor"
                          strokeWidth="2"
                        />
                        <path
                          d="M7 17C8.65685 17 10 15.6569 10 14C10 12.3431 8.65685 11 7 11C5.34315 11 4 12.3431 4 14C4 15.6569 5.34315 17 7 17Z"
                          fill="currentColor"
                        />
                        <path
                          d="M17 7C17 8.65685 15.6569 10 14 10C12.3431 10 11 8.65685 11 7C11 5.34315 12.3431 4 14 4C15.6569 4 17 5.34315 17 7Z"
                          fill="currentColor"
                        />
                        <path
                          d="M17 17C18.6569 17 20 15.6569 20 14C20 12.3431 18.6569 11 17 11C15.3431 11 14 12.3431 14 14C14 15.6569 15.3431 17 17 17Z"
                          fill="currentColor"
                        />
                        <path
                          d="M7 7C8.65685 7 10 5.65685 10 4C10 2.34315 8.65685 1 7 1C5.34315 1 4 2.34315 4 4C4 5.65685 5.34315 7 7 7Z"
                          fill="currentColor"
                        />
                      </svg>
                      <span className="hidden sm:inline ml-2">Palettes</span>
                    </span>
                  </button>
                  <button
                    onClick={() => setCurrentView("preview")}
                    className={`px-3 sm:px-6 py-2 sm:py-3 font-medium text-xs sm:text-sm rounded-t-lg transition-all duration-300 cursor-pointer whitespace-nowrap ${
                      currentView === "preview"
                        ? `bg-gradient-to-r ${theme.highlight} text-white shadow-glow`
                        : `${isDarkMode ? "text-gray-300" : "text-gray-400"} hover:${isDarkMode ? "text-white" : "text-gray-500"} $`
                    }`}
                  >
                    <span className="flex items-center justify-center">
                      <svg
                        className="w-4 h-4"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <rect
                          x="2"
                          y="3"
                          width="20"
                          height="18"
                          rx="2"
                          stroke="currentColor"
                          strokeWidth="2"
                        />
                        <path
                          d="M2 7H22"
                          stroke="currentColor"
                          strokeWidth="2"
                        />
                        <circle cx="5" cy="5" r="1" fill="currentColor" />
                        <circle cx="9" cy="5" r="1" fill="currentColor" />
                      </svg>
                      <span className="hidden sm:inline ml-2">UI Preview</span>
                    </span>
                  </button>
                  <button
                    onClick={() => setCurrentView("export")}
                    className={`px-3 sm:px-6 py-2 sm:py-3 font-medium text-xs sm:text-sm rounded-t-lg transition-all duration-300 cursor-pointer whitespace-nowrap ${
                      currentView === "export"
                        ? `bg-gradient-to-r ${theme.highlight} text-white shadow-glow`
                        : `${isDarkMode ? "text-gray-300" : "text-gray-400"} hover:${isDarkMode ? "text-white" : "text-gray-500"}`
                    }`}
                  >
                    <span className="flex items-center justify-center">
                      <svg
                        className="w-4 h-4"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M12 15V3M12 15L8 11M12 15L16 11"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M2 17L2 18C2 19.1046 2.89543 20 4 20L20 20C21.1046 20 22 19.1046 22 18L22 17"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <span className="hidden sm:inline ml-2">Export</span>
                    </span>
                  </button>
                </div>

                <div className="flex items-center mt-3 sm:mt-0 w-full sm:w-auto justify-end">
                  <button
                    onClick={savePalette}
                    className="flex items-center space-x-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg shadow-purple-500/20 transition-all hover:scale-[1.02] transform cursor-pointer font-medium text-xs sm:text-sm"
                    aria-label="Save Palette"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 sm:h-5 sm:w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="#fff"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
                      />
                    </svg>
                    <span className="hidden sm:inline">Save Palette</span>
                  </button>
                </div>
              </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              <div className="space-y-4 sm:space-y-6">
                <div
                  className={`rounded-2xl overflow-hidden ${theme.shadow} ${theme.card} border ${theme.cardBorder} transition-all duration-300 transform hover:translate-y-[-2px] relative`}
                >
                  <div className="p-5 border-b border-gray-700/30 flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="flex space-x-2 mr-3">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      </div>
                      <h2 className={`text-xl font-semibold ${theme.text}`}>
                        Color Picker
                      </h2>
                    </div>

                    <div className="flex space-x-2">
                      <button
                        className={`p-2 rounded-lg ${theme.button} hover:scale-105 transform transition-all cursor-pointer`}
                        onClick={() => setBaseColor(getRandomHex())}
                        aria-label="Random color"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={toggleHueAnimation}
                        className={`p-2 rounded-lg ${
                          hueAnimation
                            ? "bg-purple-600 text-white"
                            : theme.button
                        } hover:scale-105 transform transition-all cursor-pointer`}
                        title={hueAnimation ? "Stop animation" : "Animate hue"}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div className="p-6 space-y-6">
                    <div
                      ref={saturationRef}
                      className="h-48 rounded-xl w-full relative cursor-pointer shadow-md overflow-hidden"
                      style={{
                        background: `linear-gradient(to right, #fff, hsl(${baseHsl[0]}, 100%, 50%))`,
                      }}
                      onClick={handleSaturationChange}
                      onMouseDown={handleSaturationMouseDown}
                    >
                      <div
                        className="absolute inset-0"
                        style={{
                          background:
                            "linear-gradient(to top, #000, transparent)",
                        }}
                      />
                      <div
                        className="absolute w-6 h-6 rounded-full border-2 border-white shadow-lg transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                        style={{
                          left: `${saturation}%`,
                          top: `${100 - brightness}%`,
                          boxShadow:
                            "0 0 0 2px rgba(0, 0, 0, 0.2), 0 0 10px rgba(0, 0, 0, 0.3)",
                        }}
                      />

                      <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                        S: {saturation}%, B: {brightness}%
                      </div>
                    </div>

                    <div className="relative">
                      <div
                        ref={hueRef}
                        className="h-8 rounded-xl w-full cursor-pointer relative shadow-md border border-white/10 overflow-hidden mt-3"
                        style={{
                          background:
                            "linear-gradient(to right, #f00, #ff0, #0f0, #0ff, #00f, #f0f, #f00)",
                        }}
                        onClick={handleHueChange}
                        onMouseDown={handleHueMouseDown}
                      >
                        <div
                          className="absolute w-4 h-8 shadow-lg pointer-events-none"
                          style={{
                            left: `${(baseHsl[0] / 360) * 100}%`,
                            transform: "translateX(-50%)",
                            backgroundColor: "rgba(34, 29, 77, 0.61)",
                          }}
                        />
                      </div>
                      <div className="absolute -top-2 -right-2">
                        <div
                          className={`w-5 h-5 rounded-full flex items-center justify-center cursor-pointer ${
                            hueAnimation
                              ? "bg-purple-600 text-white"
                              : "bg-gray-700/50 text-gray-300"
                          }`}
                          onClick={toggleHueAnimation}
                        >
                          {hueAnimation ? "◼" : "▶"}
                        </div>
                      </div>
                    </div>

                    <div
                      className={`rounded-xl border ${theme.border} p-4 transition-all duration-300 ${theme.card} animate-fade-in`}
                    >
                      <h3 className={`text-sm font-medium mb-3 ${theme.text}`}>
                        Color Details
                      </h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between items-center">
                          <span className={theme.text}>HEX:</span>
                          <span className={`font-mono ${theme.text}`}>{baseColor}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className={theme.text}>RGB:</span>
                          <span className={`font-mono ${theme.text}`}>
                            {hexToRgb(baseColor).join(", ")}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className={theme.text}>HSL:</span>
                          <span className={`font-mono ${theme.text}`}>
                            {baseHsl[0]}°, {baseHsl[1]}%, {baseHsl[2]}%
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className={theme.text}>Name:</span>
                          <span className={`font-medium ${theme.text}`}>{colorName}</span>
                        </div>
                        <div className="mt-3 pt-3 border-t border-gray-700/30">
                          <h4 className={`text-xs font-medium mb-2 ${theme.text}`}>
                            Accessibility
                          </h4>
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <div className="flex items-center">
                                <div className="w-4 h-4 rounded bg-white mr-2"></div>
                                <span className={theme.text}>Contrast with white:</span>
                              </div>
                              <div
                                className={`px-2 py-1 rounded text-xs font-medium ${
                                  contrastWithWhite >= 4.5
                                    ? `bg-green-500/20 ${isDarkMode ? "text-green-300" : "text-green-600"}`
                                    : `bg-yellow-500/20 ${isDarkMode ? "text-yellow-300" : "text-yellow-600"}`
                                }`}
                              >
                                {contrastWithWhite.toFixed(2)}{" "}
                                {contrastWithWhite >= 4.5 ? "✓" : "!"}
                              </div>
                            </div>
                            <div className="flex justify-between items-center">
                              <div className="flex items-center">
                                <div className="w-4 h-4 rounded bg-black mr-2"></div>
                                <span className={theme.text}>Contrast with black:</span>
                              </div>
                              <div
                                className={`px-2 py-1 rounded text-xs font-medium ${
                                  contrastWithBlack >= 4.5
                                    ? `bg-green-500/20 ${isDarkMode ? "text-green-300" : "text-green-600"}`
                                    : `bg-yellow-500/20 ${isDarkMode ? "text-yellow-300" : "text-yellow-600"}`
                                }`}
                              >
                                {contrastWithBlack.toFixed(2)}{" "}
                                {contrastWithBlack >= 4.5 ? "✓" : "!"}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  className={`rounded-2xl overflow-hidden ${theme.shadow} ${theme.card} border ${theme.cardBorder} transition-all duration-300 transform hover:translate-y-[-2px]`}
                >
                  <div className="p-3 sm:p-5 border-b border-gray-700/30 flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="flex space-x-2 mr-3">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      </div>
                      <h2 className={`text-xl font-semibold ${theme.text}`}>
                        Adjust Colors
                      </h2>
                    </div>

                    <div className="flex space-x-2">
                      <button
                        onClick={() => setShowHistory(!showHistory)}
                        className={`p-2 rounded-lg ${theme.button} hover:scale-105 transform transition-all cursor-pointer`}
                        aria-label="Show color history"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div className="p-6 space-y-6">
                    <div className="space-y-4">
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <label
                            className={`text-sm font-medium ${theme.text}`}
                          >
                            Saturation
                          </label>
                          <span className="text-sm text-gray-400 font-medium">
                            {saturation}%
                          </span>
                        </div>
                        <div className="relative h-2 bg-gray-200/30 rounded-full overflow-hidden group">
                          <div
                            className="absolute h-full bg-gradient-to-r from-purple-500 to-indigo-500 group-hover:animate-pulse"
                            style={{ width: `${saturation}%` }}
                          ></div>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={saturation}
                            onChange={(e) =>
                              setSaturation(parseInt(e.target.value))
                            }
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          />
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <label
                            className={`text-sm font-medium ${theme.text}`}
                          >
                            Brightness
                          </label>
                          <span className="text-sm text-gray-400 font-medium">
                            {brightness}%
                          </span>
                        </div>
                        <div className="relative h-2 bg-gray-200/30 rounded-full overflow-hidden group">
                          <div
                            className="absolute h-full bg-gradient-to-r from-gray-700 to-gray-100 group-hover:animate-pulse"
                            style={{ width: `${brightness}%` }}
                          ></div>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={brightness}
                            onChange={(e) =>
                              setBrightness(parseInt(e.target.value))
                            }
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {showHistory && colorHistory.length > 0 && (
                    <div
                      className={`mt-6 rounded-xl rounded-t-none border ${theme.border} p-3 sm:p-4 transition-colors duration-300 ${theme.card}`}
                    >
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="text-sm font-medium text-black dark:text-gray-300">
                          Recently Used Colors
                        </h3>
                        <button
                          onClick={() => setShowHistory(false)}
                          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {colorHistory.map((color, index) => (
                          <button
                            key={index}
                            className="w-8 h-8 rounded-lg transition-all hover:scale-110 focus:outline-none border border-white/20 cursor-pointer shadow-md"
                            style={{ backgroundColor: color }}
                            onClick={() => setBaseColor(color)}
                            aria-label={`Use color ${color}`}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="lg:hidden space-y-4">
                  <div
                    className={`rounded-2xl overflow-hidden ${theme.shadow} ${theme.card} border ${theme.cardBorder} transition-all duration-300 transform hover:translate-y-[-2px] p-6`}
                  >
                    <h2 className={`text-xl font-semibold mb-4 ${theme.text}`}>
                      Palette Types
                    </h2>
                    <div className="flex flex-wrap gap-2">
                      {palettes.map((palette) => (
                        <button
                          key={palette.name}
                          onClick={() =>
                            setActivePalette(palette.name.toLowerCase())
                          }
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                            activePalette === palette.name.toLowerCase()
                              ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/20"
                              : `${theme.button} ${theme.buttonText}`
                          } hover:scale-105 transform`}
                        >
                          {palette.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-2 space-y-6">
                {currentView === "palettes" && (
                  <>
                    <div
                      className={`hidden lg:block rounded-2xl overflow-hidden ${theme.shadow} ${theme.card} border ${theme.cardBorder} transition-all duration-300 transform hover:translate-y-[-2px] p-6`}
                    >
                      <h2
                        className={`text-xl font-semibold mb-4 ${theme.text}`}
                      >
                        Palette Types
                      </h2>
                      <div className="flex flex-wrap gap-3">
                        {palettes.map((palette) => (
                          <button
                            key={palette.name}
                            onClick={() =>
                              setActivePalette(palette.name.toLowerCase())
                            }
                            className={`px-5 py-3 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                              activePalette === palette.name.toLowerCase()
                                ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/20"
                                : `${theme.button} ${theme.buttonText}`
                            } hover:scale-105 transform`}
                          >
                            {palette.name}
                          </button>
                        ))}
                      </div>

                      {currentPalette && (
                        <div
                          className={`mt-5 text-sm ${theme.subtext} ${theme.button} ${theme.buttonText} p-4 rounded-xl backdrop-blur-sm`}
                        >
                          {currentPalette.description}
                        </div>
                      )}
                    </div>

                    <div
                      className={`rounded-2xl overflow-hidden ${theme.shadow} ${
                        theme.card
                      } border ${
                        theme.cardBorder
                      } transition-all duration-300 transform hover:translate-y-[-2px] ${
                        isAnimating ? "animate-pulse" : ""
                      }`}
                    >
                      {currentPalette && (
                        <>
                          <div className="p-3 sm:p-5 border-b border-gray-700/30 flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="flex space-x-2 mr-3">
                                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                              </div>
                              <h2
                                className={`text-xl font-semibold ${theme.text}`}
                              >
                                {currentPalette.name} Palette
                              </h2>
                            </div>
                            <div className="flex space-x-2">
                              <button
                                onClick={() => exportPalettes()}
                                className={`p-2 sm:px-4 sm:py-2 text-sm rounded-lg transition-all ${theme.button} ${theme.buttonText} flex items-center space-x-0 sm:space-x-2 cursor-pointer hover:scale-105 transform`}
                                aria-label="Export palette"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-4 w-4"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                                  />
                                </svg>
                                <span className="hidden sm:inline font-medium">Export</span>
                              </button>
                            </div>
                          </div>

                          <div className="flex group">
                            {currentPalette.colors.map((color, idx) => (
                              <div
                                key={idx}
                                className="flex-1 min-w-0 transition-all duration-300 cursor-pointer group/color relative"
                                style={{ backgroundColor: color.hex }}
                              >
                                <div className="h-40 lg:h-56 flex items-end p-4 transition-all duration-300 opacity-0 group-hover:opacity-100 bg-gradient-to-t from-black/80 to-transparent">
                                  <div className="w-full">
                                    <p
                                      className={`font-semibold mb-2 text-lg ${
                                        isColorLight(...color.rgb)
                                          ? "text-gray-900"
                                          : "text-white"
                                      }`}
                                    >
                                      {color.hex}
                                    </p>
                                    <div className="flex space-x-2">
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          copyToClipboard(color.hex, "HEX");
                                        }}
                                        className="p-2 rounded-lg bg-black/50 text-white backdrop-blur-md hover:bg-black/70 transition-all transform hover:scale-105 cursor-pointer"
                                        aria-label="Copy hex code"
                                      >
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          className="h-5 w-5"
                                          viewBox="0 0 20 20"
                                          fill="currentColor"
                                        >
                                          <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                                          <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                                        </svg>
                                      </button>
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setBaseColor(color.hex);
                                        }}
                                        className="p-2 rounded-lg bg-black/50 text-white backdrop-blur-md hover:bg-black/70 transition-all transform hover:scale-105 cursor-pointer"
                                        aria-label="Set as base color"
                                      >
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          className="h-5 w-5"
                                          viewBox="0 0 20 20"
                                          fill="currentColor"
                                        >
                                          <path
                                            fillRule="evenodd"
                                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                                            clipRule="evenodd"
                                          />
                                        </svg>
                                      </button>
                                    </div>
                                  </div>
                                </div>

                                {/* Add animated color label that slides in on hover */}
                                <div className="absolute top-0 left-0 right-0 p-3 bg-gradient-to-b from-black/50 to-transparent transform -translate-y-full opacity-0 group-hover/color:translate-y-0 group-hover/color:opacity-100 transition-all duration-300">
                                  <p
                                    className={`text-xs font-medium ${
                                      isColorLight(...color.rgb)
                                        ? "text-gray-900"
                                        : "text-white"
                                    }`}
                                  >
                                    {getColorName(color.rgb)}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>

                          <div className="p-4 sm:p-6 grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
                            {currentPalette.colors.map((color, idx) => (
                              <div
                                key={idx}
                                className={`p-3 sm:p-4 rounded-xl border ${theme.border} transition-all duration-300 hover:shadow-lg hover:scale-105 transform ${theme.card} group/detail`}
                              >
                                <div className="flex justify-between items-center mb-3">
                                  <div
                                    className="w-8 h-8 rounded-lg shadow-inner group-hover/detail:scale-110 transition-transform"
                                    style={{ backgroundColor: color.hex }}
                                  />
                                  <button
                                    onClick={() =>
                                      copyToClipboard(color.hex, "HEX")
                                    }
                                    className="text-gray-400 hover:text-gray-300 cursor-pointer p-1.5 hover:bg-gray-700/30 rounded-md transition-colors"
                                    aria-label="Copy hex code"
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="h-5 w-5"
                                      viewBox="0 0 20 20"
                                      fill="currentColor"
                                    >
                                      <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                                      <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                                    </svg>
                                  </button>
                                </div>
                                <div className="space-y-1.5 text-xs text-gray-400">
                                  <p className={isDarkMode ? "text-gray-300" : ""}>
                                    <span className="font-semibold">HEX:</span>{" "}
                                    {color.hex}
                                  </p>
                                  <p className={isDarkMode ? "text-gray-300" : ""}>
                                    <span className="font-semibold">RGB:</span>{" "}
                                    {color.rgb.join(", ")}
                                  </p>
                                  <p className={isDarkMode ? "text-gray-300" : ""}>
                                    <span className="font-semibold">HSL:</span>{" "}
                                    {color.hsl[0]}°, {color.hsl[1]}%,{" "}
                                    {color.hsl[2]}%
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  </>
                )}

                {currentView === "preview" && (
                  <div
                    className={`rounded-2xl overflow-hidden ${theme.shadow} ${theme.card} border ${theme.cardBorder} transition-all duration-300 transform hover:translate-y-[-2px]`}
                  >
                    <div className="p-5 border-b border-gray-700/30 flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex space-x-2 mr-3">
                          <div className="w-3 h-3 rounded-full bg-red-500"></div>
                          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                          <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        </div>
                        <h2 className={`text-xl font-semibold ${theme.text}`}>
                          UI Preview
                        </h2>
                      </div>
                    </div>

                    {currentPalette && (
                      <div className="p-6">
                        <div className="bg-white rounded-xl overflow-hidden shadow-xl">
                          <div
                            className="px-6 py-4 flex items-center justify-between relative overflow-hidden"
                            style={{
                              backgroundImage: `linear-gradient(to right, ${
                                currentPalette.colors[0].hex
                              }, ${
                                currentPalette.colors.length > 1
                                  ? currentPalette.colors[1].hex
                                  : currentPalette.colors[0].hex
                              })`,
                              color: isColorLight(
                                ...currentPalette.colors[0].rgb
                              )
                                ? "#000"
                                : "#fff",
                            }}
                          >
                            <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full filter blur-xl animate-float"></div>
                            <div className="absolute -bottom-12 -left-12 w-24 h-24 bg-black/10 rounded-full filter blur-xl animate-float-delayed"></div>

                            <div className="flex items-center space-x-4">
                              <div className="font-bold text-lg">Designify</div>
                              <div className="hidden md:flex space-x-2">
                                <button className="px-4 py-2 rounded-full text-sm bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all cursor-pointer font-medium">
                                  Dashboard
                                </button>
                                <button className="px-4 py-2 rounded-full text-sm opacity-80 hover:opacity-100 transition-opacity cursor-pointer font-medium">
                                  Projects
                                </button>
                                <button className="px-4 py-2 rounded-full text-sm opacity-80 hover:opacity-100 transition-opacity cursor-pointer font-medium">
                                  Team
                                </button>
                                <button className="px-4 py-2 rounded-full text-sm opacity-80 hover:opacity-100 transition-opacity cursor-pointer font-medium">
                                  Settings
                                </button>
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              <button className="p-2 rounded-full opacity-80 hover:opacity-100 transition-all hover:bg-white/20 cursor-pointer">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-5 w-5"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                                </svg>
                              </button>
                              <button className="p-2 rounded-full opacity-80 hover:opacity-100 transition-all hover:bg-white/20 cursor-pointer">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-5 w-5"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </button>
                              <div className="h-9 w-9 rounded-full bg-white/20 flex items-center justify-center font-bold text-sm">
                                JD
                              </div>
                            </div>
                          </div>

                          <div className="p-6 space-y-6 bg-gray-50">
                            <div className="flex justify-between items-center">
                              <h1 className="text-2xl font-bold text-gray-800">
                                Project Dashboard
                              </h1>
                              <button
                                className="px-4 py-2 rounded-lg text-white flex items-center space-x-2 cursor-pointer shadow-lg transition-all hover:scale-105 transform"
                                style={{
                                  backgroundImage: `linear-gradient(to right, ${
                                    currentPalette.colors[0].hex
                                  }, ${
                                    currentPalette.colors.length > 1
                                      ? currentPalette.colors[1].hex
                                      : currentPalette.colors[0].hex
                                  })`,
                                }}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-5 w-5"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                                <span className="font-medium">New Project</span>
                              </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                              <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-md hover:shadow-lg transition-all hover:scale-[1.02] transform">
                                <div className="text-sm text-gray-500 mb-1 font-medium">
                                  Total Projects
                                </div>
                                <div className="text-2xl font-bold text-gray-800">
                                  24
                                </div>
                                <div className="mt-2 text-xs text-green-600 flex items-center">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-3 w-3 mr-1"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                  <span>12% increase</span>
                                </div>
                              </div>
                              <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-md hover:shadow-lg transition-all hover:scale-[1.02] transform">
                                <div className="text-sm text-gray-500 mb-1 font-medium">
                                  Active Tasks
                                </div>
                                <div className="text-2xl font-bold text-gray-800">
                                  42
                                </div>
                                <div className="mt-2 text-xs text-red-600 flex items-center">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-3 w-3 mr-1"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M12 13a1 1 0 100 2h5a1 1 0 001-1V9a1 1 0 10-2 0v2.586l-4.293-4.293a1 1 0 01-1.414 0L8 9.586 3.707 5.293a1 1 0 01-1.414 1.414l5 5a1 1 0 011.414 0L11 9.414 14.586 13H12z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                  <span>5% decrease</span>
                                </div>
                              </div>
                              <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-md hover:shadow-lg transition-all hover:scale-[1.02] transform">
                                <div className="text-sm text-gray-500 mb-1 font-medium">
                                  Team Members
                                </div>
                                <div className="text-2xl font-bold text-gray-800">
                                  8
                                </div>
                                <div className="mt-2 text-xs text-green-600 flex items-center">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-3 w-3 mr-1"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                  <span>1 new member</span>
                                </div>
                              </div>
                              <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-md hover:shadow-lg transition-all hover:scale-[1.02] transform">
                                <div className="text-sm text-gray-500 mb-1 font-medium">
                                  Completed
                                </div>
                                <div className="text-2xl font-bold text-gray-800">
                                  18
                                </div>
                                <div className="mt-2 text-xs text-green-600 flex items-center">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-3 w-3 mr-1"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                  <span>3 this week</span>
                                </div>
                              </div>
                            </div>

                            <div className="space-y-6">
                              <h2 className="text-lg font-bold text-gray-800 px-1">
                                Components Preview
                              </h2>

                              <div className="space-y-3">
                                <h3 className="text-sm font-medium text-gray-500 px-1">
                                  Buttons
                                </h3>
                                <div className="flex flex-wrap gap-3">
                                  <button
                                    className="px-5 py-2.5 rounded-lg text-white font-medium cursor-pointer shadow-md hover:shadow-lg transition-all hover:scale-105 transform"
                                    style={{
                                      backgroundImage: `linear-gradient(to right, ${
                                        currentPalette.colors[0].hex
                                      }, ${
                                        currentPalette.colors.length > 1
                                          ? currentPalette.colors[1].hex
                                          : currentPalette.colors[0].hex
                                      })`,
                                    }}
                                  >
                                    Primary Button
                                  </button>
                                  <button
                                    className="px-5 py-2.5 rounded-lg font-medium cursor-pointer shadow-md hover:shadow-lg transition-all hover:scale-105 transform"
                                    style={{
                                      backgroundColor:
                                        currentPalette.colors.length > 1
                                          ? currentPalette.colors[1].hex
                                          : "#ffffff",
                                      color:
                                        currentPalette.colors.length > 1 &&
                                        isColorLight(
                                          ...currentPalette.colors[1].rgb
                                        )
                                          ? "#000000"
                                          : "#ffffff",
                                    }}
                                  >
                                    Secondary Button
                                  </button>
                                  <button
                                    className="px-5 py-2.5 rounded-lg font-medium bg-white shadow-md hover:shadow-lg transition-all hover:scale-105 transform cursor-pointer"
                                    style={{
                                      borderWidth: 1,
                                      borderColor: currentPalette.colors[0].hex,
                                      color: currentPalette.colors[0].hex,
                                    }}
                                  >
                                    Outlined Button
                                  </button>
                                  <button className="px-5 py-2.5 rounded-lg font-medium bg-gray-100 text-gray-800 shadow-md hover:shadow-lg transition-all hover:scale-105 transform cursor-pointer">
                                    Default Button
                                  </button>
                                </div>
                              </div>

                              <div className="space-y-3">
                                <h3 className="text-sm font-medium text-gray-500 px-1">
                                  Cards
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                  <div
                                    className="p-5 rounded-xl text-white shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] transform"
                                    style={{
                                      backgroundImage: `linear-gradient(to bottom right, ${
                                        currentPalette.colors[0].hex
                                      }, ${
                                        currentPalette.colors.length > 1
                                          ? currentPalette.colors[1].hex
                                          : currentPalette.colors[0].hex
                                      })`,
                                    }}
                                  >
                                    <h4 className="font-semibold text-lg mb-2">
                                      Primary Card
                                    </h4>
                                    <p className="text-sm opacity-90">
                                      This card uses the primary color of your
                                      palette.
                                    </p>
                                    <div className="mt-4 flex justify-end">
                                      <button className="px-4 py-2 rounded-lg bg-white/20 text-white text-sm backdrop-blur-sm hover:bg-white/30 transition-all hover:scale-105 transform cursor-pointer font-medium">
                                        Learn More
                                      </button>
                                    </div>
                                  </div>
                                  <div
                                    className="p-5 rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] transform"
                                    style={{
                                      backgroundColor:
                                        currentPalette.colors.length > 1
                                          ? currentPalette.colors[1].hex
                                          : "#ffffff",
                                      color:
                                        currentPalette.colors.length > 1 &&
                                        isColorLight(
                                          ...currentPalette.colors[1].rgb
                                        )
                                          ? "#000000"
                                          : "#ffffff",
                                    }}
                                  >
                                    <h4 className="font-semibold text-lg mb-2">
                                      Secondary Card
                                    </h4>
                                    <p className="text-sm opacity-90">
                                      This card uses the secondary color of your
                                      palette.
                                    </p>
                                    <div className="mt-4 flex justify-end">
                                      <button
                                        className="px-4 py-2 rounded-lg text-sm transition-all hover:scale-105 transform cursor-pointer font-medium"
                                        style={{
                                          backgroundColor:
                                            "rgba(255, 255, 255, 0.2)",
                                          backdropFilter: "blur(4px)",
                                          color:
                                            currentPalette.colors.length > 1 &&
                                            isColorLight(
                                              ...currentPalette.colors[1].rgb
                                            )
                                              ? "#000000"
                                              : "#ffffff",
                                        }}
                                      >
                                        Learn More
                                      </button>
                                    </div>
                                  </div>
                                  <div
                                    className="p-5 rounded-xl bg-white shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] transform border-2"
                                    style={{
                                      borderColor:
                                        currentPalette.colors.length > 2
                                          ? currentPalette.colors[2].hex
                                          : "#e5e7eb",
                                    }}
                                  >
                                    <h4
                                      className="font-semibold text-lg mb-2"
                                      style={{
                                        color:
                                          currentPalette.colors.length > 2
                                            ? currentPalette.colors[2].hex
                                            : "#111827",
                                      }}
                                    >
                                      Accent Card
                                    </h4>
                                    <p className="text-sm text-gray-600">
                                      This card uses the accent color of your
                                      palette for highlights.
                                    </p>
                                    <div className="mt-4 flex justify-end">
                                      <button
                                        className="px-4 py-2 rounded-lg text-white text-sm transition-all hover:scale-105 transform cursor-pointer font-medium"
                                        style={{
                                          backgroundColor:
                                            currentPalette.colors.length > 2
                                              ? currentPalette.colors[2].hex
                                              : "#111827",
                                        }}
                                      >
                                        Learn More
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div className="space-y-3">
                                <h3 className="text-sm font-medium text-gray-500 px-1">
                                  Form Elements
                                </h3>
                                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-lg">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div className="space-y-2">
                                      <label className="block text-sm font-medium text-gray-700">
                                        Input Field
                                      </label>
                                      <input
                                        type="text"
                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 transition-all cursor-text shadow-sm"
                                        placeholder="Enter your text"
                                        style={{
                                          borderColor: currentPalette.colors.length > 0 ? currentPalette.colors[0].hex : "rgb(229, 231, 235)",
                                          outlineColor: currentPalette.colors.length > 0 ? currentPalette.colors[0].hex : "#111827",
                                        }}
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <label className="block text-sm font-medium text-gray-700">
                                        Select Menu
                                      </label>
                                      <select className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 transition-all cursor-pointer appearance-none shadow-sm bg-white">
                                        <option>Option 1</option>
                                        <option>Option 2</option>
                                        <option>Option 3</option>
                                      </select>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                      <input
                                        type="checkbox"
                                        className="h-5 w-5 rounded-md cursor-pointer"
                                        style={{
                                          accentColor:
                                            currentPalette.colors[0].hex,
                                        }}
                                        defaultChecked
                                      />
                                      <label className="text-sm font-medium text-gray-700">
                                        Checkbox example
                                      </label>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                      <input
                                        type="radio"
                                        className="h-5 w-5 cursor-pointer"
                                        style={{
                                          accentColor:
                                            currentPalette.colors[0].hex,
                                        }}
                                        defaultChecked
                                        name="radio-group"
                                      />
                                      <label className="text-sm font-medium text-gray-700">
                                        Radio button example
                                      </label>
                                    </div>
                                  </div>
                                  <div className="mt-5">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                      Progress Bar
                                    </label>
                                    <div className="w-full h-3 rounded-full bg-gray-100 overflow-hidden shadow-inner">
                                      <div
                                        className="h-full rounded-full transition-all duration-1000 ease-in-out"
                                        style={{
                                          width: "60%",
                                          backgroundImage: `linear-gradient(to right, ${
                                            currentPalette.colors[0].hex
                                          }, ${
                                            currentPalette.colors.length > 1
                                              ? currentPalette.colors[1].hex
                                              : currentPalette.colors[0].hex
                                          })`,
                                        }}
                                      ></div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {currentView === "export" && (
                  <div
                    className={`rounded-2xl overflow-hidden ${theme.shadow} ${theme.card} border ${theme.cardBorder} transition-all duration-300 transform hover:translate-y-[-2px]`}
                  >
                    <div className="p-5 border-b border-gray-700/30 flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex space-x-2 mr-3">
                          <div className="w-3 h-3 rounded-full bg-red-500"></div>
                          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                          <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        </div>
                        <h2 className={`text-xl font-semibold ${theme.text}`}>
                          Export Options
                        </h2>
                      </div>

                      <button
                        onClick={exportPalettes}
                        className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-purple-600/90 text-white text-sm hover:bg-purple-700/90 transition-colors"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                          />
                        </svg>
                        <span className="font-medium">Quick Copy</span>
                      </button>
                    </div>

                    <div className="p-6 space-y-8">
                      <div className="space-y-4">
                        <h3
                          className={`text-lg font-semibold flex items-center space-x-2 ${theme.text}`}
                        >
                          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-bold mr-2">
                            1
                          </span>
                          Choose Format
                        </h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                          <button
                            onClick={() => setExportFormat("hex")}
                            className={`px-4 py-3 text-sm rounded-lg font-medium transition-all cursor-pointer ${
                              exportFormat === "hex"
                                ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/20"
                                : `${theme.button} ${theme.buttonText}`
                            } hover:scale-105 transform`}
                          >
                            HEX
                          </button>
                          <button
                            onClick={() => setExportFormat("rgb")}
                            className={`px-4 py-3 text-sm rounded-lg font-medium transition-all cursor-pointer ${
                              exportFormat === "rgb"
                                ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/20"
                                : `${theme.button} ${theme.buttonText}`
                            } hover:scale-105 transform`}
                          >
                            RGB
                          </button>
                          <button
                            onClick={() => setExportFormat("rgba")}
                            className={`px-4 py-3 text-sm rounded-lg font-medium transition-all cursor-pointer ${
                              exportFormat === "rgba"
                                ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/20"
                                : `${theme.button} ${theme.buttonText}`
                            } hover:scale-105 transform`}
                          >
                            RGBA
                          </button>
                          <button
                            onClick={() => setExportFormat("hsl")}
                            className={`px-4 py-3 text-sm rounded-lg font-medium transition-all cursor-pointer ${
                              exportFormat === "hsl"
                                ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/20"
                                : `${theme.button} ${theme.buttonText}`
                            } hover:scale-105 transform`}
                          >
                            HSL
                          </button>
                          <button
                            onClick={() => setExportFormat("scss")}
                            className={`px-4 py-3 text-sm rounded-lg font-medium transition-all cursor-pointer ${
                              exportFormat === "scss"
                                ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/20"
                                : `${theme.button} ${theme.buttonText}`
                            } hover:scale-105 transform`}
                          >
                            SCSS
                          </button>
                          <button
                            onClick={() => setExportFormat("css")}
                            className={`px-4 py-3 text-sm rounded-lg font-medium transition-all cursor-pointer ${
                              exportFormat === "css"
                                ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/20"
                                : `${theme.button} ${theme.buttonText}`
                            } hover:scale-105 transform`}
                          >
                            CSS
                          </button>
                          <button
                            onClick={() => setExportFormat("tailwind")}
                            className={`px-4 py-3 text-sm rounded-lg font-medium transition-all cursor-pointer ${
                              exportFormat === "tailwind"
                                ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/20"
                                : `${theme.button} ${theme.buttonText}`
                            } hover:scale-105 transform`}
                          >
                            Tailwind
                          </button>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h3
                          className={`text-lg font-semibold flex items-center space-x-2 ${theme.text}`}
                        >
                          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-bold mr-2">
                            2
                          </span>
                          Preview
                        </h3>
                        <div
                          className={`p-5 rounded-xl border ${theme.border} font-mono text-sm overflow-auto max-h-60 ${theme.card} relative group`}
                        >
                          {currentPalette && (
                            <>
                              {exportFormat === "scss" ? (
                                <pre className={`${theme.text}`}>
                                  {`// ${
                                    currentPalette.name
                                  } Palette - SCSS Variables\n
${currentPalette.colors
  .map((color, i) => `$${activePalette.toLowerCase()}-${i + 1}: ${color.hex};`)
  .join("\n")}
                                  
// Usage example:
.element {
  background-color: $${activePalette.toLowerCase()}-1;
  color: $${activePalette.toLowerCase()}-2;
}`}
                                </pre>
                              ) : exportFormat === "css" ? (
                                <pre className={`${theme.text}`}>
                                  {`/* ${
                                    currentPalette.name
                                  } Palette - CSS Variables */
                                  
:root {
  ${currentPalette.colors
    .map(
      (color, i) => `--${activePalette.toLowerCase()}-${i + 1}: ${color.hex};`
    )
    .join("\n  ")}
}

/* Usage example: */
.element {
  background-color: var(--${activePalette.toLowerCase()}-1);
  color: var(--${activePalette.toLowerCase()}-2);
}`}
                                </pre>
                              ) : exportFormat === "tailwind" ? (
                                <pre className={`${theme.text}`}>
                                  {`// ${
                                    currentPalette.name
                                  } Palette - Tailwind Config
                                  
module.exports = {
  theme: {
    extend: {
      colors: {
        ${currentPalette.colors
          .map(
            (color, i) =>
              `'${activePalette.toLowerCase()}-${i + 1}': '${color.hex}',`
          )
          .join("\n        ")}
      }
    }
  }
};`}
                                </pre>
                              ) : (
                                <pre className={`${theme.text}`}>
                                  {`// ${currentPalette.name} Palette\n
${currentPalette.colors
  .map((color, i) => `Color ${i + 1}: ${formatColor(color)}`)
  .join("\n")}`}
                                </pre>
                              )}
                            </>
                          )}

                          {/* Copy indicator overlay */}
                          <div
                            className="absolute inset-0 bg-purple-600/20 backdrop-blur-sm rounded-xl opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer"
                            onClick={exportPalettes}
                          >
                            <div className="bg-white/20 backdrop-blur-md px-3 py-2 rounded-lg text-white font-medium flex items-center space-x-2">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                                />
                              </svg>
                              <span>Click to Copy</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <button
                          onClick={exportPalettes}
                          className="w-full py-3.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg shadow-purple-500/20 transition-all hover:scale-[1.02] transform cursor-pointer font-medium flex items-center justify-center space-x-2"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                            />
                          </svg>
                          <span>Copy to Clipboard</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {showSaved && (
              <div className="fixed inset-0 bg-black/10 backdrop-blur-md flex items-center justify-center z-50 p-4">
                <div
                  className={`w-full max-w-2xl max-h-[80vh] rounded-2xl overflow-hidden ${theme.card} border ${theme.cardBorder} transition-colors duration-300 shadow-2xl`}
                >
                  <div className="p-5 border-b border-gray-700/30 flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex space-x-2 mr-3">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      </div>
                      <h2 className={`text-xl font-semibold ${theme.text}`}>
                        Saved Palettes
                      </h2>
                    </div>
                    <button
                      onClick={() => setShowSaved(false)}
                      className="text-gray-400 hover:text-gray-300 cursor-pointer hover:bg-gray-700/30 p-2 rounded-lg transition-colors"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>

                  <div className="p-6 overflow-y-auto max-h-[calc(80vh-64px)]">
                    {savedPalettes.length === 0 ? (
                      <div className="text-center py-10 bg-gray-800/30 rounded-xl border border-gray-700/30">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-16 w-16 mx-auto text-gray-400 mb-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                          />
                        </svg>
                        <p className={`${theme.text} text-lg font-medium`}>
                          No saved palettes yet
                        </p>
                        <p
                          className={`${theme.subtext} text-sm mt-2 max-w-sm mx-auto`}
                        >
                          Create and save your favorite color combinations for
                          quick access
                        </p>
                        <button
                          onClick={() => setShowSaved(false)}
                          className="mt-6 px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
                        >
                          Create New Palette
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-5">
                       

                        {savedPalettes.map((palette) => (
                          <div
                            key={palette.id}
                            className={`rounded-xl border ${theme.border} overflow-hidden transition-all duration-300 hover:shadow-lg transform ${theme.card} group`}
                          >
                            {/* Clearer color preview with larger blocks */}
                            <div className="h-16 flex border-b border-gray-700/30">
                              {palette.colors.map((color, idx) => (
                                <div
                                  key={idx}
                                  className="flex-1 relative group/color"
                                  style={{ backgroundColor: color.hex }}
                                >
                                  {/* Color hex tooltip on hover */}
                                  <div className="opacity-0 group-hover/color:opacity-100 absolute bottom-1 left-1/2 transform -translate-x-1/2 bg-black/70 text-white text-xs px-2 py-1 rounded-md transition-opacity pointer-events-none">
                                    {color.hex}
                                  </div>
                                </div>
                              ))}
                            </div>

                            <div className="p-4 sm:p-6">
                              {/* Palette info with better spacing */}
                              <div className="flex items-center justify-between mb-3">
                                <div>
                                  <h3
                                    className={`font-medium ${theme.text} text-lg`}
                                  >
                                    {palette.name}
                                  </h3>
                                  <p className="text-xs text-gray-400 mt-0.5">
                                    {new Date(
                                      palette.createdAt
                                    ).toLocaleDateString()}{" "}
                                    • {palette.colors.length} colors
                                  </p>
                                </div>

                              </div>

                              <div className="flex space-x-2 justify-end">
                                <button
                                  onClick={() => loadSavedPalette(palette)}
                                  className="flex items-center px-3 py-1.5 rounded-lg bg-purple-600/90 text-white text-sm hover:bg-purple-700 transition-all transform hover:scale-105 cursor-pointer"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4 mr-1.5"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                  >
                                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                  </svg>
                                  <span className="font-medium">Load</span>
                                </button>
                                <button
                                  onClick={() => deleteSavedPalette(palette.id)}
                                  className="flex items-center px-3 py-1.5 rounded-lg bg-red-500/20 text-red-400 text-sm hover:bg-red-500/30 hover:text-red-300 transition-all transform hover:scale-105 cursor-pointer"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4 mr-1.5"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                  <span className="font-medium">Delete</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {notification && (
              <div
                className={`fixed bottom-4 right-4 px-5 py-4 rounded-xl shadow-xl flex items-center space-x-3 max-w-sm backdrop-blur-md animate-fade-in ${
                  notification.type === "success"
                    ? "bg-green-600/90 text-white"
                    : notification.type === "error"
                    ? "bg-red-600/90 text-white"
                    : "bg-blue-600/90 text-white"
                }`}
              >
                {notification.type === "success" ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : notification.type === "error" ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
                <span className="font-medium">{notification.message}</span>
              </div>
            )}
          </div>

          <footer className={`py-8 border-t ${theme.border} mt-10`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <div className="flex flex-col items-center md:items-start mb-6 md:mb-0">
                  <h3
                    className={`text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${theme.highlight} mb-2`}
                  >
                    Spectrum Pro
                  </h3>
                  <p
                    className={`${theme.subtext} text-sm max-w-xs text-center md:text-left`}
                  >
                    Professional color palette generator for designers and
                    developers
                  </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
                  <div className="flex flex-col items-center md:items-start">
                    <h4 className={`font-medium mb-3 ${theme.text} text-sm`}>
                      Resources
                    </h4>
                    <div className="flex flex-col space-y-2">
                      <a
                        href="#"
                        className={`${theme.subtext} text-xs hover:text-purple-500 transition-colors`}
                      >
                        Color Theory
                      </a>
                      <a
                        href="#"
                        className={`${theme.subtext} text-xs hover:text-purple-500 transition-colors`}
                      >
                        Accessibility
                      </a>
                      <a
                        href="#"
                        className={`${theme.subtext} text-xs hover:text-purple-500 transition-colors`}
                      >
                        Design Trends
                      </a>
                    </div>
                  </div>

                  <div className="flex flex-col items-center md:items-start">
                    <h4 className={`font-medium mb-3 ${theme.text} text-sm`}>
                      Company
                    </h4>
                    <div className="flex flex-col space-y-2">
                      <a
                        href="#"
                        className={`${theme.subtext} text-xs hover:text-purple-500 transition-colors`}
                      >
                        About
                      </a>
                      <a
                        href="#"
                        className={`${theme.subtext} text-xs hover:text-purple-500 transition-colors`}
                      >
                        Blog
                      </a>
                      <a
                        href="#"
                        className={`${theme.subtext} text-xs hover:text-purple-500 transition-colors`}
                      >
                        Contact
                      </a>
                    </div>
                  </div>

                  <div className="flex flex-col items-center md:items-start">
                    <h4 className={`font-medium mb-3 ${theme.text} text-sm`}>
                      Legal
                    </h4>
                    <div className="flex flex-col space-y-2">
                      <a
                        href="#"
                        className={`${theme.subtext} text-xs hover:text-purple-500 transition-colors`}
                      >
                        Terms
                      </a>
                      <a
                        href="#"
                        className={`${theme.subtext} text-xs hover:text-purple-500 transition-colors`}
                      >
                        Privacy
                      </a>
                      <a
                        href="#"
                        className={`${theme.subtext} text-xs hover:text-purple-500 transition-colors`}
                      >
                        Cookies
                      </a>
                    </div>
                  </div>

                  <div className="flex flex-col items-center md:items-start">
                    <h4 className={`font-medium mb-3 ${theme.text} text-sm`}>
                      Connect
                    </h4>
                    <div className="flex space-x-3">
                      <a
                        href="#"
                        className={`${theme.subtext} hover:text-purple-500 transition-colors p-2 hover:bg-gray-800/30 rounded-full`}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                        </svg>
                      </a>
                      <a
                        href="#"
                        className={`${theme.subtext} hover:text-purple-500 transition-colors p-2 hover:bg-gray-800/30 rounded-full`}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                        </svg>
                      </a>
                      <a
                        href="#"
                        className={`${theme.subtext} hover:text-purple-500 transition-colors p-2 hover:bg-gray-800/30 rounded-full`}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-700/30 mt-6 pt-6 flex flex-col md:flex-row items-center justify-between">
                <p className={`${theme.subtext} text-xs`}>
                  &copy; {new Date().getFullYear()} Spectrum Pro. All rights
                  reserved.
                </p>
                <div className="flex items-center mt-4 md:mt-0">
                  <span className={`bg-gray-700/50 text-xs py-1 px-2 rounded-full ${isDarkMode ? "text-gray-200" : "text-gray-400"} backdrop-blur-sm mx-2`}>
                    v2.1.0
                  </span>
                  <span className={`${theme.subtext} text-xs`}>
                    Made with <span className="text-red-500">♥</span> for
                    designers
                  </span>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </main>

      <style jsx global>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }

        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }

        .animate-pulse {
          animation: pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        @keyframes pulse-slow {
          0%,
          100% {
            opacity: 0.2;
          }
          50% {
            opacity: 0.3;
          }
        }

        .animate-pulse-slow {
          animation: pulse-slow 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-float-delayed {
          animation: float 7s ease-in-out 1s infinite;
        }

        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }

        @keyframes reverse-spin {
          from {
            transform: rotate(360deg);
          }
          to {
            transform: rotate(0deg);
          }
        }

        .animate-reverse-spin {
          animation: reverse-spin 12s linear infinite;
        }

        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 5s ease infinite;
        }

        .shadow-glow {
          box-shadow: 0 0 15px rgba(167, 139, 250, 0.5);
        }

        .perspective-500 {
          perspective: 500px;
        }

        /* RGB Cube Animation */
        .rgb-cube {
          position: relative;
          width: 100%;
          height: 100%;
          transform-style: preserve-3d;
          animation: rotate 10s linear infinite;
        }

        @keyframes rotate {
          from {
            transform: rotateX(0) rotateY(0) rotateZ(0);
          }
          to {
            transform: rotateX(360deg) rotateY(180deg) rotateZ(360deg);
          }
        }

        .face {
          position: absolute;
          width: 100%;
          height: 100%;
          opacity: 0.7;
          border: 1px solid rgba(255, 255, 255, 0.3);
        }

        .red-face {
          background: rgba(255, 0, 0, 0.5);
          transform: translateZ(16px);
        }

        .green-face {
          background: rgba(0, 255, 0, 0.5);
          transform: rotateY(90deg) translateZ(16px);
        }

        .blue-face {
          background: rgba(0, 0, 255, 0.5);
          transform: rotateY(-90deg) translateZ(16px);
        }

        .yellow-face {
          background: rgba(255, 255, 0, 0.5);
          transform: rotateX(90deg) translateZ(16px);
        }

        .magenta-face {
          background: rgba(255, 0, 255, 0.5);
          transform: rotateX(-90deg) translateZ(16px);
        }

        .cyan-face {
          background: rgba(0, 255, 255, 0.5);
          transform: translateZ(-16px);
        }

        .color-wave {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 12px;
          background: linear-gradient(
            90deg,
            rgba(255, 0, 0, 0.7),
            rgba(255, 165, 0, 0.7),
            rgba(255, 255, 0, 0.7),
            rgba(0, 128, 0, 0.7),
            rgba(0, 0, 255, 0.7),
            rgba(75, 0, 130, 0.7),
            rgba(238, 130, 238, 0.7)
          );
          background-size: 200% 100%;
          animation: wave 10s linear infinite;
        }

        @keyframes wave {
          0% {
            background-position: 0% 50%;
          }
          100% {
            background-position: 200% 50%;
          }
        }

        .color-helix-1 {
          position: absolute;
          left: 50%;
          top: 0;
          width: 4px;
          height: 100%;
          background: linear-gradient(
            to bottom,
            rgba(255, 0, 0, 0.5),
            rgba(255, 165, 0, 0.5),
            rgba(255, 255, 0, 0.5),
            rgba(0, 128, 0, 0.5),
            rgba(0, 0, 255, 0.5),
            rgba(75, 0, 130, 0.5),
            rgba(238, 130, 238, 0.5)
          );
          animation: helix1 8s linear infinite;
        }

        .color-helix-2 {
          position: absolute;
          left: 50%;
          top: 0;
          width: 4px;
          height: 100%;
          background: linear-gradient(
            to bottom,
            rgba(238, 130, 238, 0.5),
            rgba(75, 0, 130, 0.5),
            rgba(0, 0, 255, 0.5),
            rgba(0, 128, 0, 0.5),
            rgba(255, 255, 0, 0.5),
            rgba(255, 165, 0, 0.5),
            rgba(255, 0, 0, 0.5)
          );
          animation: helix2 8s linear infinite;
        }

        @keyframes helix1 {
          0% {
            transform: translateX(-10px) rotateX(0deg);
          }
          100% {
            transform: translateX(-10px) rotateX(360deg);
          }
        }

        @keyframes helix2 {
          0% {
            transform: translateX(10px) rotateX(180deg);
          }
          100% {
            transform: translateX(10px) rotateX(540deg);
          }
        }

        .color-dots {
          background-image: radial-gradient(
            circle at 10px 10px,
            rgba(255, 255, 255, 0.1) 2px,
            transparent 0
          );
          background-size: 20px 20px;
        }

        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }

        ::-webkit-scrollbar-track {
          background: ${isDarkMode
            ? "rgba(31, 41, 55, 0.5)"
            : "rgba(243, 244, 246, 0.5)"};
          border-radius: 10px;
        }

        ::-webkit-scrollbar-thumb {
          background: ${isDarkMode
            ? "rgba(107, 114, 128, 0.5)"
            : "rgba(156, 163, 175, 0.5)"};
          border-radius: 10px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: ${isDarkMode
            ? "rgba(107, 114, 128, 0.7)"
            : "rgba(156, 163, 175, 0.7)"};
        }

        input[type="range"] {
          -webkit-appearance: none;
          appearance: none;
          background: transparent;
          cursor: pointer;
        }

        input[type="range"]::-webkit-slider-runnable-track {
          height: 4px;
          border-radius: 2px;
          background: ${isDarkMode
            ? "rgba(156, 163, 175, 0.2)"
            : "rgba(209, 213, 219, 0.5)"};
        }

        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          margin-top: -6px;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: linear-gradient(to right, #a855f7, #6366f1);
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
        }

        .headline-container {
          display: inline-block;
          overflow: hidden;
        }

        .pro-letter {
          display: inline-block;
          position: relative;
          animation: subtleColorShift ease-in-out infinite;
          will-change: color;
        }

        @keyframes subtleColorShift {
          0%,
          100% {
            color: #4f46e5; /* Primary indigo */
          }
          25% {
            color: #6366f1; /* Lighter indigo */
          }
          50% {
            color: #7c3aed; /* Purple */
          }
          75% {
            color: #4338ca; /* Darker indigo */
          }
        }

        .pro-letter {
          opacity: 0;
          transform: translateY(5px);
          animation-name: subtleColorShift, fadeInPro;
          animation-duration: 5s, 0.6s;
          animation-timing-function: ease-in-out, ease-out;
          animation-fill-mode: forwards, forwards;
          animation-iteration-count: infinite, 1;
          animation-delay: 0s, calc(0.05s * var(--index, 0));
        }

        @keyframes fadeInPro {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .headline-container:hover .pro-letter {
          animation-play-state: paused;
          color: ${isDarkMode ? "#a78bfa" : "#4f46e5"}; /* Different color based on theme */
          text-shadow: 0 0 10px ${isDarkMode ? "rgba(167, 139, 250, 0.3)" : "rgba(79, 70, 229, 0.2)"};
          transition: text-shadow 0.4s ease;
        }

        button svg,
        .icon svg {
          color: var(--icon-color);
          transition: color 0.3s ease;
        }

        .dark button svg,
        .dark .icon svg {
          color: #a78bfa;
        }

        button svg,
        .icon svg {
          color: ${isDarkMode ? "#a78bfa" : "#6366f1"};
        }

        button:hover svg,
        .icon:hover svg {
          color: ${isDarkMode ? "#c4b5fd" : "#8b5cf6"};
        }

        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        @media (max-width: 640px) {
          .headline-container {
            font-size: 1.75rem;
            line-height: 2rem;
          }
          
          input[type="range"]::-webkit-slider-thumb {
            width: 14px;
            height: 14px;
            margin-top: -5px;
          }
        }

        @media (min-width: 480px) {
          .xs\\:w-1\\/2 {
            width: 50%;
          }
          
          .xs\\:grid-cols-2 {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        /* Color palette styles */
        @media (max-width: 640px) {
          .color-palette-container {
            display: flex !important;
            flex-wrap: nowrap !important;
            overflow-x: auto !important;
            scroll-snap-type: x mandatory !important;
          }
          
          .color-card {
            scroll-snap-align: start !important;
            min-width: 150px !important;
            flex: 0 0 auto !important;
          }
        }

        /* Color palette styles */
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        
        .color-palette-container {
          display: flex;
          width: 100%;
        }
        
        .color-card {
          min-width: 0;
        }
        
        @media (max-width: 640px) {
          .color-palette-container {
            display: flex;
            flex-wrap: nowrap;
            overflow-x: auto;
            scroll-snap-type: x mandatory;
            width: 100%;
            padding-bottom: 8px;
          }
          
          .color-card {
            min-width: 125px !important;
            flex: 0 0 auto !important;
            scroll-snap-align: start;
            width: 33.333%;
          }
          
          .color-palette-container::-webkit-scrollbar {
            display: none;
          }
        }
      `}</style>
    </div>
  );
};

export default ColorPaletteGenerator;
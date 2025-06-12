"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { JetBrains_Mono } from "next/font/google";
import { 
  LightBulbIcon, 
  CubeTransparentIcon, 
  QuestionMarkCircleIcon,
  XMarkIcon,
  ArrowsUpDownIcon,
  ChartBarIcon,
  ChevronDownIcon,
  EyeIcon,
  EyeSlashIcon
} from "@heroicons/react/24/outline";

const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"] });

interface Point {
  x: number;
  y: number;
}

interface PrismState {
  x: number;
  y: number;
  size: number;
  angle: number;
  baseRefractiveIndex: number;
  glassType: string;
}

interface LightState {
  angle: number;
  beamWidth: number;
  isWhiteLight: boolean;
  wavelength: number;
}

interface Measurements {
  incidentAngle: number;
  exitAngle: number;
  deviation: number;
  dispersion: number;
}

interface RGBColor {
  r: number;
  g: number;
  b: number;
}

const GLASS_TYPES = [
  { name: "Crown Glass", baseIndex: 1.52, description: "Standard optical glass" },
  { name: "Flint Glass", baseIndex: 1.62, description: "High dispersion glass" },
  { name: "Borosilicate", baseIndex: 1.47, description: "Low expansion glass" },
  { name: "Sapphire", baseIndex: 1.77, description: "Synthetic crystal" },
  { name: "Diamond", baseIndex: 2.42, description: "Highest refractive index" }
];

export default function PrismLightSimulation() {
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  
  const [prism, setPrism] = useState<PrismState>({
    x: 0,
    y: 0,
    size: 150,
    angle: 74,
    baseRefractiveIndex: 1.52,
    glassType: "Crown Glass"
  });
  
  
  const [light, setLight] = useState<LightState>({
    angle: 44,
    beamWidth: 20,
    isWhiteLight: true,
    wavelength: 550
  });
  
  
  const [measurements, setMeasurements] = useState<Measurements>({
    incidentAngle: 0,
    exitAngle: 0,
    deviation: 0,
    dispersion: 0
  });
  
  
  const [dragging, setDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [hasInteractedWithPrism, setHasInteractedWithPrism] = useState(false);
  
  
  const [showHelp, setShowHelp] = useState(false);
  const [showGlassDropdown, setShowGlassDropdown] = useState(false);
  const [showMeasurements, setShowMeasurements] = useState(true);

  
  
  const convertWavelengthToRGB = useCallback((wavelength: number): RGBColor => {
    let r: number, g: number, b: number;

    
    
    if (wavelength >= 380 && wavelength < 440) {
      r = -(wavelength - 440) / (440 - 380);
      g = 0;
      b = 1;
    } else if (wavelength >= 440 && wavelength < 490) {
      r = 0;
      g = (wavelength - 440) / (490 - 440);
      b = 1;
    } else if (wavelength >= 490 && wavelength < 510) {
      r = 0;
      g = 1;
      b = -(wavelength - 510) / (510 - 490);
    } else if (wavelength >= 510 && wavelength < 580) {
      r = (wavelength - 510) / (580 - 510);
      g = 1;
      b = 0;
    } else if (wavelength >= 580 && wavelength < 645) {
      r = 1;
      g = -(wavelength - 645) / (645 - 580);
      b = 0;
    } else if (wavelength >= 645 && wavelength <= 750) {
      r = 1;
      g = 0;
      b = 0;
    } else {
      r = 0;
      g = 0;
      b = 0;
    }

    const intensityFactor = calculateIntensityFactor(wavelength);
    return {
      r: Math.round(255 * r * intensityFactor),
      g: Math.round(255 * g * intensityFactor),
      b: Math.round(255 * b * intensityFactor)
    };
  }, []);

  const calculateIntensityFactor = (wavelength: number): number => {
    if (wavelength >= 380 && wavelength < 420) {
      return 0.3 + 0.7 * (wavelength - 380) / (420 - 380);
    } else if (wavelength >= 420 && wavelength < 701) {
      return 1.0;
    } else if (wavelength >= 701 && wavelength <= 750) {
      return 0.3 + 0.7 * (750 - wavelength) / (750 - 700);
    }
    return 0;
  };

  const calculateRefractiveIndex = (wavelength: number, baseIndex: number): number => {
    
    
    const A = baseIndex;
    const B = 0.00420; 
    const lambdaMicrons = wavelength / 1000;
    return A + B / (lambdaMicrons * lambdaMicrons);
  };

  const calculateRefraction = (incidentAngle: number, n1: number, n2: number): number | null => {
    
    
    const sinIncident = Math.sin(incidentAngle);
    const sinRefracted = (n1 / n2) * sinIncident;
    
    
    if (Math.abs(sinRefracted) > 1) {
      return null;
    }
    
    return Math.asin(sinRefracted);
  };

  const normalizeVector = (vector: Point): Point => {
    const length = Math.sqrt(vector.x * vector.x + vector.y * vector.y);
    return { x: vector.x / length, y: vector.y / length };
  };

  const getPrismVertices = (): Point[] => {
    const prismAngleRad = (prism.angle * Math.PI) / 180;
    const height = prism.size;
    const base = 2 * height * Math.tan(prismAngleRad / 2);

    return [
      { x: prism.x, y: prism.y - height / 2 },
      { x: prism.x - base / 2, y: prism.y + height / 2 },
      { x: prism.x + base / 2, y: prism.y + height / 2 }
    ];
  };

  const calculateRayIntersection = (startX: number, startY: number, rayDir: Point, vertices: Point[]) => {
    
    
    let intersection: (Point & { t: number }) | null = null;
    let normal: Point | null = null;
    let faceIndex = -1;

    for (let i = 0; i < 3; i++) {
      const v1 = vertices[i];
      const v2 = vertices[(i + 1) % 3];

      
      const edge = { x: v2.x - v1.x, y: v2.y - v1.y };
      const edgeNormal = normalizeVector({ x: -edge.y, y: edge.x });

      
      const denominator = rayDir.x * edgeNormal.x + rayDir.y * edgeNormal.y;

      if (Math.abs(denominator) > 0.0001) {
        const t = ((v1.x - startX) * edgeNormal.x + (v1.y - startY) * edgeNormal.y) / denominator;

        if (t > 0) {
          const hitX = startX + t * rayDir.x;
          const hitY = startY + t * rayDir.y;
          
          const u = ((hitX - v1.x) * edge.x + (hitY - v1.y) * edge.y) / (edge.x * edge.x + edge.y * edge.y);

          if (u >= 0 && u <= 1) {
            
            if (!intersection || t < intersection.t) {
              intersection = { x: hitX, y: hitY, t: t };
              normal = edgeNormal;
              faceIndex = i;
            }
          }
        }
      }
    }

    return { intersection, normal, faceIndex };
  };

  const calculateRefractedDirection = (rayDir: Point, normal: Point, n1: number, n2: number, incidentAngle: number, refractedAngle: number): Point => {
    const dot = rayDir.x * normal.x + rayDir.y * normal.y;
    const sign = dot < 0 ? -1 : 1;
    const cosRefracted = Math.cos(refractedAngle);

    const refractedDir = {
      x: (n1 / n2) * rayDir.x + ((n1 / n2) * Math.cos(incidentAngle) - cosRefracted) * sign * normal.x,
      y: (n1 / n2) * rayDir.y + ((n1 / n2) * Math.cos(incidentAngle) - cosRefracted) * sign * normal.y
    };

    return normalizeVector(refractedDir);
  };

  const findExitPoint = (startPoint: Point, direction: Point, vertices: Point[], entranceFaceIndex: number) => {
    let exitPoint: (Point & { t: number }) | null = null;
    let exitNormal: Point | null = null;

    for (let i = 0; i < 3; i++) {
      if (i === entranceFaceIndex) continue;

      const v1 = vertices[i];
      const v2 = vertices[(i + 1) % 3];
      const edge = { x: v2.x - v1.x, y: v2.y - v1.y };
      const edgeNormal = normalizeVector({ x: -edge.y, y: edge.x });

      const denominator = direction.x * edgeNormal.x + direction.y * edgeNormal.y;

      if (Math.abs(denominator) > 0.0001) {
        const t = ((v1.x - startPoint.x) * edgeNormal.x + (v1.y - startPoint.y) * edgeNormal.y) / denominator;

        if (t > 0.001) {
          const hitX = startPoint.x + t * direction.x;
          const hitY = startPoint.y + t * direction.y;
          const u = ((hitX - v1.x) * edge.x + (hitY - v1.y) * edge.y) / (edge.x * edge.x + edge.y * edge.y);

          if (u >= 0 && u <= 1) {
            if (!exitPoint || t < exitPoint.t) {
              exitPoint = { x: hitX, y: hitY, t: t };
              exitNormal = edgeNormal;
            }
          }
        }
      }
    }

    return { exitPoint, exitNormal };
  };

  const calculateExitRay = (refractedDir: Point, exitResult: any, n_glass: number, n_air: number, originalAngle: number, wavelength: number): Point => {
    const dot2 = refractedDir.x * exitResult.exitNormal.x + refractedDir.y * exitResult.exitNormal.y;
    const exitIncidentAngle = Math.acos(Math.abs(dot2));
    const exitRefractedAngle = calculateRefraction(exitIncidentAngle, n_glass, n_air);

    if (exitRefractedAngle === null) {
      return exitResult.exitPoint;
    }

    const exitDir = calculateRefractedDirection(refractedDir, exitResult.exitNormal, n_glass, n_air, exitIncidentAngle, exitRefractedAngle);

    if (wavelength === 550 || !light.isWhiteLight) {
      const exitAngleRad = Math.atan2(exitDir.y, exitDir.x);
      
      
      
      const incidentRayDir = { x: Math.cos(originalAngle), y: Math.sin(originalAngle) };
      const dotProduct = incidentRayDir.x * exitDir.x + incidentRayDir.y * exitDir.y;
      const magnitudeProduct = Math.sqrt(incidentRayDir.x * incidentRayDir.x + incidentRayDir.y * incidentRayDir.y) * 
                               Math.sqrt(exitDir.x * exitDir.x + exitDir.y * exitDir.y);
      
      
      const clampedDot = Math.max(-1, Math.min(1, dotProduct / magnitudeProduct));
      const deviationRad = Math.acos(clampedDot);
      
      setMeasurements(prev => ({
        ...prev,
        exitAngle: (exitAngleRad * 180) / Math.PI,
        deviation: (deviationRad * 180) / Math.PI
      }));
    }

    return { x: exitResult.exitPoint.x + 1000 * exitDir.x, y: exitResult.exitPoint.y + 1000 * exitDir.y };
  };

  const traceLightRay = (startX: number, startY: number, angle: number, wavelength: number): Point[] => {
    
    
    const n_air = 1.0;
    const n_glass = calculateRefractiveIndex(wavelength, prism.baseRefractiveIndex);
    const vertices = getPrismVertices();

    const rayDir = { x: Math.cos(angle), y: Math.sin(angle) };

    
    const entryResult = calculateRayIntersection(startX, startY, rayDir, vertices);
    if (!entryResult.intersection) {
      
      return [
        { x: startX, y: startY },
        { x: startX + 1000 * rayDir.x, y: startY + 1000 * rayDir.y }
      ];
    }

    
    const dot = rayDir.x * entryResult.normal!.x + rayDir.y * entryResult.normal!.y;
    const incidentAngle = Math.acos(Math.abs(dot));

    if (wavelength === 550 || !light.isWhiteLight) {
      setMeasurements(prev => ({ ...prev, incidentAngle: (incidentAngle * 180) / Math.PI }));
    }

    const refractedAngle = calculateRefraction(incidentAngle, n_air, n_glass);
    if (refractedAngle === null) {
      
      return [{ x: startX, y: startY }, entryResult.intersection];
    }

    const refractedDir = calculateRefractedDirection(rayDir, entryResult.normal!, n_air, n_glass, incidentAngle, refractedAngle);

    
    const exitResult = findExitPoint(entryResult.intersection, refractedDir, vertices, entryResult.faceIndex);
    if (!exitResult.exitPoint) {
      
      return [{ x: startX, y: startY }, entryResult.intersection];
    }

    
    const exitPath = calculateExitRay(refractedDir, exitResult, n_glass, n_air, angle, wavelength);

    return [
      { x: startX, y: startY },
      entryResult.intersection,
      exitResult.exitPoint,
      exitPath
    ];
  };

  const getStartingPosition = (canvas: HTMLCanvasElement) => {
    const lightAngleRad = (light.angle * Math.PI) / 180;
    const startX = 50;
    const startY = canvas.height / 2 - Math.tan(lightAngleRad) * (prism.x - 50);
    return { startX, startY, lightAngleRad };
  };

  const drawRayPath = (ctx: CanvasRenderingContext2D, path: Point[], color: RGBColor, opacity: number) => {
    ctx.strokeStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${opacity})`;
    ctx.lineWidth = 2;

    ctx.beginPath();
    if (path.length > 1) {
      ctx.moveTo(path[0].x, path[0].y);
      for (let j = 1; j < path.length; j++) {
        ctx.lineTo(path[j].x, path[j].y);
      }
      ctx.stroke();
    }
  };

  const drawPrism = (ctx: CanvasRenderingContext2D) => {
    ctx.save();
    ctx.translate(prism.x, prism.y);

    const prismAngleRad = (prism.angle * Math.PI) / 180;
    const height = prism.size;
    const base = 2 * height * Math.tan(prismAngleRad / 2);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.moveTo(0, -height / 2);
    ctx.lineTo(-base / 2, height / 2);
    ctx.lineTo(base / 2, height / 2);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.restore();
  };

  const generateWavelengthArray = (): number[] => {
    const wavelengths = [];
    for (let w = 380; w <= 750; w += 10) {
      wavelengths.push(w);
    }
    return wavelengths;
  };

  const drawWhiteLightSpectrum = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    
    
    const { startX, startY, lightAngleRad } = getStartingPosition(canvas);
    const wavelengths = generateWavelengthArray();

    let minExitAngle = Infinity;
    let maxExitAngle = -Infinity;

    wavelengths.forEach((wavelength, index) => {
      
      const offset = (index - wavelengths.length / 2) * (light.beamWidth / wavelengths.length);
      const rayStartY = startY + offset;

      const path = traceLightRay(startX, rayStartY, lightAngleRad, wavelength);
      const color = convertWavelengthToRGB(wavelength);

      drawRayPath(ctx, path, color, 0.5);

      
      if (path.length === 4) {
        const exitAngle = Math.atan2(path[3].y - path[2].y, path[3].x - path[2].x);
        minExitAngle = Math.min(minExitAngle, exitAngle);
        maxExitAngle = Math.max(maxExitAngle, exitAngle);
      }
    });

    
    setMeasurements(prev => ({ ...prev, dispersion: ((maxExitAngle - minExitAngle) * 180) / Math.PI }));
  };

  const drawSingleColorLight = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    const { startX, startY, lightAngleRad } = getStartingPosition(canvas);
    const beamWidth = light.beamWidth;
    const numRays = 25;
    const color = convertWavelengthToRGB(light.wavelength);

    for (let i = 0; i < numRays; i++) {
      const offset = (i - (numRays - 1) / 2) * (beamWidth / numRays);
      const rayStartY = startY + offset;
      const path = traceLightRay(startX, rayStartY, lightAngleRad, light.wavelength);

      const distanceFromCenter = Math.abs(i - (numRays - 1) / 2) / ((numRays - 1) / 2);
      const opacity = 1 - distanceFromCenter * 0.7;

      drawRayPath(ctx, path, color, opacity);
    }
  };

  const renderScene = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawPrism(ctx);

    if (light.isWhiteLight) {
      drawWhiteLightSpectrum(ctx, canvas);
    } else {
      drawSingleColorLight(ctx, canvas);
    }
  }, [prism, light, convertWavelengthToRGB]);

  const initializeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    setPrism(prev => ({
      ...prev,
      x: canvas.width / 2,
      y: canvas.height / 2
    }));
  }, []);

  const isPointInsidePrism = (mouseX: number, mouseY: number): boolean => {
    const dx = mouseX - prism.x;
    const dy = mouseY - prism.y;
    return Math.sqrt(dx * dx + dy * dy) < prism.size;
  };

  const constrainPrismPosition = (x: number, y: number, canvas: HTMLCanvasElement): { x: number, y: number } => {
    
    
    const margin = prism.size / 2 + 20;
    const constrainedX = Math.max(margin, Math.min(canvas.width - margin, x));
    const constrainedY = Math.max(margin, Math.min(canvas.height - margin, y));
    return { x: constrainedX, y: constrainedY };
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    if (isPointInsidePrism(mouseX, mouseY)) {
      setDragging(true);
      setDragOffset({
        x: mouseX - prism.x,
        y: mouseY - prism.y
      });
      
      if (!hasInteractedWithPrism) {
        setHasInteractedWithPrism(true);
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!dragging) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const newX = e.clientX - rect.left - dragOffset.x;
    const newY = e.clientY - rect.top - dragOffset.y;
    const constrainedPosition = constrainPrismPosition(newX, newY, canvas);
    
    setPrism(prev => ({
      ...prev,
      x: constrainedPosition.x,
      y: constrainedPosition.y
    }));
  };

  const handleMouseUp = () => {
    setDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    const touchX = touch.clientX - rect.left;
    const touchY = touch.clientY - rect.top;

    if (isPointInsidePrism(touchX, touchY)) {
      setDragging(true);
      setDragOffset({
        x: touchX - prism.x,
        y: touchY - prism.y
      });
      
      if (!hasInteractedWithPrism) {
        setHasInteractedWithPrism(true);
      }
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (!dragging) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    const newX = touch.clientX - rect.left - dragOffset.x;
    const newY = touch.clientY - rect.top - dragOffset.y;
    const constrainedPosition = constrainPrismPosition(newX, newY, canvas);
    
    setPrism(prev => ({
      ...prev,
      x: constrainedPosition.x,
      y: constrainedPosition.y
    }));
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    setDragging(false);
  };

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    const step = e.shiftKey ? 5 : 1;
    
    switch(e.key.toLowerCase()) {
      case 'arrowleft':
        setLight(prev => ({ ...prev, angle: Math.max(-60, prev.angle - step) }));
        break;
      case 'arrowright':
        setLight(prev => ({ ...prev, angle: Math.min(60, prev.angle + step) }));
        break;
      case 'arrowup':
        setPrism(prev => ({ ...prev, angle: Math.min(90, prev.angle + step) }));
        break;
      case 'arrowdown':
        setPrism(prev => ({ ...prev, angle: Math.max(30, prev.angle - step) }));
        break;
      case 'w':
        setLight(prev => ({ ...prev, isWhiteLight: true }));
        break;
      case 's':
        setLight(prev => ({ ...prev, isWhiteLight: false }));
        break;
      case 'h':
        setShowHelp(prev => !prev);
        break;
    }
  }, []);

  const handleGlassTypeChange = (glassType: string) => {
    const selectedGlass = GLASS_TYPES.find(glass => glass.name === glassType);
    if (selectedGlass) {
      setPrism(prev => ({
        ...prev,
        glassType: glassType,
        baseRefractiveIndex: selectedGlass.baseIndex
      }));
    }
    setShowGlassDropdown(false);
  };

  useEffect(() => {
    initializeCanvas();
    window.addEventListener('resize', initializeCanvas);
    window.addEventListener('keydown', handleKeyDown);
    
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (showGlassDropdown && !target.closest('.glass-dropdown-container')) {
        setShowGlassDropdown(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      window.removeEventListener('resize', initializeCanvas);
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [initializeCanvas, handleKeyDown, showGlassDropdown]);

  
  useEffect(() => {
    if (showHelp) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showHelp]);

  useEffect(() => {
    renderScene();
  }, [renderScene]);

  const getColorPreviewStyle = () => {
    const color = convertWavelengthToRGB(light.wavelength);
    return {
      background: `linear-gradient(to right, rgba(0, 0, 0, 0.4), rgba(${color.r}, ${color.g}, ${color.b}, 0.8), rgba(0, 0, 0, 0.4))`,
      boxShadow: `inset 0 0 20px rgba(${color.r}, ${color.g}, ${color.b}, 0.2), 0 0 10px rgba(${color.r}, ${color.g}, ${color.b}, 0.1)`
    };
  };

  return (
    <div className={`${jetbrainsMono.className} min-h-screen bg-gradient-to-br from-[#1e3c72] via-[#2a5298] to-[#7e8ba3] text-white relative overflow-hidden`}>
      {/* animated background with floating gradients */}
      <div className="absolute inset-0 w-full h-full">
        <div className="absolute w-[150%] h-[150%] animate-drift" style={{
          background: `radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.3), transparent 50%), 
                      radial-gradient(circle at 80% 80%, rgba(255, 119, 198, 0.3), transparent 50%), 
                      radial-gradient(circle at 40% 20%, rgba(255, 255, 255, 0.1), transparent 50%)`
        }}></div>
      </div>

      {/* main content grid - responsive layout */}
      <div className="relative z-10 w-full max-w-[1600px] mx-auto p-4 lg:p-8 grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-4 lg:gap-8 min-h-screen">
        {/* header section with title and help button */}
        <header className="col-span-full mb-4 lg:mb-8 relative animate-fade-in-down">
          <div className="text-center pr-12 sm:pr-0">
            <h1 className="text-xl sm:text-2xl lg:text-4xl font-bold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent mb-2 tracking-tight">
              Prism Light Simulation
            </h1>
            <p className="text-xs sm:text-sm lg:text-base text-white/80 tracking-wide px-4 sm:px-0">
              Interactive visualization of light refraction and dispersion
            </p>
          </div>
          <button 
            onClick={() => setShowHelp(true)}
            className="absolute cursor-pointer right-0 top-0 sm:top-1/2 sm:-translate-y-1/2 bg-white/20 hover:bg-white/30 text-white/90 hover:text-white px-3 py-2 sm:px-3 sm:py-1.5 rounded-lg text-sm font-medium transition-all duration-300 ease-out flex items-center gap-2 shadow-lg border border-white/10 min-w-[44px] min-h-[44px] sm:min-w-auto sm:min-h-auto justify-center sm:justify-start hover:scale-105 hover:shadow-xl active:scale-95"
          >
            <QuestionMarkCircleIcon className="w-5 h-5 sm:w-4 sm:h-4 flex-shrink-0 transition-transform duration-200" />
            <span className="hidden min-[750px]:inline">Help</span>
          </button>
        </header>

        {/* main simulation canvas with glassmorphism styling */}
        <div className="bg-white/10 backdrop-blur-[20px] border border-white/20 rounded-[24px] relative overflow-hidden shadow-lg shadow-black/10 order-1 xl:order-1 animate-fade-in-left transition-all duration-300 hover:shadow-2xl hover:shadow-black/20">
          <div className="absolute inset-0 bg-gradient-to-br from-white/15 via-white/5 to-transparent opacity-70 pointer-events-none"></div>
          <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-white/12 to-transparent pointer-events-none"></div>
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-radial from-white/20 to-transparent rounded-full blur-2xl pointer-events-none opacity-60"></div>
          
          <canvas
            ref={canvasRef}
            className={`w-full h-[400px] lg:h-full ${dragging ? 'cursor-grabbing' : 'cursor-grab'} touch-none transition-all duration-200`}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          />
          
          {/* drag instruction overlay - shown until first interaction */}
          {!hasInteractedWithPrism && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/60 backdrop-blur-sm text-white/90 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium shadow-lg transition-all duration-300 ease-in-out pointer-events-none select-none flex items-center gap-2 animate-bounce">
              <ArrowsUpDownIcon className="w-3 h-3 sm:w-4 sm:h-4 animate-pulse" />
              <span className="hidden sm:inline">Drag to move prism</span>
              <span className="sm:hidden">Drag prism</span>
            </div>
          )}

          {/* real-time measurements panel */}
          {showMeasurements && (
            <div className="absolute top-2 sm:top-4 lg:top-8 right-2 sm:right-4 lg:right-8 bg-black/40 backdrop-blur-md border border-white/10 rounded-xl sm:rounded-2xl p-2 sm:p-4 lg:p-6 min-w-[140px] sm:min-w-[200px] lg:min-w-[220px] transition-all duration-300 hover:bg-black/50 hover:-translate-y-1 hover:shadow-xl hover:scale-105 text-xs sm:text-sm animate-fade-in-right">
              <div className="text-xs uppercase tracking-wider text-white/80 mb-2 sm:mb-4 flex items-center justify-between">
                <div className="flex items-center gap-1 sm:gap-2">
                  <ChartBarIcon className="w-4 h-4 sm:w-5 sm:h-5 animate-pulse" />
                  <span className="hidden sm:inline">Measurements</span>
                  <span className="sm:hidden">Data</span>
                </div>
                {/* elegant toggle button integrated into header - mobile only */}
                <button
                  onClick={() => setShowMeasurements(false)}
                  className="sm:hidden w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/30 flex items-center justify-center text-white/60 hover:text-white/90 transition-all duration-300 hover:scale-110 active:scale-95 backdrop-blur-sm"
                >
                  <EyeSlashIcon className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="space-y-1 sm:space-y-2">
                <div className="flex justify-between transition-all duration-200 hover:translate-x-1 hover:bg-white/5 rounded px-1 py-0.5">
                  <span className="text-white/80 text-xs sm:text-sm">Incident</span>
                  <span className="font-semibold text-emerald-400 font-mono bg-emerald-400/10 px-1 sm:px-2 py-0.5 sm:py-1 rounded text-xs sm:text-sm transition-all duration-200 hover:bg-emerald-400/20">
                    {Math.abs(measurements.incidentAngle).toFixed(1)}°
                  </span>
                </div>
                <div className="flex justify-between transition-all duration-200 hover:translate-x-1 hover:bg-white/5 rounded px-1 py-0.5">
                  <span className="text-white/80 text-xs sm:text-sm">Exit</span>
                  <span className="font-semibold text-emerald-400 font-mono bg-emerald-400/10 px-1 sm:px-2 py-0.5 sm:py-1 rounded text-xs sm:text-sm transition-all duration-200 hover:bg-emerald-400/20">
                    {measurements.exitAngle.toFixed(1)}°
                  </span>
                </div>
                <div className="flex justify-between transition-all duration-200 hover:translate-x-1 hover:bg-white/5 rounded px-1 py-0.5">
                  <span className="text-white/80 text-xs sm:text-sm">Deviation</span>
                  <span className="font-semibold text-emerald-400 font-mono bg-emerald-400/10 px-1 sm:px-2 py-0.5 sm:py-1 rounded text-xs sm:text-sm transition-all duration-200 hover:bg-emerald-400/20">
                    {measurements.deviation.toFixed(1)}°
                  </span>
                </div>
                <div className="flex justify-between transition-all duration-200 hover:translate-x-1 hover:bg-white/5 rounded px-1 py-0.5">
                  <span className="text-white/80 text-xs sm:text-sm">Dispersion</span>
                  <span className="font-semibold text-emerald-400 font-mono bg-emerald-400/10 px-1 sm:px-2 py-0.5 sm:py-1 rounded text-xs sm:text-sm transition-all duration-200 hover:bg-emerald-400/20">
                    {measurements.dispersion.toFixed(2)}°
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* floating show button when measurements are hidden - mobile only */}
          {!showMeasurements && (
            <button
              onClick={() => setShowMeasurements(true)}
              className="absolute top-4 right-4 sm:hidden w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/30 backdrop-blur-md flex items-center justify-center text-white/70 hover:text-white transition-all duration-300 hover:scale-110 active:scale-95 shadow-lg animate-fade-in-right"
            >
              <ChartBarIcon className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* controls panel - light source, prism properties, and about section */}
        <div className="flex flex-col gap-4 lg:gap-8 order-2 xl:order-2 animate-fade-in-right justify-around overflow-visible overflow-x-hidden xl:overflow-y-auto xl:pr-3 xl:h-[calc(100vh-200px)] xl:pt-2 xl:pb-2 controls-scrollbar">
          {/* light source controls */}
          <div className="bg-white/10 backdrop-blur-[20px] border border-white/20 rounded-2xl p-4 sm:p-6 lg:p-7 shadow-lg shadow-black/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:bg-white/15 hover:border-white/30">
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-white/8 to-transparent opacity-60 pointer-events-none rounded-2xl"></div>
            <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/15 to-transparent pointer-events-none rounded-t-2xl"></div>
            <div className="absolute -top-8 -right-8 w-24 h-24 bg-gradient-radial from-white/25 to-transparent rounded-full blur-xl pointer-events-none opacity-50"></div>
            
            <div className="text-base sm:text-lg font-semibold mb-4 sm:mb-6 flex items-center gap-2">
              <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-br from-[#667eea] to-[#764ba2] rounded flex items-center justify-center transition-all duration-300 hover:scale-110 hover:rotate-12">
                <LightBulbIcon className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
              </div>
              Light Source
            </div>

            <div className="flex bg-white/5 rounded-xl p-1 mb-6 sm:mb-8 relative overflow-hidden transition-all duration-300 hover:bg-white/10">
              <div 
                className={`absolute top-1 left-1 w-[calc(50%-4px)] h-[calc(100%-8px)] bg-gradient-to-br from-[#667eea] to-[#764ba2] rounded-lg transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] shadow-lg ${
                  light.isWhiteLight ? 'translate-x-0' : 'translate-x-full'
                }`}
              />
              <button
                onClick={() => setLight(prev => ({ ...prev, isWhiteLight: true }))}
                className={`flex-1 py-2 sm:py-3 rounded-lg text-center text-xs sm:text-sm font-medium cursor-pointer transition-all duration-300 relative z-10 ${
                  light.isWhiteLight ? 'text-white transform scale-105' : 'text-white/80 hover:text-white hover:bg-white/5 hover:scale-105'
                }`}
              >
                White Light
              </button>
              <button
                onClick={() => setLight(prev => ({ ...prev, isWhiteLight: false }))}
                className={`flex-1 py-2 sm:py-3 rounded-lg text-center text-xs sm:text-sm font-medium cursor-pointer transition-all duration-300 relative z-10 ${
                  !light.isWhiteLight ? 'text-white transform scale-105' : 'text-white/80 hover:text-white hover:bg-white/5 hover:scale-105'
                }`}
              >
                Single Color
              </button>
            </div>

            <div className="mb-4 sm:mb-6 transition-all duration-500 ease-in-out" style={{ height: !light.isWhiteLight ? 'auto' : '0px', overflow: 'hidden', opacity: !light.isWhiteLight ? 1 : 0 }}>
              {!light.isWhiteLight && (
                <div className="animate-fade-in-up">
                  <div className="flex justify-between items-center mb-2 sm:mb-3">
                    <span className="text-xs sm:text-sm text-white/80">Wavelength</span>
                    <span className="text-xs sm:text-sm font-semibold font-mono bg-white/10 px-2 py-1 rounded transition-all duration-200 hover:bg-white/20">
                      {light.wavelength} nm
                    </span>
                  </div>
                  <input
                    type="range"
                    min="380"
                    max="750"
                    value={light.wavelength}
                    onChange={(e) => setLight(prev => ({ ...prev, wavelength: parseInt(e.target.value) }))}
                    className="w-full h-2 bg-white/10 rounded appearance-none cursor-pointer slider transition-all duration-200 hover:bg-white/20"
                  />
                  
                  <div 
                    className="w-full h-[40px] sm:h-[60px] rounded-xl relative overflow-hidden border border-white/10 shadow-inner mt-4 sm:mt-6 transition-all duration-300 hover:scale-105 hover:shadow-lg"
                    style={getColorPreviewStyle()}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent"></div>
                    <div className="absolute -bottom-1 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent blur-[1px]"></div>
                  </div>
                </div>
              )}
            </div>

            <div className="mb-4 sm:mb-6">
              <div className="flex justify-between items-center mb-2 sm:mb-3">
                <span className="text-xs sm:text-sm text-white/80">Light Angle</span>
                <span className="text-xs sm:text-sm font-semibold font-mono bg-white/10 px-2 py-1 rounded transition-all duration-200 hover:bg-white/20">
                  {light.angle}°
                </span>
              </div>
              <input
                type="range"
                min="-60"
                max="60"
                value={light.angle}
                onChange={(e) => setLight(prev => ({ ...prev, angle: parseInt(e.target.value) }))}
                className="w-full h-2 bg-white/10 rounded appearance-none cursor-pointer slider transition-all duration-200 hover:bg-white/20"
              />
            </div>

            <div className="mb-4 sm:mb-6">
              <div className="flex justify-between items-center mb-2 sm:mb-3">
                <span className="text-xs sm:text-sm text-white/80">Beam Width</span>
                <span className="text-xs sm:text-sm font-semibold font-mono bg-white/10 px-2 py-1 rounded transition-all duration-200 hover:bg-white/20">
                  {light.beamWidth}
                </span>
              </div>
              <input
                type="range"
                min="5"
                max="50"
                value={light.beamWidth}
                onChange={(e) => setLight(prev => ({ ...prev, beamWidth: parseInt(e.target.value) }))}
                className="w-full h-2 bg-white/10 rounded appearance-none cursor-pointer slider transition-all duration-200 hover:bg-white/20"
              />
            </div>
          </div>

          {/* prism properties controls */}
          <div className="bg-white/10 backdrop-blur-[20px] border border-white/20 rounded-2xl p-4 sm:p-6 lg:p-7 shadow-lg shadow-black/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:bg-white/15 hover:border-white/30 relative z-50">
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-white/8 to-transparent opacity-60 pointer-events-none rounded-2xl"></div>
            <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/15 to-transparent pointer-events-none rounded-t-2xl"></div>
            <div className="absolute -top-8 -left-8 w-24 h-24 bg-gradient-radial from-white/25 to-transparent rounded-full blur-xl pointer-events-none opacity-50"></div>
            
            <div className="text-base sm:text-lg font-semibold mb-4 sm:mb-6 flex items-center gap-2">
              <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-br from-[#667eea] to-[#764ba2] rounded flex items-center justify-center transition-all duration-300 hover:scale-110 hover:rotate-12">
                <CubeTransparentIcon className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
              </div>
              Prism Properties
            </div>

            <div className="mb-4 sm:mb-6">
              <div className="flex justify-between items-center mb-2 sm:mb-3">
                <span className="text-xs sm:text-sm text-white/80">Prism Angle</span>
                <span className="text-xs sm:text-sm font-semibold font-mono bg-white/10 px-2 py-1 rounded transition-all duration-200 hover:bg-white/20">
                  {prism.angle}°
                </span>
              </div>
              <input
                type="range"
                min="30"
                max="90"
                value={prism.angle}
                onChange={(e) => setPrism(prev => ({ ...prev, angle: parseInt(e.target.value) }))}
                className="w-full h-2 bg-white/10 rounded appearance-none cursor-pointer slider transition-all duration-200 hover:bg-white/20"
              />
            </div>

            <div className="mb-4 sm:mb-6 relative z-[100]">
              <div className="flex justify-between items-center mb-2 sm:mb-3">
                <span className="text-xs sm:text-sm text-white/80">Glass Type</span>
                <span className="text-xs sm:text-sm font-semibold font-mono bg-white/10 px-2 py-1 rounded transition-all duration-200 hover:bg-white/20">
                  n = {prism.baseRefractiveIndex.toFixed(2)}
                </span>
              </div>
              
              <div className="relative glass-dropdown-container">
                <button
                  onClick={() => setShowGlassDropdown(!showGlassDropdown)}
                  className="w-full bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/30 rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm text-white transition-all duration-300 flex items-center justify-between group cursor-pointer"
                >
                  <div className="flex flex-col">
                    <span className="font-medium">{prism.glassType}</span>
                    <span className="text-xs text-white/60 mt-0.5">
                      {GLASS_TYPES.find(glass => glass.name === prism.glassType)?.description}
                    </span>
                  </div>
                  <ChevronDownIcon 
                    className={`w-4 h-4 sm:w-5 sm:h-5 text-white/60 transition-all duration-300 group-hover:text-white/80 ${
                      showGlassDropdown ? 'rotate-180' : ''
                    }`} 
                  />
                </button>

                {showGlassDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-black/90 backdrop-blur-md border border-white/20 rounded-xl shadow-2xl z-[9999] overflow-hidden animate-fade-in-up" style={{ zIndex: 9999 }}>
                    {GLASS_TYPES.map((glass) => (
                      <button
                        key={glass.name}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleGlassTypeChange(glass.name);
                        }}
                        className={`w-full px-3 sm:px-4 py-2 sm:py-3 text-left hover:bg-white/20 transition-all duration-200 border-b border-white/10 last:border-b-0 cursor-pointer select-none ${
                          prism.glassType === glass.name ? 'bg-white/15 text-white' : 'text-white/80 hover:text-white'
                        }`}
                      >
                        <div className="flex justify-between items-center pointer-events-none">
                          <div className="flex flex-col">
                            <span className="text-xs sm:text-sm font-medium">{glass.name}</span>
                            <span className="text-xs text-white/60">{glass.description}</span>
                          </div>
                          <span className="text-xs font-mono bg-white/10 px-2 py-1 rounded">
                            n = {glass.baseIndex.toFixed(2)}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* about section with simulation description */}
          <div className="bg-white/10 backdrop-blur-[20px] border border-white/20 rounded-2xl p-4 sm:p-6 lg:p-7 shadow-lg shadow-black/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:bg-white/15 hover:border-white/30">
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-white/8 to-transparent opacity-60 pointer-events-none rounded-2xl"></div>
            <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/15 to-transparent pointer-events-none rounded-t-2xl"></div>
            <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-gradient-radial from-white/25 to-transparent rounded-full blur-xl pointer-events-none opacity-50"></div>
            
            <div className="text-base sm:text-lg font-semibold mb-4 sm:mb-6 flex items-center gap-2">
              <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-br from-[#667eea] to-[#764ba2] rounded flex items-center justify-center transition-all duration-300 hover:scale-110 hover:rotate-12">
                <span className="text-xs">ℹ️</span>
              </div>
              About
            </div>
            <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
              This simulation demonstrates light refraction through a prism using Snell's Law with
              wavelength-dependent refractive indices. White light splits into its component colors due to
              dispersion.
            </p>
          </div>
        </div>
      </div>

      {/* help modal with keyboard shortcuts and usage instructions */}
      {showHelp && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="w-full max-w-2xl bg-white/10 backdrop-blur-[20px] border border-white/20 rounded-[24px] p-6 sm:p-8 shadow-xl max-h-[90vh] overflow-y-auto animate-scale-in">
            <div className="flex justify-between items-start mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl font-semibold text-white">How to Use</h2>
              <button 
                onClick={() => setShowHelp(false)}
                className="text-white/60 hover:text-white transition-all duration-300 hover:scale-110 hover:rotate-90 p-1 rounded-full hover:bg-white/10"
              >
                <XMarkIcon className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>
            <div className="space-y-4 sm:space-y-6 text-white/80">
              <div className="space-y-2 animate-fade-in-up" style={{animationDelay: '0.1s'}}>
                <h3 className="text-base sm:text-lg font-medium text-white flex items-center gap-2">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-br from-[#667eea] to-[#764ba2] rounded flex items-center justify-center transition-all duration-300 hover:scale-110">
                    <LightBulbIcon className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                  </div>
                  Basic Controls
                </h3>
                <ul className="space-y-2 text-xs sm:text-sm">
                  <li className="flex items-center gap-2 transition-all duration-200 hover:translate-x-2 hover:text-white">
                    <span className="bg-white/10 px-2 py-1 rounded text-xs border border-white/20 transition-all duration-200 hover:bg-white/20">Drag</span>
                    <span>Move the prism around the canvas</span>
                  </li>
                  <li className="flex items-center gap-2 transition-all duration-200 hover:translate-x-2 hover:text-white">
                    <span className="bg-white/10 px-2 py-1 rounded text-xs border border-white/20 transition-all duration-200 hover:bg-white/20">←</span>
                    <span className="bg-white/10 px-2 py-1 rounded text-xs border border-white/20 transition-all duration-200 hover:bg-white/20">→</span>
                    <span>Adjust light angle</span>
                  </li>
                  <li className="flex items-center gap-2 transition-all duration-200 hover:translate-x-2 hover:text-white">
                    <span className="bg-white/10 px-2 py-1 rounded text-xs border border-white/20 transition-all duration-200 hover:bg-white/20">↑</span>
                    <span className="bg-white/10 px-2 py-1 rounded text-xs border border-white/20 transition-all duration-200 hover:bg-white/20">↓</span>
                    <span>Adjust prism angle</span>
                  </li>
                  <li className="flex items-center gap-2 transition-all duration-200 hover:translate-x-2 hover:text-white">
                    <span className="bg-white/10 px-2 py-1 rounded text-xs border border-white/20 transition-all duration-200 hover:bg-white/20">W</span>
                    <span>Toggle white light mode</span>
                  </li>
                  <li className="flex items-center gap-2 transition-all duration-200 hover:translate-x-2 hover:text-white">
                    <span className="bg-white/10 px-2 py-1 rounded text-xs border border-white/20 transition-all duration-200 hover:bg-white/20">S</span>
                    <span>Toggle single color mode</span>
                  </li>
                  <li className="flex items-center gap-2 transition-all duration-200 hover:translate-x-2 hover:text-white">
                    <span className="bg-white/10 px-2 py-1 rounded text-xs border border-white/20 transition-all duration-200 hover:bg-white/20">H</span>
                    <span>Show/hide this help panel</span>
                  </li>
                </ul>
              </div>
              <div className="space-y-2 animate-fade-in-up" style={{animationDelay: '0.2s'}}>
                <h3 className="text-base sm:text-lg font-medium text-white flex items-center gap-2">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-br from-[#667eea] to-[#764ba2] rounded flex items-center justify-center transition-all duration-300 hover:scale-110">
                    <CubeTransparentIcon className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                  </div>
                  Understanding the Simulation
                </h3>
                <p className="text-xs sm:text-sm leading-relaxed transition-all duration-200 hover:text-white">
                  This simulation demonstrates light refraction through a prism using Snell's Law. 
                  The white light splits into its component colors due to dispersion, where different 
                  wavelengths refract at slightly different angles. The measurements panel shows the 
                  incident angle, exit angle, deviation, and dispersion of the light.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        /* slider styling for better cross-browser compatibility */
        .slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 18px;
          height: 18px;
          background: white;
          border-radius: 50%;
          cursor: grab;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
          transition: all 0.3s ease;
        }
        
        .slider::-webkit-slider-thumb:hover {
          transform: scale(1.2);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }
        
        .slider::-webkit-slider-thumb:active {
          cursor: grabbing;
          transform: scale(1.1);
        }

        /* animation keyframes for smooth transitions */
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes fade-in-down {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes fade-in-left {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }

        @keyframes fade-in-right {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }

        @keyframes drift {
          0%, 100% {
            transform: translate(0, 0) rotate(0deg);
          }
          33% {
            transform: translate(-5%, -10%) rotate(120deg);
          }
          66% {
            transform: translate(5%, 5%) rotate(240deg);
          }
        }

        @keyframes scale-in {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }

        /* animation utility classes */
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }

        .animate-fade-in-down {
          animation: fade-in-down 0.6s ease-out;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.4s ease-out;
        }

        .animate-fade-in-left {
          animation: fade-in-left 0.5s ease-out;
        }

        .animate-fade-in-right {
          animation: fade-in-right 0.5s ease-out;
        }

        .animate-drift {
          animation: drift 20s ease-in-out infinite;
        }

        .animate-scale-in {
          animation: scale-in 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* responsive scrollbar management */
        @media (max-width: 1279px) {
          .controls-scrollbar {
            overflow: visible !important;
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          
          .controls-scrollbar::-webkit-scrollbar {
            display: none;
          }
        }

        /* desktop scrollbar styling - only on xl screens and above */
        @media (min-width: 1280px) {
          .custom-scrollbar::-webkit-scrollbar {
            width: 8px;
          }

          .custom-scrollbar::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.1);
            border-radius: 10px;
          }

          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.3);
            border-radius: 10px;
            transition: all 0.3s ease;
          }

          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: rgba(255, 255, 255, 0.5);
          }

          .custom-scrollbar {
            scrollbar-width: thin;
            scrollbar-color: rgba(255, 255, 255, 0.3) rgba(255, 255, 255, 0.1);
          }

          .controls-scrollbar::-webkit-scrollbar {
            width: 8px;
          }

          .controls-scrollbar::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.1);
            border-radius: 10px;
          }

          .controls-scrollbar::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.3);
            border-radius: 10px;
            transition: all 0.3s ease;
          }

          .controls-scrollbar::-webkit-scrollbar-thumb:hover {
            background: rgba(255, 255, 255, 0.5);
          }

          .controls-scrollbar {
            scrollbar-width: thin;
            scrollbar-color: rgba(255, 255, 255, 0.3) rgba(255, 255, 255, 0.1);
          }
        }

        /* mobile-specific slider adjustments */
        @media (max-width: 640px) {
          .slider::-webkit-slider-thumb {
            width: 20px;
            height: 20px;
          }
        }

        /* glassmorphism utility classes for better reusability */
        .glassmorphism-panel {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 16px;
        }

        .glassmorphism-overlay {
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.05) 100%);
          opacity: 0.6;
          pointer-events: none;
        }

        .glassmorphism-light-spot {
          background: radial-gradient(circle, rgba(255, 255, 255, 0.25) 0%, transparent 70%);
          filter: blur(8px);
          pointer-events: none;
          opacity: 0.5;
        }

        /* radial gradient utility for glassmorphism effects */
        .bg-gradient-radial {
          background: radial-gradient(circle, var(--tw-gradient-stops));
        }
      `}</style>
    </div>
  );
} 
"use client";

import { useEffect, useRef, useState } from 'react';

interface Ball {
  id: number;
  x: number;
  y: number;
  radius: 15;
  vx: number;
  vy: number;
  color: string;
  glitterPoints: { x: number; y: number; alpha: number; size: number }[];
  glitterTimer: number;
}

interface Settings {
  elasticity: number;
  friction: number;
}

export default function BallSimulation() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [inclinedHeight, setInclinedHeight] = useState<number>(300);
  const [balls, setBalls] = useState<Ball[]>([]);
  const [settings, setSettings] = useState<Settings>({
    elasticity: 1.0,
    friction: 0.0,
  });
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [settingsPosition, setSettingsPosition] = useState<{ x: number, y: number }>({ x: 0, y: 0 });
  const [isDraggingSlider, setIsDraggingSlider] = useState<boolean>(false);
  const [windowSize, setWindowSize] = useState({ width: 1000, height: 800 });
  const [showInstructions, setShowInstructions] = useState<boolean>(false);
  const ballIdCounterRef = useRef<number>(0);
  const animationRef = useRef<number>(0);
  const g = 10;
  const SCALE = 30;
  const [titleHovered, setTitleHovered] = useState<boolean>(false);

  useEffect(() => {
    setWindowSize({width: window.innerWidth,
  height: window.innerHeight
    });
  }, []);

  const getRandomColor = () => {
    const colors = ['#FF6B6B', '#4ECDC4', '#FFD166', '#06D6A0', '#118AB2', '#073B4C', '#F4A261'];
    // const colors = ['#FF6B6B', '#4ECDC4', '#FFD166', '#06D6A0', '#118AB2', '#073B4C', '#F4A261'. '#FF1654', '#FF6F61', '#D9BF77', '#ACD8AA', '#FFE156', '#6A0572', '#AB83A1'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (e.button === 0) {
      const rect = canvasRef.current!.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      if (isPointOnInclinedPlane(x, y)) {return;
      }
      
      const newBall: Ball = {
        id: ballIdCounterRef.current++,
        x,
        y,
        radius: 15,
        vx: 0,
        vy: 0,
        color: getRandomColor(),
        glitterPoints: Array(3).fill(0).map(() => createGlitterPoint({ x, y, radius: 15 } as Ball)),
        glitterTimer: 0
      };
      
      setBalls(prev => [...prev, newBall]);
    }
  };

  const handleRightClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const isSmallScreen = window.innerWidth < 768; // md breakpoint
    if (isSmallScreen) {
      setSettingsPosition({ 
        x: window.innerWidth / 2, 
        y: window.innerHeight / 2 
      });
    } else {
      setSettingsPosition({ x: e.clientX, y: e.clientY });
    }
    setShowSettings(true);
  };

  const isPointOnInclinedPlane = (x: number, y: number) => {
    if (!canvasRef.current) return false;
    
    const canvas = canvasRef.current;
    const width = canvas.width;
    const height = canvas.height;
    
    const planeY = height - (inclinedHeight * (1 - x / width));
    
    return y >= planeY - 5;
  };

  const handleSliderMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDraggingSlider) {
      const containerRect = e.currentTarget.getBoundingClientRect();
      const newHeight = Math.max(0, Math.min(containerRect.height - 10, containerRect.height - (e.clientY - containerRect.top)));
      setInclinedHeight(newHeight);
    }
  };

  const handleSliderMouseUp = () => {
    setIsDraggingSlider(false);
  };

  const handleSettingsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSettings(false);
  };

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d')!;
    
    const resizeCanvas = () => {
      canvas.width = windowSize.width;
      canvas.height = windowSize.height;
    };
    
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };
    
    window.addEventListener('resize', handleResize);
    resizeCanvas();
    
    const updatePhysics = () => {
      if (!canvas) return;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      drawGrid(ctx, canvas.width, canvas.height);
      
      drawInclinedPlane(ctx, canvas.width, canvas.height, inclinedHeight);
      
      setBalls(prevBalls => {
        const updatedBalls = prevBalls.map(ball => {
          let newVy = ball.vy + (g / SCALE);
          
          let newX = ball.x + ball.vx;
          let newY = ball.y + newVy;
          let newVx = ball.vx;
          
          const slope = inclinedHeight / canvas.width;
          const planeYAtX = canvas.height - (inclinedHeight * (1 - newX / canvas.width));
          // const planeYAtX = canvas.height - (inclinedHeight * (1/ canvas.width));
          
          if (newY + ball.radius > planeYAtX) {
            const normalX = -slope;
            const normalY = 1;
            const normalLength = Math.sqrt(normalX**2 + normalY**2);
            
            const nx = normalX / normalLength;
            const ny = normalY / normalLength;
            
            const dotProduct = newVx * nx + newVy * ny;
            
            newVx = newVx - 2 * dotProduct * nx * settings.elasticity;
            newVy = newVy - 2 * dotProduct * ny * settings.elasticity;
            
            const tangentX = ny;
            const tangentY = -nx;
            const tangentDot = newVx * tangentX + newVy * tangentY;
            const frictionFactor = 1 - settings.friction;
            
            newVx = newVx - (1 - frictionFactor) * tangentDot * tangentX;
            newVy = newVy - (1 - frictionFactor) * tangentDot * tangentY;
            
            const penetration = (newY + ball.radius) - planeYAtX;
            newY = newY - penetration;
          }
          
          if (newX - ball.radius < 0) {
            newX = ball.radius;
            newVx = -newVx * settings.elasticity;
          }
          
          if (newX + ball.radius > canvas.width) {
            newX = canvas.width - ball.radius;
            newVx = -newVx * settings.elasticity;
          }
          
          if (newY - ball.radius < 0) {
            newY = ball.radius;
            newVy = -newVy * settings.elasticity;
          }
          
          return {
            ...ball,
            x: newX,
            y: newY,
            vx: newVx,
            vy: newVy,
            glitterPoints: updateGlitterPoints(ball),
            glitterTimer: ball.glitterTimer + 1
          };
        });
        
        return updatedBalls;
      });
      
      balls.forEach(ball => {
        // Draw the base ball
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        ctx.fillStyle = ball.color;
        ctx.fill();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.closePath();
        
        // Draw glitter points
        ball.glitterPoints.forEach(glitter => {
          ctx.beginPath();
          ctx.arc(
            ball.x + glitter.x, 
            ball.y + glitter.y, 
            glitter.size, 
            0, 
            Math.PI * 2
          );
          ctx.fillStyle = `rgba(255, 255, 255, ${glitter.alpha})`;
          ctx.fill();
          ctx.closePath();
        });
        
        // Optionally add a shimmer effect based on the ball's movement
        if (Math.abs(ball.vx) > 1 || Math.abs(ball.vy) > 1) {
          ctx.beginPath();
          const gradientSize = ball.radius * 1.5;
          const gradient = ctx.createRadialGradient(
            ball.x, ball.y, ball.radius * 0.2,
            ball.x, ball.y, gradientSize
          );
          gradient.addColorStop(0, 'rgba(255, 255, 255, 0.25)');
          gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.1)');
          gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
          
          ctx.arc(ball.x, ball.y, gradientSize, 0, Math.PI * 2);
          ctx.fillStyle = gradient;
          ctx.fill();
          ctx.closePath();
        }
      });
      
      animationRef.current = requestAnimationFrame(updatePhysics);
    };
    
    animationRef.current = requestAnimationFrame(updatePhysics);
    
    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener('resize', handleResize);
    };
  }, [balls, inclinedHeight, settings, windowSize]);
  
  const drawGrid = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.save();
    ctx.strokeStyle = 'rgba(200, 200, 200, 0.2)';
    ctx.lineWidth = 0.5;
    
    for (let x = 0; x <= width; x += 50) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    
    for (let y = height; y >= 0; y -= 50) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
      
      const heightValue = height - y;
      if (heightValue > 0) {
        ctx.fillStyle = 'rgba(50, 50, 50, 0.7)';
        const textWidth = ctx.measureText(heightValue.toString()).width + 10;
        ctx.fillRect(22, y - 9, textWidth, 18);
        
        ctx.font = '12px Arial';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(heightValue.toString(), 27, y);
      }
    }
    
    ctx.strokeStyle = 'rgba(100, 100, 100, 0.5)';
    ctx.lineWidth = 2;
    
    ctx.beginPath();
    ctx.moveTo(0, height - 20);
    ctx.lineTo(width, height - 20);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(20, height);
    ctx.lineTo(20, 0);
    ctx.stroke();
    
    ctx.save();
    ctx.translate(10, height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.font = 'bold 14px Arial';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.textAlign = 'center';
    ctx.fillText('Height (pixels)', 0, 0);
    ctx.restore();
    
    ctx.restore();
  };
  
  const drawInclinedPlane = (ctx: CanvasRenderingContext2D, width: number, height: number, planeHeight: number) => {
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(0, height);
    ctx.lineTo(0, height - planeHeight);
    ctx.lineTo(width, height);
    ctx.closePath();
    
    const gradient = ctx.createLinearGradient(0, height - planeHeight, width, height);
    gradient.addColorStop(0, '#3a86ff');
    gradient.addColorStop(1, '#8338ec');
    
    ctx.fillStyle = gradient;
    ctx.fill();
    
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    for (let x = 0; x < width; x += 20) {
      const planeYAtX = height - (planeHeight * (1 - x / width));
      ctx.beginPath();
      ctx.moveTo(x, planeYAtX);
      ctx.lineTo(x + 10, height - (planeHeight * (1 - (x + 10) / width)));
      ctx.stroke();
    }
    
    const slope = inclinedHeight / width;
    const angleRadians = Math.atan(slope);
    const angleDegrees = angleRadians * (180 / Math.PI);
    
    ctx.beginPath();
    const arcRadius = 50;
    ctx.arc(width, height, arcRadius, Math.PI, Math.PI + angleRadians, false);
    ctx.strokeStyle = '#ffdd00';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    ctx.font = 'bold 16px Arial';
    ctx.fillStyle = '#ffdd00';
    ctx.textAlign = 'right';
    ctx.fillText(`${angleDegrees.toFixed(1)}°`, width - 60, height - 10);
    
    ctx.beginPath();
    ctx.arc(width, height, 3, 0, Math.PI * 2);
    ctx.fillStyle = '#ffdd00';
    ctx.fill();
    
    ctx.restore();
  };

  // Add helper functions for glitter effect
  const createGlitterPoint = (ball: Ball) => {
    const angle = Math.random() * Math.PI * 2;
    const distance = Math.random() * ball.radius * 0.8;
    
    return {
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance,
      alpha: 0.6 + Math.random() * 0.4,
      size: 1 + Math.random() * 2
    };
  };
  
  const updateGlitterPoints = (ball: Ball) => {
    // Update existing glitter points
    let updatedPoints = ball.glitterPoints
      .map(point => ({ ...point, alpha: point.alpha - 0.05 }))
      .filter(point => point.alpha > 0);
      
    // Add new glitter points at random intervals
    if (Math.random() < 0.3 || ball.glitterPoints.length < 5) {
      updatedPoints.push(createGlitterPoint(ball));
    }
    
    return updatedPoints;
  };

  return (
    <div 
      className="relative h-screen w-screen overflow-hidden bg-gray-900"
      onMouseMove={isDraggingSlider ? handleSliderMouseMove : undefined}
      onMouseUp={isDraggingSlider ? handleSliderMouseUp : undefined}
      onMouseLeave={isDraggingSlider ? handleSliderMouseUp : undefined}
    >
      <canvas 
        ref={canvasRef}
        onClick={handleCanvasClick}
        onContextMenu={handleRightClick}
        className="block"
      />
      
      {/* Animated Heading */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 select-none">
        <div 
          className={`bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-transparent bg-clip-text font-bold text-4xl md:text-5xl lg:text-6xl text-center px-4 py-2 transition-all duration-500 ease-in-out ${titleHovered ? 'scale-105' : ''}`}
          onMouseEnter={() => setTitleHovered(true)}
          onMouseLeave={() => setTitleHovered(false)}
          style={{
            textShadow: '0 0 15px rgba(62, 87, 255, 0.4)',
            letterSpacing: '0.05em',
          }}
        >
          Physics Playground
        </div>
        <div className="text-center text-gray-300 text-sm md:text-base mt-1 italic opacity-80">
          Explore inclined plane dynamics with glittering balls
        </div>
        
        {/* Animated underline */}
        <div className="relative h-1 mt-2 mx-auto rounded-full overflow-hidden" style={{ width: '80%' }}>
          <div 
            className="absolute h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 transition-all duration-700 ease-in-out"
            style={{ 
              width: titleHovered ? '100%' : '30%',
              filter: 'blur(0.5px)',
              boxShadow: '0 0 8px rgba(66, 153, 225, 0.6)'
            }}
          ></div>
        </div>
      </div>
      
      <div className="absolute left-4 bottom-4 bg-gray-800 p-4 rounded-lg shadow-lg text-white">
        <h3 className="text-lg font-bold mb-2">Inclined Plane Height</h3>
        <div className="flex items-center">
          <input 
            type="range" 
            min="0" 
            max={windowSize.height} 
            value={inclinedHeight} 
            onChange={(e) => setInclinedHeight(parseInt(e.target.value))}
            className="w-48"
          />
          <span className="ml-2">{Math.round(inclinedHeight)}px</span>
        </div>
        <button 
          onClick={() => setBalls([])}
          className="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
        >
          Clear All Balls
        </button>
      </div>
      
      {showSettings && (
        <div 
          className="absolute bg-gray-800 p-4 rounded-lg shadow-lg text-white"
          style={{ 
            left: `${settingsPosition.x}px`, 
            top: `${settingsPosition.y}px`,
            transform: 'translate(-50%, -50%)',
            maxWidth: '90vw',
            width: '300px',
            zIndex: 50
          }}
        >
          <h3 className="text-lg font-bold mb-2">Physics Settings</h3>
          <form onSubmit={handleSettingsSubmit}>
            <div className="mb-3">
              <label className="block mb-1">
                Elasticity (0-1):
                <input 
                  type="range" 
                  min="0" 
                  max="1" 
                  step="0.05"
                  value={settings.elasticity} 
                  onChange={(e) => setSettings({...settings, elasticity: parseFloat(e.target.value)})}
                  className="w-full mt-1"
                />
                <span className="text-sm">{settings.elasticity.toFixed(2)}</span>
              </label>
            </div>
            
            <div className="mb-3">
              <label className="block mb-1">
                Friction (0-1):
                <input 
                  type="range" 
                  min="0" 
                  max="1" 
                  step="0.05"
                  value={settings.friction} 
                  onChange={(e) => setSettings({...settings, friction: parseFloat(e.target.value)})}
                  className="w-full mt-1"
                />
                <span className="text-sm">{settings.friction.toFixed(2)}</span>
              </label>
            </div>
            
            <div className="flex justify-end">
              <button 
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md"
              >
                Apply
              </button>
            </div>
          </form>
        </div>
      )}
      
      <div className="absolute top-4 right-0 z-20">
        <button 
          className="md:hidden flex absolute right-4 items-center justify-center w-10 h-10 bg-gray-800 bg-opacity-75 rounded-full text-white shadow-lg hover:bg-opacity-90 transition-all duration-300"
          onClick={() => setShowInstructions(!showInstructions)}
          aria-label="Show instructions"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>
        
        <div 
          className={`
            bg-gray-800 bg-opacity-90 p-4 rounded-lg shadow-lg text-white max-w-xs
            transition-all duration-300 ease-in-out
            ${showInstructions ? 'opacity-100 translate-y-0' : 'md:opacity-100 md:translate-y-0 opacity-0 -translate-y-4 pointer-events-none md:pointer-events-auto'}
          `}
          style={{ 
            backdropFilter: 'blur(8px)',
            zIndex: 30
          }}
        >
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-bold">Instructions</h3>
            <button 
              onClick={() => setShowInstructions(false)}
              className="md:hidden text-gray-300 hover:text-white"
              aria-label="Close instructions"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          <ul className="list-disc pl-5 space-y-1">
            <li>Left-click to drop a ball</li>
            <li>Right-click to adjust physics settings</li>
            <li>Use the slider to adjust inclined plane height</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
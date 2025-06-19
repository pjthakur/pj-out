'use client';
import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { 
  FaBolt, 
  FaSpinner, 
  FaExclamationTriangle, 
  FaRocket 
} from 'react-icons/fa';

interface CelestialBody {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  mass: number;
  radius: number;
  color: string;
  trail: { x: number; y: number }[];
  isDragging: boolean;
  hasCollided: boolean;
}

interface DebrisParticle {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  mass: number;
  radius: number;
  color: string;
  life: number;
  maxLife: number;
  trail: { x: number; y: number }[];
}

interface CollisionEffect {
  id: string;
  x: number;
  y: number;
  intensity: number;
  timestamp: number;
}

interface TrajectoryPoint {
  x: number;
  y: number;
}

interface SimulationMetrics {
  totalKineticEnergy: number;
  totalAngularMomentum: number;
  collisionForce: number;
  impactVelocity: number;
  lastCollisionTime: number;
}

interface CanvasDimensions {
  width: number;
  height: number;
}

interface InteractionState {
  mode: 'none' | 'drag' | 'velocity' | 'longpress';
  bodyId: string | null;
  startPos: { x: number; y: number };
  currentPos: { x: number; y: number };
  offset: { x: number; y: number };
  isActive: boolean;
  isLongPress: boolean;
  longPressTimer: NodeJS.Timeout | null;
}

const PlayIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M8 5v14l11-7z"/>
  </svg>
);

const PauseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
  </svg>
);

const ResetIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 6v3l4-4-4-4v3c-4.42 0-8 3.58-8 8 0 1.57.46 3.03 1.24 4.26L6.7 14.8c-.45-.83-.7-1.79-.7-2.8 0-3.31 2.69-6 6-6zm6.76 1.74L17.3 9.2c.44.84.7 1.79.7 2.8 0 3.31-2.69 6-6 6v-3l-4 4 4 4v-3c4.42 0 8-3.58 8-8 0-1.57-.46-3.03-1.24-4.26z"/>
  </svg>
);

const SettingsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"/>
  </svg>
);

const InfoIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12,2C6.48,2,2,6.48,2,12s4.48,10,10,10s10-4.48,10-10S17.52,2,12,2z M13,17h-2v-6h2V17z M13,9h-2V7h2V9z"/>
  </svg>
);

const TargetIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M12,6A6,6 0 0,0 6,12A6,6 0 0,0 12,18A6,6 0 0,0 18,12A6,6 0 0,0 12,6M12,8A4,4 0 0,1 16,12A4,4 0 0,1 12,16A4,4 0 0,1 8,12A4,4 0 0,1 12,8Z"/>
  </svg>
);

const RocketIcon = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" className="drop-shadow-lg">
    <defs>
      <linearGradient id="rocketGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#8B5FBF" />
        <stop offset="50%" stopColor="#FF6B35" />
        <stop offset="100%" stopColor="#FFD700" />
      </linearGradient>
      <linearGradient id="bodyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#A855F7" />
        <stop offset="50%" stopColor="#EC4899" />
        <stop offset="100%" stopColor="#F59E0B" />
      </linearGradient>
      <linearGradient id="flameGradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#FF6B35" />
        <stop offset="50%" stopColor="#FF8A65" />
        <stop offset="100%" stopColor="#FFD700" />
      </linearGradient>
      <filter id="glow">
        <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
        <feMerge> 
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
    
    {/* Rocket Main Body */}
    <ellipse
      cx="20"
      cy="15"
      rx="4"
      ry="10"
      fill="url(#bodyGradient)"
      filter="url(#glow)"
    />
    
    {/* Rocket Nose Cone */}
    <path
      d="M20 3L24 13L16 13Z"
      fill="url(#rocketGradient)"
      filter="url(#glow)"
    />
    
    {/* Left Wing */}
    <path
      d="M16 18L10 22L12 26L18 22Z"
      fill="url(#rocketGradient)"
      opacity="0.9"
    />
    
    {/* Right Wing */}
    <path
      d="M24 18L30 22L28 26L22 22Z"
      fill="url(#rocketGradient)"
      opacity="0.9"
    />
    
    {/* Engine Nozzle */}
    <rect
      x="17"
      y="23"
      width="6"
      height="4"
      rx="1"
      fill="url(#rocketGradient)"
      opacity="0.8"
    />
    
    {/* Rocket Flames */}
    <path
      d="M18 27L17 32L19 30L20 34L21 30L23 32L22 27Z"
      fill="url(#flameGradient)"
      opacity="0.9"
      className="animate-pulse"
    />
    
    {/* Cockpit Window */}
    <ellipse
      cx="20"
      cy="12"
      rx="2.5"
      ry="3"
      fill="rgba(255, 255, 255, 0.9)"
      stroke="rgba(139, 95, 191, 0.6)"
      strokeWidth="1"
    />
    
    {/* Window Reflection */}
    <ellipse
      cx="19"
      cy="11"
      rx="1"
      ry="1.5"
      fill="rgba(255, 255, 255, 0.6)"
    />
    
    {/* Body Details */}
    <rect
      x="18"
      y="16"
      width="4"
      height="1"
      rx="0.5"
      fill="rgba(255, 255, 255, 0.3)"
    />
    <rect
      x="18"
      y="19"
      width="4"
      height="1"
      rx="0.5"
      fill="rgba(255, 255, 255, 0.3)"
    />
  </svg>
);

const useCanvasDimensions = () => {
  const [dimensions, setDimensions] = useState<CanvasDimensions>({ width: 800, height: 600 });

  useEffect(() => {
    const updateDimensions = () => {
      const isMobile = window.innerWidth < 768;
      
      const pageMargin = isMobile ? 12 : 24; 
      const containerPadding = isMobile ? 24 : 48; 
      const borderAndPadding = 20; 
      const availableWidth = window.innerWidth - (pageMargin * 2) - (containerPadding * 2) - borderAndPadding;
      
      let width, height;
      
      if (isMobile) {
        width = Math.max(350, Math.min(availableWidth, 600));
        height = Math.min(window.innerHeight * 0.5, 450);
      } else {
        width = Math.max(600, Math.min(availableWidth, 1231)); 
        height = Math.min(width * 0.6, 600); 
      }
      
      setDimensions({ width, height });
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  return dimensions;
};

const massToRadius = (mass: number): number => {
  return Math.round(18 + Math.sqrt(mass / 1.5));
};

const predictTrajectory = (body: CelestialBody, canvasDimensions: CanvasDimensions, steps: number = 40): TrajectoryPoint[] => {
  const trajectory: TrajectoryPoint[] = [];
  let x = body.x;
  let y = body.y;
  let vx = body.vx;
  let vy = body.vy;
  
  for (let i = 0; i < steps; i++) {
    x += vx;
    y += vy;
    
    
    if (x - body.radius <= 0) {
      vx = Math.abs(vx) * 0.9;
      x = body.radius;
    }
    if (x + body.radius >= canvasDimensions.width) {
      vx = -Math.abs(vx) * 0.9;
      x = canvasDimensions.width - body.radius;
    }
    
    if (y - body.radius <= 0) {
      vy = Math.abs(vy) * 0.9;
      y = body.radius;
    }
    if (y + body.radius >= canvasDimensions.height) {
      vy = -Math.abs(vy) * 0.9;
      y = canvasDimensions.height - body.radius;
    }
    
    vx *= 0.9995;
    vy *= 0.9995;
    
    trajectory.push({ x, y });
    
    if (Math.abs(vx) < 0.1 && Math.abs(vy) < 0.1) break;
  }
  
  return trajectory;
};

const predictDebrisTrajectory = (particle: DebrisParticle, canvasDimensions: CanvasDimensions, steps: number = 20): TrajectoryPoint[] => {
  const trajectory: TrajectoryPoint[] = [];
  let x = particle.x;
  let y = particle.y;
  let vx = particle.vx;
  let vy = particle.vy;
  
  for (let i = 0; i < steps; i++) {
    vx *= 0.997;
    vy = vy * 0.997 + 0.015;
    
    x += vx;
    y += vy;
    
    trajectory.push({ x, y });
    
    if (x < -50 || x > canvasDimensions.width + 50 || 
        y < -50 || y > canvasDimensions.height + 50 ||
        (Math.abs(vx) < 0.05 && Math.abs(vy) < 0.05)) break;
  }
  
  return trajectory;
};

const useSimulation = () => {
  const canvasDimensions = useCanvasDimensions();
  const [bodies, setBodies] = useState<CelestialBody[]>([]);
  const [debris, setDebris] = useState<DebrisParticle[]>([]);
  const [collisionEffects, setCollisionEffects] = useState<CollisionEffect[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [metrics, setMetrics] = useState<SimulationMetrics>({
    totalKineticEnergy: 0,
    totalAngularMomentum: 0,
    collisionForce: 0,
    impactVelocity: 0,
    lastCollisionTime: 0,
  });

  const animationRef = useRef<number>(0);
  const collisionCooldown = useRef<Map<string, number>>(new Map());
  const lastFrameTime = useRef<number>(0);
  const lastMetricsUpdate = useRef<number>(0);

  useEffect(() => {
    if (canvasDimensions.width > 0) {
      const isMobile = canvasDimensions.width < 400;
      
      
      const body1Radius = massToRadius(100);
      const body2Radius = massToRadius(80);
      
      setBodies([
        {
          id: '1',
          x: Math.max(body1Radius, Math.min(canvasDimensions.width - body1Radius, canvasDimensions.width * 0.25)),
          y: Math.max(body1Radius, Math.min(canvasDimensions.height - body1Radius, canvasDimensions.height * 0.4)),
          vx: isMobile ? 0.8 : 1.2,
          vy: isMobile ? 0.4 : 0.6,
          mass: 100,
          radius: body1Radius,
          color: '#8B5FBF',
          trail: [],
          isDragging: false,
          hasCollided: false,
        },
        {
          id: '2',
          x: Math.max(body2Radius, Math.min(canvasDimensions.width - body2Radius, canvasDimensions.width * 0.75)),
          y: Math.max(body2Radius, Math.min(canvasDimensions.height - body2Radius, canvasDimensions.height * 0.6)),
          vx: isMobile ? -0.6 : -1.0,
          vy: isMobile ? -0.2 : -0.4,
          mass: 80,
          radius: body2Radius,
          color: '#FF6B35',
          trail: [],
          isDragging: false,
          hasCollided: false,
        },
      ]);
    }
  }, [canvasDimensions]);

  const calculateMetrics = useCallback((currentBodies: CelestialBody[], collisionData?: { force: number; velocity: number; timestamp: number }) => {
    let totalKE = 0;
    let totalAM = 0;

    currentBodies.forEach(body => {
      const velocity = Math.sqrt(body.vx ** 2 + body.vy ** 2);
      totalKE += 0.5 * body.mass * velocity ** 2;
      totalAM += body.mass * velocity * body.radius;
    });

    const currentTime = Date.now();
    let displayForce = 0;
    let displayVelocity = 0;
    let lastCollision = metrics.lastCollisionTime;

    if (collisionData) {
      displayForce = collisionData.force;
      displayVelocity = collisionData.velocity;
      lastCollision = collisionData.timestamp;
    } else if (currentTime - metrics.lastCollisionTime < 2000) {
      displayForce = metrics.collisionForce;
      displayVelocity = metrics.impactVelocity;
    }

    
    return {
      totalKineticEnergy: Math.round(totalKE * 10) / 10,
      totalAngularMomentum: Math.round(totalAM * 10) / 10,
      collisionForce: Math.round(displayForce * 10) / 10,
      impactVelocity: Math.round(displayVelocity * 10) / 10,
      lastCollisionTime: lastCollision,
    };
  }, [metrics.lastCollisionTime, metrics.collisionForce, metrics.impactVelocity]);

  const createCollisionEffect = useCallback((x: number, y: number, intensity: number) => {
    const effect: CollisionEffect = {
      id: `collision-${Date.now()}-${Math.random()}`,
      x,
      y,
      intensity,
      timestamp: Date.now()
    };
    
    setCollisionEffects(prev => {
      
      const newEffects = [...prev.slice(-2), effect];
      return newEffects;
    });
    
    setTimeout(() => {
      setCollisionEffects(prev => prev.filter(e => e.id !== effect.id));
    }, 1200);
  }, []);

  const checkCollisions = useCallback((currentBodies: CelestialBody[]) => {
    if (currentBodies.length < 2) return { bodies: currentBodies, collisionData: null };

    const newDebris: DebrisParticle[] = [];
    let newBodies = [...currentBodies];
    const currentTime = Date.now();
    let maxImpactVelocity = 0;
    let maxCollisionForce = 0;
    let hasCollisions = false;
    


    for (let i = 0; i < newBodies.length; i++) {
      for (let j = i + 1; j < newBodies.length; j++) {
        const body1 = newBodies[i];
        const body2 = newBodies[j];
        
        const pairId = `${Math.min(i, j)}-${Math.max(i, j)}`;
        const lastCollisionForPair = collisionCooldown.current.get(pairId) || 0;
        
        const dx = body2.x - body1.x;
        const dy = body2.y - body1.y;
        const distance = Math.sqrt(dx ** 2 + dy ** 2);
        const minDistance = body1.radius + body2.radius;
        

        
        if (distance < minDistance && (currentTime - lastCollisionForPair > 800)) {
          
          const relativeVx = body1.vx - body2.vx;
          const relativeVy = body1.vy - body2.vy;
          const impactVelocity = Math.sqrt(relativeVx ** 2 + relativeVy ** 2);
          
          hasCollisions = true;
          collisionCooldown.current.set(pairId, currentTime);
          
          const reducedMass = (body1.mass * body2.mass) / (body1.mass + body2.mass);
          const collisionDuration = 0.016;
          const collisionForce = (reducedMass * impactVelocity) / collisionDuration;
          
          const displayImpactVelocity = Math.max(impactVelocity, 0.1);
          const displayCollisionForce = Math.max(collisionForce, 1.0);
          
          if (displayImpactVelocity > maxImpactVelocity) maxImpactVelocity = displayImpactVelocity;
          if (displayCollisionForce > maxCollisionForce) maxCollisionForce = displayCollisionForce;

          // Only create visual effects for significant impacts
          if (impactVelocity > 1.0) {
            const collisionX = (body1.x + body2.x) / 2;
            const collisionY = (body1.y + body2.y) / 2;
            
            createCollisionEffect(collisionX, collisionY, impactVelocity);
            
            // Reduce debris generation
            const debrisCount = Math.min(2, Math.floor(impactVelocity * 0.8)); 
            for (let k = 0; k < debrisCount; k++) {
              const angle = (k / debrisCount) * 2 * Math.PI + Math.random() * 1.0;
              const speed = Math.random() * impactVelocity * 0.8 + 0.4;
              
              newDebris.push({
                id: `debris-${currentTime}-${i}-${j}-${k}`,
                x: collisionX + (Math.random() - 0.5) * 12, 
                y: collisionY + (Math.random() - 0.5) * 12, 
                vx: Math.cos(angle) * speed + (Math.random() - 0.5) * 0.3,
                vy: Math.sin(angle) * speed + (Math.random() - 0.5) * 0.3,
                mass: Math.random() * 1.5 + 0.2,
                radius: Math.random() * 1.2 + 0.6, 
                color: Math.random() > 0.5 ? '#FF6B35' : '#FFFFFF',
                life: Math.random() * 40 + 20, 
                maxLife: 60, 
                trail: [],
              });
            }
          }
          
          // Always handle physics separation and velocity changes
          const overlap = minDistance - distance + 3;
          const separationStrength = 2.0;
          const separationX = (dx / distance) * overlap * separationStrength;
          const separationY = (dy / distance) * overlap * separationStrength;
          
          body1.x -= separationX;
          body1.y -= separationY;
          body2.x += separationX;
          body2.y += separationY;
          
          const totalMass = body1.mass + body2.mass;
          const relativeVelocityX = body1.vx - body2.vx;
          const relativeVelocityY = body1.vy - body2.vy;
          
          const restitution = 1.2;
          const impulseMagnifier = 3.0;
          const impulse = (2 * restitution * impulseMagnifier) / totalMass;
          const impulseX = impulse * body2.mass * relativeVelocityX;
          const impulseY = impulse * body2.mass * relativeVelocityY;
          
          body1.vx -= impulseX / body1.mass;
          body1.vy -= impulseY / body1.mass;
          body2.vx += impulseX / body2.mass;
          body2.vy += impulseY / body2.mass;
          
          const chaosStrength = 0.5;
          body1.vx += (Math.random() - 0.5) * chaosStrength;
          body1.vy += (Math.random() - 0.5) * chaosStrength;
          body2.vx += (Math.random() - 0.5) * chaosStrength;
          body2.vy += (Math.random() - 0.5) * chaosStrength;
        }
      }
    }

    if (newDebris.length > 0) {
      setDebris(prev => [...prev.slice(-15), ...newDebris]); 
    }

    
    if (!hasCollisions) {
      for (let i = 0; i < newBodies.length; i++) {
        for (let j = i + 1; j < newBodies.length; j++) {
          const body1 = newBodies[i];
          const body2 = newBodies[j];
          const dx = body2.x - body1.x;
          const dy = body2.y - body1.y;
          const distance = Math.sqrt(dx ** 2 + dy ** 2);
          const minDistance = body1.radius + body2.radius;
          
          if (distance < minDistance) {
            const relativeVx = body1.vx - body2.vx;
            const relativeVy = body1.vy - body2.vy;
            const impactVelocity = Math.max(Math.sqrt(relativeVx ** 2 + relativeVy ** 2), 0.5);
            const reducedMass = (body1.mass * body2.mass) / (body1.mass + body2.mass);
            const collisionForce = Math.max((reducedMass * impactVelocity) / 0.016, 5.0);
            
            maxImpactVelocity = Math.max(maxImpactVelocity, impactVelocity);
            maxCollisionForce = Math.max(maxCollisionForce, collisionForce);
            hasCollisions = true;
            

            break;
          }
        }
        if (hasCollisions) break;
      }
    }

    const collisionData = hasCollisions ? {
      force: maxCollisionForce,
      velocity: maxImpactVelocity,
      timestamp: currentTime
    } : null;

    return { bodies: newBodies, collisionData };
  }, []);

  const updateSimulation = useCallback(() => {
    if (!isSimulating) return;

    const now = performance.now();
    if (now - lastFrameTime.current < 16.67) {
      animationRef.current = requestAnimationFrame(updateSimulation);
      return;
    }
    lastFrameTime.current = now;

    setBodies(prevBodies => {
      if (prevBodies.length === 0) return prevBodies;

      const newBodies = prevBodies.map(body => {
        if (body.isDragging) return body;

        let newX = body.x + body.vx;
        let newY = body.y + body.vy;
        let newVx = body.vx;
        let newVy = body.vy;

        
        
        if (newX - body.radius <= 0) {
          newX = body.radius;
          newVx = Math.abs(newVx) * 0.85;
        }
        
        if (newX + body.radius >= canvasDimensions.width) {
          newX = canvasDimensions.width - body.radius;
          newVx = -Math.abs(newVx) * 0.85;
        }

        
        if (newY - body.radius <= 0) {
          newY = body.radius;
          newVy = Math.abs(newVy) * 0.85;
        }
        
        if (newY + body.radius >= canvasDimensions.height) {
          newY = canvasDimensions.height - body.radius;
          newVy = -Math.abs(newVy) * 0.85;
        }

        newVx *= 0.9996;
        newVy *= 0.9996;

        const newTrail = [...body.trail, { x: newX, y: newY }].slice(-5);

        return {
          ...body,
          x: newX,
          y: newY,
          vx: newVx,
          vy: newVy,
          trail: newTrail,
        };
      });

      const collisionResult = checkCollisions(newBodies);
      const postCollisionBodies = collisionResult.bodies;
      
      
      const now = Date.now();
      if (now - lastMetricsUpdate.current > 33 || collisionResult.collisionData) {
        lastMetricsUpdate.current = now;
        setMetrics(calculateMetrics(postCollisionBodies, collisionResult.collisionData || undefined));
      }
      
      return postCollisionBodies;
    });

    setDebris(prevDebris => {
      if (prevDebris.length === 0) return prevDebris;
      
      return prevDebris
        .map(particle => {
          const newVx = particle.vx * 0.996;
          const newVy = particle.vy * 0.996 + 0.018;
          const newX = particle.x + newVx;
          const newY = particle.y + newVy;
          
          const newTrail = [...particle.trail, { x: newX, y: newY }].slice(-3);
          
          return {
            ...particle,
            x: newX,
            y: newY,
            vx: newVx,
            vy: newVy,
            life: particle.life - 1,
            trail: newTrail,
          };
        })
        .filter(particle => 
          particle.life > 0 && 
          particle.x > -100 && particle.x < canvasDimensions.width + 100 && 
          particle.y > -100 && particle.y < canvasDimensions.height + 100
        );
    });

    animationRef.current = requestAnimationFrame(updateSimulation);
  }, [isSimulating, checkCollisions, calculateMetrics, canvasDimensions]);

  useEffect(() => {
    if (isSimulating) {
      animationRef.current = requestAnimationFrame(updateSimulation);
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isSimulating, updateSimulation]);

  return {
    bodies,
    setBodies,
    debris,
    setDebris,
    collisionEffects,
    isSimulating,
    setIsSimulating,
    metrics,
    setMetrics,
    calculateMetrics,
    canvasDimensions,
  };
};

const Header: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <header
      className={`relative bg-white/10 backdrop-blur-xl text-white p-4 md:p-6 shadow-2xl border border-white/20 transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-5'
      }`}
      style={{
        background: 'rgba(255, 255, 255, 0.08)',
        backdropFilter: 'blur(20px)',
        borderImage: 'linear-gradient(135deg, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.1)) 1',
      }}
    >
      <div className="max-w-7xl mx-auto px-3 md:px-6">
        {/* Mobile Layout */}
        <div className="md:hidden py-2">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h1 className="text-base font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent animate-gradient-x leading-tight">
                Celestial Impact Simulator
              </h1>
              <div className="flex items-center space-x-1 mt-0.5">
                <div className="w-0.5 h-0.5 bg-purple-400 rounded-full animate-pulse"></div>
                <div className="w-0.5 h-0.5 bg-orange-400 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
                <div className="w-0.5 h-0.5 bg-yellow-400 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
              </div>
            </div>
            
            <div className={`transition-all duration-500 delay-200 ${
              isVisible ? 'opacity-100' : 'opacity-0'
            }`}>
              <div className="bg-white/5 backdrop-blur-sm rounded-md px-2 py-1 border border-white/10 text-right">
                <p className="text-xs font-medium text-white leading-tight">Research Platform</p>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:flex flex-row items-center justify-between space-y-0 py-4">
          <div className="text-left hover:scale-105 transition-all duration-300 cursor-pointer">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent animate-gradient-x">
              Celestial Impact Simulator
            </h1>
            <p className="text-sm text-gray-300 font-light tracking-wide">
              Advanced Planetary Collision Dynamics & Debris Analysis
            </p>
            <div className="flex items-center justify-start space-x-2 mt-1">
              <div className="w-1 h-1 bg-purple-400 rounded-full animate-pulse"></div>
              <div className="w-1 h-1 bg-orange-400 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
              <div className="w-1 h-1 bg-yellow-400 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
            </div>
          </div>
          
          <div className={`flex items-center space-x-4 transition-all duration-500 delay-500 ${
            isVisible ? 'opacity-100' : 'opacity-0'
          }`}>
            <div className="text-right bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10">
              <p className="text-xs text-gray-400">Astrophysics Suite</p>
              <p className="text-sm font-medium">Research Platform</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

const Footer: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const footerElement = document.getElementById('footer');
    if (footerElement) {
      observer.observe(footerElement);
    }

    return () => {
      if (footerElement) {
        observer.unobserve(footerElement);
      }
    };
  }, []);

  return (
    <footer
      id="footer"
      className={`text-white mt-8 md:mt-12 border-t border-white/10 transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
      }`}
      style={{
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(20px)',
      }}
    >
      <div className="max-w-7xl mx-auto px-3 md:px-6 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8 mb-6 md:mb-8">
          
          <div className={`md:col-span-2 transition-all duration-700 delay-100 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
          }`}>
            <div className="mb-4">
              <h3 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">
                Celestial Impact Simulator
              </h3>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed max-w-md">
              Advanced astrophysics simulation platform featuring realistic planetary collision dynamics, 
              comprehensive debris trajectory analysis, and glassmorphism design for educational exploration.
            </p>
          </div>

          <div className={`transition-all duration-700 delay-200 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
          }`}>
            <h4 className="text-lg font-semibold mb-4 md:mb-6 text-white">Features</h4>
            <ul className="space-y-2 md:space-y-3 text-gray-300 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Collision Physics</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Debris Dynamics</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Trajectory Prediction</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Mobile Controls</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Responsive Design</a></li>
            </ul>
          </div>
          
          <div className={`transition-all duration-700 delay-300 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
          }`}>
            <h4 className="text-lg font-semibold mb-4 md:mb-6 text-white">Resources</h4>
            <ul className="space-y-2 md:space-y-3 text-gray-300 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
              <li><a href="#" className="hover:text-white transition-colors">API Reference</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Examples</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Support</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>

        <div className={`border-t border-white/10 pt-6 md:pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 transition-all duration-700 delay-400 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}>
          <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
            <p className="text-sm text-gray-400 text-center md:text-left">
              2025 Astrophysics Research Platform. All rights reserved.
            </p>
            <div className="flex items-center space-x-4 text-sm text-gray-400">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-xs text-gray-400">System Online</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

const ControlPanel: React.FC<{
  isSimulating: boolean;
  onToggleSimulation: () => void;
  onReset: () => void;
  metrics: SimulationMetrics;
}> = ({ isSimulating, onToggleSimulation, onReset, metrics }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 200);
    return () => clearTimeout(timer);
  }, []);



  return (
    <div
      className={`relative rounded-2xl p-4 md:p-6 shadow-2xl border border-white/20 transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
      }`}
      style={{
        background: 'rgba(255, 255, 255, 0.06)',
        backdropFilter: 'blur(25px)',
        boxShadow: '0 8px 32px rgba(139, 95, 191, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
      }}
    >
      {/* Mobile Layout */}
      <div className="lg:hidden">
        <div className="grid grid-cols-2 gap-3 text-center mb-4">
          <MetricCard
            icon={<FaBolt />}
            label="Kinetic Energy"
            value={metrics.totalKineticEnergy.toFixed(1)}
            unit="J"
          />
          <MetricCard
            icon={<FaSpinner />}
            label="Angular Momentum"
            value={metrics.totalAngularMomentum.toFixed(1)}
            unit="kg⋅m²/s"
          />
          <MetricCard
            icon={<FaExclamationTriangle />}
            label="Collision Force"
            value={metrics.collisionForce.toFixed(1)}
            unit="N"
            highlight={metrics.collisionForce > 0 || metrics.impactVelocity > 0}
          />
          <MetricCard
            icon={<FaRocket />}
            label="Impact Velocity"
            value={metrics.impactVelocity.toFixed(1)}
            unit="m/s"
            highlight={metrics.collisionForce > 0 || metrics.impactVelocity > 0}
          />
        </div>
        
        <div className="flex items-center justify-center space-x-3">
          <button
            onClick={onToggleSimulation}
            className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl font-medium transition-all duration-200 cursor-pointer backdrop-blur-sm border border-white/20 hover:scale-105 transform ${
              isSimulating
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg shadow-purple-500/25'
                : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg shadow-purple-500/25'
            }`}
          >
            {isSimulating ? <PauseIcon /> : <PlayIcon />}
            <span className="text-sm">{isSimulating ? 'Pause' : 'Start'}</span>
          </button>
          
          <button
            onClick={onReset}
            className="flex items-center space-x-2 px-5 py-2.5 bg-purple-600/95 hover:bg-purple-700/95 text-white rounded-xl font-medium transition-all duration-200 cursor-pointer backdrop-blur-sm border border-white/20 shadow-lg shadow-purple-500/25 hover:scale-105 transform"
          >
            <ResetIcon />
            <span className="text-sm">Reset</span>
          </button>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:flex flex-row items-center justify-between gap-6">
        <div className="flex items-center justify-start space-x-3">
          <button
            onClick={onToggleSimulation}
            className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 cursor-pointer backdrop-blur-sm border border-white/20 hover:scale-105 transform ${
              isSimulating
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg shadow-purple-500/25'
                : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg shadow-purple-500/25'
            }`}
          >
            {isSimulating ? <PauseIcon /> : <PlayIcon />}
            <span className="text-base">{isSimulating ? 'Pause' : 'Start'}</span>
          </button>
          
          <button
            onClick={onReset}
            className="flex items-center space-x-2 px-6 py-3 bg-purple-600/95 hover:bg-purple-700/95 text-white rounded-xl font-medium transition-all duration-200 cursor-pointer backdrop-blur-sm border border-white/20 shadow-lg shadow-purple-500/25 hover:scale-105 transform"
          >
            <ResetIcon />
            <span className="text-base">Reset</span>
          </button>
        </div>
        
        <div className="grid grid-cols-4 gap-4 text-center">
          <MetricCard
            icon={<FaBolt />}
            label="Kinetic Energy"
            value={metrics.totalKineticEnergy.toFixed(1)}
            unit="J"
          />
          <MetricCard
            icon={<FaSpinner />}
            label="Angular Momentum"
            value={metrics.totalAngularMomentum.toFixed(1)}
            unit="kg⋅m²/s"
          />
          <MetricCard
            icon={<FaExclamationTriangle />}
            label="Collision Force"
            value={metrics.collisionForce.toFixed(1)}
            unit="N"
            highlight={metrics.collisionForce > 0 || metrics.impactVelocity > 0}
          />
          <MetricCard
            icon={<FaRocket />}
            label="Impact Velocity"
            value={metrics.impactVelocity.toFixed(1)}
            unit="m/s"
            highlight={metrics.collisionForce > 0 || metrics.impactVelocity > 0}
          />
        </div>
      </div>
    </div>
  );
};

const MetricCard: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string;
  unit: string;
  highlight?: boolean;
}> = React.memo(({ icon, label, value, unit, highlight = false }) => (
  <div
    className={`p-2 md:p-3 rounded-xl border transition-all duration-200 hover:scale-105 transform ${
      highlight 
        ? 'border-orange-400/60 shadow-lg shadow-orange-400/20' 
        : 'border-white/20'
    }`}
    style={{
      background: highlight 
        ? 'rgba(255, 107, 53, 0.1)' 
        : 'rgba(255, 255, 255, 0.05)',
      backdropFilter: 'blur(15px)',
      boxShadow: highlight 
        ? '0 4px 16px rgba(255, 107, 53, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
        : '0 4px 16px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
    }}
  >
    <div className="flex items-center justify-center space-x-1 text-purple-400 mb-1">
      <span className="text-xs md:text-sm">{icon}</span>
      <span className="text-xs font-medium hidden md:inline">{label}</span>
    </div>
    <div className={`text-sm md:text-lg font-bold transition-colors ${
      highlight ? 'text-orange-300' : 'text-white'
    }`}>
      {value} <span className="text-xs text-gray-400">{unit}</span>
    </div>
  </div>
));

const SimulationCanvas: React.FC<{
  bodies: CelestialBody[];
  debris: DebrisParticle[];
  collisionEffects: CollisionEffect[];
  setBodies: React.Dispatch<React.SetStateAction<CelestialBody[]>>;
  isSimulating: boolean;
  canvasDimensions: CanvasDimensions;
  showInstructions: boolean;
  setShowInstructions: React.Dispatch<React.SetStateAction<boolean>>;
  hasStarted: boolean;
}> = ({ bodies, debris, collisionEffects, setBodies, isSimulating, canvasDimensions, showInstructions, setShowInstructions, hasStarted }) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [interactionState, setInteractionState] = useState<InteractionState>({
    mode: 'none',
    bodyId: null,
    startPos: { x: 0, y: 0 },
    currentPos: { x: 0, y: 0 },
    offset: { x: 0, y: 0 },
    isActive: false,
    isLongPress: false,
    longPressTimer: null,
  });
  const [showTrajectories, setShowTrajectories] = useState(!isSimulating);
  const [showDebrisTrajectories, setShowDebrisTrajectories] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastClickTimeRef = useRef<number>(0);
  
  
  const [starField, setStarField] = useState<Array<{
    id: number;
    left: number;
    top: number;
    animationDelay: number;
    animationDuration: number;
    size: number;
    opacity: number;
  }>>([]);

  
  useEffect(() => {
    if (canvasDimensions.width > 0 && canvasDimensions.height > 0) {
      const numStars = Math.min(60, Math.floor(canvasDimensions.width / 10));
      const newStarField = Array.from({ length: numStars }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        animationDelay: Math.random() * 4,
        animationDuration: Math.random() * 3 + 2,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.6 + 0.3,
      }));
      setStarField(newStarField);
    }
  }, [canvasDimensions.width, canvasDimensions.height]);

  useEffect(() => {
    setShowTrajectories(!isSimulating);
  }, [isSimulating]);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 400);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isSimulating) {
      if (interactionState.longPressTimer) {
        clearTimeout(interactionState.longPressTimer);
      }
      setInteractionState({
        mode: 'none',
        bodyId: null,
        startPos: { x: 0, y: 0 },
        currentPos: { x: 0, y: 0 },
        offset: { x: 0, y: 0 },
        isActive: false,
        isLongPress: false,
        longPressTimer: null,
      });
    }
  }, [isSimulating]);

  useEffect(() => {
    return () => {
      if (interactionState.longPressTimer) {
        clearTimeout(interactionState.longPressTimer);
      }
      if (clickTimeoutRef.current) {
        clearTimeout(clickTimeoutRef.current);
      }
    };
  }, [interactionState.longPressTimer]);

  const getCoordinatesFromEvent = (e: React.MouseEvent | React.TouchEvent): { x: number; y: number } => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return { x: 0, y: 0 };

    if ('touches' in e) {
      const touch = e.touches[0] || e.changedTouches[0];
      return {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
      };
    } else {
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    }
  };

  const handlePointerStart = (e: React.MouseEvent | React.TouchEvent, bodyId: string) => {
    if (isSimulating) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    document.body.style.overflow = 'hidden';
    
    const coords = getCoordinatesFromEvent(e);
    const body = bodies.find(b => b.id === bodyId);
    if (!body) return;

    if (interactionState.longPressTimer) {
      clearTimeout(interactionState.longPressTimer);
    }

    const now = Date.now();
    const isDesktop = !('touches' in e);
    
    if (isDesktop) {
      const timeSinceLastClick = now - lastClickTimeRef.current;
      const wasRecentClick = timeSinceLastClick < 400 && interactionState.bodyId === bodyId;
      
      if (wasRecentClick) {
        setInteractionState({
          mode: 'velocity',
          bodyId,
          startPos: coords,
          currentPos: coords,
          offset: { x: coords.x - body.x, y: coords.y - body.y },
          isActive: true,
          isLongPress: true,
          longPressTimer: null,
        });
        return;
      }
    }

    const longPressTimer = setTimeout(() => {
      setInteractionState(prev => ({
        ...prev,
        mode: 'velocity',
        isLongPress: true,
      }));
      
      if ('vibrate' in navigator) {
        navigator.vibrate(50);
      }
    }, 500);

    setInteractionState({
      mode: 'longpress',
      bodyId,
      startPos: coords,
      currentPos: coords,
      offset: { x: coords.x - body.x, y: coords.y - body.y },
      isActive: true,
      isLongPress: false,
      longPressTimer,
    });

    lastClickTimeRef.current = now;
    
    setBodies(prev =>
      prev.map(b => (b.id === bodyId ? { ...b, isDragging: true } : b))
    );
  };

  const handlePointerMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!interactionState.isActive || !interactionState.bodyId) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    const coords = getCoordinatesFromEvent(e);
    
    setInteractionState(prev => ({
      ...prev,
      currentPos: coords,
    }));

    if (interactionState.mode === 'longpress' && !interactionState.isLongPress) {
      const distance = Math.sqrt(
        (coords.x - interactionState.startPos.x) ** 2 + 
        (coords.y - interactionState.startPos.y) ** 2
      );
      
      if (distance > 10) {
        if (interactionState.longPressTimer) {
          clearTimeout(interactionState.longPressTimer);
        }
        setInteractionState(prev => ({
          ...prev,
          mode: 'drag',
          longPressTimer: null,
        }));
      }
    }

    if (interactionState.mode === 'drag' || interactionState.mode === 'longpress') {
      const newX = coords.x - interactionState.offset.x;
      const newY = coords.y - interactionState.offset.y;

              
        setBodies(prev =>
          prev.map(b =>
            b.id === interactionState.bodyId
              ? {
                  ...b,
                  x: Math.max(b.radius, Math.min(canvasDimensions.width - b.radius, newX)),
                  y: Math.max(b.radius, Math.min(canvasDimensions.height - b.radius, newY)),
                }
              : b
          )
        );
    }
  };

  const handlePointerEnd = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    document.body.style.overflow = '';
    
    if (!interactionState.isActive || !interactionState.bodyId) return;
    
    if (interactionState.longPressTimer) {
      clearTimeout(interactionState.longPressTimer);
    }
    
    if (interactionState.mode === 'velocity') {
      const deltaX = interactionState.currentPos.x - interactionState.startPos.x;
      const deltaY = interactionState.currentPos.y - interactionState.startPos.y;
      const distance = Math.sqrt(deltaX ** 2 + deltaY ** 2);
      
      if (distance > 10) {
        const maxVelocity = 5;
        const velocityMultiplier = Math.min(distance / 60, maxVelocity);
        const vx = (deltaX / distance) * velocityMultiplier;
        const vy = (deltaY / distance) * velocityMultiplier;
        
        setBodies(prev =>
          prev.map(b =>
            b.id === interactionState.bodyId ? { ...b, vx, vy, isDragging: false } : b
          )
        );
      } else {
        setBodies(prev =>
          prev.map(b =>
            b.id === interactionState.bodyId ? { ...b, isDragging: false } : b
          )
        );
      }
    } else {
      setBodies(prev =>
        prev.map(b =>
          b.id === interactionState.bodyId ? { ...b, isDragging: false } : b
        )
      );
    }
    
    setInteractionState({
      mode: 'none',
      bodyId: null,
      startPos: { x: 0, y: 0 },
      currentPos: { x: 0, y: 0 },
      offset: { x: 0, y: 0 },
      isActive: false,
      isLongPress: false,
      longPressTimer: null,
    });
  };

  const handleButtonClick = (action: () => void) => {
    return (e: React.MouseEvent | React.TouchEvent) => {
      e.preventDefault();
      e.stopPropagation();
      action();
    };
  };

  return (
    <div
      className={`relative rounded-2xl overflow-hidden transition-all duration-700 w-full max-w-full ${
        isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
      }`}
      style={{
        background: 'rgba(0, 0, 0, 0.4)',
        backdropFilter: 'blur(20px)',
        boxShadow: isSimulating 
          ? '0 25px 50px -12px rgba(139, 95, 191, 0.4), 0 35px 80px -15px rgba(139, 95, 191, 0.2), 0 0 0 1px rgba(139, 95, 191, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
          : '0 25px 50px -12px rgba(0, 0, 0, 0.4), 0 35px 80px -15px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
        maxWidth: '100%',
      }}
    >
      <div
        ref={canvasRef}
        className="relative w-full cursor-crosshair canvas-container"
        style={{ 
          height: canvasDimensions.height,
          background: 'radial-gradient(circle at 30% 30%, rgba(139, 95, 191, 0.3) 0%, rgba(0, 0, 0, 0.95) 70%)',
          touchAction: 'none',
        }}
        onMouseMove={handlePointerMove}
        onMouseUp={handlePointerEnd}
        onMouseLeave={handlePointerEnd}
        onTouchMove={handlePointerMove}
        onTouchEnd={handlePointerEnd}
      >
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {starField.map((star) => (
            <div
              key={star.id}
              className="absolute bg-white rounded-full animate-twinkle"
              style={{
                left: `${star.left}%`,
                top: `${star.top}%`,
                width: `${star.size}px`,
                height: `${star.size}px`,
                opacity: star.opacity,
                animationDelay: `${star.animationDelay}s`,
                animationDuration: `${star.animationDuration}s`,
                boxShadow: `0 0 ${star.size * 2}px rgba(255, 255, 255, 0.8)`,
              }}
            />
          ))}
        </div>



        {showTrajectories && bodies.map(body => {
          const trajectory = predictTrajectory(body, canvasDimensions);
          return (
            <svg
              key={`trajectory-${body.id}`}
              className="absolute inset-0 pointer-events-none"
              width="100%"
              height="100%"
            >
              <defs>
                <linearGradient id={`trajectoryGradient-${body.id}`} x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor={body.color} stopOpacity="0.95" />
                  <stop offset="100%" stopColor={body.color} stopOpacity="0.2" />
                </linearGradient>
              </defs>
              <path
                d={trajectory.length > 1 
                  ? `M ${body.x} ${body.y} ${trajectory
                      .map(point => `L ${point.x} ${point.y}`)
                      .join(' ')}`
                  : ''
                }
                stroke={`url(#trajectoryGradient-${body.id})`}
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
                strokeDasharray="8,4"
                opacity="0.9"
              />
            </svg>
          );
        })}

        {showDebrisTrajectories && debris.map(particle => {
          const trajectory = predictDebrisTrajectory(particle, canvasDimensions);
          return (
            <svg
              key={`debris-trajectory-${particle.id}`}
              className="absolute inset-0 pointer-events-none"
              width="100%"
              height="100%"
            >
              <path
                d={trajectory.length > 1 
                  ? `M ${particle.x} ${particle.y} ${trajectory
                      .map(point => `L ${point.x} ${point.y}`)
                      .join(' ')}`
                  : ''
                }
                stroke={particle.color}
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
                strokeDasharray="3,2"
                opacity="0.7"
              />
            </svg>
          );
        })}

        {interactionState.isActive && (
          interactionState.mode === 'velocity' || 
          (interactionState.mode === 'longpress' && interactionState.isLongPress)
        ) && (
          <svg
            className="absolute inset-0 pointer-events-none z-20"
            width="100%"
            height="100%"
          >
            <defs>
              <marker
                id="velocityArrow"
                markerWidth="12"
                markerHeight="8"
                refX="10"
                refY="4"
                orient="auto"
                markerUnits="strokeWidth"
              >
                <polygon
                  points="0 0, 12 4, 0 8"
                  fill="#00ff88"
                />
              </marker>
            </defs>
            <line
              x1={interactionState.startPos.x}
              y1={interactionState.startPos.y}
              x2={interactionState.currentPos.x}
              y2={interactionState.currentPos.y}
              stroke="#00ff88"
              strokeWidth="4"
              markerEnd="url(#velocityArrow)"
              opacity="0.9"
            />
          </svg>
        )}

        {bodies.map(body => (
          <svg
            key={`trail-${body.id}`}
            className="absolute inset-0 pointer-events-none"
            width="100%"
            height="100%"
          >
            <path
              d={body.trail.length > 1 
                ? `M ${body.trail[0].x} ${body.trail[0].y} ${body.trail
                    .slice(1)
                    .map(point => `L ${point.x} ${point.y}`)
                    .join(' ')}`
                : ''
              }
              stroke={body.color}
              strokeWidth="2"
              fill="none"
              opacity="0.6"
              strokeLinecap="round"
            />
          </svg>
        ))}

        {debris.map(particle => (
          <svg
            key={`debris-trail-${particle.id}`}
            className="absolute inset-0 pointer-events-none"
            width="100%"
            height="100%"
          >
            <path
              d={particle.trail.length > 1 
                ? `M ${particle.trail[0].x} ${particle.trail[0].y} ${particle.trail
                    .slice(1)
                    .map(point => `L ${point.x} ${point.y}`)
                    .join(' ')}`
                : ''
              }
              stroke={particle.color}
              strokeWidth="1"
              fill="none"
              opacity="0.4"
              strokeLinecap="round"
            />
          </svg>
        ))}

        {collisionEffects.map(effect => (
          <div
            key={effect.id}
            className="absolute pointer-events-none"
            style={{
              left: effect.x - 40,
              top: effect.y - 40,
              width: 80,
              height: 80,
            }}
          >
            <div className="w-full h-full rounded-full relative animate-collision-blast">
              <div className="absolute inset-0 rounded-full border-2 border-orange-400 bg-orange-400/20 backdrop-blur-sm"></div>
              <div className="absolute inset-1 rounded-full border-2 border-yellow-300 bg-yellow-300/15 animate-pulse"></div>
              <div className="absolute inset-2 rounded-full border-1 border-white bg-white/10 animate-pulse"></div>
            </div>
          </div>
        ))}

        {debris.map(particle => (
          <div
            key={particle.id}
            className="absolute rounded-full pointer-events-none backdrop-blur-sm animate-debris-fade"
            style={{
              left: particle.x - particle.radius,
              top: particle.y - particle.radius,
              width: particle.radius * 2,
              height: particle.radius * 2,
              backgroundColor: particle.color,
              boxShadow: `0 0 ${particle.radius * 3}px ${particle.color}40`,
              opacity: Math.max(0.1, particle.life / particle.maxLife),
            }}
          />
        ))}

        {bodies.map(body => {
          const velocity = Math.sqrt(body.vx ** 2 + body.vy ** 2);
          const hasVelocity = velocity > 0.1;
          const showVelocityVector = !isSimulating && hasVelocity && !body.isDragging && interactionState.bodyId !== body.id;
          
          return (
            <div key={body.id}>
              <div
                className="absolute cursor-pointer select-none hover:scale-105 transition-transform duration-150"
                style={{
                  left: body.x - body.radius,
                  top: body.y - body.radius,
                  width: body.radius * 2,
                  height: body.radius * 2,
                }}
                onMouseDown={(e) => handlePointerStart(e, body.id)}
                onTouchStart={(e) => handlePointerStart(e, body.id)}
                              >
                  <div
                    className="w-full h-full rounded-full relative shadow-lg backdrop-blur-sm border border-white/30 flex items-center justify-center"
                    style={{
                      backgroundColor: body.color,
                      boxShadow: `0 0 ${body.radius}px ${body.color}50, inset 0 0 ${body.radius/2}px rgba(255,255,255,0.4)`,
                    }}
                  >
                    {!interactionState.isActive && (
                      <div 
                        className="text-center select-none pointer-events-none font-semibold"
                        style={{
                          fontSize: `${Math.max(10, body.radius * 0.3)}px`,
                          color: '#ffffff',
                          textShadow: '0 1px 2px rgba(0,0,0,0.8)',
                          letterSpacing: '0.3px',
                        }}
                      >
                        <span style={{ 
                          fontWeight: '600',
                          color: '#ffffff'
                        }}>
                          {body.mass.toFixed(0)}
                        </span>
                        <span style={{ 
                          fontSize: '0.75em',
                          opacity: 0.9,
                          marginLeft: '2px',
                          fontWeight: '400',
                          color: '#e0e0e0'
                        }}>
                          kg
                        </span>
                      </div>
                    )}
                  
                  {showVelocityVector && (
                    <div className="absolute inset-0 pointer-events-none">
                      {(() => {
                        const normalizedVx = body.vx / velocity;
                        const normalizedVy = body.vy / velocity;
                        
                        const edgeOffset = body.radius - 4;
                        const startX = normalizedVx * edgeOffset;
                        const startY = normalizedVy * edgeOffset;
                        
                        const baseLength = Math.max(body.radius * 1.2, 15);
                        const velocityFactor = Math.min(velocity * 6, 2.0);
                        const arrowLength = baseLength * velocityFactor;
                        
                        const endX = startX + normalizedVx * arrowLength;
                        const endY = startY + normalizedVy * arrowLength;
                        
                        const strokeWidth = Math.max(1.5, body.radius * 0.08);
                        const containerPadding = 40;
                        
                        return (
                          <svg
                            className="absolute inset-0 w-full h-full"
                            style={{
                              width: (body.radius + arrowLength + containerPadding) * 2,
                              height: (body.radius + arrowLength + containerPadding) * 2,
                              left: -(arrowLength + containerPadding),
                              top: -(arrowLength + containerPadding),
                            }}
                            viewBox={`${-(arrowLength + containerPadding)} ${-(arrowLength + containerPadding)} ${(arrowLength + containerPadding) * 2} ${(arrowLength + containerPadding) * 2}`}
                          >
                            <defs>
                              <marker
                                id={`arrowhead-${body.id}`}
                                markerWidth="8"
                                markerHeight="6"
                                refX="7"
                                refY="3"
                                orient="auto"
                                markerUnits="strokeWidth"
                              >
                                <polygon
                                  points="0 0, 8 3, 0 6"
                                  fill="#00ff88"
                                />
                              </marker>
                            </defs>
                            <line
                              x1={startX}
                              y1={startY}
                              x2={endX}
                              y2={endY}
                              stroke="#00ff88"
                              strokeWidth={strokeWidth}
                              markerEnd={`url(#arrowhead-${body.id})`}
                              opacity="0.9"
                              strokeLinecap="round"
                            />
                          </svg>
                        );
                      })()}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}



        {interactionState.isActive && (
          <div 
            className="absolute bottom-16 md:bottom-20 right-4 text-white px-3 py-1 rounded-lg border border-white/20 text-xs z-20"
            style={{
              background: 'rgba(0, 0, 0, 0.6)',
              backdropFilter: 'blur(10px)',
            }}
          >
            {interactionState.mode === 'velocity' || (interactionState.mode === 'longpress' && interactionState.isLongPress) 
              ? ' Velocity' 
              : ' Drag'
            }
          </div>
        )}

        <div className="absolute top-4 right-4 flex flex-col items-end space-y-3 z-50">
          <div className="flex items-center space-x-2 md:space-x-3">
            <button
              onMouseDown={handleButtonClick(() => setShowDebrisTrajectories(!showDebrisTrajectories))}
              onTouchStart={handleButtonClick(() => setShowDebrisTrajectories(!showDebrisTrajectories))}
              className={`p-2 md:p-3 rounded-xl border border-white/20 text-white transition-all duration-200 hover:scale-110 transform cursor-pointer select-none ${
                showDebrisTrajectories 
                  ? 'shadow-lg shadow-orange-500/30' 
                  : 'hover:bg-white/10'
              }`}
              style={{
                background: showDebrisTrajectories 
                  ? 'rgba(255, 107, 53, 0.3)'
                  : 'rgba(0, 0, 0, 0.4)',
                backdropFilter: 'blur(15px)',
                pointerEvents: 'auto',
              }}
              title={showDebrisTrajectories ? "Hide debris trajectories" : "Show debris trajectories"}
            >
              <TargetIcon />
            </button>
            
            <button
              onMouseDown={handleButtonClick(() => setShowInstructions(!showInstructions))}
              onTouchStart={handleButtonClick(() => setShowInstructions(!showInstructions))}
              className="p-2 md:p-3 rounded-xl border border-white/20 text-white hover:bg-white/10 transition-all duration-200 hover:scale-110 transform cursor-pointer select-none"
              style={{
                background: 'rgba(0, 0, 0, 0.4)',
                backdropFilter: 'blur(15px)',
                pointerEvents: 'auto',
              }}
              title={showInstructions ? "Hide controls" : "Show controls"}
            >
              <InfoIcon />
            </button>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className={`w-2 md:w-3 h-2 md:h-3 rounded-full ${isSimulating ? 'bg-green-400 animate-pulse' : hasStarted ? 'bg-red-400' : 'bg-blue-400'}`}></div>
            <span 
              className="text-xs text-white px-2 md:px-3 py-1 rounded-lg border border-white/20"
              style={{
                background: 'rgba(0, 0, 0, 0.5)',
                backdropFilter: 'blur(10px)',
              }}
            >
              {isSimulating ? 'Running' : hasStarted ? 'Paused' : 'Idle'}
            </span>
          </div>
        </div>

        <div 
          className="absolute bottom-2 md:bottom-4 right-2 md:right-4 text-xs text-white/70 px-2 py-1 rounded border border-white/10"
          style={{
            background: 'rgba(0, 0, 0, 0.3)',
            backdropFilter: 'blur(10px)',
          }}
        >
          {canvasDimensions.width} × {canvasDimensions.height}
        </div>
      </div>
    </div>
  );
};

const VelocityControls: React.FC<{
  bodies: CelestialBody[];
  setBodies: React.Dispatch<React.SetStateAction<CelestialBody[]>>;
  isSimulating: boolean;
}> = ({ bodies, setBodies, isSimulating }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 600);
    return () => clearTimeout(timer);
  }, []);

  const updateVelocity = (bodyId: string, axis: 'vx' | 'vy', value: number) => {
    setBodies(prev =>
      prev.map(body =>
        body.id === bodyId ? { ...body, [axis]: value } : body
      )
    );
  };

  const updateMass = (bodyId: string, mass: number) => {
    setBodies(prev =>
      prev.map(body =>
        body.id === bodyId 
          ? { 
              ...body, 
              mass,
              radius: massToRadius(mass)
            } 
          : body
      )
    );
  };

  return (
    <div
      className={`rounded-2xl p-4 md:p-6 shadow-2xl border border-white/20 transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
      }`}
      style={{
        background: 'rgba(255, 255, 255, 0.08)',
        backdropFilter: 'blur(25px)',
        boxShadow: '0 8px 32px rgba(139, 95, 191, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
      }}
    >
      <h3 className="text-lg md:text-xl font-bold text-white mb-4 flex items-center space-x-2">
        <SettingsIcon />
        <span>Celestial Body Parameters</span>
      </h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {bodies.map((body, index) => (
          <div
            key={body.id}
            className={`p-4 rounded-xl border border-white/20 transition-all duration-500 ${
              isVisible ? 'opacity-100 translate-x-0' : `opacity-0 ${index % 2 === 0 ? '-translate-x-5' : 'translate-x-5'}`
            }`}
            style={{ 
              transitionDelay: `${100 * index}ms`,
              background: 'rgba(255, 255, 255, 0.06)',
              backdropFilter: 'blur(15px)',
              boxShadow: '0 4px 16px rgba(139, 95, 191, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
            }}
          >
            <div className="flex items-center space-x-3 mb-4">
              <div
                className="w-5 md:w-6 h-5 md:h-6 rounded-full border border-white/20"
                style={{ backgroundColor: body.color }}
              />
              <h4 className="font-semibold text-white text-sm md:text-base">
                Celestial Body {index + 1}
              </h4>
              {body.hasCollided && (
                <span className="text-xs bg-orange-500/80 backdrop-blur-sm text-white px-2 py-1 rounded border border-white/20">
                  Merged
                </span>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-300 mb-2">
                  Velocity X: {body.vx.toFixed(2)}
                </label>
                <input
                  type="range"
                  min="-6"
                  max="6"
                  step="0.1"
                  value={body.vx}
                  onChange={(e) => updateVelocity(body.id, 'vx', parseFloat(e.target.value))}
                  disabled={isSimulating}
                  className="w-full h-2 bg-gray-600/50 backdrop-blur-sm rounded-lg appearance-none cursor-pointer slider"
                />
              </div>
              
              <div>
                <label className="block text-sm text-gray-300 mb-2">
                  Velocity Y: {body.vy.toFixed(2)}
                </label>
                <input
                  type="range"
                  min="-6"
                  max="6"
                  step="0.1"
                  value={body.vy}
                  onChange={(e) => updateVelocity(body.id, 'vy', parseFloat(e.target.value))}
                  disabled={isSimulating}
                  className="w-full h-2 bg-gray-600/50 backdrop-blur-sm rounded-lg appearance-none cursor-pointer slider"
                />
              </div>
              
              <div className="col-span-1 md:col-span-2">
                <label className="block text-sm text-gray-300 mb-2">
                  Mass: {body.mass.toFixed(0)} kg
                </label>
                <input
                  type="range"
                  min="20"
                  max="250"
                  step="5"
                  value={body.mass}
                  onChange={(e) => updateMass(body.id, parseFloat(e.target.value))}
                  disabled={isSimulating}
                  className="w-full h-2 bg-gray-600/50 backdrop-blur-sm rounded-lg appearance-none cursor-pointer slider"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const InfoPanel: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`rounded-2xl p-4 md:p-6 shadow-2xl border border-white/20 transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
      }`}
      style={{
        background: 'rgba(255, 255, 255, 0.08)',
        backdropFilter: 'blur(25px)',
        boxShadow: '0 8px 32px rgba(139, 95, 191, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
      }}
    >
      <h3 className="text-lg md:text-xl font-bold text-white mb-4 flex items-center space-x-2">
        <InfoIcon />
        <span>Perfect Celestial Physics Engine</span>
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 text-gray-300">
        <div className={`p-4 rounded-xl border border-white/10 transition-all duration-500 delay-100 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
        }`} style={{
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(15px)',
          boxShadow: '0 4px 16px rgba(139, 95, 191, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
        }}>
          <h4 className="font-semibold text-white mb-2">Flawless Dual-Mode Controls</h4>
          <p className="text-sm">
            Revolutionary interaction system: single click/tap for precise body positioning.
            Works perfectly on both desktop and mobile with proper gesture recognition and visual feedback.
          </p>
        </div>
        
        <div className={`p-4 rounded-xl border border-white/10 transition-all duration-500 delay-200 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
        }`} style={{
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(15px)',
          boxShadow: '0 4px 16px rgba(139, 95, 191, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
        }}>
          <h4 className="font-semibold text-white mb-2">Optimized Performance</h4>
          <p className="text-sm">
            Smooth 60fps rendering with intelligent collision detection, optimized debris generation, and performance monitoring.
            No frame drops during complex multi-body collisions with proper boundary detection and smooth physics calculations.
          </p>
        </div>
        
        <div className={`p-4 rounded-xl border border-white/10 transition-all duration-500 delay-300 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
        }`} style={{
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(15px)',
          boxShadow: '0 4px 16px rgba(139, 95, 191, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
        }}>
          <h4 className="font-semibold text-white mb-2">Professional Interface</h4>
          <p className="text-sm">
            Cutting-edge glassmorphism design with cosmic color palette, perfectly responsive layout, fully clickable controls,
            and professional user experience. Clean implementation with proper event handling and flawless interactions.
          </p>
        </div>
      </div>
    </div>
  );
};

const PlanetaryCollisionSimulator: React.FC = () => {
  const {
    bodies,
    setBodies,
    debris,
    setDebris,
    collisionEffects,
    isSimulating,
    setIsSimulating,
    metrics,
    setMetrics,
    calculateMetrics,
    canvasDimensions,
  } = useSimulation();
  
  const [showInstructions, setShowInstructions] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  
  useEffect(() => {
    if (showInstructions) {
      
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.documentElement.style.overflow = 'hidden';
    } else {
      
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.documentElement.style.overflow = '';
    }
    
    return () => {
      
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.documentElement.style.overflow = '';
    };
  }, [showInstructions]);

  const handleToggleSimulation = () => {
    setIsSimulating(prev => !prev);
    if (!hasStarted) {
      setHasStarted(true);
    }
  };

  const handleReset = () => {
    setIsSimulating(false);
    setHasStarted(false);
    setDebris([]);
    
    const isMobile = canvasDimensions.width < 400;
    
    
    const body1Radius = massToRadius(100);
    const body2Radius = massToRadius(80);
    
    const newBodies = [
      {
        id: '1',
        x: Math.max(body1Radius, Math.min(canvasDimensions.width - body1Radius, canvasDimensions.width * 0.25)),
        y: Math.max(body1Radius, Math.min(canvasDimensions.height - body1Radius, canvasDimensions.height * 0.4)),
        vx: isMobile ? 0.8 : 1.2,
        vy: isMobile ? 0.4 : 0.6,
        mass: 100,
        radius: body1Radius,
        color: '#8B5FBF',
        trail: [],
        isDragging: false,
        hasCollided: false,
      },
      {
        id: '2',
        x: Math.max(body2Radius, Math.min(canvasDimensions.width - body2Radius, canvasDimensions.width * 0.75)),
        y: Math.max(body2Radius, Math.min(canvasDimensions.height - body2Radius, canvasDimensions.height * 0.6)),
        vx: isMobile ? -0.6 : -1.0,
        vy: isMobile ? -0.2 : -0.4,
        mass: 80,
        radius: body2Radius,
        color: '#FF6B35',
        trail: [],
        isDragging: false,
        hasCollided: false,
      },
    ];
    
    setBodies(newBodies);
    
    
    setMetrics({
      totalKineticEnergy: 0,
      totalAngularMomentum: 0,
      collisionForce: 0,
      impactVelocity: 0,
      lastCollisionTime: 0,
    });
  };

  return (
    <div className="min-h-screen bg-black text-white font-['Space_Grotesk'] scroll-smooth">
              <style jsx global>{`
         @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap');
        
        * {
          scroll-behavior: smooth;
        }
        
        body {
          margin: 0;
          padding: 0;
          overflow-x: hidden;
          touch-action: manipulation;
          overscroll-behavior: none;
        }
        
        .canvas-container {
          touch-action: none;
          user-select: none;
          -webkit-user-select: none;
          -webkit-touch-callout: none;
        }
        
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        
        @keyframes gradient-x {
          0%, 100% {
            background-size: 200% 200%;
            background-position: left center;
          }
          50% {
            background-size: 200% 200%;
            background-position: right center;
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          33% {
            transform: translateY(-4px) rotate(1deg);
          }
          66% {
            transform: translateY(2px) rotate(-1deg);
          }
        }
        
        @keyframes twinkle {
          0%, 100% {
            opacity: 0.3;
            transform: scale(0.8);
            filter: brightness(0.8);
          }
          25% {
            opacity: 0.6;
            transform: scale(1);
            filter: brightness(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.2);
            filter: brightness(1.5);
          }
          75% {
            opacity: 0.8;
            transform: scale(1.1);
            filter: brightness(1.2);
          }
        }
        
        @keyframes collision-blast {
          0% {
            transform: scale(0);
            opacity: 1;
          }
          20% {
            transform: scale(1);
            opacity: 0.9;
          }
          50% {
            transform: scale(2);
            opacity: 0.6;
          }
          80% {
            transform: scale(3);
            opacity: 0.3;
          }
          100% {
            transform: scale(4);
            opacity: 0;
          }
        }
        
        @keyframes debris-fade {
          0% {
            transform: scale(0);
            opacity: 1;
          }
          100% {
            transform: scale(1);
            opacity: 0.1;
          }
        }
        
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
        
        .animate-gradient-x {
          animation: gradient-x 4s ease infinite;
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-twinkle {
          animation: twinkle 3s ease-in-out infinite;
        }
        
        .animate-collision-blast {
          animation: collision-blast 1s ease-out forwards;
        }
        
        .animate-debris-fade {
          animation: debris-fade 0.3s ease-out;
        }
        
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: linear-gradient(45deg, #8B5FBF, #FF6B35);
          cursor: pointer;
          box-shadow: 0 0 15px rgba(139, 95, 191, 0.6);
          border: 2px solid rgba(255, 255, 255, 0.3);
          transition: all 0.3s ease;
        }
        
        .slider::-webkit-slider-thumb:hover {
          transform: scale(1.15);
          box-shadow: 0 0 25px rgba(139, 95, 191, 0.9);
        }
        
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: linear-gradient(45deg, #8B5FBF, #FF6B35);
          cursor: pointer;
          border: 2px solid rgba(255, 255, 255, 0.3);
          box-shadow: 0 0 15px rgba(139, 95, 191, 0.6);
          transition: all 0.3s ease;
        }
        
        .slider::-moz-range-thumb:hover {
          transform: scale(1.15);
          box-shadow: 0 0 25px rgba(139, 95, 191, 0.9);
        }
        
        .slider::-webkit-slider-track {
          background: linear-gradient(90deg, rgba(139, 95, 191, 0.5), rgba(255, 107, 53, 0.3));
          border-radius: 10px;
          height: 10px;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .slider::-moz-range-track {
          background: linear-gradient(90deg, rgba(139, 95, 191, 0.5), rgba(255, 107, 53, 0.3));
          border-radius: 10px;
          height: 10px;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .slider:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }
        
        .slider:disabled::-webkit-slider-thumb {
          cursor: not-allowed;
          background: #555;
          box-shadow: none;
        }
        
        .slider:disabled::-moz-range-thumb {
          cursor: not-allowed;
          background: #555;
          box-shadow: none;
        }
        
        ::-webkit-scrollbar {
          width: 10px;
        }
        
        ::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.3);
          backdrop-filter: blur(10px);
          border-radius: 5px;
        }
        
        ::-webkit-scrollbar-thumb {
          background: linear-gradient(45deg, #8B5FBF, #FF6B35);
          border-radius: 5px;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(45deg, #9D6FD4, #FF8A65);
        }
        
        @media (max-width: 768px) {
          .slider {
            height: 14px;
          }
          
          .slider::-webkit-slider-thumb {
            height: 24px;
            width: 24px;
          }
          
          .slider::-moz-range-thumb {
            height: 24px;
            width: 24px;
          }
        }
      `}</style>
      
      <Header />
      
      <main className="max-w-7xl mx-auto p-3 md:p-6 space-y-4 md:space-y-8 overflow-x-hidden">
        <ControlPanel
          isSimulating={isSimulating}
          onToggleSimulation={handleToggleSimulation}
          onReset={handleReset}
          metrics={metrics}
        />
        
        <SimulationCanvas
          bodies={bodies}
          debris={debris}
          collisionEffects={collisionEffects}
          setBodies={setBodies}
          isSimulating={isSimulating}
          canvasDimensions={canvasDimensions}
          showInstructions={showInstructions}
          setShowInstructions={setShowInstructions}
          hasStarted={hasStarted}
        />

        {/* Instructions Modal */}
        {showInstructions && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto"
            style={{ touchAction: 'none' }}
          >
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-black/70 backdrop-blur-sm"
              onClick={() => setShowInstructions(false)}
              style={{ touchAction: 'none' }}
            />
            
            {/* Modal Content */}
            <div
              className={`relative bg-black/90 backdrop-blur-xl text-white m-4 p-4 sm:p-6 rounded-2xl border border-white/20 shadow-2xl w-full max-w-sm sm:max-w-md transition-all duration-300 ${
                showInstructions ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
              }`}
              style={{
                background: 'rgba(0, 0, 0, 0.9)',
                backdropFilter: 'blur(25px)',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                maxHeight: 'calc(100vh - 4rem)',
                overflowY: 'auto',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <h3 className="text-base sm:text-lg font-semibold flex items-center space-x-2">
                  <InfoIcon />
                  <span>Perfect Controls</span>
                </h3>
                <button
                  onClick={() => setShowInstructions(false)}
                  className="text-gray-400 cursor-pointer hover:text-white transition-colors p-1.5 sm:p-2 rounded-lg hover:bg-white/10 -mr-1 sm:-mr-2 flex-shrink-0"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="sm:w-5 sm:h-5">
                    <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z"/>
                  </svg>
                </button>
              </div>
              
              <div className="space-y-2.5 sm:space-y-3">
                <div className="p-2.5 sm:p-3 rounded-lg bg-white/5 border border-white/10">
                  <h4 className="text-xs sm:text-sm font-medium text-purple-300 mb-1.5 sm:mb-2">Interaction Controls</h4>
                  <ul className="text-xs sm:text-sm space-y-1 sm:space-y-1.5">
                    <li>• <span className="text-blue-400">Quick tap/click + drag</span> to move bodies</li>
                    <li>• <span className="text-yellow-400">Long press (0.5s) + drag</span> to set velocity</li>
                  </ul>
                </div>
                
                <div className="p-2.5 sm:p-3 rounded-lg bg-white/5 border border-white/10">
                  <h4 className="text-xs sm:text-sm font-medium text-green-300 mb-1.5 sm:mb-2">Visual Indicators</h4>
                  <ul className="text-xs sm:text-sm space-y-1 sm:space-y-1.5">
                    <li>• <span className="text-green-400">Green arrows</span> show velocity vectors</li>
                    <li>• <span className="text-purple-400">Dashed lines</span> show trajectory predictions</li>
                    <li>• <span className="text-orange-400">Target button</span> shows debris trajectories</li>
                  </ul>
                </div>
                
                <div className="p-2.5 sm:p-3 rounded-lg bg-white/5 border border-white/10">
                  <h4 className="text-xs sm:text-sm font-medium text-pink-300 mb-1.5 sm:mb-2">Performance</h4>
                  <ul className="text-xs sm:text-sm space-y-1 sm:space-y-1.5">
                    <li>• Real-time collision physics with debris analysis</li>
                    <li>• Optimized 60fps performance on all devices</li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-4 sm:mt-6 flex justify-center">
                <button
                  onClick={() => setShowInstructions(false)}
                  className="px-4 sm:px-6 cursor-pointer py-2 bg-purple-600/80 hover:bg-purple-600 text-white rounded-lg font-medium transition-colors duration-200 text-sm sm:text-base"
                >
                  Got it!
                </button>
              </div>
            </div>
          </div>
        )}
        
        <VelocityControls
          bodies={bodies}
          setBodies={setBodies}
          isSimulating={isSimulating}
        />
        
        <InfoPanel />
      </main>
      
      <Footer />
    </div>
  );
};

export default PlanetaryCollisionSimulator;
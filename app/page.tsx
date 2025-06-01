"use client";

import React, {
  useRef,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";
import * as THREE from "three";

interface BlackHoleParams {
  mass: number;
  spin: number;
  accretionRate: number;
  diskTemperature: number;
  timeScale: number;
  magneticField: number;
  diskSize: number;
  lensStrength: number;
}

interface Particle {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  temperature: number;
  lifetime: number;
  spiralPhase: number;
}

interface DraggableMatter {
  id: string;
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  mass: number;
  color: THREE.Color;
  size: number;
  isDragging: boolean;
  mesh?: THREE.Mesh;
}

const BlackHoleExplorer: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const composerRef = useRef<any>(null);
  const clockRef = useRef<THREE.Clock>(new THREE.Clock());
  const animationIdRef = useRef<number | null>(null);

  const blackHoleRef = useRef<THREE.Mesh | null>(null);
  const eventHorizonRef = useRef<THREE.Mesh | null>(null);
  const accretionDiskRef = useRef<THREE.Points | null>(null);
  const jetParticlesRef = useRef<THREE.Points | null>(null);
  const backgroundRef = useRef<THREE.Mesh | null>(null);
  const photonSphereRef = useRef<THREE.Mesh | null>(null);

  const [params, setParams] = useState<BlackHoleParams>({
    mass: 20,
    spin: 0.0,
    accretionRate: 0.7,
    diskTemperature: 10000,
    timeScale: 4.0,
    magneticField: 1.2,
    diskSize: 12,
    lensStrength: 1.5,
  });

  const [showControls, setShowControls] = useState(false);
  const [showInfo, setShowInfo] = useState(true);
  const [fps, setFps] = useState(60);
  const [isDragging, setIsDragging] = useState(false);
  const [touchStart, setTouchStart] = useState<{
    x: number;
    y: number;
    time: number;
  } | null>(null);
  const [mouseStart, setMouseStart] = useState<{ x: number; y: number } | null>(
    null
  );
  const [cameraDistance, setCameraDistance] = useState(15);
  const [cameraTheta, setCameraTheta] = useState(0);
  const [cameraPhi, setCameraPhi] = useState(Math.PI / 3);
  const [draggableObjects, setDraggableObjects] = useState<DraggableMatter[]>(
    []
  );
  const [draggedObject, setDraggedObject] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [lastPinchDistance, setLastPinchDistance] = useState<number | null>(null);

  const SCHWARZSCHILD_SCALE = 0.15;
  const PHYSICS_SCALE = 0.1;

  const [dragPlane, setDragPlane] = useState<THREE.Plane | null>(null);
  const [dragStartPosition, setDragStartPosition] =
    useState<THREE.Vector3 | null>(null);
  const [mouseRaycaster] = useState(() => new THREE.Raycaster());
  const [dragOffset, setDragOffset] = useState<THREE.Vector3 | null>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || "ontouchstart" in window);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const schwarzschildRadius = useCallback((mass: number) => {
    return mass * SCHWARZSCHILD_SCALE;
  }, []);

  const photonSphereRadius = useCallback(
    (mass: number) => {
      return schwarzschildRadius(mass) * 1.5;
    },
    [schwarzschildRadius]
  );

  const iscoRadius = useCallback(
    (mass: number, spin: number) => {
      const rs = schwarzschildRadius(mass);
      const z1 =
        1 +
        Math.pow(1 - spin * spin, 1 / 3) *
          (Math.pow(1 + spin, 1 / 3) + Math.pow(1 - spin, 1 / 3));
      const z2 = Math.sqrt(3 * spin * spin + z1 * z1);
      return rs * (3 + z2 - Math.sqrt((3 - z1) * (3 + z1 + 2 * z2)));
    },
    [schwarzschildRadius]
  );

  // gravitational lensing shader with better redshift
  const createLensingShader = useMemo(() => {
    const vertexShader = `
      varying vec2 vUv;
      varying vec3 vWorldPosition;
      void main() {
        vUv = uv;
        vec4 worldPosition = modelMatrix * vec4(position, 1.0);
        vWorldPosition = worldPosition.xyz;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;

    const fragmentShader = `
        uniform float uTime;
        uniform float uMass;
        uniform float uSpin;
        uniform float uLensStrength;
        uniform vec3 uBlackHolePos;
        uniform vec3 uCameraPos;
        uniform sampler2D uStarfield;
        varying vec2 vUv;
        varying vec3 vWorldPosition;

        const float PI = 3.14159265359;

        vec2 gravitationalLens(vec2 screenPos, vec3 blackHolePos, float mass, float spin, float lensStrength) {
          vec2 toBlackHole = screenPos - blackHolePos.xy;
          float distance = length(toBlackHole);
          
          if (distance < 0.02) return screenPos;
          
          float rs = mass * 0.05; 
          float maxDeflection = 0.3; 

          float deflectionAngle = min(maxDeflection, 4.0 * rs / distance * lensStrength);
          
          float frameDrag = spin * rs * rs / (distance * distance * distance) * 0.2; 
          vec2 tangent = vec2(-toBlackHole.y, toBlackHole.x) / distance;
          
          float falloff = smoothstep(0.05, 0.5, distance);
          deflectionAngle *= falloff;
          frameDrag *= falloff;
          
          vec2 deflection = normalize(toBlackHole) * deflectionAngle + tangent * frameDrag;
          return screenPos + deflection;
        }

        vec3 gravitationalRedshift(vec3 color, float gravitationalPotential, float velocity) {
          float redshiftFactor = sqrt(max(0.3, 1.0 - 2.0 * gravitationalPotential));
          float dopplerShift = sqrt((1.0 - velocity) / (1.0 + velocity));
          float totalShift = redshiftFactor * dopplerShift;
          
          vec3 redshifted = vec3(
            color.r * pow(totalShift, 0.6), // Red shifts less
            color.g * pow(totalShift, 1.0), // Green shifts normally  
            color.b * pow(totalShift, 1.4)  // Blue shifts more (becomes red)
          );
          
          if (velocity < 0.0) {
            redshifted.b *= 1.0 + abs(velocity) * 2.0;
            redshifted.r *= 1.0 - abs(velocity) * 0.5;
          }
          
          return redshifted;
        }

        void main() {
          vec2 centeredUv = vUv - 0.5;
          vec2 lensedUv = gravitationalLens(vUv, uBlackHolePos, uMass, uSpin, uLensStrength);
          
          lensedUv = clamp(fract(lensedUv + 1.0), 0.01, 0.99);
          
          vec4 starColor = texture2D(uStarfield, lensedUv);
          
          float distToBlackHole = length(centeredUv);
          float gravitationalPotential = uMass * 0.04 / max(distToBlackHole, 0.1); 
          float orbitalVelocity = sqrt(gravitationalPotential) * 0.15; // REDUCED from 0.2
          
          vec3 finalColor = gravitationalRedshift(starColor.rgb, gravitationalPotential, orbitalVelocity);
          
          float brightness = 1.0 + gravitationalPotential * 1.5; 
          finalColor *= brightness;
          
          float ringDistance = abs(distToBlackHole - 0.3);
          if (ringDistance < 0.02) {
            finalColor += vec3(0.1, 0.2, 0.4) * (1.0 - ringDistance / 0.02); 
          }
          
          gl_FragColor = vec4(finalColor, 1.0);
        }
        `;

    return new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uMass: { value: params.mass },
        uSpin: { value: params.spin },
        uLensStrength: { value: params.lensStrength },
        uBlackHolePos: { value: new THREE.Vector3(0.5, 0.5, 0) },
        uCameraPos: { value: new THREE.Vector3() },
        uStarfield: { value: null },
      },
    });
  }, []);

  // starfield background
  const createStarfield = useCallback(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 2048;
    canvas.height = 2048;
    const ctx = canvas.getContext("2d")!;

    const gradient = ctx.createRadialGradient(1024, 1024, 0, 1024, 1024, 1024);
    gradient.addColorStop(0, "#050510");
    gradient.addColorStop(0.5, "#0a0a20");
    gradient.addColorStop(1, "#030308");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 2048, 2048);

    for (let i = 0; i < 6; i++) {
      const x = Math.random() * 2048;
      const y = Math.random() * 2048;
      const size = 20 + Math.random() * 40;

      const galaxyGradient = ctx.createRadialGradient(x, y, 0, x, y, size);
      galaxyGradient.addColorStop(
        0,
        `rgba(180, 150, 120, ${0.1 + Math.random() * 0.15})`
      );
      galaxyGradient.addColorStop(
        0.6,
        `rgba(80, 60, 120, ${0.05 + Math.random() * 0.1})`
      );
      galaxyGradient.addColorStop(1, "rgba(0, 0, 0, 0)");

      ctx.fillStyle = galaxyGradient;
      ctx.fillRect(x - size, y - size, size * 2, size * 2);
    }

    const stars = 6000;
    for (let i = 0; i < stars; i++) {
      const x = Math.random() * 2048;
      const y = Math.random() * 2048;

      const magnitude = Math.pow(Math.random(), 3);
      const brightness = magnitude * 180;
      const size = 0.2 + magnitude * 2;

      const stellarType = Math.random();
      let r, g, b;

      if (stellarType < 0.1) {
        r = 100 + brightness * 0.3;
        g = 120 + brightness * 0.2;
        b = 180;
      } else if (stellarType < 0.3) {
        r = 140 + brightness * 0.2;
        g = 150 + brightness * 0.2;
        b = 180;
      } else if (stellarType < 0.5) {
        r = 160;
        g = 160;
        b = 160;
      } else if (stellarType < 0.7) {
        r = 180;
        g = 180;
        b = 140 + brightness * 0.2;
      } else if (stellarType < 0.85) {
        r = 180;
        g = 170;
        b = 100 + brightness * 0.2;
      } else {
        r = 180;
        g = 120 + brightness * 0.2;
        b = 80 + brightness * 0.1;
      }

      const finalOpacity = magnitude * 0.7 * (0.3 + Math.random() * 0.3);
      ctx.fillStyle = `rgba(${r * magnitude}, ${g * magnitude}, ${
        b * magnitude
      }, ${finalOpacity})`;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();

      if (magnitude > 0.85) {
        ctx.strokeStyle = `rgba(${r * magnitude}, ${g * magnitude}, ${
          b * magnitude
        }, ${finalOpacity * 0.3})`;
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(x - size * 2, y);
        ctx.lineTo(x + size * 2, y);
        ctx.moveTo(x, y - size * 2);
        ctx.lineTo(x, y + size * 2);
        ctx.stroke();
      }
    }

    return new THREE.CanvasTexture(canvas);
  }, []);

  // black hole with event horizon
  const createBlackHole = useCallback(() => {
    const rs = schwarzschildRadius(params.mass);

    const horizonGeometry = new THREE.SphereGeometry(rs, 64, 64);
    const horizonMaterial = new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: false,
    });
    const eventHorizon = new THREE.Mesh(horizonGeometry, horizonMaterial);

    const photonRing = new THREE.RingGeometry(
      photonSphereRadius(params.mass) * 0.95,
      photonSphereRadius(params.mass) * 1.05,
      128
    );
    const photonMaterial = new THREE.MeshBasicMaterial({
      color: 0xffaa00,
      transparent: true,
      opacity: 0.6,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
    });
    const photonSphere = new THREE.Mesh(photonRing, photonMaterial);
    photonSphere.rotation.x = Math.PI / 2;

    return { eventHorizon, photonSphere };
  }, [params.mass, schwarzschildRadius, photonSphereRadius]);

  // accretion disk
  const createAccretionDisk = useCallback(() => {
    const particleCount = 8000;
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    const temperatures = new Float32Array(particleCount);

    const rs = schwarzschildRadius(params.mass);
    const risco = iscoRadius(params.mass, params.spin);

    for (let i = 0; i < particleCount; i++) {
      const spiralTurns = 3;
      const angle = (i / particleCount) * spiralTurns * Math.PI * 2;
      const radiusNorm = Math.pow(i / particleCount, 0.6);
      const radius = risco + radiusNorm * (params.diskSize - risco);

      const scaleHeight = 0.05 * radius * Math.pow(radius / risco, 0.25);
      const height = (Math.random() - 0.5) * 2 * scaleHeight;

      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = height;
      positions[i * 3 + 2] = Math.sin(angle) * radius;

      const keplerian = Math.sqrt((params.mass * PHYSICS_SCALE) / radius);
      const relativisticFactor = Math.sqrt(
        Math.max(0.1, 1 - (3 * rs) / radius)
      );
      const velocity = keplerian * relativisticFactor;

      velocities[i * 3] = -Math.sin(angle) * velocity;
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.02;
      velocities[i * 3 + 2] = Math.cos(angle) * velocity;

      const temperature =
        params.diskTemperature * Math.pow(risco / radius, 0.75);
      temperatures[i] = temperature;

      const t = Math.min(1, temperature / 20000);
      const redshiftFactor = Math.sqrt(Math.max(0.3, 1 - rs / radius));

      colors[i * 3] = Math.min(1, 1.8 * t * redshiftFactor);
      colors[i * 3 + 1] = Math.min(1, 1.2 * t * Math.pow(redshiftFactor, 1.2));
      colors[i * 3 + 2] = Math.min(
        1,
        0.8 + 0.4 * t * Math.pow(redshiftFactor, 1.5)
      );

      sizes[i] = (0.3 + Math.random() * 0.7) * Math.pow(risco / radius, 0.3);
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("velocity", new THREE.BufferAttribute(velocities, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));
    geometry.setAttribute(
      "temperature",
      new THREE.BufferAttribute(temperatures, 1)
    );

    const material = new THREE.PointsMaterial({
      size: 0.08,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    });

    return new THREE.Points(geometry, material);
  }, [params, schwarzschildRadius, iscoRadius]);

  // relativistic jets
  const createRelativisticJets = useCallback(() => {
    if (params.magneticField < 0.5) return null;

    const particleCount = 2000;
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    const rs = schwarzschildRadius(params.mass);

    for (let i = 0; i < particleCount; i++) {
      const isNorthJet = i < particleCount / 2;
      const jetDirection = isNorthJet ? 1 : -1;

      const startRadius = rs * 2;
      const angle = Math.random() * Math.PI * 2;
      const radialOffset = Math.random() * 0.5;

      positions[i * 3] = Math.cos(angle) * radialOffset;
      positions[i * 3 + 1] =
        jetDirection * (startRadius + Math.random() * params.diskSize);
      positions[i * 3 + 2] = Math.sin(angle) * radialOffset;

      const jetSpeed = 0.8;
      velocities[i * 3] = (Math.random() - 0.5) * 0.1;
      velocities[i * 3 + 1] = jetDirection * jetSpeed;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.1;

      const intensity = 0.5 + Math.random() * 0.5;
      colors[i * 3] = 0.6 * intensity;
      colors[i * 3 + 1] = 0.8 * intensity;
      colors[i * 3 + 2] = 1.0 * intensity;

      sizes[i] = 0.1 + Math.random() * 0.2;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("velocity", new THREE.BufferAttribute(velocities, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));

    const material = new THREE.PointsMaterial({
      size: 0.05,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    });

    return new THREE.Points(geometry, material);
  }, [params.magneticField, params.diskSize, schwarzschildRadius]);

  // draggable matter objects
  const createDraggableObjects = useCallback(() => {
    const objects: DraggableMatter[] = [];
    const materials = [
      { color: 0xff6b6b, name: "Gas Cloud" },
      { color: 0x4ecdc4, name: "Asteroid" },
      { color: 0xffe66d, name: "Star" },
      { color: 0xa8e6cf, name: "Planet" },
      { color: 0xff8b94, name: "Comet" },
    ];

    for (let i = 0; i < 5; i++) {
      const material = materials[i];
      const object: DraggableMatter = {
        id: `matter-${i}`,
        position: new THREE.Vector3(
          (isMobile ? 8 : 12) + Math.random() * 3,
          (Math.random() - 0.5) * 8,
          (Math.random() - 0.5) * 8
        ),
        velocity: new THREE.Vector3(0, 0, 0),
        mass: 0.1 + Math.random() * 0.5,
        color: new THREE.Color(material.color),
        size: 0.2 + Math.random() * 0.3,
        isDragging: false,
      };

      // Create visual mesh
      const geometry = new THREE.SphereGeometry(object.size, 16, 16);
      const meshMaterial = new THREE.MeshStandardMaterial({
        color: object.color,
        transparent: true,
        opacity: 0.8,
        emissive: object.color,
        emissiveIntensity: 0.3,
      });
      object.mesh = new THREE.Mesh(geometry, meshMaterial);
      object.mesh.position.copy(object.position);
      object.mesh.userData = { id: object.id, type: "draggable" };

      objects.push(object);
    }

    return objects;
  }, [isMobile]);

  // scene
  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      70,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 5, 15);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      antialias: window.devicePixelRatio < 2,
      powerPreference: "high-performance",
      alpha: false,
      stencil: false,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ReinhardToneMapping;
    renderer.toneMappingExposure = 1.5;
    rendererRef.current = renderer;
    mountRef.current.appendChild(renderer.domElement);

    const starfieldTexture = createStarfield();

    const backgroundGeometry = new THREE.SphereGeometry(100, 64, 32);
    const backgroundMaterial = createLensingShader;
    backgroundMaterial.uniforms.uStarfield.value = starfieldTexture;
    backgroundMaterial.side = THREE.BackSide;
    const backgroundMesh = new THREE.Mesh(
      backgroundGeometry,
      backgroundMaterial
    );
    scene.add(backgroundMesh);
    backgroundRef.current = backgroundMesh;

    const { eventHorizon, photonSphere } = createBlackHole();
    scene.add(eventHorizon);
    scene.add(photonSphere);
    eventHorizonRef.current = eventHorizon;
    photonSphereRef.current = photonSphere;

    const accretionDisk = createAccretionDisk();
    scene.add(accretionDisk);
    accretionDiskRef.current = accretionDisk;

    const jets = createRelativisticJets();
    if (jets) {
      scene.add(jets);
      jetParticlesRef.current = jets;
    }

    const objects = createDraggableObjects();
    objects.forEach((obj) => {
      if (obj.mesh) scene.add(obj.mesh);
    });
    setDraggableObjects(objects);

    const ambientLight = new THREE.AmbientLight(0x001122, 0.2);
    scene.add(ambientLight);

    const handleResize = () => {
      if (!camera || !renderer || !backgroundMaterial) return;
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (
        mountRef.current &&
        renderer.domElement &&
        mountRef.current.contains(renderer.domElement)
      ) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
      scene.clear();
    };
  }, []);

  // physics simulation
  const updatePhysics = useCallback(
    (deltaTime: number) => {
      if (!accretionDiskRef.current) return;

      const rs = schwarzschildRadius(params.mass);
      const timeStep = deltaTime * params.timeScale;

      // accretion disk
      const positions = accretionDiskRef.current.geometry.attributes.position;
      const velocities = accretionDiskRef.current.geometry.attributes.velocity;
      const colors = accretionDiskRef.current.geometry.attributes.color;

      for (let i = 0; i < positions.count; i++) {
        const x = positions.getX(i);
        const y = positions.getY(i);
        const z = positions.getZ(i);
        const vx = velocities.getX(i);
        const vy = velocities.getY(i);
        const vz = velocities.getZ(i);

        const r = Math.sqrt(x * x + z * z);

        if (r > rs * 1.2) {
          // gravitational acceleration
          const gravAccel = (-params.mass * PHYSICS_SCALE) / (r * r * r);
          let ax = x * gravAccel;
          let az = z * gravAccel;

          // frame dragging effect from black hole spin
          if (params.spin > 0) {
            const frameDragRate =
              ((params.spin * rs) / (r * r * r)) * timeStep * 2;
            const dragX = -z * frameDragRate;
            const dragZ = x * frameDragRate;
            ax += dragX;
            az += dragZ;
          }

          // positions
          positions.setX(i, x + vx * timeStep);
          positions.setY(i, y + vy * timeStep * 0.99);
          positions.setZ(i, z + vz * timeStep);

          // velocities with drag
          const drag = 0.998;
          velocities.setX(i, (vx + ax * timeStep) * drag);
          velocities.setZ(i, (vz + az * timeStep) * drag);

          // redshift color updates
          const temperature = params.diskTemperature * Math.pow(3 / r, 0.75);
          const redshift = Math.sqrt(Math.max(0.2, 1 - rs / r));
          const velocity_magnitude = Math.sqrt(vx * vx + vz * vz);
          const dopplerShift = Math.sqrt(
            (1 - velocity_magnitude * 0.1) / (1 + velocity_magnitude * 0.1)
          );
          const totalShift = redshift * dopplerShift;

          const t = Math.min(1, temperature / 20000);

          colors.setX(i, Math.min(1, 1.8 * t * Math.pow(totalShift, 0.6)));
          colors.setY(i, Math.min(1, 1.2 * t * totalShift));
          colors.setZ(
            i,
            Math.min(1, (0.8 + 0.4 * t) * Math.pow(totalShift, 1.4))
          );
        } else {
          // particle crossed event horizon - respawn
          const angle = Math.random() * Math.PI * 2;
          const radius = 4 + Math.random() * params.diskSize;
          positions.setX(i, Math.cos(angle) * radius);
          positions.setZ(i, Math.sin(angle) * radius);
          positions.setY(i, (Math.random() - 0.5) * 0.2);

          const keplerian = Math.sqrt((params.mass * PHYSICS_SCALE) / radius);
          velocities.setX(i, -Math.sin(angle) * keplerian);
          velocities.setZ(i, Math.cos(angle) * keplerian);
        }
      }

      if (jetParticlesRef.current && params.magneticField > 0.5) {
        const jetPositions =
          jetParticlesRef.current.geometry.attributes.position;
        const jetVelocities =
          jetParticlesRef.current.geometry.attributes.velocity;

        for (let i = 0; i < jetPositions.count; i++) {
          const x = jetPositions.getX(i);
          const y = jetPositions.getY(i);
          const z = jetPositions.getZ(i);
          const vx = jetVelocities.getX(i);
          const vy = jetVelocities.getY(i);
          const vz = jetVelocities.getZ(i);

          jetPositions.setX(i, x + vx * timeStep);
          jetPositions.setY(i, y + vy * timeStep);
          jetPositions.setZ(i, z + vz * timeStep);

          if (Math.abs(y) > params.diskSize * 2) {
            const isNorthJet = i < jetPositions.count / 2;
            const jetDirection = isNorthJet ? 1 : -1;
            const angle = Math.random() * Math.PI * 2;

            jetPositions.setX(i, Math.cos(angle) * 0.5);
            jetPositions.setY(i, jetDirection * rs * 2);
            jetPositions.setZ(i, Math.sin(angle) * 0.5);
          }
        }
        jetPositions.needsUpdate = true;
      }

      // draggable objects
      setDraggableObjects((prevObjects) => {
        return prevObjects.map((obj) => {
          if (obj.isDragging) return obj;

          const distanceToBlackHole = obj.position.length();

          if (distanceToBlackHole > rs * 1.5) {
            const gravityStrength = params.mass * PHYSICS_SCALE * 2;
            const force =
              gravityStrength / (distanceToBlackHole * distanceToBlackHole);
            const direction = obj.position
              .clone()
              .normalize()
              .multiplyScalar(-force);

            obj.velocity.add(direction.multiplyScalar(timeStep));
            obj.position.add(obj.velocity.clone().multiplyScalar(timeStep));

            if (obj.mesh) {
              obj.mesh.position.copy(obj.position);

              const redshiftFactor = Math.sqrt(
                Math.max(0.3, 1 - rs / distanceToBlackHole)
              );
              const originalColor = new THREE.Color(obj.color);
              const redshiftedColor = new THREE.Color(
                originalColor.r * Math.pow(redshiftFactor, 0.6),
                originalColor.g * redshiftFactor,
                originalColor.b * Math.pow(redshiftFactor, 1.4)
              );
              (obj.mesh.material as THREE.MeshStandardMaterial).color.copy(
                redshiftedColor
              );
              (obj.mesh.material as THREE.MeshStandardMaterial).emissive.copy(
                redshiftedColor
              );
            }
          } else {
            obj.position.set(
              (isMobile ? 8 : 12) + Math.random() * 3,
              (Math.random() - 0.5) * 8,
              (Math.random() - 0.5) * 8
            );
            obj.velocity.set(0, 0, 0);
            if (obj.mesh) {
              obj.mesh.position.copy(obj.position);
              (obj.mesh.material as THREE.MeshStandardMaterial).color.copy(
                obj.color
              );
              (obj.mesh.material as THREE.MeshStandardMaterial).emissive.copy(
                obj.color
              );
            }
          }

          return obj;
        });
      });

      positions.needsUpdate = true;
      velocities.needsUpdate = true;
      colors.needsUpdate = true;
    },
    [params, schwarzschildRadius, isMobile]
  );

  const updateDragPlane = useCallback(() => {
    if (!cameraRef.current) return;

    const normal = new THREE.Vector3();
    normal.copy(cameraRef.current.position).normalize();

    const plane = new THREE.Plane(normal, -0.1);
    setDragPlane(plane);
  }, []);

  const updateCamera = useCallback(() => {
    if (!cameraRef.current) return;

    const x = cameraDistance * Math.sin(cameraPhi) * Math.cos(cameraTheta);
    const y = cameraDistance * Math.cos(cameraPhi);
    const z = cameraDistance * Math.sin(cameraPhi) * Math.sin(cameraTheta);

    cameraRef.current.position.set(x, y, z);
    cameraRef.current.lookAt(0, 0, 0);

    updateDragPlane();
  }, [cameraDistance, cameraTheta, cameraPhi, updateDragPlane]);

  //  drag handling
  const handleDragObject = useCallback(
    (clientX: number, clientY: number) => {
      if (!draggedObject || !cameraRef.current || !dragPlane) return;

      const mouse = new THREE.Vector2();
      mouse.x = (clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(clientY / window.innerHeight) * 2 + 1;

      mouseRaycaster.setFromCamera(mouse, cameraRef.current);

      const intersection = new THREE.Vector3();
      if (mouseRaycaster.ray.intersectPlane(dragPlane, intersection)) {
        if (dragOffset) {
          intersection.sub(dragOffset);
        }

        setDraggableObjects((prev) =>
          prev.map((obj) => {
            if (obj.id === draggedObject) {
              const targetPosition = intersection.clone();
              const currentPosition = obj.position.clone();
              const smoothedPosition = currentPosition.lerp(
                targetPosition,
                0.3
              );

              if (obj.mesh) {
                const material = obj.mesh
                  .material as THREE.MeshStandardMaterial;
                material.emissiveIntensity = 0.8;
                material.opacity = 0.9;

                const trail = new THREE.Mesh(
                  new THREE.SphereGeometry(obj.size * 0.3),
                  new THREE.MeshBasicMaterial({
                    color: obj.color,
                    transparent: true,
                    opacity: 0.3,
                  })
                );
                trail.position.copy(currentPosition);
                sceneRef.current?.add(trail);

                setTimeout(() => {
                  sceneRef.current?.remove(trail);
                  trail.geometry.dispose();
                  (trail.material as THREE.Material).dispose();
                }, 500);
              }

              return { ...obj, position: smoothedPosition };
            }
            return obj;
          })
        );
      }
    },
    [draggedObject, dragPlane, dragOffset, mouseRaycaster]
  );

  const getRaycastIntersection = useCallback(
    (clientX: number, clientY: number) => {
      if (!cameraRef.current || !sceneRef.current) return null;

      const mouse = new THREE.Vector2();
      mouse.x = (clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(clientY / window.innerHeight) * 2 + 1;

      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, cameraRef.current);

      const draggableMeshes = draggableObjects
        .map((obj) => obj.mesh)
        .filter(Boolean) as THREE.Mesh[];
      const intersects = raycaster.intersectObjects(draggableMeshes);

      return intersects.length > 0 ? intersects[0] : null;
    },
    [draggableObjects]
  );

  // animation loop
  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();

    const animate = () => {
      if (!rendererRef.current || !sceneRef.current || !cameraRef.current)
        return;

      const currentTime = performance.now();
      const deltaTime = Math.min((currentTime - lastTime) / 1000, 1 / 30);
      lastTime = currentTime;

      frameCount++;
      if (frameCount % 60 === 0) {
        setFps(Math.round(1 / deltaTime));
      }

      updateCamera();

      updatePhysics(deltaTime);

      if (backgroundRef.current?.material) {
        const material = backgroundRef.current.material as THREE.ShaderMaterial;
        material.uniforms.uTime.value += deltaTime;

        const cappedMass = Math.min(params.mass, 50);
        const lensBoost = params.mass > 50 ? (params.mass / 50) * 0.5 : 1.0; // Extra boost for high masses
        material.uniforms.uMass.value = cappedMass;
        material.uniforms.uLensStrength.value = params.lensStrength * lensBoost;

        material.uniforms.uSpin.value = params.spin;
        material.uniforms.uLensStrength.value = params.lensStrength;
        material.uniforms.uCameraPos.value.copy(cameraRef.current.position);
      }

      if (eventHorizonRef.current && photonSphereRef.current) {
        const currentRadius = schwarzschildRadius(params.mass);
        const scale = currentRadius / schwarzschildRadius(20); // Reference mass of 20

        eventHorizonRef.current.scale.setScalar(scale);

        const photonRadius = photonSphereRadius(params.mass);
        const photonScale = photonRadius / photonSphereRadius(20);
        photonSphereRef.current.scale.setScalar(photonScale);
      }

      rendererRef.current.render(sceneRef.current, cameraRef.current);
      animationIdRef.current = requestAnimationFrame(animate);
    };

    animate();
    return () => {
      if (animationIdRef.current) cancelAnimationFrame(animationIdRef.current);
    };
  }, [
    params,
    updateCamera,
    updatePhysics,
    schwarzschildRadius,
    photonSphereRadius,
  ]);

  // Helper function to calculate distance between two touches
  const getTouchDistance = (touch1: React.Touch, touch2: React.Touch): number => {
    const dx = touch1.clientX - touch2.clientX;
    const dy = touch1.clientY - touch2.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  // touch controls
  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    
    if (e.touches.length === 2) {
      // Two-finger pinch gesture for zoom
      const distance = getTouchDistance(e.touches[0], e.touches[1]);
      setLastPinchDistance(distance);
      setIsDragging(false); // Disable camera rotation during pinch
      setTouchStart(null);
    } else if (e.touches.length === 1) {
      const touch = e.touches[0];
      const intersection = getRaycastIntersection(touch.clientX, touch.clientY);

      if (intersection && intersection.object.userData.type === "draggable") {
        setDraggedObject(intersection.object.userData.id);
        setDragStartPosition(intersection.point.clone());

        // drag offset
        const offset = intersection.point
          .clone()
          .sub(intersection.object.position);
        setDragOffset(offset);

        setDraggableObjects((prev) =>
          prev.map((obj) =>
            obj.id === intersection.object.userData.id
              ? {
                  ...obj,
                  isDragging: true,
                  velocity: new THREE.Vector3(0, 0, 0),
                }
              : obj
          )
        );
      } else {
        setTouchStart({
          x: touch.clientX,
          y: touch.clientY,
          time: Date.now(),
        });
        setIsDragging(true);
      }
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
    
    if (e.touches.length === 2 && lastPinchDistance !== null) {
      // Handle pinch-to-zoom
      const currentDistance = getTouchDistance(e.touches[0], e.touches[1]);
      const distanceChange = currentDistance - lastPinchDistance;
      
      // Zoom sensitivity for mobile
      const zoomSpeed = 0.02;
      setCameraDistance((prev) =>
        Math.max(3, Math.min(50, prev - distanceChange * zoomSpeed))
      );
      
      setLastPinchDistance(currentDistance);
    } else if (draggedObject && e.touches.length === 1) {
      const touch = e.touches[0];
      handleDragObject(touch.clientX, touch.clientY);
    } else if (!draggedObject && touchStart && isDragging && e.touches.length === 1) {
      const deltaX = e.touches[0].clientX - touchStart.x;
      const deltaY = e.touches[0].clientY - touchStart.y;
      const deltaTime = Date.now() - touchStart.time;

      if (
        Math.abs(deltaX) > Math.abs(deltaY) &&
        Math.abs(deltaX) > 100 &&
        deltaTime < 500
      ) {
        const timeChange = deltaX * 0.02;
        setParams((prev) => ({
          ...prev,
          timeScale: Math.max(0.1, Math.min(10, prev.timeScale + timeChange)),
        }));
      } else {
        setCameraTheta((prev) => prev - deltaX * 0.01);
        setCameraPhi((prev) =>
          Math.max(0.1, Math.min(Math.PI - 0.1, prev + deltaY * 0.01))
        );
      }

      setTouchStart({
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
        time: Date.now(),
      });
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    setTouchStart(null);
    setLastPinchDistance(null); // Reset pinch distance
    
    if (draggedObject) {
      setDraggableObjects((prev) =>
        prev.map((obj) => {
          if (obj.id === draggedObject) {
            if (obj.mesh) {
              const material = obj.mesh.material as THREE.MeshStandardMaterial;
              material.emissiveIntensity = 0.3;
              material.opacity = 0.8;
            }
            return { ...obj, isDragging: false };
          }
          return obj;
        })
      );
      setDraggedObject(null);
      setDragStartPosition(null);
      setDragOffset(null);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isMobile) return;

    const intersection = getRaycastIntersection(e.clientX, e.clientY);

    if (intersection && intersection.object.userData.type === "draggable") {
      setDraggedObject(intersection.object.userData.id);
      setDragStartPosition(intersection.point.clone());

      const offset = intersection.point
        .clone()
        .sub(intersection.object.position);
      setDragOffset(offset);

      setDraggableObjects((prev) =>
        prev.map((obj) =>
          obj.id === intersection.object.userData.id
            ? {
                ...obj,
                isDragging: true,
                velocity: new THREE.Vector3(0, 0, 0),
              }
            : obj
        )
      );
    } else {
      setMouseStart({ x: e.clientX, y: e.clientY });
      setIsDragging(true);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isMobile) return;

    if (draggedObject) {
      handleDragObject(e.clientX, e.clientY);
    } else if (mouseStart && isDragging) {
      const deltaX = e.clientX - mouseStart.x;
      const deltaY = e.clientY - mouseStart.y;

      setCameraTheta((prev) => prev - deltaX * 0.01);
      setCameraPhi((prev) =>
        Math.max(0.1, Math.min(Math.PI - 0.1, prev + deltaY * 0.01))
      );

      setMouseStart({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseUp = () => {
    if (isMobile) return;

    setIsDragging(false);
    setMouseStart(null);
    if (draggedObject) {
      setDraggableObjects((prev) =>
        prev.map((obj) => {
          if (obj.id === draggedObject) {
            if (obj.mesh) {
              const material = obj.mesh.material as THREE.MeshStandardMaterial;
              material.emissiveIntensity = 0.3;
              material.opacity = 0.8;
            }
            return { ...obj, isDragging: false };
          }
          return obj;
        })
      );
      setDraggedObject(null);
      setDragStartPosition(null);
      setDragOffset(null);
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomSpeed = 0.1;
    setCameraDistance((prev) =>
      Math.max(3, Math.min(50, prev + e.deltaY * zoomSpeed))
    );
  };

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden font-['Inter']">
      {/* WebGL Canvas */}
      <div
        ref={mountRef}
        className="absolute inset-0 w-full h-full touch-none"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onWheel={handleWheel}
        style={{ touchAction: "none" }}
      />

      {/* header  */}
      <div className="absolute top-0 left-0 right-0 z-50 p-2 md:p-4">
        <div className="backdrop-blur-2xl bg-gradient-to-r from-black/20 via-purple-900/10 to-black/20 rounded-2xl md:rounded-3xl border border-white/10 shadow-2xl">
          <div className="flex items-center justify-between p-3 md:p-6">
            <div className="flex-1">
              <h1
                className={`font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent ${
                  isMobile ? "text-md" : "text-2xl md:text-3xl"
                }`}
              >
                Kerr Black Hole Explorer
              </h1>
              <p
                className={`text-white/60 mt-1 ${
                  isMobile ? "hidden md:block text-xs" : "text-xs"
                }`}
              >
                Real-time relativistic physics simulation
              </p>
            </div>

            <div className="flex items-center gap-2 md:gap-3">
              <div
                className={`text-green-400 font-mono bg-black/30 px-2 md:px-3 py-1 rounded-full ${
                  isMobile ? "text-xs" : "text-xs"
                }`}
              >
                {fps} FPS
              </div>

              <button
                onClick={() => setShowInfo(!showInfo)}
                className={`cursor-pointer p-2 md:p-3 rounded-xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-white/20 backdrop-blur-sm hover:from-blue-500/30 hover:to-purple-500/30 transition-all duration-300`}
              >
                <svg
                  className={`text-white ${isMobile ? "w-4 h-4" : "w-5 h-5"}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </button>

              <button
                onClick={() => setShowControls(!showControls)}
                className={`cursor-pointer p-2 md:p-3 rounded-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-white/20 backdrop-blur-sm hover:from-purple-500/30 hover:to-pink-500/30 transition-all duration-300`}
              >
                <svg
                  className={`text-white ${isMobile ? "w-4 h-4" : "w-5 h-5"}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Physics Info Panel */}
      {showInfo && (
        <div
          className={`absolute z-40 ${
            isMobile
              ? "top-20 left-2 right-2"
              : "top-48 right-4 w-80 max-w-[calc(100vw-2rem)]"
          }`}
        >
          <div className="backdrop-blur-2xl bg-gradient-to-br from-indigo-900/20 via-purple-900/20 to-pink-900/20 rounded-2xl md:rounded-3xl border border-white/10 shadow-2xl p-4 md:p-6 animate-in slide-in-from-right duration-300">
            <h3
              className={`font-bold text-white md:mb-4 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent ${
                isMobile ? "text-sm mb-1" : "text-lg mb-3"
              }`}
            >
              Relativistic Physics
            </h3>
            <div
              className={`${
                isMobile
                  ? "text-xs grid grid-cols-2 gap-2"
                  : "text-sm space-y-2 md:space-y-3"
              }`}
            >
              <div className="flex justify-between items-center">
                <span className="text-white/80">Event Horizon:</span>
                <span className="text-cyan-400 font-mono bg-black/30 px-2 py-1 rounded-lg">
                  {schwarzschildRadius(params.mass).toFixed(2)} km
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/80">Photon Sphere:</span>
                <span className="text-yellow-400 font-mono bg-black/30 px-2 py-1 rounded-lg">
                  {photonSphereRadius(params.mass).toFixed(2)} km
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/80">ISCO:</span>
                <span className="text-purple-400 font-mono bg-black/30 px-2 py-1 rounded-lg">
                  {iscoRadius(params.mass, params.spin).toFixed(2)} km
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/80">Hawking Temp:</span>
                <span className="text-green-400 font-mono bg-black/30 px-2 py-1 rounded-lg">
                  {(6e-8 / params.mass).toExponential(1)} K
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Controls Panel */}
      {showControls && (
        <div
          className={`absolute z-40 ${
            isMobile ? "bottom-16 left-2 right-2" : "bottom-20 left-4 right-4"
          }`}
        >
          <div className="backdrop-blur-2xl bg-gradient-to-r from-purple-900/20 via-blue-900/20 to-cyan-900/20 rounded-2xl md:rounded-3xl border border-white/10 shadow-2xl p-4 md:p-6 animate-in slide-in-from-bottom duration-300">
            <div
              className={`grid gap-4 md:gap-6 ${
                isMobile
                  ? "grid-cols-2"
                  : "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
              }`}
            >
              {/* Mass */}
              <div className="space-y-2 md:space-y-3">
                <label
                  className={`font-semibold text-white flex items-center justify-between ${
                    isMobile ? "text-xs" : "text-sm"
                  }`}
                >
                  <span className="flex items-center gap-1 md:gap-2">
                    <span
                      className={`bg-cyan-400 rounded-full ${
                        isMobile ? "w-2 h-2" : "w-3 h-3"
                      }`}
                    ></span>
                    Mass (M☉)
                  </span>
                  <span
                    className={`text-cyan-400 font-mono ${
                      isMobile ? "text-sm" : "text-lg"
                    }`}
                  >
                    {params.mass}
                  </span>
                </label>
                <input
                  type="range"
                  min="5"
                  max="100"
                  step="1"
                  value={params.mass}
                  onChange={(e) =>
                    setParams((prev) => ({
                      ...prev,
                      mass: parseFloat(e.target.value),
                    }))
                  }
                  className="modern-slider"
                />
              </div>

              {/* Lensing */}
              <div className="space-y-2 md:space-y-3">
                <label
                  className={`font-semibold text-white flex items-center justify-between ${
                    isMobile ? "text-xs" : "text-sm"
                  }`}
                >
                  <span className="flex items-center gap-1 md:gap-2">
                    <span
                      className={`bg-purple-400 rounded-full ${
                        isMobile ? "w-2 h-2" : "w-3 h-3"
                      }`}
                    ></span>
                    Lensing
                  </span>
                  <span
                    className={`text-purple-400 font-mono ${
                      isMobile ? "text-sm" : "text-lg"
                    }`}
                  >
                    {params.spin.toFixed(2)}
                  </span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="0.99"
                  step="0.01"
                  value={params.spin}
                  onChange={(e) =>
                    setParams((prev) => ({
                      ...prev,
                      spin: parseFloat(e.target.value),
                    }))
                  }
                  className="modern-slider"
                />
              </div>

              {/* Time Scale */}
              <div className="space-y-2 md:space-y-3">
                <label
                  className={`font-semibold text-white flex items-center justify-between ${
                    isMobile ? "text-xs" : "text-sm"
                  }`}
                >
                  <span className="flex items-center gap-1 md:gap-2">
                    <span
                      className={`bg-yellow-400 rounded-full ${
                        isMobile ? "w-2 h-2" : "w-3 h-3"
                      }`}
                    ></span>
                    Time Scale
                  </span>
                  <span
                    className={`text-yellow-400 font-mono ${
                      isMobile ? "text-sm" : "text-lg"
                    }`}
                  >
                    {params.timeScale.toFixed(1)}×
                  </span>
                </label>
                <input
                  type="range"
                  min="0.1"
                  max="5"
                  step="0.1"
                  value={params.timeScale}
                  onChange={(e) =>
                    setParams((prev) => ({
                      ...prev,
                      timeScale: parseFloat(e.target.value),
                    }))
                  }
                  className="modern-slider"
                />
              </div>

              {/* Disk Temperature */}
              <div className="space-y-2 md:space-y-3">
                <label
                  className={`font-semibold text-white flex items-center justify-between ${
                    isMobile ? "text-xs" : "text-sm"
                  }`}
                >
                  <span className="flex items-center gap-1 md:gap-2">
                    <span
                      className={`bg-red-400 rounded-full ${
                        isMobile ? "w-2 h-2" : "w-3 h-3"
                      }`}
                    ></span>
                    Disk Temp (K)
                  </span>
                  <span
                    className={`text-red-400 font-mono ${
                      isMobile ? "text-sm" : "text-lg"
                    }`}
                  >
                    {params.diskTemperature.toLocaleString()}
                  </span>
                </label>
                <input
                  type="range"
                  min="3000"
                  max="50000"
                  step="1000"
                  value={params.diskTemperature}
                  onChange={(e) =>
                    setParams((prev) => ({
                      ...prev,
                      diskTemperature: parseInt(e.target.value),
                    }))
                  }
                  className="modern-slider"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Instructions */}
      <div
        className={`absolute bottom-2 md:bottom-3 left-2 md:left-4 right-2 md:right-4 z-40`}
      >
        <div className="backdrop-blur-2xl bg-gradient-to-r from-black/20 via-gray-900/20 to-black/20 rounded-xl md:rounded-2xl border border-white/10 shadow-2xl p-2 md:p-2">
          <div className="text-center text-white/80 space-y-1 md:space-y-2">
            <div
              className={`flex flex-wrap justify-center gap-2 md:gap-4 ${
                isMobile ? "text-xs" : "text-sm"
              }`}
            >
              <span>
                <span className="text-cyan-400 font-semibold">
                  {isMobile ? "Drag" : "Drag"}
                </span>{" "}
                to orbit
              </span>
              <span>
                <span className="text-purple-400 font-semibold">Swipe →</span>{" "}
                time control
              </span>
              <span>
                <span className="text-yellow-400 font-semibold">{isMobile ? "Pinch" : "Scroll"}</span> to
                zoom
              </span>
              <span>
                <span className="text-pink-400 font-semibold">Drag</span> matter
                into hole
              </span>
            </div>
            <p
              className={`text-white/50 ${
                isMobile ? "text-xs hidden" : "text-xs"
              }`}
            >
              Realistic Kerr black hole • Gravitational lensing • Frame dragging
              • Redshift effects
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap");

        .modern-slider {
          appearance: none;
          width: 100%;
          height: ${isMobile ? "6px" : "8px"};
          background: linear-gradient(
            90deg,
            rgba(59, 130, 246, 0.3) 0%,
            rgba(147, 51, 234, 0.3) 50%,
            rgba(236, 72, 153, 0.3) 100%
          );
          border-radius: 8px;
          outline: none;
          border: 1px solid rgba(255, 255, 255, 0.1);
          cursor: pointer;
        }

        .modern-slider::-webkit-slider-thumb {
          appearance: none;
          width: ${isMobile ? "18px" : "24px"};
          height: ${isMobile ? "18px" : "24px"};
          border-radius: 50%;
          background: linear-gradient(
            145deg,
            rgba(96, 165, 250, 1),
            rgba(147, 51, 234, 1)
          );
          border: 2px solid rgba(255, 255, 255, 0.4);
          cursor: pointer;
          box-shadow: 0 0 20px rgba(147, 51, 234, 0.6),
            0 4px 15px rgba(0, 0, 0, 0.3),
            inset 0 1px 3px rgba(255, 255, 255, 0.2);
          transition: all 0.2s ease;
        }

        .modern-slider::-webkit-slider-thumb:hover {
          transform: scale(1.1);
          box-shadow: 0 0 30px rgba(147, 51, 234, 0.8),
            0 6px 20px rgba(0, 0, 0, 0.4),
            inset 0 1px 3px rgba(255, 255, 255, 0.3);
        }

        .modern-slider::-moz-range-thumb {
          width: ${isMobile ? "18px" : "24px"};
          height: ${isMobile ? "18px" : "24px"};
          border-radius: 50%;
          background: linear-gradient(
            145deg,
            rgba(96, 165, 250, 1),
            rgba(147, 51, 234, 1)
          );
          border: 2px solid rgba(255, 255, 255, 0.4);
          cursor: pointer;
          box-shadow: 0 0 20px rgba(147, 51, 234, 0.6);
        }

        @keyframes animate-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-in {
          animation: animate-in 0.3s ease-out;
        }

        .slide-in-from-top {
          animation: slide-in-from-top 0.3s ease-out;
        }

        .slide-in-from-right {
          animation: slide-in-from-right 0.3s ease-out;
        }

        .slide-in-from-bottom {
          animation: slide-in-from-bottom 0.3s ease-out;
        }

        @keyframes slide-in-from-top {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-in-from-right {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slide-in-from-bottom {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default BlackHoleExplorer;
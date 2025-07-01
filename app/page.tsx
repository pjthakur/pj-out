"use client";
import React, { useRef, useEffect, useState, useCallback } from "react";
import * as THREE from "three";
import {
  MdRefresh,
  MdVisibility,
  MdVisibilityOff,
  MdWbSunny,
  MdDarkMode,
  MdExpandMore,
  MdExpandLess,
  MdFlashOn,
} from "react-icons/md";

interface PhysicsBody {
  mesh: THREE.Mesh;
  velocity: THREE.Vector3;
  mass: number;
  radius: number;
  type: "sphere" | "cube";
  id: string;
  collidingWith: Set<string>;
}

function App() {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const bodiesRef = useRef<PhysicsBody[]>([]);
  const animationRef = useRef<number | null>(null);
  const raycasterRef = useRef<THREE.Raycaster | null>(null);
  const mouseRef = useRef<THREE.Vector2 | null>(null);
  const draggedBodyRef = useRef<PhysicsBody | null>(null);

  const dragOffsetRef = useRef<THREE.Vector3 | null>(null);
  const lastDragPositionRef = useRef<THREE.Vector3 | null>(null);
  const dragPlaneRef = useRef<THREE.Plane | null>(null);
  const groundRef = useRef<THREE.Mesh | null>(null);
  const lightsRef = useRef<{
    ambient: THREE.AmbientLight;
    directional: THREE.DirectionalLight;
  } | null>(null);


  const [gravity, setGravity] = useState(0.5);
  const [collisionCount, setCollisionCount] = useState(0);
  const [isWireframe, setIsWireframe] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showUI, setShowUI] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  
  const initScene = useCallback(() => {
    if (!mountRef.current) return;

    
    if (
      rendererRef.current &&
      mountRef.current.contains(rendererRef.current.domElement)
    ) {
      mountRef.current.removeChild(rendererRef.current.domElement);
    }

    
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(isDarkMode ? 0x1e293b : 0xf0f8ff);
    sceneRef.current = scene;

    
    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 10);
    cameraRef.current = camera;

    
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(
      mountRef.current.clientWidth,
      mountRef.current.clientHeight
    );
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    mountRef.current.appendChild(renderer.domElement);

    
    const ambientLight = new THREE.AmbientLight(
      isDarkMode ? 0x64748b : 0x606060,
      isDarkMode ? 0.5 : 0.6
    );
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(
      isDarkMode ? 0xe2e8f0 : 0xffffff,
      isDarkMode ? 1.0 : 0.8
    );
    
    directionalLight.position.set(isDarkMode ? 5 : 3, 20, isDarkMode ? 15 : 10);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    
    
    directionalLight.shadow.camera.left = -100;
    directionalLight.shadow.camera.right = 100;
    directionalLight.shadow.camera.top = 100;
    directionalLight.shadow.camera.bottom = -100;
    directionalLight.shadow.camera.near = 0.1;
    directionalLight.shadow.camera.far = 50;
    directionalLight.shadow.bias = -0.0001;
    
    scene.add(directionalLight);

    let rimLight: THREE.DirectionalLight | null = null;
    if (isDarkMode) {
      rimLight = new THREE.DirectionalLight(0x4a90e2, 0.3);
      rimLight.position.set(-10, 5, -5);
      scene.add(rimLight);
    }

    lightsRef.current = {
      ambient: ambientLight,
      directional: directionalLight,
    };

    
    raycasterRef.current = new THREE.Raycaster();
    mouseRef.current = new THREE.Vector2();

    
    createInitialBodies();

    
    const groundGeometry = new THREE.PlaneGeometry(200, 200); 
    const groundMaterial = new THREE.MeshLambertMaterial({
      color: isDarkMode ? 0x44403c : 0xcccccc,
      transparent: true,
      opacity: isDarkMode ? 0.7 : 0.3,
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -5;
    ground.receiveShadow = true;
    scene.add(ground);
    groundRef.current = ground;

    setTimeout(() => {
      setIsLoading(false);
    },2000);
  }, []);

  
  const updateThemeColors = useCallback(() => {
    if (!sceneRef.current || !lightsRef.current || !groundRef.current) return;

    sceneRef.current.background = new THREE.Color(
      isDarkMode ? 0x1e293b : 0xf0f8ff
    );

    lightsRef.current.ambient.color.setHex(isDarkMode ? 0x64748b : 0x606060);
    lightsRef.current.ambient.intensity = isDarkMode ? 0.5 : 0.6;
    lightsRef.current.directional.color.setHex(
      isDarkMode ? 0xe2e8f0 : 0xffffff
    );
    lightsRef.current.directional.intensity = isDarkMode ? 1.0 : 0.8;

    (groundRef.current.material as THREE.MeshLambertMaterial).color.setHex(
      isDarkMode ? 0x44403c : 0xcccccc
    );
    (groundRef.current.material as THREE.MeshLambertMaterial).opacity = isDarkMode ? 0.7 : 0.3;

    bodiesRef.current.forEach((body, index) => {
      const material = body.mesh.material as THREE.MeshPhongMaterial;
      
      if (body.type === "sphere") {
        const subtleColors = isDarkMode ? [
          0x6b9bd2, // Soft Blue
          0xb392ac, // Muted Purple
          0x7db383, // Sage Green
          0xc19a6b, // Warm Beige
          0x9370db, // Medium Slate Blue
          0xcd919e, // Dusty Rose
        ] : [
          0x5a7bb8, // Steel Blue
          0x8b7ca6, // Lavender Gray
          0x6b8e6b, // Forest Green
          0xa67c52, // Bronze
          0x8b5a8c, // Plum
          0x7a8cb8, // Periwinkle
        ];
        const colorIndex = index % subtleColors.length;
        material.color.setHex(subtleColors[colorIndex]);
        material.emissive.copy(new THREE.Color(subtleColors[colorIndex]).multiplyScalar(isDarkMode ? 0.05 : 0));
      } else {
        const subtleCubeColors = isDarkMode ? [
          0xb8860b, // Dark Goldenrod
          0x8fbc8f, // Dark Sea Green
          0xd2691e, // Chocolate
          0x4682b4, // Steel Blue
          0xbc8f8f, // Rosy Brown
          0x9370db, // Medium Purple
        ] : [
          0xa0522d, // Sienna
          0x2e8b57, // Sea Green
          0x8b4513, // Saddle Brown
          0x4169e1, // Royal Blue
          0x8b5a2b, // Dark Goldenrod
          0x9932cc, // Dark Orchid
        ];
        const colorIndex = (index - 3) % subtleCubeColors.length;
        material.color.setHex(subtleCubeColors[colorIndex]);
        material.emissive.copy(new THREE.Color(subtleCubeColors[colorIndex]).multiplyScalar(isDarkMode ? 0.04 : 0));
      }
      
      material.shininess = isDarkMode ? (body.type === "sphere" ? 60 : 70) : (body.type === "sphere" ? 30 : 40);
    });
  }, [isDarkMode]);

  
  const createInitialBodies = useCallback(() => {
    const bodies: PhysicsBody[] = [];

    
    for (let i = 0; i < 3; i++) {
      const radius = 0.3 + Math.random() * 0.4;
      const geometry = new THREE.SphereGeometry(radius, 32, 32);
      const subtleColors = isDarkMode ? [
        0x6b9bd2, // Soft Blue
        0xb392ac, // Muted Purple
        0x7db383, // Sage Green
        0xc19a6b, // Warm Beige
        0x9370db, // Medium Slate Blue
        0xcd919e, // Dusty Rose
      ] : [
        0x5a7bb8, // Steel Blue
        0x8b7ca6, // Lavender Gray
        0x6b8e6b, // Forest Green
        0xa67c52, // Bronze
        0x8b5a8c, // Plum
        0x7a8cb8, // Periwinkle
      ];
      
      const material = new THREE.MeshPhongMaterial({
        color: subtleColors[i % subtleColors.length],
        wireframe: false,
        shininess: isDarkMode ? 60 : 30,
        emissive: isDarkMode ? new THREE.Color(subtleColors[i % subtleColors.length]).multiplyScalar(0.05) : new THREE.Color(0x000000),
      });

      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(
        (Math.random() - 0.5) * 8, 
        Math.random() * 3 + radius, 
        (Math.random() - 0.5) * 3
      );
      mesh.castShadow = true;
      mesh.receiveShadow = true;

      sceneRef.current?.add(mesh);

      bodies.push({
        mesh,
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * 4, 
          (Math.random() - 0.5) * 3, 
          (Math.random() - 0.5) * 4  
        ),
        mass: radius * 2,
        radius,
        type: "sphere",
        id: `sphere-${i}`,
        collidingWith: new Set(),
      });
    }

    
    for (let i = 0; i < 2; i++) {
      const size = 0.4 + Math.random() * 0.6;
      const geometry = new THREE.BoxGeometry(size, size, size);
      const subtleCubeColors = isDarkMode ? [
        0xb8860b, // Dark Goldenrod
        0x8fbc8f, // Dark Sea Green
        0xd2691e, // Chocolate
        0x4682b4, // Steel Blue
        0xbc8f8f, // Rosy Brown
        0x9370db, // Medium Purple
      ] : [
        0xa0522d, // Sienna
        0x2e8b57, // Sea Green
        0x8b4513, // Saddle Brown
        0x4169e1, // Royal Blue
        0x8b5a2b, // Dark Goldenrod
        0x9932cc, // Dark Orchid
      ];
      
      const material = new THREE.MeshPhongMaterial({
        color: subtleCubeColors[i % subtleCubeColors.length],
        wireframe: false,
        shininess: isDarkMode ? 70 : 40,
        emissive: isDarkMode ? new THREE.Color(subtleCubeColors[i % subtleCubeColors.length]).multiplyScalar(0.04) : new THREE.Color(0x000000),
      });

      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(
        (Math.random() - 0.5) * 8, 
        Math.random() * 3 + size / 2, 
        (Math.random() - 0.5) * 3
      );
      mesh.castShadow = true;
      mesh.receiveShadow = true;

      sceneRef.current?.add(mesh);

      bodies.push({
        mesh,
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * 4, 
          (Math.random() - 0.5) * 3, 
          (Math.random() - 0.5) * 4  
        ),
        mass: size * 1.5,
        radius: size / 2,
        type: "cube",
        id: `cube-${i}`,
        collidingWith: new Set(),
      });
    }

    bodiesRef.current = bodies;
  }, []);

  
  const toggleWireframe = useCallback(() => {
    setIsWireframe((prev) => {
      const newWireframe = !prev;
      bodiesRef.current.forEach((body) => {
        (body.mesh.material as THREE.MeshPhongMaterial).wireframe = newWireframe;
      });
      return newWireframe;
    });
  }, []);

  
  const calculatePhysicsBounds = useCallback(() => {
    if (!cameraRef.current || !mountRef.current) {
      return { x: 6, y: 3, z: 2 }; 
    }

    const camera = cameraRef.current;
    const aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;

    
    const distance = Math.abs(camera.position.z);
    const vFOV = (camera.fov * Math.PI) / 180; 

    
    const visibleHeight = 2 * Math.tan(vFOV / 2) * distance;
    const visibleWidth = visibleHeight * aspect;

    
    const boundsMultiplier = 0.95; 
    
    
    const isMobile = mountRef.current.clientWidth < 768;
    const mobileAdjustment = isMobile ? 0.98 : 1.0; 

    const finalBounds = {
      x: (visibleWidth / 2) * boundsMultiplier * mobileAdjustment,
      y: (visibleHeight / 2) * boundsMultiplier * mobileAdjustment,
      z: 3, 
    };



    return finalBounds;
  }, []);

  
  const updatePhysics = useCallback(
    (deltaTime: number) => {
      if (!sceneRef.current) return;

      const bodies = bodiesRef.current;
      const bounds = calculatePhysicsBounds();

      bodies.forEach((body) => {
        
        if (draggedBodyRef.current === body) return;

        
        const gravityForce = gravity * 9.81 * deltaTime; 
        body.velocity.y -= gravityForce;

        
        const time = Date.now() * 0.001; 
        const forceMultiplier = 0.1 * deltaTime;
        
        
        body.velocity.x += Math.sin(time * 0.5 + body.mesh.position.x * 0.1) * forceMultiplier;
        body.velocity.z += Math.cos(time * 0.3 + body.mesh.position.z * 0.1) * forceMultiplier;
        
        
        if (Math.random() < 0.005) { 
          body.velocity.add(new THREE.Vector3(
            (Math.random() - 0.5) * 1.5,
            (Math.random() - 0.5) * 1.0,
            (Math.random() - 0.5) * 1.5
          ));
        }

        
        const airResistance = 0.998 - (gravity * 0.001); 
        body.velocity.multiplyScalar(Math.max(airResistance, 0.995)); 
        
        
        const newPosition = body.mesh.position.clone().add(body.velocity.clone().multiplyScalar(deltaTime));
        
        
        const boundX = bounds.x - body.radius;
        const boundY = bounds.y - body.radius;  
        const boundZ = bounds.z - body.radius;
        
        
        if (newPosition.x > boundX) {
          newPosition.x = boundX;
          body.velocity.x = -Math.abs(body.velocity.x) * 0.8; 
        } else if (newPosition.x < -boundX) {
          newPosition.x = -boundX;
          body.velocity.x = Math.abs(body.velocity.x) * 0.8; 
        }
        
        if (newPosition.y > boundY) {
          newPosition.y = boundY;
          body.velocity.y = -Math.abs(body.velocity.y) * 0.7; 
        } else if (newPosition.y < -boundY) {
          newPosition.y = -boundY;
          body.velocity.y = Math.abs(body.velocity.y) * 0.7; 
        }
        
        if (newPosition.z > boundZ) {
          newPosition.z = boundZ;
          body.velocity.z = -Math.abs(body.velocity.z) * 0.8; 
        } else if (newPosition.z < -boundZ) {
          newPosition.z = -boundZ;
          body.velocity.z = Math.abs(body.velocity.z) * 0.8; 
        }

        
        body.mesh.position.copy(newPosition);

        
        
        const maxX = bounds.x - body.radius;
        if (body.mesh.position.x > maxX) {
          body.mesh.position.x = maxX;
          body.velocity.x = -Math.abs(body.velocity.x) * 0.75; 
        } else if (body.mesh.position.x < -maxX) {
          body.mesh.position.x = -maxX;
          body.velocity.x = Math.abs(body.velocity.x) * 0.75; 
        }
        
        
        const maxZ = bounds.z - body.radius;
        if (body.mesh.position.z > maxZ) {
          body.mesh.position.z = maxZ;
          body.velocity.z = -Math.abs(body.velocity.z) * 0.75; 
        } else if (body.mesh.position.z < -maxZ) {
          body.mesh.position.z = -maxZ;
          body.velocity.z = Math.abs(body.velocity.z) * 0.75; 
        }
        
        
        
        const groundLevel = -5;
        const bottomPosition = body.mesh.position.y - body.radius;
        
        if (bottomPosition <= groundLevel) {
          
          body.mesh.position.y = groundLevel + body.radius + 0.001;
          
          
          const baseRestitution = 0.8; 
          const gravityDamping = Math.min(gravity / 3, 0.3); 
          const dynamicRestitution = Math.max(baseRestitution - gravityDamping, 0.3); 
          
          
          body.velocity.y *= -dynamicRestitution;
          
          
          const settlingThreshold = 0.15 - (gravity * 0.05); 
          if (Math.abs(body.velocity.y) < Math.max(settlingThreshold, 0.05)) {
            body.velocity.y = 0;
            
            
            const friction = 0.92 + (gravity * 0.02); 
            body.velocity.x *= friction;
            body.velocity.z *= friction;
          }
          
          
          if (gravity > 1.0) {
            body.velocity.multiplyScalar(0.98); 
          }
        }
        
        const maxY = bounds.y - body.radius;
        if (body.mesh.position.y > maxY) {
          body.mesh.position.y = maxY;
          body.velocity.y = Math.min(body.velocity.y, 0) * 0.6; 
        }

        
        const speed = body.velocity.length();
        const sleepThreshold = 0.02 + (gravity * 0.01); 
        
        if (speed < sleepThreshold && Math.abs(body.mesh.position.y - (-5 + body.radius)) < 0.1) {
          
          body.velocity.multiplyScalar(0.95); 
          
          if (speed < sleepThreshold * 0.3) {
            body.velocity.set(0, 0, 0); 
          }
        }
        
        
        const rotationSpeed = Math.max(speed * 0.1, 0.01);
        body.mesh.rotation.x += rotationSpeed * deltaTime;
        body.mesh.rotation.y += rotationSpeed * deltaTime;
      });

      
      for (let i = 0; i < bodies.length; i++) {
        for (let j = i + 1; j < bodies.length; j++) {
          const bodyA = bodies[i];
          const bodyB = bodies[j];

          if (draggedBodyRef.current === bodyA || draggedBodyRef.current === bodyB) {
            continue;
          }

          const positionA = bodyA.mesh.position;
          const positionB = bodyB.mesh.position;
          const distance = positionA.distanceTo(positionB);
          const minDistance = bodyA.radius + bodyB.radius;
          const isColliding = distance < minDistance && distance > 0.001;
          
          const wasColliding = bodyA.collidingWith.has(bodyB.id);

          if (isColliding) {
            if (!wasColliding) {
              setCollisionCount((prev) => prev + 1);
              bodyA.collidingWith.add(bodyB.id);
              bodyB.collidingWith.add(bodyA.id);
            }

            const normal = positionB.clone().sub(positionA);
            
            if (normal.length() < 0.001) {
              normal.set(1, 0, 0);
            } else {
              normal.normalize();
            }

            const overlap = minDistance - distance;
            const separationFactor = 1.1;
            const totalSeparation = overlap * separationFactor;

            const totalMass = bodyA.mass + bodyB.mass;
            const moveA = totalSeparation * (bodyB.mass / totalMass);
            const moveB = totalSeparation * (bodyA.mass / totalMass);

            positionA.sub(normal.clone().multiplyScalar(moveA));
            positionB.add(normal.clone().multiplyScalar(moveB));

            const relativeVelocity = bodyA.velocity.clone().sub(bodyB.velocity);
            const velocityAlongNormal = relativeVelocity.dot(normal);

            if (velocityAlongNormal < 0) {
              const baseRestitution = 0.9;
              const gravityReduction = Math.min(gravity * 0.1, 0.3);
              const restitution = Math.max(baseRestitution - gravityReduction, 0.4);
              
              const massRatio = 2 / (bodyA.mass + bodyB.mass);
              const impulseScalar = -(1 + restitution) * velocityAlongNormal * massRatio;
              const impulse = normal.clone().multiplyScalar(impulseScalar);

              bodyA.velocity.add(impulse.clone().multiplyScalar(bodyB.mass));
              bodyB.velocity.sub(impulse.clone().multiplyScalar(bodyA.mass));

              const baseDamping = 0.995;
              const gravityDamping = Math.min(gravity * 0.005, 0.01);
              const dynamicDamping = baseDamping - gravityDamping;
              
              bodyA.velocity.multiplyScalar(dynamicDamping);
              bodyB.velocity.multiplyScalar(dynamicDamping);

              const randomFactor = 0.1;
              const randomVelocityA = new THREE.Vector3(
                (Math.random() - 0.5) * randomFactor,
                (Math.random() - 0.5) * randomFactor * 0.5,
                (Math.random() - 0.5) * randomFactor
              );
              const randomVelocityB = new THREE.Vector3(
                (Math.random() - 0.5) * randomFactor,
                (Math.random() - 0.5) * randomFactor * 0.5,
                (Math.random() - 0.5) * randomFactor
              );
              
              bodyA.velocity.add(randomVelocityA);
              bodyB.velocity.add(randomVelocityB);

              const spinFactor = 0.02;
              bodyA.mesh.rotation.x += (Math.random() - 0.5) * spinFactor;
              bodyA.mesh.rotation.z += (Math.random() - 0.5) * spinFactor;
              bodyB.mesh.rotation.x += (Math.random() - 0.5) * spinFactor;
              bodyB.mesh.rotation.z += (Math.random() - 0.5) * spinFactor;
            }
          } else if (wasColliding) {
            bodyA.collidingWith.delete(bodyB.id);
            bodyB.collidingWith.delete(bodyA.id);
          }
        }
      }

      bodies.forEach((body) => {
        if (body.collidingWith.size > 0) {
          const collisionStates = Array.from(body.collidingWith);
          collisionStates.forEach((otherId) => {
            const otherBody = bodies.find(b => b.id === otherId);
            if (otherBody) {
              const distance = body.mesh.position.distanceTo(otherBody.mesh.position);
              const minDistance = body.radius + otherBody.radius;
              
              if (distance >= minDistance + 0.01) {
                body.collidingWith.delete(otherId);
                otherBody.collidingWith.delete(body.id);
              }
            }
          });
        }
      });

      
      bodies.forEach((body) => {
        const pos = body.mesh.position;
        const vel = body.velocity;
        
        
        if (!isFinite(pos.x) || !isFinite(pos.y) || !isFinite(pos.z)) {
          pos.set(
            (Math.random() - 0.5) * 2,
            (Math.random() - 0.5) * 1,
            (Math.random() - 0.5) * 1
          );
        }
        
        if (!isFinite(vel.x) || !isFinite(vel.y) || !isFinite(vel.z)) {
          vel.set(0, 0, 0);
        }

        
        const safeBounds = calculatePhysicsBounds();
        const radius = body.radius;
        let needsCorrection = false;
        
        
        if (pos.x > safeBounds.x - radius) {
          pos.x = safeBounds.x - radius;
          vel.x = Math.min(vel.x, 0);
          needsCorrection = true;
        } else if (pos.x < -safeBounds.x + radius) {
          pos.x = -safeBounds.x + radius;
          vel.x = Math.max(vel.x, 0);
          needsCorrection = true;
        }
        
        
        if (pos.y > safeBounds.y - radius) {
          pos.y = safeBounds.y - radius;
          vel.y = Math.min(vel.y, 0);
          needsCorrection = true;
        } else if (pos.y < -safeBounds.y + radius) {
          pos.y = -safeBounds.y + radius;
          vel.y = Math.max(vel.y, 0);
          needsCorrection = true;
        }
        
        
        if (pos.z > safeBounds.z - radius) {
          pos.z = safeBounds.z - radius;
          vel.z = Math.min(vel.z, 0);
          needsCorrection = true;
        } else if (pos.z < -safeBounds.z + radius) {
          pos.z = -safeBounds.z + radius;
          vel.z = Math.max(vel.z, 0);
          needsCorrection = true;
        }
        
        
        if (needsCorrection) {
          vel.multiplyScalar(0.5);
        }

        
        const maxVelocity = 15; 
        if (vel.length() > maxVelocity) {
          vel.normalize().multiplyScalar(maxVelocity);
        }
      });
    },
    [gravity, calculatePhysicsBounds]
  );

  
  const animate = useCallback(() => {
    if (!rendererRef.current || !sceneRef.current || !cameraRef.current) return;

    const deltaTime = 0.016; 
    updatePhysics(deltaTime);

    rendererRef.current.render(sceneRef.current, cameraRef.current);
    animationRef.current = requestAnimationFrame(animate);
  }, [updatePhysics]);

  
  const resolveDragCollisions = useCallback((draggedBody: PhysicsBody, targetPosition: THREE.Vector3): THREE.Vector3 => {
    let correctedPosition = targetPosition.clone();
    const draggedRadius = draggedBody.radius;
    let hasCollision = false;
    
    
    for (let pass = 0; pass < 3; pass++) {
      let passHasCollision = false;
      
      
      for (const otherBody of bodiesRef.current) {
        if (otherBody === draggedBody) continue;
        
        const otherPosition = otherBody.mesh.position;
        const distance = correctedPosition.distanceTo(otherPosition);
        const minDistance = draggedRadius + otherBody.radius;
        
        if (distance < minDistance) {
          passHasCollision = true;
          hasCollision = true;
          
          
          const separationDirection = correctedPosition.clone().sub(otherPosition);
          
          
          if (separationDirection.length() < 0.001) {
            
            const angle = (draggedBody.id.charCodeAt(0) + otherBody.id.charCodeAt(0)) * 0.1;
            separationDirection.set(Math.cos(angle), 0, Math.sin(angle));
          } else {
            separationDirection.normalize();
          }
          
          const overlap = minDistance - distance;
          
          
          const pushForce = Math.min(overlap * 0.1, 0.05); 
          otherBody.mesh.position.add(
            separationDirection.clone().multiplyScalar(-pushForce)
          );
          
          
          const pushVelocity = separationDirection.clone().multiplyScalar(-pushForce * 5);
          otherBody.velocity.add(pushVelocity);
          
          
          correctedPosition.copy(otherPosition).add(
            separationDirection.multiplyScalar(minDistance + 0.05)
          );
        }
      }
      
      
      if (!passHasCollision) break;
    }
    
    
    const material = draggedBody.mesh.material as THREE.MeshPhongMaterial;
    if (hasCollision) {
      
      material.emissive.setHex(0x220000); 
    } else {
      material.emissive.setHex(0x000000); 
    }
    
            
        const groundLevel = -5;
        const bottomPosition = correctedPosition.y - draggedRadius;
        if (bottomPosition <= groundLevel) {
          correctedPosition.y = groundLevel + draggedRadius + 0.01;
        }
    
    
    const bounds = calculatePhysicsBounds();
    
    
    const maxX = bounds.x - draggedRadius;
    correctedPosition.x = Math.max(-maxX, Math.min(maxX, correctedPosition.x));
    
    
    const maxY = bounds.y - draggedRadius;
    correctedPosition.y = Math.max(-maxY, Math.min(maxY, correctedPosition.y));
    
    
    const maxZ = bounds.z - draggedRadius;
    correctedPosition.z = Math.max(-maxZ, Math.min(maxZ, correctedPosition.z));
    
    return correctedPosition;
  }, [calculatePhysicsBounds]);

  
  const handlePointerDown = useCallback((event: React.PointerEvent) => {
    if (!raycasterRef.current || !mouseRef.current || !cameraRef.current)
      return;

    const rect = (event.target as HTMLElement).getBoundingClientRect();
    mouseRef.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouseRef.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycasterRef.current.setFromCamera(mouseRef.current, cameraRef.current);
    const intersects = raycasterRef.current.intersectObjects(
      bodiesRef.current.map((body) => body.mesh)
    );

    if (intersects.length > 0) {
      const intersectedObject = intersects[0].object;
      const body = bodiesRef.current.find((b) => b.mesh === intersectedObject);
      if (body) {
        draggedBodyRef.current = body;
        body.velocity.set(0, 0, 0);

        
        const cameraDirection = new THREE.Vector3();
        cameraRef.current.getWorldDirection(cameraDirection);
        dragPlaneRef.current = new THREE.Plane(cameraDirection, -body.mesh.position.z);

        
        const clickPoint = intersects[0].point;
        dragOffsetRef.current = body.mesh.position.clone().sub(clickPoint);
        
        
        lastDragPositionRef.current = body.mesh.position.clone();
      }
    }
  }, []);

  const handlePointerMove = useCallback((event: React.PointerEvent) => {
    if (
      !draggedBodyRef.current ||
      !raycasterRef.current ||
      !mouseRef.current ||
      !cameraRef.current ||
      !dragPlaneRef.current ||
      !dragOffsetRef.current ||
      !lastDragPositionRef.current
    )
      return;

    const rect = (event.target as HTMLElement).getBoundingClientRect();
    mouseRef.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouseRef.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycasterRef.current.setFromCamera(mouseRef.current, cameraRef.current);
    
    
    const intersectPoint = new THREE.Vector3();
    const hasIntersection = raycasterRef.current.ray.intersectPlane(dragPlaneRef.current, intersectPoint);
    
    if (hasIntersection) {
      
      const targetPosition = intersectPoint.add(dragOffsetRef.current);
      
      
      const currentPosition = draggedBodyRef.current.mesh.position;
      let newPosition = currentPosition.clone().lerp(targetPosition, 0.3);
      
      
      newPosition = resolveDragCollisions(draggedBodyRef.current, newPosition);
      
      
      const velocity = newPosition.clone().sub(lastDragPositionRef.current).multiplyScalar(15);
      
      
      draggedBodyRef.current.mesh.position.copy(newPosition);
    draggedBodyRef.current.velocity.copy(velocity);
      
      
      lastDragPositionRef.current.copy(newPosition);
    }
  }, []);

  const handlePointerUp = useCallback(() => {
    if (draggedBodyRef.current && lastDragPositionRef.current) {
      
      const currentVelocity = draggedBodyRef.current.velocity.clone();
      
      
      draggedBodyRef.current.velocity.copy(currentVelocity.multiplyScalar(1.5));
      
      
      const throwRandomness = 0.5;
      draggedBodyRef.current.velocity.add(new THREE.Vector3(
        (Math.random() - 0.5) * throwRandomness,
        Math.random() * throwRandomness * 0.5, 
        (Math.random() - 0.5) * throwRandomness
      ));
      
      
      const spinStrength = currentVelocity.length() * 0.01;
      draggedBodyRef.current.mesh.rotation.x += (Math.random() - 0.5) * spinStrength;
      draggedBodyRef.current.mesh.rotation.y += (Math.random() - 0.5) * spinStrength;
      draggedBodyRef.current.mesh.rotation.z += (Math.random() - 0.5) * spinStrength;
      
      
      const material = draggedBodyRef.current.mesh.material as THREE.MeshPhongMaterial;
      material.emissive.setHex(0x000000);
    }
    
    
    draggedBodyRef.current = null;
    dragOffsetRef.current = null;
    lastDragPositionRef.current = null;
    dragPlaneRef.current = null;
  }, []);

  
  const forceCollision = useCallback(() => {
    const bodies = bodiesRef.current;
    if (bodies.length === 0) return;

    const centerPoint = new THREE.Vector3(0, 0, 0);
    
    bodies.forEach((body) => {
      const direction = centerPoint.clone().sub(body.mesh.position).normalize();
      const distance = body.mesh.position.distanceTo(centerPoint);
      
      const forceStrength = Math.min(8 + (distance * 2), 15);
      
      body.velocity.add(direction.multiplyScalar(forceStrength));
      
      const randomTwist = new THREE.Vector3(
        (Math.random() - 0.5) * 3,
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 3
      );
      body.velocity.add(randomTwist);
      
      body.mesh.rotation.x += (Math.random() - 0.5) * 0.3;
      body.mesh.rotation.y += (Math.random() - 0.5) * 0.3;
      body.mesh.rotation.z += (Math.random() - 0.5) * 0.3;
    });
  }, []);

  const resetSimulation = useCallback(() => {
    setCollisionCount(0);
    bodiesRef.current.forEach((body) => {
      body.collidingWith.clear();
      sceneRef.current?.remove(body.mesh);
    });
    bodiesRef.current = [];
    createInitialBodies();
    
    setTimeout(() => {
      bodiesRef.current.forEach((body) => {
        body.velocity.add(new THREE.Vector3(
          (Math.random() - 0.5) * 2,
          Math.random() * 1,
          (Math.random() - 0.5) * 2
        ));
      });
    }, 100);
  }, [createInitialBodies]);

  
  const handleResize = useCallback(() => {
    if (!mountRef.current || !cameraRef.current || !rendererRef.current) return;

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    cameraRef.current.aspect = width / height;
    cameraRef.current.updateProjectionMatrix();
    rendererRef.current.setSize(width, height);
    
    
    setTimeout(() => {
      if (!bodiesRef.current) return;
      
      const newBounds = calculatePhysicsBounds();
      bodiesRef.current.forEach((body) => {
        const pos = body.mesh.position;
        const radius = body.radius;
        
        
        pos.x = Math.max(-newBounds.x + radius, Math.min(newBounds.x - radius, pos.x));
        pos.y = Math.max(-newBounds.y + radius, Math.min(newBounds.y - radius, pos.y));
        pos.z = Math.max(-newBounds.z + radius, Math.min(newBounds.z - radius, pos.z));
      });
    }, 100); 
  }, [calculatePhysicsBounds]);

  
  useEffect(() => {
    initScene();

    
    setTimeout(() => {
      handleResize();
    }, 100);

    const handleResizeEvent = () => handleResize();
    window.addEventListener("resize", handleResizeEvent);

    return () => {
      window.removeEventListener("resize", handleResizeEvent);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (
        rendererRef.current &&
        mountRef.current &&
        mountRef.current.contains(rendererRef.current.domElement)
      ) {
        mountRef.current.removeChild(rendererRef.current.domElement);
      }
    };
  }, []); 

  
  useEffect(() => {
    updateThemeColors();
  }, [isDarkMode, updateThemeColors]);

  
  useEffect(() => {
    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [animate]);

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{
        fontFamily: "Poppins, sans-serif",
        background: isDarkMode
          ? "linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #334155 50%, #475569 75%, #64748b 100%)"
          : "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
      }}
    >
      <div
        ref={mountRef}
        className="w-full h-screen relative"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        style={{ 
          touchAction: "none", 
          cursor: "pointer",
          userSelect: "none",
          WebkitUserSelect: "none"
        }}
      />
      <div className="absolute inset-0 pointer-events-none overflow-hidden">




        <div className="sm:hidden absolute top-4 right-4 z-20">
          <button
            onClick={() => setShowUI(!showUI)}
            className="backdrop-blur-md rounded-full p-2.5 pointer-events-auto transition-all duration-300 hover:scale-110 active:scale-95"
            style={{
              background: isDarkMode
                ? "linear-gradient(135deg, rgba(168,85,247,0.25) 0%, rgba(168,85,247,0.15) 100%)"
                : "linear-gradient(135deg, rgba(168,85,247,0.3) 0%, rgba(168,85,247,0.1) 100%)",
              border: "1px solid rgba(168,85,247,0.3)",
              cursor: "pointer",
              minWidth: "40px",
              minHeight: "40px",
            }}
            title={showUI ? "Hide Controls" : "Show Controls"}
          >
            {showUI ? (
              <MdVisibilityOff className="w-4 h-4 text-purple-400" />
            ) : (
              <MdVisibility className="w-4 h-4 text-purple-400" />
            )}
          </button>
        </div>

        <div 
          className={`sm:hidden transition-all duration-500 ease-in-out ${
            showUI 
              ? "opacity-100 translate-y-0 pointer-events-auto" 
              : "opacity-0 -translate-y-4 pointer-events-none"
          }`}
        >
          <div className="absolute top-4 left-4 right-4 flex flex-col space-y-3 z-10">
            <div className="flex items-center justify-start space-x-2">
              <div
                className="backdrop-blur-md rounded-xl px-3 py-2 pointer-events-auto flex-shrink-0 transition-all duration-300 flex items-center justify-center"
                style={{
                  background: isDarkMode
                    ? "linear-gradient(135deg, rgba(147,51,234,0.25) 0%, rgba(147,51,234,0.15) 100%)"
                    : "linear-gradient(135deg, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0.25) 100%)",
                  border: `1px solid ${
                    isDarkMode ? "rgba(147,51,234,0.3)" : "rgba(0,0,0,0.1)"
                  }`,
                  color: isDarkMode ? "#ffffff" : "#1a1a1a",
                  minWidth: "70px",
                  height: "40px",
                }}
              >
                <div className="flex flex-col items-center justify-center">
                  <div className={`text-xs font-medium ${isDarkMode ? 'opacity-60' : 'opacity-85'} leading-none`}>
                    Collisions
                  </div>
                  <div className="text-sm font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent leading-none mt-0.5">
                    {collisionCount}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={forceCollision}
                  className="rounded-full p-2.5 transition-all duration-300 hover:scale-110 active:scale-95 flex items-center justify-center"
                  style={{
                    background: isDarkMode
                      ? "linear-gradient(135deg, rgba(239,68,68,0.25) 0%, rgba(239,68,68,0.15) 100%)"
                      : "linear-gradient(135deg, rgba(239,68,68,0.3) 0%, rgba(239,68,68,0.1) 100%)",
                    border: "1px solid rgba(239,68,68,0.3)",
                    cursor: "pointer",
                    minWidth: "40px",
                    minHeight: "40px",
                  }}
                  title="Force Collision"
                >
                  <MdFlashOn className="w-4 h-4 text-red-400" />
                </button>

                <button
                  onClick={toggleWireframe}
                  className="rounded-full p-2.5 transition-all duration-300 hover:scale-110 active:scale-95 flex items-center justify-center"
                  style={{
                    background: isDarkMode
                      ? "linear-gradient(135deg, rgba(59,130,246,0.25) 0%, rgba(59,130,246,0.15) 100%)"
                      : "linear-gradient(135deg, rgba(59,130,246,0.3) 0%, rgba(59,130,246,0.1) 100%)",
                    border: "1px solid rgba(59,130,246,0.3)",
                    cursor: "pointer",
                    minWidth: "40px",
                    minHeight: "40px",
                  }}
                >
                  {isWireframe ? (
                    <MdVisibilityOff className="w-4 h-4 text-blue-400" />
                  ) : (
                    <MdVisibility className="w-4 h-4 text-blue-400" />
                  )}
                </button>

                <button
                  onClick={resetSimulation}
                  className="rounded-full p-2.5 transition-all duration-300 hover:scale-110 active:scale-95 flex items-center justify-center"
                  style={{
                    background: isDarkMode
                      ? "linear-gradient(135deg, rgba(249,115,22,0.25) 0%, rgba(249,115,22,0.15) 100%)"
                      : "linear-gradient(135deg, rgba(249,115,22,0.3) 0%, rgba(249,115,22,0.1) 100%)",
                    border: "1px solid rgba(249,115,22,0.3)",
                    cursor: "pointer",
                    minWidth: "40px",
                    minHeight: "40px",
                  }}
                >
                  <MdRefresh className="w-4 h-4 text-orange-400" />
                </button>

                <button
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  className="rounded-full p-2.5 transition-all duration-300 hover:scale-110 active:scale-95 flex items-center justify-center"
                  style={{
                    background: isDarkMode
                      ? "linear-gradient(135deg, rgba(251,191,36,0.25) 0%, rgba(251,191,36,0.15) 100%)"
                      : "linear-gradient(135deg, rgba(251,191,36,0.3) 0%, rgba(251,191,36,0.1) 100%)",
                    border: "1px solid rgba(251,191,36,0.3)",
                    cursor: "pointer",
                    minWidth: "40px",
                    minHeight: "40px",
                  }}
                >
                  {isDarkMode ? (
                    <MdWbSunny className="w-4 h-4" style={{ color: "#fbbf24" }} />
                  ) : (
                    <MdDarkMode className="w-4 h-4" style={{ color: "#4338ca" }} />
                  )}
                </button>
              </div>


            </div>

            <div
              className="backdrop-blur-md rounded-xl p-3 w-full pointer-events-auto transition-all duration-300"
                            style={{
                background: isDarkMode
                  ? "linear-gradient(135deg, rgba(20,184,166,0.25) 0%, rgba(20,184,166,0.15) 100%)"
                  : "linear-gradient(135deg, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0.25) 100%)",
                border: `1px solid ${
                  isDarkMode ? "rgba(20,184,166,0.3)" : "rgba(0,0,0,0.12)"
                }`,
                color: isDarkMode ? "#ffffff" : "#1a1a1a",
              }}
            >
              <div className={`flex justify-between items-center ${showSettings ? 'mb-2' : 'mb-0'}`}>
                <span className={`text-sm font-medium ${isDarkMode ? 'opacity-75' : 'opacity-90'} leading-none`}>Gravity</span>
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent leading-none">
                    {gravity.toFixed(1)}
                  </span>
                  <button
                    onClick={() => setShowSettings(!showSettings)}
                    className="rounded-full p-1 transition-all duration-300 hover:scale-110 active:scale-95 flex items-center justify-center"
                    style={{
                      background: isDarkMode
                        ? "rgba(20,184,166,0.15)"
                        : "rgba(0,0,0,0.1)",
                      cursor: "pointer",
                      minWidth: "24px",
                      minHeight: "24px",
                    }}
                  >
                    {showSettings ? (
                      <MdExpandLess className="w-4 h-4" style={{ color: isDarkMode ? "#ffffff" : "#1a1a1a" }} />
                    ) : (
                      <MdExpandMore className="w-4 h-4" style={{ color: isDarkMode ? "#ffffff" : "#1a1a1a" }} />
                    )}
                  </button>
                </div>
              </div>
              {showSettings && (
                <div className="space-y-2">
                  <input
                    type="range"
                    min="0"
                    max="2"
                    step="0.1"
                    value={gravity}
                    onChange={(e) => setGravity(parseFloat(e.target.value))}
                    className="w-full h-3 rounded-lg appearance-none transition-all duration-300"
                    style={{
                      background: isDarkMode 
                        ? `linear-gradient(90deg, #10b981 0%, #3b82f6 ${(gravity / 2) * 100}%, rgba(255,255,255,0.2) ${(gravity / 2) * 100}%, rgba(255,255,255,0.2) 100%)`
                        : `linear-gradient(90deg, #10b981 0%, #3b82f6 ${(gravity / 2) * 100}%, rgba(0,0,0,0.2) ${(gravity / 2) * 100}%, rgba(0,0,0,0.2) 100%)`,
                      cursor: "pointer",
                      border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.15)'}`,
                    }}
                  />
                  <div className={`flex justify-between text-xs ${isDarkMode ? 'opacity-60' : 'opacity-75'} px-1`}>
                    <span>0</span>
                    <span>0.5</span>
                    <span>1.0</span>
                    <span>1.5</span>
                    <span>2.0</span>
                  </div>
                  <div className={`flex justify-between text-xs ${isDarkMode ? 'opacity-50' : 'opacity-70'} px-1`}>
                    <span>Zero</span>
                    <span className="text-center">Earth</span>
                    <span>Heavy</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>



        <div 
          className={`absolute bottom-6 sm:bottom-8 left-4 sm:left-6 right-4 sm:right-6 pointer-events-none transition-all duration-500 ease-in-out ${
            showUI 
              ? "opacity-80 translate-y-0" 
              : "opacity-0 translate-y-4"
          }`}
        >
          <div
            className="backdrop-blur-md rounded-xl sm:rounded-2xl p-3 sm:p-4 mx-auto max-w-sm sm:max-w-md text-center transition-all duration-300"
            style={{
              background: isDarkMode
                ? "linear-gradient(135deg, rgba(168,85,247,0.2) 0%, rgba(168,85,247,0.1) 100%)"
                : "linear-gradient(135deg, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0.2) 100%)",
              border: `1px solid ${
                isDarkMode ? "rgba(168,85,247,0.25)" : "rgba(0,0,0,0.1)"
              }`,
              color: isDarkMode ? "#ffffff" : "#1a1a1a",
            }}
          >
            <p className="text-sm sm:text-base font-medium">
              Drag objects to throw them around!
            </p>
          </div>
        </div>

        <div 
          className={`hidden sm:block transition-all duration-500 ease-in-out ${
            showUI 
              ? "opacity-100 translate-y-0 pointer-events-auto" 
              : "opacity-0 -translate-y-4 pointer-events-none"
          }`}
        >
          <div className="absolute top-6 left-6 right-6 z-10">
            <div
              className="backdrop-blur-md rounded-2xl p-4 pointer-events-auto transition-all duration-300"
              style={{
                background: isDarkMode
                  ? "linear-gradient(135deg, rgba(99,102,241,0.25) 0%, rgba(99,102,241,0.15) 100%)"
                  : "linear-gradient(135deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.3) 100%)",
                border: `1px solid ${
                  isDarkMode ? "rgba(99,102,241,0.3)" : "rgba(0,0,0,0.1)"
                }`,
                color: isDarkMode ? "#ffffff" : "#1a1a1a",
              }}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-6">
                  <div className="flex items-center space-x-3">
                    <div className={`text-sm font-medium ${isDarkMode ? 'opacity-75' : 'opacity-90'}`}>Collisions:</div>
                    <div className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                      {collisionCount}
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <button
                      onClick={forceCollision}
                      className="rounded-full p-3 transition-all duration-300 hover:scale-110 active:scale-95 flex items-center justify-center"
                      style={{
                        background: isDarkMode
                          ? "linear-gradient(135deg, rgba(239,68,68,0.25) 0%, rgba(239,68,68,0.15) 100%)"
                          : "linear-gradient(135deg, rgba(239,68,68,0.3) 0%, rgba(239,68,68,0.1) 100%)",
                        border: "1px solid rgba(239,68,68,0.3)",
                        cursor: "pointer",
                        minWidth: "42px",
                        minHeight: "42px",
                      }}
                      title="Force Collision"
                    >
                      <MdFlashOn className="w-5 h-5 text-red-400" />
                    </button>

                    <button
                      onClick={toggleWireframe}
                      className="rounded-full p-3 transition-all duration-300 hover:scale-110 active:scale-95 flex items-center justify-center"
                      style={{
                        background: isDarkMode
                          ? "linear-gradient(135deg, rgba(59,130,246,0.25) 0%, rgba(59,130,246,0.15) 100%)"
                          : "linear-gradient(135deg, rgba(59,130,246,0.3) 0%, rgba(59,130,246,0.1) 100%)",
                        border: "1px solid rgba(59,130,246,0.3)",
                        cursor: "pointer",
                        minWidth: "42px",
                        minHeight: "42px",
                      }}
                    >
                      {isWireframe ? (
                        <MdVisibilityOff className="w-5 h-5 text-blue-400" />
                      ) : (
                        <MdVisibility className="w-5 h-5 text-blue-400" />
                      )}
                    </button>

                    <button
                      onClick={resetSimulation}
                      className="rounded-full p-3 transition-all duration-300 hover:scale-110 active:scale-95 flex items-center justify-center"
                      style={{
                        background: isDarkMode
                          ? "linear-gradient(135deg, rgba(249,115,22,0.25) 0%, rgba(249,115,22,0.15) 100%)"
                          : "linear-gradient(135deg, rgba(249,115,22,0.3) 0%, rgba(249,115,22,0.1) 100%)",
                        border: "1px solid rgba(249,115,22,0.3)",
                        cursor: "pointer",
                        minWidth: "42px",
                        minHeight: "42px",
                      }}
                    >
                      <MdRefresh className="w-5 h-5 text-orange-400" />
                    </button>

                    <div className="w-px h-8 bg-white opacity-20 mx-2"></div>
                    
                    <button
                      onClick={() => setIsDarkMode(!isDarkMode)}
                      className="rounded-full p-3 transition-all duration-300 hover:scale-110 active:scale-95"
                      style={{
                        background: isDarkMode
                          ? "linear-gradient(135deg, rgba(251,191,36,0.25) 0%, rgba(251,191,36,0.15) 100%)"
                          : "linear-gradient(135deg, rgba(251,191,36,0.3) 0%, rgba(251,191,36,0.1) 100%)",
                        border: "1px solid rgba(251,191,36,0.3)",
                        cursor: "pointer",
                        minWidth: "42px",
                        minHeight: "42px",
                      }}
                    >
                      {isDarkMode ? (
                        <MdWbSunny className="w-5 h-5" style={{ color: "#fbbf24" }} />
                      ) : (
                        <MdDarkMode className="w-5 h-5" style={{ color: "#4338ca" }} />
                      )}
                    </button>

                    <div className="w-px h-8 bg-white opacity-20 mx-2"></div>
                    
                    <button
                      onClick={() => setShowUI(!showUI)}
                      className="rounded-full p-3 transition-all duration-300 hover:scale-110 active:scale-95"
                      style={{
                        background: isDarkMode
                          ? "linear-gradient(135deg, rgba(168,85,247,0.25) 0%, rgba(168,85,247,0.15) 100%)"
                          : "linear-gradient(135deg, rgba(168,85,247,0.3) 0%, rgba(168,85,247,0.1) 100%)",
                        border: "1px solid rgba(168,85,247,0.3)",
                        cursor: "pointer",
                        minWidth: "42px",
                        minHeight: "42px",
                      }}
                      title={showUI ? "Hide Controls" : "Show Controls"}
                    >
                      {showUI ? (
                        <MdVisibilityOff className="w-5 h-5 text-purple-400" />
                      ) : (
                        <MdVisibility className="w-5 h-5 text-purple-400" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-6">
                  <span className={`text-sm font-medium ${isDarkMode ? 'opacity-75' : 'opacity-90'} whitespace-nowrap`}>
                    Gravity
                  </span>
                  <div className="flex-1 max-w-lg mx-6">
                    <div className="space-y-2">
                      <div className="relative">
                        <input
                          type="range"
                          min="0"
                          max="2"
                          step="0.1"
                          value={gravity}
                          onChange={(e) => setGravity(parseFloat(e.target.value))}
                          className="w-full h-4 rounded-lg appearance-none"
                          style={{
                            background: isDarkMode 
                              ? `linear-gradient(90deg, #10b981 0%, #3b82f6 ${(gravity / 2) * 100}%, rgba(255,255,255,0.15) ${(gravity / 2) * 100}%, rgba(255,255,255,0.15) 100%)`
                              : `linear-gradient(90deg, #10b981 0%, #3b82f6 ${(gravity / 2) * 100}%, rgba(0,0,0,0.15) ${(gravity / 2) * 100}%, rgba(0,0,0,0.15) 100%)`,
                            cursor: "pointer",
                            border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)'}`,
                          }}
                        />
                      </div>
                      <div className={`flex justify-between text-xs ${isDarkMode ? 'opacity-60' : 'opacity-75'} px-1`}>
                        <span>0</span>
                        <span>0.5</span>
                        <span>1.0</span>
                        <span>1.5</span>
                        <span>2.0</span>
                      </div>
                      <div className={`flex justify-between text-xs ${isDarkMode ? 'opacity-50' : 'opacity-70'} px-1`}>
                        <span>Zero</span>
                        <span className="text-center">Earth</span>
                        <span>Heavy</span>
                      </div>
                    </div>
                  </div>
                  <span className="text-lg font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent whitespace-nowrap min-w-[2rem]">
                    {gravity.toFixed(1)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div 
        className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-1000 ease-out ${
          isLoading ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        style={{
          background: isDarkMode
            ? "linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #334155 50%, #475569 75%, #64748b 100%)"
            : "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
        }}
      >
          <div className="flex flex-col items-center space-y-8 p-8">
            <div className="relative">
              <div 
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-transparent animate-spin"
                style={{
                  background: isDarkMode
                    ? "linear-gradient(45deg, rgba(168,85,247,0.8), rgba(59,130,246,0.8), rgba(16,185,129,0.8))"
                    : "linear-gradient(45deg, rgba(168,85,247,0.9), rgba(59,130,246,0.9), rgba(16,185,129,0.9))",
                  WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                  WebkitMaskComposite: "xor",
                  maskComposite: "subtract",
                  borderRadius: "50%",
                  padding: "4px",
                }}
              >
                <div 
                  className="w-full h-full rounded-full"
                  style={{
                    background: isDarkMode ? "#0f172a" : "#f8fafc",
                  }}
                />
              </div>
              
              <div className="absolute inset-0 flex items-center justify-center">
                <div 
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full animate-pulse"
                  style={{
                    background: isDarkMode
                      ? "radial-gradient(circle, rgba(168,85,247,0.6) 0%, rgba(168,85,247,0.2) 70%)"
                      : "radial-gradient(circle, rgba(168,85,247,0.8) 0%, rgba(168,85,247,0.3) 70%)",
                  }}
                />
              </div>
            </div>

            <div className="text-center space-y-4">
              <h1 
                className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent"
                style={{
                  fontFamily: "Poppins, sans-serif",
                  textShadow: isDarkMode 
                    ? "0 0 30px rgba(168,85,247,0.3)" 
                    : "0 0 20px rgba(168,85,247,0.2)",
                }}
              >
                Physics Playground
              </h1>
              
              <div className="flex items-center justify-center space-x-2">
                <div className="flex space-x-1">
                  <div 
                    className="w-2 h-2 rounded-full animate-bounce"
                    style={{
                      backgroundColor: isDarkMode ? "#a855f7" : "#8b5cf6",
                      animationDelay: "0ms",
                    }}
                  />
                  <div 
                    className="w-2 h-2 rounded-full animate-bounce"
                    style={{
                      backgroundColor: isDarkMode ? "#3b82f6" : "#6366f1",
                      animationDelay: "150ms",
                    }}
                  />
                  <div 
                    className="w-2 h-2 rounded-full animate-bounce"
                    style={{
                      backgroundColor: isDarkMode ? "#10b981" : "#059669",
                      animationDelay: "300ms",
                    }}
                  />
                </div>
                <p 
                  className="text-lg sm:text-xl font-medium ml-3"
                  style={{
                    color: isDarkMode ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.9)",
                    fontFamily: "Poppins, sans-serif",
                  }}
                >
                  Initializing 3D World
                </p>
              </div>

              <div 
                className="backdrop-blur-md rounded-2xl px-6 py-3 mx-auto max-w-sm"
                style={{
                  background: isDarkMode
                    ? "rgba(255,255,255,0.1)"
                    : "rgba(255,255,255,0.2)",
                  border: `1px solid ${isDarkMode ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.3)"}`,
                }}
              >
                <p 
                  className="text-sm font-medium"
                  style={{
                    color: isDarkMode ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.8)",
                    fontFamily: "Poppins, sans-serif",
                  }}
                >
                  Loading physics engine & 3D objects...
                </p>
              </div>
                         </div>
           </div>
         </div>
    </div>
  );
}

export default App;
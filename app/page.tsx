'use client';

import { useState, useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Grid } from '@react-three/drei';
import * as THREE from 'three';
import { FaCube, FaCircle, FaSun, FaMoon, FaQuestion, FaDownload } from 'react-icons/fa';
import { Md3dRotation, MdShapeLine } from 'react-icons/md';

interface Object3D {
  id: string;
  type: string;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
  color: string;
}

function Shape({ type, position, color, id, onSelect, onDragStart, onDragEnd, onPositionChange, onRotationChange }: {
  type: string;
  position: [number, number, number];
  color: string;
  id: string;
  onSelect: () => void;
  onDragStart: () => void;
  onDragEnd: () => void;
  onPositionChange: (position: [number, number, number]) => void;
  onRotationChange: (rotation: [number, number, number]) => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const [active, setActive] = useState(false);
  const [isRotating, setIsRotating] = useState(false);
  const { camera, scene, gl } = useThree();
  const dragPlane = useRef<THREE.Plane>(new THREE.Plane(new THREE.Vector3(0, 1, 0), 0));
  const raycaster = useRef<THREE.Raycaster>(new THREE.Raycaster());
  const mouse = useRef<THREE.Vector2>(new THREE.Vector2());
  const dragOffset = useRef<THREE.Vector3>(new THREE.Vector3());
  const intersectionPoint = useRef<THREE.Vector3>(new THREE.Vector3());
  const lastMousePosition = useRef<THREE.Vector2>(new THREE.Vector2());

  // Update mesh position when props change
  useEffect(() => {
    if (meshRef.current) {
      meshRef.current.position.set(...position);
    }
  }, [position]);

  const updateMousePosition = (event: MouseEvent) => {
    const rect = gl.domElement.getBoundingClientRect();
    mouse.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  };

  const handlePointerDown = (event: MouseEvent) => {
    if (!meshRef.current) return;

    updateMousePosition(event);
    lastMousePosition.current.copy(mouse.current);
    raycaster.current.setFromCamera(mouse.current, camera);

    const intersects = raycaster.current.intersectObject(meshRef.current);
    if (intersects.length > 0) {
      event.stopPropagation();

      if (event.shiftKey) {
        // Start Y-axis movement
        dragPlane.current.setFromNormalAndCoplanarPoint(
          new THREE.Vector3(1, 0, 0),
          intersects[0].point
        );
      } else if (event.altKey) {
        // Start rotation
        setIsRotating(true);
      } else {
        // Start XZ movement
        dragPlane.current.setFromNormalAndCoplanarPoint(
          new THREE.Vector3(0, 1, 0),
          intersects[0].point
        );
      }

      dragOffset.current.copy(intersects[0].point).sub(meshRef.current.position);
      setActive(true);
      onSelect();
      onDragStart();
    }
  };

  const handlePointerMove = (event: MouseEvent) => {
    if (!active || !meshRef.current) return;

    updateMousePosition(event);
    raycaster.current.setFromCamera(mouse.current, camera);

    if (isRotating) {
      // Handle rotation
      const deltaX = mouse.current.x - lastMousePosition.current.x;
      const rotationY = meshRef.current.rotation.y + deltaX * 2;
      meshRef.current.rotation.y = rotationY;
      onRotationChange([meshRef.current.rotation.x, rotationY, meshRef.current.rotation.z]);
    } else if (raycaster.current.ray.intersectPlane(dragPlane.current, intersectionPoint.current)) {
      // Handle movement
      const newPosition = intersectionPoint.current.sub(dragOffset.current);
      meshRef.current.position.copy(newPosition);
      onPositionChange([newPosition.x, newPosition.y, newPosition.z]);
    }

    lastMousePosition.current.copy(mouse.current);
  };

  const handlePointerUp = () => {
    setActive(false);
    setIsRotating(false);
    onDragEnd();
  };

  useEffect(() => {
    if (active) {
      window.addEventListener('mousemove', handlePointerMove);
      window.addEventListener('mouseup', handlePointerUp);
    } else {
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('mouseup', handlePointerUp);
    }
    return () => {
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('mouseup', handlePointerUp);
    };
  }, [active, isRotating]);

  return (
    <mesh
      ref={meshRef}
      position={position}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onPointerDown={handlePointerDown}
    >
      {type === 'cube' && <boxGeometry args={[1, 1, 1]} />}
      {type === 'sphere' && <sphereGeometry args={[0.5, 32, 32]} />}
      {type === 'cylinder' && <cylinderGeometry args={[0.5, 0.5, 1, 32]} />}
      {type === 'cone' && <coneGeometry args={[0.5, 1, 32]} />}
      {type === 'torus' && <torusGeometry args={[0.5, 0.2, 16, 32]} />}
      {type === 'torusKnot' && <torusKnotGeometry args={[0.5, 0.2, 100, 16]} />}
      <meshStandardMaterial
        color={active ? 'hotpink' : hovered ? 'lightblue' : color}
        metalness={0.3}
        roughness={0.4}
      />
    </mesh>
  );
}

function Scene({ objects, selectedObject, onObjectSelect, onPositionChange, onRotationChange, isDarkMode }: {
  objects: Object3D[];
  selectedObject: Object3D | null;
  onObjectSelect: (obj: Object3D) => void;
  onPositionChange: (position: [number, number, number]) => void;
  onRotationChange: (rotation: [number, number, number]) => void;
  isDarkMode: boolean;
}) {
  const controlsRef = useRef<any>(null);
  const gridRef = useRef<THREE.Group>(null);
  const [isDragging, setIsDragging] = useState(false);
  const moveSpeed = 0.1;
  const keys = useRef({
    w: false,
    a: false,
    s: false,
    d: false,
    q: false,
    e: false
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() in keys.current) {
        keys.current[e.key.toLowerCase() as keyof typeof keys.current] = true;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() in keys.current) {
        keys.current[e.key.toLowerCase() as keyof typeof keys.current] = false;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useFrame((state) => {
    if (!gridRef.current) return;

    const { w, a, s, d, q, e } = keys.current;
    const camera = state.camera;

    // Get camera's forward and right vectors
    const forward = new THREE.Vector3();
    const right = new THREE.Vector3();
    camera.getWorldDirection(forward);
    right.crossVectors(new THREE.Vector3(0, 1, 0), forward).normalize();

    // Calculate movement based on camera direction
    const movement = new THREE.Vector3();

    if (w) movement.sub(forward);  // Changed from add to sub
    if (s) movement.add(forward);  // Changed from sub to add
    if (a) movement.sub(right);
    if (d) movement.add(right);
    if (q) movement.y += moveSpeed;
    if (e) movement.y -= moveSpeed;

    // Normalize and scale the movement
    if (movement.length() > 0) {
      movement.normalize().multiplyScalar(moveSpeed);
      gridRef.current.position.add(movement);
    }
  });

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[1, 1, 1]} intensity={0.5} />
      <group ref={gridRef}>
        <Grid
          args={[20, 20]}
          cellSize={1}
          cellThickness={1}
          cellColor={isDarkMode ? "#4a4a4a" : "#e5e5e5"}
          sectionSize={3.3}
          sectionThickness={1.5}
          sectionColor={isDarkMode ? "#6b6b6b" : "#d4d4d4"}
          fadeDistance={50}
          fadeStrength={1}
          followCamera={false}
          infiniteGrid={true}
        />
        {objects.map((obj) => (
          <Shape
            key={obj.id}
            type={obj.type}
            position={obj.position}
            color={obj.color}
            id={obj.id}
            onSelect={() => onObjectSelect(obj)}
            onDragStart={() => setIsDragging(true)}
            onDragEnd={() => setIsDragging(false)}
            onPositionChange={onPositionChange}
            onRotationChange={onRotationChange}
          />
        ))}
      </group>
      <OrbitControls
        ref={controlsRef}
        makeDefault
        enableDamping
        dampingFactor={0.05}
        rotateSpeed={0.5}
        enabled={!isDragging}
        minDistance={5}
        maxDistance={50}
      />
    </>
  );
}

function GuideModal({ isOpen, onClose, isDarkMode }: { isOpen: boolean; onClose: () => void; isDarkMode: boolean }) {
  if (!isOpen) return null;

  const themeClasses = {
    modal: isDarkMode ? 'bg-gray-800/90' : 'bg-white/90',
    title: isDarkMode ? 'text-gray-100' : 'text-gray-900',
    content: isDarkMode ? 'text-gray-300' : 'text-gray-700',
    closeButton: isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-700',
    bullet: isDarkMode ? 'bg-gray-400' : 'bg-gray-600'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
      <div className={`relative w-full max-w-2xl mx-4 p-6 rounded-2xl shadow-2xl ${themeClasses.modal} transition-all duration-300`}>
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 text-xl ${themeClasses.closeButton} transition-colors duration-200`}
        >
          ✕
        </button>
        <h2 className={`text-2xl font-bold mb-6 ${themeClasses.title}`}>Quick Guide</h2>
        <div className={`space-y-6 ${themeClasses.content}`}>
          <div>
            <h3 className="text-lg font-semibold mb-3">Camera Controls</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <span className={`w-2 h-2 rounded-full ${themeClasses.bullet}`}></span>
                <p>Right-click + drag to rotate view</p>
              </div>
              <div className="flex items-center space-x-3">
                <span className={`w-2 h-2 rounded-full ${themeClasses.bullet}`}></span>
                <p>Scroll to zoom in/out</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Movement Controls</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <span className={`w-2 h-2 rounded-full ${themeClasses.bullet}`}></span>
                <p>WASD: Move in the direction you're looking</p>
              </div>
              <div className="flex items-center space-x-3">
                <span className={`w-2 h-2 rounded-full ${themeClasses.bullet}`}></span>
                <p>QE: Move up and down</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Object Controls</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <span className={`w-2 h-2 rounded-full ${themeClasses.bullet}`}></span>
                <p>Click & drag: Move object in XZ plane</p>
              </div>
              <div className="flex items-center space-x-3">
                <span className={`w-2 h-2 rounded-full ${themeClasses.bullet}`}></span>
                <p>Shift + drag: Move object in Y axis</p>
              </div>
              <div className="flex items-center space-x-3">
                <span className={`w-2 h-2 rounded-full ${themeClasses.bullet}`}></span>
                <p>Alt + drag: Rotate object</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Object Properties</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <span className={`w-2 h-2 rounded-full ${themeClasses.bullet}`}></span>
                <p>Select an object to edit its properties</p>
              </div>
              <div className="flex items-center space-x-3">
                <span className={`w-2 h-2 rounded-full ${themeClasses.bullet}`}></span>
                <p>Use the input fields to adjust position, rotation, and scale</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ThreeDEditor() {
  const [objects, setObjects] = useState<Object3D[]>([]);
  const [selectedObject, setSelectedObject] = useState<Object3D | null>(null);
  const [showGuide, setShowGuide] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [inputValues, setInputValues] = useState({
    positionX: '0',
    positionY: '0',
    positionZ: '0',
    rotationY: '0',
    scale: '1'
  });

  // Update input values when selected object changes
  useEffect(() => {
    if (selectedObject) {
      setInputValues({
        positionX: selectedObject.position[0].toString(),
        positionY: selectedObject.position[1].toString(),
        positionZ: selectedObject.position[2].toString(),
        rotationY: selectedObject.rotation[1].toString(),
        scale: selectedObject.scale[0].toString()
      });
    }
  }, [selectedObject]);

  const addObject = (type: string) => {
    const colors = {
      cube: '#4CAF50',
      sphere: '#2196F3',
      cylinder: '#FF9800',
      cone: '#9C27B0',
      torus: '#E91E63',
      torusKnot: '#00BCD4',
      octahedron: '#FF5722'
    };

    const newObject: Object3D = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      position: [0, 0, 0],
      rotation: [0, 0, 0],
      scale: [1, 1, 1],
      color: colors[type as keyof typeof colors] || '#FFFFFF',
    };
    setObjects([...objects, newObject]);
  };

  const updateObject = (id: string, updates: Partial<Object3D>) => {
    setObjects(prevObjects =>
      prevObjects.map(obj => {
        if (obj.id === id) {
          return { ...obj, ...updates };
        }
        return obj;
      })
    );
  };

  const handleInputChange = (field: string, value: string) => {
    if (!selectedObject) return;

    setInputValues(prev => ({ ...prev, [field]: value }));

    const numValue = parseFloat(value);
    if (isNaN(numValue)) return;

    switch (field) {
      case 'positionX':
        updateObject(selectedObject.id, {
          position: [numValue, selectedObject.position[1], selectedObject.position[2]]
        });
        break;
      case 'positionY':
        updateObject(selectedObject.id, {
          position: [selectedObject.position[0], numValue, selectedObject.position[2]]
        });
        break;
      case 'positionZ':
        updateObject(selectedObject.id, {
          position: [selectedObject.position[0], selectedObject.position[1], numValue]
        });
        break;
      case 'rotationY':
        updateObject(selectedObject.id, {
          rotation: [selectedObject.rotation[0], numValue, selectedObject.rotation[2]]
        });
        break;
      case 'scale':
        updateObject(selectedObject.id, {
          scale: [numValue, numValue, numValue]
        });
        break;
    }
  };

  const handlePositionChange = (position: [number, number, number]) => {
    if (!selectedObject) return;
    setInputValues(prev => ({
      ...prev,
      positionX: position[0].toFixed(2),
      positionY: position[1].toFixed(2),
      positionZ: position[2].toFixed(2)
    }));
    updateObject(selectedObject.id, { position });
  };

  const handleRotationChange = (rotation: [number, number, number]) => {
    if (!selectedObject) return;
    setInputValues(prev => ({
      ...prev,
      rotationY: rotation[1].toFixed(2)
    }));
    updateObject(selectedObject.id, { rotation });
  };

  const exportScene = () => {
    const canvas = document.querySelector('canvas');
    if (canvas) {
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png', 1.0);
      link.download = '3d-scene.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const shapeIcons = {
    cube: <FaCube className="w-5 h-5" />,
    sphere: <FaCircle className="w-5 h-5" />,
    cylinder: <MdShapeLine className="w-5 h-5" />,
    cone: <Md3dRotation className="w-5 h-5" />,
    torus: <FaCircle className="w-5 h-5" />,
    torusKnot: <Md3dRotation className="w-5 h-5" />
  };

  const themeClasses = {
    container: isDarkMode
      ? 'bg-gradient-to-br from-gray-900 to-gray-800 text-white'
      : 'bg-gradient-to-br from-[#f8f8f8] to-[#f0f0f0] text-[#242424]',
    sidebar: isDarkMode
      ? 'bg-gray-800/80 backdrop-blur-sm'
      : 'bg-white/80 backdrop-blur-sm border-r border-[#e6e6e6]',
    title: isDarkMode
      ? 'text-gray-100'
      : 'text-[#242424]',
    subtitle: isDarkMode
      ? 'text-gray-300'
      : 'text-[#404040]',
    button: isDarkMode
      ? 'bg-gray-700/90 hover:bg-gray-600 shadow-lg shadow-gray-500/20'
      : 'bg-[#03a87c]/10 hover:bg-[#03a87c]/20 text-[#03a87c] shadow-lg shadow-[#03a87c]/10',
    input: isDarkMode
      ? 'bg-gray-700/50 focus:ring-gray-500 border-gray-600'
      : 'bg-white border border-[#e6e6e6] focus:ring-[#03a87c]',
    instructions: isDarkMode
      ? 'bg-gray-700/50 border-gray-600'
      : 'bg-white/50 border border-[#e6e6e6]',
    controls: isDarkMode
      ? 'bg-gray-800/80 backdrop-blur-sm border-gray-700'
      : 'bg-white/80 backdrop-blur-sm border border-[#e6e6e6]',
    exportButton: isDarkMode
      ? 'bg-emerald-500/90 hover:bg-emerald-600 shadow-lg shadow-emerald-500/20'
      : 'bg-[#03a87c] hover:bg-[#028a6b] shadow-lg shadow-[#03a87c]/20',
    card: isDarkMode
      ? 'bg-gray-700/50 border-gray-600'
      : 'bg-white/50 border border-[#e6e6e6]',
    bullet: isDarkMode
      ? 'bg-gray-400'
      : 'bg-[#03a87c]',
    logo: isDarkMode
      ? 'text-gray-100'
      : 'text-[#03a87c]'
  };

  return (
    <div className={`flex h-screen ${themeClasses.container} transition-colors duration-300`}>
      {/* Guide Button - Moved to top right */}
      <button
        onClick={() => setShowGuide(true)}
        className={`fixed top-4 right-4 px-4 py-2 rounded-lg transition-all duration-300 ${themeClasses.button} hover:scale-105 cursor-pointer flex items-center gap-2`}
      >
        <FaQuestion className="w-4 h-4" />
        Guide
      </button>

      {/* Sidebar */}
      <div className={`w-80 p-6 flex flex-col ${themeClasses.sidebar} transition-colors duration-300`}>
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className={`text-2xl font-bold ${themeClasses.logo} transition-colors duration-300 flex items-center gap-2`}>
              <span className="text-3xl">3D</span>
              <span className="font-light">Editor</span>
            </h2>
            <p className="text-sm text-gray-400">Create and manipulate 3D objects</p>
          </div>
          {/* Theme Toggle Switch */}
          <div className="relative">
            <input
              type="checkbox"
              id="theme-toggle"
              className="sr-only"
              checked={isDarkMode}
              onChange={() => setIsDarkMode(!isDarkMode)}
            />
            <label
              htmlFor="theme-toggle"
              className={`relative inline-flex items-center h-6 rounded-full w-11 cursor-pointer transition-colors duration-300 ${isDarkMode ? 'bg-gray-700' : 'bg-[#03a87c]/20'
                }`}
            >
              <span
                className={`inline-block w-4 h-4 transform rounded-full transition-transform duration-300 ${isDarkMode ? 'translate-x-6 bg-gray-300' : 'translate-x-1 bg-[#03a87c]'
                  }`}
              />
              <span className="absolute left-1.5 top-1.5 text-xs">
                {isDarkMode ? <FaMoon className="w-3 h-3" /> : <FaSun className="w-3 h-3" />}
              </span>
            </label>
          </div>
        </div>

        <div className="mb-8">
          <h3 className={`text-lg font-semibold mb-4 ${themeClasses.subtitle}`}>Add Objects</h3>
          <div className="grid grid-cols-2 gap-3">
            {['cube', 'sphere', 'cylinder', 'cone', 'torus', 'torusKnot'].map((type) => (
              <button
                key={type}
                onClick={() => addObject(type)}
                className={`p-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 ${themeClasses.button} hover:scale-105 cursor-pointer`}
              >
                {shapeIcons[type as keyof typeof shapeIcons]}
                <span className="text-sm capitalize">{type}</span>
              </button>
            ))}
          </div>
        </div>

        {selectedObject && (
          <div className="mt-6">
            <h3 className={`text-lg font-semibold mb-4 ${themeClasses.subtitle}`}>Properties</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-2 font-medium">Position</label>
                <div className="grid grid-cols-3 gap-2">
                  {['X', 'Y', 'Z'].map((axis) => (
                    <div key={axis}>
                      <input
                        type="number"
                        step="0.1"
                        value={inputValues[`position${axis}` as keyof typeof inputValues]}
                        onChange={(e) => handleInputChange(`position${axis}`, e.target.value)}
                        className={`w-full p-2 rounded-lg focus:outline-none focus:ring-2 ${themeClasses.input} transition-colors duration-300 cursor-text`}
                        placeholder={axis}
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm mb-2 font-medium">Rotation Y</label>
                <input
                  type="number"
                  step="0.1"
                  value={inputValues.rotationY}
                  onChange={(e) => handleInputChange('rotationY', e.target.value)}
                  className={`w-full p-2 rounded-lg focus:outline-none focus:ring-2 ${themeClasses.input} transition-colors duration-300 cursor-text`}
                />
              </div>
              <div>
                <label className="block text-sm mb-2 font-medium">Scale</label>
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  value={inputValues.scale}
                  onChange={(e) => handleInputChange('scale', e.target.value)}
                  className={`w-full p-2 rounded-lg focus:outline-none focus:ring-2 ${themeClasses.input} transition-colors duration-300 cursor-text`}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main canvas */}
      <div className="flex-1 relative">
        <Canvas camera={{ position: [10, 10, 10], fov: 50 }}>
          <Scene
            objects={objects}
            selectedObject={selectedObject}
            onObjectSelect={setSelectedObject}
            onPositionChange={handlePositionChange}
            onRotationChange={handleRotationChange}
            isDarkMode={isDarkMode}
          />
        </Canvas>

        <div className="absolute bottom-4 right-4 space-y-2">
          <div className={`p-4 rounded-xl shadow-lg ${themeClasses.controls} transition-colors duration-300`}>
            <p className="text-sm font-semibold mb-3">Controls</p>
            <div className="text-xs space-y-2">
              <div className="flex items-center space-x-2">
                <span className={`w-1.5 h-1.5 rounded-full ${themeClasses.bullet}`}></span>
                <p>WASD: Move view</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`w-1.5 h-1.5 rounded-full ${themeClasses.bullet}`}></span>
                <p>QE: Move up/down</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`w-1.5 h-1.5 rounded-full ${themeClasses.bullet}`}></span>
                <p>Right-click: Rotate view</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`w-1.5 h-1.5 rounded-full ${themeClasses.bullet}`}></span>
                <p>Shift + Drag: Move Y-axis</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`w-1.5 h-1.5 rounded-full ${themeClasses.bullet}`}></span>
                <p>Alt + Drag: Rotate object</p>
              </div>
            </div>
          </div>
          <button
            onClick={exportScene}
            className={`text-white px-4 py-2 rounded-xl transition-all duration-300 ${themeClasses.exportButton} hover:scale-105 cursor-pointer flex items-center gap-2`}
          >
            <FaDownload className="w-4 h-4" />
            Export Scene
          </button>
        </div>
      </div>

      <GuideModal isOpen={showGuide} onClose={() => setShowGuide(false)} isDarkMode={isDarkMode} />
    </div>
  );
}
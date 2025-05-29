"use client"

import React from "react"
import { useRef, useEffect, useState, useCallback, Suspense, useMemo } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { Box, Sphere, Cone, Torus, Cylinder } from "@react-three/drei"
import * as THREE from "three"

// Types
interface ARObject {
  id: string
  type: "cube" | "sphere" | "pyramid" | "torus" | "cylinder"
  position: [number, number, number]
  rotation: [number, number, number]
  scale: [number, number, number]
  color: string
  isSelected: boolean
  screenPosition?: [number, number]
  isVisible?: boolean // For virtualization
  lastUpdateTime?: number
}

// Tool types - includes both object types and special tools
type ToolType = ARObject["type"] | "hand"

interface ARAnchor {
  id: string
  screenPosition: [number, number]
  worldPosition: [number, number, number]
  confidence: number
  isVisible?: boolean
}

interface InteractionState {
  isActive: boolean
  startX: number
  startY: number
  currentX: number
  currentY: number
  objectId: string | null
  initialRotation: [number, number, number]
  type: "touch" | "mouse"
  isDragToPlace?: boolean
  isMovingObject?: boolean
}

interface ViewportBounds {
  left: number
  right: number
  top: number
  bottom: number
}

// Constants
const OBJECT_COLORS = [
  "#FF6B6B",
  "#4ECDC4",
  "#45B7D1",
  "#96CEB4",
  "#FFEAA7",
  "#DDA0DD",
  "#98D8C8",
  "#F7DC6F",
  "#BB8FCE",
  "#85C1E9",
]

const TOOLS = [
  { type: "hand" as const, icon: "✋", name: "Move" },
  { type: "cube" as const, icon: "🟦", name: "Cube" },
  { type: "sphere" as const, icon: "🔵", name: "Sphere" },
  { type: "pyramid" as const, icon: "🔺", name: "Pyramid" },
  { type: "torus" as const, icon: "🍩", name: "Torus" },
  { type: "cylinder" as const, icon: "🥫", name: "Cylinder" },
]

// Performance constants
const VIEWPORT_MARGIN = 100 // Pixels outside viewport to still render
const MAX_RENDER_DISTANCE = 10 // World units
const LOD_DISTANCE_THRESHOLD = 7 // Distance to switch to low detail
const UPDATE_THROTTLE = 16 // Milliseconds between updates (60fps)

// Utility functions
const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
const getRandomColor = () => OBJECT_COLORS[Math.floor(Math.random() * OBJECT_COLORS.length)]

// Device detection with SSR safety
const useDeviceType = () => {
  const [isMobile, setIsMobile] = useState(false)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    const checkDevice = () => {
      if (typeof window !== "undefined") {
        setIsMobile(window.innerWidth < 768 || "ontouchstart" in window)
      }
    }

    checkDevice()
    if (typeof window !== "undefined") {
      window.addEventListener("resize", checkDevice)
      return () => window.removeEventListener("resize", checkDevice)
    }
  }, [])

  return { isMobile, isClient }
}

// Viewport bounds hook for virtualization with SSR safety
const useViewportBounds = (): ViewportBounds => {
  const [bounds, setBounds] = useState<ViewportBounds>({
    left: -VIEWPORT_MARGIN,
    right: 1920 + VIEWPORT_MARGIN, // Default fallback
    top: -VIEWPORT_MARGIN,
    bottom: 1080 + VIEWPORT_MARGIN, // Default fallback
  })

  useEffect(() => {
    if (typeof window === "undefined") return

    const updateBounds = () => {
      setBounds({
        left: -VIEWPORT_MARGIN,
        right: window.innerWidth + VIEWPORT_MARGIN,
        top: -VIEWPORT_MARGIN,
        bottom: window.innerHeight + VIEWPORT_MARGIN,
      })
    }

    updateBounds()
    window.addEventListener("resize", updateBounds)
    return () => window.removeEventListener("resize", updateBounds)
  }, [])

  return bounds
}

// Optimized 3D Object Component with virtualization
const Object3D: React.FC<{
  object: ARObject
  onSelect: (id: string) => void
  interaction: InteractionState
  onUpdateRotation: (id: string, rotation: [number, number, number]) => void
  onUpdateScreenPosition: (id: string, screenPos: [number, number], isVisible: boolean) => void
  viewportBounds: ViewportBounds
  onUpdatePosition: (id: string, position: [number, number, number]) => void
}> = React.memo(({ object, onSelect, interaction, onUpdateRotation, onUpdateScreenPosition, viewportBounds, onUpdatePosition }) => {
  const meshRef = useRef<THREE.Mesh>(null)
  const { camera, gl } = useThree()
  const lastUpdateRef = useRef(0)

  // Calculate if object should use LOD
  const useLOD = useMemo(() => {
    const distance = Math.sqrt(object.position[0] ** 2 + object.position[1] ** 2 + object.position[2] ** 2)
    return distance > LOD_DISTANCE_THRESHOLD
  }, [object.position])

  // Throttled frame updates for performance
  useFrame((state) => {
    if (!meshRef.current) return

    const now = state.clock.getElapsedTime() * 1000
    if (now - lastUpdateRef.current < UPDATE_THROTTLE) return
    lastUpdateRef.current = now

    // Apply interaction (rotation or movement)
    if (interaction.isActive && interaction.objectId === object.id) {
      if (interaction.isMovingObject) {
        // For moving objects, update position in real-time
        const normalizedX = (interaction.currentX / gl.domElement.clientWidth) * 2 - 1
        const normalizedY = -(interaction.currentY / gl.domElement.clientHeight) * 2 + 1
        const newWorldPosition: [number, number, number] = [normalizedX * 5, normalizedY * 3, object.position[2]]
        
        meshRef.current.position.set(...newWorldPosition)
        // Update the object position for the parent component
        onUpdatePosition(object.id, newWorldPosition)
        onUpdateScreenPosition(object.id, [interaction.currentX, interaction.currentY], true)
      } else {
        // Handle rotation
        const deltaX = interaction.currentX - interaction.startX
        const deltaY = interaction.currentY - interaction.startY

        const rotationSpeed = 0.01
        const newRotation: [number, number, number] = [
          interaction.initialRotation[0] + deltaY * rotationSpeed,
          interaction.initialRotation[1] + deltaX * rotationSpeed,
          interaction.initialRotation[2],
        ]

        meshRef.current.rotation.set(...newRotation)
        onUpdateRotation(object.id, newRotation)
      }
    }

    // Update screen position and visibility for virtualization
    const vector = new THREE.Vector3()
    meshRef.current.getWorldPosition(vector)

    // Check if object is within render distance
    const distance = vector.distanceTo(camera.position)
    if (distance > MAX_RENDER_DISTANCE) {
      onUpdateScreenPosition(object.id, [0, 0], false)
      return
    }

    vector.project(camera)

    const screenX = (vector.x * 0.5 + 0.5) * gl.domElement.clientWidth
    const screenY = (vector.y * -0.5 + 0.5) * gl.domElement.clientHeight

    // Check if object is within viewport bounds
    const isVisible =
      screenX >= viewportBounds.left &&
      screenX <= viewportBounds.right &&
      screenY >= viewportBounds.top &&
      screenY <= viewportBounds.bottom &&
      vector.z < 1 // Not behind camera

    onUpdateScreenPosition(object.id, [screenX, screenY], isVisible)
  })

  // Don't render if not visible (virtualization)
  if (!object.isVisible) {
    return null
  }

  const renderGeometry = () => {
    // Use lower detail for distant objects (LOD)
    const segments = useLOD ? 8 : 32

    switch (object.type) {
      case "cube":
        return <Box args={[1, 1, 1]} />
      case "sphere":
        return <Sphere args={[0.5, segments, segments]} />
      case "pyramid":
        return <Cone args={[0.5, 1, useLOD ? 4 : 8]} />
      case "torus":
        return <Torus args={[0.4, 0.2, useLOD ? 8 : 16, segments]} />
      case "cylinder":
        return <Cylinder args={[0.3, 0.3, 1, segments]} />
      default:
        return <Box args={[1, 1, 1]} />
    }
  }

  return (
    <mesh ref={meshRef} position={object.position} rotation={object.rotation} scale={object.scale}>
      {renderGeometry()}
      <meshStandardMaterial
        color={object.color}
        wireframe={object.isSelected}
        emissive={
          interaction.isActive && interaction.objectId === object.id && interaction.isMovingObject
            ? "#00ff64" // Green glow when moving
            : object.isSelected 
            ? "#444444" // Gray glow when selected
            : "#000000" // No glow
        }
      />
      {object.isSelected && (
        <lineSegments>
          <edgesGeometry args={[new THREE.BoxGeometry(1.2, 1.2, 1.2)]} />
          <lineBasicMaterial color="#ffffff" linewidth={3} />
        </lineSegments>
      )}
    </mesh>
  )
})

Object3D.displayName = "Object3D"

// Optimized AR Anchor Component
const ARAnchor: React.FC<{ anchor: ARAnchor }> = React.memo(({ anchor }) => {
  const meshRef = useRef<THREE.Mesh>(null)

  const [isVisibleInternal, setIsVisibleInternal] = useState(anchor.isVisible)

  useEffect(() => {
    setIsVisibleInternal(anchor.isVisible)
  }, [anchor.isVisible])

  // Don't render if not visible
  if (!isVisibleInternal) {
    return null
  }

  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.getElapsedTime()
      meshRef.current.scale.setScalar(1 + Math.sin(time * 3) * 0.1)
    }
  })

  return (
    <mesh ref={meshRef} position={anchor.worldPosition}>
      <ringGeometry args={[0.1, 0.15, 16]} />
      <meshBasicMaterial color="#00ff64" transparent opacity={anchor.confidence} />
    </mesh>
  )
})

ARAnchor.displayName = "ARAnchor"

// Optimized 3D Scene Component
const Scene3D: React.FC<{
  objects: ARObject[]
  anchors: ARAnchor[]
  onSelectObject: (id: string) => void
  interaction: InteractionState
  onUpdateRotation: (id: string, rotation: [number, number, number]) => void
  onUpdateScreenPosition: (id: string, screenPos: [number, number], isVisible: boolean) => void
  viewportBounds: ViewportBounds
  onUpdatePosition: (id: string, position: [number, number, number]) => void
}> = React.memo(
  ({ objects, anchors, onSelectObject, interaction, onUpdateRotation, onUpdateScreenPosition, viewportBounds, onUpdatePosition }) => {
    // Filter visible objects for performance
    const visibleObjects = useMemo(() => objects.filter((obj) => obj.isVisible !== false), [objects])
    const visibleAnchors = useMemo(() => anchors.filter((anchor) => anchor.isVisible !== false), [anchors])

    return (
      <>
        {/* Optimized Lighting */}
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} intensity={1} castShadow={false} />
        <pointLight position={[-10, -10, -5]} intensity={0.5} />

        {/* Virtualized AR Anchors */}
        {visibleAnchors.map((anchor) => (
          <ARAnchor key={anchor.id} anchor={anchor} />
        ))}

        {/* Virtualized 3D Objects */}
        {visibleObjects.map((object) => (
          <Object3D
            key={object.id}
            object={object}
            onSelect={onSelectObject}
            interaction={interaction}
            onUpdateRotation={onUpdateRotation}
            onUpdateScreenPosition={onUpdateScreenPosition}
            viewportBounds={viewportBounds}
            onUpdatePosition={onUpdatePosition}
          />
        ))}
      </>
    )
  },
)

Scene3D.displayName = "Scene3D"

// Enhanced Camera Hook with flip functionality and SSR safety
const useCamera = () => {
  const [state, setState] = useState<{
    stream: MediaStream | null
    error: string | null
    isLoading: boolean
    isReady: boolean
    facingMode: "environment" | "user"
    canFlip: boolean
  }>({
    stream: null,
    error: null,
    isLoading: true,
    isReady: false,
    facingMode: "environment",
    canFlip: false,
  })

  const initCamera = useCallback(
    async (preferredFacingMode: "environment" | "user" = "environment") => {
      // Skip camera initialization during SSR
      if (typeof window === "undefined" || typeof navigator === "undefined") {
        setState((prev) => ({ ...prev, isLoading: false, error: "Camera not available during server rendering" }))
        return
      }

      try {
        setState((prev) => ({ ...prev, isLoading: true, error: null }))

        console.log("🎥 Starting camera initialization with facing mode:", preferredFacingMode)

        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          throw new Error("Camera API not supported in this browser")
        }

        // Stop existing stream if any
        if (state.stream) {
          state.stream.getTracks().forEach((track) => track.stop())
        }

        console.log("🎥 Requesting camera permissions...")

        // Check available cameras
        let availableCameras: MediaDeviceInfo[] = []
        try {
          // Request permission first
          await navigator.mediaDevices
            .getUserMedia({ video: true })
            .then((tempStream) => {
              // Stop this temporary stream immediately
              tempStream.getTracks().forEach((track) => track.stop())
            })
            .catch((err) => {
              console.warn("⚠️ Initial permission request failed:", err)
              // Continue anyway, we'll try different configs below
            })

          const devices = await navigator.mediaDevices.enumerateDevices()
          availableCameras = devices.filter((device) => device.kind === "videoinput")
          console.log("📹 Available cameras:", availableCameras.length)
        } catch (err) {
          console.warn("⚠️ Could not enumerate devices:", err)
        }

        const canFlip = availableCameras.length > 1

        // Chrome specific configurations - try more variations 
        const configs = [
          // Try exact facingMode first (works better in Chrome)
          {
            video: {
              facingMode: { exact: preferredFacingMode },
              width: { ideal: 1280, max: 1920 },
              height: { ideal: 720, max: 1080 },
            },
          },
          // Then try without exact constraint
          {
            video: {
              facingMode: preferredFacingMode,
              width: { ideal: 1280, max: 1920 },
              height: { ideal: 720, max: 1080 },
            },
          },
          // Try opposite camera
          {
            video: {
              facingMode: preferredFacingMode === "environment" ? "user" : "environment",
              width: { ideal: 1280 },
              height: { ideal: 720 },
            },
          },
          // Try with deviceId if we have cameras
          ...(availableCameras.length > 0 ? [{ video: { deviceId: { exact: availableCameras[0].deviceId } } }] : []),
          // Fallback to basic video
          { video: true },
        ]

        let stream: MediaStream | null = null
        let lastError: Error | null = null
        let actualFacingMode = preferredFacingMode

        for (const config of configs) {
          try {
            console.log("🎥 Trying config:", config)
            stream = await navigator.mediaDevices.getUserMedia(config)
            console.log("✅ Camera stream obtained:", stream)

            // Try to determine actual facing mode from stream
            const videoTrack = stream.getVideoTracks()[0]
            if (videoTrack) {
              const settings = videoTrack.getSettings()
              if (settings.facingMode) {
                actualFacingMode = settings.facingMode as "environment" | "user"
                console.log("📹 Actual facing mode:", actualFacingMode)
              }
            }
            break
          } catch (err) {
            console.warn("⚠️ Config failed:", err)
            lastError = err as Error
          }
        }

        if (!stream) {
          throw lastError || new Error("Failed to access camera")
        }

        setState({
          stream,
          error: null,
          isLoading: false,
          isReady: true,
          facingMode: actualFacingMode,
          canFlip,
        })

        console.log("✅ Camera initialized successfully")
      } catch (error) {
        console.error("❌ Camera initialization failed:", error)
        setState((prev) => ({
          ...prev,
          stream: null,
          error: error instanceof Error ? error.message : "Camera access failed",
          isLoading: false,
          isReady: false,
        }))
      }
    },
    [state.stream],
  )

  const flipCamera = useCallback(() => {
    if (!state.canFlip) return
    const newFacingMode = state.facingMode === "environment" ? "user" : "environment"
    console.log("🔄 Flipping camera to:", newFacingMode)
    initCamera(newFacingMode)
  }, [state.facingMode, state.canFlip, initCamera])

  useEffect(() => {
    // Only initialize camera on client side
    if (typeof window !== "undefined") {
      initCamera()
    }

    return () => {
      if (state.stream) {
        state.stream.getTracks().forEach((track) => track.stop())
      }
    }
  }, [])

  return { ...state, initCamera, flipCamera }
}

// Loading Screen Component
const LoadingScreen: React.FC<{ message?: string; subMessage?: string }> = ({
  message = "Loading AR Collage Studio",
  subMessage = "Preparing your AR experience...",
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
      <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 text-white text-center max-w-md mx-4">
        <div className="text-6xl mb-6 animate-pulse">📱</div>
        <h2 className="text-2xl font-bold mb-4">{message}</h2>
        <p className="text-white/80 mb-4">{subMessage}</p>
        <div className="w-full bg-white/20 rounded-full h-2">
          <div className="bg-blue-500 h-2 rounded-full animate-pulse w-3/4"></div>
        </div>
      </div>
    </div>
  )
}

// Main Component
const ARCollageComposer: React.FC = () => {
  // Add a Chrome-specific error handler in the main component

  // Add this function near the top of the ARCollageComposer component
  const getDetailedErrorMessage = (error: string | null): { message: string; tips: string[] } => {
    if (!error) return { message: "Unknown error", tips: [] }

    // Chrome-specific error messages and solutions
    if (error.includes("Permission denied") || error.includes("NotAllowedError")) {
      return {
        message: "Camera access was denied",
        tips: [
          "Click the camera icon in your address bar and allow access",
          "Check Chrome settings > Privacy and Security > Site Settings > Camera",
          "Try using Chrome's incognito mode",
          "Restart your browser or device",
        ],
      }
    }

    if (error.includes("NotFoundError") || error.includes("OverconstrainedError")) {
      return {
        message: "Camera not found or doesn't match requirements",
        tips: [
          "Make sure your device has a camera",
          "Try a different browser",
          "Disconnect any virtual camera software",
          "Try using the front camera instead",
        ],
      }
    }

    if (error.includes("NotReadableError") || error.includes("AbortError")) {
      return {
        message: "Camera is in use by another application",
        tips: [
          "Close other apps that might be using your camera",
          "Check for video conferencing apps running in the background",
          "Restart your browser",
          "Restart your device",
        ],
      }
    }

    return {
      message: error,
      tips: [
        "Try using a different browser",
        "Check that your camera is working in other apps",
        "Make sure you're using HTTPS or localhost",
        "Try disabling browser extensions",
      ],
    }
  }

  // Check for secure context and browser compatibility
  const [isSecureContext, setIsSecureContext] = useState(true)
  const [browserInfo, setBrowserInfo] = useState("")

  useEffect(() => {
    // Check if we're in a secure context (required for camera access)
    if (typeof window !== "undefined") {
      setIsSecureContext(window.isSecureContext)

      // Get browser info
      const userAgent = navigator.userAgent
      let browserName = "Unknown"

      if (userAgent.match(/chrome|chromium|crios/i)) {
        browserName = "Chrome"
      } else if (userAgent.match(/firefox|fxios/i)) {
        browserName = "Firefox"
      } else if (userAgent.match(/safari/i)) {
        browserName = "Safari"
      } else if (userAgent.match(/opr\//i)) {
        browserName = "Opera"
      } else if (userAgent.match(/edg/i)) {
        browserName = "Edge"
      }

      setBrowserInfo(
        `${browserName} on ${
          /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent) ? "Mobile" : "Desktop"
        }`,
      )
    }
  }, [])

  // Refs
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Device detection and viewport bounds with SSR safety
  const { isMobile, isClient } = useDeviceType()
  const viewportBounds = useViewportBounds()

  // Camera state with flip functionality
  const { stream, error: cameraError, isLoading, isReady, facingMode, canFlip, initCamera, flipCamera } = useCamera()

  // App state
  const [objects, setObjects] = useState<ARObject[]>([])
  const [anchors, setAnchors] = useState<ARAnchor[]>([])
  const [selectedTool, setSelectedTool] = useState<ToolType | null>(null)
  const [showInstructions, setShowInstructions] = useState(true)
  const [toolsPanelOpen, setToolsPanelOpen] = useState(false) // Default to false for SSR

  const [interaction, setInteraction] = useState<InteractionState>({
    isActive: false,
    startX: 0,
    startY: 0,
    currentX: 0,
    currentY: 0,
    objectId: null,
    initialRotation: [0, 0, 0],
    type: "touch",
  })

  // Drag preview state
  const [dragPreview, setDragPreview] = useState<{
    isVisible: boolean
    x: number
    y: number
    tool: ToolType | null
  }>({
    isVisible: false,
    x: 0,
    y: 0,
    tool: null,
  })

  // Update panel states based on device type 
  useEffect(() => {
    if (isClient) {
      setToolsPanelOpen(!isMobile)
    }
  }, [isMobile, isClient])

  // Setup video when stream is available
  useEffect(() => {
    if (stream && videoRef.current) {
      console.log("🎥 Setting up video element...")

      const video = videoRef.current
      video.srcObject = stream

      const handleLoadedMetadata = () => {
        console.log("✅ Video metadata loaded")
        video
          .play()
          .then(() => console.log("✅ Video playing"))
          .catch((err) => console.error("❌ Video play failed:", err))
      }

      const handleError = (e: Event) => {
        console.error("❌ Video error:", e)
      }

      video.addEventListener("loadedmetadata", handleLoadedMetadata)
      video.addEventListener("error", handleError)

      return () => {
        video.removeEventListener("loadedmetadata", handleLoadedMetadata)
        video.removeEventListener("error", handleError)
      }
    }
  }, [stream])

  // Convert screen coordinates
  const screenToWorld = useCallback((x: number, y: number): [number, number, number] => {
    if (typeof window === "undefined") return [0, 0, 0]
    const normalizedX = (x / window.innerWidth) * 2 - 1
    const normalizedY = -(y / window.innerHeight) * 2 + 1
    return [normalizedX * 5, normalizedY * 3, 0]
  }, [])

  // Optimized object finding with virtualization
  const findObjectAtPosition = useCallback(
    (x: number, y: number): ARObject | null => {
      const hitRadius = isMobile ? 60 : 40

      // Only check visible objects for performance
      for (const obj of objects) {
        if (obj.screenPosition && obj.isVisible) {
          const [objX, objY] = obj.screenPosition
          const distance = Math.sqrt((x - objX) ** 2 + (y - objY) ** 2)
          if (distance <= hitRadius) {
            return obj
          }
        }
      }
      return null
    },
    [objects, isMobile],
  )

  // Update object screen position and visibility (virtualization)
  const updateObjectScreenPosition = useCallback((id: string, screenPos: [number, number], isVisible: boolean) => {
    setObjects((prev) => prev.map((obj) => (obj.id === id ? { ...obj, screenPosition: screenPos, isVisible } : obj)))
  }, [])

  // Update anchor visibility
  const updateAnchorVisibility = useCallback(() => {
    setAnchors((prev) =>
      prev.map((anchor) => {
        const [x, y] = anchor.screenPosition
        const isVisible =
          x >= viewportBounds.left && x <= viewportBounds.right && y >= viewportBounds.top && y <= viewportBounds.bottom

        return { ...anchor, isVisible }
      }),
    )
  }, [viewportBounds])

  // Update anchor visibility when viewport changes
  useEffect(() => {
    updateAnchorVisibility()
  }, [updateAnchorVisibility])

  // Add object
  const addObject = useCallback(
    (x: number, y: number) => {
      // Don't place if no tool is selected or if hand tool is selected
      if (!selectedTool || selectedTool === "hand") return

      const worldPos = screenToWorld(x, y)

      const newAnchor: ARAnchor = {
        id: generateId(),
        screenPosition: [x, y],
        worldPosition: worldPos,
        confidence: 0.8 + Math.random() * 0.2,
        isVisible: true,
      }

      const newObject: ARObject = {
        id: generateId(),
        type: selectedTool,
        position: worldPos,
        rotation: [0, 0, 0],
        scale: [1, 1, 1],
        color: getRandomColor(),
        isSelected: false,
        screenPosition: [x, y],
        isVisible: true,
        lastUpdateTime: Date.now(),
      }

      setAnchors((prev) => [...prev, newAnchor])
      setObjects((prev) => [...prev, newObject])

      // Reset tool selection after placing object
      setSelectedTool(null)

      console.log("➕ Added object:", newObject, "- Tool reset")
    },
    [selectedTool, screenToWorld],
  )

  // Select object
  const selectObject = useCallback((id: string) => {
    setObjects((prev) =>
      prev.map((obj) => ({
        ...obj,
        isSelected: obj.id === id,
      })),
    )
  }, [])

  // Deselect all objects
  const deselectAllObjects = useCallback(() => {
    setObjects((prev) =>
      prev.map((obj) => ({
        ...obj,
        isSelected: false,
      })),
    )
  }, [])

  // Update object rotation
  const updateObjectRotation = useCallback((id: string, rotation: [number, number, number]) => {
    setObjects((prev) => prev.map((obj) => (obj.id === id ? { ...obj, rotation } : obj)))
  }, [])

  // Update object position (for real-time movement)
  const updateObjectPosition = useCallback((id: string, position: [number, number, number]) => {
    setObjects((prev) => prev.map((obj) => (obj.id === id ? { ...obj, position } : obj)))
  }, [])

  // Move object to new position (for hand tool)
  const moveObject = useCallback((id: string, x: number, y: number) => {
    const worldPos = screenToWorld(x, y)
    
    setObjects((prev) => prev.map((obj) => 
      obj.id === id 
        ? { ...obj, position: worldPos, screenPosition: [x, y] }
        : obj
    ))

    // Also update the associated anchor
    setAnchors((prev) => prev.map((anchor) => {
      // Find anchor closest to the object's old position
      const obj = objects.find(o => o.id === id)
      if (obj && obj.screenPosition) {
        const [oldX, oldY] = obj.screenPosition
        const [anchorX, anchorY] = anchor.screenPosition
        const distance = Math.sqrt((oldX - anchorX) ** 2 + (oldY - anchorY) ** 2)
        
        // If this anchor is very close to the old object position, move it too
        if (distance < 50) {
          return { ...anchor, screenPosition: [x, y], worldPosition: worldPos }
        }
      }
      return anchor
    }))

    console.log("📍 Moved object:", id, "to:", x, y)
  }, [screenToWorld, objects])

  // Delete individual object and its nearest anchor
  const deleteObject = useCallback((objectId: string) => {
    console.log("🗑️ Attempting to delete object:", objectId)
    
    const objectToDelete = objects.find(obj => obj.id === objectId)
    if (!objectToDelete) {
      console.warn("❌ Object not found:", objectId)
      return
    }

    console.log("✅ Found object to delete:", objectToDelete.type)

    // Remove the object
    setObjects((prev) => {
      const newObjects = prev.filter(obj => obj.id !== objectId)
      console.log("📦 Objects before:", prev.length, "after:", newObjects.length)
      return newObjects
    })

    // Find and remove the nearest anchor (if object has screen position)
    if (objectToDelete.screenPosition) {
      const [objX, objY] = objectToDelete.screenPosition
      let nearestAnchor: ARAnchor | null = null
      let minDistance = Infinity

      anchors.forEach(anchor => {
        const [anchorX, anchorY] = anchor.screenPosition
        const distance = Math.sqrt((objX - anchorX) ** 2 + (objY - anchorY) ** 2)
        if (distance < minDistance) {
          minDistance = distance
          nearestAnchor = anchor
        }
      })

      // Remove the nearest anchor if it's close enough (within 100 pixels)
      if (nearestAnchor && minDistance < 100) {
        setAnchors((prev) => {
          const newAnchors = prev.filter(anchor => anchor.id !== nearestAnchor!.id)
          console.log("🎯 Anchors before:", prev.length, "after:", newAnchors.length)
          return newAnchors
        })
        console.log("🎯 Removed nearest anchor at distance:", minDistance)
      }
    }

    console.log("✅ Successfully deleted object:", objectId)
  }, [objects, anchors])

  // Get interaction coordinates with SSR safety
  const getInteractionCoords = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect()
    if (!rect) return { x: 0, y: 0 }

    if ("touches" in e) {
      const touch = e.touches[0]
      return {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
      }
    } else {
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      }
    }
  }, [])

  // Universal interaction handlers
  const handleInteractionStart = useCallback(
    (e: React.TouchEvent | React.MouseEvent) => {
      e.preventDefault()

      const { x, y } = getInteractionCoords(e)
      const interactionType = "touches" in e ? "touch" : "mouse"

      console.log(`👆 ${interactionType} start at:`, x, y)

      // Check if we're touching an existing object
      const hitObject = findObjectAtPosition(x, y)

      if (hitObject) {
        // Check if hand tool is selected for moving, otherwise rotate
        if (selectedTool === "hand") {
          // Select and start moving the object
          selectObject(hitObject.id)
          setInteraction({
            isActive: true,
            startX: x,
            startY: y,
            currentX: x,
            currentY: y,
            objectId: hitObject.id,
            initialRotation: [...hitObject.rotation],
            type: interactionType,
            isDragToPlace: false,
            isMovingObject: true,
          })
          console.log("✋ Selected object for moving:", hitObject.id)
        } else {
          // Select and start rotating the object
          selectObject(hitObject.id)
          setInteraction({
            isActive: true,
            startX: x,
            startY: y,
            currentX: x,
            currentY: y,
            objectId: hitObject.id,
            initialRotation: [...hitObject.rotation],
            type: interactionType,
            isDragToPlace: false,
            isMovingObject: false,
          })
          console.log("🎯 Selected object for rotation:", hitObject.id)
        }
      } else {
        // Check if we have a tool selected for drag-to-place
        if (selectedTool) {
          // Start drag-to-place mode
          setInteraction({
            isActive: true,
            startX: x,
            startY: y,
            currentX: x,
            currentY: y,
            objectId: null,
            initialRotation: [0, 0, 0],
            type: interactionType,
            isDragToPlace: true,
          })
          setDragPreview({
            isVisible: true,
            x,
            y,
            tool: selectedTool,
          })
          console.log("🎨 Started drag-to-place mode with tool:", selectedTool)
        } else {
          console.log("⚠️ No tool selected, cannot place object")
        }
      }
    },
    [findObjectAtPosition, selectObject, getInteractionCoords, selectedTool],
  )

  const handleInteractionMove = useCallback(
    (e: React.TouchEvent | React.MouseEvent) => {
      e.preventDefault()

      if (!interaction.isActive) return

      const { x, y } = getInteractionCoords(e)

      setInteraction((prev) => ({
        ...prev,
        currentX: x,
        currentY: y,
      }))

      // Update drag preview position if in drag-to-place mode
      if (interaction.isDragToPlace) {
        setDragPreview((prev) => ({
          ...prev,
          x,
          y,
        }))
      }
    },
    [interaction.isActive, interaction.isDragToPlace, getInteractionCoords],
  )

  const handleInteractionEnd = useCallback(() => {
    // If we were moving an object with hand tool, finalize the move
    if (interaction.isMovingObject && interaction.objectId && selectedTool === "hand") {
      moveObject(interaction.objectId, interaction.currentX, interaction.currentY)
    }
    
    // If we were in drag-to-place mode, place the object
    if (interaction.isDragToPlace && selectedTool) {
      const distance = Math.sqrt(
        (interaction.currentX - interaction.startX) ** 2 + 
        (interaction.currentY - interaction.startY) ** 2
      )
      
      // If it's a small movement, treat as a click, otherwise as a drag
      if (distance < 10) {
        // Click-to-place at start position
        addObject(interaction.startX, interaction.startY)
      } else {
        // Drag-to-place at end position
        addObject(interaction.currentX, interaction.currentY)
      }
    }

    // Reset interaction and drag preview
    setInteraction((prev) => ({
      ...prev,
      isActive: false,
      objectId: null,
      isDragToPlace: false,
      isMovingObject: false,
    }))
    
    setDragPreview({
      isVisible: false,
      x: 0,
      y: 0,
      tool: null,
    })
  }, [interaction, selectedTool, addObject, moveObject])

  // Clear all objects
  const clearAllObjects = useCallback(() => {
    setObjects([])
    setAnchors([])
  }, [])

  // Screenshot capture
  const captureScreenshot = useCallback(async () => {
    if (typeof window === "undefined" || !videoRef.current || !isReady) {
      alert("❌ Camera not ready")
      return
    }

    try {
      console.log("📸 Capturing screenshot...")

      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")
      if (!ctx) throw new Error("Canvas context not available")

      canvas.width = window.innerWidth
      canvas.height = window.innerHeight

      // Draw video background
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height)

      // Draw only visible AR anchors for performance
      anchors
        .filter((anchor) => anchor.isVisible)
        .forEach((anchor) => {
          const [x, y] = anchor.screenPosition
          const time = Date.now() * 0.003
          const pulse = 1 + Math.sin(time * 3) * 0.1

          ctx.save()
          ctx.translate(x, y)
          ctx.scale(pulse, pulse)

          // Outer ring
          ctx.strokeStyle = `rgba(0, 255, 100, ${anchor.confidence})`
          ctx.lineWidth = 3
          ctx.beginPath()
          ctx.arc(0, 0, 20, 0, Math.PI * 2)
          ctx.stroke()

          // Inner dot
          ctx.fillStyle = `rgba(0, 255, 100, ${anchor.confidence})`
          ctx.beginPath()
          ctx.arc(0, 0, 6, 0, Math.PI * 2)
          ctx.fill()

          ctx.restore()
        })

      // Add watermark
      ctx.fillStyle = "rgba(0, 0, 0, 0.8)"
      ctx.fillRect(20, 20, 350, 80)
      ctx.fillStyle = "#FFFFFF"
      ctx.font = "18px Arial"
      ctx.fillText(`AR Collage Studio - ${new Date().toLocaleString()}`, 30, 45)
      ctx.fillText(`Objects: ${objects.length} | Camera: ${facingMode}`, 30, 70)

      // Download
      const link = document.createElement("a")
      link.download = `ar-collage-${Date.now()}.png`
      link.href = canvas.toDataURL("image/png", 0.9)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      // Success notification
      const notification = document.createElement("div")
      notification.textContent = "📸 Screenshot saved successfully!"
      notification.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0, 255, 100, 0.95);
        color: white;
        padding: 20px 40px;
        border-radius: 30px;
        font-weight: bold;
        font-size: 18px;
        z-index: 10000;
        backdrop-filter: blur(10px);
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
      `
      document.body.appendChild(notification)
      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification)
        }
      }, 3000)

      console.log("✅ Screenshot captured")
    } catch (error) {
      console.error("❌ Screenshot failed:", error)
      alert("Screenshot failed. Please try again.")
    }
  }, [isReady, objects, anchors, facingMode])

  const selectedObject = objects.find((obj) => obj.isSelected)
  const visibleObjectCount = objects.filter((obj) => obj.isVisible).length

  // Show warning if not in secure context
  if (!isSecureContext) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-900 via-purple-900 to-indigo-900 flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 text-white text-center max-w-md">
          <div className="text-6xl mb-6">🔒</div>
          <h2 className="text-2xl font-bold mb-4">Secure Connection Required</h2>
          <p className="text-white/80 mb-6">
            AR Collage Studio requires a secure connection (HTTPS) to access your camera.
          </p>
          <p className="text-white/80 mb-6">
            You are currently using: <span className="font-bold">{browserInfo}</span>
          </p>
          <div className="space-y-3">
            <a
              href="https://localhost:3000"
              className="block w-full bg-blue-500/80 backdrop-blur-lg rounded-2xl px-6 py-3 text-white font-semibold hover:bg-blue-600/80 transition-all duration-200 cursor-pointer"
            >
              Try HTTPS Connection
            </a>
          </div>
          <div className="mt-6 text-white/60 text-sm">
            <p>For Chrome users:</p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-left">
              <li>Use HTTPS or localhost</li>
              <li>Check that camera permissions are enabled</li>
              <li>Try using Chrome's incognito mode</li>
              <li>Ensure no other apps are using your camera</li>
            </ul>
          </div>
        </div>
      </div>
    )
  }

  // Don't render during SSR
  if (!isClient) {
    return <LoadingScreen message="Loading AR Collage Studio" subMessage="Initializing application..." />
  }

  // Loading state
  if (isLoading) {
    return <LoadingScreen message="Initializing AR Camera" subMessage="Requesting camera permissions..." />
  }

  // Error state
  if (cameraError) {
    const { message, tips } = getDetailedErrorMessage(cameraError)

    return (
      <div className="min-h-screen bg-gradient-to-br from-red-900 via-purple-900 to-indigo-900 flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 text-white text-center max-w-md">
          <div className="text-6xl mb-6">❌</div>
          <h2 className="text-2xl font-bold mb-4">Camera Access Required</h2>
          <p className="text-white/80 mb-6">{message}</p>
          <div className="space-y-3">
            <button
              onClick={() => initCamera()}
              className="w-full bg-blue-500/80 backdrop-blur-lg rounded-2xl px-6 py-3 text-white font-semibold hover:bg-blue-600/80 transition-all duration-200 cursor-pointer"
            >
              Try Again
            </button>
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-white/20 backdrop-blur-lg rounded-2xl px-6 py-3 text-white font-semibold hover:bg-white/30 transition-all duration-200 cursor-pointer"
            >
              Reload Page
            </button>
          </div>
          <div className="mt-6 text-white/60 text-sm">
            <p>Troubleshooting tips:</p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-left">
              {tips.map((tip, index) => (
                <li key={index}>{tip}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Camera Video Background */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="absolute inset-0 w-full h-full object-cover"
        style={{ transform: isMobile && facingMode === "user" ? "scaleX(-1)" : "none" }}
      />

      {/* 3D Canvas Overlay with Performance Optimization */}
      <div className="absolute inset-0 w-full h-full">
        <Canvas
          camera={{ position: [0, 0, 5], fov: 75 }}
          style={{ background: "transparent" }}
          performance={{ min: 0.5 }} // Adaptive performance
          dpr={[1, 2]} // Limit pixel ratio for performance
        >
          <Suspense fallback={null}>
            <Scene3D
              objects={objects}
              anchors={anchors}
              onSelectObject={selectObject}
              interaction={interaction}
              onUpdateRotation={updateObjectRotation}
              onUpdateScreenPosition={updateObjectScreenPosition}
              viewportBounds={viewportBounds}
              onUpdatePosition={updateObjectPosition}
            />
          </Suspense>
        </Canvas>
      </div>

      {/* Interaction Overlay */}
      <canvas
        ref={canvasRef}
        className={`absolute inset-0 w-full h-full touch-none ${
          selectedTool === "hand" ? "cursor-grab" : "cursor-crosshair"
        }`}
        width={typeof window !== "undefined" ? window.innerWidth : 1920}
        height={typeof window !== "undefined" ? window.innerHeight : 1080}
        onTouchStart={handleInteractionStart}
        onTouchMove={handleInteractionMove}
        onTouchEnd={handleInteractionEnd}
        onMouseDown={handleInteractionStart}
        onMouseMove={handleInteractionMove}
        onMouseUp={handleInteractionEnd}
        style={{ touchAction: "none", background: "transparent" }}
      />

      {/* Drag Preview Overlay */}
      {dragPreview.isVisible && dragPreview.tool && (
        <div
          className="absolute pointer-events-none z-20"
          style={{
            left: dragPreview.x - 30,
            top: dragPreview.y - 30,
          }}
        >
          <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl border-2 border-blue-400 flex items-center justify-center text-2xl shadow-lg animate-pulse">
            {TOOLS.find(tool => tool.type === dragPreview.tool)?.icon}
          </div>
          <div className="text-white text-xs text-center mt-1 font-semibold drop-shadow-lg">
            {TOOLS.find(tool => tool.type === dragPreview.tool)?.name}
          </div>
        </div>
      )}

      {/* Improved Mobile Header */}
      <div className="absolute top-0 left-0 right-0 z-10">
        <div className="bg-gradient-to-b from-black/90 via-black/60 to-transparent">
          {/* Main Header */}
          <div className="flex items-center justify-between p-3">
            <div className="flex-1">
              <h1 className="text-white font-bold text-lg leading-tight">AR Collage Studio</h1>
              <p className="text-white/70 text-xs leading-tight mt-0.5">
                {isMobile
                  ? "Tap objects to rotate • Tap/drag to place"
                  : "Click objects to rotate • Click/drag to place"}
              </p>
            </div>
            <div className="flex items-center space-x-2 ml-3">
              {/* Camera Flip Button (Mobile Only) */}
              {isMobile && canFlip && (
                <button
                  onClick={flipCamera}
                  className="bg-white/15 backdrop-blur-lg rounded-xl p-2.5 text-white hover:bg-white/25 transition-all duration-200 text-lg shadow-lg cursor-pointer"
                  title={`Switch to ${facingMode === "environment" ? "front" : "rear"} camera`}
                >
                  🔄
                </button>
              )}
              <button
                onClick={captureScreenshot}
                className="bg-white/15 backdrop-blur-lg rounded-xl p-2.5 text-white hover:bg-white/25 transition-all duration-200 text-lg shadow-lg cursor-pointer"
                title="Capture Screenshot"
              >
                📸
              </button>
              {objects.length > 0 && (
                <button
                  onClick={clearAllObjects}
                  className="bg-red-500/80 backdrop-blur-lg rounded-xl p-2.5 text-white hover:bg-red-600/80 transition-all duration-200 text-lg shadow-lg cursor-pointer"
                  title="Clear All Objects"
                >
                  🧹
                </button>
              )}
            </div>
          </div>

          {/* Performance Stats (Mobile) */}
          {isMobile && (
            <div className="px-3 pb-2">
              <div className="flex items-center justify-between text-white/60 text-xs">
                <span>Objects: {objects.length}</span>
                <span>Visible: {visibleObjectCount}</span>
                <span>Camera: {facingMode === "environment" ? "Rear" : "Front"}</span>
                <span>Tool: {selectedTool ? TOOLS.find((t) => t.type === selectedTool)?.name : "None"}</span>
                {selectedObject && <span className="text-blue-400">Selected: {selectedObject.type}</span>}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Optimized Tool Palette */}
      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
        {/* Toggle Button */}
        <button
          onClick={() => setToolsPanelOpen(!toolsPanelOpen)}
          className={`mb-3 w-12 h-12 rounded-full bg-white/15 backdrop-blur-lg text-white text-xl hover:bg-white/25 transition-all duration-200 shadow-lg cursor-pointer ${
            toolsPanelOpen ? "scale-110 bg-blue-500/80" : ""
          }`}
          title="3D Objects"
        >
          🎨
        </button>

        {/* Panel Content */}
        <div
          className={`bg-white/15 backdrop-blur-lg rounded-2xl shadow-xl transition-all duration-300 overflow-hidden ${
            toolsPanelOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
          }`}
        >
          <div className="p-2.5">
            <div className="text-white text-center text-xs font-semibold mb-2">3D Objects</div>
            <div className="grid grid-cols-3 gap-1.5">
              {TOOLS.map((tool) => (
                <button
                  key={tool.type}
                  onClick={() => setSelectedTool(tool.type)}
                  className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg transition-all duration-200 cursor-pointer ${
                    selectedTool === tool.type
                      ? "bg-blue-500/90 text-white scale-105 shadow-lg"
                      : "bg-white/10 text-white/80 hover:bg-white/20 hover:scale-105"
                  }`}
                  title={tool.name}
                >
                  {tool.icon}
                </button>
              ))}
            </div>
            {!selectedTool && (
              <div className="text-white/60 text-center text-xs mt-2">
                Select a tool to place objects
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Button for Selected Object */}
      {selectedObject && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 z-10">
          <div className="bg-white/15 backdrop-blur-lg rounded-2xl shadow-xl p-4 min-w-[120px]">
            <div className="text-white text-center text-xs font-semibold mb-3">Selected Object</div>
            <div className="flex flex-col items-center mb-3">
              <div className="text-3xl mb-2 bg-white/10 rounded-xl p-2 w-12 h-12 flex items-center justify-center">
                {TOOLS.find(tool => tool.type === selectedObject.type)?.icon}
              </div>
              <div className="text-white/90 text-sm font-medium capitalize">{selectedObject.type}</div>
            </div>
            <div className="flex justify-center">
              <button
                onClick={() => {
                  deleteObject(selectedObject.id)
                  deselectAllObjects()
                }}
                className="w-12 h-12 rounded-xl bg-red-500/80 hover:bg-red-600/80 text-white text-lg transition-all duration-200 cursor-pointer shadow-lg flex items-center justify-center"
                title="Delete Selected Object"
              >
                ❌
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Status Bar */}
      {!isMobile && (
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent z-10">
          <div className="flex items-center justify-between text-white text-sm">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl px-4 py-2">
              Objects: {objects.length} | Visible: {visibleObjectCount}
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl px-4 py-2">
              Tool: {selectedTool ? TOOLS.find((t) => t.type === selectedTool)?.name : "None"}
            </div>
            {selectedObject && (
              <div className="bg-blue-500/80 backdrop-blur-lg rounded-2xl px-4 py-2">
                Selected: {selectedObject.type}
              </div>
            )}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl px-4 py-2">
              Performance: {Math.round((visibleObjectCount / Math.max(objects.length, 1)) * 100)}% visible
            </div>
          </div>
        </div>
      )}

      {/* Instructions Modal */}
      {showInstructions && (
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 text-center text-white max-w-lg mx-4 shadow-2xl">
            <div className="text-5xl mb-6">🎯</div>
            <h3 className="text-2xl font-bold mb-6">Welcome to AR Collage Studio</h3>
            <div className="text-white/90 text-left space-y-3 mb-8 text-sm">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">🎨</span>
                <span>Select a tool each time you want to place an object</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-2xl">👆</span>
                <span>Tap or drag to place objects anywhere on screen</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-2xl">🎯</span>
                <span>Tap objects to select and rotate them</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-2xl">🔄</span>
                <span>Drag selected objects to rotate in 3D</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-2xl">✋</span>
                <span>Use hand tool to drag and reposition objects</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-2xl">🗑️</span>
                <span>Use delete button to remove selected objects</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-2xl">🧹</span>
                <span>Use clear button to remove all objects at once</span>
              </div>
              {isMobile && canFlip && (
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">📱</span>
                  <span>Use flip button to switch between front/rear camera</span>
                </div>
              )}
              <div className="flex items-center space-x-3">
                <span className="text-2xl">⚡</span>
                <span>Optimized performance with canvas virtualization</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-2xl">📸</span>
                <span>Capture mixed reality screenshots</span>
              </div>
            </div>
            <button
              onClick={() => setShowInstructions(false)}
              className="bg-blue-500/80 backdrop-blur-lg rounded-2xl px-8 py-4 text-white font-bold text-lg hover:bg-blue-600/80 transition-all duration-200 shadow-lg cursor-pointer"
            >
              Start Creating! 🚀
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default ARCollageComposer
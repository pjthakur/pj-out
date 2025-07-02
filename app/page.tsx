"use client";
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { FaEraser, FaBolt, FaLightbulb, FaToggleOff } from 'react-icons/fa';
import { IoResize, IoRefreshOutline, IoInformationCircleOutline, IoSettingsOutline } from 'react-icons/io5';

//-///////////////////////////////////////////////////////////////////////////
// TYPES AND CONSTANTS
//-///////////////////////////////////////////////////////////////////////////

type ComponentType = 'battery' | 'bulb' | 'switch' | 'resistor';

interface Position {
    x: number;
    y: number;
}

// Base interface for all components
interface BaseComponent {
    id: string;
    type: ComponentType;
    position: Position;
    resistance: number;
    current: number; // Amperes
    maxCurrent: number;
    isBusted?: boolean;
    bustReason?: 'over-current' | 'short-circuit';
}

interface Resistor extends BaseComponent {
    type: 'resistor';
}

// Specific component types
interface Battery extends BaseComponent {
    type: 'battery';
    voltage: number; // Volts
}

interface Bulb extends BaseComponent {
    type: 'bulb';
}

interface Switch extends BaseComponent {
    type: 'switch';
    isOn: boolean;
}

type CircuitComponentData = Battery | Bulb | Switch | Resistor;;

interface Endpoint {
    componentId: string;
    endpointIndex: 0 | 1;
}

interface Connection {
    id: string;
    from: Endpoint;
    to: Endpoint;
}

// Constants for component dimensions and properties
const COMPONENT_SIZE = { width: 80, height: 40 };
const ENDPOINT_RADIUS = 8;
const DEFAULT_VOLTAGE = 9; // 9V battery
const DEFAULT_BULB_RESISTANCE = 10; // 10 Ohms
const DEFAULT_SWITCH_RESISTANCE_ON = 0.1; // Near zero resistance when on
const DEFAULT_SWITCH_RESISTANCE_OFF = 1e12;
const DEFAULT_RESISTOR_RESISTANCE_OFF = 20; // Effectively infinite resistance when off
const SHORT_CIRCUIT_THRESHOLD = 0.05;
const HIGH_CURRENT_THRESHOLD = 1.0; // In Amperes, for enhanced visual effect

// Maximum current ratings (in Amperes)
const MAX_CURRENT = {
    BULB: 1.5,
    RESISTOR: 2.0,
    SWITCH: 50.0,
    BATTERY: 25.0, // Internal failure current
};

//-///////////////////////////////////////////////////////////////////////////
// HELPER FUNCTIONS
//-///////////////////////////////////////////////////////////////////////////

const generateId = () => `id_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

// Get the absolute position of a component's endpoint
const getEndpointPosition = (component: CircuitComponentData, endpointIndex: 0 | 1): Position => {
    return {
        x: component.position.x + (endpointIndex === 0 ? 0 : COMPONENT_SIZE.width),
        y: component.position.y + COMPONENT_SIZE.height / 2,
    };
};

//-///////////////////////////////////////////////////////////////////////////
// SVG COMPONENT RENDERERS
//-///////////////////////////////////////////////////////////////////////////

const ComponentVisual = React.memo(({ component, isSelected }: { component: CircuitComponentData, isSelected: boolean }) => {
    const hasCurrentFlow = Math.abs(component.current) > 0.01;
    const isBusted = component.isBusted === true;
    const currentIntensity = Math.min(Math.abs(component.current), 2); // Cap for visual purposes
    const bulbGlow = component.type === 'bulb' && hasCurrentFlow && !isBusted;

    return (
        <div className={`relative ${hasCurrentFlow && !isBusted ? 'endpoint-active' : ''}`}>
            {/* Busted Text Overlay */}
            {isBusted && component.bustReason === 'over-current' && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-red-900/70 border border-red-700/80 text-red-300 text-xs font-bold px-2 py-0.5 rounded-full backdrop-blur-sm shadow-lg z-10">
                    BUSTED
                </div>
            )}
        <svg
            width={COMPONENT_SIZE.width}
            height={COMPONENT_SIZE.height}
            viewBox={`0 0 ${COMPONENT_SIZE.width} ${COMPONENT_SIZE.height}`}
                    style={{ cursor: 'pointer' }}
                >
                    <defs>
                        <linearGradient id={`batteryGradient-${component.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor={hasCurrentFlow ? "#22C55E" : "#10B981"} />
                            <stop offset="100%" stopColor={hasCurrentFlow ? "#16A34A" : "#059669"} />
                        </linearGradient>
                        <linearGradient id={`bulbGradient-${component.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor={bulbGlow ? "#FDE047" : "#6B7280"} />
                            <stop offset="100%" stopColor={bulbGlow ? "#FACC15" : "#4B5563"} />
                        </linearGradient>
                        <linearGradient id={`switchGradient-${component.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor={hasCurrentFlow ? "#A855F7" : "#8B5CF6"} />
                            <stop offset="100%" stopColor={hasCurrentFlow ? "#9333EA" : "#7C3AED"} />
                        </linearGradient>
                        <linearGradient id={`resistorGradient-${component.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor={hasCurrentFlow ? "#F97316" : "#EF4444"} />
                            <stop offset="100%" stopColor={hasCurrentFlow ? "#EA580C" : "#DC2626"} />
                        </linearGradient>
                        <filter id={`glow-${component.id}`} x="-50%" y="-50%" width="200%" height="200%">
                            <feGaussianBlur stdDeviation="6" result="coloredBlur" />
                            <feMerge>
                                <feMergeNode in="coloredBlur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                        <filter id={`blueGlow-${component.id}`} x="-50%" y="-50%" width="200%" height="200%">
                            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                            <feMerge>
                                <feMergeNode in="coloredBlur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                        <radialGradient id={`bulbGlowRadial-${component.id}`} cx="50%" cy="50%" r="60%">
                            <stop offset="0%" stopColor="rgba(251, 191, 36, 0.8)" />
                            <stop offset="70%" stopColor="rgba(251, 191, 36, 0.3)" />
                            <stop offset="100%" stopColor="rgba(251, 191, 36, 0)" />
                        </radialGradient>
                    </defs>

            {/* Selection glow */}
                    {isSelected && (
                        <rect 
                            x="-4" y="-4" 
                            width={COMPONENT_SIZE.width + 8} 
                            height={COMPONENT_SIZE.height + 8} 
                            rx="14" 
                            fill="none" 
                            stroke="#3B82F6" 
                            strokeWidth="3"
                            filter={`url(#blueGlow-${component.id})`}
                        />
                    )}

                    {/* Component Body - Enhanced glassmorphism */}
                    <rect 
                        x="6" y="6" 
                        width="68" height="28" 
                        rx="10" 
                        fill={hasCurrentFlow ? "rgba(59, 130, 246, 0.15)" : "rgba(255, 255, 255, 0.1)"} 
                        stroke={hasCurrentFlow ? "rgba(59, 130, 246, 0.5)" : "rgba(255, 255, 255, 0.3)"} 
                        strokeWidth="2"
                    />

                {/* Busted Overlay for over-current only */}
                {isBusted && component.bustReason === 'over-current' && (
                    <g>
                        <rect x="6" y="6" width="68" height="28" rx="10" fill="rgba(239, 68, 68, 0.4)" />
                    </g>
                )}

            {/* Component Specifics */}
            {component.type === 'battery' && (
                <>
                            {/* Battery cells */}
                            <rect x="10" y="10" width="8" height="20" rx="4" fill={`url(#batteryGradient-${component.id})`} />
                            <rect x="20" y="12" width="6" height="16" rx="3" fill={`url(#batteryGradient-${component.id})`} />
                            <rect x="28" y="10" width="8" height="20" rx="4" fill={`url(#batteryGradient-${component.id})`} />
                            <rect x="38" y="12" width="6" height="16" rx="3" fill={`url(#batteryGradient-${component.id})`} />
                            <rect x="46" y="10" width="8" height="20" rx="4" fill={`url(#batteryGradient-${component.id})`} />
                            <rect x="56" y="12" width="6" height="16" rx="3" fill={`url(#batteryGradient-${component.id})`} />
                            
                            {/* Positive terminal */}
                            <rect x="70" y="16" width="6" height="8" rx="2" fill={hasCurrentFlow ? "#22C55E" : "#10B981"} />
                            
                                                    {/* Voltage display below component */}
                            <rect x="25" y="45" width="30" height="10" rx="5" fill="rgba(0, 0, 0, 0.6)" />
                            <text x="40" y="51" fill="white" fontSize="8" textAnchor="middle" fontWeight="bold">
                        {component.voltage}V
                    </text>
                            
                            {/* Terminal symbols - RENDERED LAST TO BE ON TOP */}
                            <g>
                                <text x="65" y="22" fill="white" fontSize="14" textAnchor="middle" dominantBaseline="middle" fontWeight="bold" style={{ pointerEvents: 'none' }}>+</text>
                                <text x="15" y="22" fill="white" fontSize="14" textAnchor="middle" dominantBaseline="middle" fontWeight="bold" style={{ pointerEvents: 'none' }}>−</text>
                            </g>
                            
                            {/* Current flow indicator */}
                            {hasCurrentFlow && (
                                <rect x="10" y="32" width="52" height="2" rx="1" fill="#22C55E">
                                    <animate attributeName="opacity" values="0.3;1;0.3" dur="1s" repeatCount="indefinite" />
                                </rect>
                            )}
                            
                            {/* Current display for active circuits */}
                            {hasCurrentFlow && (
                                <text x="40" y="60" fill="#22C55E" fontSize="7" textAnchor="middle" fontWeight="bold">
                                    {Math.abs(component.current).toFixed(2)}A
                                </text>
                            )}
                </>
            )}
                    
            {component.type === 'bulb' && (
                <>
                            {/* Bulb base */}
                            <rect x="32" y="26" width="16" height="8" rx="2" fill="#9CA3AF" />
                            
                            {/* Bulb glass */}
                            <circle 
                                cx="40" cy="20" r="14" 
                                fill={`url(#bulbGradient-${component.id})`} 
                                stroke="rgba(255, 255, 255, 0.6)" 
                                strokeWidth="2"
                                style={bulbGlow ? { animation: 'bulb-glow 2s ease-in-out infinite' } : {}}
                            />
                            
                            {/* Inner glow effect */}
                            {bulbGlow && (
                                <circle cx="40" cy="20" r="18" fill={`url(#bulbGlowRadial-${component.id})`} />
                            )}
                            
                            {/* Filament pattern */}
                            <path 
                                d="M 32 20 Q 36 16 40 20 Q 44 24 48 20" 
                                stroke={isBusted ? "#6B7280" : bulbGlow ? "#FED7AA" : "rgba(255, 255, 255, 0.6)"} 
                                strokeWidth="2" 
                                fill="none"
                                strokeLinecap="round"
                            />
                            <path 
                                d="M 32 22 Q 36 18 40 22 Q 44 26 48 22" 
                                stroke={isBusted ? "#6B7280" : bulbGlow ? "#FED7AA" : "rgba(255, 255, 255, 0.6)"} 
                                strokeWidth="1.5" 
                                fill="none"
                                strokeLinecap="round"
                            />
                            
                            {/* Resistance value display below component */}
                            <rect x="25" y="45" width="30" height="10" rx="5" fill="rgba(0, 0, 0, 0.6)" />
                            <text x="40" y="51" fill="white" fontSize="8" textAnchor="middle" fontWeight="bold">
                                {component.resistance.toFixed(1)}Ω
                            </text>
                            
                            {/* Current intensity indicator */}
                            {hasCurrentFlow && (
                                <text x="40" y="60" fill="#FBBF24" fontSize="7" textAnchor="middle" fontWeight="bold">
                                    {(Math.abs(component.current) * 100).toFixed(0)}%
                                </text>
                            )}
                            
                            {/* Terminal symbols */}
                            <text x="65" y="22" fill="white" fontSize="14" textAnchor="middle" dominantBaseline="middle" fontWeight="bold">+</text>
                            <text x="15" y="22" fill="white" fontSize="14" textAnchor="middle" dominantBaseline="middle" fontWeight="bold">−</text>
                            
                            {/* Current flow indicator */}
                            {hasCurrentFlow && (
                                <rect x="10" y="32" width="60" height="2" rx="1" fill="#FDE047">
                                    <animate attributeName="opacity" values="0.3;1;0.3" dur="1.5s" repeatCount="indefinite" />
                                </rect>
                            )}
                </>
            )}
                    
            {component.type === 'switch' && (
                    <>
                        {/* Switch track/housing */}
                        <rect 
                            x="10" y="10" width="60" height="20" rx="10" 
                            fill={`url(#switchGradient-${component.id})`}
                        />
                        
                        {/* "OFF" and "ON" labels inside track */}
                        <text x="25" y="25" fontSize="8" fill="rgba(255,255,255,0.4)" textAnchor="middle" fontWeight="bold">O</text>
                        <text x="55" y="25" fontSize="8" fill="rgba(255,255,255,0.9)" textAnchor="middle" fontWeight="bold">I</text>

                        {/* Sliding knob */}
                        <g transform={`translate(${component.isOn ? 30 : 0}, 0)`} style={{ transition: 'transform 0.3s cubic-bezier(0.68, -0.55, 0.27, 1.55)' }}>
                            <rect 
                                x="12" y="12" 
                                width="26" height="16" 
                                rx="8" 
                                fill="rgba(255, 255, 255, 0.8)"
                                stroke="rgba(0,0,0,0.1)"
                                strokeWidth="0.5"
                                style={{
                                    filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.2))'
                                }}
                            />
                             <line x1="21" y1="17" x2="21" y2="23" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round"/>
                             <line x1="29" y1="17" x2="29" y2="23" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round"/>
                        </g>

                        {/* Status text below */}
                        <text x="40" y="38" fill="white" fontSize="7" textAnchor="middle" fontWeight="bold" opacity={component.isOn ? 1 : 0.5}>
                            {component.isOn ? "ON" : "OFF"}
                        </text>
                        
                        {/* Current flow indicator */}
                        {hasCurrentFlow && !isBusted && (
                            <rect x="10" y="32" width="60" height="2" rx="1" fill="#A855F7">
                                <animate attributeName="opacity" values="0.3;1;0.3" dur="1.5s" repeatCount="indefinite" />
                            </rect>
                )}
                    </>
                )}
                    
            {component.type === 'resistor' && (
                <>
                            {/* Resistor body with ceramic texture */}
                            <rect x="15" y="12" width="50" height="16" rx="8" fill={`url(#resistorGradient-${component.id})`} />
                            
                            {/* Color bands for resistance value */}
                            <rect x="22" y="14" width="3" height="12" fill="#8B4513" />
                            <rect x="27" y="14" width="3" height="12" fill="#FF0000" />
                            <rect x="32" y="14" width="3" height="12" fill="#000000" />
                            <rect x="52" y="14" width="3" height="12" fill="#FFD700" />
                            
                            {/* Busted Resistor Effect: crack */}
                            {isBusted && (
                                <path d="M 30 14 L 35 26 L 40 18 L 45 24 L 50 16" stroke="#111827" strokeWidth="1.5" fill="none" />
                            )}
                            
                            {/* Heat dissipation effect when current flows */}
                            {hasCurrentFlow && !isBusted && (
                                <rect x="15" y="12" width="50" height="16" rx="8" fill="none" stroke="#FF6B35" strokeWidth="1" opacity="0.7">
                                    <animate attributeName="stroke-width" values="1;2;1" dur="2s" repeatCount="indefinite" />
                                </rect>
                            )}
                            
                            {/* Resistance value display */}
                            <rect x="25" y="32" width="30" height="10" rx="5" fill="rgba(0, 0, 0, 0.6)" />
                            <text x="40" y="38" fill="white" fontSize="8" textAnchor="middle" fontWeight="bold">
                        {component.resistance.toFixed(1)}Ω
                    </text>
                            
                            {/* Power dissipation indicator */}
                            {hasCurrentFlow && (
                                <text x="40" y="46" fill="#FF6B35" fontSize="6" textAnchor="middle" fontWeight="bold">
                                    {(Math.pow(Math.abs(component.current), 2) * component.resistance).toFixed(2)}W
                                </text>
                            )}
                </>
            )}

                    {/* Enhanced connection lines */}
                    <line 
                        x1="0" y1="20" x2="6" y2="20" 
                        stroke={hasCurrentFlow && !isBusted ? "#3B82F6" : "rgba(255, 255, 255, 0.6)"} 
                        strokeWidth={hasCurrentFlow && !isBusted ? "4" : "3"} 
                        strokeLinecap="round"
                        className={hasCurrentFlow && !isBusted ? "wire-glow" : ""}
                    />
                    <line 
                        x1="74" y1="20" x2="80" y2="20" 
                        stroke={hasCurrentFlow && !isBusted ? "#3B82F6" : "rgba(255, 255, 255, 0.6)"} 
                        strokeWidth={hasCurrentFlow && !isBusted ? "4" : "3"} 
                        strokeLinecap="round"
                        className={hasCurrentFlow && !isBusted ? "wire-glow" : ""}
                    />
        </svg>
        </div>
    );
});


//-///////////////////////////////////////////////////////////////////////////
// MAIN APP COMPONENT
//-///////////////////////////////////////////////////////////////////////////

const CircuitSimulator: React.FC = () => {
    const [components, setComponents] = useState<CircuitComponentData[]>([]);
    const [connections, setConnections] = useState<Connection[]>([]);
    const [draggingComponentId, setDraggingComponentId] = useState<string | null>(null);
    const [dragOffset, setDragOffset] = useState<Position>({ x: 0, y: 0 });
    const [connectingFrom, setConnectingFrom] = useState<Endpoint | null>(null);
    const [isInfoVisible, setIsInfoVisible] = useState(false);
    const [isEraserActive, setIsEraserActive] = useState(false);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [bottomSheetHeight, setBottomSheetHeight] = useState(80);
    const [isDraggingSheet, setIsDraggingSheet] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [failureInfo, setFailureInfo] = useState<{ title: string; message: string } | null>(null);
    const [hasShownFailureModal, setHasShownFailureModal] = useState(false);
    const [draggingComponentType, setDraggingComponentType] = useState<ComponentType | null>(null);
    const [dragPreviewPosition, setDragPreviewPosition] = useState<Position | null>(null);
    const [isDraggingFromTray, setIsDraggingFromTray] = useState(false);
    const [isInstructionsVisible, setIsInstructionsVisible] = useState(false);
    const [showLandingPage, setShowLandingPage] = useState(true);

    useEffect(() => {
        if (!isEraserActive) return;

        const handleMouseMove = (e: MouseEvent) => {
            setMousePos({ x: e.clientX, y: e.clientY });
        };

        window.addEventListener('mousemove', handleMouseMove);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, [isEraserActive]);

    // Handle mobile drag preview movement
    useEffect(() => {
        if (!isDraggingFromTray) return;

        const handleTouchMove = (e: TouchEvent) => {
            e.preventDefault();
            const touch = e.touches[0];
            setDragPreviewPosition({ x: touch.clientX, y: touch.clientY });
        };

        const handleTouchEnd = (e: TouchEvent) => {
            if (draggingComponentType && e.changedTouches.length > 0) {
                const touch = e.changedTouches[0];
                const canvasElement = document.getElementById('circuit-bench');
                
                if (canvasElement) {
                    const benchRect = canvasElement.getBoundingClientRect();
                    const dropX = touch.clientX - benchRect.left;
                    const dropY = touch.clientY - benchRect.top;

                    // Check if the drop is within the canvas bounds
                    if (dropX >= 0 && dropX <= benchRect.width && dropY >= 0 && dropY <= benchRect.height) {
                        const id = generateId();
                        let newComponent: CircuitComponentData;

                        if (draggingComponentType === 'battery') {
                            newComponent = { id, type: 'battery', position: { x: Math.max(0, dropX - 40), y: Math.max(0, dropY - 20) }, voltage: DEFAULT_VOLTAGE, resistance: 1.0, current: 0, maxCurrent: MAX_CURRENT.BATTERY };
                        } else if (draggingComponentType === 'bulb') {
                            newComponent = { id, type: 'bulb', position: { x: Math.max(0, dropX - 40), y: Math.max(0, dropY - 20) }, resistance: DEFAULT_BULB_RESISTANCE, current: 0, maxCurrent: MAX_CURRENT.BULB };
                        } else if (draggingComponentType === 'switch') {
                            newComponent = { id, type: 'switch', position: { x: Math.max(0, dropX - 40), y: Math.max(0, dropY - 20) }, isOn: false, resistance: DEFAULT_SWITCH_RESISTANCE_OFF, current: 0, maxCurrent: MAX_CURRENT.SWITCH };
                        } else if (draggingComponentType === 'resistor') {
                            newComponent = { id, type: 'resistor', position: { x: Math.max(0, dropX - 40), y: Math.max(0, dropY - 20) }, resistance: 20, current: 0, maxCurrent: MAX_CURRENT.RESISTOR };
                        }

                        setComponents(prev => [...prev, newComponent]);
                    }
                }
            }

            setIsDraggingFromTray(false);
            setDraggingComponentType(null);
            setDragPreviewPosition(null);
        };

        document.addEventListener('touchmove', handleTouchMove, { passive: false });
        document.addEventListener('touchend', handleTouchEnd);

        return () => {
            document.removeEventListener('touchmove', handleTouchMove);
            document.removeEventListener('touchend', handleTouchEnd);
        };
    }, [isDraggingFromTray, draggingComponentType]);

    // Mobile detection and responsive handling
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 1024);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);

        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Prevent body scroll when modals are open
    useEffect(() => {
        const isAnyModalOpen = isInfoVisible || isInstructionsVisible;
        
        if (isAnyModalOpen) {
            // Store the current scroll position
            const scrollY = window.scrollY;
            document.body.style.position = 'fixed';
            document.body.style.top = `-${scrollY}px`;
            document.body.style.width = '100%';
        } else {
            // Restore scroll position
            const scrollY = document.body.style.top;
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.width = '';
            if (scrollY) {
                window.scrollTo(0, parseInt(scrollY || '0') * -1);
            }
        }

        return () => {
            // Cleanup on unmount
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.width = '';
        };
    }, [isInfoVisible, isInstructionsVisible]);

    // Bottom sheet drag handling
    const handleBottomSheetDrag = useCallback((e: React.TouchEvent | React.MouseEvent) => {
        if (!isDraggingSheet) return;

        const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
        const windowHeight = window.innerHeight;
        const newHeight = Math.max(70, Math.min(300, windowHeight - clientY));
        
        setBottomSheetHeight(newHeight);
    }, [isDraggingSheet]);

    const handleBottomSheetDragStart = (e: React.TouchEvent | React.MouseEvent) => {
        setIsDraggingSheet(true);
        e.preventDefault();
    };

    const handleBottomSheetDragEnd = () => {
        setIsDraggingSheet(false);
        // Snap to closest position
        if (bottomSheetHeight < 150) {
            setBottomSheetHeight(80);
        } else {
            setBottomSheetHeight(250);
        }
    };

    // --- Physics Engine ---
    useEffect(() => {
        const newComponents: CircuitComponentData[] = components.map(c => ({
            ...c,
            position: { ...c.position }
        }));

        let detectedFailure: { title: string; message: string } | null = null;

        newComponents.forEach((c) => {
            c.isBusted = false;
            c.bustReason = undefined;
            c.current = 0;
            if (c.type === 'switch') {
                c.resistance = c.isOn ? DEFAULT_SWITCH_RESISTANCE_ON : DEFAULT_SWITCH_RESISTANCE_OFF;
            }
        });

        const componentMap = new Map(newComponents.map((c: CircuitComponentData) => [c.id, c]));
        const processedNetworks: Set<string> = new Set();

        for (const conn of connections) {
            if (conn.from.componentId === conn.to.componentId) {
                const component = componentMap.get(conn.from.componentId);
                if (component && component.type === 'battery' && !detectedFailure) {
                    detectedFailure = {
                        title: "Short Circuit!",
                        message: "A battery's terminals are directly connected to each other, creating a dangerous short circuit."
                    };
                    component.isBusted = true;
                    component.bustReason = 'short-circuit';
                }
            }
        }
        
        for (const component of newComponents) {
            if (processedNetworks.has(component.id) || detectedFailure) continue;

            const networkIds = new Set<string>();
            const queue = [component.id];
            const visitedInNetwork = new Set([component.id]);
            networkIds.add(component.id);
            while (queue.length > 0) {
                const currentId = queue.shift()!;
                connections.forEach(conn => {
                    let neighborId: string | null = null;
                    if (conn.from.componentId === currentId) neighborId = conn.to.componentId;
                    else if (conn.to.componentId === currentId) neighborId = conn.from.componentId;

                    if (neighborId && !visitedInNetwork.has(neighborId)) {
                        visitedInNetwork.add(neighborId);
                        networkIds.add(neighborId);
                        queue.push(neighborId);
                    }
                });
            }
            networkIds.forEach(id => processedNetworks.add(id));
            const networkComponents = Array.from(networkIds).map(id => componentMap.get(id)).filter(Boolean) as CircuitComponentData[];
            const networkBatteries = networkComponents.filter(c => c.type === 'battery') as Battery[];
            
            if (networkBatteries.length === 0) continue;

            const primaryBattery = networkBatteries[0];
            let isCircuitClosed = false;
            const activePath = new Set<string>();

            const terminal1Conns = connections.filter(c => (c.from.componentId === primaryBattery.id && c.from.endpointIndex === 1) || (c.to.componentId === primaryBattery.id && c.to.endpointIndex === 1));
            const terminal0Conns = connections.filter(c => (c.from.componentId === primaryBattery.id && c.from.endpointIndex === 0) || (c.to.componentId === primaryBattery.id && c.to.endpointIndex === 0));

            if (terminal1Conns.length > 0 && terminal0Conns.length > 0) {
                const startNodeId = terminal1Conns[0].from.componentId === primaryBattery.id ? terminal1Conns[0].to.componentId : terminal1Conns[0].from.componentId;
                const pathQueue: string[] = [startNodeId];
                const parentMap = new Map<string, string | null>([[startNodeId, primaryBattery.id]]);
                let endNodeId: string | null = null;
                while (pathQueue.length > 0) {
                    const currentId = pathQueue.shift()!;
                    if (terminal0Conns.some(c => c.from.componentId === currentId || c.to.componentId === currentId)) {
                        isCircuitClosed = true;
                        endNodeId = currentId;
                        break;
                    }
                    connections.forEach(conn => {
                        let neighborId: string | null = null;
                        if (conn.from.componentId === currentId) neighborId = conn.to.componentId;
                        else if (conn.to.componentId === currentId) neighborId = conn.from.componentId;
                        if (neighborId && !parentMap.has(neighborId)) {
                            parentMap.set(neighborId, currentId);
                            pathQueue.push(neighborId);
                        }
                    });
                }
                if (isCircuitClosed && endNodeId) {
                    activePath.add(primaryBattery.id);
                    let currentNode: string | null = endNodeId;
                    while (currentNode && currentNode !== primaryBattery.id) {
                        activePath.add(currentNode);
                        currentNode = parentMap.get(currentNode) ?? null;
                    }
                }
            }
            
            const activeComponents = networkComponents.filter(c => activePath.has(c.id));
            if (activeComponents.some(c => (c.type === 'switch' && !(c as Switch).isOn) || c.isBusted)) {
                isCircuitClosed = false;
            }
            if (!isCircuitClosed) continue;

            const hasShortCircuitCondition = networkBatteries.length > 1 && networkBatteries.some((b1, i) =>
                networkBatteries.slice(i + 1).some(b2 => connections.some(conn => {
                    const isConnectingB1AndB2 = (conn.from.componentId === b1.id && conn.to.componentId === b2.id) || (conn.to.componentId === b1.id && conn.from.componentId === b2.id);
                    if (!isConnectingB1AndB2) return false;
                    const b1Terminal = conn.from.componentId === b1.id ? conn.from.endpointIndex : conn.to.endpointIndex;
                    const b2Terminal = conn.from.componentId === b2.id ? conn.from.endpointIndex : conn.to.endpointIndex;
                    return b1Terminal === b2Terminal;
                }))
            );

            if (hasShortCircuitCondition) {
                detectedFailure = { title: "Opposing Batteries!", message: "Two or more batteries are connected with conflicting polarity (+ to + or - to -), creating a short circuit." };
                networkComponents.forEach(c => { c.isBusted = true; c.bustReason = 'short-circuit'; });
                continue;
            }
            
            let totalVoltage = 0;
            let totalResistance = 0;
            activeComponents.forEach(comp => {
                    if (comp.type === 'battery') totalVoltage += (comp as Battery).voltage;
                        totalResistance += comp.resistance;
            });

            if (totalResistance < SHORT_CIRCUIT_THRESHOLD) {
                detectedFailure = { title: "Short Circuit!", message: `The circuit has almost no resistance (${totalResistance.toFixed(2)}Ω), causing a massive and unsafe current flow.` };
                activeComponents.forEach(c => { c.isBusted = true; c.bustReason = 'over-current'; });
                continue;
            }

            const current = totalVoltage / totalResistance;

            // Check each component individually against its own max current rating
            let hasOverloadedComponent = false;
            let overloadedComponents: CircuitComponentData[] = [];
            
            activeComponents.forEach(comp => {
                if (current > comp.maxCurrent) {
                    hasOverloadedComponent = true;
                    overloadedComponents.push(comp);
                }
            });

            if (hasOverloadedComponent) {
                const firstFailingComponent = overloadedComponents[0];
                detectedFailure = {
                    title: "Component Overloaded!",
                    message: `The current of ${current.toFixed(2)}A exceeds the safe limit of ${firstFailingComponent.maxCurrent.toFixed(2)}A for the ${firstFailingComponent.type}${overloadedComponents.length > 1 ? ' and other components' : ''}.`
                };
                // Only bust the components that are actually overloaded
                overloadedComponents.forEach(c => { 
                    c.isBusted = true; 
                    c.bustReason = 'over-current'; 
                });
                // Set current to 0 for all components in the circuit since it's broken
                activeComponents.forEach(c => { c.current = 0; });
            } else {
                 // ... (current direction logic is the same)
                const flowDirections = new Map<string, number>();
                const traversalQueue: Array<{ componentId: string; entryEndpoint: 0 | 1 }> = [];
                const visitedInTraversal = new Set<string>();
                flowDirections.set(primaryBattery.id, 1);
                visitedInTraversal.add(primaryBattery.id);
                const positiveTerminalConnections = connections.filter(c => activePath.has(c.from.componentId) && activePath.has(c.to.componentId) && ((c.from.componentId === primaryBattery.id && c.from.endpointIndex === 1) || (c.to.componentId === primaryBattery.id && c.to.endpointIndex === 1)));
                for (const conn of positiveTerminalConnections) {
                    const nextComponentId = conn.from.componentId === primaryBattery.id ? conn.to.componentId : conn.from.componentId;
                    const entryEndpoint = conn.from.componentId === primaryBattery.id ? conn.to.endpointIndex : conn.from.endpointIndex;
                    if (!visitedInTraversal.has(nextComponentId)) {
                        traversalQueue.push({ componentId: nextComponentId, entryEndpoint });
                        visitedInTraversal.add(nextComponentId);
                    }
                }
                while (traversalQueue.length > 0) {
                    const { componentId, entryEndpoint } = traversalQueue.shift()!;
                    const flowGoesOutAt = (1 - entryEndpoint) as 0 | 1;
                    flowDirections.set(componentId, entryEndpoint === 0 ? 1 : -1);
                    const outboundConnections = connections.filter(c => activePath.has(c.from.componentId) && activePath.has(c.to.componentId) && ((c.from.componentId === componentId && c.from.endpointIndex === flowGoesOutAt) || (c.to.componentId === componentId && c.to.endpointIndex === flowGoesOutAt)));
                    for (const conn of outboundConnections) {
                        const nextComponentId = conn.from.componentId === componentId ? conn.to.componentId : conn.from.componentId;
                        const nextEntryEndpoint = conn.from.componentId === componentId ? conn.to.endpointIndex : conn.from.endpointIndex;
                        if (!visitedInTraversal.has(nextComponentId)) {
                            visitedInTraversal.add(nextComponentId);
                            traversalQueue.push({ componentId: nextComponentId, entryEndpoint: nextEntryEndpoint });
                        }
                    }
                }
                activeComponents.forEach(comp => {
                    const direction = flowDirections.get(comp.id) ?? 0;
                    comp.current = current * direction;
                });
            }
        }

        // Only show failure modal if this is a new failure (not already shown)
        if (detectedFailure && !hasShownFailureModal) {
            setFailureInfo(detectedFailure);
            setHasShownFailureModal(true);
        } else if (!detectedFailure && hasShownFailureModal) {
            // Circuit is working again, reset the modal state for future failures
            setFailureInfo(null);
            setHasShownFailureModal(false);
        }

        if (JSON.stringify(components) !== JSON.stringify(newComponents)) {
            setComponents(newComponents);
        }
        
    }, [connections, components, hasShownFailureModal]);

    useEffect(() => {
        const bench = document.getElementById('circuit-bench');
        if (bench) {
            bench.style.cursor = isEraserActive
                ? 'url("https://cdn-icons-png.flaticon.com/512/1040/1040230.png") 12 12, auto'
                : 'default';
        }
    }, [isEraserActive]);


    // --- Event Handlers ---

    const handleAddComponent = (type: ComponentType) => {
        let newComponent: CircuitComponentData;
        const position = { x: Math.random() * 200 + 50, y: Math.random() * 100 + 80 };
        const id = generateId();

        switch (type) {
            case 'battery':
                newComponent = { id, type, position, voltage: DEFAULT_VOLTAGE, resistance: 1.0, current: 0, maxCurrent: MAX_CURRENT.BATTERY };
                break;
            case 'bulb':
                newComponent = { id, type, position, resistance: DEFAULT_BULB_RESISTANCE, current: 0, maxCurrent: MAX_CURRENT.BULB };
                break;
            case 'switch':
                newComponent = { id, type, position, isOn: false, resistance: DEFAULT_SWITCH_RESISTANCE_OFF, current: 0, maxCurrent: MAX_CURRENT.SWITCH };
                break;
            case 'resistor':
                newComponent = { id, type, position, resistance: DEFAULT_RESISTOR_RESISTANCE_OFF, current: 0, maxCurrent: MAX_CURRENT.RESISTOR };
                break;
        }
        setComponents(prev => [...prev, newComponent]);
    };

    const getEventPosition = (e: React.MouseEvent | React.TouchEvent): Position => {
        if ('touches' in e) {
            return { x: e.touches[0].clientX, y: e.touches[0].clientY };
        }
        return { x: e.clientX, y: e.clientY };
    }

    const handleDragStart = (e: React.MouseEvent | React.TouchEvent, id: string) => {
        const component = components.find(c => c.id === id);
        if (!component) return;

        // Prevent connection logic from firing on drag start
        e.stopPropagation();

        const eventPos = getEventPosition(e);
        const bench = document.getElementById('circuit-bench');
        if (!bench) return;
        const benchRect = bench.getBoundingClientRect();
        if (!benchRect) return;

        setDraggingComponentId(id);
        setDragOffset({
            x: eventPos.x - benchRect.left - component.position.x,
            y: eventPos.y - benchRect.top - component.position.y,
        });
    };

    const handleDrag = useCallback((e: MouseEvent | TouchEvent) => {
        if (!draggingComponentId) return;

        const eventPos = 'touches' in e ? { x: e.touches[0].clientX, y: e.touches[0].clientY } : { x: e.clientX, y: e.clientY };
        const bench = document.getElementById('circuit-bench');
        if (!bench) return;
        const benchRect = bench.getBoundingClientRect();

        let newX = eventPos.x - benchRect.left - dragOffset.x;
        let newY = eventPos.y - benchRect.top - dragOffset.y;

        // Clamp position within the bench
        newX = Math.max(0, Math.min(newX, benchRect.width - COMPONENT_SIZE.width));
        newY = Math.max(0, Math.min(newY, benchRect.height - COMPONENT_SIZE.height));

        setComponents(prev =>
            prev.map(c =>
                c.id === draggingComponentId ? { ...c, position: { x: newX, y: newY } } : c
            )
        );
    }, [draggingComponentId, dragOffset]);

    const handleDragEnd = useCallback(() => {
        setDraggingComponentId(null);
    }, []);

    const handleEndpointClick = (componentId: string, endpointIndex: 0 | 1) => {
        if (connectingFrom) {
            // Avoid connecting to self
            if (connectingFrom.componentId === componentId) {
                setConnectingFrom(null);
                return;
            }

            const newConnection: Connection = {
                id: generateId(),
                from: connectingFrom,
                to: { componentId, endpointIndex },
            };
            setConnections(prev => [...prev, newConnection]);
            setConnectingFrom(null);
        } else {
            setConnectingFrom({ componentId, endpointIndex });
        }
    };

    const handleToggleSwitch = (id: string) => {
        setComponents(prev =>
            prev.map(c => {
                if (c.id === id && c.type === 'switch') {
                    const isOn = !c.isOn;
                    return { ...c, isOn, resistance: isOn ? DEFAULT_SWITCH_RESISTANCE_ON : DEFAULT_SWITCH_RESISTANCE_OFF };
                }
                return c;
            })
        );
    };

    const handleReset = () => {
        setComponents([]);
        setConnections([]);
        setConnectingFrom(null);
        setFailureInfo(null);
        setHasShownFailureModal(false);
    };

    // Add/remove global drag listeners
    useEffect(() => {
        window.addEventListener('mousemove', handleDrag);
        window.addEventListener('touchmove', handleDrag);
        window.addEventListener('mouseup', handleDragEnd);
        window.addEventListener('touchend', handleDragEnd);

        return () => {
            window.removeEventListener('mousemove', handleDrag);
            window.removeEventListener('touchmove', handleDrag);
            window.removeEventListener('mouseup', handleDragEnd);
            window.removeEventListener('touchend', handleDragEnd);
        };
    }, [handleDrag, handleDragEnd]);

    // Memoize wire calculations
    const wireData = useMemo(() => {
        const componentMap = new Map(components.map(c => [c.id, c]));
        return connections.map(conn => {
            const fromComponent = componentMap.get(conn.from.componentId);
            const toComponent = componentMap.get(conn.to.componentId);

            if (!fromComponent || !toComponent) return null;

            let p1 = getEndpointPosition(fromComponent, conn.from.endpointIndex);
            let p2 = getEndpointPosition(toComponent, conn.to.endpointIndex);
            
            // Current is positive for 0->1 flow, negative for 1->0 flow.
            // Check if current is flowing OUT of the `fromComponent` at the connection point.
            const isFlowOutOfFromComponent =
              (fromComponent.current > 0 && conn.from.endpointIndex === 1) || // Normal flow out of terminal 1
              (fromComponent.current < 0 && conn.from.endpointIndex === 0);   // Reversed flow out of terminal 0

            // If flow is not coming out of the `from` component, it must be coming out of the `to` component.
            // We flip p1 and p2 to ensure the animation direction is always correct.
            if (!isFlowOutOfFromComponent) {
                [p1, p2] = [p2, p1];
            }

            // A wire has current only if BOTH components it connects to have current.
            const hasCurrent = fromComponent.current !== 0 && toComponent.current !== 0;
            const isHighCurrent = hasCurrent && Math.abs(fromComponent.current) > HIGH_CURRENT_THRESHOLD;
            const isShorted = fromComponent.bustReason === 'short-circuit' && toComponent.bustReason === 'short-circuit';

            return { id: conn.id, p1, p2, hasCurrent, isHighCurrent, isShorted };
        }).filter(w => w !== null);
    }, [connections, components]);


    // --- Render ---

    // Landing Page
    if (showLandingPage) {
    return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white font-sans overflow-hidden">
            <style>{`
                    @keyframes float {
                        0%, 100% { transform: translateY(0px); }
                        50% { transform: translateY(-20px); }
                    }
                    @keyframes glow {
                        0%, 100% { opacity: 1; }
                        50% { opacity: 0.5; }
                    }
                    @keyframes slideUp {
                        from { opacity: 0; transform: translateY(30px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                    @keyframes pulse {
                        0%, 100% { opacity: 1; }
                        50% { opacity: 0.8; }
                    }
                    .animate-float { animation: float 6s ease-in-out infinite; }
                    .animate-glow { animation: glow 2s ease-in-out infinite; }
                    .animate-slide-up { animation: slideUp 0.8s ease-out forwards; }
                    .animate-pulse-slow { animation: pulse 3s ease-in-out infinite; }
                    .glass-morphism-landing {
                        background: rgba(255, 255, 255, 0.1);
                        backdrop-filter: blur(20px);
                        border: 1px solid rgba(255, 255, 255, 0.2);
        }
      `}</style>

                {/* Background Pattern */}
                <div className="fixed inset-0 opacity-20">
                    <div className="absolute inset-0" style={{
                        backgroundImage: 'radial-gradient(rgba(59, 130, 246, 0.3) 1px, transparent 1px)',
                        backgroundSize: '50px 50px'
                    }} />
                </div>

                {/* Header */}
                <header className="relative z-50 glass-morphism-landing px-4 py-4 md:px-6 md:py-5">
                    <div className="max-w-7xl mx-auto flex justify-between items-center">
                        {/* Logo and Brand */}
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                                <FaBolt className="text-white text-lg" />
                            </div>
                            <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                                Circuit Lab Pro
                            </span>
                        </div>
                        
                        {/* Navigation */}
                        <nav className="hidden md:flex items-center gap-6">
                            <a href="#features" className="text-blue-200 hover:text-white transition-colors cursor-pointer">Features</a>
                            <a href="#demo" className="text-blue-200 hover:text-white transition-colors cursor-pointer">Demo</a>
                    <button
                                onClick={() => setShowLandingPage(false)}
                                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg font-medium hover:from-blue-600 hover:to-indigo-700 transition-all duration-300"
                            >
                                Launch App
                            </button>
                        </nav>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setShowLandingPage(false)}
                            className="md:hidden px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg font-medium text-sm"
                        >
                            Launch
                        </button>
                    </div>
                </header>
                
                {/* Main Content */}
                <div className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-200px)] px-4 py-8">
                    {/* Logo and Title */}
                    <div className="text-center mb-12 animate-slide-up">
                        <div className="flex items-center justify-center gap-4 mb-6">
                            <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center animate-float shadow-2xl">
                                <FaBolt className="text-white text-2xl md:text-3xl animate-glow" />
                            </div>
                            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
                                Circuit Lab Pro
                            </h1>
                        </div>
                        <p className="text-lg md:text-xl text-blue-200 max-w-3xl mx-auto leading-relaxed">
                            Build, simulate, and learn with the most advanced circuit simulator. 
                            Experience realistic physics, beautiful visuals, and intuitive design.
                        </p>
                    </div>

                    {/* Feature Cards */}
                    <div id="features" className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-12 animate-slide-up" style={{animationDelay: '0.2s'}}>
                        <div className="glass-morphism-landing rounded-2xl p-6 text-center hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
                            <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                                <FaBolt className="text-white text-xl" />
                            </div>
                            <h3 className="text-xl font-semibold mb-3 text-blue-100">Realistic Physics</h3>
                            <p className="text-blue-300 text-sm leading-relaxed">
                                Accurate current flow, component failure simulation, and proper electrical behavior
                            </p>
                        </div>
                        
                        <div className="glass-morphism-landing rounded-2xl p-6 text-center hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
                            <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                                <FaLightbulb className="text-white text-xl" />
                            </div>
                            <h3 className="text-xl font-semibold mb-3 text-blue-100">Interactive Components</h3>
                            <p className="text-blue-300 text-sm leading-relaxed">
                                Drag-and-drop components, visual feedback, and real-time circuit analysis
                            </p>
                        </div>
                        
                        <div className="glass-morphism-landing rounded-2xl p-6 text-center hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
                            <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-violet-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                                <IoResize className="text-white text-xl" />
                            </div>
                            <h3 className="text-xl font-semibold mb-3 text-blue-100">Cross-Platform</h3>
                            <p className="text-blue-300 text-sm leading-relaxed">
                                Perfect experience on desktop, tablet, and mobile with responsive design
                            </p>
                        </div>
                    </div>

                    {/* CTA Button */}
                    <div className="mb-16 animate-slide-up" style={{animationDelay: '0.4s'}}>
                        <button
                            onClick={() => setShowLandingPage(false)}
                            className="group relative px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl font-semibold text-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
                        >
                            <span className="relative z-10 flex items-center gap-3">
                                Start Building Circuits
                                <FaBolt className="text-xl group-hover:animate-pulse" />
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                        </button>
                    </div>

                    {/* Demo Circuit Preview */}
                    <div id="demo" className="glass-morphism-landing rounded-3xl p-8 max-w-lg mx-auto animate-slide-up" style={{animationDelay: '0.6s'}}>
                        <h3 className="text-center text-lg font-semibold mb-6 text-blue-100">Live Preview</h3>
                        <div className="relative">
                            {/* Mini circuit demonstration */}
                            <div className="flex items-center justify-center space-x-3 md:space-x-4">
                                <div className="w-16 h-8 bg-gradient-to-r from-green-400 to-emerald-500 rounded-lg flex items-center justify-center animate-pulse-slow shadow-lg">
                                    <span className="text-white text-xs font-bold">9V</span>
                                </div>
                                <div className="w-6 md:w-8 h-1 bg-gradient-to-r from-blue-400 to-blue-500 animate-glow rounded-full" />
                                <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center animate-float shadow-lg">
                                    <FaLightbulb className="text-white animate-glow" />
                                </div>
                                <div className="w-6 md:w-8 h-1 bg-gradient-to-r from-blue-400 to-blue-500 animate-glow rounded-full" />
                                <div className="w-12 h-6 bg-gradient-to-r from-purple-400 to-violet-500 rounded-lg flex items-center justify-center shadow-lg">
                                    <span className="text-white text-xs font-bold">ON</span>
                                </div>
                            </div>
                            <div className="text-center mt-6 text-blue-300 text-sm">
                                Complete circuits light up instantly with realistic physics
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <footer className="relative z-50 glass-morphism-landing mt-auto">
                    <div className="max-w-7xl mx-auto px-4 py-4 md:px-6">
                        <div className="flex flex-col md:flex-row justify-between items-center gap-3">
                            <div className="text-blue-400 text-xs">
                                © 2024 Circuit Lab Pro
                            </div>
                            <div className="flex items-center gap-3 text-blue-400 text-xs">
                                <span className="flex items-center gap-1">
                                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                                    Real-time simulation
                                </span>
                                <button
                                    onClick={() => setShowLandingPage(false)}
                                    className="px-3 py-1 bg-gradient-to-r from-blue-500 to-indigo-600 rounded text-xs font-medium hover:from-blue-600 hover:to-indigo-700 transition-all duration-300"
                                >
                                    Launch App
                                </button>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white font-sans select-none">
            <style>{`
                @keyframes current-flow {
                    0% { stroke-dashoffset: 0; }
                    100% { stroke-dashoffset: -20; }
                }
                @keyframes current-pulse {
                    0%, 100% { 
                        stroke-width: 4; 
                        filter: drop-shadow(0 0 8px #3B82F6);
                    }
                    50% { 
                        stroke-width: 6; 
                        filter: drop-shadow(0 0 12px #3B82F6);
                    }
                }
                @keyframes high-current-pulse {
                    0%, 100% {
                        stroke-width: 7px;
                        filter: drop-shadow(0 0 12px #60A5FA);
                    }
                    50% {
                        stroke-width: 9px;
                        filter: drop-shadow(0 0 20px #60A5FA);
                    }
                }
                @keyframes bulb-glow {
                    0%, 100% { 
                        filter: drop-shadow(0 0 15px #FBBF24) brightness(1);
                    }
                    50% { 
                        filter: drop-shadow(0 0 25px #FBBF24) brightness(1.2);
                    }
                }
                @keyframes component-glow {
                    0%, 100% { 
                        filter: drop-shadow(0 0 8px rgba(59, 130, 246, 0.4));
                    }
                    50% { 
                        filter: drop-shadow(0 0 15px rgba(59, 130, 246, 0.7));
                    }
                }
                @keyframes battery-charge {
                    0% { stroke-dasharray: 0 100; }
                    100% { stroke-dasharray: 100 0; }
                }
                .glass-morphism {
                    background: rgba(255, 255, 255, 0.1);
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                }
                .glass-morphism-dark {
                    background: rgba(15, 23, 42, 0.6);
                    backdrop-filter: blur(20px);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                }
                .wire-glow {
                    filter: drop-shadow(0 0 6px #3B82F6) drop-shadow(0 0 12px #1E40AF);
                }
                .endpoint-active {
                    animation: component-glow 2s ease-in-out infinite;
                }
                .scrollbar-hide {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
                @supports (padding: max(0px)) {
                    .mobile-safe-area {
                        padding-bottom: max(1rem, env(safe-area-inset-bottom));
                    }
                }
                @keyframes short-circuit-pulse {
                    0%, 100% {
                        stroke: #ef4444; /* red-500 */
                        stroke-width: 7px;
                        opacity: 1;
                        filter: drop-shadow(0 0 10px #ef4444);
                    }
                    50% {
                        stroke: #f87171; /* red-400 */
                        stroke-width: 9px;
                        opacity: 0.8;
                        filter: drop-shadow(0 0 15px #ef4444);
                    }
                }
                @keyframes short-circuit-text-fade {
                    0% { opacity: 1; transform: scale(1); }
                    80% { opacity: 1; transform: scale(1); }
                    100% { opacity: 0; transform: scale(0.95); }
        }
      `}</style>

            {/* Header */}
            <header className="glass-morphism-dark sticky top-0 z-50 px-4 py-3 sm:px-6 sm:py-4">
                <div className="flex justify-between items-center">
                    {/* Title - Left Side */}
                    <div 
                        className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity duration-200"
                        onClick={() => setShowLandingPage(true)}
                        title="Go to Home"
                    >
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                            <FaBolt className="text-white text-sm" />
                        </div>
                        <h1 className={`${isMobile ? 'text-lg' : 'text-xl sm:text-2xl'} font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent`}>
                            {isMobile ? 'Circuit Lab' : 'Circuit Lab Pro'}
                        </h1>
                    </div>
                    
                    {/* Icons - Right Side */}
                    <div className="flex gap-2">
                    <button
                            className="glass-morphism hover:bg-white/20 transition-all duration-300 rounded-xl p-2.5 flex items-center justify-center"
                        onClick={handleReset}
                            title="Reset Circuit"
                    >
                            <IoRefreshOutline className="text-lg text-white/80 hover:text-white transition-colors" />
                    </button>
                    <button
                            className={`glass-morphism hover:bg-white/20 transition-all duration-300 rounded-xl p-2.5 flex items-center justify-center ${
                                isInfoVisible ? 'bg-blue-500/30 border-blue-400/50' : ''
                            }`}
                        onClick={() => setIsInfoVisible(v => !v)}
                            title={isInfoVisible ? 'Hide Component Info' : 'Show Component Info'}
                        >
                            <IoSettingsOutline className={`text-lg transition-colors ${
                                isInfoVisible ? 'text-blue-300' : 'text-white/80 hover:text-white'
                            }`} />
                        </button>
                        <button
                            className="glass-morphism hover:bg-white/20 transition-all duration-300 rounded-xl p-2.5 flex items-center justify-center"
                            onClick={() => setIsInstructionsVisible(v => !v)}
                            title={isInstructionsVisible ? 'Hide Instructions' : 'Show Instructions'}
                        >
                            <IoInformationCircleOutline className="text-lg text-white/80 hover:text-white transition-colors" />
                    </button>
                    </div>
                </div>
            </header>

            {/* Instructions Modal */}
            {isInstructionsVisible && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                    <div className="glass-morphism-dark rounded-2xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                                How to Use Circuit Lab
                            </h2>
                            <button
                                onClick={() => setIsInstructionsVisible(false)}
                                className="glass-morphism hover:bg-white/20 transition-all duration-300 rounded-lg p-2"
                            >
                                <span className="text-white/80 text-lg">×</span>
                            </button>
                        </div>
                        
                        <div className="space-y-4 text-white/80 text-sm">
                            <div>
                                <h3 className="font-semibold text-blue-300 mb-2">Adding Components</h3>
                                <ul className="space-y-1 pl-4">
                                    <li>• Tap or drag components from the tray to add them</li>
                                    <li>• Available: Battery, Bulb, Switch, Resistor</li>
                                </ul>
                            </div>
                            
                            <div>
                                <h3 className="font-semibold text-blue-300 mb-2">Making Connections</h3>
                                <ul className="space-y-1 pl-4">
                                    <li>• Tap the circular endpoints to connect components</li>
                                    <li>• Tap a wire to remove it</li>
                                    <li>• Create complete circuits for current flow</li>
                                </ul>
                            </div>
                            
                            <div>
                                <h3 className="font-semibold text-blue-300 mb-2">Interactions</h3>
                                <ul className="space-y-1 pl-4">
                                    <li>• Tap switches to toggle ON/OFF</li>
                                    <li>• Drag components to move them</li>
                                    <li>• Use eraser mode to delete components</li>
                                </ul>
                            </div>
                            
                            <div>
                                <h3 className="font-semibold text-blue-300 mb-2">Visual Feedback</h3>
                                <ul className="space-y-1 pl-4">
                                    <li>• Blue glow = current flowing</li>
                                    <li>• Yellow glow = bulb is lit</li>
                                    <li>• Red pulse = short circuit</li>
                                    <li>• "BUSTED" = component overloaded</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex flex-col lg:flex-row min-h-[calc(100vh-88px)]">
                {/* Desktop Sidebar */}
                {!isMobile && (
                <aside className="w-72 p-6 glass-morphism-dark m-4 rounded-2xl">
                    <h3 className="text-center font-bold text-lg mb-4 bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                        Components
                    </h3>
                    
                    {/* Instructions */}
                    <div className="glass-morphism rounded-lg p-3 mb-4 text-xs text-blue-200">
                        <div className="flex items-center gap-2 mb-1">
                            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                            <span>Click endpoints to connect</span>
                        </div>
                        <div className="flex items-center gap-2 mb-1">
                            <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                            <span>Click wires to detach</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                            <span>Click switches to toggle</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
                        {[
                            { type: 'battery', icon: FaBolt, color: 'from-green-400 to-emerald-500' },
                            { type: 'bulb', icon: FaLightbulb, color: 'from-yellow-400 to-orange-500' },
                            { type: 'switch', icon: FaToggleOff, color: 'from-purple-400 to-violet-500' },
                            { type: 'resistor', icon: IoResize, color: 'from-red-400 to-pink-500' }
                        ].map(({ type, icon: Icon, color }, index) => {
                            // Create a proper component object based on type
                            let previewComponent: CircuitComponentData;
                            const baseProps = {
                                id: `p${index + 1}`,
                                position: { x: 0, y: 0 },
                                current: 0,
                                maxCurrent: MAX_CURRENT[type.toUpperCase() as keyof typeof MAX_CURRENT],
                            };

                            switch (type) {
                                case 'battery':
                                    previewComponent = { ...baseProps, type: 'battery', voltage: 9, resistance: 0 };
                                    break;
                                case 'bulb':
                                    previewComponent = { ...baseProps, type: 'bulb', resistance: 10 };
                                    break;
                                case 'switch':
                                    previewComponent = { ...baseProps, type: 'switch', isOn: false, resistance: 1e9 };
                                    break;
                                case 'resistor':
                                    previewComponent = { ...baseProps, type: 'resistor', resistance: 20 };
                                    break;
                                default:
                                    previewComponent = { ...baseProps, type: 'resistor', resistance: 20 };
                            }

                            return (
                        <div
                            key={index}
                                    className="glass-morphism hover:bg-white/20 active:scale-95 transition-all duration-300 rounded-xl p-4 cursor-grab flex flex-col items-center gap-3 group"
                            draggable
                            onDragStart={(e) => {
                                e.dataTransfer.setData("component-type", type);
                            }}
                            onClick={() => handleAddComponent(type as ComponentType)}
                        >
                                    <div className={`w-12 h-12 bg-gradient-to-r ${color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                                        <Icon className="text-white text-lg" />
                                    </div>
                                    <div className="flex flex-col items-center gap-2">
                            <ComponentVisual
                                            component={previewComponent}
                                isSelected={false}
                            />
                                        <span className="text-sm font-medium">
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                                        </span>
                        </div>
                                </div>
                            );
                        })}
                    </div>

                    <button
                        className={`w-full mt-6 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-300 ${
                            isEraserActive 
                                ? 'bg-gradient-to-r from-red-500 to-pink-600 text-white shadow-lg' 
                                : 'glass-morphism hover:bg-white/20'
                        }`}
                        onClick={() => setIsEraserActive(prev => !prev)}
                    >
                        <div className="flex items-center justify-center gap-2">
                            <FaEraser />
                        {isEraserActive ? 'Eraser ON' : 'Eraser OFF'}
                        </div>
                    </button>
                </aside>
                )}

                {/* Circuit Workspace */}
                <main
                    id="circuit-bench"
                    className="flex-1 relative overflow-hidden bg-gradient-to-br from-slate-800/50 to-blue-900/30 m-4 rounded-2xl glass-morphism-dark"
                    style={{
                        marginBottom: isMobile ? `${bottomSheetHeight + 16}px` : '16px',
                        backgroundImage: 'radial-gradient(rgba(59, 130, 246, 0.3) 1px, transparent 1px)',
                        backgroundSize: '20px 20px'
                    }}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                        e.preventDefault();
                        const type = e.dataTransfer.getData("component-type") as ComponentType;
                        if (!type) return;

                        const benchRect = e.currentTarget.getBoundingClientRect();
                        const dropX = e.clientX - benchRect.left;
                        const dropY = e.clientY - benchRect.top;

                        const id = generateId();
                        let newComponent: CircuitComponentData;

                        if (type === 'battery') {
                            newComponent = { id, type, position: { x: dropX, y: dropY }, voltage: DEFAULT_VOLTAGE, resistance: 1.0, current: 0, maxCurrent: MAX_CURRENT.BATTERY };
                        } else if (type === 'bulb') {
                            newComponent = { id, type, position: { x: dropX, y: dropY }, resistance: DEFAULT_BULB_RESISTANCE, current: 0, maxCurrent: MAX_CURRENT.BULB };
                        } else if (type === 'switch') {
                            newComponent = { id, type, position: { x: dropX, y: dropY }, isOn: false, resistance: DEFAULT_SWITCH_RESISTANCE_OFF, current: 0, maxCurrent: MAX_CURRENT.SWITCH };
                        } else if (type === 'resistor') {
                            newComponent = { id, type, position: { x: dropX, y: dropY }, resistance: 20, current: 0, maxCurrent: MAX_CURRENT.RESISTOR };
                        }

                        setComponents(prev => [...prev, newComponent]);
                    }}
                >
                    {components.map(component => (
                        <div
                            key={component.id}
                            style={{
                                position: 'absolute',
                                width: COMPONENT_SIZE.width,
                                height: COMPONENT_SIZE.height,
                                transform: `translate(${component.position.x}px, ${component.position.y}px)`,
                                cursor: draggingComponentId ? 'grabbing' : 'grab',
                                zIndex: draggingComponentId === component.id ? 10 : 1,
                                touchAction: 'none',
                            }}
                            onMouseDown={(e) => handleDragStart(e, component.id)}
                            onTouchStart={(e) => handleDragStart(e, component.id)}
                            onClick={(e) => {
                                e.stopPropagation();

                                if (isEraserActive) {
                                    setConnections(prev => prev.filter(conn =>
                                        conn.from.componentId !== component.id && conn.to.componentId !== component.id
                                    ));
                                    setComponents(prev => prev.filter(c => c.id !== component.id));
                                    return;
                                }

                                if (component.type === 'switch') {
                                    handleToggleSwitch(component.id);
                                }
                            }}
                        >
                            <ComponentVisual 
                                component={component} 
                                isSelected={connectingFrom?.componentId === component.id} 
                            />

                            {/* Endpoints */}
                            {([0, 1] as const).map((i) => {
                                const isActive = connectingFrom?.componentId === component.id && connectingFrom.endpointIndex === i;
                                const hasCurrentFlow = Math.abs(component.current) > 0.01;
                                
                                return (
                                <div
                                    key={i}
                                        className={`absolute w-4 h-4 border-2 rounded-full cursor-crosshair z-10 hover:scale-125 transition-all duration-300 ${
                                            hasCurrentFlow ? 'animate-pulse' : ''
                                        }`}
                                    style={{
                                            top: `calc(50% - 8px)`,
                                        left: i === 0 ? -ENDPOINT_RADIUS : COMPONENT_SIZE.width - ENDPOINT_RADIUS,
                                            backgroundColor: hasCurrentFlow 
                                                ? 'rgba(59, 130, 246, 0.6)' 
                                                : isActive 
                                                    ? 'rgba(59, 130, 246, 0.4)' 
                                                    : 'rgba(255, 255, 255, 0.2)',
                                            borderColor: isActive 
                                                ? '#3B82F6' 
                                                : hasCurrentFlow
                                                    ? '#60A5FA'
                                                    : 'rgba(255, 255, 255, 0.5)',
                                            backdropFilter: 'blur(15px)',
                                            boxShadow: hasCurrentFlow 
                                                ? '0 0 15px rgba(59, 130, 246, 0.8), inset 0 0 10px rgba(96, 165, 250, 0.5)' 
                                                : isActive
                                                    ? '0 0 10px rgba(59, 130, 246, 0.6)'
                                                    : '0 0 5px rgba(255, 255, 255, 0.3)',
                                        }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                            if (isEraserActive) return;
                                        handleEndpointClick(component.id, i);
                                    }}
                                    >
                                        {/* Inner glow for current flow */}
                                        {hasCurrentFlow && (
                                            <div 
                                                className="absolute inset-0 rounded-full bg-blue-400 opacity-50 animate-ping"
                                                style={{ 
                                                    animationDuration: '2s',
                                                    animationDelay: `${i * 0.5}s`
                                                }}
                                />
                                        )}
                                        
                                        {/* Connection indicator */}
                                        {isActive && (
                                            <div className="absolute inset-0 rounded-full border-2 border-blue-400 animate-pulse" />
                                        )}
                                    </div>
                                );
                            })}

                            {/* Info Overlay */}
                            {isInfoVisible && (
                                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 glass-morphism rounded-lg p-3 text-xs whitespace-nowrap pointer-events-auto">
                                    <div className="text-blue-300">ID: {component.id.substring(3, 7)}</div>
                                    <div className="text-green-300">R: {component.resistance > 1e6 ? '∞' : component.resistance.toFixed(1)}Ω</div>
                                    <div className="text-yellow-300">I: {Math.abs(component.current).toFixed(2)}A</div>
                                    {component.type === 'battery' && (
                                        <div className="text-purple-300">V: {component.voltage}V</div>
                                    )}
                                    {component.type === 'resistor' && (
                                        <input
                                            type="number"
                                            min="0.1"
                                            step="0.1"
                                            value={component.resistance}
                                            onClick={e => e.stopPropagation()}
                                            onMouseDown={e => e.stopPropagation()}
                                            onChange={e => {
                                                const newVal = parseFloat(e.target.value);
                                                if (!isNaN(newVal)) {
                                                    setComponents(prev =>
                                                        prev.map(c =>
                                                            c.id === component.id ? { ...c, resistance: newVal } : c
                                                        )
                                                    );
                                                }
                                            }}
                                            className="mt-2 bg-black/30 text-yellow-300 border border-white/20 rounded px-2 py-1 text-xs w-16"
                                        />
                                    )}
                                </div>
                            )}
                        </div>
                    ))}

                    <svg className="absolute top-0 left-0 w-full h-full">
                        <defs style={{ pointerEvents: 'none' }}>
                            <filter id="wireGlow" x="-50%" y="-50%" width="200%" height="200%">
                                <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                                <feMerge>
                                    <feMergeNode in="coloredBlur" />
                                    <feMergeNode in="SourceGraphic" />
                                </feMerge>
                            </filter>
                            <linearGradient id="currentGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#1E40AF" />
                                <stop offset="50%" stopColor="#3B82F6" />
                                <stop offset="100%" stopColor="#60A5FA" />
                            </linearGradient>
                        </defs>
                        {wireData.map(wire => {
                            if (!wire) return null;
                            
                            const distance = Math.sqrt(Math.pow(wire.p2.x - wire.p1.x, 2) + Math.pow(wire.p2.y - wire.p1.y, 2));
                            
                            return (
                            <g
                                key={wire.id}
                                onClick={(e) => {
                                        e.stopPropagation();
                                    e.preventDefault();
                                    console.log('Wire clicked:', wire.id); // Debug log
                                    // Allow direct wire deletion by clicking, or with eraser
                                        setConnections(prev => prev.filter(conn => conn.id !== wire.id));
                                }}
                                style={{ cursor: 'pointer' }}
                                className="hover:opacity-50 transition-opacity duration-200"
                            >
                                    {/* Invisible thick hit area for easier clicking */}
                                    <line
                                        x1={wire.p1.x} y1={wire.p1.y} 
                                        x2={wire.p2.x} y2={wire.p2.y} 
                                        stroke="transparent" 
                                        strokeWidth="20"
                                        strokeLinecap="round"
                                        style={{ cursor: 'pointer' }}
                                    />
                                    
                                    {/* Base wire - always visible */}
                                    <line 
                                        x1={wire.p1.x} y1={wire.p1.y} 
                                        x2={wire.p2.x} y2={wire.p2.y} 
                                        stroke={wire.hasCurrent ? "rgba(59, 130, 246, 0.3)" : "rgba(255, 255, 255, 0.4)"} 
                                        strokeWidth={wire.hasCurrent ? "6" : "3"}
                                        strokeLinecap="round"
                                        style={{ pointerEvents: 'none' }}
                                    />
                                    
                                    {/* Short circuit pulse effect */}
                                    {wire.isShorted && (
                                        <line 
                                            x1={wire.p1.x} y1={wire.p1.y} 
                                            x2={wire.p2.x} y2={wire.p2.y}
                                            stroke="#ef4444"
                                            strokeLinecap="round"
                                            style={{
                                                animation: 'short-circuit-pulse 1s ease-in-out infinite',
                                                pointerEvents: 'none'
                                            }}
                                        />
                                    )}

                                    {/* Enhanced current flow visualization */}
                                {wire.hasCurrent && !wire.isShorted && (
                                        <>
                                            {/* Main current flow line */}
                                    <line
                                                x1={wire.p1.x} y1={wire.p1.y} 
                                                x2={wire.p2.x} y2={wire.p2.y}
                                                stroke="url(#currentGradient)" 
                                                strokeWidth="4" 
                                                strokeLinecap="round"
                                                filter="url(#wireGlow)"
                                                style={{ 
                                                    animation: `${wire.isHighCurrent ? 'high-current-pulse 1.5s' : 'current-pulse 2s'} ease-in-out infinite`,
                                                }}
                                            />
                                            
                                            {/* Animated current particles */}
                                            <line
                                                x1={wire.p1.x} y1={wire.p1.y} 
                                                x2={wire.p2.x} y2={wire.p2.y}
                                                stroke="#60A5FA" 
                                                strokeWidth="2" 
                                                strokeLinecap="round"
                                                strokeDasharray="10 10"
                                                style={{ 
                                                    animation: `current-flow ${wire.isHighCurrent ? '1.2s' : '2s'} linear infinite`,
                                                    filter: 'drop-shadow(0 0 4px #3B82F6)'
                                                }}
                                            />
                                            
                                            {/* Secondary particle stream for consistent effect */}
                                            <line
                                                x1={wire.p1.x} y1={wire.p1.y} 
                                                x2={wire.p2.x} y2={wire.p2.y}
                                                stroke="#93C5FD" 
                                                strokeWidth="1" 
                                                strokeLinecap="round"
                                        strokeDasharray="5 15"
                                                style={{ 
                                                    animation: `current-flow ${wire.isHighCurrent ? '1.2s' : '2s'} linear infinite`,
                                                    opacity: 0.6,
                                                    animationDelay: '0.5s'
                                                }}
                                            />
                                            
                                            {/* Enhanced current direction indicators */}
                                            {distance > 60 && (
                                                <g>
                                                    {/* Multiple enhanced arrowheads along the wire path */}
                                                    {[0.3, 0.6].map((position, index) => {
                                                        const arrowX = wire.p1.x + (wire.p2.x - wire.p1.x) * position;
                                                        const arrowY = wire.p1.y + (wire.p2.y - wire.p1.y) * position;
                                                        const angle = Math.atan2(wire.p2.y - wire.p1.y, wire.p2.x - wire.p1.x) * 180 / Math.PI;
                                                        
                                                        const pulseAnimation = `${wire.isHighCurrent ? 'high-current-pulse 1.5s' : 'current-pulse 2s'} ease-in-out infinite`;

                                                        return (
                                                            <g key={index}>
                                                                {/* Arrow shadow for better visibility */}
                                                                <polygon 
                                                                    points="0,0 14,5 0,10" 
                                                                    fill="#1E40AF" 
                                                                    opacity="0.6"
                                                                    transform={`translate(${arrowX + 1},${arrowY + 1}) rotate(${angle}) translate(-7,-5)`}
                                                                    style={{
                                                                        animation: pulseAnimation,
                                                                        animationDelay: `${index * 0.5}s`
                                                                    }}
                                                                />
                                                                {/* Main arrow */}
                                                                <polygon 
                                                                    points="0,0 14,5 0,10" 
                                                                    fill="#60A5FA" 
                                                                    stroke="#93C5FD"
                                                                    strokeWidth="1"
                                                                    opacity="0.95"
                                                                    transform={`translate(${arrowX},${arrowY}) rotate(${angle}) translate(-7,-5)`}
                                                                    style={{
                                                                        animation: pulseAnimation,
                                                                        animationDelay: `${index * 0.5}s`,
                                                                        filter: 'drop-shadow(0 0 3px #3B82F6)'
                                                                    }}
                                                                />
                                                                {/* Arrow highlight for 3D effect */}
                                                                <polygon 
                                                                    points="0,0 12,4 0,8" 
                                                                    fill="#BFDBFE" 
                                                                    opacity="0.7"
                                                                    transform={`translate(${arrowX},${arrowY}) rotate(${angle}) translate(-6,-4)`}
                                                                    style={{
                                                                        animation: pulseAnimation,
                                                                        animationDelay: `${index * 0.5}s`
                                                                    }}
                                    />
                                                            </g>
                                                        );
                                                    })}
                                                </g>
                                            )}
                                        </>
                                )}
                            </g>
                            );
                        })}
                    </svg>

                    {failureInfo && (
                        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4 rounded-2xl">
                            <div className="glass-morphism-dark rounded-2xl p-6 max-w-sm w-full text-center border-2 border-red-500/50 shadow-2xl shadow-red-900/50">
                                <div className="flex justify-center mb-4">
                                    <div className="w-14 h-14 rounded-full bg-red-500/20 flex items-center justify-center border-2 border-red-500 animate-pulse">
                                        <FaBolt className="text-red-400 text-3xl" />
                                    </div>
                                </div>
                                <h2 className="text-xl font-bold text-red-300 mb-2">{failureInfo.title}</h2>
                                <p className="text-white/80 text-sm mb-6">{failureInfo.message}</p>
                                <button
                                    onClick={() => {
                                        setFailureInfo(null);
                                        setHasShownFailureModal(false);
                                    }}
                                    className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold px-6 py-2 rounded-lg transition-all transform hover:scale-105"
                                >
                                    Got it
                                </button>
                            </div>
                        </div>
                    )}
                </main>

                {/* Mobile Bottom Sheet */}
                {isMobile && (
                    <div 
                        className="fixed bottom-0 left-0 right-0 glass-morphism-dark rounded-t-3xl transition-all duration-300 touch-none z-40 flex flex-col"
                        style={{ height: `${bottomSheetHeight}px` }}
                    >
                        {/* Handle bar area */}
                        <div 
                            className="w-full text-center pt-2 pb-1 flex-shrink-0 cursor-grab active:cursor-grabbing"
                            onTouchStart={handleBottomSheetDragStart}
                            onMouseDown={handleBottomSheetDragStart}
                            onTouchMove={handleBottomSheetDrag}
                            onMouseMove={handleBottomSheetDrag}
                            onTouchEnd={handleBottomSheetDragEnd}
                            onMouseUp={handleBottomSheetDragEnd}
                        >
                            <div className="w-12 h-1.5 bg-white/40 rounded-full inline-block" />
                        </div>
                        
                        {/* Content Area */}
                        <div className={`flex-grow overflow-hidden flex flex-col mobile-safe-area ${bottomSheetHeight > 150 ? 'px-4 pb-4' : 'px-4'}`}>
                            <div className={`h-full flex flex-col ${bottomSheetHeight > 150 ? '' : 'justify-center'}`}>
                                {/* Header (always visible) */}
                                <div className="flex justify-between items-center w-full flex-shrink-0">
                                    <h3 className="font-bold text-lg bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                                        Components
                                    </h3>
                                    <button
                                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-300 ${
                                            isEraserActive 
                                                ? 'bg-gradient-to-r from-red-500 to-pink-600 text-white' 
                                                : 'glass-morphism hover:bg-white/20'
                                        }`}
                                        onClick={() => setIsEraserActive(prev => !prev)}
                                    >
                                        <div className="flex items-center gap-1">
                                            <FaEraser className="text-xs" />
                                            {isEraserActive ? 'ON' : 'OFF'}
                                        </div>
                                    </button>
                                </div>

                                {/* Scrollable Content (only when open) */}
                                {bottomSheetHeight > 150 && (
                                    <div className="flex-grow overflow-y-auto mt-4 scrollbar-hide">
                                        {/* Horizontal scrollable components */}
                                        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                                            {[
                                                { type: 'battery', icon: FaBolt, color: 'from-green-400 to-emerald-500' },
                                                { type: 'bulb', icon: FaLightbulb, color: 'from-yellow-400 to-orange-500' },
                                                { type: 'switch', icon: FaToggleOff, color: 'from-purple-400 to-violet-500' },
                                                { type: 'resistor', icon: IoResize, color: 'from-red-400 to-pink-500' }
                                            ].map(({ type, icon: Icon, color }, index) => {
                                                let previewComponent: CircuitComponentData;
                                                const baseProps = {
                                                    id: `mobile-preview-${index}`,
                                                    position: { x: 0, y: 0 },
                                                    current: 0,
                                                    maxCurrent: MAX_CURRENT[type.toUpperCase() as keyof typeof MAX_CURRENT],
                                                };

                                                switch (type) {
                                                    case 'battery':
                                                        previewComponent = { ...baseProps, type: 'battery', voltage: 9, resistance: 0.1 };
                                                        break;
                                                    case 'bulb':
                                                        previewComponent = { ...baseProps, type: 'bulb', resistance: 10 };
                                                        break;
                                                    case 'switch':
                                                        previewComponent = { ...baseProps, type: 'switch', isOn: false, resistance: 1e9 };
                                                        break;
                                                    case 'resistor':
                                                        previewComponent = { ...baseProps, type: 'resistor', resistance: 20 };
                                                        break;
                                                    default:
                                                        previewComponent = { ...baseProps, type: 'resistor', resistance: 20 };
                                                }

                                                return (
                                                    <div
                                                        key={index}
                                                        className="glass-morphism hover:bg-white/20 active:scale-95 transition-all duration-300 rounded-xl p-3 cursor-grab flex-shrink-0 flex flex-col items-center gap-2 min-w-[100px]"
                                                        draggable
                                                        onDragStart={(e) => {
                                                            e.dataTransfer.setData("component-type", type);
                                                        }}
                                                        onTouchStart={(e) => {
                                                            // Enable mobile drag-and-drop
                                                            const touch = e.touches[0];
                                                            setDraggingComponentType(type as ComponentType);
                                                            setIsDraggingFromTray(true);
                                                            setDragPreviewPosition({ x: touch.clientX, y: touch.clientY });
                                                            e.preventDefault();
                                                        }}
                                                        onClick={() => handleAddComponent(type as ComponentType)}
                                                    >
                                                        <div className={`w-10 h-10 bg-gradient-to-r ${color} rounded-lg flex items-center justify-center`}>
                                                            <Icon className="text-white text-sm" />
                                                        </div>
                                                        <div className="flex flex-col items-center gap-1">
                                                            <div className="scale-75">
                                                                <ComponentVisual
                                                                    component={previewComponent}
                                                                    isSelected={false}
                                                                />
                                                            </div>
                                                            <span className="text-xs font-medium">
                                                                {type.charAt(0).toUpperCase() + type.slice(1)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        {/* Instructions for mobile */}
                                        <div className="glass-morphism rounded-lg p-3 text-xs text-blue-200 mt-2">
                                            <div className="flex items-center gap-2 mb-1">
                                                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                                                <span>Tap components to add • Tap endpoints to connect</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                                                <span>Tap wires to remove • Drag handle to resize</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Eraser Cursor */}
                {isEraserActive && (
                    <div
                        className="fixed pointer-events-none z-[9999] text-2xl text-red-400"
                        style={{
                            top: mousePos.y,
                            left: mousePos.x,
                            transform: 'translate(-50%, -50%)',
                            filter: 'drop-shadow(0 0 8px rgba(239, 68, 68, 0.8))'
                        }}
                    >
                        <FaEraser />
                    </div>
                )}

                {/* Mobile drag preview */}
                {isDraggingFromTray && dragPreviewPosition && draggingComponentType && (
                    <div 
                        className="fixed pointer-events-none z-[9999] opacity-75"
                        style={{
                            left: dragPreviewPosition.x - 40,
                            top: dragPreviewPosition.y - 20,
                            transform: 'scale(0.8)'
                        }}
                    >
                        {(() => {
                            let previewComponent: CircuitComponentData;
                            const baseProps = {
                                id: 'drag-preview',
                                position: { x: 0, y: 0 },
                                current: 0,
                                maxCurrent: MAX_CURRENT[draggingComponentType.toUpperCase() as keyof typeof MAX_CURRENT],
                            };

                            switch (draggingComponentType) {
                                case 'battery':
                                    previewComponent = { ...baseProps, type: 'battery', voltage: 9, resistance: 0.1 };
                                    break;
                                case 'bulb':
                                    previewComponent = { ...baseProps, type: 'bulb', resistance: 10 };
                                    break;
                                case 'switch':
                                    previewComponent = { ...baseProps, type: 'switch', isOn: false, resistance: 1e9 };
                                    break;
                                case 'resistor':
                                    previewComponent = { ...baseProps, type: 'resistor', resistance: 20 };
                                    break;
                                default:
                                    previewComponent = { ...baseProps, type: 'resistor', resistance: 20 };
                            }

                            return <ComponentVisual component={previewComponent} isSelected={false} />;
                        })()}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CircuitSimulator;
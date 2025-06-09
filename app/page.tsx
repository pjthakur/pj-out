"use client";

import { useState, useEffect } from 'react';
import { Activity, AlertCircle, Check, MapPin, Phone, Send, Truck, Users, Clock, RefreshCw, Sun, Moon, List, Eye, Shield } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Inter } from 'next/font/google';
import { motion, AnimatePresence } from 'framer-motion';
import React from 'react';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

type CallType = 'Emergency' | 'Non-Emergency' | 'Information';

type Call = {
  id: number;
  type: CallType;
  location: string;
  description: string;
  time: string;
  status: 'Pending' | 'Acknowledged' | 'Dispatched' | 'Resolved';
  priority?: string;
  unitAssigned?: string;
};

type Unit = {
  id: string;
  type: 'Ambulance' | 'Fire Truck' | 'Police Car';
  status: 'Available' | 'Responding' | 'On Scene' | 'OutOfService';
  location: string;
  crew?: number;
};

type StatItem = {
  name: string;
  value: number;
};

type ActivityLogEntry = {
  timestamp: string;
  description: string;
};

// Toast notification type
type ToastNotification = {
  id: number;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
};

const callData: Call[] = [
  {
    id: 1,
    type: 'Emergency',
    location: 'Central Park',
    description: 'Smoke seen coming from a building',
    time: '11:04:41 PM',
    status: 'Pending',
    priority: 'P4'
  },
  {
    id: 2,
    type: 'Non-Emergency',
    location: '456 Oak Ave, Anytown',
    description: 'Suspicious person loitering',
    time: '11:04:27 PM',
    status: 'Pending',
    priority: 'P1'
  },
  {
    id: 3,
    type: 'Non-Emergency',
    location: '654 Maple Dr, Anytown',
    description: 'Traffic accident, multiple vehicles',
    time: '11:04:11 PM',
    status: 'Pending',
    priority: 'P1'
  },
  {
    id: 4,
    type: 'Emergency',
    location: '654 Maple Dr, Anytown',
    description: 'Loud noise complaint',
    time: '11:04:06 PM',
    status: 'Pending',
    priority: 'P5'
  },
];

const unitData: Unit[] = [
  {
    id: 'P101',
    type: 'Police Car',
    status: 'Available',
    location: 'Station 1',
    crew: 2
  },
  {
    id: 'P102',
    type: 'Police Car',
    status: 'Available',
    location: 'Station 1',
    crew: 2
  },
  {
    id: 'P103',
    type: 'Police Car',
    status: 'Available',
    location: 'Station 2',
    crew: 2
  },
  {
    id: 'F201',
    type: 'Fire Truck',
    status: 'Available',
    location: 'Station 3',
    crew: 4
  },
  {
    id: 'F202',
    type: 'Fire Truck',
    status: 'Responding',
    location: 'En route to Downtown fire incident',
    crew: 4
  },
  {
    id: 'M301',
    type: 'Ambulance',
    status: 'OutOfService',
    location: 'Hospital',
    crew: 2
  },
  {
    id: 'M302',
    type: 'Ambulance',
    status: 'Responding',
    location: 'En route to Highway 101, Mile 15',
    crew: 2
  },
];

const statusColors = {
  Pending: 'bg-red-500',
  Responded: 'bg-yellow-500',
  Resolved: 'bg-green-500',
};

const unitStatusColors = {
  Available: 'bg-gradient-to-r from-emerald-400 to-emerald-500 hover:from-emerald-500 hover:to-emerald-600',
  Responding: 'bg-gradient-to-r from-amber-400 to-amber-500 text-white hover:from-amber-500 hover:to-amber-600',
  'On Scene': 'bg-gradient-to-r from-rose-400 to-rose-500 hover:from-rose-500 hover:to-rose-600',
  OutOfService: 'bg-gradient-to-r from-slate-500 to-slate-600 text-white hover:from-slate-600 hover:to-slate-700'
};

const unitIcons = {
  Ambulance: Truck,
  'Fire Truck': Truck,
  'Police Car': Users,
};

const Home = () => {
  const [calls, setCalls] = useState<Call[]>(callData);
  const [units, setUnits] = useState<Unit[]>(unitData);
  const [selectedCall, setSelectedCall] = useState<Call | null>(null);
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [activeMobileSection, setActiveMobileSection] = useState<'incidents' | 'details' | 'units'>('incidents');
  
  // Toast notifications state
  const [toasts, setToasts] = useState<ToastNotification[]>([]);
  
  // Activity log data
  const [activityLog, setActivityLog] = useState<ActivityLogEntry[]>([
    {
      timestamp: "01:07:30 AM",
      description: "New Police incident reported at 456 Oak Ave, Anytown. Priority: P3"
    },
    {
      timestamp: "01:06:55 AM",
      description: "New Fire incident reported at City Hall. Priority: P5"
    },
    {
      timestamp: "01:05:57 AM",
      description: "New Medical incident reported at 789 Pine Ln, Otherville. Priority: P1"
    }
  ]);

  // Check if we're on mobile
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    // Check on mount
    checkMobile();
    
    // Check on resize
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const addToast = (message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') => {

    const uniqueId = Date.now() + Math.floor(Math.random() * 1000);

    if (!toasts.some(toast => toast.message === message)) {
      setToasts(prev => [...prev, { id: uniqueId, message, type }]);

      setTimeout(() => {
        setToasts(prev => prev.filter(toast => toast.id !== uniqueId));
      }, 3000);
    }
  };

  const addActivityLogEntry = (description: string) => {
    const timestamp = new Date().toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit', 
      hour12: true 
    });
    
    setActivityLog(prev => [
      { timestamp, description },
      ...prev
    ]);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);


    const savedTheme = localStorage.getItem('themeMode');
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark');
    }

    return () => clearInterval(timer);
  }, []);


  useEffect(() => {
    localStorage.setItem('themeMode', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'numeric',
      day: 'numeric',
      year: 'numeric'
    }) + ' ' + date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  };

  const handleCallClick = (call: Call) => {
    setSelectedCall(call);

    const formattedId = call.id.toString().substring(8, 13) || call.id.toString();
    
    addActivityLogEntry(`Incident ${formattedId} details viewed`);
    addToast(`Viewing details for incident ${formattedId}`, 'info');
    
    // Auto-switch to details on mobile when incident is selected
    if (isMobile) {
      setActiveMobileSection('details');
    }
  };

  const handleStatusUpdate = (callId: number, newStatus: 'Pending' | 'Acknowledged' | 'Dispatched' | 'Resolved') => {

    let updatedCall: Call | null = null;
    let assignedUnit: string | null = null;

    // When dispatching, find an available unit of the correct type first
    if (newStatus === 'Dispatched') {
      const callToUpdate = calls.find(c => c.id === callId);
      if (callToUpdate && !callToUpdate.unitAssigned) {
        // Determine required unit type based on incident type
        let requiredUnitType: 'Ambulance' | 'Fire Truck' | 'Police Car';
        
        if (callToUpdate.type === 'Emergency') {
          requiredUnitType = 'Fire Truck'; // Fire incidents need fire trucks
        } else if (callToUpdate.type === 'Non-Emergency') {
          requiredUnitType = 'Police Car'; // Police incidents need police cars
        } else {
          requiredUnitType = 'Ambulance'; // Information/Medical incidents need ambulances
        }
        
        const availableUnit = units.find(unit => 
          unit.status === 'Available' && unit.type === requiredUnitType
        );
        
        if (availableUnit) {
          assignedUnit = availableUnit.id;
          console.log(`Found available ${requiredUnitType}:`, availableUnit.id); // Debug log
        } else {
          console.log(`No available ${requiredUnitType} units found`); // Debug log
        }
      }
    }

    setCalls(calls.map(call => {
      if (call.id === callId) {
        let unitAssigned = call.unitAssigned;
        
        // Assign the unit we found earlier
        if (newStatus === 'Dispatched' && assignedUnit) {
          unitAssigned = assignedUnit;
        }
        
        const updated = { 
          ...call, 
          status: newStatus, 
          unitAssigned: unitAssigned
        };
        updatedCall = updated;
        return updated;
      }
      return call;
    }));

    // Update unit status when dispatched
    if (newStatus === 'Dispatched' && assignedUnit && updatedCall) {
      console.log('Updating unit status for:', assignedUnit); // Debug log
      
      setUnits(prevUnits => {
        console.log('Current units:', prevUnits.map(u => ({ id: u.id, status: u.status }))); // Debug log
        return prevUnits.map(unit => {
          if (unit.id === assignedUnit) {
            console.log('Found unit to update:', unit.id); // Debug log
            return { 
              ...unit, 
              status: 'Responding' as const,
              location: `En route to ${updatedCall!.location}`
            };
          }
          return unit;
        });
      });
      
      addActivityLogEntry(`Unit ${assignedUnit} dispatched to incident`);
      addToast(`Unit ${assignedUnit} dispatched`, 'warning');
    }

    // Update unit status when resolved
    if (newStatus === 'Resolved') {
      const callToResolve = calls.find(c => c.id === callId);
      if (callToResolve && callToResolve.unitAssigned) {
        const unitId = callToResolve.unitAssigned;
        
        setUnits(prevUnits => prevUnits.map(unit => {
          if (unit.id === unitId) {
            return { 
              ...unit, 
              status: 'Available' as const,
              location: unit.id.startsWith('P') ? 'Station 1' : 
                       unit.id.startsWith('F') ? 'Station 3' : 'Hospital'
            };
          }
          return unit;
        }));
        
        addActivityLogEntry(`Unit ${unitId} returned to service`);
        addToast(`Unit ${unitId} available`, 'success');
      }
    }

    if (updatedCall && selectedCall && selectedCall.id === callId) {
      setSelectedCall(updatedCall);
    }

    const formattedId = callId.toString().substring(8, 13) || callId.toString();

    addActivityLogEntry(`Incident ${formattedId} status updated to ${newStatus}`);
    addToast(`Incident ${formattedId} status updated to ${newStatus}`, 
      newStatus === 'Resolved' ? 'success' : 
      newStatus === 'Dispatched' ? 'warning' : 'info'
    );
  };


  const toggleUnitStatus = (unitId: string) => {
    setUnits(units.map(unit => {
      if (unit.id === unitId) {
        const newStatus = unit.status === 'OutOfService' ? 'Available' : 'OutOfService';

        addActivityLogEntry(`Unit ${unitId} status changed to ${newStatus === 'OutOfService' ? 'Out of Service' : newStatus}`);
        addToast(`Unit ${unitId} status changed to ${newStatus === 'OutOfService' ? 'Out of Service' : newStatus}`, 
          newStatus === 'Available' ? 'success' : 'warning'
        );
        
        return { ...unit, status: newStatus };
      }
      return unit;
    }));
  };


  const incidentGenerationSetup = React.useRef(false);

  useEffect(() => {

    if (incidentGenerationSetup.current) return;
    incidentGenerationSetup.current = true;

    setCalls([]);
    
    let incidentTimer: NodeJS.Timeout;

    incidentTimer = setInterval(() => {
      setCalls(prevCalls => {

        if (prevCalls.length >= 6) {
          return prevCalls;
        }

        const newIncident = generateMockIncident();

        const formattedId = newIncident.id.toString().substring(8, 13) || newIncident.id.toString();

        const logMessage = `New ${newIncident.type} incident reported at ${newIncident.location}. Priority: ${newIncident.priority}`;

        addActivityLogEntry(logMessage);

        return [...prevCalls, newIncident];
      });
    }, 5000);

    return () => {
      if (incidentTimer) {
        clearInterval(incidentTimer);
      }
    };
  }, []); // Empty dependency array ensures this runs only once

  // Generate a mock incident with random data
  const generateMockIncident = () => {
    const mockLocations = [
      "123 Main St, Cityville", 
      "456 Oak Ave, Townsburg", 
      "789 Pine Dr, Villageton",
      "101 Maple Rd, Downtown",
      "202 Cedar Ln, Uptown"
    ];
    
    const mockDescriptions = [
      "Traffic accident with injuries",
      "Building fire reported",
      "Medical emergency",
      "Suspicious activity",
      "Domestic disturbance"
    ];
    
    const incidentTypes: CallType[] = ["Emergency", "Non-Emergency", "Information"];
    const priorities = ["P1", "P2", "P3", "P4", "P5"];
    
    return {
      id: Date.now(),
      type: incidentTypes[Math.floor(Math.random() * incidentTypes.length)],
      location: mockLocations[Math.floor(Math.random() * mockLocations.length)],
      description: mockDescriptions[Math.floor(Math.random() * mockDescriptions.length)],
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }),
      status: 'Pending' as const,
      priority: priorities[Math.floor(Math.random() * priorities.length)]
    };
  };

  const renderIncidentDetails = () => {
    if (!selectedCall)     return (
      <div className="p-4">
        <div className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-sm font-light text-center py-12`}>Select an incident to view details</div>
      </div>
    );

    // Base64 encoded simple street map pattern
    const streetMapBase64 = `data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8IS0tIEJhY2tncm91bmQgLS0+CiAgPHJlY3Qgd2lkdGg9IjgwMCIgaGVpZ2h0PSI0MDAiIGZpbGw9IiNlNmU2ZTYiLz4KCiAgPCEtLSBSb2FkcyAtLT4KICA8cGF0aCBkPSJNMCwyMDAgSDgwMCIgc3Ryb2tlPSIjZmZiZjAwIiBzdHJva2Utd2lkdGg9IjEwIi8+CiAgPHBhdGggZD0iTTAsMTAwIEg4MDAiIHN0cm9rZT0iI2ZmYmYwMCIgc3Ryb2tlLXdpZHRoPSI4Ii8+CiAgPHBhdGggZD0iTTAsMyBIODAwIiBzdHJva2U9IiNmZmJmMDAiIHN0cm9rZS13aWR0aD0iNiIvPgogIDxwYXRoIGQ9Ik0wLDMwMCBIODAwIiBzdHJva2U9IiNmZmJmMDAiIHN0cm9rZS13aWR0aD0iOCIvPgogIDxwYXRoIGQ9Ik0wLDM5NSBIODA1IiBzdHJva2U9IiNmZmJmMDAiIHN0cm9rZS13aWR0aD0iNiIvPgogIAogIDxwYXRoIGQ9Ik0yMDAsMCBWNDAwIiBzdHJva2U9IiNmZmJmMDAiIHN0cm9rZS13aWR0aD0iOCIvPgogIDxwYXRoIGQ9Ik00MDAsMCBWNDAwIiBzdHJva2U9IiNmZmJmMDAiIHN0cm9rZS13aWR0aD0iMTAiLz4KICA8cGF0aCBkPSJNNjAwLDAgVjQwMCIgc3Ryb2tlPSIjZmZiZjAwIiBzdHJva2Utd2lkdGg9IjgiLz4KCiAgPCEtLSBSaXZlciAtLT4KICA8cGF0aCBkPSJNMCwzNTAgUTIwMCwzMDAgNDAwLDM1MCBUODAwLDMyMCIgc3Ryb2tlPSIjNTZjY2YyIiBzdHJva2Utd2lkdGg9IjIwIiBmaWxsPSJub25lIi8+CgogIDwhLS0gUGFya3MgLS0+CiAgPGNpcmNsZSBjeD0iMTAwIiBjeT0iMTAwIiByPSI0MCIgZmlsbD0iIzg1ZDQ3NSIvPgogIDxjaXJjbGUgY3g9IjUwMCIgY3k9IjgwIiByPSIzMCIgZmlsbD0iIzg1ZDQ3NSIvPgogIDxjaXJjbGUgY3g9IjcwMCIgY3k9IjE1MCIgcj0iNTAiIGZpbGw9IiM4NWQ0NzUiLz4KICA8cmVjdCB4PSI2NTAiIHk9IjI1MCIgd2lkdGg9IjEwMCIgaGVpZ2h0PSI5MCIgZmlsbD0iIzg1ZDQ3NSIvPgogIAogIDwhLS0gQnVpbGRpbmcgQmxvY2tzIC0tPgogIDxyZWN0IHg9IjMwIiB5PSIxNDAiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgZmlsbD0iI2QwZDBkMCIgc3Ryb2tlPSIjYmJiYmJiIiBzdHJva2Utd2lkdGg9IjEiLz4KICA8cmVjdCB4PSI4MCIgeT0iMTQwIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIGZpbGw9IiNkMGQwZDAiIHN0cm9rZT0iI2JiYmJiYiIgc3Ryb2tlLXdpZHRoPSIxIi8+CiAgPHJlY3QgeD0iMzAiIHk9IjE5MCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjZDBkMGQwIiBzdHJva2U9IiNiYmJiYmIiIHN0cm9rZS13aWR0aD0iMSIvPgogIDxyZWN0IHg9IjgwIiB5PSIxOTAiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgZmlsbD0iI2QwZDBkMCIgc3Ryb2tlPSIjYmJiYmJiIiBzdHJva2Utd2lkdGg9IjEiLz4KICA8cmVjdCB4PSIxMzAiIHk9IjE0MCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjkwIiBmaWxsPSIjZDBkMGQwIiBzdHJva2U9IiNiYmJiYmIiIHN0cm9rZS13aWR0aD0iMSIvPgogIAogIDxyZWN0IHg9IjI0MCIgeT0iNDAiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgZmlsbD0iI2QwZDBkMCIgc3Ryb2tlPSIjYmJiYmJiIiBzdHJva2Utd2lkdGg9IjEiLz4KICA8cmVjdCB4PSIyOTAiIHk9IjQwIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIGZpbGw9IiNkMGQwZDAiIHN0cm9rZT0iI2JiYmJiYiIgc3Ryb2tlLXdpZHRoPSIxIi8+CiAgPHJlY3QgeD0iMjQwIiB5PSI0MCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjZDBkMGQwIiBzdHJva2U9IiNiYmJiYmIiIHN0cm9rZS13aWR0aD0iMSIvPgogIDxyZWN0IHg9IjI0MCIgeT0iOTAiIHdpZHRoPSI5MCIgaGVpZ2h0PSI0MCIgZmlsbD0iI2QwZDBkMCIgc3Ryb2tlPSIjYmJiYmJiIiBzdHJva2Utd2lkdGg9IjEiLz4KICA8cmVjdCB4PSIzNDAiIHk9IjQwIiB3aWR0aD0iNDAiIGhlaWdodD0iOTAiIGZpbGw9IiNkMGQwZDAiIHN0cm9rZT0iI2JiYmJiYiIgc3Ryb2tlLXdpZHRoPSIxIi8+CiAgCiAgPHJlY3QgeD0iMjQwIiB5PSIyNDAiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgZmlsbD0iI2QwZDBkMCIgc3Ryb2tlPSIjYmJiYmJiIiBzdHJva2Utd2lkdGg9IjEiLz4KICA8cmVjdCB4PSIyOTAiIHk9IjI0MCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjZDBkMGQwIiBzdHJva2U9IiNiYmJiYmIiIHN0cm9rZS13aWR0aD0iMSIvPgogIDxyZWN0IHg9IjI0MCIgeT0iMjkwIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIGZpbGw9IiNkMGQwZDAiIHN0cm9rZT0iI2JiYmJiYiIgc3Ryb2tlLXdpZHRoPSIxIi8+CiAgPHJlY3QgeD0iMjkwIiB5PSIyOTAiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgZmlsbD0iI2QwZDBkMCIgc3Ryb2tlPSIjYmJiYmJiIiBzdHJva2Utd2lkdGg9IjEiLz4KICA8cmVjdCB4PSIzNDAiIHk9IjI0MCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjkwIiBmaWxsPSIjZDBkMGQwIiBzdHJva2U9IiNiYmJiYmIiIHN0cm9rZS13aWR0aD0iMSIvPgogIAogIDxyZWN0IHg9IjQ0MCIgeT0iMTQwIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIGZpbGw9IiNkMGQwZDAiIHN0cm9rZT0iI2JiYmJiYiIgc3Ryb2tlLXdpZHRoPSIxIi8+CiAgPHJlY3QgeD0iNDkwIiB5PSIxNDAiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgZmlsbD0iI2QwZDBkMCIgc3Ryb2tlPSIjYmJiYmJiIiBzdHJva2Utd2lkdGg9IjEiLz4KICA8cmVjdCB4PSI0NDAiIHk9IjE5MCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjZDBkMGQwIiBzdHJva2U9IiNiYmJiYmIiIHN0cm9rZS13aWR0aD0iMSIvPgogIDxyZWN0IHg9IjQ5MCIgeT0iMTkwIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIGZpbGw9IiNkMGQwZDAiIHN0cm9rZT0iI2JiYmJiYiIgc3Ryb2tlLXdpZHRoPSIxIi8+CiAgPHJlY3QgeD0iNTQwIiB5PSIxNDAiIHdpZHRoPSI0MCIgaGVpZ2h0PSI5MCIgZmlsbD0iI2QwZDBkMCIgc3Ryb2tlPSIjYmJiYmJiIiBzdHJva2Utd2lkdGg9IjEiLz4KPC9zdmc+Cg==`;


    const statusColorClass = selectedCall.status === 'Pending' 
      ? 'bg-red-500'
      : selectedCall.status === 'Acknowledged' 
        ? 'bg-yellow-500'
        : selectedCall.status === 'Dispatched'
          ? 'bg-blue-500'
          : 'bg-green-500';


    const incidentId = selectedCall.id.toString().substring(8, 13) || 'bpgtn';

    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className={`p-4`}
      >
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start mb-4 gap-3">
          <h3 className={`text-sm sm:text-base ${isDarkMode ? 'text-white' : 'text-gray-900'} font-medium`}>Incident Details - ID: {incidentId}</h3>
          
          <div className="flex flex-col sm:flex-row gap-2">
            {selectedCall.status === 'Pending' && (
              <>
                <motion.button 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleStatusUpdate(selectedCall.id, 'Acknowledged')} 
                  className="px-4 py-2 sm:px-6 sm:py-3 rounded-lg shadow-lg cursor-pointer transition-all duration-200 bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 hover:shadow-xl text-white font-medium text-sm"
                >
                  Acknowledge
                </motion.button>
                <motion.button 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    // Remove call from list
                    setCalls(calls.filter(call => call.id !== selectedCall.id));
                    setSelectedCall(null);
                  }} 
                  className="px-4 py-2 sm:px-6 sm:py-3 rounded-lg shadow-lg cursor-pointer transition-all duration-200 bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 hover:shadow-xl text-white font-medium text-sm"
                >
                  Cancel Incident
                </motion.button>
              </>
            )}
            
            {selectedCall.status === 'Acknowledged' && (
              <motion.button 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleStatusUpdate(selectedCall.id, 'Dispatched')} 
                className="px-4 py-2 sm:px-6 sm:py-3 rounded-lg shadow-lg cursor-pointer transition-all duration-200 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 hover:shadow-xl text-white font-medium text-sm"
              >
                Dispatch Units
              </motion.button>
            )}
            
            {selectedCall.status === 'Dispatched' && (
              <motion.button 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleStatusUpdate(selectedCall.id, 'Resolved')} 
                className="px-4 py-2 sm:px-6 sm:py-3 rounded-lg shadow-lg cursor-pointer transition-all duration-200 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 hover:shadow-xl text-white font-medium text-sm"
              >
                Resolve Incident
              </motion.button>
            )}
            
            {selectedCall.status === 'Resolved' && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="px-4 py-2 sm:px-6 sm:py-3 rounded-lg shadow-lg bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-medium text-sm text-center"
              >
                Incident Resolved
              </motion.div>
            )}
          </div>
        </div>
        
        <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'} p-3 mb-4`}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex flex-col">
              <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-xs font-bold uppercase tracking-widest mb-1`}>Type</span>
              <span className={`${isDarkMode ? 'text-white' : 'text-gray-900'} font-medium text-sm`}>
                {selectedCall.type === 'Emergency' ? 'Fire' : 
                 selectedCall.type === 'Non-Emergency' ? 'Police' : 'Information'}
              </span>
            </div>
            <div className="flex flex-col">
              <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-xs font-bold uppercase tracking-widest mb-1`}>Status</span>
              <span className={`${isDarkMode ? 'text-white' : 'text-gray-900'} font-medium text-sm`}>
                {selectedCall.status}
              </span>
            </div>
            <div className="flex flex-col">
              <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-xs font-bold uppercase tracking-widest mb-1`}>Priority</span>
              <span className={`${isDarkMode ? 'text-white' : 'text-gray-900'} font-medium text-sm`}>{selectedCall.priority}</span>
            </div>
            <div className="flex flex-col">
              <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-xs font-bold uppercase tracking-widest mb-1`}>Reported</span>
              <span className={`${isDarkMode ? 'text-white' : 'text-gray-900'} font-mono text-sm`}>{selectedCall.time}</span>
            </div>
            <div className="flex flex-col">
              <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-xs font-bold uppercase tracking-widest mb-1`}>Location</span>
              <span className={`${isDarkMode ? 'text-white' : 'text-gray-900'} text-sm`}>{selectedCall.location}</span>
            </div>
            {selectedCall.unitAssigned && (
              <div className="flex flex-col">
                <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-xs font-bold uppercase tracking-widest mb-1`}>Unit</span>
                <span className={`${isDarkMode ? 'text-white' : 'text-gray-900'} text-sm`}>{selectedCall.unitAssigned}</span>
              </div>
            )}
            {!selectedCall.unitAssigned && (
              <div className="flex flex-col">
                <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-xs font-bold uppercase tracking-widest mb-1`}>Caller</span>
                <span className={`${isDarkMode ? 'text-white' : 'text-gray-900'} text-sm`}>John Smith (555-1234)</span>
              </div>
            )}
          </div>
          <div className="flex flex-col mt-3">
            <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-xs font-bold uppercase tracking-widest mb-1`}>Description</span>
            <span className={`${isDarkMode ? 'text-white' : 'text-gray-900'} text-sm`}>{selectedCall.description}</span>
          </div>
        </div>
        
        <div className="mt-4">
          <h3 className={`text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'} font-extralight mb-2 uppercase tracking-widest`}>
            MAP VIEW
          </h3>
          <div className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-xs mb-2 font-mono uppercase tracking-wider`}>Location: {selectedCall.location}</div>
          <div className={`h-64 lg:h-64 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'} overflow-hidden relative mb-4`}>
            {/* Street Map Background (SVG-based) */}
            <div className="absolute inset-0 bg-cover bg-center" style={{ 
              backgroundImage: `url("${streetMapBase64}")`,
              backgroundSize: 'cover'
            }}>
              {/* Incident Location Indicator */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="animate-ping absolute h-4 sm:h-5 w-4 sm:w-5 rounded-full bg-red-600 opacity-75"></div>
                <div className="relative rounded-full h-3 sm:h-4 w-3 sm:w-4 bg-red-500"></div>
              </div>

              {selectedCall.status === 'Dispatched' && (
                <>
                  {/* Unit Markers */}
                  <div className="absolute top-[45%] left-[58%] bg-blue-700 text-white text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md shadow-md">
                    {selectedCall.unitAssigned || 'P101'}
                  </div>
                </>
              )}

              {/* Map Overlay Elements */}
              <div className="absolute bottom-3 left-3 bg-gray-900 bg-opacity-70 p-1.5 sm:p-2 rounded text-white text-xs">
                <div className="flex items-center space-x-1">
                  <div className="w-10 sm:w-16 h-0.5 sm:h-1 bg-white"></div>
                  <span className="text-[10px] sm:text-xs">1 mile</span>
                </div>
              </div>

              <div className="absolute top-3 right-3 bg-gray-900 bg-opacity-70 p-1.5 sm:p-2 rounded">
                <div className="w-6 sm:w-8 h-6 sm:h-8 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-gray-400 text-[10px] sm:text-xs">N</span>
                  </div>
                  <div className="absolute top-1/2 left-1/2 w-0.5 h-3 sm:h-4 bg-red-500 transform -translate-x-1/2 -translate-y-full rotate-0 origin-bottom"></div>
                  <div className="absolute top-1/2 left-1/2 w-0.5 h-2 sm:h-3 bg-white transform -translate-x-1/2 -translate-y-full rotate-90 origin-bottom opacity-70"></div>
                  <div className="absolute top-1/2 left-1/2 w-0.5 h-2 sm:h-3 bg-white transform -translate-x-1/2 -translate-y-full rotate-180 origin-bottom opacity-70"></div>
                  <div className="absolute top-1/2 left-1/2 w-0.5 h-2 sm:h-3 bg-white transform -translate-x-1/2 -translate-y-full rotate-270 origin-bottom opacity-70"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };


  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`h-screen ${isDarkMode ? 'bg-gray-950 text-white' : 'bg-gray-50 text-gray-900'} flex flex-col ${inter.className} antialiased overflow-hidden`}
    >
      {/* Toast Notification Container */}
      <div className="fixed top-8 right-8 z-50 space-y-2 max-w-sm">
        <AnimatePresence>
          {toasts.map(toast => (
            <motion.div 
              key={toast.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className={`${
                toast.type === 'success' ? `bg-gradient-to-r from-emerald-500 to-emerald-600 text-white` :
                toast.type === 'error' ? `bg-gradient-to-r from-rose-500 to-rose-600 text-white` :
                toast.type === 'warning' ? `bg-gradient-to-r from-amber-500 to-amber-600 text-white` :
                `bg-gradient-to-r from-sky-500 to-sky-600 text-white`
              } px-6 py-3 rounded-lg shadow-lg`}
            >
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.05 }}
                className="flex items-center space-x-3"
              >
                {toast.type === 'success' && <Check size={16} className="text-white" />}
                {toast.type === 'error' && <AlertCircle size={16} className="text-white" />}
                {toast.type === 'warning' && <AlertCircle size={16} className="text-white" />}
                {toast.type === 'info' && <Activity size={16} className="text-white" />}
                <p className="text-sm font-medium">{toast.message}</p>
              </motion.div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      
      <motion.header 
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`${isDarkMode ? 'bg-gray-900' : 'bg-white'} py-2 px-3 sm:py-3 sm:px-4`}
      >
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className={`text-lg sm:text-xl lg:text-2xl font-light tracking-wide ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-1 sm:mb-0`}
          >
            922 EMERGENCY RESPONSE CENTER
          </motion.h1>
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex items-center gap-2 sm:gap-3"
          >
            <div className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-xs font-mono`}>
              {formatDate(currentTime)}
            </div>
            <motion.button 
              whileHover={{ scale: 1.1, rotate: 180 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleTheme} 
              className={`p-1.5 rounded-lg shadow-md cursor-pointer ${isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-200 hover:bg-gray-300'} transition-all duration-200`}
              aria-label="Toggle theme"
            >
              {isDarkMode ? (
                <Sun size={14} className="text-yellow-400" />
              ) : (
                <Moon size={14} className="text-gray-700" />
              )}
            </motion.button>
          </motion.div>
        </div>
      </motion.header>
      
      {/* Mobile Section Selector */}
      <div className="lg:hidden px-2 py-2">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="relative"
        >
          <motion.select
            value={activeMobileSection}
            onChange={(e) => setActiveMobileSection(e.target.value as 'incidents' | 'details' | 'units')}
                          className={`w-full pl-10 pr-10 py-3 rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} text-sm font-medium cursor-pointer appearance-none`}
          >
            <option value="incidents">Active Incidents ({calls.length})</option>
            <option value="details">Incident Details{selectedCall ? ` - ${selectedCall.id.toString().substring(8, 13)}` : ' (Select incident first)'}</option>
            <option value="units">Unit Status</option>
          </motion.select>
          
          {/* Custom Icon Display */}
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
            {activeMobileSection === 'incidents' && <List size={16} className={isDarkMode ? 'text-blue-400' : 'text-blue-600'} />}
            {activeMobileSection === 'details' && <Eye size={16} className={isDarkMode ? 'text-red-400' : 'text-red-600'} />}
            {activeMobileSection === 'units' && <Shield size={16} className={isDarkMode ? 'text-green-400' : 'text-green-600'} />}
          </div>
          
          {/* Dropdown Arrow */}
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
            <svg className={`w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </motion.div>
      </div>
      
      <div className="flex flex-col lg:flex-row flex-1 gap-2 p-2 pb-4 min-h-0 items-stretch overflow-hidden">
        {/* Left Panel - Active Incidents */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className={`w-full lg:w-1/4 ${isDarkMode ? 'bg-gray-900' : 'bg-white'} flex flex-col ${
            activeMobileSection === 'incidents' ? 'flex h-full' : 'hidden'
          } lg:flex lg:max-h-none lg:min-h-0`}
        >
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className={`p-2 bg-gradient-to-r from-slate-600 to-slate-700 flex-shrink-0`}
          >
            <h2 className="text-sm font-medium text-white">
              Active Incidents ({calls.length})
            </h2>
          </motion.div>
          <div className="overflow-y-auto flex-1 min-h-0 px-1">
            <AnimatePresence>
              {calls
                .sort((a, b) => {
                  // Define order of statuses
                  const statusOrder = { 'Pending': 0, 'Acknowledged': 1, 'Dispatched': 2, 'Resolved': 3 };
                  return statusOrder[a.status] - statusOrder[b.status];
                })
                .map((call, index) => (
                <motion.div
                  key={call.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                  whileTap={{ scale: 0.98 }}
                  className={`p-3 m-2 rounded-lg shadow-sm cursor-pointer transition-all duration-200 border ${isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'} ${
                    isDarkMode 
                      ? `hover:bg-gray-750 hover:shadow-md ${selectedCall?.id === call.id ? 'bg-blue-900 border-blue-500 ring-2 ring-blue-500' : ''}` 
                      : `hover:bg-gray-50 hover:shadow-md ${selectedCall?.id === call.id ? 'bg-blue-50 border-blue-500 ring-2 ring-blue-500' : ''}`
                  }`}
                  onClick={() => handleCallClick(call)}
                >
                  <div className="flex justify-between items-start mb-1">
                    <div className="flex items-center">
                      <span className={`${
                        call.type === 'Emergency' 
                          ? (isDarkMode ? 'text-red-400' : 'text-red-600') 
                          : (isDarkMode ? 'text-blue-400' : 'text-blue-600')
                      } font-medium text-xs uppercase tracking-wide`}>
                        {call.type === 'Emergency' ? 'Fire' : 'Police'} - {call.priority}
                      </span>
                    </div>
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2 }}
                      className={`px-3 py-1 rounded-full text-xs font-bold text-white uppercase tracking-wider shadow-sm ${
                        call.status === 'Pending' ? 'bg-gradient-to-r from-rose-400 to-rose-500' : 
                        call.status === 'Acknowledged' ? 'bg-gradient-to-r from-amber-400 to-amber-500' :
                        call.status === 'Dispatched' ? 'bg-gradient-to-r from-sky-400 to-sky-500' : 'bg-gradient-to-r from-emerald-400 to-emerald-500'
                      }`}
                    >
                      {call.status}
                    </motion.div>
                  </div>
                  <div className={`${isDarkMode ? 'text-white' : 'text-gray-900'} font-medium text-xs mb-1`}>{call.location}</div>
                  <div className="flex justify-between items-center">
                    <div className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-xs font-mono`}>
                      {call.time}
                    </div>
                    <div className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-xs truncate max-w-[60%] text-right`}>
                      {call.description.substring(0, 20)}{call.description.length > 20 ? '...' : ''}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {/* Activity Log Section within the same scrollable area */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="border-t-2 border-yellow-500 mt-2"
            >
              <div className={`p-2 bg-gradient-to-r from-amber-500 to-amber-600 sticky top-0`}>
                <h2 className="text-sm font-medium text-white">Activity Log</h2>
              </div>
              <AnimatePresence>
                {activityLog.map((entry, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className={`p-2 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}
                  >
                    <div className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-xs font-mono mb-1`}>{entry.timestamp}</div>
                    <div className={`${isDarkMode ? 'text-white' : 'text-gray-900'} text-xs`}>{entry.description}</div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </div>
        </motion.div>
        
        {/* Middle Panel - Incident Details */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className={`w-full lg:w-1/2 ${isDarkMode ? 'bg-gray-900' : 'bg-white'} flex flex-col ${
            activeMobileSection === 'details' ? 'flex h-full' : 'hidden'
          } lg:flex lg:min-h-0 lg:flex-1`}
        >
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className={`p-2 bg-gradient-to-r from-rose-500 to-rose-600 flex-shrink-0`}
          >
            <h2 className="text-sm font-medium text-white">Incident Details</h2>
          </motion.div>
          <div className="overflow-y-auto flex-1 min-h-0">
            {renderIncidentDetails()}
          </div>
        </motion.div>
        
        {/* Right Panel - Unit Status */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className={`w-full lg:w-1/4 ${isDarkMode ? 'bg-gray-900' : 'bg-white'} flex flex-col ${
            activeMobileSection === 'units' ? 'flex h-full' : 'hidden'
          } lg:flex lg:max-h-none lg:min-h-0`}
        >
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
            className={`p-2 bg-gradient-to-r from-emerald-500 to-emerald-600 flex-shrink-0`}
          >
            <h2 className="text-sm font-medium text-white">Unit Status</h2>
          </motion.div>
          
          <div className="overflow-y-auto flex-1 min-h-0">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="p-2 space-y-2"
            >
              <h3 className="text-xs font-medium text-blue-500 uppercase tracking-wide">Police Units</h3>
              <div className="space-y-2">
                <AnimatePresence>
                  {units.filter(unit => unit.type === 'Police Car').map((unit, index) => (
                    <motion.div 
                      key={unit.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                      className={`${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'} p-2 rounded-lg shadow-sm cursor-pointer transition-all duration-200 hover:bg-opacity-80 hover:shadow-md border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <div className="flex items-center">
                          <div className={`w-6 h-6 rounded-md shadow-sm flex items-center justify-center mr-2 bg-gradient-to-br from-slate-500 to-slate-600`}>
                            <Users size={12} className="text-white" />
                          </div>
                          <div>
                            <span className={`${isDarkMode ? 'text-white' : 'text-gray-900'} font-medium block text-xs`}>{unit.id}</span>
                            <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-xs font-mono`}>{unit.crew} crew</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-between items-center pt-1">
                        <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-xs truncate flex-1 mr-2`}>{unit.location}</span>
                        <motion.button 
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => toggleUnitStatus(unit.id)}
                          className={`px-2 py-1 rounded-md shadow-sm cursor-pointer text-white text-xs font-medium transition-all duration-200 hover:shadow-md ${unitStatusColors[unit.status]}`}
                        >
                          {unit.status === 'OutOfService' ? 'Out of Service' : 
                           unit.status === 'Responding' ? 'Responding' :
                           unit.status === 'On Scene' ? 'On Scene' : 'Available'}
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
              
              <h3 className="text-xs font-medium text-red-500 uppercase tracking-wide mt-4">Fire Units</h3>
              <div className="space-y-2">
                <AnimatePresence>
                  {units.filter(unit => unit.type === 'Fire Truck').map((unit, index) => (
                    <motion.div 
                      key={unit.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3, delay: index * 0.1 + 0.2 }}
                      whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                      className={`${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'} p-2 rounded-lg shadow-sm cursor-pointer transition-all duration-200 hover:bg-opacity-80 hover:shadow-md border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <div className="flex items-center">
                          <div className={`w-6 h-6 rounded-md shadow-sm flex items-center justify-center mr-2 bg-gradient-to-br from-slate-500 to-slate-600`}>
                            <Truck size={12} className="text-white" />
                          </div>
                          <div>
                            <span className={`${isDarkMode ? 'text-white' : 'text-gray-900'} font-medium block text-xs`}>{unit.id}</span>
                            <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-xs font-mono`}>{unit.crew} crew</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-between items-center pt-1">
                        <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-xs truncate flex-1 mr-2`}>{unit.location}</span>
                        <motion.button 
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => toggleUnitStatus(unit.id)}
                          className={`px-2 py-1 rounded-md shadow-sm cursor-pointer text-white text-xs font-medium transition-all duration-200 hover:shadow-md ${unitStatusColors[unit.status]}`}
                        >
                          {unit.status === 'OutOfService' ? 'Out of Service' : 
                           unit.status === 'Responding' ? 'Responding' :
                           unit.status === 'On Scene' ? 'On Scene' : 'Available'}
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
              
              <h3 className="text-xs font-medium text-green-500 uppercase tracking-wide mt-4">EMS Units</h3>
              <div className="space-y-2">
                <AnimatePresence>
                  {units.filter(unit => unit.type === 'Ambulance').map((unit, index) => (
                    <motion.div 
                      key={unit.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3, delay: index * 0.1 + 0.4 }}
                      whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                      className={`${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'} p-2 rounded-lg shadow-sm cursor-pointer transition-all duration-200 hover:bg-opacity-80 hover:shadow-md border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <div className="flex items-center">
                          <div className={`w-6 h-6 rounded-md shadow-sm flex items-center justify-center mr-2 bg-gradient-to-br from-slate-500 to-slate-600`}>
                            <Truck size={12} className="text-white" />
                          </div>
                          <div>
                            <span className={`${isDarkMode ? 'text-white' : 'text-gray-900'} font-medium block text-xs`}>{unit.id}</span>
                            <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-xs font-mono`}>{unit.crew} crew</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-between items-center pt-1">
                        <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-xs truncate flex-1 mr-2`}>{unit.location}</span>
                        <motion.button 
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => toggleUnitStatus(unit.id)}
                          className={`px-2 py-1 rounded-md shadow-sm cursor-pointer text-white text-xs font-medium transition-all duration-200 hover:shadow-md ${unitStatusColors[unit.status]}`}
                        >
                          {unit.status === 'OutOfService' ? 'Out of Service' : 
                           unit.status === 'Responding' ? 'Responding' :
                           unit.status === 'On Scene' ? 'On Scene' : 'Available'}
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default Home;
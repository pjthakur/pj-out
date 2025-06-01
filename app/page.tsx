"use client";
import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { 
  Upload, Download, Play, Pause, RotateCcw, Mic, Square, 
  Settings, Eye, EyeOff, Volume2, 
  FileText, BarChart3, Activity, Layers, Radio, Info, X, 
  Github, Mail, Globe, Zap, TrendingUp, Cpu, CheckCircle, AlertCircle, Waves, Target, FileJson
} from 'lucide-react';

 interface Complex {
  real: number;
  imag: number;
}

 interface Toast {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

 
class FFT {
  static transform(signal: number[], inverse = false): Complex[] {
    const N = signal.length;
    if (N <= 1) return signal.map(s => ({ real: s, imag: 0 }));
    
     const nextPow2 = Math.pow(2, Math.ceil(Math.log2(N)));
    const paddedSignal = [...signal, ...Array(nextPow2 - N).fill(0)];
    
    return this.fft(paddedSignal.map(s => ({ real: s, imag: 0 })), inverse);
  }
  
  private static fft(x: Complex[], inverse: boolean): Complex[] {
    const N = x.length;
    if (N <= 1) return x;
    
    const even = [];
    const odd = [];
    for (let i = 0; i < N; i++) {
      if (i % 2 === 0) even.push(x[i]);
      else odd.push(x[i]);
    }
    
    const evenFFT = this.fft(even, inverse);
    const oddFFT = this.fft(odd, inverse);
    
    const result: Complex[] = new Array(N);
    const angle = (inverse ? 2 : -2) * Math.PI / N;
    
    for (let k = 0; k < N / 2; k++) {
      const t = {
        real: Math.cos(angle * k),
        imag: Math.sin(angle * k)
      };
      
      const oddTerm = {
        real: oddFFT[k].real * t.real - oddFFT[k].imag * t.imag,
        imag: oddFFT[k].real * t.imag + oddFFT[k].imag * t.real
      };
      
      result[k] = {
        real: evenFFT[k].real + oddTerm.real,
        imag: evenFFT[k].imag + oddTerm.imag
      };
      
      result[k + N / 2] = {
        real: evenFFT[k].real - oddTerm.real,
        imag: evenFFT[k].imag - oddTerm.imag
      };
    }
    
    if (inverse) {
      return result.map(c => ({ real: c.real / N, imag: c.imag / N }));
    }
    
    return result;
  }
  
  static magnitude(complex: Complex[]): number[] {
    return complex.map(c => Math.sqrt(c.real * c.real + c.imag * c.imag));
  }
  
  static phase(complex: Complex[]): number[] {
    return complex.map(c => Math.atan2(c.imag, c.real));
  }
}

 const windowFunctions = {
  rectangular: (n: number, N: number) => 1,
  hamming: (n: number, N: number) => 0.54 - 0.46 * Math.cos(2 * Math.PI * n / (N - 1)),
  hanning: (n: number, N: number) => 0.5 * (1 - Math.cos(2 * Math.PI * n / (N - 1))),
  blackman: (n: number, N: number) => 
    0.42 - 0.5 * Math.cos(2 * Math.PI * n / (N - 1)) + 0.08 * Math.cos(4 * Math.PI * n / (N - 1)),
  bartlett: (n: number, N: number) => 1 - Math.abs((n - (N - 1) / 2) / ((N - 1) / 2))
};

type WindowFunction = keyof typeof windowFunctions;

interface FrequencyMarker {
  id: string;
  frequency: number;
  amplitude: number;
  color: string;
  label: string;
  isolated: boolean;
}


const ToastNotification: React.FC<{ toast: Toast; onRemove: (id: string) => void }> = ({ toast, onRemove }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onRemove(toast.id);
    }, 4000);
    
    return () => clearTimeout(timer);
  }, [toast.id, onRemove]);

  const getToastStyles = () => {
    switch (toast.type) {
      case 'success':
        return 'bg-emerald-50 border-emerald-200 text-emerald-800';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'info':
        return 'bg-purple-50 border-purple-200 text-purple-800';
      default:
        return 'bg-purple-50 border-purple-200 text-purple-800';
    }
  };

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-emerald-500" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'info':
        return <Info className="w-5 h-5 text-purple-500" />;
      default:
        return <Info className="w-5 h-5 text-purple-500" />;
    }
  };

  return (
    <div className={`flex items-center gap-3 p-4 rounded-lg border shadow-lg backdrop-blur-sm ${getToastStyles()} animate-in slide-in-from-right duration-300`}>
      {getIcon()}
      <span className="text-sm font-medium">{toast.message}</span>
      <button
        onClick={() => onRemove(toast.id)}
        className="ml-auto text-current opacity-70 hover:opacity-100 transition-opacity cursor-pointer"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

const FourierTransformApp: React.FC = () => {
   const [signal, setSignal] = useState<number[]>([]);
  const [samplingRate, setSamplingRate] = useState(44100);
  const [windowFunction, setWindowFunction] = useState<WindowFunction>('hamming');
  const [fftSize, setFFTSize] = useState(2048);
  
   const [isDrawing, setIsDrawing] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [activeTab, setActiveTab] = useState<'magnitude' | 'phase' | 'power'>('magnitude');
  
   const [markers, setMarkers] = useState<FrequencyMarker[]>([]);
  const [draggedMarker, setDraggedMarker] = useState<string | null>(null);
  const [isolatedFrequencies, setIsolatedFrequencies] = useState<Set<string>>(new Set());
  const [logScale, setLogScale] = useState(false);
  const [normalizeAmplitude, setNormalizeAmplitude] = useState(true);
  const [showGrid, setShowGrid] = useState(true);
  
   const [toasts, setToasts] = useState<Toast[]>([]);
  
   const audioContextRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<AudioBufferSourceNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  
   const waveformCanvasRef = useRef<HTMLCanvasElement>(null);
  const frequencyCanvasRef = useRef<HTMLCanvasElement>(null);
  
  const colors = ['#8B5CF6', '#06B6D4', '#10B981', '#F59E0B', '#EF4444', '#EC4899', '#6366F1', '#84CC16'];

   const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, message, type }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

   useEffect(() => {
    try {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      gainNodeRef.current = audioContextRef.current.createGain();
      gainNodeRef.current.connect(audioContextRef.current.destination);
    } catch (error) {
      console.error('Failed to initialize audio context:', error);
      showToast('Failed to initialize audio context', 'error');
    }
    
    return () => {
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
      }
    };
  }, [showToast]);

  
  const applyWindow = useCallback((data: number[]): number[] => {
    const windowFunc = windowFunctions[windowFunction];
    return data.map((value, index) => value * windowFunc(index, data.length));
  }, [windowFunction]);

  
  const analysisData = useMemo(() => {
    if (signal.length === 0) return null;
    
    const windowedSignal = applyWindow(signal);
    const fftResult = FFT.transform(windowedSignal);
    const magnitudes = FFT.magnitude(fftResult);
    const phases = FFT.phase(fftResult);
    const powerSpectrum = magnitudes.map(m => m * m);
    
    return {
      fftResult,
      magnitudes,
      phases,
      powerSpectrum,
      frequencies: magnitudes.map((_, i) => (i * samplingRate) / magnitudes.length)
    };
  }, [signal, samplingRate, applyWindow]);

  
  const drawWaveform = useCallback(() => {
    const canvas = waveformCanvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    
     canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    
     ctx.scale(dpr, dpr);
    
    const width = rect.width;
    const height = rect.height;
    
     const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, 'rgba(30, 27, 75, 0.95)');
    gradient.addColorStop(1, 'rgba(88, 28, 135, 0.95)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    
     if (showGrid) {
      ctx.strokeStyle = 'rgba(196, 181, 253, 0.3)';
      ctx.lineWidth = 1;
      
       for (let i = 0; i <= 10; i++) {
        const y = (i / 10) * height;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
      
       for (let i = 0; i <= 20; i++) {
        const x = (i / 20) * width;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
    }
    
     ctx.strokeStyle = 'rgba(221, 214, 254, 0.6)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, height / 2);
    ctx.lineTo(width, height / 2);
    ctx.stroke();
    
     if (signal.length > 0) {
      const maxAmplitude = Math.max(...signal.map(Math.abs));
      const normalizedSignal = normalizeAmplitude && maxAmplitude > 0 
        ? signal.map(s => s / maxAmplitude) 
        : signal;
      
      ctx.strokeStyle = '#06B6D4';
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      
      const step = width / signal.length;
      normalizedSignal.forEach((value, index) => {
        const x = index * step;
        const y = height / 2 - (value * height * 0.4);
        
        if (index === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      
      ctx.stroke();
      
       ctx.shadowColor = '#06B6D4';
      ctx.shadowBlur = 15;
      ctx.globalAlpha = 0.5;
      ctx.stroke();
      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1;
    }
    
     ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    ctx.font = '12px Inter, system-ui, sans-serif';
    ctx.fillText('1.0', 8, 20);
    ctx.fillText('0.0', 8, height / 2 + 5);
    ctx.fillText('-1.0', 8, height - 8);
    
     if (signal.length > 0) {
      const duration = signal.length / samplingRate;
      ctx.fillText('0ms', 8, height - 25);
      ctx.fillText(`${(duration * 1000).toFixed(1)}ms`, width - 80, height - 25);
    }
  }, [signal, samplingRate, normalizeAmplitude, showGrid]);

   const drawFrequencySpectrum = useCallback(() => {
    const canvas = frequencyCanvasRef.current;
    if (!canvas || !analysisData) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    
     canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    
     ctx.scale(dpr, dpr);
    
    const width = rect.width;
    const height = rect.height;
    
     const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, 'rgba(30, 27, 75, 0.95)');
    gradient.addColorStop(1, 'rgba(88, 28, 135, 0.95)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    
    const { magnitudes, phases, powerSpectrum } = analysisData;
    const halfLength = Math.floor(magnitudes.length / 2);
    
    let data: number[];
    let color: string;
    
    switch (activeTab) {
      case 'magnitude':
        data = magnitudes.slice(0, halfLength);
        color = '#4ECDC4';
        break;
      case 'phase':
        data = phases.slice(0, halfLength);
        color = '#FFA07A';
        break;
      case 'power':
        data = powerSpectrum.slice(0, halfLength);
        color = '#98D8C8';
        break;
    }
    
     if (logScale && activeTab !== 'phase') {
      data = data.map(d => Math.log10(Math.max(d, 1e-10)));
    }
    
    const maxValue = Math.max(...data);
    const minValue = activeTab === 'phase' ? Math.min(...data) : (logScale ? Math.min(...data) : 0);
    const range = maxValue - minValue;
    
     if (showGrid) {
      ctx.strokeStyle = 'rgba(196, 181, 253, 0.3)';
      ctx.lineWidth = 1;
      
      for (let i = 0; i <= 10; i++) {
        const y = (i / 10) * height;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
        
        const x = (i / 10) * width;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
    }
    
     ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    
    for (let i = 0; i < data.length; i++) {
      const x = (i / data.length) * width;
      const normalizedValue = range > 0 ? (data[i] - minValue) / range : 0;
      const y = height - (normalizedValue * height * 0.9);
      
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    
    ctx.stroke();
    
     if (activeTab !== 'phase') {
      ctx.fillStyle = color + '30';
      ctx.lineTo(width, height);
      ctx.lineTo(0, height);
      ctx.closePath();
      ctx.fill();
    }
    
     ctx.shadowColor = color;
    ctx.shadowBlur = 10;
    ctx.globalAlpha = 0.7;
    ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1;
    
     markers.forEach(marker => {
      if (marker.isolated) {
        const freqIndex = Math.round((marker.frequency / (samplingRate / 2)) * data.length);
        if (freqIndex < data.length) {
          ctx.fillStyle = marker.color + '40';
          ctx.fillRect(
            (freqIndex / data.length) * width - 10,
            0,
            20,
            height
          );
        }
      }
    });
    
     markers.forEach(marker => {
      const x = (marker.frequency / (samplingRate / 2)) * width;
      
      if (x >= 0 && x <= width) {
         ctx.strokeStyle = marker.color;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
        
         ctx.fillStyle = marker.color;
        ctx.beginPath();
        ctx.arc(x, 25, 8, 0, Math.PI * 2);
        ctx.fill();
        
         ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;
        ctx.stroke();
        
         const labelText = `${marker.frequency.toFixed(1)} Hz`;
        const labelWidth = ctx.measureText(labelText).width + 16;
        const labelX = Math.min(x + 15, width - labelWidth);
        
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.fillRect(labelX, 10, labelWidth, 20);
        
         ctx.fillStyle = 'white';
        ctx.font = '12px Inter, system-ui, sans-serif';
        ctx.fillText(labelText, labelX + 8, 24);
      }
    });
    
     ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    ctx.font = '12px Inter, system-ui, sans-serif';
    ctx.fillText('0 Hz', 8, height - 8);
    ctx.fillText(`${(samplingRate / 2).toFixed(0)} Hz`, width - 80, height - 8);
  }, [analysisData, samplingRate, markers, activeTab, logScale, showGrid]);

   useEffect(() => {
    const timer = setTimeout(() => {
      drawWaveform();
      drawFrequencySpectrum();
    }, 50);
    
    return () => clearTimeout(timer);
  }, [drawWaveform, drawFrequencySpectrum]);

   const handleCanvasInteraction = useCallback((
    e: React.MouseEvent<HTMLCanvasElement>,
    action: 'down' | 'move' | 'up'
  ) => {
    const canvas = e.currentTarget;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const { width, height } = rect;
    
    if (canvas === frequencyCanvasRef.current) {
       if (action === 'down') {
         const clickedMarker = markers.find(marker => {
          const markerX = (marker.frequency / (samplingRate / 2)) * width;
          return Math.abs(markerX - x) < 15 && y < 50;
        });
        
        if (clickedMarker) {
          setDraggedMarker(clickedMarker.id);
        } else {
           const frequency = (x / width) * (samplingRate / 2);
          const newMarker: FrequencyMarker = {
            id: Date.now().toString(),
            frequency,
            amplitude: 1,
            color: colors[markers.length % colors.length],
            label: `${frequency.toFixed(1)} Hz`,
            isolated: false
          };
          setMarkers([...markers, newMarker]);
          showToast(`Added frequency marker at ${frequency.toFixed(1)} Hz`, 'success');
        }
      } else if (action === 'move' && draggedMarker) {
        const frequency = Math.max(0, Math.min((x / width) * (samplingRate / 2), samplingRate / 2));
        setMarkers(markers.map(m => 
          m.id === draggedMarker 
            ? { ...m, frequency, label: `${frequency.toFixed(1)} Hz` }
            : m
        ));
      } else if (action === 'up') {
        setDraggedMarker(null);
      }
    } else if (canvas === waveformCanvasRef.current) {
       if (action === 'down') {
        setIsDrawing(true);
        const newSignal = signal.length > 0 ? [...signal] : new Array(fftSize).fill(0);
        const index = Math.floor((x / width) * newSignal.length);
        const value = Math.max(-1, Math.min(1, 1 - (y / height) * 2));
        
        if (index >= 0 && index < newSignal.length) {
          newSignal[index] = value;
          setSignal(newSignal);
        }
      } else if (action === 'move' && isDrawing) {
        const index = Math.floor((x / width) * signal.length);
        const value = Math.max(-1, Math.min(1, 1 - (y / height) * 2));
        
        if (index >= 0 && index < signal.length) {
          const newSignal = [...signal];
          
           const radius = 3;
          for (let i = Math.max(0, index - radius); i <= Math.min(signal.length - 1, index + radius); i++) {
            const weight = 1 - Math.abs(i - index) / radius;
            newSignal[i] = value * weight + newSignal[i] * (1 - weight);
          }
          
          setSignal(newSignal);
        }
      } else if (action === 'up') {
        setIsDrawing(false);
      }
    }
  }, [markers, draggedMarker, signal, samplingRate, isDrawing, fftSize, showToast]);

   const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !audioContextRef.current) return;
    
    setIsLoading(true);
    showToast('Loading audio file...', 'info');
    
    try {
      const arrayBuffer = await file.arrayBuffer();
      const audioBuffer = await audioContextRef.current.decodeAudioData(arrayBuffer);
      const channelData = audioBuffer.getChannelData(0);
      
       const targetLength = fftSize;
      let processedSignal: number[];
      
      if (channelData.length > targetLength) {
        const step = channelData.length / targetLength;
        processedSignal = [];
        for (let i = 0; i < targetLength; i++) {
          const start = Math.floor(i * step);
          const end = Math.floor((i + 1) * step);
          let sum = 0;
          for (let j = start; j < end; j++) {
            sum += channelData[j];
          }
          processedSignal.push(sum / (end - start));
        }
      } else {
        processedSignal = Array.from(channelData).slice(0, targetLength);
         while (processedSignal.length < targetLength) {
          processedSignal.push(0);
        }
      }
      
      setSignal(processedSignal);
      setSamplingRate(audioBuffer.sampleRate);
      setMarkers([]); 
      showToast(`Audio file loaded successfully! Duration: ${((processedSignal.length / audioBuffer.sampleRate) * 1000).toFixed(1)}ms`, 'success');
      
    } catch (error) {
      console.error('Error loading audio file:', error);
      showToast('Error loading audio file. Please try a different file.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  
  const startRecording = async () => {
    try {
      setIsLoading(true);
      showToast('Starting microphone recording...', 'info');
      
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: { 
          sampleRate: samplingRate,
          channelCount: 1,
          echoCancellation: false,
          noiseSuppression: false
        } 
      });
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      mediaRecorderRef.current = mediaRecorder;
      
      const chunks: Blob[] = [];
      mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        const arrayBuffer = await blob.arrayBuffer();
        
        if (audioContextRef.current) {
          try {
            const audioBuffer = await audioContextRef.current.decodeAudioData(arrayBuffer);
            const channelData = audioBuffer.getChannelData(0);
            const processedSignal = Array.from(channelData).slice(0, fftSize);
            
             while (processedSignal.length < fftSize) {
              processedSignal.push(0);
            }
            
            setSignal(processedSignal);
            setMarkers([]);
            showToast(`Recording saved! Duration: ${((processedSignal.length / samplingRate) * 1000).toFixed(1)}ms`, 'success');
          } catch (error) {
            console.error('Error processing recorded audio:', error);
            showToast('Error processing recorded audio', 'error');
          }
        }
        
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      showToast('Recording started! Click stop when finished.', 'success');
      
    } catch (error) {
      console.error('Error accessing microphone:', error);
      showToast('Error accessing microphone. Please check permissions.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      showToast('Recording stopped', 'info');
    }
  };

  
  const playSignal = async () => {
    if (!audioContextRef.current || signal.length === 0) return;
    
    if (isPlaying) {
      sourceRef.current?.stop();
      setIsPlaying(false);
      showToast('Playback stopped', 'info');
      return;
    }
    
    try {
      const buffer = audioContextRef.current.createBuffer(1, signal.length, samplingRate);
      const channelData = buffer.getChannelData(0);
      
       let playbackSignal = [...signal];
      if (isolatedFrequencies.size > 0 && analysisData) {
        const { fftResult } = analysisData;
        const filteredFFT = fftResult.map((c, i) => {
          const frequency = (i * samplingRate) / fftResult.length;
          const shouldKeep = Array.from(isolatedFrequencies).some(markerId => {
            const marker = markers.find(m => m.id === markerId);
            return marker && Math.abs(frequency - marker.frequency) < 100; 
          });
          return shouldKeep ? c : { real: 0, imag: 0 };
        });
        
        const inversedSignal = FFT.transform(filteredFFT.map(c => c.real), true);
        playbackSignal = inversedSignal.map(c => c.real);
      }
      
      for (let i = 0; i < channelData.length; i++) {
        channelData[i] = playbackSignal[i] || 0;
      }
      
      const source = audioContextRef.current.createBufferSource();
      source.buffer = buffer;
      source.connect(gainNodeRef.current!);
      
      source.onended = () => {
        setIsPlaying(false);
        showToast('Playback completed', 'info');
      };
      
      source.start();
      sourceRef.current = source;
      setIsPlaying(true);
      
      if (isolatedFrequencies.size > 0) {
        showToast(`Playing ${isolatedFrequencies.size} isolated frequency(ies)`, 'info');
      } else {
        showToast('Playing signal', 'info');
      }
      
    } catch (error) {
      console.error('Error playing audio:', error);
      showToast('Error playing audio', 'error');
    }
  };

  
  const generateSignal = (type: 'sine' | 'square' | 'sawtooth' | 'noise' | 'chirp' | 'impulse') => {
    const length = fftSize;
    const newSignal = new Array(length);
    
    for (let i = 0; i < length; i++) {
      const t = i / samplingRate;
      switch (type) {
        case 'sine':
           newSignal[i] = 0.5 * Math.sin(2 * Math.PI * 440 * t) + 
                        0.3 * Math.sin(2 * Math.PI * 880 * t) +
                        0.2 * Math.sin(2 * Math.PI * 1320 * t);
          break;
        case 'square':
          newSignal[i] = Math.sign(Math.sin(2 * Math.PI * 440 * t)) * 0.8;
          break;
        case 'sawtooth':
          newSignal[i] = (2 * ((440 * t) % 1) - 1) * 0.8;
          break;
        case 'noise':
          newSignal[i] = (Math.random() * 2 - 1) * 0.5;
          break;
        case 'chirp':
          const f0 = 100, f1 = 4000;
          const duration = length / samplingRate;
          const freq = f0 + (f1 - f0) * t / duration;
          newSignal[i] = Math.sin(2 * Math.PI * freq * t) * 0.8;
          break;
        case 'impulse':
          newSignal[i] = i === Math.floor(length / 4) ? 1 : 0;
          break;
      }
    }
    
    setSignal(newSignal);
    setMarkers([]);
    showToast(`Generated ${type} wave signal`, 'success');
  };

  
  const toggleMarkerIsolation = (markerId: string) => {
    const marker = markers.find(m => m.id === markerId);
    if (marker) {
      const newIsolated = !marker.isolated;
      setMarkers(markers.map(m => 
        m.id === markerId ? { ...m, isolated: newIsolated } : m
      ));
      
      const newIsolatedSet = new Set(isolatedFrequencies);
      if (newIsolated) {
        newIsolatedSet.add(markerId);
        showToast(`Isolated frequency ${marker.frequency.toFixed(1)} Hz`, 'success');
      } else {
        newIsolatedSet.delete(markerId);
        showToast(`Removed isolation for ${marker.frequency.toFixed(1)} Hz`, 'info');
      }
      setIsolatedFrequencies(newIsolatedSet);
    }
  };

  const deleteMarker = (markerId: string) => {
    const marker = markers.find(m => m.id === markerId);
    setMarkers(markers.filter(m => m.id !== markerId));
    const newIsolated = new Set(isolatedFrequencies);
    newIsolated.delete(markerId);
    setIsolatedFrequencies(newIsolated);
    if (marker) {
      showToast(`Deleted marker at ${marker.frequency.toFixed(1)} Hz`, 'info');
    }
  };

  const clearAll = () => {
    setSignal([]);
    setMarkers([]);
    setIsolatedFrequencies(new Set());
    if (sourceRef.current) {
      sourceRef.current.stop();
      setIsPlaying(false);
    }
    showToast('All data cleared', 'info');
  };

  
  const exportSVG = () => {
    if (!analysisData || signal.length === 0) {
      showToast('No signal data to export', 'error');
      return;
    }

    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("width", "1400");
    svg.setAttribute("height", "1000");
    svg.setAttribute("viewBox", "0 0 1400 1000");

     const defs = document.createElementNS(svgNS, "defs");
    const style = document.createElementNS(svgNS, "style");
    style.textContent = `
      .chart-title { font: bold 16px Inter, sans-serif; fill: #7c3aed; }
      .axis-label { font: 12px Inter, sans-serif; fill: #475569; }
      .data-label { font: 10px Inter, sans-serif; fill: #64748b; }
      .grid-line { stroke: #e2e8f0; stroke-width: 1; }
      .signal-line { stroke: #06b6d4; stroke-width: 2; fill: none; }
      .frequency-line { stroke: #4ecdc4; stroke-width: 2; fill: none; }
      .marker-line { stroke-width: 2; }
    `;
    defs.appendChild(style);
    svg.appendChild(defs);

     const background = document.createElementNS(svgNS, "rect");
    background.setAttribute("width", "1400");
    background.setAttribute("height", "1000");
    background.setAttribute("fill", "#ffffff");
    svg.appendChild(background);

     const title = document.createElementNS(svgNS, "text");
    title.setAttribute("x", "700");
    title.setAttribute("y", "40");
    title.setAttribute("text-anchor", "middle");
    title.setAttribute("class", "chart-title");
    title.setAttribute("font-size", "24");
    title.textContent = "Fourier Transform Analysis Report";
    svg.appendChild(title);

     const subtitle = document.createElementNS(svgNS, "text");
    subtitle.setAttribute("x", "700");
    subtitle.setAttribute("y", "65");
    subtitle.setAttribute("text-anchor", "middle");
    subtitle.setAttribute("class", "axis-label");
    subtitle.textContent = `Generated on ${new Date().toLocaleString()}`;
    svg.appendChild(subtitle);

     const timeGroup = document.createElementNS(svgNS, "g");
    timeGroup.setAttribute("transform", "translate(80, 120)");

     const timeBg = document.createElementNS(svgNS, "rect");
    timeBg.setAttribute("width", "500");
    timeBg.setAttribute("height", "300");
    timeBg.setAttribute("fill", "#f8fafc");
    timeBg.setAttribute("stroke", "#e2e8f0");
    timeGroup.appendChild(timeBg);

     const timeTitle = document.createElementNS(svgNS, "text");
    timeTitle.setAttribute("x", "250");
    timeTitle.setAttribute("y", "-10");
    timeTitle.setAttribute("text-anchor", "middle");
    timeTitle.setAttribute("class", "chart-title");
    timeTitle.textContent = "Time Domain Signal";
    timeGroup.appendChild(timeTitle);

     for (let i = 0; i <= 10; i++) {
      const line = document.createElementNS(svgNS, "line");
      line.setAttribute("x1", "0");
      line.setAttribute("y1", (i * 30).toString());
      line.setAttribute("x2", "500");
      line.setAttribute("y2", (i * 30).toString());
      line.setAttribute("class", "grid-line");
      timeGroup.appendChild(line);
    }

    for (let i = 0; i <= 10; i++) {
      const line = document.createElementNS(svgNS, "line");
      line.setAttribute("x1", (i * 50).toString());
      line.setAttribute("y1", "0");
      line.setAttribute("x2", (i * 50).toString());
      line.setAttribute("y2", "300");
      line.setAttribute("class", "grid-line");
      timeGroup.appendChild(line);
    }

     const timePath = document.createElementNS(svgNS, "path");
    let timePathData = "M ";
    const maxAmplitude = Math.max(...signal.map(Math.abs));
    const normalizedSignal = maxAmplitude > 0 ? signal.map(s => s / maxAmplitude) : signal;
    
    normalizedSignal.forEach((value, index) => {
      const x = (index / signal.length) * 500;
      const y = 150 - (value * 120);
      timePathData += `${x},${y} `;
    });
    
    timePath.setAttribute("d", timePathData);
    timePath.setAttribute("class", "signal-line");
    timeGroup.appendChild(timePath);

     const timeYLabels = ['1.0', '0.5', '0.0', '-0.5', '-1.0'];
    timeYLabels.forEach((label, i) => {
      const text = document.createElementNS(svgNS, "text");
      text.setAttribute("x", "-10");
      text.setAttribute("y", (i * 75 + 5).toString());
      text.setAttribute("text-anchor", "end");
      text.setAttribute("class", "axis-label");
      text.textContent = label;
      timeGroup.appendChild(text);
    });

    svg.appendChild(timeGroup);

     const freqGroup = document.createElementNS(svgNS, "g");
    freqGroup.setAttribute("transform", "translate(700, 120)");

     const freqBg = document.createElementNS(svgNS, "rect");
    freqBg.setAttribute("width", "500");
    freqBg.setAttribute("height", "300");
    freqBg.setAttribute("fill", "#f8fafc");
    freqBg.setAttribute("stroke", "#e2e8f0");
    freqGroup.appendChild(freqBg);

     const freqTitle = document.createElementNS(svgNS, "text");
    freqTitle.setAttribute("x", "250");
    freqTitle.setAttribute("y", "-10");
    freqTitle.setAttribute("text-anchor", "middle");
    freqTitle.setAttribute("class", "chart-title");
    freqTitle.textContent = "Frequency Domain (FFT)";
    freqGroup.appendChild(freqTitle);

     for (let i = 0; i <= 10; i++) {
      const line = document.createElementNS(svgNS, "line");
      line.setAttribute("x1", "0");
      line.setAttribute("y1", (i * 30).toString());
      line.setAttribute("x2", "500");
      line.setAttribute("y2", (i * 30).toString());
      line.setAttribute("class", "grid-line");
      freqGroup.appendChild(line);
    }

    for (let i = 0; i <= 10; i++) {
      const line = document.createElementNS(svgNS, "line");
      line.setAttribute("x1", (i * 50).toString());
      line.setAttribute("y1", "0");
      line.setAttribute("x2", (i * 50).toString());
      line.setAttribute("y2", "300");
      line.setAttribute("class", "grid-line");
      freqGroup.appendChild(line);
    }

     const { magnitudes } = analysisData;
    const halfLength = Math.floor(magnitudes.length / 2);
    const maxMagnitude = Math.max(...magnitudes.slice(0, halfLength));

    const freqPath = document.createElementNS(svgNS, "path");
    let freqPathData = "M ";
    
    for (let i = 0; i < halfLength; i++) {
      const x = (i / halfLength) * 500;
      const y = 300 - (magnitudes[i] / maxMagnitude) * 280;
      freqPathData += `${x},${y} `;
    }
    
    freqPath.setAttribute("d", freqPathData);
    freqPath.setAttribute("class", "frequency-line");
    freqGroup.appendChild(freqPath);

     markers.forEach(marker => {
      const x = (marker.frequency / (samplingRate / 2)) * 500;
      const markerLine = document.createElementNS(svgNS, "line");
      markerLine.setAttribute("x1", x.toString());
      markerLine.setAttribute("y1", "0");
      markerLine.setAttribute("x2", x.toString());
      markerLine.setAttribute("y2", "300");
      markerLine.setAttribute("stroke", marker.color);
      markerLine.setAttribute("class", "marker-line");
      freqGroup.appendChild(markerLine);

       const markerLabel = document.createElementNS(svgNS, "text");
      markerLabel.setAttribute("x", (x + 5).toString());
      markerLabel.setAttribute("y", "20");
      markerLabel.setAttribute("class", "data-label");
      markerLabel.setAttribute("fill", marker.color);
      markerLabel.textContent = `${marker.frequency.toFixed(0)} Hz`;
      freqGroup.appendChild(markerLabel);
    });

     const freqXLabels = ['0', `${(samplingRate / 8).toFixed(0)}`, `${(samplingRate / 4).toFixed(0)}`, `${(samplingRate / 2).toFixed(0)}`];
    freqXLabels.forEach((label, i) => {
      const text = document.createElementNS(svgNS, "text");
      text.setAttribute("x", (i * 167).toString());
      text.setAttribute("y", "320");
      text.setAttribute("text-anchor", "middle");
      text.setAttribute("class", "axis-label");
      text.textContent = label + ' Hz';
      freqGroup.appendChild(text);
    });

    svg.appendChild(freqGroup);

    
    const summaryGroup = document.createElementNS(svgNS, "g");
    summaryGroup.setAttribute("transform", "translate(80, 500)");

    const summaryTitle = document.createElementNS(svgNS, "text");
    summaryTitle.setAttribute("x", "0");
    summaryTitle.setAttribute("y", "0");
    summaryTitle.setAttribute("class", "chart-title");
    summaryTitle.textContent = "Analysis Summary";
    summaryGroup.appendChild(summaryTitle);

    const summaryData = [
      `Signal Length: ${signal.length} samples`,
      `Sampling Rate: ${samplingRate} Hz`,
      `Duration: ${((signal.length / samplingRate) * 1000).toFixed(1)} ms`,
      `Window Function: ${windowFunction}`,
      `FFT Size: ${fftSize}`,
      `Frequency Resolution: ${(samplingRate / signal.length).toFixed(2)} Hz`,
      `Nyquist Frequency: ${(samplingRate / 2)} Hz`,
      `RMS Amplitude: ${Math.sqrt(signal.reduce((sum, s) => sum + s * s, 0) / signal.length).toFixed(3)}`,
      `Peak Amplitude: ${Math.max(...signal.map(Math.abs)).toFixed(3)}`,
      `Number of Markers: ${markers.length}`
    ];

    summaryData.forEach((data, i) => {
      const text = document.createElementNS(svgNS, "text");
      text.setAttribute("x", ((i % 2) * 400).toString());
      text.setAttribute("y", (Math.floor(i / 2) * 25 + 30).toString());
      text.setAttribute("class", "axis-label");
      text.textContent = data;
      summaryGroup.appendChild(text);
    });

    svg.appendChild(summaryGroup);

    
    if (analysisData) {
      const peakGroup = document.createElementNS(svgNS, "g");
      peakGroup.setAttribute("transform", "translate(80, 700)");

      const peakTitle = document.createElementNS(svgNS, "text");
      peakTitle.setAttribute("x", "0");
      peakTitle.setAttribute("y", "0");
      peakTitle.setAttribute("class", "chart-title");
      peakTitle.textContent = "Top 10 Peak Frequencies";
      peakGroup.appendChild(peakTitle);

      const peaks = analysisData.magnitudes
        .map((mag, i) => ({ frequency: analysisData.frequencies[i], magnitude: mag, index: i }))
        .filter(({ index }) => index < analysisData.magnitudes.length / 2)
        .sort((a, b) => b.magnitude - a.magnitude)
        .slice(0, 10);

       const headers = ['Rank', 'Frequency (Hz)', 'Magnitude', 'Relative (%)'];
      headers.forEach((header, i) => {
        const text = document.createElementNS(svgNS, "text");
        text.setAttribute("x", (i * 150).toString());
        text.setAttribute("y", "30");
        text.setAttribute("class", "chart-title");
        text.setAttribute("font-size", "12");
        text.textContent = header;
        peakGroup.appendChild(text);
      });

      const maxPeakMagnitude = peaks[0]?.magnitude || 1;
      peaks.forEach((peak, i) => {
        const y = 50 + i * 20;
        const relative = (peak.magnitude / maxPeakMagnitude * 100).toFixed(1);

        const rank = document.createElementNS(svgNS, "text");
        rank.setAttribute("x", "0");
        rank.setAttribute("y", y.toString());
        rank.setAttribute("class", "data-label");
        rank.textContent = (i + 1).toString();
        peakGroup.appendChild(rank);

        const freq = document.createElementNS(svgNS, "text");
        freq.setAttribute("x", "150");
        freq.setAttribute("y", y.toString());
        freq.setAttribute("class", "data-label");
        freq.textContent = peak.frequency.toFixed(1);
        peakGroup.appendChild(freq);

        const mag = document.createElementNS(svgNS, "text");
        mag.setAttribute("x", "300");
        mag.setAttribute("y", y.toString());
        mag.setAttribute("class", "data-label");
        mag.textContent = peak.magnitude.toFixed(3);
        peakGroup.appendChild(mag);

        const rel = document.createElementNS(svgNS, "text");
        rel.setAttribute("x", "450");
        rel.setAttribute("y", y.toString());
        rel.setAttribute("class", "data-label");
        rel.textContent = relative + '%';
        peakGroup.appendChild(rel);
      });

      svg.appendChild(peakGroup);
    }

    
    const svgData = new XMLSerializer().serializeToString(svg);
    const blob = new Blob([svgData], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `fourier-analysis-${Date.now()}.svg`;
    link.click();
    URL.revokeObjectURL(url);
    
    showToast('SVG report exported successfully!', 'success');
  };

  
  const exportJSON = () => {
    const reportData = {
      signal: signal,
      samplingRate,
      windowFunction,
      fftSize,
      markers: markers,
      timestamp: new Date().toISOString(),
      analysis: analysisData ? {
        peakFrequencies: analysisData.magnitudes
          .map((mag, i) => ({ frequency: analysisData.frequencies[i], magnitude: mag }))
          .filter((_, i) => i < analysisData.magnitudes.length / 2)
          .sort((a, b) => b.magnitude - a.magnitude)
          .slice(0, 10)
      } : null
    };
    
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `fourier-analysis-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
    
    showToast('JSON data exported successfully!', 'success');
  };

  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);
  const [selectedStep, setSelectedStep] = useState<number | null>(null);
  const [selectedTechDetail, setSelectedTechDetail] = useState<string | null>(null);

  
  useEffect(() => {
    if (showAbout) {
      
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
    } else {
      
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      }
    }

    
    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
    };
  }, [showAbout]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Add scrollbar-hide styles */}
      <style jsx global>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      {/* Toast Notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map(toast => (
          <ToastNotification key={toast.id} toast={toast} onRemove={removeToast} />
        ))}
      </div>

      {/* Modern Header */}
      <header className="bg-gradient-to-r from-purple-900/90 to-pink-700/10 backdrop-blur-xl border-b border-white/10 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3 md:py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/20 ring-1 ring-white/20 transform hover:scale-105 transition-transform duration-200">
                <BarChart3 className="w-6 h-6 md:w-7 md:h-7 text-white" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-white">
                  Fourier Transform Visualizer
                </h1>
                <p className="text-xs md:text-sm text-purple-200/80">Professional frequency analysis tool</p>
              </div>
            </div>
            <div className="flex items-center gap-2 md:gap-4">
              <button
                onClick={() => setShowAbout(true)}
                className="px-3 md:px-4 py-2 text-purple-200 hover:text-white transition-colors flex items-center gap-1.5 md:gap-2 cursor-pointer group text-sm md:text-base"
              >
                <Info size={16} className="group-hover:rotate-12 transition-transform duration-200" />
                <span className="hidden sm:inline">About</span>
              </button>
              <button
                onClick={exportSVG}
                disabled={signal.length === 0}
                className="px-3 md:px-5 py-2 md:py-2.5 bg-gradient-to-r from-purple-400 to-pink-400 text-white rounded-xl hover:from-purple-500 hover:to-pink-500 transition-all duration-200 flex items-center gap-1.5 md:gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-lg shadow-purple-500/20 font-medium text-sm md:text-base whitespace-nowrap"
              >
                <Download size={16} className="flex-shrink-0" />
                <span className="hidden sm:inline">Export SVG</span>
                <span className="sm:hidden">Export</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Main Control Panel */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Input Sources */}
          <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20 shadow-2xl hover:bg-white/15 transition-all duration-300">
            <h3 className="text-white font-bold mb-4 flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Input Sources
            </h3>
            <div className="space-y-3">
              <label className="cursor-pointer block">
                <input
                  type="file"
                  accept="audio/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  disabled={isLoading}
                />
                <div className="px-4 py-2 bg-gradient-to-r from-blue-500/30 text-center to-cyan-500/30 rounded-lg hover:from-blue-500/40 hover:to-cyan-500/40 transition-all duration-200 flex items-center justify-center gap-2 text-white border border-blue-400/30 cursor-pointer">
                  <Upload size={16} />
                  {isLoading ? 'Loading...' : 'Upload Audio'}
                </div>
              </label>
              
              <button
                onClick={isRecording ? stopRecording : startRecording}
                disabled={isLoading}
                className={`w-full px-4 py-2 rounded-lg text-center transition-all duration-200 flex items-center justify-center gap-2 text-white border cursor-pointer ${
                  isRecording 
                    ? 'bg-gradient-to-r from-red-500/30 to-pink-500/30 border-red-400/30 hover:from-red-500/40 hover:to-pink-500/40' 
                    : 'bg-gradient-to-r from-green-500/30 to-emerald-500/30 border-green-400/30 hover:from-green-500/40 hover:to-emerald-500/40'
                }`}
              >
                {isRecording ? <Square size={16} /> : <Mic size={16} />}
                {isRecording ? 'Stop Recording' : 'Start Recording'}
              </button>
            </div>
          </div>

          <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20 shadow-2xl hover:bg-white/15 transition-all duration-300">
            <h3 className="text-white font-bold mb-4 flex items-center gap-2">
              <Radio className="w-5 h-5" />
              Test Signals
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {[
                { type: 'sine', label: 'Sine' },
                { type: 'square', label: 'Square' },
                { type: 'sawtooth', label: 'Sawtooth' },
                { type: 'noise', label: 'Noise' },
                { type: 'chirp', label: 'Chirp' },
                { type: 'impulse', label: 'Impulse' }
              ].map(({ type, label }) => (
                <button
                  key={type}
                  onClick={() => generateSignal(type as any)}
                  className="px-3 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition-all duration-200 text-white text-sm border border-white/20 hover:border-white/40 cursor-pointer flex items-center justify-center"
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Playback Controls */}
          <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20 shadow-2xl hover:bg-white/15 transition-all duration-300">
            <h3 className="text-white font-bold mb-4 flex items-center gap-2">
              <Volume2 className="w-5 h-5" />
              Playback
            </h3>
            <div className="space-y-3">
              <button
                onClick={playSignal}
                disabled={signal.length === 0}
                className="w-full px-4 py-2 bg-gradient-to-r from-purple-500/30 to-pink-500/30 rounded-lg hover:from-purple-500/40 hover:to-pink-500/40 transition-all duration-200 flex items-center justify-center gap-2 text-white border border-purple-400/30 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                {isPlaying ? 'Stop' : 'Play Signal'}
              </button>
              
              {isolatedFrequencies.size > 0 && (
                <div className="text-xs text-cyan-300 text-center">
                  Playing {isolatedFrequencies.size} isolated frequency(ies)
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20 shadow-2xl hover:bg-white/15 transition-all duration-300">
            <h3 className="text-white font-bold mb-4 flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Quick Actions
            </h3>
            <div className="space-y-2">
              <button
                onClick={clearAll}
                className="w-full px-3 py-2 bg-gradient-to-r from-orange-500/30 to-red-500/30 rounded-lg hover:from-orange-500/40 hover:to-red-500/40 transition-all duration-200 flex items-center justify-center gap-2 text-white text-sm border border-orange-400/30 cursor-pointer"
              >
                <RotateCcw size={14} />
                Clear All
              </button>
              
              <button
                onClick={() => setShowSettings(!showSettings)}
                className={`w-full px-3 py-2 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 text-white text-sm border cursor-pointer ${
                  showSettings 
                    ? 'bg-white/30 border-white/40' 
                    : 'bg-white/20 border-white/20 hover:bg-white/30'
                }`}
              >
                <Settings size={14} />
                Settings
              </button>
            </div>
          </div>
        </div>

        {/* Advanced Settings Panel */}
        {showSettings && (
          <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20 shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Settings className="w-6 h-6" />
              Advanced Settings
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Signal Parameters */}
              <div className="space-y-4">
                <h4 className="text-white font-semibold">Signal Parameters</h4>
                
                <div>
                  <label className="text-white text-sm block mb-1">Sampling Rate</label>
                  <select
                    value={samplingRate}
                    onChange={(e) => setSamplingRate(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-white/20 rounded-lg text-white border border-white/20 focus:border-white/40 focus:outline-none cursor-pointer"
                  >
                    <option value="8000">8 kHz</option>
                    <option value="16000">16 kHz</option>
                    <option value="22050">22.05 kHz</option>
                    <option value="44100">44.1 kHz</option>
                    <option value="48000">48 kHz</option>
                    <option value="96000">96 kHz</option>
                  </select>
                </div>
                
                <div>
                  <label className="text-white text-sm block mb-1">FFT Size</label>
                  <select
                    value={fftSize}
                    onChange={(e) => setFFTSize(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-white/20 rounded-lg text-white border border-white/20 focus:border-white/40 focus:outline-none cursor-pointer"
                  >
                    <option value="512">512</option>
                    <option value="1024">1024</option>
                    <option value="2048">2048</option>
                    <option value="4096">4096</option>
                    <option value="8192">8192</option>
                  </select>
                </div>
                
                <div>
                  <label className="text-white text-sm block mb-1">Window Function</label>
                  <select
                    value={windowFunction}
                    onChange={(e) => setWindowFunction(e.target.value as WindowFunction)}
                    className="w-full px-3 py-2 bg-white/20 rounded-lg text-white border border-white/20 focus:border-white/40 focus:outline-none cursor-pointer"
                  >
                    {Object.keys(windowFunctions).map(func => (
                      <option key={func} value={func}>
                        {func.charAt(0).toUpperCase() + func.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Display Options */}
              <div className="space-y-4">
                <h4 className="text-white font-semibold">Display Options</h4>
                
                <label className="flex items-center space-x-2 text-white text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={logScale}
                    onChange={(e) => setLogScale(e.target.checked)}
                    className="rounded border-white/20 bg-white/20 text-cyan-500"
                  />
                  <span>Log Scale</span>
                </label>
                
                <label className="flex items-center space-x-2 text-white text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={normalizeAmplitude}
                    onChange={(e) => setNormalizeAmplitude(e.target.checked)}
                    className="rounded border-white/20 bg-white/20 text-cyan-500"
                  />
                  <span>Normalize Amplitude</span>
                </label>
                
                <label className="flex items-center space-x-2 text-white text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showGrid}
                    onChange={(e) => setShowGrid(e.target.checked)}
                    className="rounded border-white/20 bg-white/20 text-cyan-500"
                  />
                  <span>Show Grid</span>
                </label>
              </div>

              {/* Export Options */}
              <div className="space-y-4">
                <h4 className="text-white font-semibold">Export Options</h4>
                
                <button
                  onClick={exportSVG}
                  disabled={signal.length === 0}
                  className="w-full px-3 py-2 bg-gradient-to-r from-green-500/30 to-emerald-500/30 rounded-lg hover:from-green-500/40 hover:to-emerald-500/40 transition-all duration-200 flex items-center gap-2 text-white text-sm border border-green-400/30 disabled:opacity-50 cursor-pointer"
                >
                  <FileText size={14} />
                  Export SVG Report
                </button>
                
                <button
                  onClick={exportJSON}
                  disabled={signal.length === 0}
                  className="w-full px-3 py-2 bg-gradient-to-r from-blue-500/30 to-cyan-500/30 rounded-lg hover:from-blue-500/40 hover:to-cyan-500/40 transition-all duration-200 flex items-center gap-2 text-white text-sm border border-blue-400/30 disabled:opacity-50 cursor-pointer"
                >
                  <Download size={14} />
                  Export JSON Data
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Analysis Tabs */}
        <div className="backdrop-blur-xl bg-white/10 rounded-2xl border border-white/20 shadow-2xl overflow-hidden">
          <div className="border-b border-white/20">
            <div className="flex overflow-x-auto scrollbar-hide">
              {[
                { id: 'magnitude', label: 'Magnitude', shortLabel: 'Magnitude', icon: BarChart3 },
                { id: 'phase', label: 'Phase', shortLabel: 'Phase', icon: Activity },
                { id: 'power', label: 'Power Spectrum', shortLabel: 'Power', icon: Layers }
              ].map(({ id, label, shortLabel, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id as any)}
                  className={`flex-shrink-0 min-w-0 px-4 sm:px-6 py-3 sm:py-4 text-center transition-all duration-200 flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer whitespace-nowrap ${
                    activeTab === id
                      ? 'bg-white/20 text-white border-b-2 border-cyan-400'
                      : 'text-slate-300 hover:text-white hover:bg-white/10'
                  } ${id === 'magnitude' ? 'flex-1 sm:flex-1' : 'w-auto sm:flex-1'}`}
                >
                  <Icon size={14} className="sm:w-4 sm:h-4 flex-shrink-0" />
                  <span className="text-sm sm:text-base block sm:hidden">{shortLabel}</span>
                  <span className="text-sm sm:text-base hidden sm:block">{label}</span>
                </button>
              ))}
            </div>
          </div>
          
          {/* Main Visualization Area */}
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Time Domain */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Radio className="w-5 h-5" />
                    Time Domain Signal
                  </h2>
                  <div className="text-sm text-slate-300">
                    Draw or import signal
                  </div>
                </div>
                
                <div className="relative group">
                  <canvas
                    ref={waveformCanvasRef}
                    style={{ width: '100%', height: '300px' }}
                    className="rounded-xl bg-black/40 cursor-crosshair border border-white/20 hover:border-white/40 transition-colors duration-200"
                    onMouseDown={(e) => handleCanvasInteraction(e, 'down')}
                    onMouseMove={(e) => handleCanvasInteraction(e, 'move')}
                    onMouseUp={(e) => handleCanvasInteraction(e, 'up')}
                    onMouseLeave={(e) => handleCanvasInteraction(e, 'up')}
                  />
                  <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm rounded-lg px-3 py-1 text-white text-sm">
                      Click and drag to draw signal
                    </div>
                  </div>
                </div>
              </div>

              {/* Frequency Domain */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Frequency Domain ({activeTab})
                  </h2>
                  <div className="text-sm text-slate-300">
                    Click to add markers
                  </div>
                </div>
                
                <div className="relative group">
                  <canvas
                    ref={frequencyCanvasRef}
                    style={{ width: '100%', height: '300px' }}
                    className="rounded-xl bg-black/40 cursor-pointer border border-white/20 hover:border-white/40 transition-colors duration-200"
                    onMouseDown={(e) => handleCanvasInteraction(e, 'down')}
                    onMouseMove={(e) => handleCanvasInteraction(e, 'move')}
                    onMouseUp={(e) => handleCanvasInteraction(e, 'up')}
                    onMouseLeave={(e) => handleCanvasInteraction(e, 'up')}
                  />
                  <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm rounded-lg px-3 py-1 text-white text-sm">
                      Click to add frequency markers, drag to adjust
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Frequency Markers Panel */}
        {markers.length > 0 && (
          <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20 shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Frequency Markers ({markers.length})
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {markers.map(marker => (
                <div
                  key={marker.id}
                  className="bg-white/10 rounded-xl p-4 border border-white/20 hover:border-white/40 transition-all duration-200"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-4 h-4 rounded-full border-2 border-white"
                        style={{ backgroundColor: marker.color }}
                      />
                      <span className="text-white font-mono text-lg">
                        {marker.frequency.toFixed(1)} Hz
                      </span>
                    </div>
                    <button
                      onClick={() => deleteMarker(marker.id)}
                      className="text-red-400 hover:text-red-300 transition-colors text-xl cursor-pointer"
                    >
                      ×
                    </button>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-xs text-slate-300">
                      Amplitude: {analysisData && analysisData.magnitudes[Math.round((marker.frequency / (samplingRate / 2)) * analysisData.magnitudes.length / 2)]?.toFixed(3) || 'N/A'}
                    </div>
                    
                    <button
                      onClick={() => toggleMarkerIsolation(marker.id)}
                      className={`w-full px-3 py-2 rounded-lg text-xs transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${
                        marker.isolated
                          ? 'bg-gradient-to-r from-cyan-500/40 to-blue-500/40 text-white border border-cyan-400/50'
                          : 'bg-white/20 text-slate-300 hover:bg-white/30 hover:text-white border border-white/20'
                      }`}
                    >
                      {marker.isolated ? <Eye size={12} /> : <EyeOff size={12} />}
                      {marker.isolated ? 'Isolated' : 'Isolate'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            {isolatedFrequencies.size > 0 && (
              <div className="mt-4 p-4 bg-cyan-500/20 rounded-xl border border-cyan-400/30">
                <div className="text-cyan-200 text-sm">
                  <strong>{isolatedFrequencies.size}</strong> frequency(ies) isolated. 
                  Use the play button to hear only the isolated frequencies.
                </div>
              </div>
            )}
          </div>
        )}

        {/* signal information section */}
        <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20 shadow-2xl transition-all duration-300 hover:shadow-purple-500/10">
          <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Cpu className="w-6 h-6 text-purple-400" />
            <span className="bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">Signal Analysis Dashboard</span>
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            {[
              { 
                label: 'Signal Length', 
                value: signal.length.toString(), 
                unit: 'samples',
                icon: <Zap className="w-4 h-4 text-cyan-400" />,
                color: 'rose'
              },
              { 
                label: 'Duration', 
                value: signal.length > 0 ? ((signal.length / samplingRate) * 1000).toFixed(1) : '0', 
                unit: 'ms',
                icon: <Activity className="w-4 h-4 text-purple-400" />,
                color: 'rose'
              },
              { 
                label: 'Frequency Resolution', 
                value: signal.length > 0 ? (samplingRate / signal.length).toFixed(2) : '0', 
                unit: 'Hz',
                icon: <BarChart3 className="w-4 h-4 text-pink-400" />,
                color: 'pink'
              },
              { 
                label: 'Nyquist Frequency', 
                value: (samplingRate / 2).toFixed(0), 
                unit: 'Hz',
                icon: <Radio className="w-4 h-4 text-blue-400" />,
                color: 'blue'
              },
              { 
                label: 'RMS Amplitude', 
                value: signal.length > 0 ? Math.sqrt(signal.reduce((sum, s) => sum + s * s, 0) / signal.length).toFixed(3) : '0', 
                unit: 'V',
                icon: <TrendingUp className="w-4 h-4 text-emerald-400" />,
                color: 'emerald'
              },
              { 
                label: 'Peak Amplitude', 
                value: signal.length > 0 ? Math.max(...signal.map(Math.abs)).toFixed(3) : '0', 
                unit: 'V',
                icon: <BarChart3 className="w-4 h-4 text-rose-400" />,
                color: 'rose'
              }
            ].map(({ label, value, unit, icon, color }) => (
              <div key={label} className={`bg-gradient-to-br from-${color}-500/10 to-${color}-600/10 backdrop-blur-xl rounded-xl p-4 border border-${color}-400/20 hover:bg-${color}-500/20 transition-all duration-300 group hover:scale-[1.02] hover:shadow-lg hover:shadow-${color}-500/20`}>
                <div className="flex items-center gap-2 mb-2 text-${color}-300">
                  <div className="transform transition-transform duration-300 group-hover:rotate-12">
                    {icon}
                  </div>
                  <div className="text-xs text-white opacity-80">{label}</div>
                </div>
                <div className="text-2xl font-bold text-white font-mono group-hover:text-${color}-200 transition-colors duration-300">{value}</div>
                {unit && <div className="text-sm text-white group-hover:text-${color}-200/90 transition-colors duration-300">{unit}</div>}
              </div>
            ))}
          </div>
          
          {analysisData && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="backdrop-blur-xl bg-gradient-to-br from-cyan-500/10 to-blue-600/10 rounded-xl p-6 border border-cyan-400/20 hover:bg-cyan-500/20 transition-all duration-300 hover:scale-[1.01] hover:shadow-lg hover:shadow-cyan-500/20">
                <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-cyan-400" />
                  <span className="bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent">Top 5 Peak Frequencies</span>
                </h4>
                <div className="space-y-3">
                  {analysisData.magnitudes
                    .map((mag, i) => ({ frequency: analysisData.frequencies[i], magnitude: mag, index: i }))
                    .filter(({ index }) => index < analysisData.magnitudes.length / 2)
                    .sort((a, b) => b.magnitude - a.magnitude)
                    .slice(0, 5)
                    .map(({ frequency, magnitude }, i) => (
                      <div key={i} className="flex justify-between items-center p-3 bg-cyan-500/10 rounded-lg border border-cyan-400/20 hover:bg-cyan-500/20 transition-all duration-300 group hover:scale-[1.02]">
                        <div className="flex items-center gap-3">
                          <div className="w-6 h-6 bg-gradient-to-br from-cyan-400 to-blue-400 text-white rounded-full flex items-center justify-center text-xs font-bold group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-cyan-500/20">
                            {i + 1}
                          </div>
                          <span className="text-cyan-100 font-mono group-hover:text-white transition-colors duration-300">{frequency.toFixed(1)} Hz</span>
                        </div>
                        <span className="text-cyan-300 font-mono text-sm group-hover:text-white transition-colors duration-300">{magnitude.toFixed(3)}</span>
                      </div>
                    ))}
                </div>
              </div>
              
              <div className="backdrop-blur-xl bg-gradient-to-br from-purple-500/10 to-pink-600/10 rounded-xl p-6 border border-purple-400/20 hover:bg-purple-500/20 transition-all duration-300 hover:scale-[1.01] hover:shadow-lg hover:shadow-purple-500/20">
                <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-purple-400" />
                  <span className="bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">Spectral Analysis</span>
                </h4>
                <div className="space-y-4">
                  <div className="p-3 bg-purple-500/10 rounded-lg border border-purple-400/20 hover:bg-purple-500/20 transition-all duration-300 group hover:scale-[1.02]">
                    <div className="text-sm text-purple-200/70 mb-1">Spectral Centroid</div>
                    <div className="text-2xl font-bold text-white font-mono group-hover:text-purple-200 transition-colors duration-300">
                      {(() => {
                        const magnitudes = analysisData.magnitudes.slice(0, Math.floor(analysisData.magnitudes.length / 2));
                        const frequencies = analysisData.frequencies.slice(0, Math.floor(analysisData.frequencies.length / 2));
                        const totalMagnitude = magnitudes.reduce((sum, mag) => sum + mag, 0);
                        if (totalMagnitude === 0) return '0.0';
                        const centroid = magnitudes.reduce((sum, mag, i) => sum + mag * frequencies[i], 0) / totalMagnitude;
                        return isNaN(centroid) ? '0.0' : centroid.toFixed(1);
                      })()} Hz
                    </div>
                    <div className="text-xs text-purple-300/70">Brightness measure</div>
                  </div>
                  
                  <div className="p-3 bg-purple-500/10 rounded-lg border border-purple-400/20 hover:bg-purple-500/20 transition-all duration-300 group hover:scale-[1.02]">
                    <div className="text-sm text-purple-200/70 mb-1">Total Energy</div>
                    <div className="text-xl font-bold text-white font-mono group-hover:text-purple-200 transition-colors duration-300">
                      {analysisData.powerSpectrum
                        .slice(0, Math.floor(analysisData.powerSpectrum.length / 2))
                        .reduce((sum, power) => sum + power, 0)
                        .toFixed(2)}
                    </div>
                    <div className="text-xs text-purple-300/70">Sum of power spectrum</div>
                  </div>
                  
                  <div className="p-3 bg-purple-500/10 rounded-lg border border-purple-400/20 hover:bg-purple-500/20 transition-all duration-300 group hover:scale-[1.02]">
                    <div className="text-sm text-purple-200/70 mb-1">Dynamic Range</div>
                    <div className="text-xl font-bold text-white font-mono group-hover:text-purple-200 transition-colors duration-300">
                      {signal.length > 0 ? 
                        (20 * Math.log10(Math.max(...signal.map(Math.abs)) / (Math.sqrt(signal.reduce((sum, s) => sum + s * s, 0) / signal.length) || 1e-10))).toFixed(1)
                        : '0.0'
                      } dB
                    </div>
                    <div className="text-xs text-purple-300/70">Peak to RMS ratio</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* About Modal */}
      {showAbout && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center overflow-y-auto">
          <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 my-8">
            <div className="bg-gradient-to-br from-purple-900 to-pink-900/90 rounded-2xl w-full max-w-3xl shadow-2xl border border-white/10 relative transform transition-all duration-300 hover:scale-[1.01] hover:shadow-purple-500/20">
              <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_rgba(159,122,234,0.12),_transparent_50%)]"></div>
              
              <div className="sticky top-0 z-10 backdrop-blur-xl bg-purple-900/50 px-8 py-6 border-b border-white/10 rounded-t-2xl">
                <button
                  onClick={() => setShowAbout(false)}
                  className="absolute cursor-pointer top-4 right-4 p-2 text-purple-200 hover:text-white transition-colors rounded-full hover:bg-white/5 active:scale-95 transform"
                >
                  <X size={24} />
                </button>
                <h2 className="text-3xl font-bold text-white pr-12 select-none">About Fourier Transform Visualizer</h2>
              </div>
              
              <div className="relative p-8 overflow-y-auto max-h-[calc(100vh-16rem)]">
                <div className="space-y-8">
                  <div>
                    <h3 className="text-xl font-semibold text-purple-200 mb-4 select-none">Key Features</h3>
                    <ul className="space-y-3 text-purple-100/90">
                      {[
                        { id: 'realtime', icon: Waves, title: 'Real-time Analysis', desc: 'Visualize frequency components as you draw or modify signals' },
                        { id: 'isolation', icon: Target, title: 'Frequency Isolation', desc: 'Add markers to isolate and play specific frequency components' },
                        { id: 'export', icon: FileJson, title: 'Professional Export', desc: 'Generate detailed SVG reports and JSON data exports' },
                        { id: 'settings', icon: Settings, title: 'Advanced Settings', desc: 'Configurable sampling rates, FFT sizes, and window functions' }
                      ].map(({ id, icon: Icon, title, desc }) => (
                        <li 
                          key={id}
                          onClick={() => setSelectedFeature(selectedFeature === id ? null : id)}
                          className={`flex items-start gap-3 p-2 rounded-lg transition-all duration-300 cursor-pointer
                            ${selectedFeature === id 
                              ? 'bg-white/20 shadow-lg shadow-purple-500/10 scale-[1.02] border border-white/20' 
                              : 'hover:bg-white/5'}`}
                        >
                          <div className={`w-6 h-6 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center flex-shrink-0 mt-0.5 transform transition-transform duration-300 ${selectedFeature === id ? 'scale-110' : 'group-hover:scale-105'}`}>
                            <Icon size={14} className="text-white" />
                          </div>
                          <span className="select-none"><strong>{title}:</strong> {desc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold text-purple-200 mb-4 select-none">How to Use</h3>
                    <ol className="space-y-4">
                      {[
                        'Draw a signal by clicking and dragging on the time domain canvas, or upload an audio file',
                        'Watch the frequency spectrum update in real-time on the right panel',
                        'Click on the frequency spectrum to add markers at specific frequencies',
                        'Use the playback controls to hear the original or filtered signal'
                      ].map((step, index) => (
                        <li 
                          key={index}
                          onClick={() => setSelectedStep(selectedStep === index + 1 ? null : index + 1)}
                          className={`flex items-start gap-4 p-2 rounded-lg transition-all duration-300 cursor-pointer
                            ${selectedStep === index + 1 
                              ? 'bg-white/20 shadow-lg shadow-purple-500/10 scale-[1.02] border border-white/20' 
                              : 'hover:bg-white/5'}`}
                        >
                          <span className={`flex items-center justify-center w-8 h-8 rounded-full bg-purple-400/20 text-purple-200 font-bold select-none transition-all duration-300 ${selectedStep === index + 1 ? 'bg-purple-400/40 scale-110' : ''}`}>
                            {index + 1}
                          </span>
                          <p className="text-purple-100/90 pt-1 select-none">{step}</p>
                        </li>
                      ))}
                    </ol>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold text-purple-200 mb-4 select-none">Technical Details</h3>
                    <div className="bg-purple-400/10 rounded-xl p-6 text-purple-100/90 space-y-2 border border-purple-400/20 hover:bg-purple-400/15 transition-colors">
                      {[
                        { id: 'algorithm', label: 'Algorithm', value: 'Cooley-Tukey Fast Fourier Transform (FFT)' },
                        { id: 'window', label: 'Window Functions', value: 'Hamming, Hanning, Blackman, Bartlett, Rectangular' },
                        { id: 'sampling', label: 'Sampling Rates', value: '8 kHz to 96 kHz' },
                        { id: 'fft', label: 'FFT Sizes', value: '512 to 8192 samples' },
                        { id: 'analysis', label: 'Analysis Types', value: 'Magnitude, Phase, Power Spectrum' }
                      ].map(({ id, label, value }) => (
                        <p 
                          key={id}
                          onClick={() => setSelectedTechDetail(selectedTechDetail === id ? null : id)}
                          className={`select-none p-2 rounded-lg transition-all duration-300 cursor-pointer
                            ${selectedTechDetail === id 
                              ? 'bg-white/20 shadow-lg shadow-purple-500/10 scale-[1.02] border border-white/20' 
                              : 'hover:bg-white/10'}`}
                        >
                          <strong className={`text-purple-200 transition-colors duration-300 ${selectedTechDetail === id ? 'text-white' : ''}`}>
                            {label}:
                          </strong> {value}
                        </p>
                      ))}
                    </div>
                  </div>
                  
                  <div 
                    className="bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-xl p-6 border border-purple-400/20 hover:from-purple-400/25 hover:to-pink-400/25 transition-all duration-300 cursor-pointer transform hover:scale-[1.01]"
                  >
                    <h4 className="text-xl font-semibold text-purple-200 mb-3 select-none">Educational Purpose</h4>
                    <p className="text-purple-100/90 select-none">
                      This tool is designed for educational and professional use to help understand the relationship between 
                      time-domain and frequency-domain representations of signals, fundamental concepts in digital signal processing.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Compact Footer */}
      <footer className="bg-white/5 backdrop-blur-xl border-t border-white/10 mt-12">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center shadow-lg shadow-purple-500/20">
                <BarChart3 className="w-4 h-4 text-white" />
              </div>
              <span className="text-purple-100/70 text-sm">
                Fourier Transform Visualizer. Built with React & TypeScript.
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <a href="#" className="text-purple-200/70 hover:text-purple-300 transition-colors cursor-pointer">
                <Github className="w-4 h-4" />
              </a>
              <a href="#" className="text-purple-200/70 hover:text-purple-300 transition-colors cursor-pointer">
                <Mail className="w-4 h-4" />
              </a>
              <a href="#" className="text-purple-200/70 hover:text-purple-300 transition-colors cursor-pointer">
                <Globe className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default FourierTransformApp;
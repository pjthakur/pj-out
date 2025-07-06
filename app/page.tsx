"use client";
import React, { useRef, useEffect, useState } from "react";
import type { JSX } from "react";
type Symmetry = "none" | "x" | "y" | "xy";
const PATTERN_TYPES = [
  { label: "Dots", value: "dots", description: "Regular circular dots in a grid pattern" },
  { label: "Chevron", value: "chevron", description: "Sharp zigzag pattern with adjustable angles" },
  { label: "Grid", value: "grid", description: "Clean, geometric grid lines" },
  { label: "Diamonds", value: "diamonds", description: "Repeating diamond shapes with variable size" },
  { label: "Circles", value: "circles", description: "Hollow circular rings in a grid" },
  { label: "Squares", value: "squares", description: "Square grid pattern with rounded corners" },
  { label: "Triangles", value: "triangles", description: "Triangular tessellation pattern" },
  { label: "Checkerboard", value: "checkerboard", description: "Classic alternating squares pattern" },
  { label: "Cross", value: "cross", description: "Plus sign pattern in a grid" }
] as const;
type PatternType = typeof PATTERN_TYPES[number]["value"];
const DEFAULTS = {
  scale: 1,
  rotation: 0,
  opacity: 1,
  symmetry: "none" as Symmetry,
  aspectLocked: true,
  variation: 0,
  dpi: 2,
  resolution: 512,
};
function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  const bigint = parseInt(h.length === 3 ? h.split('').map(x => x + x).join('') : h, 16);
  return [
    ((bigint >> 16) & 255) / 255,
    ((bigint >> 8) & 255) / 255,
    (bigint & 255) / 255,
  ];
}
function createShader(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type)!;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const info = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    throw new Error('Could not compile shader:' + info);
  }
  return shader;
}
function createProgram(gl: WebGLRenderingContext, vsSource: string, fsSource: string) {
  const vs = createShader(gl, gl.VERTEX_SHADER, vsSource);
  const fs = createShader(gl, gl.FRAGMENT_SHADER, fsSource);
  const program = gl.createProgram()!;
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const info = gl.getProgramInfoLog(program);
    gl.deleteProgram(program);
    throw new Error('Could not link program:' + info);
  }
  return program;
}
function drawPattern(
  gl: WebGLRenderingContext,
  opts: {
    scale: number;
    rotation: number;
    opacity: number;
    symmetry: Symmetry;
    variation: number;
    aspectLocked: boolean;
    size: number;
    patternType: PatternType;
    colorA: string;
    colorB: string;
  }
) {
  gl.viewport(0, 0, opts.size, opts.size);
  gl.clearColor(1, 1, 1, 1);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  const vsSource = `
    attribute vec2 a_position;
    varying vec2 v_uv;
    void main() {
      v_uv = (a_position + 1.0) * 0.5;
      gl_Position = vec4(a_position, 0, 1);
    }
  `;
  const fsSource = `
    precision highp float;
    varying vec2 v_uv;
    uniform float u_scale;
    uniform float u_rotation;
    uniform float u_opacity;
    uniform int u_symmetry;
    uniform float u_variation;
    uniform bool u_aspectLocked;
    uniform int u_patternType;
    uniform vec3 u_colorA;
    uniform vec3 u_colorB;
    const float PI = 3.14159265359;
    const float EPSILON = 0.0001;
    mat2 rot(float a) {
      float s = sin(a), c = cos(a);
      return mat2(c, -s, s, c);
    }
    vec2 applySymmetry(vec2 uv, int mode) {
      vec2 center = vec2(0.5);
      vec2 result = uv;
      if (mode == 1) {
        result.x = abs(2.0 * (uv.x - center.x)) + center.x;
      }
      else if (mode == 2) {
        result.y = abs(2.0 * (uv.y - center.y)) + center.y;
      }
      else if (mode == 3) {
        result = abs(2.0 * (uv - center)) + center;
      }
      return result;
    }
    float hash(vec2 p) {
      vec3 p3 = fract(vec3(p.xyx) * vec3(443.897, 441.423, 437.195));
      p3 += dot(p3, p3.yzx + 19.19);
      return fract((p3.x + p3.y) * p3.z);
    }
    float smoothPattern(float x) {
      return smoothstep(0.0, 1.0, x);
    }
    float dots(vec2 uv, float var) {
      vec2 grid = fract(uv * 12.0); 
      vec2 gridCenter = grid - 0.5;
      float dist = length(gridCenter);
      float dotSize = 0.15; 
      float smoothness = 0.02; 
      float sizeVar = dotSize + sin(uv.x * 2.0 + uv.y * 2.0 + var) * 0.01;
      return 1.0 - smoothstep(sizeVar - smoothness, sizeVar + smoothness, dist);
    }
    float chevron(vec2 uv, float var) {
      vec2 vUv = fract(uv * 5.0); 
      float v = abs(vUv.x - 0.5) * 2.0;
      float w = abs(vUv.y - 0.5) * 2.0;
      float chevPattern = abs(v - w + sin(var * PI) * 0.3);
      return smoothstep(0.1, 0.15, chevPattern);
    }
    float grid(vec2 uv, float var) {
      vec2 gv = fract(uv * 10.0) - 0.5; 
      float xLine = smoothstep(0.02 + var * 0.02, 0.04 + var * 0.02, abs(gv.x));
      float yLine = smoothstep(0.02 + var * 0.02, 0.04 + var * 0.02, abs(gv.y));
      return min(xLine, yLine);
    }
    float diamonds(vec2 uv, float var) {
      vec2 dv = fract(uv * 8.0) - 0.5; 
      float d = abs(dv.x) + abs(dv.y);
      return smoothstep(0.3 + var * 0.2, 0.4 + var * 0.2, d); 
    }
    float circles(vec2 uv, float var) {
      vec2 grid = fract(uv * 8.0);
      vec2 gridCenter = grid - 0.5;
      float dist = length(gridCenter);
      float outerRadius = 0.4;
      float innerRadius = 0.25;
      float smoothness = 0.02;
      float outer = 1.0 - smoothstep(outerRadius - smoothness, outerRadius + smoothness, dist);
      float inner = smoothstep(innerRadius - smoothness, innerRadius + smoothness, dist);
      return outer * inner;
    }
    float squares(vec2 uv, float var) {
      vec2 grid = fract(uv * 6.0);
      vec2 gridCenter = abs(grid - 0.5);
      float dist = max(gridCenter.x, gridCenter.y);
      float size = 0.35;
      float smoothness = 0.02;
      return 1.0 - smoothstep(size - smoothness, size + smoothness, dist);
    }
    float triangles(vec2 uv, float var) {
      vec2 grid = fract(uv * 6.0);
      vec2 p = grid - 0.5;
      float tri = abs(p.x) + abs(p.y) - 0.3;
      float smoothness = 0.02;
      return 1.0 - smoothstep(-smoothness, smoothness, tri);
    }
    float checkerboard(vec2 uv, float var) {
      vec2 grid = floor(uv * 8.0);
      float checker = mod(grid.x + grid.y, 2.0);
      return checker;
    }
    float cross(vec2 uv, float var) {
      vec2 grid = fract(uv * 6.0);
      vec2 p = abs(grid - 0.5);
      float horizontal = step(p.y, 0.1) * step(p.x, 0.4);
      float vertical = step(p.x, 0.1) * step(p.y, 0.4);
      return max(horizontal, vertical);
    }
    void main() {
      vec2 uv = v_uv;
      vec2 center = vec2(0.5);
      uv -= center;
      float aspect = u_aspectLocked ? 1.0 : 0.7 + 0.3 * sin(u_variation * PI);
      float invScale = 1.0 / u_scale;
      uv *= mat2(invScale * 1.2, 0.0, 0.0, invScale * aspect * 1.2);
      uv = rot(u_rotation) * uv;
      uv += center;
      uv = applySymmetry(uv, u_symmetry);
      uv = fract(uv);
      float pattern = 0.0;
      if (u_patternType == 0) {
        pattern = dots(uv, u_variation);
      } else if (u_patternType == 1) {
        pattern = chevron(uv, u_variation);
      } else if (u_patternType == 2) {
        pattern = grid(uv, u_variation);
      } else if (u_patternType == 3) {
        pattern = diamonds(uv, u_variation);
      } else if (u_patternType == 4) {
        pattern = circles(uv, u_variation);
      } else if (u_patternType == 5) {
        pattern = squares(uv, u_variation);
      } else if (u_patternType == 6) {
        pattern = triangles(uv, u_variation);
      } else if (u_patternType == 7) {
        pattern = checkerboard(uv, u_variation);
      } else if (u_patternType == 8) {
        pattern = cross(uv, u_variation);
      }
      vec3 base = mix(u_colorA, u_colorB, pattern);
      float thread = 0.5 + 0.5 * sin((uv.x + uv.y + u_variation) * 50.0);
      base *= 0.98 + 0.02 * thread;
      vec3 finalColor = mix(vec3(1.0), base, u_opacity);
      gl_FragColor = vec4(finalColor, 1.0);
    }
  `;
  const program = createProgram(gl, vsSource, fsSource);
  gl.useProgram(program);
  const posLoc = gl.getAttribLocation(program, "a_position");
  const posBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([
      -1, -1,
      1, -1,
      -1, 1,
      -1, 1,
      1, -1,
      1, 1,
    ]),
    gl.STATIC_DRAW
  );
  gl.enableVertexAttribArray(posLoc);
  gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);
  const scaleLoc = gl.getUniformLocation(program, "u_scale");
  const rotLoc = gl.getUniformLocation(program, "u_rotation");
  const opLoc = gl.getUniformLocation(program, "u_opacity");
  const symLoc = gl.getUniformLocation(program, "u_symmetry");
  const varLoc = gl.getUniformLocation(program, "u_variation");
  const aspectLoc = gl.getUniformLocation(program, "u_aspectLocked");
  const patternTypeLoc = gl.getUniformLocation(program, "u_patternType");
  const colorALoc = gl.getUniformLocation(program, "u_colorA");
  const colorBLoc = gl.getUniformLocation(program, "u_colorB");
  gl.uniform1f(scaleLoc, opts.scale);
  gl.uniform1f(rotLoc, (opts.rotation * Math.PI) / 180);
  gl.uniform1f(opLoc, opts.opacity);
  gl.uniform1i(symLoc, opts.symmetry === "none" ? 0 : opts.symmetry === "x" ? 1 : opts.symmetry === "y" ? 2 : 3);
  gl.uniform1f(varLoc, opts.variation);
  gl.uniform1i(aspectLoc, opts.aspectLocked ? 1 : 0);
  gl.uniform1i(patternTypeLoc, PATTERN_TYPES.findIndex(p => p.value === opts.patternType));
  gl.uniform3fv(colorALoc, hexToRgb(opts.colorA));
  gl.uniform3fv(colorBLoc, hexToRgb(opts.colorB));
  gl.drawArrays(gl.TRIANGLES, 0, 6);
  gl.deleteBuffer(posBuffer);
  gl.deleteProgram(program);
}
type PatternCanvasProps = {
  scale: number;
  rotation: number;
  opacity: number;
  symmetry: Symmetry;
  variation: number;
  aspectLocked: boolean;
  size: number;
  dpi: number;
  patternType: PatternType;
  colorA: string;
  colorB: string;
  className?: string;
};
const PatternCanvas: React.FC<PatternCanvasProps> = ({
  scale,
  rotation,
  opacity,
  symmetry,
  variation,
  aspectLocked,
  size,
  dpi,
  patternType,
  colorA,
  colorB,
  className,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl") as WebGLRenderingContext;
    if (!gl) return;
    drawPattern(gl, {
      scale: scale,
      rotation,
      opacity,
      symmetry,
      variation,
      aspectLocked,
      size: size * dpi,
      patternType,
      colorA,
      colorB,
    });
  }, [scale, rotation, opacity, symmetry, variation, aspectLocked, size, dpi, patternType, colorA, colorB]);
  return (
    <canvas
      ref={canvasRef}
      width={size * dpi}
      height={size * dpi}
      className={
        `aspect-square w-full h-auto block bg-white border border-gray-200 ${className || ""}`
      }
      style={{ imageRendering: "pixelated" }}
    />
  );
};
const ExportButton: React.FC<{
  onExport: () => void;
  label: string;
  icon: React.ReactNode;
  darkMode: boolean;
}> = ({ onExport, label, icon, darkMode }) => (
  <button
    type="button"
    onClick={onExport}
    className={cx(
      'flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg border text-sm font-medium transition-all duration-200',
      'focus:outline-none focus:ring-2 focus:ring-purple-300 focus:ring-offset-1',
      'hover:scale-[1.02] hover:shadow-md',
      'active:scale-[0.98]',
      'whitespace-nowrap',
      'cursor-pointer',
      darkMode
        ? 'bg-gradient-to-br from-neutral-800/90 to-neutral-700/80 border-neutral-600 text-gray-200 hover:border-purple-400/60 hover:bg-gradient-to-br hover:from-neutral-700/90 hover:to-neutral-600/80 shadow-[0_2px_8px_0_rgba(0,0,0,0.15)]'
        : 'bg-purple-200 border-purple-300 text-purple-800 hover:bg-purple-300 hover:border-purple-400 shadow-[0_2px_8px_0_rgba(0,0,0,0.08)]'
    )}
  >
    {icon}
    {label}
  </button>
);
function cx(...classes: (string | false | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
const DpiLabel: React.FC<{ retina: boolean }> = ({ retina }) => (
  <div
    className="absolute top-2 right-2 px-2 py-0.5 rounded bg-black/60 text-xs text-white opacity-80 pointer-events-none select-none z-10"
    style={{ fontSize: '0.75rem', letterSpacing: '0.01em' }}
    aria-label={retina ? 'Retina Mode' : 'Standard Mode'}
  >
    {retina ? 'Retina Mode' : 'Standard Mode'}
  </div>
);
const TooltipIcon: React.FC<{
  tooltip: string;
  darkMode: boolean;
}> = ({ tooltip, darkMode }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ left: 0, width: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const handleToggle = () => {
    setIsVisible(!isVisible);
  };
  const handleClickOutside = (e: MouseEvent) => {
    if (!(e.target as Element).closest('.tooltip-container')) {
      setIsVisible(false);
    }
  };
  const calculatePosition = () => {
    if (!containerRef.current || !tooltipRef.current) return;
    const container = containerRef.current;
    const tooltip = tooltipRef.current;
    const sidebar = container.closest('aside');
    if (!sidebar) return;
    const sidebarRect = sidebar.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    const sidebarPadding = 24;
    const availableWidth = sidebarRect.width - (sidebarPadding * 2);
    const maxTooltipWidth = Math.min(280, availableWidth);
    const containerCenterX = containerRect.left + containerRect.width / 2 - sidebarRect.left;
    let tooltipLeft = containerCenterX - maxTooltipWidth / 2;
    if (tooltipLeft < sidebarPadding) {
      tooltipLeft = sidebarPadding;
    } else if (tooltipLeft + maxTooltipWidth > sidebarRect.width - sidebarPadding) {
      tooltipLeft = sidebarRect.width - sidebarPadding - maxTooltipWidth;
    }
    setPosition({
      left: tooltipLeft - (containerRect.left - sidebarRect.left),
      width: maxTooltipWidth
    });
  };
  useEffect(() => {
    if (isVisible) {
      document.addEventListener('click', handleClickOutside);
      calculatePosition();
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [isVisible]);
  useEffect(() => {
    const handleResize = () => {
      if (isVisible) {
        calculatePosition();
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isVisible]);
  return (
    <div className="relative tooltip-container" ref={containerRef}>
      <button
        type="button"
        onClick={handleToggle}
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        className={cx(
          'w-4 h-4 cursor-help transition-colors duration-200',
          'focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-teal-400/40 rounded-full',
          darkMode ? 'text-white/60 hover:text-white/80' : 'text-white/70 hover:text-white/90'
        )}
        aria-label="Show tooltip"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" />
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
          <path d="M12 17h.01" />
        </svg>
      </button>
      <div
        ref={tooltipRef}
        className={cx(
          'absolute bottom-6 px-3 py-2 text-xs rounded-lg shadow-lg z-50',
          'transition-all duration-200',
          'break-words whitespace-normal text-center font-medium',
          isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none',
          darkMode
            ? 'bg-neutral-800 text-white border border-neutral-600'
            : 'bg-white text-gray-800 border border-gray-200'
        )}
        style={{
          left: `${position.left}px`,
          width: `${position.width}px`
        }}
      >
        {tooltip}
      </div>
    </div>
  );
};
const ModernCheckbox: React.FC<{
  id: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  darkMode: boolean;
  className?: string;
}> = ({ id, checked, onChange, label, darkMode, className }) => (
  <label htmlFor={id} className={cx('relative flex items-center cursor-pointer group select-none', className)}>
    <input
      id={id}
      type="checkbox"
      checked={checked}
      onChange={e => onChange(e.target.checked)}
      className="sr-only peer"
      aria-checked={checked}
    />
    <div
      className={cx(
        'relative w-5 h-5 flex items-center justify-center rounded-md transition-all duration-300',
        'border-2',
        'before:content-[""] before:absolute before:inset-0 before:rounded-[4px] before:transition-all before:duration-300',
        'after:content-[""] after:absolute after:inset-0 after:scale-50 after:opacity-0 after:transition-all after:duration-300',
        'peer-focus-visible:ring-2 peer-focus-visible:ring-offset-2',
        checked
          ? [
            'before:opacity-100 before:scale-100',
            'after:opacity-100 after:scale-100',
            darkMode
              ? [
                'border-teal-400',
                'before:bg-gradient-to-br before:from-teal-400 before:to-teal-600',
                'after:bg-gradient-to-br after:from-teal-500 after:to-teal-700',
                'peer-focus-visible:ring-teal-500/40'
              ].join(' ')
              : [
                'border-teal-500',
                'before:bg-gradient-to-br before:from-teal-300 before:to-teal-500',
                'after:bg-gradient-to-br after:from-teal-400 after:to-teal-600',
                'peer-focus-visible:ring-teal-400/40'
              ].join(' ')
          ].join(' ')
          : [
            'before:opacity-100 before:scale-100',
            darkMode
              ? [
                'border-gray-600',
                'before:bg-neutral-800',
                'peer-focus-visible:ring-neutral-500/40',
                'group-hover:before:bg-neutral-700',
                'group-hover:border-gray-500'
              ].join(' ')
              : [
                'border-gray-300',
                'before:bg-white',
                'peer-focus-visible:ring-gray-400/40',
                'group-hover:before:bg-gray-50',
                'group-hover:border-gray-400'
              ].join(' ')
          ].join(' ')
      )}
    >
      <svg
        className={cx(
          'w-3 h-3 text-white transition-all duration-300 relative z-10',
          checked
            ? 'opacity-100 scale-100'
            : 'opacity-0 scale-75'
        )}
        viewBox="0 0 12 12"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M2.5 6L5 8.5L9.5 4"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          stroke="currentColor"
        />
      </svg>
    </div>
    <span className={cx('ml-3 text-sm font-semibold', darkMode ? 'text-white' : 'text-white')}>{label}</span>
  </label>
);
const ModernDropdown: React.FC<{
  id: string;
  value: string;
  onChange: (value: string) => void;
  options: readonly { readonly label: string; readonly value: string; readonly description: string }[];
  label: string;
  darkMode: boolean;
}> = ({ id, value, onChange, options, label, darkMode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  const selectedOption = options.find(opt => opt.value === value);
  return (
    <div className="relative" ref={dropdownRef}>
      <label className={cx('block text-md font-bold mb-3', darkMode ? 'text-white' : 'text-white')} htmlFor={id}>
        {label}
      </label>
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={cx(
            'w-full flex items-center justify-between px-3 py-2.5 text-sm rounded-lg border transition-all duration-200',
            'focus:outline-none focus:ring-2 focus:ring-[#c5c6e5] focus:ring-offset-2',
            'hover:border-[#c5c6e5]',
            'cursor-pointer',
            darkMode
              ? 'bg-[#c5c6e5]/10 border-[#c5c6e5]/30 text-gray-100'
              : 'bg-[#c5c6e5]/10 border-[#c5c6e5]/30 text-white'
          )}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-labelledby={`${id}-label`}
        >
          <span className="truncate">{selectedOption?.label}</span>
          <svg
            className={cx(
              'w-4 h-4 transition-transform duration-200',
              isOpen ? 'rotate-180' : '',
              darkMode ? 'text-[#c5c6e5]' : 'text-[#c5c6e5]'
            )}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {isOpen && (
          <div
            className={cx(
              'absolute z-50 w-full mt-1 rounded-lg border shadow-lg transition-all duration-200',
              'animate-in fade-in-0 zoom-in-95',
              darkMode
                ? 'bg-[#c5c6e5]/5 border-[#c5c6e5]/30 shadow-neutral-900/50'
                : 'bg-white border-[#c5c6e5]/30 shadow-gray-900/10'
            )}
          >
            <ul
              role="listbox"
              aria-labelledby={`${id}-label`}
              className={cx(
                'py-1 max-h-40 overflow-y-auto',
                'custom-scrollbar'
              )}
            >
              {options.map((option) => (
                <li key={option.value} role="option" aria-selected={option.value === value}>
                  <button
                    type="button"
                    onClick={() => {
                      onChange(option.value);
                      setIsOpen(false);
                    }}
                    className={cx(
                      'w-full px-3 py-2 text-left transition-colors duration-150',
                      'focus:outline-none',
                      'cursor-pointer',
                      option.value === value
                        ? darkMode
                          ? 'bg-[#c5c6e5]/20 text-[#c5c6e5]'
                          : 'bg-[#c5c6e5]/20 text-gray-700'
                        : darkMode
                          ? 'text-gray-100 hover:bg-teal-500/20 focus:bg-teal-500/20'
                          : 'text-gray-700 hover:bg-teal-400/20 focus:bg-teal-400/20'
                    )}
                  >
                    <div className="flex flex-col">
                      <span className="font-medium">{option.label}</span>
                      <span className={cx(
                        'text-xs mt-0.5',
                        darkMode
                          ? 'text-gray-300'
                          : 'text-gray-600'
                      )}>
                        {option.description}
                      </span>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
function useWebGLSupport() {
  const [isSupported, setIsSupported] = useState(true);
  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      setIsSupported(!!gl);
    } catch (e) {
      setIsSupported(false);
    }
  }, []);
  return isSupported;
}
const App: React.FC = () => {
  const webGLSupported = useWebGLSupport();
  const [scale, setScale] = useState(DEFAULTS.scale);
  const [rotation, setRotation] = useState(DEFAULTS.rotation);
  const [opacity, setOpacity] = useState(DEFAULTS.opacity);
  const [symmetry, setSymmetry] = useState<Symmetry>(DEFAULTS.symmetry);
  const [aspectLocked, setAspectLocked] = useState(DEFAULTS.aspectLocked);
  const [variation, setVariation] = useState(DEFAULTS.variation);
  const [abMode, setAbMode] = useState(false);
  const [selectedFabric, setSelectedFabric] = useState<'A' | 'B'>('A');
  const [dpi, setDpi] = useState(DEFAULTS.dpi);
  const [resolution, setResolution] = useState(DEFAULTS.resolution);
  const [patternType, setPatternType] = useState<PatternType>(PATTERN_TYPES[0].value);
  const [colorA, setColorA] = useState<string>("#FFFFFF");
  const [colorB, setColorB] = useState<string>("#C5C6E5");
  const [darkMode, setDarkMode] = useState(false);
  const [retina, setRetina] = useState(true);
  const [effectiveDpi, setEffectiveDpi] = useState(2);
  const [scaleB, setScaleB] = useState(DEFAULTS.scale);
  const [rotationB, setRotationB] = useState(DEFAULTS.rotation);
  const [opacityB, setOpacityB] = useState(DEFAULTS.opacity);
  const [symmetryB, setSymmetryB] = useState<Symmetry>(DEFAULTS.symmetry);
  const [aspectLockedB, setAspectLockedB] = useState(DEFAULTS.aspectLocked);
  const [variationB, setVariationB] = useState(DEFAULTS.variation);
  const [patternTypeB, setPatternTypeB] = useState<PatternType>(PATTERN_TYPES[1].value);
  const [colorAB, setColorAB] = useState<string>("#F0F0F0");
  const [colorBB, setColorBB] = useState<string>("#A5A6D5");
  const [showTiling, setShowTiling] = useState(false);
  useEffect(() => {
    setEffectiveDpi(retina ? (window.devicePixelRatio || 2) : 1);
  }, [retina]);
  const getCurrentFabricParams = () => {
    if (!abMode || selectedFabric === 'A') {
      return {
        scale, rotation, opacity, symmetry, aspectLocked, variation, patternType, colorA, colorB,
        setScale, setRotation, setOpacity, setSymmetry, setAspectLocked, setVariation, setPatternType, setColorA, setColorB
      };
    } else {
      return {
        scale: scaleB, rotation: rotationB, opacity: opacityB, symmetry: symmetryB, aspectLocked: aspectLockedB, variation: variationB, patternType: patternTypeB, colorA: colorAB, colorB: colorBB,
        setScale: setScaleB, setRotation: setRotationB, setOpacity: setOpacityB, setSymmetry: setSymmetryB, setAspectLocked: setAspectLockedB, setVariation: setVariationB, setPatternType: setPatternTypeB, setColorA: setColorAB, setColorB: setColorBB
      };
    }
  };
  const fabricParams = getCurrentFabricParams();
  const [canvasSize, setCanvasSize] = useState(320);
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function handleResize() {
      if (containerRef.current) {
        const w = containerRef.current.offsetWidth;
        setCanvasSize(Math.max(160, Math.floor(w)));
      }
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const handleExportPNG = () => {
    const canvas = document.createElement("canvas");
    canvas.width = resolution * effectiveDpi;
    canvas.height = resolution * effectiveDpi;
    const gl = canvas.getContext("webgl") as WebGLRenderingContext;
    if (!gl) return;
    const debugBorder = true;
    if (debugBorder) {
      gl.clearColor(0.9, 0.9, 0.9, 1);
      gl.clear(gl.COLOR_BUFFER_BIT);
    }
    drawPattern(gl, {
      scale: fabricParams.scale,
      rotation: fabricParams.rotation,
      opacity: fabricParams.opacity,
      symmetry: fabricParams.symmetry,
      variation: fabricParams.variation,
      aspectLocked: fabricParams.aspectLocked,
      size: resolution * effectiveDpi,
      patternType: fabricParams.patternType,
      colorA: fabricParams.colorA,
      colorB: fabricParams.colorB,
    });
    const url = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = `fabric-pattern${abMode ? `-${selectedFabric}` : ''}.png`;
    a.click();
  };
  const handleExportSVG = () => {
    const canvas = document.createElement("canvas");
    canvas.width = resolution * effectiveDpi;
    canvas.height = resolution * effectiveDpi;
    const gl = canvas.getContext("webgl") as WebGLRenderingContext;
    if (!gl) return;
    drawPattern(gl, {
      scale: fabricParams.scale,
      rotation: fabricParams.rotation,
      opacity: fabricParams.opacity,
      symmetry: fabricParams.symmetry,
      variation: fabricParams.variation,
      aspectLocked: fabricParams.aspectLocked,
      size: resolution * effectiveDpi,
      patternType: fabricParams.patternType,
      colorA: fabricParams.colorA,
      colorB: fabricParams.colorB,
    });
    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("width", `${resolution * effectiveDpi}`);
    svg.setAttribute("height", `${resolution * effectiveDpi}`);
    svg.setAttribute("viewBox", `0 0 ${resolution * effectiveDpi} ${resolution * effectiveDpi}`);
    const img = document.createElementNS(svgNS, "image");
    img.setAttributeNS(
      "http://www.w3.org/1999/xlink",
      "href",
      canvas.toDataURL("image/png")
    );
    img.setAttribute("x", "0");
    img.setAttribute("y", "0");
    img.setAttribute("width", `${resolution * effectiveDpi}`);
    img.setAttribute("height", `${resolution * effectiveDpi}`);
    svg.appendChild(img);
    const serializer = new XMLSerializer();
    const svgStr = serializer.serializeToString(svg);
    const blob = new Blob([svgStr], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `fabric-pattern${abMode ? `-${selectedFabric}` : ''}.svg`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  useEffect(() => {
    if (!document.getElementById('poppins-font-link')) {
      const link = document.createElement('link');
      link.id = 'poppins-font-link';
      link.rel = 'stylesheet';
      link.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap';
      document.head.appendChild(link);
    }
    if (!document.getElementById('poppins-font-style')) {
      const style = document.createElement('style');
      style.id = 'poppins-font-style';
      style.innerHTML = `
        html, body, #root, * {
          font-family: 'Poppins', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif !important;
        }
      `;
      document.head.appendChild(style);
    }
  }, []);
  return (
    <div
      className={cx(
        'min-h-screen w-full transition-colors duration-300 flex flex-col md:flex-row relative',
        darkMode
          ? 'bg-[radial-gradient(ellipse_at_60%_40%,#23272B_0%,#181C20_60%,#101216_100%)]'
          : 'bg-white'
      )}
      style={darkMode ? { color: '#f3f4f6' } : {}}
    >
      <style jsx global>{`
        ::-webkit-scrollbar {
          width: 0px;
          height: 0px;
          background: transparent;
        }
        ::-webkit-scrollbar-track {
          background: transparent;
        }
        ::-webkit-scrollbar-thumb {
          background: transparent;
          border: none;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 0px;
          height: 0px;
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: transparent;
          border: none;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: transparent;
        }
        * {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        *::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      <aside
        className={cx(
          'w-full md:max-w-sm flex-shrink-0 flex flex-col transition-colors duration-300',
          'md:h-screen md:sticky md:top-0 left-0',
          darkMode
            ? [
              'bg-gradient-to-br from-[#181C20]/95 via-[#23272B]/90 to-[#23272B]/80',
              'border-r-2 border-neutral-800',
              'shadow-[inset_0_1.5px_8px_0_rgba(20,25,30,0.18)]',
              'before:content-[""] before:absolute before:inset-0 before:rounded-none before:pointer-events-none',
              'before:border-r-[3px] before:border-blue-900/20 before:z-10',
              'relative overflow-hidden',
            ].join(' ')
            : [
              'bg-teal-600',
              'border-r-2 border-teal-700',
              'shadow-[inset_0_1.5px_8px_0_rgba(180,190,210,0.13)]',
              'before:content-[""] before:absolute before:inset-0 before:rounded-none before:pointer-events-none',
              'before:border-r-[3px] before:border-teal-700/20 before:z-10',
              'relative overflow-hidden text-white',
            ].join(' ')
        )}
      >
        <div
          className={cx(
            'flex flex-col gap-4 py-6 px-4 md:px-6 sticky top-0 z-20',
            darkMode
              ? 'bg-gradient-to-br from-[#181C20]/95 via-[#23272B]/90 to-[#23272B]/80'
              : 'bg-teal-600'
          )}
        >
          <div className="w-full flex flex-col">
            <div className="flex flex-row items-start md:items-center w-full">
              <h1 className={cx(
                'flex-1 text-4xl md:text-4xl xl:text-5xl font-black tracking-tighter',
                'leading-tight mb-2 drop-shadow-[0_2px_8px_rgba(0,0,0,0.10)]',
                'bg-gradient-to-r from-teal-300 via-teal-400 to-purple-300 bg-clip-text text-transparent',
                'select-none',
                darkMode ? 'text-white' : 'text-white'
              )}>
                Fabric Pattern Generator
              </h1>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={cx(
                  'p-3 sm:p-4 rounded-lg transition-all duration-300 flex-shrink-0 ml-3 sm:ml-4',
                  'mt-0 md:mt-0',
                  'hover:scale-110 active:scale-95',
                  'focus:outline-none focus:ring-2 focus:ring-offset-2',
                  'cursor-pointer',
                  darkMode
                    ? 'bg-neutral-700 text-yellow-400'
                    : 'bg-teal-700/30 text-white hover:bg-teal-700/40'
                )}
                aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {darkMode ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                    />
                  </svg>
                )}
              </button>
            </div>
            <div className="h-2 w-24 rounded-full mb-6 mt-1 bg-gradient-to-r from-teal-400 to-purple-300 opacity-80" />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          <form className="flex flex-col gap-6 px-4 md:px-6 pb-6" onSubmit={e => e.preventDefault()}>
            <div className="flex items-center gap-3">
              <ModernCheckbox
                id="retina-toggle"
                checked={retina}
                onChange={setRetina}
                label="Enable High-Resolution Mode (Retina)"
                darkMode={darkMode}
              />
            </div>
            <div className="flex items-center gap-4 mt-2">
              <ModernCheckbox
                id="ab-mode"
                checked={abMode}
                onChange={setAbMode}
                label="Dual View (A/B)"
                darkMode={darkMode}
              />
            </div>
            {abMode && (
              <div className="flex gap-2 mb-4">
                <button
                  type="button"
                  onClick={() => setSelectedFabric('A')}
                  className={cx(
                    'flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
                    'focus:outline-none focus:ring-2 focus:ring-offset-1',
                    'cursor-pointer',
                    selectedFabric === 'A'
                      ? darkMode
                        ? 'bg-teal-600 text-white focus:ring-teal-500/40'
                        : 'bg-teal-700 text-white focus:ring-teal-400/40'
                      : darkMode
                        ? 'bg-neutral-800 text-gray-300 hover:bg-neutral-700 focus:ring-neutral-500/40'
                        : 'bg-white/30 text-white hover:bg-white/40 focus:ring-white/20'
                  )}
                >
                  Fabric A
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedFabric('B')}
                  className={cx(
                    'flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
                    'focus:outline-none focus:ring-2 focus:ring-offset-1',
                    'cursor-pointer',
                    selectedFabric === 'B'
                      ? darkMode
                        ? 'bg-teal-600 text-white focus:ring-teal-500/40'
                        : 'bg-teal-700 text-white focus:ring-teal-400/40'
                      : darkMode
                        ? 'bg-neutral-800 text-gray-300 hover:bg-neutral-700 focus:ring-neutral-500/40'
                        : 'bg-white/30 text-white hover:bg-white/40 focus:ring-white/20'
                  )}
                >
                  Fabric B
                </button>
              </div>
            )}
            <ModernDropdown
              id="pattern-type"
              value={fabricParams.patternType}
              onChange={(value) => fabricParams.setPatternType(value as PatternType)}
              options={PATTERN_TYPES}
              label={`Pattern Type ${abMode ? `(${selectedFabric})` : ''}`}
              darkMode={darkMode}
            />
            <div className="flex gap-4">
              <div className="flex-1">
                <label className={cx('block text-md font-bold mb-3', darkMode ? 'text-white' : 'text-white')} htmlFor="color-a">Color A {abMode ? `(${selectedFabric})` : ''}</label>
                <div className="relative">
                  <div className={cx(
                    'w-full h-10 rounded-lg border-2 transition-all duration-200',
                    darkMode ? 'border-neutral-700 bg-transparent' : 'border-[#c5c6e5]/30 bg-transparent',
                    'flex items-center justify-center'
                  )}>
                    <input
                      id="color-a"
                      type="color"
                      value={fabricParams.colorA}
                      onChange={e => fabricParams.setColorA(e.target.value)}
                      className={cx(
                        'w-full h-10 rounded-lg transition-all duration-200 cursor-pointer border-none outline-none',
                        'focus:ring-2 focus:ring-teal-300 focus:ring-offset-2'
                      )}
                      style={{ backgroundColor: 'transparent' }}
                      aria-label="Primary pattern color"
                    />
                  </div>
                </div>
              </div>
              <div className="flex-1">
                <label className={cx('block text-md font-bold mb-3', darkMode ? 'text-white' : 'text-white')} htmlFor="color-b">Color B {abMode ? `(${selectedFabric})` : ''}</label>
                <div className="relative">
                  <div className={cx(
                    'w-full h-10 rounded-lg border-2 transition-all duration-200',
                    darkMode ? 'border-neutral-700 bg-transparent' : 'border-[#c5c6e5]/30 bg-transparent',
                    'flex items-center justify-center'
                  )}>
                    <input
                      id="color-b"
                      type="color"
                      value={fabricParams.colorB}
                      onChange={e => fabricParams.setColorB(e.target.value)}
                      className={cx(
                        'w-full h-10 rounded-lg transition-all duration-200 cursor-pointer border-none outline-none',
                        'focus:ring-2 focus:ring-teal-300 focus:ring-offset-2'
                      )}
                      style={{ backgroundColor: 'transparent' }}
                      aria-label="Secondary pattern color"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div>
              <label className={cx('block text-md font-bold mb-3', darkMode ? 'text-white' : 'text-white')} htmlFor="scale-slider">Scale {abMode ? `(${selectedFabric})` : ''}</label>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-bold text-white/90 dark:text-white/90">{fabricParams.scale.toFixed(2)}x</span>
              </div>
              <input
                id="scale-slider"
                type="range"
                min={0.5}
                max={2}
                step={0.01}
                value={fabricParams.scale}
                onChange={e => fabricParams.setScale(Number(e.target.value))}
                className={cx(
                  'w-full h-3 rounded-full appearance-none transition-all duration-200 outline-none',
                  darkMode ? 'bg-neutral-800' : 'bg-gray-200'
                )}
                style={{
                  background: darkMode
                    ? 'linear-gradient(90deg, #9333ea 0%, #c084fc 100%)'
                    : 'linear-gradient(90deg, #c5c6e5 0%, #ddd6fe 100%)',
                  boxShadow: darkMode
                    ? '0 1px 4px 0 rgba(30,41,59,0.18) inset'
                    : '0 1px 4px 0 rgba(147,51,234,0.15) inset',
                }}
                aria-valuenow={fabricParams.scale}
                aria-valuemin={0.5}
                aria-valuemax={2}
                aria-label="Pattern scale"
              />
              <style>{`
              #scale-slider::-webkit-slider-thumb,
              #rotation-slider::-webkit-slider-thumb,
              #opacity-slider::-webkit-slider-thumb,
              #variation-slider::-webkit-slider-thumb {
                appearance: none;
                width: 1.5rem;
                height: 1.5rem;
                border-radius: 9999px;
                background: white;
                border: none;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                cursor: pointer;
                transition: all 0.2s;
              }
              #scale-slider::-moz-range-thumb,
              #rotation-slider::-moz-range-thumb,
              #opacity-slider::-moz-range-thumb,
              #variation-slider::-moz-range-thumb {
                width: 1.5rem;
                height: 1.5rem;
                border-radius: 9999px;
                background: white;
                border: none;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                cursor: pointer;
                transition: all 0.2s;
              }
            `}</style>
              <div className={cx('text-sm flex justify-between mt-1', darkMode ? 'text-white/70' : 'text-white/80')}>
                <span className={cx('font-semibold', darkMode ? 'text-white/70' : 'text-white/80')}>0.5x</span>
                <span className={cx('font-semibold', darkMode ? 'text-white/70' : 'text-white/80')}>2x</span>
              </div>
            </div>
            <div>
              <label className={cx('block text-md font-bold mb-3', darkMode ? 'text-white' : 'text-white')} htmlFor="rotation-slider">Rotation {abMode ? `(${selectedFabric})` : ''}</label>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-bold text-white/90 dark:text-white/90">{fabricParams.rotation.toFixed(0)}°</span>
              </div>
              <input
                id="rotation-slider"
                type="range"
                min={0}
                max={360}
                step={1}
                value={fabricParams.rotation}
                onChange={e => fabricParams.setRotation(Number(e.target.value))}
                className={cx(
                  'w-full h-3 rounded-full appearance-none transition-all duration-200 outline-none',
                  darkMode ? 'bg-neutral-800' : 'bg-gray-200'
                )}
                style={{
                  background: darkMode
                    ? 'linear-gradient(90deg, #9333ea 0%, #c084fc 100%)'
                    : 'linear-gradient(90deg, #c5c6e5 0%, #ddd6fe 100%)',
                  boxShadow: darkMode
                    ? '0 1px 4px 0 rgba(30,41,59,0.18) inset'
                    : '0 1px 4px 0 rgba(147,51,234,0.15) inset',
                }}
                aria-valuenow={fabricParams.rotation}
                aria-valuemin={0}
                aria-valuemax={360}
                aria-label="Pattern rotation"
              />
              <div className={cx('text-sm flex justify-between mt-1', darkMode ? 'text-white/70' : 'text-white/80')}>
                <span className={cx('font-semibold', darkMode ? 'text-white/70' : 'text-white/80')}>0°</span>
                <span className={cx('font-semibold', darkMode ? 'text-white/70' : 'text-white/80')}>360°</span>
              </div>
            </div>
            <div>
              <label className={cx('block text-md font-bold mb-3', darkMode ? 'text-white' : 'text-white')} htmlFor="opacity-slider">Opacity {abMode ? `(${selectedFabric})` : ''}</label>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-bold text-white/90 dark:text-white/90">{(fabricParams.opacity * 100).toFixed(0)}%</span>
              </div>
              <input
                id="opacity-slider"
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={fabricParams.opacity}
                onChange={e => fabricParams.setOpacity(Number(e.target.value))}
                className={cx(
                  'w-full h-3 rounded-full appearance-none transition-all duration-200 outline-none',
                  darkMode ? 'bg-neutral-800' : 'bg-gray-200'
                )}
                style={{
                  background: darkMode
                    ? 'linear-gradient(90deg, #9333ea 0%, #c084fc 100%)'
                    : 'linear-gradient(90deg, #c5c6e5 0%, #ddd6fe 100%)',
                  boxShadow: darkMode
                    ? '0 1px 4px 0 rgba(30,41,59,0.18) inset'
                    : '0 1px 4px 0 rgba(147,51,234,0.15) inset',
                }}
                aria-valuenow={fabricParams.opacity}
                aria-valuemin={0}
                aria-valuemax={1}
                aria-label="Pattern opacity"
              />
              <div className={cx('text-sm flex justify-between mt-1', darkMode ? 'text-white/70' : 'text-white/80')}>
                <span className={cx('font-semibold', darkMode ? 'text-white/70' : 'text-white/80')}>0%</span>
                <span className={cx('font-semibold', darkMode ? 'text-white/70' : 'text-white/80')}>100%</span>
              </div>
            </div>
            <div>
              <label className={cx('block text-md font-bold mb-3', darkMode ? 'text-white' : 'text-white')}>Symmetry {abMode ? `(${selectedFabric})` : ''}</label>
              <div className="grid grid-cols-4 gap-1.5">
                {[
                  { label: "None", value: "none" },
                  { label: "X", value: "x" },
                  { label: "Y", value: "y" },
                  { label: "XY", value: "xy" },
                ].map(btn => (
                  <button
                    key={btn.value}
                    type="button"
                    onClick={() => fabricParams.setSymmetry(btn.value as Symmetry)}
                    className={cx(
                      'px-3 py-2 rounded-lg text-sm font-medium w-full transition-all duration-200',
                      'focus:outline-none focus:ring-2 focus:ring-[#c5c6e5]/40 focus:ring-offset-1',
                      'hover:shadow-sm',
                      'cursor-pointer',
                      fabricParams.symmetry === btn.value
                        ? 'bg-white text-teal-800 shadow-inner border border-white/50'
                        : 'bg-white/70 text-teal-800 hover:bg-white/90 border border-white/30'
                    )}
                    aria-pressed={fabricParams.symmetry === btn.value}
                    aria-label={`Set symmetry: ${btn.label}`}
                  >
                    {btn.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-4 mt-2">
              <ModernCheckbox
                id="aspect-lock"
                checked={fabricParams.aspectLocked}
                onChange={fabricParams.setAspectLocked}
                label={`Lock Aspect Ratio ${abMode ? `(${selectedFabric})` : ''}`}
                darkMode={darkMode}
                className="mr-2"
              />
            </div>
            <div>
              <label className={cx('block text-md font-bold mb-3', darkMode ? 'text-white' : 'text-white')} htmlFor="variation-slider">Variation {abMode ? `(${selectedFabric})` : ''}</label>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-bold text-white/90 dark:text-white/90">{fabricParams.variation.toFixed(2)}</span>
              </div>
              <input
                id="variation-slider"
                type="range"
                min={-1}
                max={1}
                step={0.01}
                value={fabricParams.variation}
                onChange={e => fabricParams.setVariation(Number(e.target.value))}
                className={cx(
                  'w-full h-3 rounded-full appearance-none transition-all duration-200 outline-none',
                  darkMode ? 'bg-neutral-800' : 'bg-gray-200'
                )}
                style={{
                  background: darkMode
                    ? 'linear-gradient(90deg, #9333ea 0%, #c084fc 100%)'
                    : 'linear-gradient(90deg, #c5c6e5 0%, #ddd6fe 100%)',
                  boxShadow: darkMode
                    ? '0 1px 4px 0 rgba(30,41,59,0.18) inset'
                    : '0 1px 4px 0 rgba(147,51,234,0.15) inset',
                }}
                aria-valuenow={fabricParams.variation}
                aria-valuemin={-1}
                aria-valuemax={1}
                aria-label="Pattern variation"
              />
              <style>{`
              #variation-slider::-webkit-slider-thumb,
              #rotation-slider::-webkit-slider-thumb,
              #opacity-slider::-webkit-slider-thumb,
              #variation-slider::-webkit-slider-thumb {
                appearance: none;
                width: 1.5rem;
                height: 1.5rem;
                border-radius: 9999px;
                background: white;
                border: none;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                cursor: pointer;
                transition: all 0.2s;
              }
              #variation-slider::-moz-range-thumb,
              #rotation-slider::-moz-range-thumb,
              #opacity-slider::-moz-range-thumb,
              #variation-slider::-moz-range-thumb {
                width: 1.5rem;
                height: 1.5rem;
                border-radius: 9999px;
                background: white;
                border: none;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                cursor: pointer;
                transition: all 0.2s;
              }
            `}</style>
              <div className={cx('text-sm flex justify-between mt-1', darkMode ? 'text-white/70' : 'text-white/80')}>
                <span className={cx('font-semibold', darkMode ? 'text-white/70' : 'text-white/80')}>-1</span>
                <span className={cx('font-semibold', darkMode ? 'text-white/70' : 'text-white/80')}>+1</span>
              </div>
            </div>
            <div className="flex flex-col gap-2 mt-2">
              <label className={cx('block text-md font-bold mb-3', darkMode ? 'text-white' : 'text-white')}>Export</label>
              <div className="flex flex-col sm:flex-row gap-4 mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <label className={cx('text-sm font-semibold', darkMode ? 'text-white/90' : 'text-white/90')}>Quality Multiplier</label>
                    <TooltipIcon
                      tooltip="Multiplies resolution for higher quality exports. 2x = double the pixels for crisp prints."
                      darkMode={darkMode}
                    />
                  </div>
                  <input
                    type="number"
                    min={1}
                    max={8}
                    value={dpi}
                    onChange={e => setDpi(Number(e.target.value))}
                    className={cx(
                      'w-full border-2 rounded-xl px-4 py-3 text-base text-center transition-all duration-200',
                      'focus:outline-none focus:ring-2 focus:ring-[#c5c6e5] focus:ring-offset-1',
                      'hover:border-[#c5c6e5] hover:shadow-sm',
                      'font-mono font-semibold',
                      '[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none',
                      darkMode
                        ? 'bg-[#c5c6e5]/10 border-[#c5c6e5]/30 text-[#c5c6e5] shadow-inner'
                        : 'bg-[#c5c6e5]/10 border-[#c5c6e5]/30 text-white shadow-inner'
                    )}
                    title="Quality multiplier for export resolution"
                    aria-label="Quality multiplier for export resolution"
                  />
                  <div className={cx('text-xs mt-1 text-center font-medium', darkMode ? 'text-white/70' : 'text-white/80')}>
                    Export Size: {(resolution * dpi).toLocaleString()}×{(resolution * dpi).toLocaleString()}px
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <label className={cx('text-sm font-semibold', darkMode ? 'text-white/90' : 'text-white/90')}>Pattern Resolution</label>
                    <TooltipIcon
                      tooltip="Base pattern size. Higher values = more detail but larger file sizes."
                      darkMode={darkMode}
                    />
                  </div>
                  <input
                    type="number"
                    min={64}
                    max={2048}
                    step={32}
                    value={resolution}
                    onChange={e => setResolution(Number(e.target.value))}
                    className={cx(
                      'w-full border-2 rounded-xl px-4 py-3 text-base text-center transition-all duration-200',
                      'focus:outline-none focus:ring-2 focus:ring-[#c5c6e5] focus:ring-offset-1',
                      'hover:border-[#c5c6e5] hover:shadow-sm',
                      'font-mono font-semibold',
                      '[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none',
                      darkMode
                        ? 'bg-[#c5c6e5]/10 border-[#c5c6e5]/30 text-[#c5c6e5] shadow-inner'
                        : 'bg-[#c5c6e5]/10 border-[#c5c6e5]/30 text-white shadow-inner'
                    )}
                    title="Base pattern resolution in pixels"
                    aria-label="Base pattern resolution in pixels"
                  />
                  <div className={cx('text-xs mt-1 text-center font-medium', darkMode ? 'text-white/70' : 'text-white/80')}>
                    Preview Size: {resolution}×{resolution}px
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                <ExportButton
                  onExport={handleExportPNG}
                  label="Export PNG"
                  darkMode={darkMode}
                  icon={
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 20 20" aria-hidden="true">
                      <rect x="3.5" y="4.5" width="13" height="11" rx="2" />
                      <path d="M3.5 13.5l3.5-4 3 3.5 2-2.5 3 3" />
                      <circle cx="7.5" cy="8" r="1" />
                    </svg>
                  }
                />
                <ExportButton
                  onExport={handleExportSVG}
                  label="Export SVG"
                  darkMode={darkMode}
                  icon={
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 20 20" aria-hidden="true">
                      <rect x="4.5" y="3.5" width="11" height="13" rx="2" />
                      <polyline points="8,7.5 10,9.5 12,7.5" />
                      <line x1="10" y1="9.5" x2="10" y2="13" />
                    </svg>
                  }
                />
              </div>
            </div>
          </form>
        </div>
      </aside>
      <main ref={containerRef} className={cx(
        'flex-1 p-4 md:p-8 overflow-y-auto flex flex-col justify-center items-center min-h-screen',
        darkMode ? 'bg-[#181C20]' : 'bg-gray-50'
      )}>
        <div className="flex justify-center mb-6 w-full">
          <button
            type="button"
            onClick={() => setShowTiling((v) => !v)}
            className={cx(
              'px-5 py-2 rounded-full font-medium text-sm shadow transition-all cursor-pointer duration-200',
              'focus:outline-none focus:ring-2 focus:ring-offset-2',
              showTiling
                ? darkMode
                  ? 'bg-teal-700 text-white focus:ring-teal-500/40'
                  : 'bg-teal-600 text-white focus:ring-teal-400/40'
                : darkMode
                  ? 'bg-neutral-800 text-gray-200 focus:ring-neutral-500/40'
                  : 'bg-white text-teal-700 border border-teal-200 focus:ring-teal-200/40'
            )}
            aria-pressed={showTiling}
          >
            {showTiling ? 'Show Fabrics Preview' : 'Show Seamless Tiling Preview'}
          </button>
        </div>
        <div className="flex flex-col lg:flex-row gap-8 items-center justify-center w-full">
          {showTiling ? (
            <section className={cx(
              'flex-1 flex flex-col items-center rounded-3xl px-6 md:px-8 pt-6 md:pt-8 pb-4 md:pb-5 transition w-full min-w-0 max-w-xl',
              'relative overflow-visible',
              darkMode
                ? [
                  'bg-gradient-to-br from-[#181C20]/95 via-[#23272B]/90 to-[#23272B]/80',
                  'border border-transparent',
                  'before:content-[""] before:absolute before:inset-0 before:rounded-3xl before:pointer-events-none',
                  'before:border-[2.5px] before:border-neutral-800/80 before:z-10',
                  'after:content-[""] after:absolute after:inset-0 after:rounded-3xl after:pointer-events-none',
                  'after:ring-2 after:ring-blue-900/30 after:z-0',
                  'shadow-[0_2px_16px_0_rgba(20,25,30,0.18)] shadow-inner',
                ].join(' ')
                : [
                  'bg-[#f0f7f5]',
                  'border border-gray-200',
                  'before:content-[""] before:absolute before:inset-0 before:rounded-3xl before:pointer-events-none',
                  'before:border-[2.5px] before:border-gray-200 before:z-10',
                  'after:content-[""] after:absolute after:inset-0 after:rounded-3xl after:pointer-events-none',
                  'after:ring-2 after:ring-teal-200/30 after:z-0',
                  'shadow-[0_2px_16px_0_rgba(180,190,210,0.13)]',
                ].join(' ')
            )}>
              <div className="w-full flex items-center justify-center">
                <div className="grid grid-cols-2 gap-1 w-full">
                  {[0, 1, 2, 3].map((index) => (
                    <div key={index} className={cx(
                      'overflow-hidden drop-shadow-sm flex items-center justify-center border relative',
                      'before:content-[""] before:absolute before:inset-0 before:z-0 before:opacity-5',
                      'before:bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.8)_0%,rgba(255,255,255,0)_60%)]',
                      'before:bg-[length:24px_24px] before:bg-center',
                      'before:bg-[url("data:image/svg+xml,%3Csvg width=\'24\' height=\'24\' viewBox=\'0 0 24 24\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath fill=\'%23ffffff\' d=\'M12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm0-2a2 2 0 1 0 0-4 2 2 0 0 0 0 4z\'/%3E%3C/svg%3E")]',
                      index === 0 ? 'rounded-tl-lg border-t border-l' :
                        index === 1 ? 'rounded-tr-lg border-t border-l border-r' :
                          index === 2 ? 'rounded-bl-lg border-t border-l border-b' :
                            'rounded-br-lg border',
                      darkMode
                        ? 'bg-gradient-to-br from-neutral-900 to-neutral-800 border-neutral-800'
                        : 'bg-gradient-to-br from-[#e6f0ed] to-[#f0f7f5] border-gray-200'
                    )}>
                      <PatternCanvas
                        scale={fabricParams.scale}
                        rotation={fabricParams.rotation}
                        opacity={fabricParams.opacity}
                        symmetry={fabricParams.symmetry}
                        variation={fabricParams.variation}
                        aspectLocked={fabricParams.aspectLocked}
                        size={canvasSize / 2}
                        dpi={effectiveDpi}
                        patternType={fabricParams.patternType}
                        colorA={fabricParams.colorA}
                        colorB={fabricParams.colorB}
                        className="border-0"
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div className={cx('text-xs text-center mt-2 font-medium tracking-wide', darkMode ? 'text-gray-400' : 'text-gray-500')}>Seamless Tiling Preview {abMode ? `(${selectedFabric})` : ''}</div>
            </section>
          ) : (
            <>
              <section className={cx(
                'flex-1 flex flex-col items-center rounded-3xl px-6 md:px-8 pt-6 md:pt-8 pb-4 md:pb-5 transition w-full min-w-0 max-w-xl backdrop-blur-[2px]',
                'relative overflow-visible',
                darkMode
                  ? [
                    'bg-gradient-to-br from-[#181C20]/95 via-[#23272B]/90 to-[#23272B]/80',
                    'border border-transparent',
                    'before:content-[""] before:absolute before:inset-0 before:rounded-3xl before:pointer-events-none',
                    'before:border-[2.5px] before:border-neutral-800/80 before:z-10',
                    'after:content-[""] after:absolute after:inset-0 after:rounded-3xl after:pointer-events-none',
                    'after:ring-2 after:ring-blue-900/30 after:z-0',
                    'shadow-[0_2px_16px_0_rgba(20,25,30,0.18)] shadow-inner',
                  ].join(' ')
                  : [
                    'bg-[#f0f7f5]/90',
                    'border border-gray-200',
                    'before:content-[""] before:absolute before:inset-0 before:rounded-3xl before:pointer-events-none',
                    'before:border-[2.5px] before:border-gray-200 before:z-10',
                    'after:content-[""] after:absolute after:inset-0 after:rounded-3xl after:pointer-events-none',
                    'after:ring-2 after:ring-teal-200/30 after:z-0',
                    'shadow-[0_2px_16px_0_rgba(180,190,210,0.13)]',
                  ].join(' ')
              )}>
                <div className={cx(
                  'w-full rounded-xl overflow-hidden drop-shadow-md flex items-center justify-center border relative',
                  'before:content-[""] before:absolute before:inset-0 before:z-0 before:opacity-5',
                  'before:bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.8)_0%,rgba(255,255,255,0)_60%)]',
                  'before:bg-[length:24px_24px] before:bg-center',
                  'before:bg-[url("data:image/svg+xml,%3Csvg width=\'24\' height=\'24\' viewBox=\'0 0 24 24\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath fill=\'%23ffffff\' d=\'M12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm0-2a2 2 0 1 0 0-4 2 2 0 0 0 0 4z\'/%3E%3C/svg%3E")]',
                  darkMode
                    ? 'bg-gradient-to-br from-neutral-900 to-neutral-800 border-neutral-800'
                    : 'bg-gradient-to-br from-[#e6f0ed] to-[#f0f7f5] border-gray-200'
                )}>
                  <DpiLabel retina={retina} />
                  <PatternCanvas
                    scale={scale}
                    rotation={rotation}
                    opacity={opacity}
                    symmetry={symmetry}
                    variation={variation}
                    aspectLocked={aspectLocked}
                    size={canvasSize}
                    dpi={effectiveDpi}
                    patternType={patternType}
                    colorA={colorA}
                    colorB={colorB}
                  />
                </div>
                <div className={cx('text-xs text-center mt-2 font-medium tracking-wide', darkMode ? 'text-gray-400' : 'text-gray-500')}>Pattern A</div>
              </section>
              {abMode && (
                <section className={cx(
                  'flex-1 flex flex-col items-center rounded-3xl px-6 md:px-8 pt-6 md:pt-8 pb-4 md:pb-5 transition w-full min-w-0 max-w-xl',
                  'relative overflow-visible',
                  darkMode
                    ? [
                      'bg-gradient-to-br from-[#181C20]/95 via-[#23272B]/90 to-[#23272B]/80',
                      'border border-transparent',
                      'before:content-[""] before:absolute before:inset-0 before:rounded-3xl before:pointer-events-none',
                      'before:border-[2.5px] before:border-neutral-800/80 before:z-10',
                      'after:content-[""] after:absolute after:inset-0 after:rounded-3xl after:pointer-events-none',
                      'after:ring-2 after:ring-blue-900/30 after:z-0',
                      'shadow-[0_2px_16px_0_rgba(20,25,30,0.18)] shadow-inner',
                    ].join(' ')
                    : [
                      'bg-[#f0f7f5]',
                      'border border-gray-200',
                      'before:content-[""] before:absolute before:inset-0 before:rounded-3xl before:pointer-events-none',
                      'before:border-[2.5px] before:border-gray-200 before:z-10',
                      'after:content-[""] after:absolute after:inset-0 after:rounded-3xl after:pointer-events-none',
                      'after:ring-2 after:ring-teal-200/30 after:z-0',
                      'shadow-[0_2px_16px_0_rgba(180,190,210,0.13)]',
                    ].join(' ')
                )}>
                  <div className={cx(
                    'w-full rounded-xl overflow-hidden drop-shadow-md flex items-center justify-center border relative',
                    'before:content-[""] before:absolute before:inset-0 before:z-0 before:opacity-5',
                    'before:bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.8)_0%,rgba(255,255,255,0)_60%)]',
                    'before:bg-[length:24px_24px] before:bg-center',
                    'before:bg-[url("data:image/svg+xml,%3Csvg width=\'24\' height=\'24\' viewBox=\'0 0 24 24\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath fill=\'%23ffffff\' d=\'M12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm0-2a2 2 0 1 0 0-4 2 2 0 0 0 0 4z\'/%3E%3C/svg%3E")]',
                    darkMode
                      ? 'bg-gradient-to-br from-neutral-900 to-neutral-800 border-neutral-800'
                      : 'bg-gradient-to-br from-[#e6f0ed] to-[#f0f7f5] border-gray-200'
                  )}>
                    <DpiLabel retina={retina} />
                    <PatternCanvas
                      scale={scaleB}
                      rotation={rotationB}
                      opacity={opacityB}
                      symmetry={symmetryB}
                      variation={variationB}
                      aspectLocked={aspectLockedB}
                      size={canvasSize}
                      dpi={effectiveDpi}
                      patternType={patternTypeB}
                      colorA={colorAB}
                      colorB={colorBB}
                    />
                  </div>
                  <div className={cx('text-xs text-center mt-2 font-medium tracking-wide', darkMode ? 'text-gray-400' : 'text-gray-500')}>Pattern B</div>
                </section>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
};
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
          <div className="max-w-md w-full p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
            <h2 className="text-xl font-semibold text-red-600 dark:text-red-400 mb-3">
              Something went wrong
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
              {this.state.error?.message || "WebGL context initialization failed. Please try using a different browser or device."}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
export default function PatternGenerator(): JSX.Element {
  return (
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  );
}
const styles = `
  @keyframes grain {
    0%, 100% { transform: translate(0, 0) }
    10% { transform: translate(-5%, -5%) }
    20% { transform: translate(-10%, 5%) }
    30% { transform: translate(5%, -10%) }
    40% { transform: translate(-5%, 15%) }
    50% { transform: translate(-10%, 5%) }
    60% { transform: translate(15%, 0) }
    70% { transform: translate(0, 10%) }
    80% { transform: translate(-15%, 0) }
    90% { transform: translate(10%, 5%) }
  }
  @keyframes grid {
    0% { transform: translateX(0) }
    100% { transform: translateX(64px) }
  }
`;
const Head = () => (
  <head>
    <style>{styles}</style>
  </head>
);
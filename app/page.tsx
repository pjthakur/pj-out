'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import * as d3 from 'd3';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';


interface DataPoint {
  type: 'click' | 'scroll' | 'submission';
  x: number;
  y: number;
  page: string;
  device: string;
  timestamp: Date;
  value: number;
}

interface DeviceData {
  desktop: number;
  tablet: number;
  mobile: number;
}

interface PageData {
  page: string;
  clicks: number;
  scrolls: number;
  submissions: number;
  total: number;
}

interface TimeData {
  date: string;
  clicks: number;
  scrolls: number;
  submissions: number;
  total: number;
}

interface ToastProps {
  message: string;
  type: 'success' | 'warning' | 'error' | 'info';
  id: string;
}

const WebsiteEngagementHeatmap: React.FC = () => {

  const [dummyData, setDummyData] = useState<DataPoint[]>([]);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showReportsModal, setShowReportsModal] = useState(false);
  const [activeReportTab, setActiveReportTab] = useState('overview');
  const [toasts, setToasts] = useState<ToastProps[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  

  const [metricFilters, setMetricFilters] = useState({
    clicks: true,
    scrolls: true,
    submissions: true
  });
  const [deviceFilters, setDeviceFilters] = useState({
    desktop: true,
    tablet: true,
    mobile: true
  });
  const [timeRange, setTimeRange] = useState('last7days');
  const [pageFilter, setPageFilter] = useState('all');
  const [customDateRange, setCustomDateRange] = useState({
    start: '',
    end: ''
  });
  const [showCustomDate, setShowCustomDate] = useState(false);


  const heatmapRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const zoomRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null);


  const HEATMAP_WIDTH = 1200;
  const HEATMAP_HEIGHT = 800;


  useEffect(() => {
    const savedTheme = (typeof window !== 'undefined' ? localStorage.getItem('theme') : null) as 'light' | 'dark' || 
      (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    setTheme(savedTheme);
    

    const today = new Date();
    const lastWeek = new Date(today);
    lastWeek.setDate(today.getDate() - 7);
    
    setCustomDateRange({
      start: lastWeek.toISOString().split('T')[0],
      end: today.toISOString().split('T')[0]
    });
  }, []);


  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (theme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
      } else {
        document.documentElement.removeAttribute('data-theme');
      }
      localStorage.setItem('theme', theme);
    }
  }, [theme]);


  const generateDummyData = useCallback((): DataPoint[] => {
    const pages = ['homepage', 'products', 'blog', 'checkout', 'contact'];
    const devices = ['desktop', 'tablet', 'mobile'];
    const data: DataPoint[] = [];
    

    for (let i = 0; i < 500; i++) {
      const page = pages[Math.floor(Math.random() * pages.length)];
      const device = devices[Math.floor(Math.random() * devices.length)];
      const timestamp = new Date();
      timestamp.setDate(timestamp.getDate() - Math.floor(Math.random() * 30));
      timestamp.setHours(Math.floor(Math.random() * 24));
      
      data.push({
        type: 'click',
        x: Math.floor(Math.random() * HEATMAP_WIDTH),
        y: Math.floor(Math.random() * HEATMAP_HEIGHT),
        page,
        device,
        timestamp,
        value: Math.floor(Math.random() * 10) + 1
      });
    }
    

    for (let i = 0; i < 300; i++) {
      const page = pages[Math.floor(Math.random() * pages.length)];
      const device = devices[Math.floor(Math.random() * devices.length)];
      const timestamp = new Date();
      timestamp.setDate(timestamp.getDate() - Math.floor(Math.random() * 30));
      timestamp.setHours(Math.floor(Math.random() * 24));
      
      data.push({
        type: 'scroll',
        x: Math.floor(Math.random() * HEATMAP_WIDTH),
        y: Math.floor(Math.random() * HEATMAP_HEIGHT),
        page,
        device,
        timestamp,
        value: Math.floor(Math.random() * 5) + 1
      });
    }
    

    for (let i = 0; i < 100; i++) {
      const page = pages[Math.floor(Math.random() * pages.length)];
      const device = devices[Math.floor(Math.random() * devices.length)];
      const timestamp = new Date();
      timestamp.setDate(timestamp.getDate() - Math.floor(Math.random() * 30));
      timestamp.setHours(Math.floor(Math.random() * 24));
      
      data.push({
        type: 'submission',
        x: Math.floor(Math.random() * HEATMAP_WIDTH),
        y: Math.floor(Math.random() * HEATMAP_HEIGHT),
        page,
        device,
        timestamp,
        value: Math.floor(Math.random() * 3) + 1
      });
    }
    
    return data;
  }, []);


  useEffect(() => {
    setDummyData(generateDummyData());
  }, [generateDummyData]);


  const showToast = useCallback((message: string, type: ToastProps['type'] = 'info') => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast: ToastProps = { message, type, id };
    
    setToasts(prev => [...prev, newToast]);
    
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, 5000);
  }, []);


  const applyFilters = useCallback((data: DataPoint[]): DataPoint[] => {
    return data.filter(item => {

      if (item.type === 'click' && !metricFilters.clicks) return false;
      if (item.type === 'scroll' && !metricFilters.scrolls) return false;
      if (item.type === 'submission' && !metricFilters.submissions) return false;
      

      if (item.device === 'desktop' && !deviceFilters.desktop) return false;
      if (item.device === 'tablet' && !deviceFilters.tablet) return false;
      if (item.device === 'mobile' && !deviceFilters.mobile) return false;
      
 
      if (pageFilter !== 'all' && item.page !== pageFilter) return false;
      

      const today = new Date();
      const itemDate = new Date(item.timestamp);
      
      switch (timeRange) {
        case 'today':
          return itemDate.toDateString() === today.toDateString();
        case 'yesterday':
          const yesterday = new Date(today);
          yesterday.setDate(yesterday.getDate() - 1);
          return itemDate.toDateString() === yesterday.toDateString();
        case 'last7days':
          const lastWeek = new Date(today);
          lastWeek.setDate(lastWeek.getDate() - 7);
          return itemDate >= lastWeek;
        case 'thisMonth':
          return itemDate.getMonth() === today.getMonth() && 
                 itemDate.getFullYear() === today.getFullYear();
        case 'lastMonth':
          const lastMonth = new Date(today);
          lastMonth.setMonth(lastMonth.getMonth() - 1);
          return itemDate.getMonth() === lastMonth.getMonth() && 
                 itemDate.getFullYear() === lastMonth.getFullYear();
        case 'custom':
          const startDateValue = new Date(customDateRange.start);
          const endDateValue = new Date(customDateRange.end);
          endDateValue.setHours(23, 59, 59, 999);
          return itemDate >= startDateValue && itemDate <= endDateValue;
        default:
          return true;
      }
    });
  }, [metricFilters, deviceFilters, pageFilter, timeRange, customDateRange]);


  const generateAnalyticsData = useCallback(() => {
    const filteredData = applyFilters(dummyData);
    
 
    const timeData: TimeData[] = [];
    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (29 - i));
      return date;
    });

    last30Days.forEach(date => {
      const dayData = filteredData.filter(item => 
        new Date(item.timestamp).toDateString() === date.toDateString()
      );
      
      const clicks = dayData.filter(item => item.type === 'click').length;
      const scrolls = dayData.filter(item => item.type === 'scroll').length;
      const submissions = dayData.filter(item => item.type === 'submission').length;
      
      timeData.push({
        date: date.toLocaleDateString(),
        clicks,
        scrolls,
        submissions,
        total: clicks + scrolls + submissions
      });
    });


    const pageData: PageData[] = ['homepage', 'products', 'blog', 'checkout', 'contact'].map(page => {
      const pageItems = filteredData.filter(item => item.page === page);
      const clicks = pageItems.filter(item => item.type === 'click').length;
      const scrolls = pageItems.filter(item => item.type === 'scroll').length;
      const submissions = pageItems.filter(item => item.type === 'submission').length;
      
      return {
        page: page.charAt(0).toUpperCase() + page.slice(1),
        clicks,
        scrolls,
        submissions,
        total: clicks + scrolls + submissions
      };
    });


    const deviceData = ['desktop', 'tablet', 'mobile'].map(device => ({
      name: device.charAt(0).toUpperCase() + device.slice(1),
      value: filteredData.filter(item => item.device === device).length,
      color: device === 'desktop' ? '#4F46E5' : device === 'tablet' ? '#06B6D4' : '#10B981'
    }));

  
    const hourlyData = Array.from({ length: 24 }, (_, hour) => {
      const hourItems = filteredData.filter(item => 
        new Date(item.timestamp).getHours() === hour
      );
      return {
        hour: `${hour}:00`,
        activity: hourItems.length
      };
    });

    return { timeData, pageData, deviceData, hourlyData };
  }, [dummyData, applyFilters]);


  const updateHeatmap = useCallback(() => {
    if (!heatmapRef.current) return;

    const filteredData = applyFilters(dummyData);
    

    d3.select(heatmapRef.current).select('svg').remove();


    const svg = d3.select(heatmapRef.current)
      .append('svg')
      .attr('width', '100%')
      .attr('height', '100%')
      .attr('viewBox', `0 0 ${HEATMAP_WIDTH} ${HEATMAP_HEIGHT}`)
      .attr('preserveAspectRatio', 'xMidYMid meet');

    svgRef.current = svg.node();

 
    svg.append('rect')
      .attr('width', HEATMAP_WIDTH)
      .attr('height', HEATMAP_HEIGHT)
      .attr('fill', 'var(--surface)')
      .attr('stroke', 'var(--border)')
      .attr('stroke-width', 1);

  
    const heatmapG = svg.append('g');

    
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.5, 5])
      .on('zoom', (event) => {
        heatmapG.attr('transform', event.transform);
      });

    svg.call(zoom);
    zoomRef.current = zoom;

    
    addMockWebsiteElements(heatmapG);

   
    if (filteredData.length === 0) {
      showToast('No data matches the selected filters', 'warning');
      return; 
    }

  
    const tooltip = d3.select(tooltipRef.current!);
    
    heatmapG.selectAll('circle.heatmap-point')
      .data(filteredData)
      .enter()
      .append('circle')
      .attr('class', 'heatmap-point')
      .attr('cx', d => d.x)
      .attr('cy', d => d.y)
      .attr('r', 0)
      .attr('fill', d => {
        switch(d.type) {
          case 'click': return '#EF4444';
          case 'scroll': return '#3B82F6';
          case 'submission': return '#10B981';
          default: return '#64748B';
        }
      })
      .attr('opacity', 0)
      .transition()
      .duration(800)
      .delay((d, i) => (i % 10) * 20)
      .attr('r', d => d.value * 3)
      .attr('opacity', 0.7)
      .on('end', function() {
        d3.select(this)
          .on('mouseover', function(event, d) {
            d3.select(this)
              .transition()
              .duration(300)
              .attr('stroke', 'var(--text-primary)')
              .attr('stroke-width', 2)
              .attr('r', (d as DataPoint).value * 3.5);
            
            const format = d3.timeFormat('%b %d, %Y at %H:%M');
            tooltip
              .style('display', 'block')
              .html(`
                <div class="tooltip-content">
                  <div class="tooltip-header">${(d as DataPoint).type.charAt(0).toUpperCase() + (d as DataPoint).type.slice(1)}</div>
                  <div class="tooltip-item"><span>Page:</span> ${(d as DataPoint).page}</div>
                  <div class="tooltip-item"><span>Device:</span> ${(d as DataPoint).device}</div>
                  <div class="tooltip-item"><span>Intensity:</span> ${(d as DataPoint).value}</div>
                  <div class="tooltip-item"><span>Time:</span> ${format(new Date((d as DataPoint).timestamp))}</div>
                </div>
              `)
              .style('left', (event.pageX + 10) + 'px')
              .style('top', (event.pageY + 10) + 'px')
              .style('opacity', '0')
              .transition()
              .duration(300)
              .style('opacity', '1');
          })
          .on('mouseout', function(event, d) {
            d3.select(this)
              .transition()
              .duration(300)
              .attr('stroke', 'none')
              .attr('r', (d as DataPoint).value * 3);
            
            tooltip
              .transition()
              .duration(300)
              .style('opacity', '0')
              .on('end', () => tooltip.style('display', 'none'));
          });
      });
  }, [dummyData, applyFilters, showToast]);

  const addMockWebsiteElements = (heatmapG: d3.Selection<SVGGElement, unknown, null, undefined>) => {

    heatmapG.append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', HEATMAP_WIDTH)
      .attr('height', 80)
      .attr('fill', '#4F46E5')
      .attr('opacity', 0.1);


    heatmapG.append('rect')
      .attr('x', 30)
      .attr('y', 20)
      .attr('width', 150)
      .attr('height', 40)
      .attr('fill', '#4F46E5')
      .attr('opacity', 0.3)
      .attr('rx', 8);


    for (let i = 0; i < 5; i++) {
      heatmapG.append('rect')
        .attr('x', 400 + i * 120)
        .attr('y', 25)
        .attr('width', 100)
        .attr('height', 30)
        .attr('fill', '#6366F1')
        .attr('opacity', 0.2)
        .attr('rx', 6);
    }


    heatmapG.append('rect')
      .attr('x', 50)
      .attr('y', 120)
      .attr('width', HEATMAP_WIDTH - 100)
      .attr('height', 300)
      .attr('fill', '#8B5CF6')
      .attr('opacity', 0.1)
      .attr('rx', 12);


    heatmapG.append('rect')
      .attr('x', 200)
      .attr('y', 320)
      .attr('width', 180)
      .attr('height', 50)
      .attr('fill', '#8B5CF6')
      .attr('opacity', 0.4)
      .attr('rx', 25);


    for (let i = 0; i < 3; i++) {
      heatmapG.append('rect')
        .attr('x', 50 + i * 370)
        .attr('y', 460)
        .attr('width', 350)
        .attr('height', 200)
        .attr('fill', '#06B6D4')
        .attr('opacity', 0.1)
        .attr('rx', 12);
    }


    heatmapG.append('rect')
      .attr('x', 800)
      .attr('y', 200)
      .attr('width', 300)
      .attr('height', 400)
      .attr('fill', '#E5E7EB')
      .attr('opacity', 0.2)
      .attr('rx', 12);


    for (let i = 0; i < 4; i++) {
      heatmapG.append('rect')
        .attr('x', 830)
        .attr('y', 250 + i * 70)
        .attr('width', 240)
        .attr('height', 50)
        .attr('fill', 'white')
        .attr('stroke', '#D1D5DB')
        .attr('stroke-width', 1)
        .attr('rx', 8);
    }

 
    heatmapG.append('rect')
      .attr('x', 830)
      .attr('y', 530)
      .attr('width', 240)
      .attr('height', 50)
      .attr('fill', '#10B981')
      .attr('opacity', 0.4)
      .attr('rx', 8);


    heatmapG.append('rect')
      .attr('x', 0)
      .attr('y', HEATMAP_HEIGHT - 80)
      .attr('width', HEATMAP_WIDTH)
      .attr('height', 80)
      .attr('fill', '#374151')
      .attr('opacity', 0.1);
  };


  useEffect(() => {
    if (dummyData.length > 0) {
      updateHeatmap();
    }
  }, [dummyData, updateHeatmap]);


  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (showMobileMenu && !target.closest('.nav-actions') && !target.closest('.mobile-menu-btn')) {
        setShowMobileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMobileMenu]);

  // Handle body scroll when modals are open
  useEffect(() => {
    const isAnyModalOpen = showExportModal || showReportsModal;
    
    if (typeof window !== 'undefined') {
      if (isAnyModalOpen) {
        // Store current scroll position
        const scrollY = window.scrollY;
        document.body.style.top = `-${scrollY}px`;
        document.body.classList.add('modal-open');
      } else {
        // Restore scroll position
        const scrollY = document.body.style.top;
        document.body.classList.remove('modal-open');
        document.body.style.top = '';
        if (scrollY) {
          window.scrollTo(0, parseInt(scrollY || '0') * -1);
        }
      }
    }
    
    // Cleanup function
    return () => {
      if (typeof window !== 'undefined') {
        document.body.classList.remove('modal-open');
        document.body.style.top = '';
      }
    };
  }, [showExportModal, showReportsModal]);


  const exportData = async (format: 'csv' | 'json' | 'png') => {
    const filteredData = applyFilters(dummyData);
    
    setTimeout(() => {
      let downloadLink: string;
      let filename: string;
      
      switch(format) {
        case 'csv':
          const csvRows = [];
          csvRows.push(['Type', 'X', 'Y', 'Page', 'Device', 'Timestamp', 'Value'].join(','));
          
          filteredData.forEach(item => {
            const row = [
              item.type,
              item.x,
              item.y,
              item.page,
              item.device,
              new Date(item.timestamp).toISOString(),
              item.value
            ];
            csvRows.push(row.join(','));
          });
          
          const csvString = csvRows.join('\n');
          const csvBlob = new Blob([csvString], { type: 'text/csv' });
          downloadLink = URL.createObjectURL(csvBlob);
          filename = 'heatmap-data.csv';
          break;
          
        case 'json':
          const jsonString = JSON.stringify(filteredData, null, 2);
          const jsonBlob = new Blob([jsonString], { type: 'application/json' });
          downloadLink = URL.createObjectURL(jsonBlob);
          filename = 'heatmap-data.json';
          break;
          
        case 'png':
          if (svgRef.current) {
            const svgElement = svgRef.current;
            const svgData = new XMLSerializer().serializeToString(svgElement);
            const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
            const svgUrl = URL.createObjectURL(svgBlob);
            
            const img = new Image();
            img.onload = () => {
              const canvas = document.createElement('canvas');
              canvas.width = HEATMAP_WIDTH;
              canvas.height = HEATMAP_HEIGHT;
              
              const ctx = canvas.getContext('2d')!;
        
              ctx.fillStyle = '#ffffff';
              ctx.fillRect(0, 0, HEATMAP_WIDTH, HEATMAP_HEIGHT);
              
            
              ctx.drawImage(img, 0, 0, HEATMAP_WIDTH, HEATMAP_HEIGHT);
              
              const pngUrl = canvas.toDataURL('image/png');
              const downloadElement = document.createElement('a');
              downloadElement.href = pngUrl;
              downloadElement.download = 'heatmap.png';
              document.body.appendChild(downloadElement);
              downloadElement.click();
              document.body.removeChild(downloadElement);
              
              URL.revokeObjectURL(svgUrl);
              setShowExportModal(false);
              showToast('Heatmap image exported successfully!', 'success');
            };
            
            img.onerror = () => {
              showToast('Failed to export image. Please try again.', 'error');
              URL.revokeObjectURL(svgUrl);
            };
            
            img.src = svgUrl;
            return;
          }
          return;
      }
      
      const downloadElement = document.createElement('a');
      downloadElement.href = downloadLink;
      downloadElement.download = filename;
      document.body.appendChild(downloadElement);
      downloadElement.click();
      document.body.removeChild(downloadElement);
      
      URL.revokeObjectURL(downloadLink);
      setShowExportModal(false);
      showToast(`Data exported as ${format.toUpperCase()} successfully!`, 'success');
    }, 1500);
  };


  const handleZoomIn = () => {
    if (svgRef.current && zoomRef.current) {
      d3.select(svgRef.current).transition().call(zoomRef.current.scaleBy, 1.3);
    }
  };

  const handleZoomOut = () => {
    if (svgRef.current && zoomRef.current) {
      d3.select(svgRef.current).transition().call(zoomRef.current.scaleBy, 0.7);
    }
  };

  const handleResetView = () => {
    if (svgRef.current && zoomRef.current) {
      d3.select(svgRef.current).transition().call(zoomRef.current.transform, d3.zoomIdentity);
    }
  };


  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setDummyData(generateDummyData());
      setIsRefreshing(false);
      showToast('Heatmap refreshed with new data', 'success');
    }, 1500);
  };


  useEffect(() => {
    if (dummyData.length > 0) {
      updateHeatmap();
    }
  }, [metricFilters, deviceFilters, pageFilter, timeRange, customDateRange, updateHeatmap]);


  const handleTimeRangeChange = (value: string) => {
    setTimeRange(value);
    setShowCustomDate(value === 'custom');
  };

  return (
    <>
      <style jsx global>{`
        :root {
          --primary: #4F46E5;
          --primary-hover: #4338CA;
          --secondary: #06B6D4;
          --success: #10B981;
          --warning: #F59E0B;
          --error: #EF4444;
          --background: #FAFAFA;
          --surface: #FFFFFF;
          --surface-hover: #F8FAFC;
          --text-primary: #111827;
          --text-secondary: #6B7280;
          --text-muted: #9CA3AF;
          --border: #E5E7EB;
          --border-focus: #3B82F6;
          --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
          --shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
          --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
          --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
        }

        [data-theme="dark"] {
          --primary: #6366F1;
          --primary-hover: #5B21B6;
          --secondary: #06B6D4;
          --success: #10B981;
          --warning: #F59E0B;
          --error: #EF4444;
          --background: #0F172A;
          --surface: #1E293B;
          --surface-hover: #334155;
          --text-primary: #F1F5F9;
          --text-secondary: #E2E8F0;
          --text-muted: #94A3B8;
          --border: #475569;
          --border-focus: #60A5FA;
          --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.25);
          --shadow: 0 1px 3px 0 rgb(0 0 0 / 0.3), 0 1px 2px -1px rgb(0 0 0 / 0.3);
          --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.3), 0 2px 4px -2px rgb(0 0 0 / 0.3);
          --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.3), 0 4px 6px -4px rgb(0 0 0 / 0.3);
        }

        [data-theme="dark"] .btn-primary {
          background-color: #6366F1;
          color: #FFFFFF;
          border: 1px solid #6366F1;
        }

        [data-theme="dark"] .btn-primary:hover {
          background-color: #5B21B6;
          border-color: #5B21B6;
        }

        [data-theme="dark"] .btn-secondary {
          background-color: transparent;
          color: #E2E8F0;
          border: 1px solid #475569;
        }

        [data-theme="dark"] .btn-secondary:hover {
          background-color: #334155;
          border-color: #60A5FA;
          color: #F1F5F9;
        }

        [data-theme="dark"] .form-select {
          background-color: #1E293B;
          color: #F1F5F9;
          border-color: #475569;
        }

        [data-theme="dark"] .form-select:focus {
          border-color: #60A5FA;
          box-shadow: 0 0 0 3px rgb(96 165 250 / 0.1);
        }

        [data-theme="dark"] .date-input {
          background-color: #1E293B;
          color: #F1F5F9;
          border-color: #475569;
        }

        [data-theme="dark"] .date-input:focus {
          border-color: #60A5FA;
          box-shadow: 0 0 0 3px rgb(96 165 250 / 0.1);
        }

        [data-theme="dark"] .checkbox {
          background-color: #1E293B;
          border-color: #475569;
        }

        [data-theme="dark"] .checkbox.checked {
          background-color: #6366F1;
          border-color: #6366F1;
        }

        [data-theme="dark"] .stat-value {
          color: #F8FAFC;
        }

        [data-theme="dark"] .stat-title {
          color: #CBD5E1;
        }

        [data-theme="dark"] .recharts-legend-item-text {
          color: #E2E8F0 !important;
        }

        [data-theme="dark"] .recharts-tooltip-wrapper {
          background-color: #1E293B !important;
          border: 1px solid #475569 !important;
          border-radius: 8px !important;
          box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.5) !important;
        }

        [data-theme="dark"] .recharts-default-tooltip {
          background-color: #1E293B !important;
          border: 1px solid #475569 !important;
          color: #F1F5F9 !important;
        }

        [data-theme="dark"] .recharts-tooltip-label {
          color: #F1F5F9 !important;
        }

        [data-theme="dark"] .recharts-tooltip-item {
          color: #E2E8F0 !important;
        }

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background-color: var(--background);
          color: var(--text-primary);
          line-height: 1.5;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        .app-container {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }

        .header {
          background-color: var(--surface);
          border-bottom: 1px solid var(--border);
          padding: 1rem 2rem;
          position: sticky;
          top: 0;
          z-index: 50;
          backdrop-filter: blur(8px);
        }

        .header-content {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-weight: 700;
          font-size: 1.5rem;
          color: var(--primary);
        }

        .logo-icon {
          width: 32px;
          height: 32px;
          background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .nav-actions {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.625rem 1rem;
          font-size: 0.875rem;
          font-weight: 500;
          border-radius: 8px;
          border: none;
          cursor: pointer;
          transition: all 0.2s ease;
          white-space: nowrap;
        }

        .btn-primary {
          background-color: var(--primary);
          color: white;
        }

        .btn-primary:hover {
          background-color: var(--primary-hover);
          transform: translateY(-1px);
          box-shadow: var(--shadow-md);
        }

        .btn-secondary {
          background-color: transparent;
          color: var(--text-secondary);
          border: 1px solid var(--border);
        }

        .btn-secondary:hover {
          background-color: var(--surface-hover);
          border-color: var(--border-focus);
          color: var(--text-primary);
        }

        .btn-icon {
          background: none;
          border: none;
          color: var(--text-secondary);
          cursor: pointer;
          padding: 0.5rem;
          border-radius: 6px;
          transition: all 0.2s ease;
        }

        .btn-icon:hover {
          background-color: var(--surface-hover);
          color: var(--text-primary);
        }

        .mobile-menu-btn {
          display: none;
        }

        .main-content {
          flex: 1;
          padding: 2rem;
          width: 100%;
        }

        .dashboard-grid {
          display: grid;
          grid-template-columns: 280px 1fr;
          gap: 2rem;
          height: calc(100vh - 140px);
        }

        .sidebar {
          background-color: var(--surface);
          border-radius: 12px;
          border: 1px solid var(--border);
          padding: 1.5rem;
          overflow-y: auto;
          box-shadow: var(--shadow-sm);
        }

        .sidebar-section {
          margin-bottom: 2rem;
        }

        .sidebar-section:last-child {
          margin-bottom: 0;
        }

        .sidebar-title {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 1rem;
          text-transform: uppercase;
          letter-spacing: 0.025em;
        }

        .filter-group {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .checkbox-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          cursor: pointer;
          padding: 0.5rem;
          border-radius: 6px;
          transition: background-color 0.2s ease;
          user-select: none;
        }

        .checkbox-item:hover {
          background-color: var(--surface-hover);
        }

        .checkbox {
          width: 18px;
          height: 18px;
          border: 2px solid var(--border);
          border-radius: 4px;
          position: relative;
          background-color: var(--surface);
          transition: all 0.2s ease;
        }

        .checkbox.checked {
          background-color: var(--primary);
          border-color: var(--primary);
        }

        .checkbox.checked::after {
          content: '✓';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          color: white;
          font-size: 12px;
          font-weight: bold;
        }

        .metric-indicator {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .metric-indicator.clicks {
          background-color: #EF4444;
        }

        .metric-indicator.scrolls {
          background-color: #3B82F6;
        }

        .metric-indicator.submissions {
          background-color: #10B981;
        }

        .form-select {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid var(--border);
          border-radius: 8px;
          background-color: var(--surface);
          color: var(--text-primary);
          font-size: 0.875rem;
          transition: all 0.2s ease;
        }

        .form-select:focus {
          outline: none;
          border-color: var(--border-focus);
          box-shadow: 0 0 0 3px rgb(59 130 246 / 0.1);
        }

        .date-inputs {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          margin-top: 0.75rem;
        }

        .date-input {
          padding: 0.75rem;
          border: 1px solid var(--border);
          border-radius: 8px;
          background-color: var(--surface);
          color: var(--text-primary);
          font-size: 0.875rem;
        }

        .heatmap-section {
          background-color: var(--surface);
          border-radius: 12px;
          border: 1px solid var(--border);
          display: flex;
          flex-direction: column;
          box-shadow: var(--shadow-sm);
          overflow: hidden;
        }

        .heatmap-header {
          padding: 1.5rem 2rem;
          border-bottom: 1px solid var(--border);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .heatmap-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        .heatmap-subtitle {
          font-size: 0.875rem;
          color: var(--text-secondary);
          margin-top: 0.25rem;
        }

        .heatmap-controls {
          display: flex;
          gap: 0.5rem;
        }

        .heatmap-body {
          flex: 1;
          position: relative;
          overflow: hidden;
        }

        .heatmap-container {
          width: 100%;
          height: 100%;
          position: relative;
        }

        .heatmap-legend {
          position: absolute;
          bottom: 1rem;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          align-items: center;
          gap: 1rem;
          background-color: var(--surface);
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          border: 1px solid var(--border);
          box-shadow: var(--shadow);
        }

        .legend-gradient {
          width: 120px;
          height: 12px;
          border-radius: 6px;
          background: linear-gradient(to right, #EF4444, #3B82F6, #10B981);
        }

        .legend-label {
          font-size: 0.75rem;
          color: var(--text-secondary);
          font-weight: 500;
        }

        .tooltip {
          position: fixed;
          background-color: var(--surface);
          border: 1px solid var(--border);
          border-radius: 8px;
          box-shadow: var(--shadow-lg);
          z-index: 1000;
          pointer-events: none;
          display: none;
          backdrop-filter: blur(8px);
        }

        .tooltip-content {
          padding: 1rem;
          background-color: var(--surface);
          border-radius: 8px;
        }

        .tooltip-header {
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 0.5rem;
          font-size: 0.9375rem;
        }

        .tooltip-item {
          display: flex;
          justify-content: space-between;
          font-size: 0.875rem;
          margin-bottom: 0.25rem;
          min-width: 200px;
        }

        .tooltip-item span:first-child {
          color: var(--text-secondary);
          margin-right: 1rem;
          font-weight: 500;
        }

        .tooltip-item span:last-child {
          color: var(--text-primary);
          font-weight: 600;
        }

        [data-theme="dark"] .tooltip {
          background-color: #1E293B;
          border-color: #475569;
          box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.5), 0 4px 6px -4px rgb(0 0 0 / 0.5);
        }

        [data-theme="dark"] .tooltip-content {
          background-color: #1E293B;
        }

        [data-theme="dark"] .tooltip-header {
          color: #F1F5F9;
        }

        [data-theme="dark"] .tooltip-item span:first-child {
          color: #E2E8F0;
        }

        [data-theme="dark"] .tooltip-item span:last-child {
          color: #F8FAFC;
        }

        .modal-overlay {
          position: fixed;
          inset: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 100;
          opacity: 0;
          visibility: hidden;
          transition: all 0.3s ease;
          overflow-y: auto;
          padding: 1rem;
          box-sizing: border-box;
        }

        .modal-overlay.active {
          opacity: 1;
          visibility: visible;
        }

        .modal {
          background-color: var(--surface);
          border-radius: 12px;
          border: 1px solid var(--border);
          box-shadow: var(--shadow-lg);
          max-width: min(90vw, 600px);
          max-height: min(90vh, 700px);
          width: 100%;
          overflow: hidden;
          transform: scale(0.95);
          opacity: 0;
          transition: all 0.3s ease;
          position: relative;
          margin: auto;
        }

        .modal-overlay.active .modal {
          transform: scale(1);
          opacity: 1;
        }

        .modal-header {
          padding: 1.5rem 2rem;
          border-bottom: 1px solid var(--border);
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: relative;
        }

        .modal-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--text-primary);
          margin: 0;
          flex: 1;
        }

        .modal-header .btn-icon {
          position: absolute;
          top: 0.75rem;
          right: 0.75rem;
          width: 40px;
          height: 40px;
          background: transparent;
          border: none;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-muted);
          transition: all 0.2s ease;
          cursor: pointer;
        }

        .modal-header .btn-icon:hover {
          background: var(--surface-hover);
          color: var(--text-primary);
          transform: scale(1.1);
        }

        .modal-header .btn-icon:active {
          transform: scale(0.95);
        }

        .modal-header .btn-icon svg {
          width: 22px;
          height: 22px;
          stroke-width: 2.5;
        }

        .modal-body {
          padding: 2rem;
          overflow-y: auto;
        }

        .export-options {
          display: grid;
          gap: 1rem;
        }

        .export-option {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1.5rem;
          border: 1px solid var(--border);
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .export-option:hover {
          border-color: var(--primary);
          background-color: var(--surface-hover);
        }

        .export-icon {
          width: 48px;
          height: 48px;
          background-color: var(--primary);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .export-details h4 {
          font-weight: 600;
          margin-bottom: 0.25rem;
        }

        .export-details p {
          font-size: 0.875rem;
          color: var(--text-secondary);
        }

        .reports-modal {
          max-width: min(95vw, 1200px);
          max-height: min(90vh, 800px);
          width: 100%;
          height: auto;
        }

        .reports-tabs {
          display: flex;
          border-bottom: 1px solid var(--border);
          overflow-x: auto;
          scrollbar-width: none;
          -ms-overflow-style: none;
        }

        .reports-tabs::-webkit-scrollbar {
          display: none;
        }

        .tab-button {
          padding: 1rem 1.5rem;
          border: none;
          background: none;
          color: var(--text-secondary);
          font-weight: 500;
          cursor: pointer;
          border-bottom: 2px solid transparent;
          transition: all 0.2s ease;
          white-space: nowrap;
          flex-shrink: 0;
        }

        .tab-button.active {
          color: var(--primary);
          border-bottom-color: var(--primary);
        }

        .tab-content {
          padding: 2rem;
          height: calc(90vh - 140px);
          overflow-y: auto;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .stat-card {
          background-color: var(--surface);
          border: 1px solid var(--border);
          border-radius: 8px;
          padding: 1.5rem;
          box-shadow: var(--shadow-sm);
        }

        .stat-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1rem;
        }

        .stat-title {
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--text-secondary);
        }

        .stat-value {
          font-size: 2rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .stat-change {
          font-size: 0.875rem;
          font-weight: 500;
        }

        .stat-change.positive {
          color: var(--success);
        }

        .stat-change.negative {
          color: var(--error);
        }

        .chart-container {
          background-color: var(--surface);
          border: 1px solid var(--border);
          border-radius: 8px;
          padding: 1.5rem;
          margin-bottom: 2rem;
          box-shadow: var(--shadow-sm);
        }

        .chart-title {
          font-size: 1.125rem;
          font-weight: 600;
          margin-bottom: 1rem;
          color: var(--text-primary);
        }

        .toast-container {
          position: fixed;
          bottom: 2rem;
          right: 2rem;
          z-index: 200;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .toast {
          background-color: var(--surface);
          border: 1px solid var(--border);
          border-radius: 8px;
          padding: 1rem 1.25rem;
          box-shadow: var(--shadow-lg);
          display: flex;
          align-items: center;
          gap: 0.75rem;
          min-width: 300px;
          transform: translateX(400px);
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .toast.show {
          transform: translateX(0);
        }

        .toast-icon {
          flex-shrink: 0;
        }

        .toast.success .toast-icon {
          color: var(--success);
        }

        .toast.warning .toast-icon {
          color: var(--warning);
        }

        .toast.error .toast-icon {
          color: var(--error);
        }

        .toast.info .toast-icon {
          color: var(--primary);
        }

        .toast-message {
          flex: 1;
          font-size: 0.875rem;
          font-weight: 500;
        }

        .loading-spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          border-top-color: white;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        @media (max-width: 1024px) {
          .dashboard-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
            height: auto;
          }

          .sidebar {
            order: 2;
            height: auto;
            max-height: none;
          }

          .heatmap-section {
            order: 1;
            height: 60vh;
            min-height: 500px;
          }
        }

        @media (max-width: 768px) {
          .main-content {
            padding: 1rem;
          }

          .header {
            padding: 1rem;
          }

          .mobile-menu-btn {
            display: flex;
          }

          .nav-actions.mobile-hidden {
            display: none;
          }

          .nav-actions.mobile-show {
            position: absolute;
            top: 100%;
            right: 0;
            background-color: var(--surface);
            border: 1px solid var(--border);
            border-radius: 8px;
            padding: 1rem;
            box-shadow: var(--shadow-lg);
            flex-direction: column;
            align-items: stretch;
            gap: 0.75rem;
            z-index: 100;
            min-width: 200px;
            display: flex;
          }

          .nav-actions .btn {
            padding: 0.75rem 1rem;
            font-size: 0.875rem;
            width: 100%;
            justify-content: center;
          }

          .stats-grid {
            grid-template-columns: 1fr;
            gap: 1rem;
          }

          .modal {
            margin: 1rem;
            max-width: calc(100vw - 2rem);
            max-height: calc(100vh - 2rem);
          }

          .reports-modal {
            width: calc(100vw - 2rem);
            height: calc(100vh - 2rem);
          }

          .tab-button {
            padding: 0.75rem 1rem;
            font-size: 0.875rem;
          }

          .tab-content {
            padding: 1rem;
            height: calc(90vh - 120px);
          }

          .stats-grid {
            grid-template-columns: 1fr;
            gap: 1rem;
          }

          .chart-container {
            margin-bottom: 1.5rem;
            padding: 1rem;
          }

          .chart-title {
            font-size: 1rem;
            margin-bottom: 0.75rem;
          }

          .chart-container > div {
            display: grid;
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }

          .chart-container .recharts-wrapper {
            width: 100% !important;
          }

          .modal-overlay {
            padding: 0.75rem;
            align-items: flex-start;
            padding-top: 10vh;
          }

          .modal {
            max-width: 100%;
            max-height: 85vh;
            margin: 0;
            border-radius: 12px 12px 0 0;
          }

          .reports-modal {
            max-width: 100%;
            max-height: 85vh;
            margin: 0;
          }

          .modal-header {
            padding: 0.75rem;
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
          }

          .modal-header .btn-icon {
            top: 0.5rem;
            right: 0.5rem;
            width: 36px;
            height: 36px;
          }

          .modal-header .btn-icon svg {
            width: 20px;
            height: 20px;
          }

          .modal-body {
            padding: 1rem;
            max-height: calc(85vh - 120px);
            overflow-y: auto;
          }

          .tab-content {
            padding: 1rem;
            height: auto;
            max-height: calc(85vh - 180px);
            overflow-y: auto;
          }
        }

        @media (max-width: 480px) {
          .tab-button {
            padding: 0.5rem 0.75rem;
            font-size: 0.8125rem;
          }

          .tab-content {
            padding: 0.75rem;
          }

          .chart-container {
            padding: 0.75rem;
            margin-bottom: 1rem;
          }

          .chart-title {
            font-size: 0.9375rem;
          }

          .stat-card {
            padding: 1rem;
          }

          .stat-value {
            font-size: 1.5rem;
          }

          .dashboard-grid {
            gap: 1rem;
          }

          .sidebar {
            padding: 1rem;
          }

          .heatmap-section {
            height: 50vh;
            min-height: 400px;
          }

          .heatmap-header {
            padding: 1rem;
          }

          .heatmap-controls {
            flex-wrap: wrap;
            gap: 0.25rem;
          }

          .heatmap-controls .btn {
            flex: 1;
            min-width: 80px;
            padding: 0.5rem 0.75rem;
            font-size: 0.75rem;
          }

          .logo {
            font-size: 1.25rem;
          }

          .logo-icon {
            width: 28px;
            height: 28px;
          }

          .modal-overlay {
            padding: 0.5rem;
            padding-top: 5vh;
          }

          .modal {
            max-height: 90vh;
            border-radius: 8px;
          }

          .reports-modal {
            max-height: 90vh;
          }

          .modal-header {
            padding: 0.75rem;
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
          }

          .modal-header .btn-icon {
            top: 0.5rem;
            right: 0.5rem;
            width: 36px;
            height: 36px;
          }

          .modal-header .btn-icon svg {
            width: 20px;
            height: 20px;
          }

          .modal-body {
            padding: 0.75rem;
            max-height: calc(90vh - 100px);
          }

          .tab-content {
            padding: 0.75rem;
            max-height: calc(90vh - 160px);
          }
        }

        @media (min-width: 769px) {
          .mobile-menu-btn {
            display: none;
          }

          .nav-actions {
            display: flex !important;
            position: static !important;
            background: none !important;
            border: none !important;
            box-shadow: none !important;
            flex-direction: row !important;
            gap: 1rem !important;
            padding: 0 !important;
            min-width: auto !important;
          }
        }

        @media (max-width: 480px) {
          .header {
            padding: 0.75rem;
          }

          .main-content {
            padding: 0.75rem;
          }

          .dashboard-grid {
            gap: 0.75rem;
          }

          .sidebar, .heatmap-section {
            border-radius: 8px;
            padding: 1rem;
          }

          .heatmap-header {
            padding: 0.75rem;
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }

          .heatmap-title {
            font-size: 1.125rem;
          }

          .heatmap-subtitle {
            font-size: 0.8125rem;
          }

          .heatmap-controls {
            width: 100%;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 0.5rem;
          }

          .heatmap-controls .btn:last-child {
            grid-column: 1 / -1;
          }

          .sidebar-section {
            margin-bottom: 1.5rem;
          }

          .filter-group {
            gap: 0.5rem;
          }

          .checkbox-item {
            padding: 0.75rem 0.5rem;
          }
        }

        .recharts-legend-wrapper {
          padding-top: 1rem !important;
        }

        .recharts-legend-item {
          margin-right: 1rem !important;
          margin-bottom: 0.5rem !important;
        }

        .recharts-legend-item-text {
          font-size: 0.875rem !important;
          color: var(--text-primary) !important;
          font-weight: 500 !important;
        }

        @media (max-width: 768px) {
          .recharts-legend-wrapper {
            padding-top: 0.75rem !important;
          }

          .recharts-legend-item {
            margin-right: 0.5rem !important;
            margin-bottom: 0.25rem !important;
          }

          .recharts-legend-item-text {
            font-size: 0.75rem !important;
          }

          .chart-container .recharts-wrapper {
            font-size: 0.75rem !important;
          }
        }

        @media (max-width: 480px) {
          .recharts-legend-wrapper {
            padding-top: 0.5rem !important;
          }

          .recharts-legend-item {
            margin-right: 0.25rem !important;
            margin-bottom: 0.25rem !important;
          }

          .recharts-legend-item-text {
            font-size: 0.6875rem !important;
          }
        }

        body.modal-open {
          overflow: hidden;
          position: fixed;
          width: 100%;
          height: 100%;
        }

        .modal-overlay {
          position: fixed;
          inset: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 100;
          opacity: 0;
          visibility: hidden;
          transition: all 0.3s ease;
          overflow-y: auto;
          padding: 1rem;
          box-sizing: border-box;
        }

        @media (min-height: 600px) {
          .modal-overlay {
            align-items: center;
            padding-top: 1rem;
          }
        }

        @media (min-width: 769px) {
          .mobile-menu-btn {
            display: none;
          }

          .nav-actions {
            display: flex !important;
            position: static !important;
            background: none !important;
            border: none !important;
            box-shadow: none !important;
            flex-direction: row !important;
            gap: 1rem !important;
            padding: 0 !important;
            min-width: auto !important;
          }
        }

        @media (max-width: 768px) {
          .heatmap-section {
            height: 70vh;
            min-height: 500px;
          }

          .heatmap-header {
            padding: 1rem;
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }

          .heatmap-title {
            font-size: 1.125rem;
            line-height: 1.3;
          }

          .heatmap-subtitle {
            font-size: 0.8125rem;
            margin-top: 0.25rem;
          }

          .heatmap-controls {
            width: 100%;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 0.75rem;
          }

          .heatmap-controls .btn:last-child {
            grid-column: 1 / -1;
          }

          .heatmap-controls .btn {
            padding: 0.75rem 1rem;
            font-size: 0.875rem;
            font-weight: 500;
            min-height: 44px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
          }

          .heatmap-body {
            position: relative;
            overflow: hidden;
          }

          .heatmap-container {
            width: 100%;
            height: 100%;
            min-height: 400px;
          }

          .heatmap-legend {
            position: absolute;
            bottom: 1rem;
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            align-items: center;
            gap: 0.75rem;
            background-color: var(--surface);
            padding: 0.75rem 1rem;
            border-radius: 8px;
            border: 1px solid var(--border);
            box-shadow: var(--shadow);
            max-width: calc(100% - 2rem);
            flex-wrap: wrap;
            justify-content: center;
          }

          .legend-gradient {
            width: 80px;
            height: 10px;
            border-radius: 5px;
            background: linear-gradient(to right, #EF4444, #3B82F6, #10B981);
          }

          .legend-label {
            font-size: 0.75rem;
            color: var(--text-secondary);
            font-weight: 500;
            white-space: nowrap;
          }

          .recharts-legend-wrapper {
            padding-top: 0.75rem !important;
          }

          .recharts-legend-item {
            margin-right: 0.5rem !important;
            margin-bottom: 0.25rem !important;
          }

          .recharts-legend-item-text {
            font-size: 0.75rem !important;
          }

          .chart-container .recharts-wrapper {
            font-size: 0.75rem !important;
          }
        }

        @media (max-width: 480px) {
          .heatmap-section {
            height: 60vh;
            min-height: 450px;
            border-radius: 8px;
          }

          .heatmap-header {
            padding: 0.75rem;
            gap: 0.75rem;
          }

          .heatmap-title {
            font-size: 1rem;
          }

          .heatmap-subtitle {
            font-size: 0.75rem;
          }

          .heatmap-controls {
            gap: 0.5rem;
          }

          .heatmap-controls .btn {
            padding: 0.625rem 0.75rem;
            font-size: 0.8125rem;
            min-height: 42px;
          }

          .heatmap-controls .btn svg {
            width: 14px;
            height: 14px;
          }

          .heatmap-container {
            min-height: 350px;
          }

          .heatmap-legend {
            bottom: 0.75rem;
            padding: 0.5rem 0.75rem;
            gap: 0.5rem;
            max-width: calc(100% - 1.5rem);
          }

          .legend-gradient {
            width: 60px;
            height: 8px;
          }

          .legend-label {
            font-size: 0.6875rem;
          }

          .sidebar {
            padding: 1rem;
            border-radius: 8px;
          }

          .sidebar-section {
            margin-bottom: 1.5rem;
          }

          .filter-group {
            gap: 0.5rem;
          }

          .checkbox-item {
            padding: 0.75rem 0.5rem;
            border-radius: 6px;
          }

          .form-select, .date-input {
            padding: 0.75rem;
            font-size: 0.875rem;
          }

          .recharts-legend-wrapper {
            padding-top: 0.5rem !important;
          }

          .recharts-legend-item {
            margin-right: 0.25rem !important;
            margin-bottom: 0.25rem !important;
          }

          .recharts-legend-item-text {
            font-size: 0.6875rem !important;
          }
        }

        [data-theme="dark"] .modal-header .btn-icon {
          color: #94A3B8;
        }

        [data-theme="dark"] .modal-header .btn-icon:hover {
          background: #334155;
          color: #F1F5F9;
        }

        [data-theme="dark"] .recharts-tooltip-item {
          color: #E2E8F0 !important;
        }
      `}</style>

      <div className="app-container">
        <header className="header">
          <div className="header-content">
            <div className="logo">
              <div className="logo-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <path d="M3 3v18h18"/>
                  <rect x="7" y="12" width="3" height="7" rx="1"/>
                  <rect x="12" y="8" width="3" height="11" rx="1"/>
                  <rect x="17" y="5" width="3" height="14" rx="1"/>
                </svg>
              </div>
              HeatVision Pro
            </div>
            
            <button 
              className="btn-icon mobile-menu-btn" 
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              aria-label="Toggle menu"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="6" x2="21" y2="6"/>
                <line x1="3" y1="12" x2="21" y2="12"/>
                <line x1="3" y1="18" x2="21" y2="18"/>
              </svg>
            </button>
            
            <div className={`nav-actions ${showMobileMenu ? 'mobile-show' : 'mobile-hidden'}`}>
              <button className="btn btn-secondary" onClick={() => { setShowExportModal(true); setShowMobileMenu(false); }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="7 10 12 15 17 10"/>
                  <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                Export
              </button>
              
              <button className="btn btn-primary" onClick={() => { setShowReportsModal(true); setShowMobileMenu(false); }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 3v18h18"/>
                  <rect width="4" height="7" x="7" y="10" rx="1"/>
                  <rect width="4" height="12" x="13" y="5" rx="1"/>
                </svg>
                Analytics
              </button>
              
              <button className="btn btn-secondary" onClick={() => { handleRefresh(); setShowMobileMenu(false); }} disabled={isRefreshing}>
                {isRefreshing ? (
                  <div className="loading-spinner"></div>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
                    <path d="M21 3v5h-5"/>
                    <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
                    <path d="M8 16H3v5"/>
                  </svg>
                )}
                {isRefreshing ? 'Refreshing...' : 'Refresh'}
              </button>
              
              <button 
                className="btn-icon" 
                onClick={() => { setTheme(theme === 'dark' ? 'light' : 'dark'); setShowMobileMenu(false); }}
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="5"/>
                    <line x1="12" y1="1" x2="12" y2="3"/>
                    <line x1="12" y1="21" x2="12" y2="23"/>
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                    <line x1="1" y1="12" x2="3" y2="12"/>
                    <line x1="21" y1="12" x2="23" y2="12"/>
                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                  </svg>
                )}
              </button>
            </div>
          </div>
        </header>

        <main className="main-content">
          <div className="dashboard-grid">
            <aside className="sidebar">
              <div className="sidebar-section">
                <h3 className="sidebar-title">Metrics</h3>
                <div className="filter-group">
                  <div 
                    className="checkbox-item"
                    onClick={() => setMetricFilters(prev => ({ ...prev, clicks: !prev.clicks }))}
                  >
                    <div className={`checkbox ${metricFilters.clicks ? 'checked' : ''}`} />
                    <div className="metric-indicator clicks"></div>
                    <span>Clicks</span>
                  </div>
                  <div 
                    className="checkbox-item"
                    onClick={() => setMetricFilters(prev => ({ ...prev, scrolls: !prev.scrolls }))}
                  >
                    <div className={`checkbox ${metricFilters.scrolls ? 'checked' : ''}`} />
                    <div className="metric-indicator scrolls"></div>
                    <span>Scrolls</span>
                  </div>
                  <div 
                    className="checkbox-item"
                    onClick={() => setMetricFilters(prev => ({ ...prev, submissions: !prev.submissions }))}
                  >
                    <div className={`checkbox ${metricFilters.submissions ? 'checked' : ''}`} />
                    <div className="metric-indicator submissions"></div>
                    <span>Form Submissions</span>
                  </div>
                </div>
              </div>

              <div className="sidebar-section">
                <h3 className="sidebar-title">Time Range</h3>
                <select 
                  className="form-select" 
                  value={timeRange} 
                  onChange={(e) => handleTimeRangeChange(e.target.value)}
                >
                  <option value="today">Today</option>
                  <option value="yesterday">Yesterday</option>
                  <option value="last7days">Last 7 Days</option>
                  <option value="thisMonth">This Month</option>
                  <option value="lastMonth">Last Month</option>
                  <option value="custom">Custom Range</option>
                </select>
                {showCustomDate && (
                  <div className="date-inputs">
                    <input 
                      type="date" 
                      className="date-input"
                      value={customDateRange.start}
                      onChange={(e) => setCustomDateRange(prev => ({ ...prev, start: e.target.value }))}
                    />
                    <input 
                      type="date" 
                      className="date-input"
                      value={customDateRange.end}
                      onChange={(e) => setCustomDateRange(prev => ({ ...prev, end: e.target.value }))}
                    />
                  </div>
                )}
              </div>

              <div className="sidebar-section">
                <h3 className="sidebar-title">Page Filter</h3>
                <select 
                  className="form-select" 
                  value={pageFilter} 
                  onChange={(e) => setPageFilter(e.target.value)}
                >
                  <option value="all">All Pages</option>
                  <option value="homepage">Homepage</option>
                  <option value="products">Products</option>
                  <option value="blog">Blog</option>
                  <option value="checkout">Checkout</option>
                  <option value="contact">Contact</option>
                </select>
              </div>

              <div className="sidebar-section">
                <h3 className="sidebar-title">Device Type</h3>
                <div className="filter-group">
                  <div 
                    className="checkbox-item"
                    onClick={() => setDeviceFilters(prev => ({ ...prev, desktop: !prev.desktop }))}
                  >
                    <div className={`checkbox ${deviceFilters.desktop ? 'checked' : ''}`} />
                    <span>Desktop</span>
                  </div>
                  <div 
                    className="checkbox-item"
                    onClick={() => setDeviceFilters(prev => ({ ...prev, tablet: !prev.tablet }))}
                  >
                    <div className={`checkbox ${deviceFilters.tablet ? 'checked' : ''}`} />
                    <span>Tablet</span>
                  </div>
                  <div 
                    className="checkbox-item"
                    onClick={() => setDeviceFilters(prev => ({ ...prev, mobile: !prev.mobile }))}
                  >
                    <div className={`checkbox ${deviceFilters.mobile ? 'checked' : ''}`} />
                    <span>Mobile</span>
                  </div>
                </div>
              </div>
            </aside>

            <section className="heatmap-section">
              <div className="heatmap-header">
                <div>
                  <h2 className="heatmap-title">User Engagement Heatmap</h2>
                  <p className="heatmap-subtitle">Interactive visualization of user behavior patterns</p>
                </div>
                <div className="heatmap-controls">
                  <button className="btn btn-secondary" onClick={handleZoomIn}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="11" cy="11" r="8"/>
                      <path d="M21 21l-4.35-4.35"/>
                      <line x1="11" y1="8" x2="11" y2="14"/>
                      <line x1="8" y1="11" x2="14" y2="11"/>
                    </svg>
                    Zoom In
                  </button>
                  <button className="btn btn-secondary" onClick={handleZoomOut}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="11" cy="11" r="8"/>
                      <path d="M21 21l-4.35-4.35"/>
                      <line x1="8" y1="11" x2="14" y2="11"/>
                    </svg>
                    Zoom Out
                  </button>
                  <button className="btn btn-secondary" onClick={handleResetView}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                      <polyline points="9 22 9 12 15 12 15 22"/>
                    </svg>
                    Reset
                  </button>
                </div>
              </div>
              
              <div className="heatmap-body">
                <div className="heatmap-container" ref={heatmapRef}></div>
                <div className="heatmap-legend">
                  <span className="legend-label">Low Activity</span>
                  <div className="legend-gradient"></div>
                  <span className="legend-label">High Activity</span>
                </div>
              </div>
            </section>
          </div>
        </main>

    
        <div className={`modal-overlay ${showExportModal ? 'active' : ''}`}>
          <div className="modal">
            <div className="modal-header">
              <h3 className="modal-title">Export Data</h3>
              <button className="btn-icon" onClick={() => setShowExportModal(false)}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
            <div className="modal-body">
              <div className="export-options">
                <div className="export-option" onClick={() => exportData('csv')}>
                  <div className="export-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                      <polyline points="14 2 14 8 20 8"/>
                    </svg>
                  </div>
                  <div className="export-details">
                    <h4>Export as CSV</h4>
                    <p>Download raw data for spreadsheet analysis</p>
                  </div>
                </div>
                
                <div className="export-option" onClick={() => exportData('json')}>
                  <div className="export-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="16 18 22 12 16 6"/>
                      <polyline points="8 6 2 12 8 18"/>
                    </svg>
                  </div>
                  <div className="export-details">
                    <h4>Export as JSON</h4>
                    <p>Structured data for API integration</p>
                  </div>
                </div>
                
                <div className="export-option" onClick={() => exportData('png')}>
                  <div className="export-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                      <circle cx="8.5" cy="8.5" r="1.5"/>
                      <polyline points="21 15 16 10 5 21"/>
                    </svg>
                  </div>
                  <div className="export-details">
                    <h4>Export as Image</h4>
                    <p>Save heatmap visualization as PNG</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

     
        <div className={`modal-overlay ${showReportsModal ? 'active' : ''}`}>
          <div className="modal reports-modal">
            <div className="modal-header">
              <h3 className="modal-title">Analytics Dashboard</h3>
              <button className="btn-icon" onClick={() => setShowReportsModal(false)}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
            
            <div className="reports-tabs">
              <button 
                className={`tab-button ${activeReportTab === 'overview' ? 'active' : ''}`}
                onClick={() => setActiveReportTab('overview')}
              >
                Overview
              </button>
              <button 
                className={`tab-button ${activeReportTab === 'trends' ? 'active' : ''}`}
                onClick={() => setActiveReportTab('trends')}
              >
                Trends
              </button>
              <button 
                className={`tab-button ${activeReportTab === 'pages' ? 'active' : ''}`}
                onClick={() => setActiveReportTab('pages')}
              >
                Pages
              </button>
              <button 
                className={`tab-button ${activeReportTab === 'devices' ? 'active' : ''}`}
                onClick={() => setActiveReportTab('devices')}
              >
                Devices
              </button>
            </div>

            <div className="tab-content">
              {activeReportTab === 'overview' && (
                <OverviewTab data={generateAnalyticsData()} />
              )}
              {activeReportTab === 'trends' && (
                <TrendsTab data={generateAnalyticsData()} />
              )}
              {activeReportTab === 'pages' && (
                <PagesTab data={generateAnalyticsData()} />
              )}
              {activeReportTab === 'devices' && (
                <DevicesTab data={generateAnalyticsData()} />
              )}
            </div>
          </div>
        </div>

       
        <div ref={tooltipRef} className="tooltip"></div>

    
        <div className="toast-container">
          {toasts.map((toast) => (
            <div key={toast.id} className={`toast ${toast.type} show`}>
              <div className="toast-icon">
                {toast.type === 'success' && (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                    <polyline points="22 4 12 14.01 9 11.01"/>
                  </svg>
                )}
                {toast.type === 'warning' && (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                    <line x1="12" y1="9" x2="12" y2="13"/>
                    <line x1="12" y1="17" x2="12.01" y2="17"/>
                  </svg>
                )}
                {toast.type === 'error' && (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="15" y1="9" x2="9" y2="15"/>
                    <line x1="9" y1="9" x2="15" y2="15"/>
                  </svg>
                )}
                {toast.type === 'info' && (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="16" x2="12" y2="12"/>
                    <line x1="12" y1="8" x2="12.01" y2="8"/>
                  </svg>
                )}
              </div>
              <div className="toast-message">{toast.message}</div>
              <button 
                className="btn-icon" 
                onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};


const OverviewTab: React.FC<{ data: ReturnType<typeof WebsiteEngagementHeatmap.prototype.generateAnalyticsData> }> = ({ data }) => {
  const { timeData, pageData, deviceData } = data;
  
  const totalInteractions = timeData.reduce((sum: number, item: TimeData) => sum + item.total, 0);
  const totalClicks = timeData.reduce((sum: number, item: TimeData) => sum + item.clicks, 0);
  const totalScrolls = timeData.reduce((sum: number, item: TimeData) => sum + item.scrolls, 0);
  const totalSubmissions = timeData.reduce((sum: number, item: TimeData) => sum + item.submissions, 0);
  
  return (
    <>
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">Total Interactions</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4F46E5" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
          </div>
          <div className="stat-value">{totalInteractions.toLocaleString()}</div>
          <div className="stat-change positive">+12.5%</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">Total Clicks</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2">
              <path d="M9 9h6v6h-6z"/>
              <path d="M21 15V9a2 2 0 0 0-2-2H9"/>
            </svg>
          </div>
          <div className="stat-value">{totalClicks.toLocaleString()}</div>
          <div className="stat-change positive">+8.2%</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">Total Scrolls</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2">
              <path d="M8 3v3a2 2 0 0 1-2 2H3"/>
              <path d="M21 8h-3a2 2 0 0 1-2-2V3"/>
              <path d="M3 16h3a2 2 0 0 1 2 2v3"/>
              <path d="M16 21v-3a2 2 0 0 1 2-2h3"/>
            </svg>
          </div>
          <div className="stat-value">{totalScrolls.toLocaleString()}</div>
          <div className="stat-change positive">+15.7%</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">Form Submissions</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
            </svg>
          </div>
          <div className="stat-value">{totalSubmissions.toLocaleString()}</div>
          <div className="stat-change positive">+22.3%</div>
        </div>
      </div>

      <div className="chart-container">
        <h3 className="chart-title">Activity Overview (Last 30 Days)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={timeData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Area type="monotone" dataKey="clicks" stackId="1" stroke="#EF4444" fill="#EF4444" fillOpacity={0.3} />
            <Area type="monotone" dataKey="scrolls" stackId="1" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} />
            <Area type="monotone" dataKey="submissions" stackId="1" stroke="#10B981" fill="#10B981" fillOpacity={0.3} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        <div className="chart-container">
          <h3 className="chart-title">Device Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={deviceData}
                cx="50%"
                cy="45%"
                outerRadius={70}
                fill="#8884d8"
                dataKey="value"
              >
                {deviceData.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value: any) => [value, 'Users']} />
              <Legend 
                verticalAlign="bottom" 
                height={36}
                formatter={(value: string, entry: any) => `${value}: ${entry.payload.value} (${((entry.payload.value / deviceData.reduce((sum: number, d: any) => sum + d.value, 0)) * 100).toFixed(1)}%)`}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-container">
          <h3 className="chart-title">Top Pages by Activity</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={pageData.slice().sort((a: PageData, b: PageData) => b.total - a.total)}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="page" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="total" fill="#4F46E5" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );
};

const TrendsTab: React.FC<{ data: ReturnType<typeof WebsiteEngagementHeatmap.prototype.generateAnalyticsData> }> = ({ data }) => {
  const { timeData, hourlyData } = data;
  
  return (
    <>
      <div className="chart-container">
        <h3 className="chart-title">Engagement Trends Over Time</h3>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={timeData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="clicks" stroke="#EF4444" strokeWidth={2} />
            <Line type="monotone" dataKey="scrolls" stroke="#3B82F6" strokeWidth={2} />
            <Line type="monotone" dataKey="submissions" stroke="#10B981" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-container">
        <h3 className="chart-title">Hourly Activity Pattern</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={hourlyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="hour" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="activity" fill="#4F46E5" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </>
  );
};

const PagesTab: React.FC<{ data: ReturnType<typeof WebsiteEngagementHeatmap.prototype.generateAnalyticsData> }> = ({ data }) => {
  const { pageData } = data;
  
  return (
    <>
      <div className="chart-container">
        <h3 className="chart-title">Page Performance Breakdown</h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={pageData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="page" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="clicks" stackId="a" fill="#EF4444" />
            <Bar dataKey="scrolls" stackId="a" fill="#3B82F6" />
            <Bar dataKey="submissions" stackId="a" fill="#10B981" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-container">
        <h3 className="chart-title">Total Interactions by Page</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={pageData.slice().sort((a: PageData, b: PageData) => b.total - a.total)}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="page" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="total" fill="#4F46E5" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </>
  );
};

const DevicesTab: React.FC<{ data: ReturnType<typeof WebsiteEngagementHeatmap.prototype.generateAnalyticsData> }> = ({ data }) => {
  const { deviceData } = data;
  
  return (
    <>
      <div className="stats-grid">
        {deviceData.map((device: any, index: number) => (
          <div key={index} className="stat-card">
            <div className="stat-header">
              <span className="stat-title">{device.name} Users</span>
              <div style={{ width: '20px', height: '20px', backgroundColor: device.color, borderRadius: '50%' }}></div>
            </div>
            <div className="stat-value">{device.value.toLocaleString()}</div>
            <div className="stat-change positive">
              {((device.value / deviceData.reduce((sum: number, d: any) => sum + d.value, 0)) * 100).toFixed(1)}%
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        <div className="chart-container">
          <h3 className="chart-title">Device Usage Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={deviceData}
                cx="50%"
                cy="45%"
                innerRadius={50}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {deviceData.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value: any) => [value, 'Users']} />
              <Legend 
                verticalAlign="bottom" 
                height={36}
                formatter={(value: string, entry: any) => `${value}: ${entry.payload.value} (${((entry.payload.value / deviceData.reduce((sum: number, d: any) => sum + d.value, 0)) * 100).toFixed(1)}%)`}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-container">
          <h3 className="chart-title">Device Performance Comparison</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={deviceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#4F46E5" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );
};

export default WebsiteEngagementHeatmap;
"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Plus,
  Edit3,
  Trash2,
  Calendar,
  Users,
  TrendingUp,
  AlertTriangle,
  Clock,
  Share2,
  Github,
  X,
  Edit,
  ArrowRight,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Settings,
  GripVertical,
  BarChart3,
  PieChart,
  Activity,
  Target,
  Zap,
  Rocket,
  Star,
  Globe,
  Lock,
  Layers,
  Undo,
} from "lucide-react";

interface GitHubIssue {
  id: string;
  title: string;
  url?: string;
  number?: number;
  state?: "open" | "closed";
}

interface Milestone {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  assignee: string;
  progress: number;
  risk: "low" | "medium" | "high" | "critical";
  tags?: string[];
  githubIssues?: GitHubIssue[];
  category: string;
}

interface Project {
  id: string;
  name: string;
  description: string;
  milestones: Milestone[];
  createdAt: string;
  lastModified: string;
}

// Modern Glassmorphism Color System
const glassColors = {
  primary: "rgba(99, 102, 241, 0.1)",
  secondary: "rgba(168, 85, 247, 0.1)",
  accent: "rgba(14, 165, 233, 0.1)",
  success: "rgba(34, 197, 94, 0.1)",
  warning: "rgba(245, 158, 11, 0.1)",
  danger: "rgba(239, 68, 68, 0.1)",
  neutral: "rgba(148, 163, 184, 0.1)",
};

const riskConfig = {
  low: {
    icon: "☀️",
    label: "Clear Weather",
    color: "text-emerald-400",
    bg: "bg-emerald-500/20",
    border: "border-emerald-500/30",
  },
  medium: {
    icon: "⛅",
    label: "Partly Cloudy",
    color: "text-amber-400",
    bg: "bg-amber-500/20",
    border: "border-amber-500/30",
  },
  high: {
    icon: "🌧️",
    label: "Stormy",
    color: "text-orange-400",
    bg: "bg-orange-500/20",
    border: "border-orange-500/30",
  },
  critical: {
    icon: "⛈️",
    label: "Severe Storm",
    color: "text-red-400",
    bg: "bg-red-500/20",
    border: "border-red-500/30",
  },
};

const WeatherIcon = ({ risk, size = 20 }: { risk: string; size?: number }) => {
  const config = riskConfig[risk as keyof typeof riskConfig] || riskConfig.low;
  return (
    <span className="text-xl" style={{ fontSize: `${size}px` }}>
      {config.icon}
    </span>
  );
};

// Glassmorphism Components
const GlassCard = ({
  children,
  className = "",
  ...props
}: {
  children: React.ReactNode;
  className?: string;
  [key: string]: any;
}) => (
  <div
    className={`backdrop-blur-xl bg-slate-800/60 border border-slate-600/40 rounded-xl sm:rounded-2xl shadow-2xl ${className}`}
    {...props}
  >
    {children}
  </div>
);

const GlassButton = ({
  children,
  variant = "primary",
  className = "",
  ...props
}: {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "danger";
  className?: string;
  [key: string]: any;
}) => {
  const variants = {
    primary:
      "bg-gradient-to-r from-indigo-500/90 to-purple-600/90 hover:from-indigo-600/90 hover:to-purple-700/90 text-white shadow-lg",
    secondary:
      "bg-slate-700/80 hover:bg-slate-600/80 text-slate-100 border border-slate-500/40 shadow-lg",
    danger: "bg-red-500/90 hover:bg-red-600/90 text-white shadow-lg",
  };

  return (
    <button
      className={`cursor-pointer backdrop-blur-sm px-3 py-2 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl font-medium transition-all duration-200 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

// Landing Page Component
const LandingPage = ({
  onEnterDashboard,
}: {
  onEnterDashboard: () => void;
}) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const features = [
    {
      icon: Target,
      title: "Smart Milestone Planning",
      description:
        "Intelligent milestone tracking with weather-based risk assessment and automated progress calculation.",
      color: "text-indigo-400",
    },
    {
      icon: Layers,
      title: "Resizable Workspace",
      description:
        "Adaptive interface with resizable panes for roadmap editing and timeline preview that works seamlessly.",
      color: "text-purple-400",
    },
    {
      icon: Globe,
      title: "Real-time Collaboration",
      description:
        "Share projects instantly with shareable URLs and collaborate with your team in real-time.",
      color: "text-cyan-400",
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description:
        "Comprehensive analytics dashboard with progress tracking, risk distribution, and team performance metrics.",
      color: "text-emerald-400",
    },
    {
      icon: Lock,
      title: "Enterprise Security",
      description:
        "Built with enterprise-grade security features and compliance standards for professional teams.",
      color: "text-orange-400",
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description:
        "Optimized performance with glassmorphism design that delivers beautiful and responsive user experience.",
      color: "text-pink-400",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900">
      {/* Navigation */}
      <nav className="relative z-10 p-3 sm:p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <BarChart3 size={isMobile ? 16 : 20} className="text-white" />
            </div>
            <span className="text-lg sm:text-xl font-bold text-slate-100">
              MilestonePro
            </span>
          </div>
          <GlassButton
            variant="secondary"
            onClick={onEnterDashboard}
            className="flex items-center gap-1 sm:gap-2 text-sm sm:text-base"
          >
            <Rocket size={14} />
            <span className="hidden sm:inline">Try Dashboard</span>
            <span className="sm:hidden">Try</span>
          </GlassButton>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 px-3 sm:px-6 py-12 sm:py-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-6 sm:mb-8">
            <div className="inline-flex items-center gap-1 sm:gap-2 px-3 py-2 sm:px-4 sm:py-2 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs sm:text-sm mb-4 sm:mb-6">
              <Star size={12} />
              <span>Next-Generation Project Management</span>
            </div>
            <h1 className="text-3xl sm:text-5xl md:text-7xl font-black text-slate-100 mb-4 sm:mb-6 leading-tight">
              Plan Milestones
              <span className="block bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
                Like Weather
              </span>
            </h1>
            <p className="text-base sm:text-xl text-slate-300 mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed px-4 sm:px-0">
              Revolutionary milestone planning dashboard with weather-based risk
              visualization, real-time collaboration, and intelligent progress
              tracking. Built for modern teams.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-8 sm:mb-12 px-4 sm:px-0">
            <GlassButton
              variant="primary"
              onClick={onEnterDashboard}
              className="w-full sm:w-auto px-6 py-3 sm:px-8 sm:py-4 text-base sm:text-lg font-semibold flex items-center justify-center gap-2 sm:gap-3"
            >
              <Rocket size={18} />
              Launch Dashboard
              <ArrowRight size={14} />
            </GlassButton>
          </div>

          {/* Demo Preview */}
          <GlassCard className="p-1 max-w-4xl mx-auto mx-3 sm:mx-auto">
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg sm:rounded-xl p-4 sm:p-8 border border-white/10">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 mb-4 sm:mb-6">
                {["☀️ Clear", "⛅ Cloudy", "🌧️ Stormy", "⛈️ Critical"].map(
                  (weather, i) => (
                    <div
                      key={i}
                      className="text-center p-2 sm:p-3 rounded-md sm:rounded-lg bg-white/5 border border-white/10"
                    >
                      <div className="text-xs sm:text-sm text-slate-300">
                        {weather}
                      </div>
                    </div>
                  )
                )}
              </div>
              <div className="space-y-2 sm:space-y-3">
                {[85, 60, 25].map((progress, i) => (
                  <div key={i} className="flex items-center gap-2 sm:gap-3">
                    <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600"></div>
                    <div className="flex-1 bg-white/10 rounded-full h-1.5 sm:h-2">
                      <div
                        className="bg-gradient-to-r from-indigo-500 to-purple-600 h-1.5 sm:h-2 rounded-full transition-all duration-1000"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <span className="text-slate-300 text-xs sm:text-sm font-medium">
                      {progress}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </GlassCard>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 px-3 sm:px-6 py-12 sm:py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8 sm:mb-16 px-4 sm:px-0">
            <h2 className="text-2xl sm:text-4xl font-bold text-slate-100 mb-3 sm:mb-4">
              Powerful Features for Modern Teams
            </h2>
            <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto">
              Everything you need to plan, track, and deliver successful
              projects with your team, built with cutting-edge technology.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
            {features.map((feature, index) => (
              <GlassCard
                key={index}
                className="p-4 sm:p-6 group hover:bg-white/15 transition-all duration-300"
              >
                <div
                  className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300`}
                >
                  <feature.icon
                    size={isMobile ? 20 : 24}
                    className={feature.color}
                  />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-100 mb-2 sm:mb-3">
                  {feature.title}
                </h3>
                <p className="text-slate-300 leading-relaxed text-sm sm:text-base">
                  {feature.description}
                </p>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 px-3 sm:px-6 py-12 sm:py-20">
        <div className="max-w-4xl mx-auto text-center">
          <GlassCard className="p-6 sm:p-12">
            <h2 className="text-2xl sm:text-4xl font-bold text-slate-100 mb-3 sm:mb-4">
              Ready to Transform Your Project Management?
            </h2>
            <p className="text-slate-300 text-base sm:text-lg mb-6 sm:mb-8 max-w-2xl mx-auto">
              Join thousands of teams already using MilestonePro to deliver
              projects faster and more efficiently than ever before.
            </p>
            <div className="flex justify-center">
              <GlassButton
                variant="primary"
                onClick={onEnterDashboard}
                className="w-full sm:w-auto px-6 py-3 sm:px-8 sm:py-4 text-base sm:text-lg font-semibold flex items-center justify-center gap-2 sm:gap-3"
              >
                <Rocket size={18} />
                Get Started Free
                <ArrowRight size={14} />
              </GlassButton>
            </div>
          </GlassCard>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-3 sm:px-6 py-8 sm:py-12 border-t border-white/10">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-md sm:rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <BarChart3 size={isMobile ? 12 : 16} className="text-white" />
            </div>
            <span className="text-base sm:text-lg font-bold text-slate-100">
              MilestonePro
            </span>
          </div>
          <p className="text-slate-400 text-xs sm:text-sm">
            © 2025 MilestonePro. Built with modern web technologies for the
            future of project management.
          </p>
        </div>
      </footer>

      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-48 h-48 sm:w-96 sm:h-96 bg-indigo-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 sm:w-96 sm:h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
};

// Resizable Panes Component
const ResizablePanes: React.FC<{
  leftPane: React.ReactNode;
  rightPane: React.ReactNode;
  defaultLeftWidth?: number;
}> = ({ leftPane, rightPane, defaultLeftWidth = 50 }) => {
  const [leftWidth, setLeftWidth] = useState(defaultLeftWidth);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const newLeftWidth = ((e.clientX - rect.left) / rect.width) * 100;
      setLeftWidth(Math.max(20, Math.min(80, newLeftWidth)));
    },
    [isDragging]
  );

  const handleMouseUp = useCallback(() => setIsDragging(false), []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  return (
    <div ref={containerRef} className="flex h-full w-full">
      <div style={{ width: `${leftWidth}%` }} className="h-full overflow-auto">
        {leftPane}
      </div>
      <div
        onMouseDown={handleMouseDown}
        className="w-1 cursor-col-resize bg-white/20 hover:bg-white/30 transition-colors flex items-center justify-center"
      >
        <GripVertical size={12} className="text-white/60" />
      </div>
      <div
        style={{ width: `${100 - leftWidth}%` }}
        className="h-full overflow-auto"
      >
        {rightPane}
      </div>
    </div>
  );
};

// Mobile Accordion Component
const MobileAccordion: React.FC<{
  sections: Array<{
    title: string;
    content: React.ReactNode;
    defaultOpen?: boolean;
  }>;
}> = ({ sections }) => {
  const [openSections, setOpenSections] = useState<Set<number>>(
    new Set(
      sections
        .map((_, index) => (sections[index].defaultOpen ? index : -1))
        .filter((i) => i >= 0)
    )
  );

  const toggleSection = (index: number) => {
    const newOpenSections = new Set(openSections);
    if (newOpenSections.has(index)) {
      newOpenSections.delete(index);
    } else {
      newOpenSections.add(index);
    }
    setOpenSections(newOpenSections);
  };

  return (
    <div className="space-y-3 sm:space-y-4">
      {sections.map((section, index) => (
        <GlassCard key={index}>
          <button
            onClick={() => toggleSection(index)}
            className="cursor-pointer w-full p-3 sm:p-4 flex items-center justify-between text-left"
          >
            <span className="font-semibold text-slate-100 text-sm sm:text-base">
              {section.title}
            </span>
            {openSections.has(index) ? (
              <ChevronUp size={18} className="text-slate-300" />
            ) : (
              <ChevronDown size={18} className="text-slate-300" />
            )}
          </button>
          {openSections.has(index) && (
            <div className="p-3 sm:p-4 pt-0 border-t border-white/10">
              {section.content}
            </div>
          )}
        </GlassCard>
      ))}
    </div>
  );
};

export default function ProjectDashboard() {
  const [showLanding, setShowLanding] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [activeTab, setActiveTab] = useState<
    "overview" | "milestones" | "analytics"
  >("overview");
  const [isEditing, setIsEditing] = useState(false);
  const [editingMilestone, setEditingMilestone] = useState<Milestone | null>(
    null
  );
  const [newMilestone, setNewMilestone] = useState<Partial<Milestone>>({
    tags: [],
    githubIssues: [],
    category: "default",
  });
  const [shareableUrl, setShareableUrl] = useState("");
  const [isMobile, setIsMobile] = useState(false);

  // Prevent background scroll when modal is open
  useEffect(() => {
    if (isEditing) {
      // Store original values
      const originalOverflow = document.body.style.overflow;
      const originalPosition = document.body.style.position;
      const originalWidth = document.body.style.width;
      
      // Prevent scrolling
      document.body.classList.add("modal-open");
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.width = "100%";
      
      // Cleanup function
      return () => {
        document.body.classList.remove("modal-open");
        document.body.style.overflow = originalOverflow || "";
        document.body.style.position = originalPosition || "";
        document.body.style.width = originalWidth || "";
      };
    }
  }, [isEditing]);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (!showLanding) {
      const defaultProject: Project = {
        id: "1",
        name: "Digital Innovation Platform",
        description:
          "Next-generation platform development with AI-powered features and cloud-native architecture",
        milestones: [
          {
            id: "1",
            title: "Platform Architecture Design",
            description:
              "Design scalable microservices architecture with cloud-native patterns",
            dueDate: "2025-07-15",
            assignee: "Sarah Chen",
            progress: 85,
            risk: "low",
            tags: ["architecture", "design"],
            githubIssues: [],
            category: "design",
          },
          {
            id: "2",
            title: "Core API Development",
            description:
              "Build RESTful APIs with GraphQL integration and real-time capabilities",
            dueDate: "2025-08-01",
            assignee: "Michael Rodriguez",
            progress: 60,
            risk: "medium",
            tags: ["backend", "api"],
            githubIssues: [],
            category: "development",
          },
          {
            id: "3",
            title: "AI Model Integration",
            description:
              "Integrate machine learning models for intelligent automation features",
            dueDate: "2025-09-15",
            assignee: "Alex Thompson",
            progress: 25,
            risk: "high",
            tags: ["ai", "ml"],
            githubIssues: [],
            category: "development",
          },
          {
            id: "4",
            title: "Security & Compliance",
            description:
              "Implement enterprise security measures and regulatory compliance",
            dueDate: "2025-09-30",
            assignee: "Jennifer Liu",
            progress: 10,
            risk: "critical",
            tags: ["security", "compliance"],
            githubIssues: [],
            category: "security",
          },
        ],
        createdAt: new Date().toISOString(),
        lastModified: new Date().toISOString(),
      };
      setProjects([defaultProject]);
      setCurrentProject(defaultProject);
    }
  }, [showLanding]);

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const updateMilestoneProgress = (milestoneId: string, progress: number) => {
    if (!currentProject) return;
    const limitedProgress = Math.min(Math.max(progress, 0), 100);
    const updatedMilestones = currentProject.milestones.map((milestone) =>
      milestone.id === milestoneId
        ? { ...milestone, progress: limitedProgress }
        : milestone
    );
    const updatedProject = {
      ...currentProject,
      milestones: updatedMilestones,
      lastModified: new Date().toISOString(),
    };
    setCurrentProject(updatedProject);
    setProjects((prev) =>
      prev.map((p) => (p.id === updatedProject.id ? updatedProject : p))
    );
  };

  const increaseProgress = (milestoneId: string) => {
    if (!currentProject) return;
    const milestone = currentProject.milestones.find(m => m.id === milestoneId);
    if (!milestone) return;
    const newProgress = Math.min(milestone.progress + 10, 100);
    updateMilestoneProgress(milestoneId, newProgress);
  };

  const decreaseProgress = (milestoneId: string) => {
    if (!currentProject) return;
    const milestone = currentProject.milestones.find(m => m.id === milestoneId);
    if (!milestone) return;
    const newProgress = Math.max(milestone.progress - 10, 0);
    updateMilestoneProgress(milestoneId, newProgress);
  };

  const editMilestone = (milestone: Milestone) => {
    setEditingMilestone(milestone);
    setNewMilestone(milestone);
    setIsEditing(true);
  };

  const deleteMilestone = (milestoneId: string) => {
    if (!currentProject) return;
    const updatedMilestones = currentProject.milestones.filter(
      (m) => m.id !== milestoneId
    );
    const updatedProject = {
      ...currentProject,
      milestones: updatedMilestones,
      lastModified: new Date().toISOString(),
    };
    setCurrentProject(updatedProject);
    setProjects((prev) =>
      prev.map((p) => (p.id === updatedProject.id ? updatedProject : p))
    );
  };

  const saveMilestone = () => {
    if (!currentProject || !newMilestone.title || !newMilestone.dueDate) return;
    const limitedProgress = Math.min(
      Math.max(newMilestone.progress || 0, 0),
      100
    );
    const milestoneToSave: Milestone = {
      id: editingMilestone?.id || generateId(),
      title: newMilestone.title,
      description: newMilestone.description || "",
      dueDate: newMilestone.dueDate || "",
      assignee: newMilestone.assignee || "",
      progress: limitedProgress,
      risk: newMilestone.risk || "low",
      tags: newMilestone.tags || [],
      githubIssues: newMilestone.githubIssues || [],
      category: newMilestone.category || "default",
    };

    let updatedMilestones;
    if (editingMilestone) {
      updatedMilestones = currentProject.milestones.map((m) =>
        m.id === editingMilestone.id ? milestoneToSave : m
      );
    } else {
      updatedMilestones = [...currentProject.milestones, milestoneToSave];
    }

    const updatedProject = {
      ...currentProject,
      milestones: updatedMilestones,
      lastModified: new Date().toISOString(),
    };
    setCurrentProject(updatedProject);
    setProjects((prev) =>
      prev.map((p) => (p.id === updatedProject.id ? updatedProject : p))
    );
    setIsEditing(false);
    setEditingMilestone(null);
    setNewMilestone({ tags: [], githubIssues: [], category: "default" });
  };

  const generateShareableUrl = () => {
    if (!currentProject) return;
    const projectData = encodeURIComponent(JSON.stringify(currentProject));
    const url = `${window.location.origin}${window.location.pathname}?project=${projectData}`;
    navigator.clipboard.writeText(url);
    setShareableUrl(url);
    setTimeout(() => setShareableUrl(""), 4000);
  };

  const getRiskDistribution = (project: Project) => {
    const distribution = { critical: 0, high: 0, medium: 0, low: 0 };
    project.milestones.forEach((milestone) => distribution[milestone.risk]++);
    return distribution;
  };

  const getOverallProgress = (project: Project) => {
    if (project.milestones.length === 0) return 0;
    const totalProgress = project.milestones.reduce(
      (sum, milestone) => sum + milestone.progress,
      0
    );
    return Math.round(totalProgress / project.milestones.length);
  };

  const RoadmapEditingPane = () => (
    <div className="p-3 sm:p-6 h-full">
      <div className="mb-4 sm:mb-6">
        <h3 className="text-lg sm:text-xl font-bold text-slate-100 mb-1 sm:mb-2 flex items-center gap-2 sm:gap-3">
          <Edit size={16} className="text-indigo-400" />
          Roadmap Editor
        </h3>
        <p className="text-slate-400 text-xs sm:text-sm">
          Manage and edit your project milestones
        </p>
      </div>

      <div className="space-y-3 sm:space-y-4 h-[calc(100%-100px)] sm:h-[calc(100%-120px)] overflow-y-auto">
        {currentProject?.milestones.map((milestone, index) => {
          const riskInfo = riskConfig[milestone.risk];
          return (
            <GlassCard key={milestone.id} className="p-3 sm:p-4 bg-slate-700/40 border-slate-500/50">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0 pr-2 sm:pr-4">
                  <div className="flex items-center gap-2 sm:gap-3 mb-2">
                    <WeatherIcon risk={milestone.risk} size={16} />
                    <h4 className="font-semibold text-slate-50 truncate text-sm sm:text-base">
                      {milestone.title}
                    </h4>
                    <span className="text-xs px-2 py-1 rounded-full bg-slate-600/70 text-slate-200 border border-slate-500/30">
                      #{index + 1}
                    </span>
                  </div>
                  <p className="text-slate-200 text-xs sm:text-sm mb-2 sm:mb-3 line-clamp-2">
                    {milestone.description}
                  </p>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-xs text-slate-300">
                    <span className="flex items-center gap-1">
                      <Calendar size={10} />
                      {new Date(milestone.dueDate).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users size={10} />
                      {milestone.assignee}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
                  <button
                    onClick={() => editMilestone(milestone)}
                    className="cursor-pointer flex items-center justify-center p-1.5 sm:p-2 rounded-md sm:rounded-lg bg-slate-600/60 hover:bg-slate-500/70 text-slate-200 hover:text-white transition-colors border border-slate-500/30"
                  >
                    <Edit3 size={12} />
                  </button>
                  <button
                    onClick={() => deleteMilestone(milestone.id)}
                    className="cursor-pointer p-1.5 sm:p-2 rounded-md sm:rounded-lg bg-red-600/70 hover:bg-red-500/80 text-red-100 hover:text-white transition-colors flex items-center justify-center border border-red-500/40"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>

              <div className="space-y-1 sm:space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-slate-200 text-sm sm:text-base">
                      Progress
                    </span>
                    <span className="font-bold text-indigo-300 text-sm sm:text-base">
                      {milestone.progress}%
                    </span>
                  </div>
                  <div className="flex gap-2 w-full sm:w-auto">
                    <button
                      onClick={() => decreaseProgress(milestone.id)}
                      disabled={milestone.progress <= 0}
                      className="cursor-pointer px-3 py-2 sm:px-4 sm:py-2 rounded-lg bg-slate-600/60 hover:bg-slate-500/70 disabled:bg-slate-600/50 text-slate-200 hover:text-white disabled:text-slate-400 transition-colors border border-slate-500/40 disabled:border-slate-500/30 font-medium text-xs sm:text-sm flex items-center gap-2 disabled:cursor-not-allowed flex-1 sm:flex-initial justify-center"
                    >
                      <Undo size={14} />
                      <span className="hidden sm:inline">Remove 10%</span>
                      <span className="sm:hidden">-10%</span>
                    </button>
                    <button
                      onClick={() => increaseProgress(milestone.id)}
                      disabled={milestone.progress >= 100}
                      className="cursor-pointer px-3 py-2 sm:px-4 sm:py-2 rounded-lg bg-indigo-600/70 hover:bg-indigo-500/80 disabled:bg-slate-600/50 text-slate-100 hover:text-white disabled:text-slate-400 transition-colors border border-indigo-500/40 disabled:border-slate-500/30 font-medium text-xs sm:text-sm flex items-center gap-2 disabled:cursor-not-allowed flex-1 sm:flex-initial justify-center"
                    >
                      <Plus size={14} />
                      <span className="hidden sm:inline">Add 10%</span>
                      <span className="sm:hidden">+10%</span>
                    </button>
                  </div>
                </div>
                <div className="w-full bg-slate-600/50 rounded-full h-2 border border-slate-500/30">
                  <div
                    className="bg-gradient-to-r from-indigo-400 to-purple-500 h-2 rounded-full transition-all duration-300 shadow-sm"
                    style={{ width: `${milestone.progress}%` }}
                  />
                </div>
              </div>
            </GlassCard>
          );
        })}
      </div>
    </div>
  );

  const RoadmapPreviewPane = () => (
    <div className="p-3 sm:p-6 h-full">
      <div className="mb-4 sm:mb-6">
        <h3 className="text-lg sm:text-xl font-bold text-slate-100 mb-1 sm:mb-2 flex items-center gap-2 sm:gap-3">
          <Calendar size={16} className="text-purple-400" />
          Timeline Preview
        </h3>
        <p className="text-slate-400 text-xs sm:text-sm">
          Visual timeline of your project milestones
        </p>
      </div>

      <div className="relative h-[calc(100%-100px)] sm:h-[calc(100%-120px)] overflow-y-auto">
        <div className="absolute left-4 sm:left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-indigo-500 to-purple-600 opacity-60" />

        {currentProject?.milestones
          .sort(
            (a, b) =>
              new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
          )
          .map((milestone, index) => {
            const riskInfo = riskConfig[milestone.risk];
            return (
              <div
                key={milestone.id}
                className="relative pl-8 sm:pl-12 pb-4 sm:pb-6 last:pb-0"
              >
                <div className="absolute left-2.5 sm:left-4 top-2 sm:top-3 w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 border-2 border-slate-800 z-10" />

                <GlassCard className="p-3 sm:p-4 bg-slate-700/40 border-slate-500/50">
                  <div className="flex items-center gap-2 sm:gap-3 mb-2">
                    <WeatherIcon risk={milestone.risk} size={14} />
                    <h4 className="font-semibold text-slate-50 text-xs sm:text-sm">
                      {milestone.title}
                    </h4>
                    <span className="text-xs px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full bg-slate-600/70 text-slate-200 border border-slate-500/30">
                      {index + 1}
                    </span>
                  </div>

                  <p className="text-slate-200 text-xs mb-2 sm:mb-3 line-clamp-2">
                    {milestone.description}
                  </p>

                  <div className="flex justify-between items-center text-xs text-slate-300 mb-2">
                    <span className="truncate pr-2">{milestone.assignee}</span>
                    <span className="flex-shrink-0">
                      {new Date(milestone.dueDate).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="w-full bg-slate-600/50 rounded-full h-1 sm:h-1.5 border border-slate-500/30">
                    <div
                      className="bg-gradient-to-r from-indigo-400 to-purple-500 h-1 sm:h-1.5 rounded-full transition-all duration-300 shadow-sm"
                      style={{ width: `${milestone.progress}%` }}
                    />
                  </div>
                </GlassCard>
              </div>
            );
          })}
      </div>
    </div>
  );

  // Show landing page first
  if (showLanding) {
    return <LandingPage onEnterDashboard={() => setShowLanding(false)} />;
  }

  if (!currentProject) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin text-indigo-400 mb-4">
            <Settings size={isMobile ? 40 : 48} />
          </div>
          <p className="text-slate-300 font-medium text-sm sm:text-base">
            Loading Dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 font-['Roboto',sans-serif]">
      <style jsx>{`
        @import url("https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700;900&display=swap");
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        /* Hide scrollbars for all elements except body */
        *:not(body) {
          scrollbar-width: none; /* Firefox */
          -ms-overflow-style: none; /* IE and Edge */
        }
        
        /* Hide scrollbars for webkit browsers (Chrome, Safari, Edge) */
        *:not(body)::-webkit-scrollbar {
          display: none;
          width: 0;
          height: 0;
          background: transparent;
        }
        
        *:not(body)::-webkit-scrollbar-track {
          display: none;
        }
        
        *:not(body)::-webkit-scrollbar-thumb {
          display: none;
        }
        
        /* Modal scroll prevention */
        body.modal-open {
          overflow: hidden !important;
          position: fixed !important;
          width: 100% !important;
          height: 100vh !important;
        }
        
        /* Specific targets for common scroll containers */
        div[class*="overflow-"]:not(.modal-backdrop),
        div[class*="h-["]:not(.modal-backdrop),
        .space-y-3,
        .space-y-4 {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        
        div[class*="overflow-"]:not(.modal-backdrop)::-webkit-scrollbar,
        div[class*="h-["]:not(.modal-backdrop)::-webkit-scrollbar,
        .space-y-3::-webkit-scrollbar,
        .space-y-4::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      <div className="max-w-7xl mx-auto p-3 sm:p-6">
        {/* Header */}
        <GlassCard className="p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="flex flex-col gap-4 sm:gap-6">
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                <BarChart3 size={isMobile ? 20 : 24} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-lg sm:text-2xl font-bold text-slate-100 mb-1 truncate">
                  {currentProject.name}
                </h1>
                <p className="text-slate-300 text-sm sm:text-base line-clamp-2">
                  {currentProject.description}
                </p>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-2 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <Clock size={10} />
                    Updated{" "}
                    {new Date(currentProject.lastModified).toLocaleDateString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users size={10} />
                    {
                      new Set(currentProject.milestones.map((m) => m.assignee))
                        .size
                    }{" "}
                    members
                  </span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 sm:flex sm:gap-3">
              <GlassButton
                variant="secondary"
                onClick={() => setShowLanding(true)}
                className="flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                <ArrowLeft size={14} />
                <span className="hidden sm:inline">Back to Home</span>
                <span className="sm:hidden">Home</span>
              </GlassButton>
              <GlassButton
                variant="secondary"
                onClick={generateShareableUrl}
                className="flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                <Share2 size={14} />
                Share
              </GlassButton>
              <GlassButton
                variant="primary"
                onClick={() => setIsEditing(true)}
                className="flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                <Plus size={14} />
                <span className="hidden sm:inline">Add Milestone</span>
                <span className="sm:hidden">Add</span>
              </GlassButton>
            </div>
          </div>
        </GlassCard>

        {/* Navigation */}
        <GlassCard className="p-2 mb-6 sm:mb-8">
          <div className="grid grid-cols-3 gap-1 sm:gap-2">
            {[
              { key: "overview", label: "Overview", icon: TrendingUp },
              { key: "milestones", label: "Milestones", icon: Target },
              { key: "analytics", label: "Analytics", icon: BarChart3 },
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key as any)}
                className={`cursor-pointer py-2 sm:py-3 px-2 sm:px-4 rounded-lg sm:rounded-xl font-medium transition-all duration-200 flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 text-xs sm:text-base ${
                  activeTab === key
                    ? "bg-gradient-to-r from-indigo-500/80 to-purple-600/80 text-white"
                    : "text-slate-300 hover:bg-white/10"
                }`}
              >
                <Icon size={14} />
                <span className="sm:hidden text-xs">
                  {label === "Milestones"
                    ? "Tasks"
                    : label === "Analytics"
                    ? "Stats"
                    : label}
                </span>
                <span className="hidden sm:inline">{label}</span>
              </button>
            ))}
          </div>
        </GlassCard>

        {/* Tab Content */}
        {activeTab === "overview" && (
          <div className="space-y-6 sm:space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
              {[
                {
                  icon: Target,
                  label: "Milestones",
                  value: currentProject.milestones.length,
                  color: "indigo",
                },
                {
                  icon: TrendingUp,
                  label: "Progress",
                  value: `${getOverallProgress(currentProject)}%`,
                  color: "purple",
                },
                {
                  icon: Users,
                  label: "Team",
                  value: new Set(
                    currentProject.milestones.map((m) => m.assignee)
                  ).size,
                  color: "cyan",
                },
                {
                  icon: AlertTriangle,
                  label: "At Risk",
                  value:
                    getRiskDistribution(currentProject).high +
                    getRiskDistribution(currentProject).critical,
                  color: "orange",
                },
              ].map(({ icon: Icon, label, value, color }, i) => (
                <GlassCard key={i} className="p-4 sm:p-6 text-center">
                  <Icon
                    size={isMobile ? 20 : 24}
                    className={`text-${color}-400 mx-auto mb-2 sm:mb-3`}
                  />
                  <div className="text-xl sm:text-2xl font-bold text-slate-100 mb-1">
                    {value}
                  </div>
                  <div className="text-slate-400 text-xs sm:text-sm">
                    {label}
                  </div>
                </GlassCard>
              ))}
            </div>

            {/* Recent Milestones */}
            <GlassCard className="p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-bold text-slate-100 mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
                <Activity size={16} className="text-indigo-400" />
                Recent Milestones
              </h3>
              <div className="space-y-3 sm:space-y-4">
                {currentProject.milestones
                  .slice(0, 3)
                  .map((milestone, index) => (
                    <div
                      key={milestone.id}
                      className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg sm:rounded-xl bg-white/5 border border-white/10"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <WeatherIcon risk={milestone.risk} size={18} />
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-slate-100 mb-1 truncate text-sm sm:text-base">
                            {milestone.title}
                          </div>
                          <div className="text-slate-400 text-xs sm:text-sm">
                            {milestone.assignee} • Due{" "}
                            {new Date(milestone.dueDate).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div className="text-base sm:text-lg font-bold text-indigo-400 bg-indigo-500/20 px-3 py-1 rounded-lg text-center">
                        {milestone.progress}%
                      </div>
                    </div>
                  ))}
              </div>
            </GlassCard>

            {/* Interactive Roadmap */}
            <GlassCard className="overflow-hidden">
              <div className="p-4 sm:p-6 border-b border-white/10">
                <h3 className="text-lg sm:text-xl font-bold text-slate-100 flex items-center gap-2 sm:gap-3">
                  <Zap size={16} className="text-purple-400" />
                  Interactive Roadmap
                </h3>
              </div>
              {isMobile ? (
                <div className="p-3 sm:p-4">
                  <MobileAccordion
                    sections={[
                      {
                        title: "Editor",
                        content: <RoadmapEditingPane />,
                        defaultOpen: true,
                      },
                      {
                        title: "Timeline",
                        content: <RoadmapPreviewPane />,
                        defaultOpen: false,
                      },
                    ]}
                  />
                </div>
              ) : (
                <div className="h-[500px] sm:h-[600px]">
                  <ResizablePanes
                    leftPane={<RoadmapEditingPane />}
                    rightPane={<RoadmapPreviewPane />}
                  />
                </div>
              )}
            </GlassCard>
          </div>
        )}

        {activeTab === "milestones" && (
          <div className="space-y-4 sm:space-y-6">
            {currentProject.milestones.map((milestone, index) => {
              const riskInfo = riskConfig[milestone.risk];
              return (
                <GlassCard key={milestone.id} className="p-4 sm:p-6 bg-slate-700/40 border-slate-500/50">
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-3">
                          <div className="flex items-center gap-2">
                            <WeatherIcon risk={milestone.risk} size={18} />
                            <h4 className="text-lg sm:text-xl font-bold text-slate-50 truncate">
                              {milestone.title}
                            </h4>
                          </div>
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${riskInfo.bg} ${riskInfo.color} w-fit border border-slate-500/30`}
                          >
                            {riskInfo.label}
                          </span>
                        </div>
                        <p className="text-slate-200 mb-4 text-sm sm:text-base">
                          {milestone.description}
                        </p>
                      </div>
                      <div className="flex sm:flex-col gap-2">
                        <button
                          onClick={() => editMilestone(milestone)}
                          className="cursor-pointer flex items-center justify-center flex-1 sm:flex-none p-2 sm:p-2 rounded-lg bg-slate-600/60 hover:bg-slate-500/70 text-slate-200 hover:text-white transition-colors border border-slate-500/30"
                        >
                          <Edit3 size={14} />
                        </button>
                        <button
                          onClick={() => deleteMilestone(milestone.id)}
                          className="cursor-pointer flex items-center justify-center flex-1 sm:flex-none p-2 sm:p-2 rounded-lg bg-red-600/70 hover:bg-red-500/80 text-red-100 hover:text-white transition-colors border border-red-500/40"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-3">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-slate-200 text-sm sm:text-base">
                            Progress
                          </span>
                          <span className="font-bold text-indigo-300 text-sm sm:text-base">
                            {milestone.progress}%
                          </span>
                        </div>
                        <div className="flex gap-2 w-full sm:w-auto">
                          <button
                            onClick={() => decreaseProgress(milestone.id)}
                            disabled={milestone.progress <= 0}
                            className="cursor-pointer px-3 py-2 sm:px-4 sm:py-2 rounded-lg bg-slate-600/60 hover:bg-slate-500/70 disabled:bg-slate-600/50 text-slate-200 hover:text-white disabled:text-slate-400 transition-colors border border-slate-500/40 disabled:border-slate-500/30 font-medium text-xs sm:text-sm flex items-center gap-2 disabled:cursor-not-allowed flex-1 sm:flex-initial justify-center"
                          >
                            <Undo size={14} />
                            <span className="hidden sm:inline">Remove 10%</span>
                            <span className="sm:hidden">-10%</span>
                          </button>
                          <button
                            onClick={() => increaseProgress(milestone.id)}
                            disabled={milestone.progress >= 100}
                            className="cursor-pointer px-3 py-2 sm:px-4 sm:py-2 rounded-lg bg-indigo-600/70 hover:bg-indigo-500/80 disabled:bg-slate-600/50 text-slate-100 hover:text-white disabled:text-slate-400 transition-colors border border-indigo-500/40 disabled:border-slate-500/30 font-medium text-xs sm:text-sm flex items-center gap-2 disabled:cursor-not-allowed flex-1 sm:flex-initial justify-center"
                          >
                            <Plus size={14} />
                            <span className="hidden sm:inline">Add 10%</span>
                            <span className="sm:hidden">+10%</span>
                          </button>
                        </div>
                      </div>
                      <div className="w-full bg-slate-600/50 rounded-full h-2 border border-slate-500/30">
                        <div
                          className="bg-gradient-to-r from-indigo-400 to-purple-500 h-2 rounded-full transition-all duration-300 shadow-sm"
                          style={{ width: `${milestone.progress}%` }}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg sm:rounded-xl bg-slate-600/30 border border-slate-500/40">
                      <div>
                        <div className="text-slate-300 text-xs sm:text-sm mb-1">
                          Due Date
                        </div>
                        <div className="text-slate-100 font-medium text-sm sm:text-base">
                          {new Date(milestone.dueDate).toLocaleDateString()}
                        </div>
                      </div>
                      <div>
                        <div className="text-slate-300 text-xs sm:text-sm mb-1">
                          Assignee
                        </div>
                        <div className="text-slate-100 font-medium text-sm sm:text-base truncate">
                          {milestone.assignee}
                        </div>
                      </div>
                      <div>
                        <div className="text-slate-300 text-xs sm:text-sm mb-1">
                          Risk Level
                        </div>
                        <div className="flex items-center gap-2">
                          <WeatherIcon risk={milestone.risk} size={14} />
                          <span
                            className={`text-xs sm:text-sm ${riskInfo.color}`}
                          >
                            {riskInfo.label}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </GlassCard>
              );
            })}
          </div>
        )}

        {activeTab === "analytics" && (
          <div className="space-y-6 sm:space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
              {/* Progress Chart */}
              <GlassCard className="p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-bold text-slate-100 mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
                  <BarChart3 size={16} className="text-indigo-400" />
                  Progress Overview
                </h3>
                <div className="space-y-3 sm:space-y-4">
                  {currentProject.milestones.map((milestone, index) => (
                    <div key={milestone.id}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-slate-300 text-xs sm:text-sm truncate pr-2">
                          {milestone.title}
                        </span>
                        <span className="text-indigo-400 font-semibold text-xs sm:text-sm">
                          {milestone.progress}%
                        </span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-1.5 sm:h-2">
                        <div
                          className="bg-gradient-to-r from-indigo-500 to-purple-600 h-1.5 sm:h-2 rounded-full transition-all duration-500"
                          style={{ width: `${milestone.progress}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>

              {/* Risk Analysis */}
              <GlassCard className="p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-bold text-slate-100 mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
                  <PieChart size={16} className="text-purple-400" />
                  Risk Analysis
                </h3>
                <div className="space-y-3 sm:space-y-4">
                  {Object.entries(riskConfig).map(([level, config]) => {
                    const count =
                      getRiskDistribution(currentProject)[
                        level as keyof ReturnType<typeof getRiskDistribution>
                      ];
                    return (
                      <div
                        key={level}
                        className="flex items-center justify-between p-3 rounded-lg sm:rounded-xl bg-white/5"
                      >
                        <div className="flex items-center gap-2 sm:gap-3">
                          <span className="text-base sm:text-lg">
                            {config.icon}
                          </span>
                          <span className="text-slate-300 capitalize text-sm sm:text-base">
                            {config.label}
                          </span>
                        </div>
                        <span className="font-bold text-slate-100 text-sm sm:text-base">
                          {count}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </GlassCard>
            </div>

            {/* Team Performance */}
            <GlassCard className="p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-bold text-slate-100 mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
                <Users size={16} className="text-cyan-400" />
                Team Performance
              </h3>
              <div className="space-y-3 sm:space-y-4">
                {Array.from(
                  new Set(currentProject.milestones.map((m) => m.assignee))
                ).map((assignee) => {
                  const assigneeMilestones = currentProject.milestones.filter(
                    (m) => m.assignee === assignee
                  );
                  const avgProgress =
                    assigneeMilestones.reduce((sum, m) => sum + m.progress, 0) /
                    assigneeMilestones.length;

                  return (
                    <div
                      key={assignee}
                      className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg sm:rounded-xl bg-slate-600/30 border border-slate-500/40"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                          {assignee
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-slate-100 text-sm sm:text-base truncate">
                            {assignee}
                          </div>
                          <div className="text-slate-300 text-xs sm:text-sm">
                            {assigneeMilestones.length} milestones
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
                        <div className="bg-slate-600/50 rounded-full h-2 sm:h-2 flex-1 sm:w-32 border border-slate-500/30">
                          <div
                            className="bg-gradient-to-r from-indigo-400 to-purple-500 h-2 sm:h-2 rounded-full transition-all duration-300 shadow-sm"
                            style={{ width: `${avgProgress}%` }}
                          />
                        </div>
                        <span className="text-indigo-300 font-semibold text-sm sm:text-base flex-shrink-0">
                          {Math.round(avgProgress)}%
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </GlassCard>
          </div>
        )}
      </div>

      {/* Modal */}
      {isEditing && (
        <div className="modal-backdrop fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 z-50">
          <GlassCard className="w-full max-w-lg sm:max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-4 sm:p-6 border-b border-white/10">
              <div className="flex items-center justify-between">
                <h3 className="text-lg sm:text-xl font-bold text-slate-100">
                  {editingMilestone ? "Edit Milestone" : "Create Milestone"}
                </h3>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setEditingMilestone(null);
                    setNewMilestone({
                      tags: [],
                      githubIssues: [],
                      category: "default",
                    });
                  }}
                  className="cursor-pointer p-2 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="p-4 sm:p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-slate-300">
                  Title *
                </label>
                <input
                  type="text"
                  value={newMilestone.title || ""}
                  placeholder="Milestone title"
                  onChange={(e) =>
                    setNewMilestone((prev) => ({
                      ...prev,
                      title: e.target.value,
                    }))
                  }
                  className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-slate-300">
                  Description
                </label>
                <textarea
                  value={newMilestone.description || ""}
                  placeholder="Milestone description"
                  onChange={(e) =>
                    setNewMilestone((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  className="w-full p-3 h-20 sm:h-24 bg-white/10 border border-white/20 rounded-lg text-slate-100 placeholder-slate-400 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-slate-300">
                    Due Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={newMilestone.dueDate || ""}
                    onChange={(e) =>
                      setNewMilestone((prev) => ({
                        ...prev,
                        dueDate: e.target.value,
                      }))
                    }
                    className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-slate-300">
                    Risk Level
                  </label>
                  <select
                    value={newMilestone.risk || "low"}
                    onChange={(e) =>
                      setNewMilestone((prev) => ({
                        ...prev,
                        risk: e.target.value as any,
                      }))
                    }
                    className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base"
                  >
                    <option value="low">☀️ Clear Weather</option>
                    <option value="medium">⛅ Partly Cloudy</option>
                    <option value="high">🌧️ Stormy</option>
                    <option value="critical">⛈️ Severe Storm</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-slate-300">
                  Assignee
                </label>
                <input
                  type="text"
                  value={newMilestone.assignee || ""}
                  placeholder="Team member name"
                  onChange={(e) =>
                    setNewMilestone((prev) => ({
                      ...prev,
                      assignee: e.target.value,
                    }))
                  }
                  className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-slate-300">
                  Progress (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={newMilestone.progress || 0}
                  onChange={(e) =>
                    setNewMilestone((prev) => ({
                      ...prev,
                      progress: Math.min(
                        100,
                        Math.max(0, parseInt(e.target.value) || 0)
                      ),
                    }))
                  }
                  className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-4">
                <GlassButton
                  variant="secondary"
                  onClick={() => {
                    setIsEditing(false);
                    setEditingMilestone(null);
                    setNewMilestone({
                      tags: [],
                      githubIssues: [],
                      category: "default",
                    });
                  }}
                  className="w-full py-3 text-sm sm:text-base"
                >
                  Cancel
                </GlassButton>
                <GlassButton
                  variant="primary"
                  onClick={saveMilestone}
                  disabled={!newMilestone.title || !newMilestone.dueDate}
                  className="w-full py-3 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                >
                  {editingMilestone ? "Update" : "Create"}
                </GlassButton>
              </div>
            </div>
          </GlassCard>
        </div>
      )}

      {/* Share Notification */}
      {shareableUrl && (
        <div className="fixed bottom-3 sm:bottom-6 left-3 right-3 sm:left-auto sm:right-6 sm:max-w-sm z-50">
          <GlassCard className="p-3 sm:p-4">
            <div className="flex gap-3">
              <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                <Share2 size={14} className="text-emerald-400" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-slate-100 mb-1 text-sm sm:text-base">
                  URL Copied!
                </h4>
                <p className="text-slate-300 text-xs sm:text-sm mb-2">
                  Share link is ready
                </p>
                <button
                  onClick={() => setShareableUrl("")}
                  className="cursor-pointer text-indigo-400 text-xs sm:text-sm hover:text-indigo-300"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
}
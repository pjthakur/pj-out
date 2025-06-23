"use client"
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';
import { 
  MdTerminal,
  MdPlayArrow,
  MdCheckCircle,
  MdRadioButtonUnchecked,
  MdLightbulb,
  MdEmojiEvents,
  MdFlashOn,
  MdCode,
  MdMenuBook,
  MdArrowForward,
  MdKeyboard,
  MdMenu,
  MdShowChart,
  MdMemory,
  MdStorage,
  MdWifi,
  MdBattery90,
  MdSettings,
  MdMonitor,
  MdPower,
  MdRefresh,
  MdCelebration,
  MdTipsAndUpdates,
  MdFolder,
  MdDescription,
  MdHelp,
  MdClose,
  MdRocketLaunch,
  MdSchool,
  MdSpeed,
  MdSecurity,
  MdDevices,
  MdCloud
} from 'react-icons/md';
interface Command {
  name: string;
  description: string;
  syntax: string;
  examples: string[];
}
interface Lesson {
  id: string;
  title: string;
  description: string;
  commands: Command[];
  expectedCommands: string[];
  completed: boolean;
}
interface TerminalOutput {
  id: string;
  type: 'input' | 'output' | 'error' | 'success' | 'system';
  content: string;
  timestamp: Date;
  prompt?: string;
}
const lessons: Lesson[] = [
  {
    id: '1',
    title: 'Basic Navigation',
    description: 'Learn how to navigate through directories',
    commands: [
      {
        name: 'pwd',
        description: 'Print working directory',
        syntax: 'pwd',
        examples: ['pwd']
      },
      {
        name: 'ls',
        description: 'List directory contents',
        syntax: 'ls [options] [directory]',
        examples: ['ls', 'ls -la', 'ls /home']
      }
    ],
    expectedCommands: ['pwd', 'ls'],
    completed: false
  },
  {
    id: '2',
    title: 'File Operations',
    description: 'Create, move, and delete files',
    commands: [
      {
        name: 'touch',
        description: 'Create empty files',
        syntax: 'touch filename',
        examples: ['touch file.txt', 'touch doc1.txt doc2.txt']
      },
      {
        name: 'mkdir',
        description: 'Create directories',
        syntax: 'mkdir directory_name',
        examples: ['mkdir projects', 'mkdir -p path/to/directory']
      }
    ],
    expectedCommands: ['touch', 'mkdir'],
    completed: false
  },
  {
    id: '3',
    title: 'Text Processing',
    description: 'Work with text files and content',
    commands: [
      {
        name: 'cat',
        description: 'Display file contents',
        syntax: 'cat filename',
        examples: ['cat file.txt', 'cat file1.txt file2.txt']
      },
      {
        name: 'grep',
        description: 'Search text patterns',
        syntax: 'grep pattern filename',
        examples: ['grep "hello" file.txt', 'grep -i "pattern" *.txt']
      }
    ],
    expectedCommands: ['cat', 'grep'],
    completed: false
  },
  {
    id: '4',
    title: 'System Information',
    description: 'Monitor system resources and processes',
    commands: [
      {
        name: 'ps',
        description: 'Display running processes',
        syntax: 'ps [options]',
        examples: ['ps', 'ps aux', 'ps -ef']
      },
      {
        name: 'df',
        description: 'Display filesystem disk space usage',
        syntax: 'df [options] [filesystem]',
        examples: ['df', 'df -h', 'df -T']
      }
    ],
    expectedCommands: ['ps', 'df'],
    completed: false
  }
];
const parseCommand = (input: string): { command: string; args: string[] } => {
  const parts = input.trim().split(/\s+/);
  return {
    command: parts[0] || '',
    args: parts.slice(1)
  };
};
interface VirtualFile {
  name: string;
  type: 'file' | 'directory';
  content?: string;
  children?: { [key: string]: VirtualFile };
  permissions: string;
  size: number;
  modified: Date;
}
const createVirtualFS = (): { [key: string]: VirtualFile } => ({
  'Documents': {
    name: 'Documents',
    type: 'directory',
    permissions: 'drwxr-xr-x',
    size: 4096,
    modified: new Date('2025-01-01T10:30:00'),
    children: {
      'notes.txt': {
        name: 'notes.txt',
        type: 'file',
        content: `Terminal Learning Notes
======================
Basic Commands:
- pwd: Print working directory
- ls: List directory contents
- cat: Display file contents
- grep: Search text patterns
Remember to practice regularly!`,
        permissions: '-rw-r--r--',
        size: 245,
        modified: new Date('2025-01-01T09:15:00')
      },
      'projects': {
        name: 'projects',
        type: 'directory',
        permissions: 'drwxr-xr-x',
        size: 4096,
        modified: new Date('2025-01-01T11:00:00'),
        children: {
          'script.sh': {
            name: 'script.sh',
            type: 'file',
            content: `#!/bin/bash
# Sample learning script
echo "Hello, Terminal Learner!"
echo "Current directory: $(pwd)"
echo "Date: $(date)"
echo "Learning is fun!"`,
            permissions: '-rwxr-xr-x',
            size: 156,
            modified: new Date('2025-01-01T11:30:00')
          }
        }
      }
    }
  },
  'Downloads': {
    name: 'Downloads',
    type: 'directory',
    permissions: 'drwxr-xr-x',
    size: 4096,
    modified: new Date('2025-01-01T10:30:00'),
    children: {
      'readme.txt': {
        name: 'readme.txt',
        type: 'file',
        content: `Welcome to Terminal Lab!
This is a virtual terminal environment where you can:
1. Learn basic terminal commands
2. Practice file operations
3. Work with text processing
4. Monitor system information
Happy learning!`,
        permissions: '-rw-r--r--',
        size: 189,
        modified: new Date('2025-01-01T08:45:00')
      }
    }
  },
  'Pictures': {
    name: 'Pictures',
    type: 'directory',
    permissions: 'drwxr-xr-x',
    size: 4096,
    modified: new Date('2025-01-01T10:30:00'),
    children: {}
  },
  'Projects': {
    name: 'Projects',
    type: 'directory',
    permissions: 'drwxr-xr-x',
    size: 4096,
    modified: new Date('2025-01-01T10:30:00'),
    children: {
      'hello.txt': {
        name: 'hello.txt',
        type: 'file',
        content: `Hello World!
This is a sample text file.
You can practice grep commands on this file.
Terminal commands are powerful tools.
Keep practicing and you'll master them!`,
        permissions: '-rw-r--r--',
        size: 142,
        modified: new Date('2025-01-01T12:00:00')
      }
    }
  },
  '.bashrc': {
    name: '.bashrc',
    type: 'file',
    content: `# ~/.bashrc: executed by bash(1) for non-login shells.
# Terminal Lab Configuration
export PS1='user@terminal-lab:~$ '
export PATH=/usr/local/bin:/usr/bin:/bin
# Aliases
alias ll='ls -la'
alias la='ls -A'
alias l='ls -CF'
echo "Welcome to Terminal Lab!"`,
    permissions: '-rw-r--r--',
    size: 287,
    modified: new Date('2025-01-01T09:15:00')
  }
});
class TerminalState {
  private fs: { [key: string]: VirtualFile };
  private currentPath: string;
  private currentDir: string[];
  private createdFiles: Set<string>;
  constructor() {
    this.fs = createVirtualFS();
    this.currentPath = '/home/user/terminal-lab';
    this.currentDir = [];
    this.createdFiles = new Set();
  }
  getCurrentPath(): string {
    return this.currentPath + (this.currentDir.length > 0 ? '/' + this.currentDir.join('/') : '');
  }
  getCurrentPrompt(): string {
    const dirName = this.currentDir.length > 0 ? this.currentDir[this.currentDir.length - 1] : 'terminal-lab';
    return `user@terminal-lab:~${this.currentDir.length > 0 ? '/' + this.currentDir.join('/') : ''}$`;
  }
  private resolvePath(path: string): VirtualFile | null {
    let targetPath: string[];
    if (path.startsWith('/')) {
      path = path.replace('/home/user/terminal-lab/', '');
      targetPath = path ? path.split('/').filter(p => p) : [];
    } else if (path === '.' || path === '') {
      targetPath = [...this.currentDir];
    } else if (path === '..') {
      targetPath = this.currentDir.slice(0, -1);
    } else if (path.startsWith('../')) {
      targetPath = [...this.currentDir];
      const parts = path.split('/').filter(p => p);
      for (const part of parts) {
        if (part === '..') {
          targetPath.pop();
        } else {
          targetPath.push(part);
        }
      }
    } else {
      targetPath = [...this.currentDir, ...path.split('/').filter(p => p)];
    }
    let current: VirtualFile | null = {
      name: 'terminal-lab',
      type: 'directory',
      permissions: 'drwxr-xr-x',
      size: 4096,
      modified: new Date(),
      children: this.fs
    };
    for (const part of targetPath) {
      if (current?.type === 'directory' && current.children) {
        current = current.children[part] || null;
        if (!current) break;
      } else {
        return null;
      }
    }
    return current;
  }
  private changeDirectory(path: string): string {
    if (!path || path === '~') {
      this.currentDir = [];
      return '';
    }
    let targetPath: string[];
    if (path.startsWith('/')) {
      path = path.replace('/home/user/terminal-lab/', '');
      targetPath = path ? path.split('/').filter(p => p) : [];
    } else if (path === '.') {
      return '';
    } else if (path === '..') {
      if (this.currentDir.length > 0) {
        this.currentDir.pop();
      }
      return '';
    } else {
      targetPath = [...this.currentDir];
      const parts = path.split('/').filter(p => p);
      for (const part of parts) {
        if (part === '..') {
          targetPath.pop();
        } else if (part !== '.') {
          targetPath.push(part);
        }
      }
    }
    const target = this.resolvePath(targetPath.join('/'));
    if (!target) {
      return `cd: ${path}: No such file or directory`;
    }
    if (target.type !== 'directory') {
      return `cd: ${path}: Not a directory`;
    }
    this.currentDir = targetPath;
    return '';
  }
  private createFile(fileName: string): void {
    const currentDirObj = this.resolvePath('.');
    if (currentDirObj && currentDirObj.type === 'directory' && currentDirObj.children) {
      currentDirObj.children[fileName] = {
        name: fileName,
        type: 'file',
        content: '',
        permissions: '-rw-r--r--',
        size: 0,
        modified: new Date()
      };
    }
  }
  private createDirectory(dirName: string): void {
    const currentDirObj = this.resolvePath('.');
    if (currentDirObj && currentDirObj.type === 'directory' && currentDirObj.children) {
      currentDirObj.children[dirName] = {
        name: dirName,
        type: 'directory',
        permissions: 'drwxr-xr-x',
        size: 4096,
        modified: new Date(),
        children: {}
      };
    }
  }
  executeCommand(command: string, args: string[]): string {
  switch (command) {
    case 'pwd':
        return this.getCurrentPath();
      case 'cd':
        const cdResult = this.changeDirectory(args[0] || '~');
        return cdResult;
    case 'ls':
        const showHidden = args.includes('-a') || args.includes('-la');
        const longFormat = args.includes('-l') || args.includes('-la');
        const targetPath = args.find(arg => !arg.startsWith('-')) || '.';
        const target = this.resolvePath(targetPath);
        if (!target) {
          return `ls: cannot access '${targetPath}': No such file or directory`;
        }
        if (target.type === 'file') {
          return longFormat ?
            `${target.permissions} 1 user user ${target.size} ${target.modified.toLocaleDateString()} ${target.name}` :
            target.name;
        }
        if (!target.children) {
          return '';
        }
        const entries = Object.values(target.children);
        if (entries.length === 0 && !showHidden) {
          return '';
        }
        if (showHidden) {
          entries.unshift(
            { name: '.', type: 'directory', permissions: 'drwxr-xr-x', size: 4096, modified: new Date() },
            { name: '..', type: 'directory', permissions: 'drwxr-xr-x', size: 4096, modified: new Date() }
          );
        }
        if (longFormat) {
          const total = entries.reduce((sum, entry) => sum + Math.ceil(entry.size / 1024), 0);
          let output = `total ${total}\n`;
          output += entries.map(entry =>
            `${entry.permissions} 1 user user ${entry.size.toString().padStart(4)} ${entry.modified.toLocaleDateString()} ${entry.name}`
          ).join('\n');
          return output;
        }
        return entries.map(entry => entry.name).join('  ');
    case 'cat':
        if (args.length === 0) {
          return 'cat: missing file operand\nTry \'cat --help\' for more information.';
        }
        const results = args.map(fileName => {
          const file = this.resolvePath(fileName);
          if (!file) {
            return `cat: ${fileName}: No such file or directory`;
          }
          if (file.type === 'directory') {
            return `cat: ${fileName}: Is a directory`;
          }
          return file.content || '';
        });
        return results.join('\n');
    case 'grep':
        if (args.length < 2) {
          return 'grep: missing arguments\nUsage: grep pattern filename';
        }
        const pattern = args[0];
        const fileName = args[1];
        const caseInsensitive = args.includes('-i');
        const file = this.resolvePath(fileName);
        if (!file) {
          return `grep: ${fileName}: No such file or directory`;
        }
        if (file.type === 'directory') {
          return `grep: ${fileName}: Is a directory`;
        }
        const content = file.content || '';
        const lines = content.split('\n');
        const regex = new RegExp(pattern, caseInsensitive ? 'gi' : 'g');
        const matches = lines
          .map((line, index) => ({ line, number: index + 1 }))
          .filter(({ line }) => regex.test(line));
        if (matches.length === 0) {
          return '';
        }
        return matches.map(({ line, number }) => `${fileName}:${number}:${line}`).join('\n');
      case 'touch':
        if (args.length === 0) {
          return 'touch: missing file operand\nTry \'touch --help\' for more information.';
        }
        const created = args.map(fileName => {
          this.createFile(fileName);
          return fileName;
        });
        return '';
      case 'mkdir':
        if (args.length === 0) {
          return 'mkdir: missing operand\nTry \'mkdir --help\' for more information.';
        }
        const createdDirs = args.map(dirName => {
          this.createDirectory(dirName);
          return dirName;
        });
        return '';
    case 'ps':
      return `  PID TTY          TIME CMD
 1234 pts/0    00:00:01 bash
 5678 pts/0    00:00:00 node
 8901 pts/0    00:00:00 terminal-lab
 9012 pts/0    00:00:00 ps`;
    case 'df':
      if (args.includes('-h')) {
        return `Filesystem      Size  Used Avail Use% Mounted on
/dev/sda1        20G  8.5G   11G  45% /
tmpfs           2.0G     0  2.0G   0% /tmp
/dev/sda2       100G   45G   50G  48% /home`;
      }
      return `Filesystem     1K-blocks    Used Available Use% Mounted on
/dev/sda1       20971520 8912896  11534336  45% /
/dev/sda2      104857600 47185920  52428800  48% /home`;
    case 'whoami':
      return 'user';
    case 'date':
      return new Date().toString();
      case 'echo':
        return args.join(' ');
      case 'help':
        return `Terminal Lab - Available Commands:
Navigation:
  pwd                    Print working directory
  cd [directory]         Change directory (. = current, .. = parent, ~ = home)
  ls [options] [path]    List directory contents (-l, -a, -la)
File Operations:
  cat filename           Display file contents
  touch filename         Create empty file
  mkdir dirname          Create directory
Text Processing:
  grep pattern file      Search for pattern in file (-i for case-insensitive)
  echo text              Display text
System Information:
  ps                     Display running processes
  df [-h]               Display filesystem usage
  whoami                Display current username
  date                  Display current date and time
Utility:
  clear                 Clear terminal screen
  help                  Show this help message
Examples:
  cd Documents          # Enter Documents directory
  cd ..                 # Go back to parent directory
  ls -la               # List all files with details
  cat Documents/notes.txt    # Read a file
  grep "Terminal" Projects/hello.txt  # Search in file
  echo "Hello World"   # Display text`;
      case 'clear':
        return 'CLEAR';
    default:
        return `bash: ${command}: command not found\nType 'help' to see available commands.`;
    }
  }
}
const terminalState = new TerminalState();
const executeCommand = (command: string, args: string[]): string => {
  return terminalState.executeCommand(command, args);
};
const LandingPage: React.FC<{ onEnterApp: () => void }> = ({ onEnterApp }) => {
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    setIsVisible(true);
  }, []);
  const features = [
    {
      icon: MdTerminal,
      title: "Interactive Terminal",
      description: "Practice real terminal commands in a safe, virtual environment with instant feedback."
    },
    {
      icon: MdSchool,
      title: "Guided Learning",
      description: "Step-by-step lessons that build your command line skills from beginner to advanced."
    },
    {
      icon: MdSpeed,
      title: "Real-time Feedback",
      description: "Get immediate validation and hints as you learn, making the process efficient and engaging."
    },
    {
      icon: MdEmojiEvents,
      title: "Progress Tracking",
      description: "Monitor your learning journey with XP points, completion badges, and session statistics."
    },
    {
      icon: MdDevices,
      title: "Cross-platform",
      description: "Works seamlessly on desktop and mobile devices with responsive design and touch support."
    },
    {
      icon: MdCloud,
      title: "Auto-save Progress",
      description: "Your progress is automatically saved and restored, so you never lose your learning momentum."
    }
  ];
  const stats = [
    { number: "4+", label: "Interactive Lessons" },
    { number: "20+", label: "Terminal Commands" },
    { number: "100%", label: "Hands-on Practice" },
    { number: "0", label: "Installation Required" }
  ];
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-900 to-gray-950 text-gray-100 font-mono relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-900/20 via-transparent to-purple-900/20"></div>
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.5, 0.3, 0.5]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
      </div>
      <motion.header
        className="relative z-10 bg-gray-900/80 backdrop-blur-xl border-b border-gray-700/50 px-4 sm:px-6 py-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : -20 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-green-400 rounded-full animate-pulse"></div>
              <MdTerminal className="w-5 h-5 sm:w-6 sm:h-6 text-green-400" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-gray-200">Terminal Lab</h1>
              <p className="text-xs text-gray-500 hidden sm:block">Interactive Learning Platform</p>
            </div>
          </div>
          <motion.button
            onClick={onEnterApp}
            className="px-4 py-2 sm:px-6 sm:py-2 bg-gradient-to-r cursor-pointer from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg transition-colors font-medium flex items-center gap-2 text-sm sm:text-base shadow-lg shadow-blue-900/30"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <MdRocketLaunch className="w-4 h-4" />
            <span className="hidden sm:inline">Launch App</span>
            <span className="sm:hidden">Launch</span>
          </motion.button>
        </div>
      </motion.header>
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h2 className="text-4xl sm:text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-green-400 bg-clip-text text-transparent mb-4 sm:mb-6 leading-tight">
              Master the Terminal
            </h2>
            <p className="text-lg sm:text-xl md:text-2xl text-gray-400 mb-6 sm:mb-8 max-w-3xl mx-auto leading-relaxed px-4">
              Learn command line skills through interactive lessons, real-time feedback, and hands-on practice in a safe virtual environment.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8 sm:mb-12 px-4"
          >
            <motion.button
              onClick={onEnterApp}
              className="w-full sm:w-auto px-6 sm:px-8 cursor-pointer py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-semibold text-base sm:text-lg flex items-center justify-center gap-3 shadow-2xl shadow-blue-900/30"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <MdPlayArrow className="w-5 h-5 sm:w-6 sm:h-6" />
              Start Learning Now
            </motion.button>
            <motion.div
              className="text-gray-500 text-sm text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: isVisible ? 1 : 0 }}
              transition={{ delay: 0.6 }}
            >
              No installation required • Free forever
            </motion.div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8 max-w-2xl mx-auto px-4"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="text-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: isVisible ? 1 : 0, scale: isVisible ? 1 : 0.8 }}
                transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
              >
                <div className="text-2xl sm:text-3xl font-bold text-blue-400 mb-1">{stat.number}</div>
                <div className="text-gray-500 text-xs sm:text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center mb-12 sm:mb-16"
        >
          <h3 className="text-3xl sm:text-4xl font-bold text-gray-200 mb-3 sm:mb-4">Why Choose Terminal Lab?</h3>
          <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto px-4">
            Experience the most effective way to learn terminal commands with our interactive platform designed for modern learners.
          </p>
        </motion.div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 px-4">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4 sm:p-6 hover:bg-gray-700/50 transition-all duration-300 group"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
              transition={{ duration: 0.6, delay: 1 + index * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                <div className="p-2.5 sm:p-3 bg-blue-600/20 border border-blue-500/30 rounded-lg group-hover:bg-blue-600/30 transition-colors w-fit">
                  <feature.icon className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
                </div>
                <h4 className="text-lg sm:text-xl font-semibold text-gray-200">{feature.title}</h4>
              </div>
              <p className="text-gray-400 leading-relaxed text-sm sm:text-base">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>
      <section className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
          transition={{ duration: 0.8, delay: 1.4 }}
          className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-8 sm:p-12 text-center"
        >
          <h3 className="text-2xl sm:text-3xl font-bold text-gray-200 mb-3 sm:mb-4">Ready to Start Your Journey?</h3>
          <p className="text-gray-400 text-base sm:text-lg mb-6 sm:mb-8 max-w-2xl mx-auto">
            Join thousands of developers who have mastered the terminal with our interactive learning platform. Start your first lesson in seconds.
          </p>
          <motion.button
            onClick={onEnterApp}
            className="w-full sm:w-auto px-6 cursor-pointer sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-semibold text-base sm:text-lg flex items-center justify-center gap-3 shadow-2xl shadow-blue-900/30 m-auto"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <MdTerminal className="w-5 h-5 sm:w-6 sm:h-6" />
            Enter Terminal Lab
            <MdArrowForward className="w-4 h-4 sm:w-5 sm:h-5" />
          </motion.button>
        </motion.div>
      </section>
      <footer className="relative z-10 bg-gray-900/80 backdrop-blur-xl border-t border-gray-700/50 px-4 sm:px-6 py-6 sm:py-8 mt-12 sm:mt-20">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-3 sm:mb-4">
            <MdTerminal className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />
            <span className="text-gray-300 font-semibold text-sm sm:text-base">Terminal Lab</span>
          </div>
          <p className="text-gray-500 text-xs sm:text-sm">
            2025 Terminal Lab. Interactive Terminal Learning Platform.
          </p>
        </div>
      </footer>
    </div>
  );
};
const TerminalEmulator: React.FC<{ onBackToLanding: () => void }> = ({ onBackToLanding }) => {
  const [lessonsData, setLessonsData] = useState<Lesson[]>(lessons);
  const [isProgressLoaded, setIsProgressLoaded] = useState(false);
  const [currentLesson, setCurrentLesson] = useState<Lesson>(lessonsData[0]);
  const [terminalOutput, setTerminalOutput] = useState<TerminalOutput[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [completedCommands, setCompletedCommands] = useState<string[]>([]);
  const [feedback, setFeedback] = useState('');
  const feedbackTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const setFeedbackWithTimeout = (message: string, timeout: number = 5000) => {
    if (feedbackTimeoutRef.current) {
      clearTimeout(feedbackTimeoutRef.current);
    }
    setFeedback(message);
    if (message && timeout > 0) {
      feedbackTimeoutRef.current = setTimeout(() => {
        setFeedback('');
        feedbackTimeoutRef.current = null;
      }, timeout);
    }
  };
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [isOnline, setIsOnline] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const [sessionRestored, setSessionRestored] = useState(false);
  const [sessionStats, setSessionStats] = useState({
    commandsExecuted: 0,
    sessionStartTime: new Date(),
    lessonsCompletedThisSession: 0
  });
  const [sessionDuration, setSessionDuration] = useState(0);
  const [showInstructions, setShowInstructions] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isMobileInstructionsOpen, setIsMobileInstructionsOpen] = useState(true);
  useEffect(() => {
    if (showInstructions) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showInstructions]);
  useEffect(() => {
    if (isMobileSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileSidebarOpen]);
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileSidebarOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const sessionToastShownRef = useRef<boolean>(false);
  const saveProgress = (lessonId: string, completed: boolean, commands?: string[]) => {
    if (typeof window !== 'undefined') {
      try {
        const savedProgress = localStorage.getItem('terminal-lab-progress');
        const progressData = savedProgress ? JSON.parse(savedProgress) : {};
        progressData[lessonId] = {
          completed,
          completedCommands: commands || []
        };
        localStorage.setItem('terminal-lab-progress', JSON.stringify(progressData));
      } catch (error) {
        console.error('Error saving progress:', error);
      }
    }
  };
  const saveTerminalSession = () => {
    if (typeof window !== 'undefined') {
      try {
        const sessionData = {
          terminalOutput: terminalOutput.slice(-50),
          commandHistory: commandHistory.slice(-20),
          currentLesson: currentLesson.id,
          completedCommands,
          lastUpdated: new Date().toISOString()
        };
        localStorage.setItem('terminal-lab-session', JSON.stringify(sessionData));
      } catch (error) {
        console.error('Error saving terminal session:', error);
      }
    }
  };
  const loadTerminalSession = () => {
    if (typeof window !== 'undefined') {
      try {
        const savedSession = localStorage.getItem('terminal-lab-session');
        if (savedSession) {
          const sessionData = JSON.parse(savedSession);
          const lastUpdated = new Date(sessionData.lastUpdated);
          const now = new Date();
          const hoursDiff = (now.getTime() - lastUpdated.getTime()) / (1000 * 60 * 60);
          if (hoursDiff < 24) {
            return sessionData;
          }
        }
      } catch (error) {
        console.error('Error loading terminal session:', error);
      }
    }
    return null;
  };
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      const durationMinutes = Math.floor((Date.now() - sessionStats.sessionStartTime.getTime()) / (1000 * 60));
      setSessionDuration(durationMinutes);
    }, 1000);
    return () => clearInterval(timer);
  }, [sessionStats.sessionStartTime]);
  useEffect(() => {
    if (!isProgressLoaded) {
      try {
        const savedProgress = localStorage.getItem('terminal-lab-progress');
        if (savedProgress) {
          const progressData = JSON.parse(savedProgress);
          const updatedLessons = lessons.map(lesson => {
            const lessonProgress = progressData[lesson.id];
            const completed = typeof lessonProgress === 'boolean' ? lessonProgress : lessonProgress?.completed || false;
            return {
              ...lesson,
              completed
            };
          });
          setLessonsData(updatedLessons);
        }
        const sessionData = loadTerminalSession();
        if (sessionData) {
          setSessionRestored(true);
          if (sessionData.terminalOutput && sessionData.terminalOutput.length > 0) {
            setTerminalOutput(sessionData.terminalOutput);
            if (!sessionToastShownRef.current) {
              sessionToastShownRef.current = true;
              toast.dismiss('session-restored-toast');
              setTimeout(() => {
                toast((t) => (
                  <div className="flex items-center justify-between gap-3 w-full">
                    <div className="flex items-center gap-2">
                      <MdCheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                      <span className="text-sm text-gray-100">Session restored! Previous work recovered.</span>
                    </div>
                    <button
                      onClick={() => toast.dismiss(t.id)}
                      className="text-gray-400 hover:text-gray-200 transition-colors p-1 rounded hover:bg-gray-600/50"
                      title="Close"
                    >
                      <MdClose className="w-4 h-4" />
                    </button>
                  </div>
                ), {
                  id: 'session-restored-toast',
                  duration: 4000,
                  style: {
                    background: '#1f2937',
                    color: '#f3f4f6',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    fontSize: '14px',
                    maxWidth: '400px',
                    padding: '12px 16px'
                  }
                });
              }, 100);
            }
          } else {
            setTerminalOutput([{
              id: '1',
              type: 'system',
              content: `Terminal Learning Platform v2.1.0
Copyright (c) 2025 Terminal Labs
Type 'help' for available commands.`,
              timestamp: new Date()
            }]);
          }
          if (sessionData.commandHistory) {
            setCommandHistory(sessionData.commandHistory);
          }
          if (sessionData.currentLesson) {
            const restoredLesson = lessonsData.find(l => l.id === sessionData.currentLesson) || lessonsData[0];
            setCurrentLesson(restoredLesson);
          }
          if (sessionData.completedCommands) {
            setCompletedCommands(sessionData.completedCommands);
          }
        } else {
          setTerminalOutput([{
            id: '1',
            type: 'system',
            content: `Terminal Learning Platform v2.1.0
Copyright (c) 2025 Terminal Labs
Type 'help' for available commands.`,
            timestamp: new Date()
          }]);
        }
      } catch (error) {
        console.error('Error loading saved data:', error);
        setTerminalOutput([{
          id: '1',
          type: 'system',
          content: `Terminal Learning Platform v2.1.0
Copyright (c) 2025 Terminal Labs
Type 'help' for available commands.`,
          timestamp: new Date()
        }]);
      }
      setIsProgressLoaded(true);
    }
  }, [isProgressLoaded]);
  useEffect(() => {
    setIsClient(true);
    setCurrentTime(new Date());
    setIsOnline(navigator.onLine);
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [terminalOutput]);
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);
  useEffect(() => {
    const totalLessons = lessonsData.length;
    const completedLessons = lessonsData.filter(l => l.completed).length;
    setProgress((completedLessons / totalLessons) * 100);
  }, [lessonsData]);
  useEffect(() => {
    if (isProgressLoaded && terminalOutput.length > 0) {
      saveTerminalSession();
    }
  }, [terminalOutput, commandHistory, currentLesson.id, completedCommands, isProgressLoaded]);
  useEffect(() => {
    return () => {
      if (feedbackTimeoutRef.current) {
        clearTimeout(feedbackTimeoutRef.current);
      }
    };
  }, []);
  const handleCommand = (input: string) => {
    if (!input.trim()) return;
    const { command, args } = parseCommand(input);
    setCommandHistory(prev => [...prev, input]);
    setHistoryIndex(-1);
    setSessionStats(prev => ({
      ...prev,
      commandsExecuted: prev.commandsExecuted + 1
    }));
    const inputEntry: TerminalOutput = {
      id: Date.now().toString(),
      type: 'input',
      content: input,
      timestamp: new Date(),
      prompt: terminalState.getCurrentPrompt()
    };
    if (command === 'clear') {
      setTerminalOutput([]);
      setCurrentInput('');
      return;
    }
    const result = executeCommand(command, args);
    const outputType = result.includes('not found') || result.includes('missing') ? 'error' : 
                      result.includes('created') || result.includes('File(s)') ? 'success' : 'output';
    const outputEntry: TerminalOutput = {
      id: (Date.now() + 1).toString(),
      type: outputType,
      content: result,
      timestamp: new Date()
    };
    setTerminalOutput(prev => [...prev, inputEntry, outputEntry]);
    if (currentLesson.expectedCommands.includes(command)) {
      if (!completedCommands.includes(command)) {
        setCompletedCommands(prev => [...prev, command]);
        const remaining = currentLesson.expectedCommands.length - completedCommands.length - 1;
        setFeedbackWithTimeout(remaining > 0 ?
          `Command "${command}" executed successfully! ${remaining} more to go.` :
          'Excellent! Lesson completed. Ready for the next challenge?'
        );
        if (completedCommands.length + 1 === currentLesson.expectedCommands.length) {
          const allCompletedCommands = [...completedCommands, command];
          const updatedLessons = lessonsData.map(lesson =>
            lesson.id === currentLesson.id
              ? { ...lesson, completed: true }
              : lesson
          );
          setLessonsData(updatedLessons);
          saveProgress(currentLesson.id, true, allCompletedCommands);
          if (!currentLesson.completed) {
            setSessionStats(prev => ({
              ...prev,
              lessonsCompletedThisSession: prev.lessonsCompletedThisSession + 1
            }));
          }
          const updatedCurrentLesson = { ...currentLesson, completed: true };
          setCurrentLesson(updatedCurrentLesson);
        } else {
          saveProgress(currentLesson.id, false, [...completedCommands, command]);
        }
      } else {
        setFeedback('');
      }
    } else if (currentLesson.expectedCommands.length > 0) {
      const remainingCommands = currentLesson.expectedCommands.filter(cmd => !completedCommands.includes(cmd));
      if (remainingCommands.length > 0) {
        setFeedbackWithTimeout(`Try: ${remainingCommands.join(', ')}`, 3000);
      } else {
        setFeedback('');
      }
    } else {
      setFeedback('');
    }
    setCurrentInput('');
  };
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCommand(currentInput);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setCurrentInput(commandHistory[newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex !== -1) {
        const newIndex = historyIndex + 1;
        if (newIndex >= commandHistory.length) {
          setHistoryIndex(-1);
          setCurrentInput('');
        } else {
          setHistoryIndex(newIndex);
          setCurrentInput(commandHistory[newIndex]);
        }
      }
    }
  };
  const selectLesson = (lesson: Lesson) => {
    const currentLessonData = lessonsData.find(l => l.id === lesson.id) || lesson;
    setCurrentLesson(currentLessonData);
    setFeedback('');
    setIsMobileSidebarOpen(false);
    try {
      const savedProgress = localStorage.getItem('terminal-lab-progress');
      if (savedProgress) {
        const progressData = JSON.parse(savedProgress);
        const lessonProgress = progressData[lesson.id];
        if (lessonProgress && typeof lessonProgress === 'object' && lessonProgress.completedCommands) {
          setCompletedCommands(lessonProgress.completedCommands);
        } else {
          setCompletedCommands([]);
        }
      } else {
        setCompletedCommands([]);
      }
    } catch (error) {
      console.error('Error loading lesson commands:', error);
      setCompletedCommands([]);
    }
  };
  const SystemBar = useMemo(() => (
    <div className="sticky top-0 z-50 bg-gray-900/95 backdrop-blur-xl border-b border-gray-700/50 px-3 sm:px-4 py-3 sm:py-2.5 shadow-lg">
      <div className="flex items-center justify-between text-xs text-gray-400">
        <div className="flex items-center gap-3 sm:gap-6">
          <div className="flex items-center gap-2 sm:gap-2">
            <button
              onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
              className="md:hidden flex items-center justify-center w-8 h-8 text-gray-400 hover:text-purple-400 hover:bg-purple-900/20 rounded transition-colors mr-1"
              title="Toggle Menu"
            >
              <MdMenu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
              <MdTerminal className="w-4 h-4 sm:w-3 sm:h-3 text-blue-400" />
          </div>
            <span className="text-gray-300 font-medium text-sm sm:text-xs">Terminal Lab</span>
          </div>
          <div className="hidden sm:flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <MdMemory className="w-3 h-3 text-blue-400" />
              <span>CPU: <span className="text-blue-400">45%</span></span>
          </div>
            <div className="flex items-center gap-1.5">
              <MdStorage className="w-3 h-3 text-purple-400" />
              <span>RAM: <span className="text-purple-400">2.1GB</span></span>
        </div>
            <div className="flex items-center gap-1.5">
              <MdWifi className={`w-3 h-3 ${isOnline ? 'text-green-400' : 'text-red-400'}`} />
              <span>Network: <span className={isOnline ? 'text-green-400' : 'text-red-400'}>{isOnline ? 'Connected' : 'Offline'}</span></span>
        </div>
      </div>
    </div>
        <div className="flex items-center gap-3 sm:gap-6">
          <div className="hidden sm:flex items-center gap-3">
            <span className="text-gray-500">Session:</span>
            <span className="text-blue-400 font-mono">{sessionStats.commandsExecuted} cmds</span>
        </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowInstructions(true)}
              className="flex items-center cursor-pointer gap-1 px-2 py-1.5 sm:py-1 text-xs text-gray-400 hover:text-blue-400 hover:bg-blue-900/20 rounded transition-colors"
              title="Show Instructions"
            >
              <MdHelp className="w-4 h-4 sm:w-3 sm:h-3" />
              <span className="hidden sm:inline">Help</span>
            </button>
            <button
              onClick={onBackToLanding}
              className="flex items-center cursor-pointer gap-1 px-2 py-1.5 sm:py-1 text-xs text-gray-400 hover:text-purple-400 hover:bg-purple-900/20 rounded transition-colors"
              title="Back to Landing Page"
            >
              <MdArrowForward className="w-4 h-4 sm:w-3 sm:h-3 rotate-180" />
              <span className="hidden sm:inline">Back</span>
            </button>
            <span className="hidden sm:inline text-gray-300 font-mono text-xs">{currentTime?.toLocaleTimeString() || '--:--:--'}</span>
          </div>
          </div>
          </div>
        </div>
  ), [sessionStats.commandsExecuted, currentTime, isOnline, isMobileSidebarOpen]);
  const LessonsList = React.useMemo(() => (
    <div className="bg-gray-800/70 backdrop-blur-sm border border-gray-600/70 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-3">
        <MdMenuBook className="w-4 h-4 text-blue-400" />
        <h3 className="text-sm font-semibold text-gray-200">Available Lessons</h3>
        </div>
        <div className="space-y-2">
        {lessonsData.map((lesson, index) => (
          <div
              key={lesson.id}
            className={`p-3 rounded-lg border cursor-pointer transition-all text-xs shadow-sm ${currentLesson.id === lesson.id
                ? 'bg-blue-600/40 border-blue-400/70 text-blue-200 shadow-blue-900/40'
                : lesson.completed
                  ? 'bg-green-900/40 border-green-600/70 text-green-200 hover:bg-green-800/50'
                  : 'bg-gray-800/70 border-gray-600/70 text-gray-200 hover:bg-gray-700/70 hover:border-gray-500/70'
              }`}
              onClick={() => selectLesson(lesson)}
            >
              <div className="flex items-center gap-2 mb-1">
                {lesson.completed ? (
                <MdCheckCircle className="w-3 h-3 text-green-400" />
              ) : currentLesson.id === lesson.id ? (
                <MdPlayArrow className="w-3 h-3 text-blue-400" />
                ) : (
                <MdRadioButtonUnchecked className="w-3 h-3 text-gray-500" />
                )}
                <span className="font-medium">{lesson.title}</span>
              {lesson.completed && (
                <div className="ml-auto text-xs text-green-400 font-bold">+25 XP</div>
              )}
              </div>
              <p className="text-gray-400 text-xs leading-tight">{lesson.description}</p>
            <div className="flex items-center gap-2 mt-2">
              <div className="text-xs text-gray-300">
                {lesson.commands.length} commands
              </div>
              {currentLesson.id === lesson.id && completedCommands.length > 0 && (
                <div className="text-xs text-blue-400">
                  {completedCommands.length}/{lesson.expectedCommands.length} done
                </div>
              )}
            </div>
          </div>
          ))}
        </div>
      </div>
  ), [lessonsData, currentLesson.id, completedCommands.length]);
  const SessionStatsPanel = React.useMemo(() => (
    <div className="bg-gray-800/70 backdrop-blur-sm border border-gray-600/70 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-3">
        <MdShowChart className="w-4 h-4 text-purple-400" />
        <h3 className="text-sm font-semibold text-gray-200">Session Stats</h3>
    </div>
      <div className="space-y-2 text-xs text-gray-400">
        <div className="flex justify-between">
          <span>Commands this session:</span>
          <span className="text-blue-400">{sessionStats.commandsExecuted}</span>
        </div>
        <div className="flex justify-between">
          <span>Lessons completed:</span>
          <span className="text-purple-400">{sessionStats.lessonsCompletedThisSession}</span>
        </div>
        <div className="flex justify-between">
          <span>Session duration:</span>
          <span className="text-blue-400">
            {sessionDuration}m
          </span>
        </div>
      </div>
    </div>
  ), [sessionStats.commandsExecuted, sessionStats.lessonsCompletedThisSession, sessionDuration]);
  const instructionsModalJSX = useMemo(() => (
    <AnimatePresence>
      {showInstructions && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={() => setShowInstructions(false)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="bg-gray-900/95 backdrop-blur-xl border border-gray-700/50 rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto scrollbar-hide shadow-2xl"
              style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none'
              }}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <MdTerminal className="w-6 h-6 text-blue-400" />
                  <h2 className="text-xl font-bold text-gray-200">Terminal Lab Instructions</h2>
                </div>
        <button
                  onClick={() => setShowInstructions(false)}
                  className="p-2 text-gray-400 hover:text-gray-200 hover:bg-gray-800/50 rounded-lg transition-colors"
        >
                  <MdClose className="w-5 h-5" />
        </button>
              </div>
              <div className="space-y-6 text-gray-300">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-600/20 border border-blue-500/30 rounded-lg flex items-center justify-center text-blue-400 font-bold text-sm">
                      1
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-200 mb-1">Choose a Lesson</h3>
                      <p className="text-sm text-gray-400">Select any lesson from the "Available Lessons" panel on the left. Each lesson teaches specific terminal commands with hands-on practice.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-green-600/20 border border-green-500/30 rounded-lg flex items-center justify-center text-green-400 font-bold text-sm">
                      2
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-200 mb-1">Practice Commands</h3>
                      <p className="text-sm text-gray-400">Type the commands shown in the "Commands to Practice" section. The terminal will guide you through each command with examples and feedback.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-purple-600/20 border border-purple-500/30 rounded-lg flex items-center justify-center text-purple-400 font-bold text-sm">
                      3
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-200 mb-1">Get Real-time Feedback</h3>
                      <p className="text-sm text-gray-400">The system provides instant feedback on your commands. Green checkmarks indicate completed commands, and hints guide you to the next steps.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-yellow-600/20 border border-yellow-500/30 rounded-lg flex items-center justify-center text-yellow-400 font-bold text-sm">
                      4
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-200 mb-1">Track Your Progress</h3>
                      <p className="text-sm text-gray-400">Monitor your learning progress, session stats, and completed lessons. Your progress is automatically saved and restored when you return.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-600/20 border border-blue-500/30 rounded-lg flex items-center justify-center text-blue-400 font-bold text-sm">
                      5
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-200 mb-1">Use Terminal Features</h3>
                      <p className="text-sm text-gray-400">Use arrow keys (↑/↓) for command history, type 'help' for available commands, and 'clear' to reset the terminal. All your work is automatically saved.</p>
                    </div>
                  </div>
                </div>
                <div className="bg-blue-900/20 border border-blue-700/30 rounded-lg p-4 mt-6">
                  <div className="flex items-center gap-2 mb-2">
                    <MdTipsAndUpdates className="w-4 h-4 text-blue-400" />
                    <span className="font-semibold text-blue-300">Pro Tip</span>
                  </div>
                  <p className="text-sm text-blue-200">Start with "Basic Navigation" if you're new to terminal commands. Each lesson builds upon the previous one, so completing them in order is recommended!</p>
                </div>
              </div>
              <div className="flex justify-end mt-6 pt-4 border-t border-gray-700/50">
                <button
                  onClick={() => setShowInstructions(false)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
                >
                  Got it!
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  ), [showInstructions]);
  const LessonsSidebar = ({ className }: { className?: string }) => (
    <div className={`space-y-4 ${className}`}>
      <div className="bg-gray-800/70 backdrop-blur-sm border border-gray-600/70 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <MdMonitor className="w-4 h-4 text-blue-400" />
          <h3 className="text-sm font-bold text-gray-200">Terminal Lab</h3>
        </div>
        <div className="text-xs text-gray-400 space-y-1">
          <div className="flex justify-between">
            <span>Version:</span>
            <span className="text-blue-400">v2.1.0</span>
          </div>
          <div className="flex justify-between">
            <span>Shell:</span>
            <span className="text-blue-400">bash</span>
          </div>
          <div className="flex justify-between">
            <span>Status:</span>
            <span className={`${isOnline ? 'text-green-400' : 'text-red-400'} flex items-center gap-1`}>
              <div className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-green-400' : 'bg-red-400'}`}></div>
              {isOnline ? 'Online' : 'Offline'}
            </span>
          </div>
        </div>
      </div>
      {ProgressSection}
      {LessonsList}
      {SessionStatsPanel}
    </div>
  );
  const completedLessonsCount = React.useMemo(() =>
    lessonsData.filter(l => l.completed).length,
    [lessonsData]
  );
  const ProgressSection = React.useMemo(() => (
    <div className="bg-gray-800/70 backdrop-blur-sm border border-gray-600/70 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-3">
        <MdEmojiEvents className="w-4 h-4 text-yellow-400" />
        <h3 className="text-sm font-semibold text-gray-200">Learning Progress</h3>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between text-xs text-gray-400">
          <span>Completion</span>
          <span className="text-blue-400 font-bold">{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2.5 overflow-hidden border border-gray-600/70">
          <div
            className="h-full bg-gradient-to-r from-blue-600 to-purple-600 rounded-full shadow-lg transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="text-xs text-gray-500 flex justify-between">
          <span>{completedLessonsCount}/{lessonsData.length} lessons</span>
          <span>{completedLessonsCount * 25} XP</span>
        </div>
      </div>
    </div>
  ), [progress, completedLessonsCount, lessonsData.length]);
  return (
    <div className={`min-h-screen bg-gradient-to-br from-gray-950 via-slate-900 to-gray-950 text-gray-100 font-mono relative ${showInstructions ? 'overflow-hidden' : 'overflow-hidden'}`}>
      <style dangerouslySetInnerHTML={{
        __html: `
          .scrollbar-hide::-webkit-scrollbar {
            display: none !important;
          }
          .scrollbar-hide {
            -ms-overflow-style: none !important;
            scrollbar-width: none !important;
          }
        `
      }} />
      <Toaster
        toastOptions={{
          style: {
            background: '#1f2937',
            color: '#f3f4f6',
            border: '1px solid #374151',
            borderRadius: '8px',
            fontSize: '14px',
            maxWidth: '400px'
          },
          success: {
            duration: 4000,
            iconTheme: {
              primary: '#10b981',
              secondary: '#1f2937'
            }
          },
          error: {
            duration: 5000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#1f2937'
            }
          }
        }}
        position="top-right"
        containerStyle={{
          top: 60,
          right: 20
        }}
        gutter={8}
        reverseOrder={false}
      />
      {instructionsModalJSX}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-900/20 via-transparent to-purple-900/20"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>
      {SystemBar}
        <AnimatePresence>
        {isMobileSidebarOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-md z-[60] md:hidden"
              onClick={() => setIsMobileSidebarOpen(false)}
              />
              <motion.div
              initial={{ x: -320 }}
                animate={{ x: 0 }}
              exit={{ x: -320 }}
              className="fixed left-0 top-0 h-full w-80 bg-gray-900/95 backdrop-blur-xl border-r border-gray-700/50 shadow-2xl z-[70] md:hidden"
              style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none'
              }}
            >
              <div className="bg-gray-800/80 backdrop-blur-sm border-b border-gray-700/50 px-3 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                    <MdTerminal className="w-4 h-4 text-blue-400" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-gray-200">Terminal Lab</h2>
                    <p className="text-xs text-gray-500">Interactive Learning Platform</p>
                  </div>
                </div>
                  <button
                  onClick={() => setIsMobileSidebarOpen(false)}
                  className="p-1.5 text-gray-400 hover:text-gray-200 hover:bg-gray-800/50 rounded-lg transition-colors"
                  title="Close Menu"
                  >
                  <MdClose className="w-4 h-4" />
                  </button>
                </div>
              <div
                className="overflow-y-auto p-4 scrollbar-hide"
                style={{
                  height: 'calc(100vh - 80px)',
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none'
                }}
              >
                <LessonsSidebar />
              </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      <div className="flex h-[calc(100vh-64px)] relative z-10">
        <div
          className="hidden md:block w-80 bg-gray-900/80 backdrop-blur-xl border-r border-gray-700/50 p-4 overflow-y-auto shadow-2xl scrollbar-hide"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }}
        >
          <LessonsSidebar />
              </div>
        <div className="flex-1 flex flex-col md:flex-row gap-2 sm:gap-4 p-2 sm:p-4">
          <div className="md:hidden w-full">
            <div className="bg-gray-900/80 backdrop-blur-xl border border-gray-700/50 rounded-lg mb-2 sm:mb-4 overflow-hidden">
              <button
                onClick={() => setIsMobileInstructionsOpen(!isMobileInstructionsOpen)}
                className="w-full p-3 sm:p-4 flex items-center justify-between text-left hover:bg-gray-800/50 transition-colors"
              >
                <div className="flex items-center gap-2 sm:gap-3">
                  <MdCode className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-gray-200">{currentLesson.title}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">Tap to {isMobileInstructionsOpen ? 'collapse' : 'expand'} lesson details</p>
              </div>
            </div>
                <motion.div
                  animate={{ rotate: isMobileInstructionsOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex-shrink-0 ml-2"
                >
                  <MdArrowForward className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 transform rotate-90" />
                </motion.div>
              </button>
              <AnimatePresence>
                {isMobileInstructionsOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div
                      className="p-3 sm:p-4 pt-0 max-h-80 sm:max-h-96 overflow-y-auto scrollbar-hide"
                      style={{
                        scrollbarWidth: 'none',
                        msOverflowStyle: 'none'
                      }}
                    >
                      <p className="text-gray-400 text-xs sm:text-sm mb-3 sm:mb-4">{currentLesson.description}</p>
                      <div className="space-y-2 sm:space-y-3">
                        <h4 className="text-xs sm:text-sm font-semibold text-gray-300 flex items-center gap-2">
                          <MdKeyboard className="w-3 h-3 sm:w-4 sm:h-4 text-blue-400" />
                          Commands to Practice
                        </h4>
                        {currentLesson.commands.map((cmd, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className={`p-2 sm:p-3 rounded-lg border text-xs transition-all duration-300 ${completedCommands.includes(cmd.name)
                                ? 'bg-green-900/40 border-green-700/50 shadow-lg shadow-green-900/20'
                                : 'bg-gray-800/50 border-gray-600/50 hover:bg-gray-700/50'
                              }`}
                          >
                            <div className="flex items-start gap-2 mb-2">
                              <div className="flex-shrink-0 mt-0.5">
                                {completedCommands.includes(cmd.name) ? (
                                  <MdCheckCircle className="w-3 h-3 text-green-400" />
                                ) : (
                                  <MdRadioButtonUnchecked className="w-3 h-3 text-gray-500" />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <code className="text-blue-400 font-bold text-xs sm:text-sm">{cmd.name}</code>
                                <p className="text-gray-400 mt-1 text-xs leading-relaxed">{cmd.description}</p>
                              </div>
                            </div>
                            <div className="ml-5 space-y-1">
                              <div>
                                <span className="text-gray-300 text-xs">Syntax: </span>
                                <code className="bg-black/50 px-1.5 sm:px-2 py-0.5 rounded text-green-400 backdrop-blur-sm text-xs">{cmd.syntax}</code>
                              </div>
                              <div className="flex flex-wrap items-center gap-1">
                                <span className="text-gray-300 text-xs flex-shrink-0">Examples: </span>
                                {cmd.examples.map((example, i) => (
                                  <code key={i} className="bg-black/50 px-1.5 sm:px-2 py-0.5 rounded text-blue-400 text-xs backdrop-blur-sm">
                                    {example}
                                  </code>
                                ))}
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                      <AnimatePresence>
                        {feedback && (
                          <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                            className="bg-blue-900/40 border border-blue-700/50 rounded-lg p-3 sm:p-4 backdrop-blur-sm shadow-lg shadow-blue-900/20 mt-3 sm:mt-4"
                          >
                            <div className="flex items-center gap-2 mb-2">
                              {feedback.includes('executed successfully') ? (
                                <MdCheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-400" />
                              ) : feedback.includes('Excellent') ? (
                                <MdCelebration className="w-3 h-3 sm:w-4 sm:h-4 text-purple-400" />
                              ) : (
                                <MdTipsAndUpdates className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400" />
                              )}
                              <span className="text-xs sm:text-sm font-semibold text-gray-200">Feedback</span>
                            </div>
                            <p className="text-gray-300 text-xs sm:text-sm">{feedback}</p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
          <div className="flex-1 md:flex-[3] bg-black/90 backdrop-blur-xl border border-gray-700/50 rounded-lg overflow-hidden flex flex-col shadow-2xl ring-1 ring-white/10">
            <div className="bg-gray-900/90 backdrop-blur-sm border-b border-gray-700/50 px-3 sm:px-4 py-2 sm:py-3 flex items-center justify-between">
              <div className="flex items-center gap-2 sm:gap-3">
                <MdTerminal className="w-3 h-3 sm:w-4 sm:h-4 text-green-400" />
                <span className="text-xs sm:text-sm text-gray-300 font-medium">user@terminal-lab</span>
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="flex gap-1 sm:gap-1.5">
                  <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-red-500 rounded-full hover:bg-red-400 cursor-pointer transition-colors shadow-lg"></div>
                  <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-yellow-500 rounded-full hover:bg-yellow-400 cursor-pointer transition-colors shadow-lg"></div>
                  <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-green-500 rounded-full hover:bg-green-400 cursor-pointer transition-colors shadow-lg"></div>
                </div>
              </div>
            </div>
            <div className="flex-1 flex flex-col min-h-0">
              <div 
                ref={terminalRef}
                className="flex-1 p-3 sm:p-4 overflow-y-auto text-xs sm:text-sm leading-relaxed font-mono bg-black/50 backdrop-blur-sm scrollbar-hide"
                style={{
                  fontFamily: '"SF Mono", "Monaco", "Inconsolata", "Roboto Mono", monospace',
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none'
                }}
              >
                {terminalOutput.map((output) => (
                  <motion.div
                    key={output.id}
                    initial={{ opacity: 0, y: 2 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className="mb-1"
                  >
                    {output.type === 'input' ? (
                      <div className="flex flex-wrap">
                        <span className="text-green-400 mr-1 sm:mr-2 font-bold text-xs sm:text-sm">{output.prompt || 'user@terminal-lab:~$'}</span>
                        <span className="text-gray-100 text-xs sm:text-sm break-all">{output.content}</span>
                      </div>
                    ) : (
                      <div className={`whitespace-pre-wrap break-words text-xs sm:text-sm ${output.type === 'error'
                          ? 'text-red-400' 
                          : output.type === 'success'
                          ? 'text-green-400'
                          : output.type === 'system'
                          ? 'text-blue-400'
                          : 'text-gray-300'
                      }`}>
                        <pre className="whitespace-pre-wrap break-words">{output.content}</pre>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
              <div className="border-t border-gray-800/50 p-3 sm:p-4 bg-gray-900/90 backdrop-blur-sm">
                <div className="flex items-center">
                  <span className="text-green-400 mr-1 sm:mr-2 text-xs sm:text-sm font-bold flex-shrink-0">{terminalState.getCurrentPrompt()}</span>
                  <input
                    ref={inputRef}
                    type="text"
                    value={currentInput}
                    onChange={(e) => setCurrentInput(e.target.value)}
                    onKeyDown={handleKeyPress}
                    className="flex-1 bg-transparent text-gray-100 outline-none font-mono text-xs sm:text-sm caret-green-400 placeholder-gray-500 min-w-0"
                    placeholder="Enter command..."
                    autoComplete="off"
                    spellCheck="false"
                  />
                  <div className="w-1.5 h-3 sm:w-2 sm:h-4 bg-green-400 animate-pulse ml-1 rounded-sm flex-shrink-0"></div>
                </div>
              </div>
            </div>
          </div>
          <div
            className="hidden md:block flex-[2] bg-gray-900/80 backdrop-blur-xl border border-gray-700/50 rounded-lg p-4 overflow-y-auto shadow-2xl ring-1 ring-white/5 scrollbar-hide"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none'
            }}
          >
            <div className="space-y-4">
              <div className="border border-gray-700/50 rounded-lg p-4 bg-gray-800/50 backdrop-blur-sm">
                <div className="flex items-center gap-2 mb-3">
                  <MdCode className="w-4 h-4 text-blue-400" />
                  <h3 className="text-lg font-bold text-gray-200">{currentLesson.title}</h3>
                </div>
                <p className="text-gray-400 text-sm mb-4">{currentLesson.description}</p>
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-gray-300 flex items-center gap-2">
                    <MdKeyboard className="w-4 h-4" />
                    Commands to Practice
                  </h4>
                  {currentLesson.commands.map((cmd, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`p-3 rounded-lg border text-xs transition-all duration-300 ${completedCommands.includes(cmd.name)
                          ? 'bg-green-900/40 border-green-700/50 shadow-lg shadow-green-900/20'
                          : 'bg-gray-800/50 border-gray-600/50 hover:bg-gray-700/50'
                        }`}
                    >
                      <div className="flex items-start gap-2 mb-3">
                        <div className="flex-shrink-0 mt-0.5">
                        {completedCommands.includes(cmd.name) ? (
                            <MdCheckCircle className="w-3 h-3 text-green-400" />
                        ) : (
                            <MdRadioButtonUnchecked className="w-3 h-3 text-gray-500" />
                        )}
                      </div>
                        <div className="flex-1 min-w-0">
                          <code className="text-blue-400 font-bold text-sm">{cmd.name}</code>
                          <p className="text-gray-400 mt-1 text-sm leading-relaxed">{cmd.description}</p>
                        </div>
                      </div>
                      <div className="ml-5 space-y-1">
                        <div>
                          <span className="text-gray-300 text-sm">Syntax: </span>
                          <code className="bg-black/50 px-2 py-0.5 rounded text-green-400 backdrop-blur-sm text-sm">{cmd.syntax}</code>
                        </div>
                        <div className="flex flex-wrap items-center gap-1">
                          <span className="text-gray-300 text-sm flex-shrink-0">Examples: </span>
                            {cmd.examples.map((example, i) => (
                            <code key={i} className="bg-black/50 px-2 py-0.5 rounded text-blue-400 text-xs backdrop-blur-sm">
                                {example}
                              </code>
                            ))}
                          </div>
                        </div>
                    </motion.div>
                  ))}
                </div>
              </div>
              <AnimatePresence>
                {feedback && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    className="bg-blue-900/40 border border-blue-700/50 rounded-lg p-4 backdrop-blur-sm shadow-lg shadow-blue-900/20"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      {feedback.includes('executed successfully') ? (
                        <MdCheckCircle className="w-4 h-4 text-green-400" />
                      ) : feedback.includes('Excellent') ? (
                        <MdCelebration className="w-4 h-4 text-purple-400" />
                      ) : (
                        <MdTipsAndUpdates className="w-4 h-4 text-yellow-400" />
                      )}
                      <span className="text-sm font-semibold text-gray-200">Feedback</span>
                    </div>
                    <p className="text-gray-300 text-sm">{feedback}</p>
                  </motion.div>
                )}
              </AnimatePresence>
              <div className="border border-gray-700/50 rounded-lg p-4 bg-gray-800/50 backdrop-blur-sm">
                <div className="flex items-center gap-2 mb-3">
                  <MdFlashOn className="w-4 h-4 text-blue-400" />
                  <h4 className="text-sm font-semibold text-gray-200">Quick Reference</h4>
                </div>
                <div className="space-y-2 text-xs text-gray-400">
                  <div className="flex items-start gap-2">
                    <MdArrowForward className="w-3 h-3 text-blue-400 mt-0.5 flex-shrink-0" />
                    <span>Use ↑/↓ arrows for command history</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <MdArrowForward className="w-3 h-3 text-blue-400 mt-0.5 flex-shrink-0" />
                    <span>Type <code className="bg-black/50 px-1 rounded text-blue-400">help</code> for available commands</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <MdArrowForward className="w-3 h-3 text-blue-400 mt-0.5 flex-shrink-0" />
                    <span>Use <code className="bg-black/50 px-1 rounded text-blue-400">clear</code> to reset terminal</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <MdArrowForward className="w-3 h-3 text-blue-400 mt-0.5 flex-shrink-0" />
                    <span>Complete all commands to finish lesson</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <MdArrowForward className="w-3 h-3 text-blue-400 mt-0.5 flex-shrink-0" />
                    <span>Use <code className="bg-black/50 px-1 rounded text-blue-400">cd</code> to navigate between directories</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
const App: React.FC = () => {
  const [showApp, setShowApp] = useState(false);
  useEffect(() => {
    const hasVisited = localStorage.getItem('terminal-lab-visited');
    if (hasVisited) {
      setShowApp(true);
    }
  }, []);
  const handleEnterApp = () => {
    localStorage.setItem('terminal-lab-visited', 'true');
    setShowApp(true);
  };
  const handleBackToLanding = () => {
    setShowApp(false);
  };
  return (
    <AnimatePresence mode="wait">
      {showApp ? (
        <motion.div
          key="app"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <TerminalEmulator onBackToLanding={handleBackToLanding} />
        </motion.div>
      ) : (
        <motion.div
          key="landing"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <LandingPage onEnterApp={handleEnterApp} />
        </motion.div>
      )}
    </AnimatePresence>
  );
};
export default App;
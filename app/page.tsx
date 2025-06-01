"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { FaDownload, FaCodeBranch, FaHistory } from "react-icons/fa"

interface Player {
  id: string
  name: string
  color: string
  avatar: string
  isOnline: boolean
  contributionCount: number
}

interface PlotTwist {
  id: string
  suggestion: string
  votes: string[]
  submittedBy: string
  isApplied?: boolean
}

interface StorySegment {
  id: string
  content: string
  author: Player
  timestamp: Date
  reactions: { [emoji: string]: string[] }
  gifReactions: { [gifUrl: string]: string[] }
  votes: { up: string[]; down: string[] }
  isPlotTwist?: boolean
  branchPoint?: boolean
  x?: number
  y?: number
  formatting?: {
    bold?: boolean
    italic?: boolean
    underline?: boolean
  }
}

interface StoryBranch {
  id: string
  title: string
  segments: StorySegment[]
  parentBranchId?: string
  isActive: boolean
  createdBy: string
  createdAt: Date
  color: string
  x?: number
  y?: number
}

const REACTION_ICONS = ["♥", "😂", "😮", "😍", "🤯", "👏", "🔥", "✨", "🎉", "😢"]

const REACTION_GIFS = [
  {
    name: "love",
    url: "https://media.giphy.com/media/3o7abKhOpu0NwenH3O/giphy.gif",
    icon: "❤️",
  },
  {
    name: "laugh",
    url: "https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif",
    icon: "😂",
  },
  {
    name: "wow",
    url: "https://media.giphy.com/media/3o7abAHdYvZdBNnGZq/giphy.gif",
    icon: "😮",
  },
  {
    name: "fire",
    url: "https://media.giphy.com/media/3o7absbD7PbTFQa0c8/giphy.gif",
    icon: "🔥",
  },
  {
    name: "clap",
    url: "https://media.giphy.com/media/7rj2ZgttvgomY/giphy.gif",
    icon: "👏",
  },
  {
    name: "mind-blown",
    url: "https://media.giphy.com/media/xT0xeJpnrWC4XWblEk/giphy.gif",
    icon: "🤯",
  },
]

const PLOT_TWIST_SUGGESTIONS = [
  
  "Everything was just a dream... or was it?",
 
  "A magical portal opens to another world",
  "Time starts moving backwards",
  "The animals start talking",
  "A hidden treasure is discovered",
 
  "A long-lost relative appears",
]

export default function CollaborativeStorytellingGame() {
  const [players, setPlayers] = useState<Player[]>([
    { id: "1", name: "Luna", color: "#CA7842", avatar: "🦄", isOnline: true, contributionCount: 0 },
    { id: "2", name: "Max", color: "#B2CD9C", avatar: "🐉", isOnline: true, contributionCount: 0 },
    { id: "3", name: "Zoe", color: "#F0F2BD", avatar: "🦋", isOnline: false, contributionCount: 0 },
    { id: "4", name: "Alex", color: "#4B352A", avatar: "⭐", isOnline: true, contributionCount: 0 },
  ])

  const [currentPlayerId, setCurrentPlayerId] = useState("1")
  const [branches, setBranches] = useState<StoryBranch[]>([
    {
      id: "main",
      title: "The Great Adventure",
      isActive: true,
      createdBy: "system",
      createdAt: new Date(),
      color: "#4B352A",
      x: 50,
      y: 20,
      segments: [
        {
          id: "intro",
          content:
            "Once upon a time, in a magical kingdom where rainbow bridges connected floating islands in the sky, there lived a brave young adventurer who was about to discover the most amazing secret of their life...",
          author: {
            id: "system",
            name: "Story Narrator",
            color: "#4B352A",
            avatar: "📚",
            isOnline: true,
            contributionCount: 0,
          },
          timestamp: new Date(),
          reactions: {},
          gifReactions: {},
          votes: { up: [], down: [] },
          x: 50,
          y: 20,
        },
      ],
    },
  ])

  const [activeBranchId, setActiveBranchId] = useState("main")
  const [currentSegment, setCurrentSegment] = useState("")
  const [isWriting, setIsWriting] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [showBranchView, setShowBranchView] = useState(false)
  const [showReactions, setShowReactions] = useState<string | null>(null)
  const [showGifReactions, setShowGifReactions] = useState<string | null>(null)
  const [animatingSegment, setAnimatingSegment] = useState<string | null>(null)
  const [wordCount, setWordCount] = useState(0)
  const [characterCount, setCharacterCount] = useState(0)
  const [showPlotTwistVoting, setShowPlotTwistVoting] = useState(false)
  const [plotTwists, setPlotTwists] = useState<PlotTwist[]>([])
  const [selectedSegmentId, setSelectedSegmentId] = useState<string | null>(null)

  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const storyContainerRef = useRef<HTMLDivElement>(null)

  const currentPlayer = players.find((p) => p.id === currentPlayerId) || players[0]
  const activeBranch = branches.find((b) => b.id === activeBranchId) || branches[0]
  const onlinePlayers = players.filter((p) => p.isOnline)

  // Autoresize textarea 
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + "px"
    }
  }, [currentSegment])

  // Update word and character count
  useEffect(() => {
    setWordCount(
      currentSegment
        .trim()
        .split(/\s+/)
        .filter((word) => word.length > 0).length,
    )
    setCharacterCount(currentSegment.length)
  }, [currentSegment])

  // Autoscroll to latest segment 
  const scrollToBottom = useCallback(() => {
    if (storyContainerRef.current) {
      storyContainerRef.current.scrollTo({
        top: storyContainerRef.current.scrollHeight,
        behavior: "smooth",
      })
    }
  }, [])

  // Calculate position for new segment in branching visualization
  const calculateSegmentPosition = (branchId: string, segmentIndex: number) => {
    const branch = branches.find((b) => b.id === branchId)
    if (!branch) return { x: 50, y: 50 }

    // Create a more structured layout
    const baseX = 50
    const baseY = 20 + segmentIndex * 15

    // Add slight horizontal variation but keep it controlled
    const offsetX = Math.sin(segmentIndex * 0.5) * 20

    return {
      x: Math.max(15, Math.min(85, baseX + offsetX)),
      y: Math.max(15, Math.min(85, baseY)),
    }
  }

  const addSegment = () => {
    if (!currentSegment.trim()) return

    const segmentIndex = activeBranch.segments.length
    const position = calculateSegmentPosition(activeBranchId, segmentIndex)

    const newSegment: StorySegment = {
      id: `segment_${Date.now()}`,
      content: currentSegment.trim(),
      author: currentPlayer,
      timestamp: new Date(),
      reactions: {},
      gifReactions: {},
      votes: { up: [], down: [] },
      branchPoint: true,
      x: position.x,
      y: position.y,
    }

    setAnimatingSegment(newSegment.id)

    setBranches((prev) =>
      prev.map((branch) =>
        branch.id === activeBranchId ? { ...branch, segments: [...branch.segments, newSegment] } : branch,
      ),
    )

    // Update player contribution count
    setPlayers((prev) =>
      prev.map((player) =>
        player.id === currentPlayerId ? { ...player, contributionCount: player.contributionCount + 1 } : player,
      ),
    )

    setCurrentSegment("")
    setIsWriting(false)

    // Switch to next online player
    const onlinePlayerIds = players.filter((p) => p.isOnline).map((p) => p.id)
    const currentIndex = onlinePlayerIds.indexOf(currentPlayerId)
    const nextPlayerId = onlinePlayerIds[(currentIndex + 1) % onlinePlayerIds.length]
    setCurrentPlayerId(nextPlayerId)

    // Scroll to new segment after animation
    setTimeout(() => {
      setAnimatingSegment(null)
      scrollToBottom()
    }, 600)
  }

  const addPlotTwist = (suggestion: string) => {
    const existingTwist = plotTwists.find((pt) => pt.suggestion === suggestion)
    if (existingTwist) {
      setPlotTwists((prev) =>
        prev.map((pt) =>
          pt.id === existingTwist.id
            ? {
                ...pt,
                votes: pt.votes.includes(currentPlayerId)
                  ? pt.votes.filter((id) => id !== currentPlayerId)
                  : [...pt.votes, currentPlayerId],
              }
            : pt,
        ),
      )
    } else {
      const newTwist: PlotTwist = {
        id: `twist_${Date.now()}`,
        suggestion,
        votes: [currentPlayerId],
        submittedBy: currentPlayerId,
      }
      setPlotTwists((prev) => [...prev, newTwist])
    }
  }

  const applyPlotTwist = () => {
    const topTwist = plotTwists.sort((a, b) => b.votes.length - a.votes.length)[0]
    if (topTwist && topTwist.votes.length >= Math.ceil(onlinePlayers.length / 2)) {
      setCurrentSegment(topTwist.suggestion + " ")
      setPlotTwists((prev) => prev.map((pt) => (pt.id === topTwist.id ? { ...pt, isApplied: true } : pt)))
      setShowPlotTwistVoting(false)
      textareaRef.current?.focus()
    }
  }

  const addReaction = (segmentId: string, emoji: string) => {
    setBranches((prev) =>
      prev.map((branch) => ({
        ...branch,
        segments: branch.segments.map((segment) => {
          if (segment.id === segmentId) {
            const reactions = { ...segment.reactions }
            if (!reactions[emoji]) reactions[emoji] = []

            const playerIndex = reactions[emoji].indexOf(currentPlayerId)
            if (playerIndex > -1) {
              reactions[emoji] = reactions[emoji].filter((id) => id !== currentPlayerId)
              if (reactions[emoji].length === 0) delete reactions[emoji]
            } else {
              reactions[emoji] = [...reactions[emoji], currentPlayerId]
            }

            return { ...segment, reactions }
          }
          return segment
        }),
      })),
    )
  }

  const addGifReaction = (segmentId: string, gifUrl: string) => {
    setBranches((prev) =>
      prev.map((branch) => ({
        ...branch,
        segments: branch.segments.map((segment) => {
          if (segment.id === segmentId) {
            const gifReactions = { ...segment.gifReactions }
            if (!gifReactions[gifUrl]) gifReactions[gifUrl] = []

            const playerIndex = gifReactions[gifUrl].indexOf(currentPlayerId)
            if (playerIndex > -1) {
              gifReactions[gifUrl] = gifReactions[gifUrl].filter((id) => id !== currentPlayerId)
              if (gifReactions[gifUrl].length === 0) delete gifReactions[gifUrl]
            } else {
              gifReactions[gifUrl] = [...gifReactions[gifUrl], currentPlayerId]
            }

            return { ...segment, gifReactions }
          }
          return segment
        }),
      })),
    )
  }

  const voteOnSegment = (segmentId: string, voteType: "up" | "down") => {
    setBranches((prev) =>
      prev.map((branch) => ({
        ...branch,
        segments: branch.segments.map((segment) => {
          if (segment.id === segmentId) {
            const votes = { ...segment.votes }
            const oppositeType = voteType === "up" ? "down" : "up"

            // Remove from opposite vote if exists
            votes[oppositeType] = votes[oppositeType].filter((id) => id !== currentPlayerId)

            // Toggle current vote
            if (votes[voteType].includes(currentPlayerId)) {
              votes[voteType] = votes[voteType].filter((id) => id !== currentPlayerId)
            } else {
              votes[voteType] = [...votes[voteType], currentPlayerId]
            }

            return { ...segment, votes }
          }
          return segment
        }),
      })),
    )
  }

  const switchBranch = (branchId: string) => {
    setActiveBranchId(branchId)
    setShowBranchView(false)
    setTimeout(scrollToBottom, 100)
  }

  const applyFormatting = (format: "bold" | "italic" | "underline") => {
    if (!textareaRef.current) return

    const textarea = textareaRef.current
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = currentSegment.substring(start, end)

    if (selectedText) {
      let formattedText = selectedText
      let prefix = ""
      let suffix = ""

      switch (format) {
        case "bold":
          prefix = "**"
          suffix = "**"
          break
        case "italic":
          prefix = "*"
          suffix = "*"
          break
        case "underline":
          prefix = "__"
          suffix = "__"
          break
      }

      formattedText = prefix + selectedText + suffix
      const newText = currentSegment.substring(0, start) + formattedText + currentSegment.substring(end)
      setCurrentSegment(newText)

      // Restore focus and cursor position
      setTimeout(() => {
        textarea.focus()
        const newCursorPos = start + formattedText.length
        textarea.setSelectionRange(newCursorPos, newCursorPos)
      }, 0)
    }
  }

  const renderFormattedText = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, "<em>$1</em>")
      .replace(/__(.*?)__/g, "<u>$1</u>")
  }

  const exportStory = () => {
    const storyContent = [
      `${activeBranch.title}`,
      `Created: ${activeBranch.createdAt.toLocaleDateString()}`,
      `Total Segments: ${activeBranch.segments.length}`,
      "",
      ...activeBranch.segments.map(
        (segment, index) =>
          `${index + 1}. ${segment.author.name} (${segment.timestamp.toLocaleString()}):\n${segment.content}\n`,
      ),
    ].join("\n")

    const blob = new Blob([storyContent], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${activeBranch.title.replace(/[^a-zA-Z0-9]/g, "_")}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const togglePlayerOnline = (playerId: string) => {
    setPlayers((prev) =>
      prev.map((player) => (player.id === playerId ? { ...player, isOnline: !player.isOnline } : player)),
    )
  }

  // Get all segments from all branches for visualization
  const getAllSegments = () => {
    return branches.flatMap((branch) =>
      branch.segments.filter((segment) => segment.branchPoint && segment.x && segment.y),
    )
  }

  //
  const findSegmentById = (segmentId: string) => {
    for (const branch of branches) {
      const segment = branch.segments.find((s) => s.id === segmentId)
      if (segment) {
        return { segment, branch }
      }
    }
    return null
  }

  // Handle node click in visualization
  const handleNodeClick = (segmentId: string) => {
    setSelectedSegmentId(segmentId === selectedSegmentId ? null : segmentId)
  }

  // Get high contrast color for better readability
  const getHighContrastColor = (originalColor: string) => {
    switch (originalColor) {
      case "#CA7842": return "#8B4513" // Darker brown for Luna
      case "#B2CD9C": return "#2E7D32" // Darker green for Max  
      case "#F0F2BD": return "#F57F17" // Dark yellow for Zoe
      case "#4B352A": return "#3E2723" // Darker brown for Alex
      default: return "#4B352A" // Default dark color
    }
  }

  return (
    <div className="h-screen bg-gradient-to-br from-amber-50 via-green-50 to-yellow-50 overflow-hidden">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@300;400;500;600;700&display=swap');
        
        .quicksand-regular {
          font-family: "Quicksand", sans-serif;
          font-optical-sizing: auto;
          font-weight: 400;
          font-style: normal;
        }
        
        .quicksand-medium {
          font-family: "Quicksand", sans-serif;
          font-optical-sizing: auto;
          font-weight: 500;
          font-style: normal;
        }
        
        .quicksand-bold {
          font-family: "Quicksand", sans-serif;
          font-optical-sizing: auto;
          font-weight: 700;
          font-style: normal;
        }
        
        * {
          font-family: "Quicksand", sans-serif;
        }
        
        body {
          margin: 0;
          padding: 0;
          overflow: hidden;
        }
        
        .glass-card {
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(75, 53, 42, 0.1);
          box-shadow: 0 8px 32px 0 rgba(75, 53, 42, 0.1);
          border-radius: 20px;
        }
        
        .segment-enter {
          animation: slideInUp 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        @keyframes slideInUp {
          from {
            transform: translateY(40px) scale(0.95);
            opacity: 0;
          }
          to {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
        }
        
        .bounce-in {
          animation: bounceIn 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }
        
        @keyframes bounceIn {
          0% { transform: scale(0.3) rotate(-10deg); opacity: 0; }
          50% { transform: scale(1.05) rotate(2deg); }
          70% { transform: scale(0.9) rotate(-1deg); }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        
        .writing-indicator {
          animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.1); }
        }
        
        .hover-scale {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .hover-scale:hover {
          transform: scale(1.05) translateY(-2px);
        }
        
        .btn-primary {
          background: linear-gradient(135deg, #CA7842 0%, #B2CD9C 100%);
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 4px 15px rgba(202, 120, 66, 0.3);
        }
        
        .btn-primary:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 25px rgba(202, 120, 66, 0.4);
        }
        
        .btn-secondary {
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(75, 53, 42, 0.2);
          padding: 8px 16px;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          color: #4B352A;
          font-weight: 500;
        }
        
        .btn-secondary:hover {
          background: rgba(255, 255, 255, 0.95);
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(75, 53, 42, 0.1);
        }
        
        .btn-twist {
          background: linear-gradient(135deg, #F0F2BD 0%, #CA7842 100%);
          color: #4B352A;
          border: none;
          padding: 12px 24px;
          border-radius: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 4px 15px rgba(240, 242, 189, 0.3);
        }
        
        .btn-twist:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 25px rgba(240, 242, 189, 0.4);
        }
        
        .branch-node {
          cursor: pointer;
          transition: filter 0.3s ease;
        }
        
        .branch-node:hover {
          filter: brightness(1.2) drop-shadow(0 0 5px rgba(0,0,0,0.3));
        }
        
        .branch-connection {
          stroke-dasharray: 5,5;
          animation: dash 20s linear infinite;
        }
        
        @keyframes dash {
          to {
            stroke-dashoffset: -100;
          }
        }
        
        .fade-in {
          animation: fadeIn 0.5s ease-out;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        .slide-in-right {
          animation: slideInRight 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        .slide-in-left {
          animation: slideInLeft 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        @keyframes slideInLeft {
          from {
            transform: translateX(-100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        .gif-reaction {
          width: 40px;
          height: 40px;
          border-radius: 8px;
          object-fit: cover;
        }
        
        .node-selected {
          stroke: #F0F2BD;
          stroke-width: 3px;
        }
        
        .segment-preview {
          animation: fadeIn 0.3s ease-out;
        }
        
        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
        }
        
        ::-webkit-scrollbar-track {
          background: rgba(240, 242, 189, 0.3);
          border-radius: 10px;
        }
        
        ::-webkit-scrollbar-thumb {
          background: #ca7842;
          border-radius: 10px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: #b2cd9c;
        }
        
        /* Hidden scrollbar for sidebar */
        .sidebar-scrollable {
          scrollbar-width: none; /* Firefox */
          -ms-overflow-style: none; /* Internet Explorer 10+ */
        }
        
        .sidebar-scrollable::-webkit-scrollbar {
          display: none; /* WebKit */
        }
      `}</style>

      {/* Fixed Height Container */}
      <div className="h-full flex flex-col p-4 gap-4">
        {/* Header - Fixed Height */}
        <div className="glass-card p-4 flex-shrink-0">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="text-4xl">📖</div>
              <div>
                <h1 className="text-3xl quicksand-bold" style={{ color: "#4B352A" }}>
                  Story Weavers
                </h1>
                <p className="quicksand-medium" style={{ color: "#CA7842" }}>
                  Collaborative Branching Adventures
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="glass-card p-3 flex items-center gap-2">
                <span className="text-xl">👥</span>
                <span className="quicksand-bold" style={{ color: "#4B352A" }}>
                  {onlinePlayers.length} online
                </span>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setShowHistory(!showHistory)}
                  className="btn-secondary hover-scale flex items-center gap-2"
                  title="Story History"
                >
                  <FaHistory className="text-lg" />
                </button>
                <button
                  onClick={() => setShowBranchView(!showBranchView)}
                  className="btn-secondary hover-scale flex items-center gap-2"
                  title="Story Branches"
                >
                  <FaCodeBranch className="text-lg" />
                </button>
                <button
                  onClick={exportStory}
                  className="btn-secondary hover-scale flex items-center gap-2"
                  title="Export Story"
                >
                  <FaDownload className="text-lg" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content*/}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-4 min-h-0">
          {/* Left Sidebar - Fixed Width, Scrollable Content */}
          <div className="lg:col-span-1 flex flex-col gap-4 min-h-0 overflow-y-auto sidebar-scrollable pr-2">
            {/* Current Turn */}
            <div className="glass-card p-4 flex-shrink-0">
              <h3 className="text-lg quicksand-bold mb-3 flex items-center gap-2" style={{ color: "#4B352A" }}>
                <span className="text-xl">⭐</span> Current Turn
              </h3>
              <div
                className="p-3 rounded-2xl border-2 border-dashed"
                style={{
                  backgroundColor: currentPlayer.color + "20",
                  borderColor: currentPlayer.color + "60",
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{currentPlayer.avatar}</div>
                  <div>
                    <div className="quicksand-bold" style={{ color: getHighContrastColor(currentPlayer.color) }}>
                      {currentPlayer.name}
                    </div>
                    <div className="text-sm quicksand-medium" style={{ color: "#4B352A" }}>
                      {currentPlayer.id === currentPlayerId ? "Your turn!" : "Writing..."}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Player */} 
            <div className="glass-card p-4">
              <h3 className="text-xl quicksand-bold mb-4 flex items-center gap-2" style={{ color: "#4B352A" }}>
                <span className="text-2xl">👥</span> Story Heroes
              </h3>
              <div className="space-y-3">
                {players.map((player) => (
                  <div
                    key={player.id}
                    className={`flex items-center gap-3 p-3 rounded-2xl transition-all duration-300 cursor-pointer hover-scale ${
                      player.id === currentPlayerId ? "ring-2 ring-yellow-200" : ""
                    }`}
                    style={{
                      backgroundColor: player.color + "15",
                    }}
                    onClick={() => togglePlayerOnline(player.id)}
                  >
                    <div className="text-2xl">{player.avatar}</div>
                    <div className="flex-1">
                      <div className="quicksand-bold" style={{ color: getHighContrastColor(player.color) }}>
                        {player.name}
                      </div>
                      <div className="text-xs quicksand-medium" style={{ color: "#4B352A" }}>
                        {player.contributionCount} contributions
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${player.isOnline ? "bg-green-400" : "bg-gray-300"}`} />
                      {player.id === currentPlayerId && <span className="writing-indicator text-xl">✏️</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Plot Twist Voting */}
            <div className="glass-card p-4 flex-shrink-0">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg quicksand-bold flex items-center gap-2" style={{ color: "#4B352A" }}>
                  <span className="text-xl">⚡</span> Plot Twists
                </h3>
                <button
                  onClick={() => setShowPlotTwistVoting(!showPlotTwistVoting)}
                  className="btn-twist hover-scale text-sm px-3 py-2"
                >
                  Vote
                </button>
              </div>

              {plotTwists.length > 0 && (
                <div className="space-y-2 mb-3 overflow-x-hidden">
                  {plotTwists
                    .filter((twist) => !twist.isApplied)
                    .sort((a, b) => b.votes.length - a.votes.length)
                    .map((twist) => (
                      <div key={twist.id} className="p-2 rounded-xl" style={{ backgroundColor: "#F0F2BD" + "40" }}>
                        <div className="flex justify-between items-center">
                          <span className="text-xs quicksand-medium truncate max-w-[80%]" style={{ color: "#4B352A" }}>
                            {twist.suggestion.substring(0, 25)}...
                          </span>
                          <span
                            className="text-xs quicksand-bold px-2 py-1 rounded-full flex-shrink-0"
                            style={{
                              backgroundColor: "#CA7842",
                              color: "white",
                            }}
                          >
                            {twist.votes.length}
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              )}

              {plotTwists.some((twist) => twist.votes.length >= Math.ceil(onlinePlayers.length / 2)) && (
                <button onClick={applyPlotTwist} className="btn-primary w-full hover-scale text-sm py-2">
                  Apply Top Twist
                </button>
              )}
            </div>
          </div>

          {/* Main Story Area */}
          <div className="lg:col-span-3 flex flex-col gap-4 min-h-0">
            {/* Branch Selector */}
            <div className="glass-card p-4 flex-shrink-0">
              <div className="flex items-center justify-betweenx">
                <h3 className="text-lg quicksand-bold flex items-center gap-2" style={{ color: "#4B352A" }}>
                  <FaCodeBranch className="text-lg" /> {activeBranch.title}
                </h3>
              </div>

              {branches.length > 1 && (
                <div className="flex gap-2 flex-wrap">
                  {branches.map((branch) => (
                    <button
                      key={branch.id}
                      onClick={() => switchBranch(branch.id)}
                      className={`px-3 py-1 rounded-full text-sm quicksand-bold transition-all duration-300 hover-scale ${
                        branch.id === activeBranchId ? "text-white" : "hover:bg-white/90"
                      }`}
                      style={{
                        backgroundColor: branch.id === activeBranchId ? "#4B352A" : "rgba(255,255,255,0.7)",
                        color: branch.id === activeBranchId ? "white" : "#4B352A",
                      }}
                    >
                      {branch.title} ({branch.segments.length})
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Story Display*/}
            <div className="glass-card p-4 flex-1 min-h-0 flex flex-col">
              <div
                ref={storyContainerRef}
                className="flex-1 overflow-y-auto space-y-4 pr-2"
                style={{ scrollbarWidth: "thin", scrollbarColor: "#CA7842 transparent" }}
              >
                {activeBranch.segments.map((segment, index) => (
                  <div key={segment.id} className={`${animatingSegment === segment.id ? "segment-enter" : ""}`}>
                    <div className="flex items-start gap-3">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-lg quicksand-bold text-white shadow-lg flex-shrink-0"
                        style={{ backgroundColor: segment.author.color }}
                      >
                        {segment.author.avatar}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="quicksand-bold" style={{ color: getHighContrastColor(segment.author.color) }}>
                            {segment.author.name}
                          </span>
                          <span
                            className="text-xs quicksand-medium px-2 py-1 rounded-full"
                            style={{
                              backgroundColor: "rgba(255,255,255,0.7)",
                              color: "#4B352A",
                            }}
                          >
                            {segment.timestamp.toLocaleTimeString()}
                          </span>
                          {segment.isPlotTwist && (
                            <span
                              className="text-xs px-2 py-1 rounded-full quicksand-bold"
                              style={{
                                backgroundColor: "#F0F2BD",
                                color: "#4B352A",
                              }}
                            >
                              ⚡ Plot Twist
                            </span>
                          )}
                        </div>

                        <div className="glass-card p-3 mb-2">
                          <p
                            className="quicksand-regular leading-relaxed"
                            style={{ color: "#4B352A" }}
                            dangerouslySetInnerHTML={{ __html: renderFormattedText(segment.content) }}
                          />
                        </div>

                        {/* Reactions and Actions */}
                        <div className="flex items-center gap-2 flex-wrap">
                          {/* Existing Text Reactions */}
                          <div className="flex gap-1">
                            {Object.entries(segment.reactions).map(([emoji, userIds]) => (
                              <button
                                key={emoji}
                                onClick={() => addReaction(segment.id, emoji)}
                                className={`px-2 py-1 rounded-full text-sm transition-all duration-300 hover-scale ${
                                  userIds.includes(currentPlayerId) ? "ring-2" : ""
                                }`}
                                style={{
                                  backgroundColor: userIds.includes(currentPlayerId)
                                    ? "#F0F2BD"
                                    : "rgba(255,255,255,0.7)",
                                }}
                              >
                                {emoji} {userIds.length}
                              </button>
                            ))}
                          </div>

                          {/* GIF Reactions */}
                          <div className="flex gap-1">
                            {Object.entries(segment.gifReactions).map(([gifUrl, userIds]) => {
                              const gif = REACTION_GIFS.find((g) => g.url === gifUrl)
                              return (
                                <button
                                  key={gifUrl}
                                  onClick={() => addGifReaction(segment.id, gifUrl)}
                                  className={`p-1 rounded-lg transition-all duration-300 hover-scale ${
                                    userIds.includes(currentPlayerId) ? "ring-2" : ""
                                  }`}
                                  style={{
                                    backgroundColor: userIds.includes(currentPlayerId)
                                      ? "#F0F2BD"
                                      : "rgba(255,255,255,0.7)",
                                  }}
                                >
                                  <img
                                    src={gifUrl || "/placeholder.svg"}
                                    alt={gif?.name || "reaction"}
                                    className="w-6 h-6 rounded object-cover"
                                  />
                                  <span className="text-xs">{userIds.length}</span>
                                </button>
                              )
                            })}
                          </div>

                          {/* Add Reaction Buttons */}
                          <button
                            onClick={() => setShowReactions(showReactions === segment.id ? null : segment.id)}
                            className="btn-secondary hover-scale text-sm px-2 py-1"
                            title="Add Text Reaction"
                          >
                            😊
                          </button>

                          <button
                            onClick={() => setShowGifReactions(showGifReactions === segment.id ? null : segment.id)}
                            className="btn-secondary hover-scale text-sm px-2 py-1"
                            title="Add GIF Reaction"
                          >
                            GIF
                          </button>

                          {/* Voting */}
                          <div className="flex gap-1">
                            <button
                              onClick={() => voteOnSegment(segment.id, "up")}
                              className={`px-2 py-1 rounded-full transition-all duration-300 hover-scale text-sm ${
                                segment.votes.up.includes(currentPlayerId) ? "ring-2" : ""
                              }`}
                              style={{
                                backgroundColor: segment.votes.up.includes(currentPlayerId)
                                  ? "#B2CD9C"
                                  : "rgba(255,255,255,0.7)",
                              }}
                            >
                              👍 {segment.votes.up.length}
                            </button>
                            <button
                              onClick={() => voteOnSegment(segment.id, "down")}
                              className={`px-2 py-1 rounded-full transition-all duration-300 hover-scale text-sm ${
                                segment.votes.down.includes(currentPlayerId) ? "ring-2" : ""
                              }`}
                              style={{
                                backgroundColor: segment.votes.down.includes(currentPlayerId)
                                  ? "#CA7842" + "40"
                                  : "rgba(255,255,255,0.7)",
                              }}
                            >
                              👎 {segment.votes.down.length}
                            </button>
                          </div>
                        </div>

                        {/* Text Reaction Picker */}
                        {showReactions === segment.id && (
                          <div className="mt-2 glass-card p-2 bounce-in">
                            <div className="grid grid-cols-5 gap-1">
                              {REACTION_ICONS.map((emoji) => (
                                <button
                                  key={emoji}
                                  onClick={() => {
                                    addReaction(segment.id, emoji)
                                    setShowReactions(null)
                                  }}
                                  className="text-lg p-1 rounded-xl hover:bg-white/50 transition-all duration-300 hover-scale"
                                >
                                  {emoji}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* GIF Reaction Picker */}
                        {showGifReactions === segment.id && (
                          <div className="mt-2 glass-card p-2 bounce-in">
                            <div className="grid grid-cols-3 gap-1">
                              {REACTION_GIFS.map((gif) => (
                                <button
                                  key={gif.url}
                                  onClick={() => {
                                    addGifReaction(segment.id, gif.url)
                                    setShowGifReactions(null)
                                  }}
                                  className="p-1 rounded-xl hover:bg-white/50 transition-all duration-300 hover-scale"
                                >
                                  <img
                                    src={gif.url || "/placeholder.svg"}
                                    alt={gif.name}
                                    className="w-8 h-8 rounded mx-auto object-cover"
                                  />
                                  <div className="text-xs mt-1 text-center" style={{ color: "#4B352A" }}>
                                    {gif.icon}
                                  </div>
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Writing Interface */}
            <div className="glass-card p-4 flex-shrink-0">
              <h3 className="text-lg quicksand-bold mb-3 flex items-center gap-2" style={{ color: "#4B352A" }}>
                <span className="text-xl">✏️</span> Continue the Adventure
              </h3>

              {/* Formatting Toolbar */}
              <div
                className="flex items-center gap-2 mb-3 p-2 rounded-2xl"
                style={{ backgroundColor: "rgba(255,255,255,0.5)" }}
              >
                <button
                  onClick={() => applyFormatting("bold")}
                  className="btn-secondary hover-scale quicksand-bold text-sm px-2 py-1"
                  title="Bold"
                >
                  B
                </button>
                <button
                  onClick={() => applyFormatting("italic")}
                  className="btn-secondary hover-scale italic text-sm px-2 py-1"
                  title="Italic"
                >
                  I
                </button>
                <button
                  onClick={() => applyFormatting("underline")}
                  className="btn-secondary hover-scale underline text-sm px-2 py-1"
                  title="Underline"
                >
                  U
                </button>
                <div className="w-px h-4 bg-gray-300 mx-2" />
                <span className="text-xs quicksand-medium" style={{ color: "#4B352A" }}>
                  Select text and click formatting buttons
                </span>
              </div>

              <div className="space-y-3">
                <textarea
                  ref={textareaRef}
                  value={currentSegment}
                  onChange={(e) => setCurrentSegment(e.target.value)}
                  onFocus={() => setIsWriting(true)}
                  onBlur={() => setIsWriting(false)}
                  placeholder={`${currentPlayer.name}, what magical adventure happens next? ✨`}
                  className="w-full p-3 rounded-2xl border-2 focus:outline-none resize-none min-h-16 backdrop-blur-sm quicksand-regular"
                  style={{
                    borderColor: "#CA7842" + "40",
                    backgroundColor: "rgba(255,255,255,0.7)",
                    color: "#4B352A",
                  }}
                  maxLength={1000}
                />

                <div className="flex justify-between items-center">
                  <div className="flex gap-4 text-sm quicksand-medium" style={{ color: "#4B352A" }}>
                    <span>Words: {wordCount}</span>
                    <span>Characters: {characterCount}/1000</span>
                  </div>

                  <button
                    onClick={addSegment}
                    disabled={!currentSegment.trim() || currentSegment.length > 1000}
                    className="btn-primary hover-scale disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="text-lg mr-2">✨</span>
                    Add to Story
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Plot Twist Voting Modal */}
      {showPlotTwistVoting && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="glass-card p-6 max-w-4xl w-full max-h-[80vh] overflow-hidden bounce-in">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl quicksand-bold flex items-center gap-2" style={{ color: "#4B352A" }}>
                <span className="text-3xl">⚡</span> Vote for Plot Twists!
              </h3>
              <button onClick={() => setShowPlotTwistVoting(false)} className="btn-secondary hover-scale text-xl">
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
              {PLOT_TWIST_SUGGESTIONS.map((suggestion) => {
                const twist = plotTwists.find((pt) => pt.suggestion === suggestion)
                const voteCount = twist?.votes.length || 0
                const hasVoted = twist?.votes.includes(currentPlayerId) || false

                return (
                  <button
                    key={suggestion}
                    onClick={() => addPlotTwist(suggestion)}
                    className={`p-4 rounded-2xl text-left transition-all duration-300 border-2 hover-scale ${
                      hasVoted ? "ring-2" : ""
                    }`}
                    style={{
                      backgroundColor: hasVoted ? "#F0F2BD" + "60" : "rgba(255,255,255,0.7)",
                      borderColor: hasVoted ? "#CA7842" : "rgba(75, 53, 42, 0.2)",
                    }}
                  >
                    <div className="flex justify-between items-start">
                      <span className="quicksand-medium" style={{ color: "#4B352A" }}>
                        {suggestion}
                      </span>
                      <span
                        className="px-2 py-1 rounded-full text-xs quicksand-bold"
                        style={{
                          backgroundColor: hasVoted ? "#CA7842" : "#B2CD9C",
                          color: "white",
                        }}
                      >
                        {voteCount} votes
                      </span>
                    </div>
                  </button>
                )
              })}
            </div>

            <div className="text-center">
              <button
                onClick={applyPlotTwist}
                disabled={!plotTwists.some((twist) => twist.votes.length >= Math.ceil(onlinePlayers.length / 2))}
                className="btn-primary hover-scale disabled:opacity-50"
              >
                Use Top Voted Twist
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Branch Visualization Modal */}
      {showBranchView && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="glass-card p-6 max-w-6xl w-full max-h-[80vh] overflow-hidden bounce-in">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl quicksand-bold flex items-center gap-2" style={{ color: "#4B352A" }}>
                <FaCodeBranch className="text-3xl" /> Story Branches
              </h3>
              <button onClick={() => setShowBranchView(false)} className="btn-secondary hover-scale text-xl">
                ✕
              </button>
            </div>

            <div className="flex flex-col md:flex-row gap-4 h-96">
              <div
                className="relative w-full md:w-2/3 overflow-hidden rounded-2xl"
                style={{ backgroundColor: "#F0F2BD" + "20" }}
              >
                <svg className="w-full h-full">
                  {/* Draw connections between segments */}
                  {getAllSegments().map((segment, index) => {
                    if (index === 0) return null
                    const prevSegment = getAllSegments()[index - 1]
                    if (!prevSegment) return null

                    return (
                      <line
                        key={`connection-${segment.id}`}
                        x1={`${prevSegment.x}%`}
                        y1={`${prevSegment.y}%`}
                        x2={`${segment.x}%`}
                        y2={`${segment.y}%`}
                        stroke="#CA7842"
                        strokeWidth="2"
                        className="branch-connection"
                      />
                    )
                  })}

                  {/* Draw segment nodes */}
                  {getAllSegments().map((segment, index) => (
                    <g key={segment.id} onClick={() => handleNodeClick(segment.id)}>
                      <circle
                        cx={`${segment.x}%`}
                        cy={`${segment.y}%`}
                        r="18"
                        fill={segment.author.color}
                        className={`branch-node ${selectedSegmentId === segment.id ? "node-selected" : ""}`}
                        style={{
                          filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.2))",
                        }}
                      />
                      <text
                        x={`${segment.x}%`}
                        y={`${segment.y}%`}
                        textAnchor="middle"
                        dominantBaseline="central"
                        className="quicksand-bold text-xs fill-white pointer-events-none"
                      >
                        {index + 1}
                      </text>
                    </g>
                  ))}
                </svg>
              </div>

              {/* Segment preview panel */}
              <div className="w-full md:w-1/3 overflow-y-auto glass-card p-4">
                {selectedSegmentId ? (
                  (() => {
                    const result = findSegmentById(selectedSegmentId)
                    if (!result) return <p className="text-center text-gray-500">Select a node to view details</p>

                    const { segment, branch } = result
                    return (
                      <div className="segment-preview">
                        <div className="flex items-center gap-2 mb-3">
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center text-sm text-white"
                            style={{ backgroundColor: segment.author.color }}
                          >
                            {segment.author.avatar}
                          </div>
                          <div>
                            <div className="quicksand-bold" style={{ color: getHighContrastColor(segment.author.color) }}>
                              {segment.author.name}
                            </div>
                            <div className="text-xs" style={{ color: "#4B352A" }}>
                              {segment.timestamp.toLocaleString()}
                            </div>
                          </div>
                        </div>
                        <div className="glass-card p-3 mb-3">
                          <p
                            className="quicksand-regular text-sm"
                            style={{ color: "#4B352A" }}
                            dangerouslySetInnerHTML={{ __html: renderFormattedText(segment.content) }}
                          />
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm quicksand-medium" style={{ color: "#4B352A" }}>
                            Branch: {branch.title}
                          </span>
                          {branch.id !== activeBranchId && (
                            <button
                              onClick={() => {
                                switchBranch(branch.id)
                                setShowBranchView(false)
                              }}
                              className="btn-secondary text-sm"
                            >
                              Switch to Branch
                            </button>
                          )}
                        </div>
                      </div>
                    )
                  })()
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <p className="text-center text-gray-500">Click on a node to view story segment</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* History Modal */}
      {showHistory && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="glass-card p-6 max-w-4xl w-full max-h-[80vh] overflow-hidden bounce-in">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl quicksand-bold flex items-center gap-2" style={{ color: "#4B352A" }}>
                <FaHistory className="text-3xl" /> Story History
              </h3>
              <button onClick={() => setShowHistory(false)} className="btn-secondary hover-scale text-xl">
                ✕
              </button>
            </div>

            <div className="overflow-y-auto max-h-96 space-y-4">
              {activeBranch.segments.map((segment, index) => (
                <div key={segment.id} className="glass-card p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <span
                      className="px-3 py-1 rounded-full text-sm quicksand-bold"
                      style={{
                        backgroundColor: "#B2CD9C",
                        color: "white",
                      }}
                    >
                      #{index + 1}
                    </span>
                    <span className="quicksand-bold" style={{ color: getHighContrastColor(segment.author.color) }}>
                      {segment.author.name}
                    </span>
                    <span className="text-xs quicksand-medium" style={{ color: "#4B352A" }}>
                      {segment.timestamp.toLocaleString()}
                    </span>
                  </div>
                  <p className="quicksand-regular leading-relaxed" style={{ color: "#4B352A" }}>
                    {segment.content}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
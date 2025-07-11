'use client'
import React, { useState, useRef, useEffect } from "react";
import { PiPushPinFill, PiPushPinSlashFill } from "react-icons/pi";

interface User {
  id: string;
  name: string;
  avatar: string;
  role: string;
}

interface Comment {
  id: string;
  content: string;
  author: User;
  status: "open" | "resolved" | "pending";
  timestamp: Date;
  position: { x: number; y: number };
  sectionId: string;
  mentions: string[];
  isPinned: boolean;
  anchoredToPointIndex?: number; // Index of the document point this comment is anchored to
  endPointIndex?: number; // For multi-line comments, the end point index
}

interface DocumentSection {
  id: string;
  title: string;
  content: string[];
  version: number;
  hasChanges: boolean;
}

interface Document {
  id: string;
  title: string;
  sections: DocumentSection[];
  lastModified: Date;
  author: string;
  status: "draft" | "review" | "approved";
}

interface VersionChange {
  id: string;
  type: "added" | "removed" | "modified";
  content: string;
  sectionId: string;
  oldContent?: string;
  newContent?: string;
  pointNumber?: number;
}

const DocumentReviewTool: React.FC = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [selectedSection, setSelectedSection] = useState<string>("1");
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [draggedCommentId, setDraggedCommentId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number } | null>(
    null
  );
  const dragPosRef = useRef<{ x: number; y: number } | null>(null);
  const [, forceRerender] = useState(0);
  const [showVersionModal, setShowVersionModal] = useState(false);
  const [selectedComment, setSelectedComment] = useState<Comment | null>(null);
  const [mentionSearch, setMentionSearch] = useState("");
  const [showMentionSuggestions, setShowMentionSuggestions] = useState(false);
  const [collapsedComments, setCollapsedComments] = useState<Set<string>>(new Set());
  const [statusFilter, setStatusFilter] = useState<Comment["status"] | null>(null);
  const [sortBy, setSortBy] = useState("timestamp");
  const [selectedText, setSelectedText] = useState<string>("");
  const [selectionRange, setSelectionRange] = useState<{pointIndex: number, start: number, end: number, endPointIndex?: number} | null>(null);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [editPopupPosition, setEditPopupPosition] = useState<{x: number, y: number}>({x: 0, y: 0});
  const [isEditing, setIsEditing] = useState(false);
  const [editingText, setEditingText] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [expandedPinnedComments, setExpandedPinnedComments] = useState<Set<string>>(new Set());
  const [autoCollapseTimers, setAutoCollapseTimers] = useState<Map<string, NodeJS.Timeout>>(new Map());
  const [documentScrollPosition, setDocumentScrollPosition] = useState({ x: 0, y: 0 });
  
  // Function to get the current position of a document point element
  const getPointElementPosition = (pointIndex: number) => {
    if (!documentRef.current) return null;
    
    const pointElement = documentRef.current.querySelector(`[data-point-index="${pointIndex}"]`);
    if (!pointElement) return null;
    
    const documentRect = documentRef.current.getBoundingClientRect();
    const pointRect = pointElement.getBoundingClientRect();
    
    return {
      x: pointRect.left - documentRect.left + documentRef.current.scrollLeft,
      y: pointRect.top - documentRect.top + documentRef.current.scrollTop
    };
  };
  const [documentSectionsState, setDocumentSectionsState] = useState<DocumentSection[]>([]);

  // Helper function to convert array index to display number
  const getDisplayNumber = (sectionId: string, arrayIndex: number): number => {
    const section = documentSectionsState.find(s => s.id === sectionId);
    if (!section) return arrayIndex + 1;
    
    return section.content.slice(0, arrayIndex + 1)
      .filter(p => p.trim() !== '').length;
  };

  // Helper function to convert display number to array index
  const getArrayIndex = (sectionId: string, displayNumber: number): number => {
    const section = documentSectionsState.find(s => s.id === sectionId);
    if (!section) return displayNumber - 1;
    
    let count = 0;
    for (let i = 0; i < section.content.length; i++) {
      if (section.content[i].trim() !== '') {
        count++;
        if (count === displayNumber) {
          return i;
        }
      }
    }
    return displayNumber - 1; // fallback
  };

  // Helper function to calculate midpoint position between two points for multi-line comments
  const calculateMidpointPosition = (startPointIndex: number, endPointIndex: number): { x: number; y: number } => {
    if (!documentRef.current) return { x: 50, y: 50 };

    const startPointElement = documentRef.current.querySelector(`[data-point-index="${startPointIndex}"]`);
    const endPointElement = documentRef.current.querySelector(`[data-point-index="${endPointIndex}"]`);

    if (!startPointElement || !endPointElement) return { x: 50, y: 50 };

    const startRect = startPointElement.getBoundingClientRect();
    const endRect = endPointElement.getBoundingClientRect();
    const documentRect = documentRef.current.getBoundingClientRect();

    // Calculate midpoint between start and end points
    const midY = (startRect.top + startRect.height / 2 + endRect.top + endRect.height / 2) / 2;
    const midX = startRect.left + startRect.width / 2; // Use left edge of start point for X

    // Convert to absolute coordinates within the document container
    return {
      x: midX - documentRect.left + documentRef.current.scrollLeft,
      y: midY - documentRect.top + documentRef.current.scrollTop
    };
  };

  // Helper function to calculate pin dot position for comments
  const calculatePinDotPosition = (comment: Comment): { x: number; y: number } => {
    if (comment.endPointIndex !== undefined && comment.anchoredToPointIndex !== undefined) {
      // Multi-line comment - use midpoint between start and end points
      const midpointPos = calculateMidpointPosition(comment.anchoredToPointIndex, comment.endPointIndex);
      return midpointPos; // Use absolute midpoint position
    } else if (comment.anchoredToPointIndex !== undefined) {
      // Single-line comment - use anchored point position
      const pointPos = getPointElementPosition(comment.anchoredToPointIndex);
      return pointPos ? {
        x: pointPos.x + comment.position.x,
        y: pointPos.y + comment.position.y
      } : comment.position;
    }
    // Fallback to absolute position
    return comment.position;
  };

  // Helper function to constrain comment position within document boundaries
  const constrainCommentPosition = (position: { x: number; y: number }, commentWidth: number = 320, commentHeight: number = 200): { x: number; y: number } => {
    if (!documentRef.current) return position;

    const documentRect = documentRef.current.getBoundingClientRect();
    const documentScrollLeft = documentRef.current.scrollLeft;
    const documentScrollTop = documentRef.current.scrollTop;
    
    // Calculate the visible area boundaries
    const minX = documentScrollLeft + 10; // 10px padding from left edge
    const maxX = documentScrollLeft + documentRef.current.clientWidth - commentWidth - 10; // 10px padding from right edge
    const minY = documentScrollTop + 10; // 10px padding from top edge
    const maxY = documentScrollTop + documentRef.current.clientHeight - commentHeight - 10; // 10px padding from bottom edge

    return {
      x: Math.max(minX, Math.min(maxX, position.x)),
      y: Math.max(minY, Math.min(maxY, position.y))
    };
  };

  // Helper function to check if two rectangles overlap
  const rectanglesOverlap = (rect1: { x: number; y: number; width: number; height: number }, rect2: { x: number; y: number; width: number; height: number }): boolean => {
    return !(rect1.x + rect1.width < rect2.x || 
             rect2.x + rect2.width < rect1.x || 
             rect1.y + rect1.height < rect2.y || 
             rect2.y + rect2.height < rect1.y);
  };

  // Helper function to adjust pin dot position to avoid overlapping with expanded comments
  const adjustPinDotPosition = (originalPos: { x: number; y: number }, commentId: string): { x: number; y: number } => {
    const pinDotSize = 24; // 6 * 4 (w-6 h-6)
    let adjustedPos = { ...originalPos };
    
    // Get all expanded comment cards
    const expandedComments = comments.filter(c => 
      c.id !== commentId && 
      c.isPinned && 
      expandedPinnedComments.has(c.id) && 
      c.sectionId === selectedSection
    );

    if (expandedComments.length === 0) {
      return adjustedPos; // No adjustments needed
    }

    for (const expandedComment of expandedComments) {
      const commentPos = calculatePinDotPosition(expandedComment);
      const commentRect = {
        x: commentPos.x,
        y: commentPos.y,
        width: 320, // Comment card width
        height: 200 // Estimated comment card height
      };

      const pinDotRect = {
        x: adjustedPos.x - pinDotSize / 2,
        y: adjustedPos.y - pinDotSize / 2,
        width: pinDotSize,
        height: pinDotSize
      };

      if (rectanglesOverlap(commentRect, pinDotRect)) {
        // Calculate document boundaries
        const docScrollLeft = documentRef.current?.scrollLeft || 0;
        const docScrollTop = documentRef.current?.scrollTop || 0;
        const docWidth = documentRef.current?.clientWidth || 800;
        const docHeight = documentRef.current?.clientHeight || 600;
        
        // Try different positions in order of preference
        const possiblePositions = [
          // Right side of comment
          { x: commentRect.x + commentRect.width + 15, y: originalPos.y },
          // Left side of comment
          { x: commentRect.x - pinDotSize - 15, y: originalPos.y },
          // Above comment
          { x: originalPos.x, y: commentRect.y - pinDotSize - 15 },
          // Below comment
          { x: originalPos.x, y: commentRect.y + commentRect.height + 15 },
          // Top-right corner
          { x: commentRect.x + commentRect.width + 15, y: commentRect.y - pinDotSize - 15 },
          // Top-left corner
          { x: commentRect.x - pinDotSize - 15, y: commentRect.y - pinDotSize - 15 },
          // Bottom-right corner
          { x: commentRect.x + commentRect.width + 15, y: commentRect.y + commentRect.height + 15 },
          // Bottom-left corner
          { x: commentRect.x - pinDotSize - 15, y: commentRect.y + commentRect.height + 15 }
        ];

        // Find the first position that fits within document boundaries
        for (const pos of possiblePositions) {
          if (pos.x >= docScrollLeft + 10 && 
              pos.x + pinDotSize <= docScrollLeft + docWidth - 10 &&
              pos.y >= docScrollTop + 10 && 
              pos.y + pinDotSize <= docScrollTop + docHeight - 10) {
            
            // Check if this position overlaps with other expanded comments
            const testRect = {
              x: pos.x - pinDotSize / 2,
              y: pos.y - pinDotSize / 2,
              width: pinDotSize,
              height: pinDotSize
            };
            
            let overlapsWithOther = false;
            for (const otherComment of expandedComments) {
              if (otherComment.id === expandedComment.id) continue;
              const otherPos = calculatePinDotPosition(otherComment);
              const otherRect = {
                x: otherPos.x,
                y: otherPos.y,
                width: 320,
                height: 200
              };
              if (rectanglesOverlap(testRect, otherRect)) {
                overlapsWithOther = true;
                break;
              }
            }
            
            if (!overlapsWithOther) {
              adjustedPos = pos;
              break;
            }
          }
        }
      }
    }

    return adjustedPos;
  };

  // Text selection and editing functions
  const handleTextSelection = () => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) {
      setShowEditPopup(false);
      return;
    }

    const range = selection.getRangeAt(0);
    const selectedTextContent = selection.toString().trim();
    
    if (selectedTextContent.length === 0) {
      setShowEditPopup(false);
      return;
    }

    if (!documentRef.current) return;

    // Find which points contain the selected text
    const container = range.commonAncestorContainer;
    const startContainer = range.startContainer;
    const endContainer = range.endContainer;
    
    // Find the start point
    const startPointElement = startContainer.nodeType === Node.TEXT_NODE 
      ? startContainer.parentElement?.closest('[data-point-index]')
      : (startContainer as Element).closest ? (startContainer as Element).closest('[data-point-index]') : null;
    
    // Find the end point
    const endPointElement = endContainer.nodeType === Node.TEXT_NODE 
      ? endContainer.parentElement?.closest('[data-point-index]')
      : (endContainer as Element).closest ? (endContainer as Element).closest('[data-point-index]') : null;
    
    if (!startPointElement || !endPointElement) return;

    const startPointIndex = parseInt(startPointElement.getAttribute('data-point-index') || '0');
    const endPointIndex = parseInt(endPointElement.getAttribute('data-point-index') || '0');
    
    // Calculate selection positions within the text
    let startOffset = 0;
    let endOffset = 0;
    
    if (startPointIndex === endPointIndex) {
      // Single point selection
      const pointText = documentSectionsState.find((s: any) => s.id === selectedSection)?.content[startPointIndex] || '';
      const pointTextNode = startPointElement.querySelector('p')?.firstChild;
      
      if (pointTextNode) {
        const tempRange = document.createRange();
        tempRange.selectNodeContents(pointTextNode);
        tempRange.setEnd(range.startContainer, range.startOffset);
        startOffset = tempRange.toString().length;
        endOffset = startOffset + selectedTextContent.length;
      }
    } else {
      // Multi-point selection
      const startPointTextNode = startPointElement.querySelector('p')?.firstChild;
      const endPointTextNode = endPointElement.querySelector('p')?.firstChild;
      
      if (startPointTextNode) {
        const tempRange = document.createRange();
        tempRange.selectNodeContents(startPointTextNode);
        tempRange.setEnd(range.startContainer, range.startOffset);
        startOffset = tempRange.toString().length;
      }
      
      if (endPointTextNode) {
        const tempRange = document.createRange();
        tempRange.selectNodeContents(endPointTextNode);
        tempRange.setEnd(range.endContainer, range.endOffset);
        endOffset = tempRange.toString().length;
      }
    }

    setSelectedText(selectedTextContent);
    setSelectionRange({ 
      pointIndex: startPointIndex, 
      start: startOffset, 
      end: endOffset,
      endPointIndex: endPointIndex !== startPointIndex ? endPointIndex : undefined
    });

    // Position popup near selection
    const rect = range.getBoundingClientRect();
    const documentRect = documentRef.current.getBoundingClientRect();
    setEditPopupPosition({
      x: rect.left + rect.width / 2 - documentRect.left + documentRef.current.scrollLeft,
      y: rect.top - documentRect.top + documentRef.current.scrollTop
    });
    setShowEditPopup(true);
  };

  const startEditing = () => {
    setIsEditing(true);
    setEditingText(selectedText);
    setShowEditPopup(false);
  };

  const startCommenting = () => {
    if (!selectionRange || !selectedSection) return;

    const section = documentSectionsState.find((s: any) => s.id === selectedSection);
    if (!section) return;

    const { pointIndex, endPointIndex } = selectionRange;
    
    // Create comment text based on whether it's single or multi-line selection
    let commentText = '';
    if (endPointIndex !== undefined && endPointIndex !== pointIndex) {
      // Multi-line selection - use display numbers
      const startDisplayNumber = getDisplayNumber(selectedSection, pointIndex);
      const endDisplayNumber = getDisplayNumber(selectedSection, endPointIndex);
      commentText = `Regarding points ${startDisplayNumber} to ${endDisplayNumber}: `;
    } else {
      // Single line selection - use display number
      const displayNumber = getDisplayNumber(selectedSection, pointIndex);
      commentText = `Regarding point ${displayNumber}: `;
    }
    
    // Set the new comment in the input field with the line reference
    setNewComment(commentText);
    
    // Clear text selection state
    setSelectedText("");
    setSelectionRange(null);
    setShowEditPopup(false);
    
    // Focus the comment input field
    setTimeout(() => {
      if (commentInputRef.current) {
        commentInputRef.current.focus();
        // Position cursor at the end
        commentInputRef.current.setSelectionRange(commentInputRef.current.value.length, commentInputRef.current.value.length);
      }
    }, 100);
  };

  const saveEdit = () => {
    if (!selectionRange || !selectedSection) return;

    const section = documentSectionsState.find((s: any) => s.id === selectedSection);
    if (!section) return;

    const { pointIndex, start, end, endPointIndex } = selectionRange;
    
    if (endPointIndex !== undefined && endPointIndex !== pointIndex) {
      // Multi-line edit - handle spanning across multiple points
      const updatedContent = [...section.content];
      let combinedOriginalText = '';
      
      // Collect original text from all affected points
      for (let i = pointIndex; i <= endPointIndex; i++) {
        if (i === pointIndex) {
          // First point - from start position to end
          combinedOriginalText += updatedContent[i].substring(start);
        } else if (i === endPointIndex) {
          // Last point - from beginning to end position
          combinedOriginalText += ' ' + updatedContent[i].substring(0, end);
        } else {
          // Middle points - entire content
          combinedOriginalText += ' ' + updatedContent[i];
        }
      }
      
      // For multi-line editing, we want to preserve the structure
      // Split the edited text by paragraphs/sentences if it contains line breaks
      const editedLines = editingText.split('\n').map(line => line.trim()).filter(line => line.length > 0);
      
      // If no line breaks in edited text, treat as single replacement
      if (editedLines.length <= 1) {
        // Single line replacement across multiple points
        const singleLineContent = editedLines[0] || editingText;
        
        // Replace first point with prefix + edited content + suffix from last point
        const prefixFromFirst = updatedContent[pointIndex].substring(0, start);
        const suffixFromLast = updatedContent[endPointIndex].substring(end);
        updatedContent[pointIndex] = prefixFromFirst + singleLineContent + suffixFromLast;
        
        // Clear intermediate points but keep them as empty strings to maintain structure
        for (let i = pointIndex + 1; i < endPointIndex; i++) {
          updatedContent[i] = '';
        }
        
        // Clear the end point (its content was merged into first point)
        updatedContent[endPointIndex] = '';
        
      } else {
        // Multi-line replacement - distribute across available points
        const prefixFromFirst = updatedContent[pointIndex].substring(0, start);
        const suffixFromLast = updatedContent[endPointIndex].substring(end);
        
        // First point gets prefix + first edited line
        updatedContent[pointIndex] = prefixFromFirst + editedLines[0];
        
        // Distribute remaining edited lines to subsequent points
        for (let i = 1; i < editedLines.length; i++) {
          if (pointIndex + i <= endPointIndex) {
            updatedContent[pointIndex + i] = editedLines[i];
          } else {
            // If we need more points than available, append to the last available point
            if (pointIndex + i - 1 <= endPointIndex) {
              updatedContent[pointIndex + i - 1] += ' ' + editedLines[i];
            }
          }
        }
        
        // Handle the suffix from the last point
        if (suffixFromLast.trim()) {
          // Find the last point that has content and append the suffix
          let lastContentIndex = Math.min(pointIndex + editedLines.length - 1, endPointIndex);
          updatedContent[lastContentIndex] += suffixFromLast;
        }
        
        // Clear any remaining points in the selection range that weren't used
        for (let i = pointIndex + editedLines.length; i <= endPointIndex; i++) {
          updatedContent[i] = '';
        }
      }
      
      // Keep the structure intact - don't filter out empty points
      // Empty points will be preserved as empty strings
      
      // Update the document content
      const updatedSections = documentSectionsState.map(s => 
        s.id === selectedSection 
          ? {
              ...s,
              content: updatedContent,
              version: s.version + 1,
              hasChanges: true
            }
          : s
      );
      setDocumentSectionsState(updatedSections);

      // Add version change entry for multi-line edit
      const newVersionChange: VersionChange = {
        id: Date.now().toString(),
        type: "modified",
        content: `Updated text across points ${pointIndex + 1} to ${endPointIndex + 1}`,
        sectionId: selectedSection,
        oldContent: combinedOriginalText,
        newContent: editingText,
        pointNumber: pointIndex + 1 // Reference the starting point
      };

      setVersionChanges(prev => [...prev, newVersionChange]);
      
    } else {
      // Single-line edit (existing logic)
      const originalText = section.content[pointIndex];
      const newText = originalText.substring(0, start) + editingText + originalText.substring(end);

      // Update the document content
      const updatedSections = documentSectionsState.map(s => 
        s.id === selectedSection 
          ? {
              ...s,
              content: s.content.map((content, index) => 
                index === pointIndex ? newText : content
              ),
              version: s.version + 1,
              hasChanges: true
            }
          : s
      );
      setDocumentSectionsState(updatedSections);

      // Add version change entry for single-line edit
      const newVersionChange: VersionChange = {
        id: Date.now().toString(),
        type: "modified",
        content: `Updated text in point ${pointIndex + 1}`,
        sectionId: selectedSection,
        oldContent: originalText,
        newContent: newText,
        pointNumber: pointIndex + 1
      };

      setVersionChanges(prev => [...prev, newVersionChange]);
    }

    console.log('Document edit applied:', {
      sectionId: selectedSection,
      pointIndex,
      endPointIndex,
      isMultiLine: endPointIndex !== undefined && endPointIndex !== pointIndex
    });

    // Clear editing state
    setIsEditing(false);
    setEditingText("");
    setSelectedText("");
    setSelectionRange(null);
    setShowEditPopup(false);
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setEditingText("");
    setShowEditPopup(false);
  };

  const showToastMessage = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  const expandPinnedComment = (commentId: string) => {
    // First, collapse all other expanded pinned comments
    expandedPinnedComments.forEach(expandedCommentId => {
      if (expandedCommentId !== commentId) {
        clearAutoCollapseTimer(expandedCommentId);
      }
    });
    
    // Set only the new comment as expanded
    setExpandedPinnedComments(new Set([commentId]));
    startAutoCollapseTimer(commentId);
    
    // Force re-render to reposition pin dots
    setTimeout(() => {
      forceRerender((n) => n + 1);
    }, 50);
  };

  const collapsePinnedComment = (commentId: string) => {
    setExpandedPinnedComments(prev => {
      const newSet = new Set(prev);
      newSet.delete(commentId);
      return newSet;
    });
    clearAutoCollapseTimer(commentId);
    
    // Force re-render to reposition pin dots
    setTimeout(() => {
      forceRerender((n) => n + 1);
    }, 50);
  };

  const startAutoCollapseTimer = (commentId: string) => {
    // Clear existing timer if any
    clearAutoCollapseTimer(commentId);
    
    const timer = setTimeout(() => {
      collapsePinnedComment(commentId);
    }, 10000); // 10 seconds
    
    setAutoCollapseTimers(prev => new Map(prev).set(commentId, timer));
  };

  const clearAutoCollapseTimer = (commentId: string) => {
    const timer = autoCollapseTimers.get(commentId);
    if (timer) {
      clearTimeout(timer);
      setAutoCollapseTimers(prev => {
        const newMap = new Map(prev);
        newMap.delete(commentId);
        return newMap;
      });
    }
  };

  const handlePinnedCommentInteraction = (commentId: string) => {
    if (expandedPinnedComments.has(commentId)) {
      // Reset the auto-collapse timer on interaction
      startAutoCollapseTimer(commentId);
    }
  };

  // Filter and sort comments
  const filteredComments = comments
    .filter(comment => comment.sectionId === selectedSection)
    .filter(comment => !statusFilter || comment.status === statusFilter)
    .sort((a, b) => {
      switch (sortBy) {
        case "timestamp-asc":
          return a.timestamp.getTime() - b.timestamp.getTime();
        case "status":
          return a.status.localeCompare(b.status);
        case "author":
          return a.author.name.localeCompare(b.author.name);
        default:
          return b.timestamp.getTime() - a.timestamp.getTime();
      }
    });

  const documentRef = useRef<HTMLDivElement>(null);
  const commentInputRef = useRef<HTMLTextAreaElement>(null);

  const [burgerOpen, setBurgerOpen] = useState(false);

  const burgerMenuRef = useRef<HTMLDivElement>(null);

  const users: User[] = [
    { id: "1", name: "Sarah Chen", avatar: "SC", role: "Senior Editor" },
    { id: "2", name: "Michael Rodriguez", avatar: "MR", role: "Legal Counsel" },
    { id: "3", name: "Emily Watson", avatar: "EW", role: "Project Manager" },
    { id: "4", name: "David Kim", avatar: "DK", role: "Technical Lead" },
  ];

  const documentSections: DocumentSection[] = [
    {
      id: "1",
      title: "Executive Summary",
      content: [
        "This strategic initiative represents a comprehensive transformation of our market positioning and operational capabilities, designed to capitalize on emerging opportunities in the global marketplace while addressing evolving customer demands and competitive pressures.",
        "Our analysis of current market dynamics reveals significant potential for growth in both established and emerging markets, particularly in the technology services sector where we have identified substantial untapped opportunities.",
        "Our strategic approach focuses on three core pillars: market expansion through targeted geographic diversification, operational efficiency improvements leveraging advanced technologies and process optimization, and enhanced customer experience delivery through innovative service models. Additionally, we have integrated comprehensive sustainability initiatives that align with global environmental standards and stakeholder expectations.",
        "This multi-faceted strategy is designed to drive sustainable revenue growth while maintaining our commitment to operational excellence and stakeholder value creation.",
        "The implementation of these initiatives is expected to deliver measurable improvements across key performance indicators, including a projected 25% increase in market share within target segments, 15% reduction in operational costs through process optimization, and enhanced customer satisfaction scores exceeding 90%.",
        "These outcomes will position our organization as a market leader in the rapidly evolving technology services landscape.",
        "Success metrics for this initiative include quarterly revenue growth targets, customer acquisition rates, operational efficiency benchmarks, and employee engagement scores. Regular monitoring and adjustment of our strategic approach will ensure we remain responsive to market changes while maintaining alignment with our long-term organizational objectives."
      ],
      version: 2,
      hasChanges: true,
    },
    {
      id: "2",
      title: "Market Analysis",
      content: [
        "Our comprehensive market analysis reveals compelling opportunities for strategic expansion, particularly in the rapidly growing Southeast Asian and Latin American markets.",
        "These regions demonstrate strong economic fundamentals, increasing technology adoption rates, and favorable regulatory environments that align with our business model and growth objectives.",
        "The digital transformation initiatives driving these markets present significant opportunities for our technology services portfolio.",
        "In Southeast Asia, we have identified Vietnam, Indonesia, and the Philippines as primary target markets, where GDP growth rates averaging 6-7% annually, combined with increasing technology infrastructure investments, create an ideal environment for our service offerings.",
        "The region's young, tech-savvy population and government support for digital initiatives provide additional momentum for market entry and expansion strategies.",
        "Latin America presents equally compelling opportunities, with Brazil, Mexico, and Colombia emerging as key growth markets.",
        "The region's increasing focus on digital transformation, combined with improving economic stability and regulatory frameworks, creates favorable conditions for technology service providers.",
        "Our analysis indicates strong demand for cloud computing solutions, cybersecurity services, and digital consulting expertise across these markets.",
        "Competitive landscape analysis reveals a fragmented market structure with significant opportunities for differentiation through our specialized expertise in enterprise software solutions and industry-specific knowledge.",
        "While established global players maintain strong positions in traditional IT services, we have identified underserved segments in mid-market enterprises and industry-specific solutions where our expertise provides competitive advantages."
      ],
      version: 1,
      hasChanges: false,
    },
    {
      id: "3",
      title: "Financial Projections",
      content: [
        "Our financial projections reflect a conservative yet ambitious growth trajectory, with revenue growth targets of 25% year-over-year over the next three years, driven primarily by market expansion initiatives and enhanced service offerings.",
        "This growth projection is based on detailed market analysis, historical performance data, and conservative assumptions regarding market penetration rates and competitive dynamics.",
        "Operating margins are expected to improve by 3 percentage points from current levels, reaching 18% by the end of the projection period.",
        "This margin expansion will be achieved through operational efficiency improvements, economies of scale from increased market presence, and enhanced pricing power resulting from our differentiated service offerings.",
        "Cost optimization initiatives, including automation of routine processes and strategic sourcing partnerships, will contribute significantly to margin improvement.",
        "Capital expenditure requirements for the expansion initiatives are projected at $15 million over the next 24 months, with the majority allocated to technology infrastructure, market entry costs, and talent acquisition.",
        "These investments are expected to generate positive returns within 18 months of deployment, with payback periods averaging 14 months across all major initiatives.",
        "Cash flow projections indicate strong positive operating cash flows throughout the projection period, with free cash flow margins expanding from 12% to 15% by year three.",
        "This strong cash generation will support continued investment in growth initiatives while maintaining financial flexibility for strategic acquisitions and market opportunities that may arise during the implementation period."
      ],
      version: 3,
      hasChanges: true,
    },
    {
      id: "4",
      title: "Implementation Timeline",
      content: [
        "The implementation of our strategic initiatives will be executed through a phased approach designed to minimize risk while maximizing market impact and operational efficiency.",
        "Phase 1, scheduled for Q1 2025, focuses on foundational infrastructure development and organizational readiness, including the establishment of regional offices, technology platform deployment, and comprehensive team training programs across all functional areas.",
        "Phase 2, commencing in Q2 2025, will focus on market entry and pilot program execution in our primary target markets.",
        "This phase includes the launch of localized service offerings, establishment of key customer relationships, and validation of our market entry strategies through controlled pilot programs.",
        "Success metrics for this phase include customer acquisition targets, service delivery quality scores, and market feedback integration.",
        "Phase 3, beginning in Q3 2025, will expand our market presence through scaled operations and enhanced service delivery capabilities.",
        "This phase includes the full deployment of our technology platforms, expansion of our service portfolio, and implementation of advanced analytics and customer relationship management systems.",
        "Operational efficiency improvements and process optimization initiatives will be fully implemented during this phase.",
        "Phase 4, scheduled for Q4 2025, will focus on market consolidation, performance optimization, and strategic positioning for continued growth.",
        "This final phase includes comprehensive performance evaluation, strategic adjustments based on market feedback, and preparation for additional market expansion opportunities.",
        "Success metrics will be evaluated against our established KPIs, with adjustments made to ensure alignment with our long-term strategic objectives."
      ],
      version: 2,
      hasChanges: false,
    },
  ];

  const [versionChanges, setVersionChanges] = useState<VersionChange[]>([
    {
      id: "1",
      type: "added",
      content: "Added sustainability initiatives to strategic pillars",
      sectionId: "1",
      oldContent: "Our strategic approach focuses on three core pillars: market expansion through targeted geographic diversification, operational efficiency improvements leveraging advanced technologies and process optimization, and enhanced customer experience delivery through innovative service models.",
      newContent: "Our strategic approach focuses on three core pillars: market expansion through targeted geographic diversification, operational efficiency improvements leveraging advanced technologies and process optimization, and enhanced customer experience delivery through innovative service models. Additionally, we have integrated comprehensive sustainability initiatives that align with global environmental standards and stakeholder expectations.",
      pointNumber: 3
    },
    {
      id: "2",
      type: "modified",
      content: "Updated revenue growth targets from 20% to 25% based on latest market data",
      sectionId: "3",
      oldContent: "Our financial projections reflect a conservative growth trajectory, with revenue growth targets of 20% year-over-year over the next three years, driven primarily by market expansion initiatives and enhanced service offerings.",
      newContent: "Our financial projections reflect a conservative yet ambitious growth trajectory, with revenue growth targets of 25% year-over-year over the next three years, driven primarily by market expansion initiatives and enhanced service offerings.",
      pointNumber: 1
    },
    {
      id: "3",
      type: "removed",
      content: "Removed outdated traditional market entry strategy",
      sectionId: "2",
      oldContent: "Our initial market entry strategy focused on traditional regional expansion through established partnerships and local market research. This approach, while effective in the past, has become less relevant in today's rapidly evolving digital landscape.",
      newContent: "",
      pointNumber: 2
    },
  ]);

  useEffect(() => {
    setDocumentSectionsState(documentSections);
  }, []);

  useEffect(() => {
    const sampleComments: Comment[] = [
      {
        id: "1",
        content:
          "Great analysis @Sarah Chen! Should we include more details about the competitive landscape?",
        author: users[0],
        status: "open",
        timestamp: new Date(Date.now() - 3600000),
        position: { x: 150, y: 180 },
        sectionId: "1",
        mentions: ["Sarah Chen"],
        isPinned: false,
        anchoredToPointIndex: 0,
      },
      {
        id: "2",
        content:
          "@Michael Rodriguez - Please review the legal implications of the new market entry strategy.",
        author: users[0],
        status: "pending",
        timestamp: new Date(Date.now() - 7200000),
        position: { x: 200, y: 280 },
        sectionId: "2",
        mentions: ["Michael Rodriguez"],
        isPinned: false,
        anchoredToPointIndex: 1,
      },
    ];
    setComments(sampleComments);
  }, []);

  useEffect(() => {
    if (!burgerOpen) return;
    function handleClick(e: MouseEvent) {
      if (
        burgerMenuRef.current &&
        !burgerMenuRef.current.contains(e.target as Node)
      ) {
        setBurgerOpen(false);
      }
    }
    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setBurgerOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [burgerOpen]);

  useEffect(() => {
    if (showVersionModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showVersionModal]);

  // Handle text selection
  useEffect(() => {
    const handleSelectionChange = () => {
      if (!isEditing) {
        handleTextSelection();
      }
    };

    document.addEventListener('selectionchange', handleSelectionChange);
    return () => document.removeEventListener('selectionchange', handleSelectionChange);
  }, [isEditing, selectedSection]);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      autoCollapseTimers.forEach(timer => clearTimeout(timer));
    };
  }, [autoCollapseTimers]);

  // Track document scroll position and trigger re-render for anchored comments
  useEffect(() => {
    const handleDocumentScroll = () => {
      if (documentRef.current) {
        setDocumentScrollPosition({
          x: documentRef.current.scrollLeft,
          y: documentRef.current.scrollTop
        });
        // Force re-render to update anchored comment positions
        forceRerender((n) => n + 1);
      }
    };

    if (documentRef.current) {
      documentRef.current.addEventListener('scroll', handleDocumentScroll);
      return () => {
        if (documentRef.current) {
          documentRef.current.removeEventListener('scroll', handleDocumentScroll);
        }
      };
    }
  }, [selectedSection]);

  const handleCommentMouseDown = (e: React.MouseEvent, comment: Comment) => {
    // Don't start dragging if clicking on the collapse button, delete button, pin button, or status dropdown
    if ((e.target as HTMLElement).closest('.collapse-button') || 
        (e.target as HTMLElement).closest('.delete-button') ||
        (e.target as HTMLElement).closest('.pin-button') ||
        (e.target as HTMLElement).tagName === 'SELECT' ||
        (e.target as HTMLElement).closest('select')) {
      return;
    }
    
    // Show toast if comment is pinned and user tries to drag
    if (comment.isPinned) {
      showToastMessage("Please unpin the comment to reposition");
      return;
    }
    
    if (!documentRef.current) return;
    const rect = documentRef.current.getBoundingClientRect();
    const offsetX = (e.clientX - rect.left + documentRef.current.scrollLeft) - comment.position.x;
    const offsetY = (e.clientY - rect.top + documentRef.current.scrollTop) - comment.position.y;
    setDraggedCommentId(comment.id);
    setDragOffset({ x: offsetX, y: offsetY });
    dragPosRef.current = { x: comment.position.x, y: comment.position.y };
    forceRerender((n) => n + 1);
    document.body.style.userSelect = "none";
  };

  React.useEffect(() => {
    if (!draggedCommentId || !dragOffset) return;
    let animationFrame: number;
    function onMouseMove(e: MouseEvent) {
      if (!documentRef.current || !dragOffset) return;
      const rect = documentRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left - dragOffset.x + documentRef.current.scrollLeft;
      const y = e.clientY - rect.top - dragOffset.y + documentRef.current.scrollTop;
      
      // Apply constraints to keep comment within document boundaries
      const constrainedPos = constrainCommentPosition({ x, y });
      dragPosRef.current = constrainedPos;
      
      // Use requestAnimationFrame to throttle re-renders during dragging
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
      animationFrame = requestAnimationFrame(() => {
      forceRerender((n) => n + 1);
      });
    }
    function onMouseUp() {
      if (!documentRef.current || !draggedCommentId || !dragPosRef.current) {
        setDraggedCommentId(null);
        setDragOffset(null);
        dragPosRef.current = null;
        forceRerender((n) => n + 1);
        document.body.style.userSelect = "";
        return;
      }
      const dropPos = dragPosRef.current;
      // Apply final constraint to the drop position
      const constrainedDropPos = constrainCommentPosition(dropPos);
      setComments((prev) =>
        prev.map((comment) =>
          comment.id === draggedCommentId && constrainedDropPos
            ? { ...comment, position: { x: constrainedDropPos.x, y: constrainedDropPos.y } }
            : comment
        )
      );
      setDraggedCommentId(null);
      setDragOffset(null);
      dragPosRef.current = null;
      forceRerender((n) => n + 1);
      document.body.style.userSelect = "";
    }
    function onFrame() {
      animationFrame = requestAnimationFrame(onFrame);
    }
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    animationFrame = requestAnimationFrame(onFrame);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      cancelAnimationFrame(animationFrame);
    };
  }, [draggedCommentId, dragOffset, setComments]);

  const addComment = () => {
    if (!newComment.trim() || !selectedSection) return;

    const mentions = extractMentions(newComment);
    
    // Check if comment is referencing specific points (single or range)
    const singlePointRegex = /^Regarding point (\d+):/;
    const multiPointRegex = /^Regarding points (\d+) to (\d+):/;
    
    const singlePointMatch = newComment.match(singlePointRegex);
    const multiPointMatch = newComment.match(multiPointRegex);
    
    let closestPointIndex = 0;
    let isPinned = false;
    let commentPosition = { x: 317, y: 265 }; // Default position
    
    if (multiPointMatch) {
      // Comment is referencing multiple points - convert display numbers to array indices
      const startDisplayNumber = parseInt(multiPointMatch[1]);
      const endDisplayNumber = parseInt(multiPointMatch[2]);
      const startPoint = getArrayIndex(selectedSection, startDisplayNumber);
      const endPoint = getArrayIndex(selectedSection, endDisplayNumber);
      const currentSection = documentSectionsState.find(s => s.id === selectedSection);
      
      if (currentSection && startPoint >= 0 && endPoint < currentSection.content.length && startPoint <= endPoint) {
        closestPointIndex = startPoint; // Anchor to the starting point
        isPinned = true;
        
        // If this comment was created from text selection, position it at the selection start
        if (selectionRange && selectionRange.pointIndex === startPoint && selectionRange.endPointIndex === endPoint) {
          // Calculate position at the beginning of the selected text
          const pointElement = documentRef.current?.querySelector(`[data-point-index="${startPoint}"]`);
          if (pointElement) {
            const pointTextElement = pointElement.querySelector('p');
            if (pointTextElement) {
              // Create a range to measure the position of the selection start
              const range = document.createRange();
              const textNode = pointTextElement.firstChild;
              if (textNode) {
                range.setStart(textNode, selectionRange.start);
                range.setEnd(textNode, selectionRange.start);
                const rect = range.getBoundingClientRect();
                const documentRect = documentRef.current!.getBoundingClientRect();
                
                // Position relative to the document point
                commentPosition = {
                  x: rect.left - documentRect.left + documentRef.current!.scrollLeft - (pointElement.getBoundingClientRect().left - documentRect.left + documentRef.current!.scrollLeft),
                  y: rect.top - documentRect.top + documentRef.current!.scrollTop - (pointElement.getBoundingClientRect().top - documentRect.top + documentRef.current!.scrollTop) - 10
                };
              }
            }
          }
        } else {
          // Default relative position for non-selection comments
          commentPosition = calculateMidpointPosition(startPoint, endPoint);
        }
        
        // Store the end point index for multi-line comments
        const newCommentObj: Comment = {
          id: Date.now().toString(),
          content: newComment,
          author: users[0],
          status: "open",
          timestamp: new Date(),
          position: constrainCommentPosition(commentPosition),
          sectionId: selectedSection,
          mentions,
          isPinned,
          anchoredToPointIndex: closestPointIndex,
          endPointIndex: endPoint, // Store end point for multi-line comments
        };

        setComments((prev) => [...prev, newCommentObj]);
        setNewComment("");
        setShowMentionSuggestions(false);
        
        // Clear selection range after creating comment
        setSelectionRange(null);
        
        // If the comment was pinned, collapse it to pin dot initially
        if (isPinned) {
          setTimeout(() => {
            collapsePinnedComment(newCommentObj.id);
          }, 100);
        }
        return; // Early return for multi-line comments
      }
    } else if (singlePointMatch) {
      // Comment is referencing a single point - convert display number to array index
      const displayNumber = parseInt(singlePointMatch[1]);
      const referencedPoint = getArrayIndex(selectedSection, displayNumber);
      const currentSection = documentSectionsState.find(s => s.id === selectedSection);
      
      if (currentSection && referencedPoint >= 0 && referencedPoint < currentSection.content.length) {
        closestPointIndex = referencedPoint;
        isPinned = true;
        
        // If this comment was created from text selection, position it at the selection start
        if (selectionRange && selectionRange.pointIndex === referencedPoint) {
          // Calculate position at the beginning of the selected text
          const pointElement = documentRef.current?.querySelector(`[data-point-index="${referencedPoint}"]`);
          if (pointElement) {
            const pointTextElement = pointElement.querySelector('p');
            if (pointTextElement) {
              // Create a range to measure the position of the selection start
              const range = document.createRange();
              const textNode = pointTextElement.firstChild;
              if (textNode) {
                range.setStart(textNode, selectionRange.start);
                range.setEnd(textNode, selectionRange.start);
                const rect = range.getBoundingClientRect();
                const documentRect = documentRef.current!.getBoundingClientRect();
                
                // Position relative to the document point
                commentPosition = {
                  x: rect.left - documentRect.left + documentRef.current!.scrollLeft - (pointElement.getBoundingClientRect().left - documentRect.left + documentRef.current!.scrollLeft),
                  y: rect.top - documentRect.top + documentRef.current!.scrollTop - (pointElement.getBoundingClientRect().top - documentRect.top + documentRef.current!.scrollTop) - 10
                };
              }
            }
          }
        } else {
          // Default relative position for non-selection comments
          commentPosition = { x: 50, y: 50 };
        }
      }
    } else {
      // Find the closest document point to anchor the comment to (existing logic)
      const currentSection = documentSectionsState.find(s => s.id === selectedSection);
      if (currentSection && documentRef.current) {
        const documentRect = documentRef.current.getBoundingClientRect();
        const centerY = documentRect.top + documentRect.height / 2;
        
        let minDistance = Infinity;
        currentSection.content.forEach((_, index) => {
          const pointElement = documentRef.current?.querySelector(`[data-point-index="${index}"]`);
          if (pointElement) {
            const pointRect = pointElement.getBoundingClientRect();
            const distance = Math.abs(pointRect.top + pointRect.height / 2 - centerY);
            if (distance < minDistance) {
              minDistance = distance;
              closestPointIndex = index;
            }
          }
        });
      }
    }
    
    const newCommentObj: Comment = {
      id: Date.now().toString(),
      content: newComment,
      author: users[0],
      status: "open",
      timestamp: new Date(),
      position: constrainCommentPosition(commentPosition),
      sectionId: selectedSection,
      mentions,
      isPinned,
      anchoredToPointIndex: closestPointIndex,
    };

    setComments((prev) => [...prev, newCommentObj]);
    setNewComment("");
    setShowMentionSuggestions(false);
    
    // Clear selection range after creating comment
    setSelectionRange(null);
    
    // If the comment was pinned, collapse it to pin dot initially
    if (isPinned) {
      setTimeout(() => {
        collapsePinnedComment(newCommentObj.id);
      }, 100);
    }
  };

  const extractMentions = (text: string): string[] => {
    const mentionRegex = /@(\w+)/g;
    const matches = text.match(mentionRegex);
    return matches ? matches.map((match) => match.slice(1)) : [];
  };

  const updateCommentStatus = (
    commentId: string,
    status: Comment["status"]
  ) => {
    setComments((prev) =>
      prev.map((comment) =>
        comment.id === commentId ? { ...comment, status } : comment
      )
    );
  };

  const deleteComment = (commentId: string) => {
    console.log('Deleting comment:', commentId);
    setComments((prev) => prev.filter((comment) => comment.id !== commentId));
  };

  const toggleCommentCollapse = (commentId: string) => {
    setCollapsedComments(prev => {
      const newSet = new Set(prev);
      if (newSet.has(commentId)) {
        newSet.delete(commentId);
      } else {
        newSet.add(commentId);
      }
      return newSet;
    });
  };

  const toggleCommentPin = (commentId: string) => {
    const comment = comments.find(c => c.id === commentId);
    if (!comment) return;

    if (!comment.isPinned) {
      // Comment is being pinned - find the closest document point to anchor to
      let closestPointIndex = comment.anchoredToPointIndex || 0;
      const currentSection = documentSectionsState.find(s => s.id === comment.sectionId);
      
      if (currentSection && documentRef.current) {
        const commentElement = document.querySelector(`[data-comment-id="${commentId}"]`);
        if (commentElement) {
          const commentRect = commentElement.getBoundingClientRect();
          const commentCenterY = commentRect.top + commentRect.height / 2;
          
          let minDistance = Infinity;
          currentSection.content.forEach((_, index) => {
            const pointElement = documentRef.current?.querySelector(`[data-point-index="${index}"]`);
            if (pointElement) {
              const pointRect = pointElement.getBoundingClientRect();
              const distance = Math.abs(pointRect.top + pointRect.height / 2 - commentCenterY);
              if (distance < minDistance) {
                minDistance = distance;
                closestPointIndex = index;
              }
            }
          });
        }
      }

      setComments(prev => 
        prev.map(c => 
          c.id === commentId 
            ? { 
                ...c, 
                isPinned: true, 
                anchoredToPointIndex: closestPointIndex,
                // Store relative position from the anchor point
                position: (() => {
                  const pointPos = getPointElementPosition(closestPointIndex);
                  return pointPos ? {
                    x: c.position.x - pointPos.x,
                    y: c.position.y - pointPos.y
                  } : c.position;
                })()
              }
            : c
        )
      );
      
      // Collapse it to pin dot
      collapsePinnedComment(commentId);
    } else {
      // Comment is being unpinned - clear anchor and restore absolute positioning
      setComments(prev => 
        prev.map(c => {
          if (c.id === commentId) {
            // Convert back to absolute position
            const currentPos = c.anchoredToPointIndex !== undefined 
              ? (() => {
                  const pointPos = getPointElementPosition(c.anchoredToPointIndex);
                  return pointPos ? {
                    x: pointPos.x + c.position.x,
                    y: pointPos.y + c.position.y
                  } : c.position;
                })()
              : c.position;
            
            // Apply constraints to ensure comment stays within document boundaries
            const constrainedPos = constrainCommentPosition(currentPos);
            
            return { 
              ...c, 
              isPinned: false, 
              anchoredToPointIndex: undefined,
              position: constrainedPos
            };
          }
          return c;
        })
      );
      
      // Clear timers and expand state
      clearAutoCollapseTimer(commentId);
      setExpandedPinnedComments(prev => {
        const newSet = new Set(prev);
        newSet.delete(commentId);
        return newSet;
      });
    }
    
    // Clear selection when pinning/unpinning to reset opacity behavior
    setTimeout(() => {
      if (selectedComment?.id === commentId) {
        setSelectedComment(null);
      }
      forceRerender((n) => n + 1);
    }, 10);
  };

  const scrollToComment = (commentId: string) => {
    const comment = comments.find(c => c.id === commentId);
    if (!comment || !documentRef.current) return;

    // If comment is pinned and collapsed as a pin dot, expand it first
    if (comment.isPinned && !expandedPinnedComments.has(commentId)) {
      expandPinnedComment(commentId);
    }

    // If comment is not in the currently selected section, switch to it first
    if (comment.sectionId !== selectedSection) {
      setSelectedSection(comment.sectionId);
      // Wait for the section to render before scrolling
      setTimeout(() => scrollToCommentPosition(comment), 100);
    } else {
      scrollToCommentPosition(comment);
    }
  };

  const scrollToCommentPosition = (comment: Comment) => {
    if (!documentRef.current) return;

    const documentContainer = documentRef.current;
    
    let targetX = comment.position.x;
    let targetY = comment.position.y;
    
    // For pinned comments, use the calculated pin dot position
    if (comment.isPinned && comment.anchoredToPointIndex !== undefined) {
      const pinPos = calculatePinDotPosition(comment);
      targetX = pinPos.x;
      targetY = pinPos.y;
    }
    
    // Calculate scroll position to center the target within the document panel
    const scrollX = targetX - documentContainer.clientWidth / 2;
    const scrollY = targetY - documentContainer.clientHeight / 2;

    // Smooth scroll within the document container
    documentContainer.scrollTo({
      left: Math.max(0, scrollX),
      top: Math.max(0, scrollY),
      behavior: 'smooth'
    });

    // Highlight the comment temporarily
    setSelectedComment(comment);
    
    // Add a brief highlight effect
    setTimeout(() => {
      const commentElement = document.querySelector(`[data-comment-id="${comment.id}"]`);
      if (commentElement) {
        commentElement.classList.add('highlight-comment');
        setTimeout(() => {
          commentElement.classList.remove('highlight-comment');
          // Clear selection after highlight animation to restore normal opacity
          setSelectedComment(null);
        }, 2000);
      }
    }, 500);
  };

  const handleMentionInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setNewComment(value);

    const lastWord = value.split(" ").pop() || "";
    if (lastWord.startsWith("@")) {
      setMentionSearch(lastWord.slice(1));
      setShowMentionSuggestions(true);
    } else {
      setShowMentionSuggestions(false);
    }
  };

  const insertMention = (userName: string) => {
    const words = newComment.split(" ");
    words[words.length - 1] = `@${userName}`;
    setNewComment(words.join(" ") + " ");
    setShowMentionSuggestions(false);
    commentInputRef.current?.focus();
  };

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(mentionSearch.toLowerCase())
  );

  const getStatusColor = (status: Comment["status"]) => {
    switch (status) {
      case "open":
        return "bg-blue-500";
      case "resolved":
        return "bg-green-500";
      case "pending":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusText = (status: Comment["status"]) => {
    switch (status) {
      case "open":
        return "Open";
      case "resolved":
        return "Resolved";
      case "pending":
        return "Pending Review";
      default:
        return "Unknown";
    }
  };

  const poppinsFont = `\
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;900&display=swap');\n\
    html, body, #root, * {\n  font-family: 'Poppins', sans-serif !important;\n  font-synthesis: none;\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale;\n}\n`;

  const [showDraggableComments, setShowDraggableComments] =
    React.useState(true);
  React.useEffect(() => {
    function handleResize() {
      setShowDraggableComments(window.innerWidth >= 768);
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <style>{poppinsFont}</style>
      <style>{`
        /* Comment highlight animation */
        .highlight-comment {
          animation: highlight-pulse 2s ease-in-out;
          z-index: 999 !important;
        }

        @keyframes highlight-pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7);
            transform: scale(1);
          }
          50% {
            box-shadow: 0 0 0 10px rgba(59, 130, 246, 0.2);
            transform: scale(1.05);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(59, 130, 246, 0);
            transform: scale(1);
          }
        }

        /* Dark mode variant */
        @media (prefers-color-scheme: dark) {
          @keyframes highlight-pulse {
            0% {
              box-shadow: 0 0 0 0 rgba(96, 165, 250, 0.7);
              transform: scale(1);
            }
            50% {
              box-shadow: 0 0 0 10px rgba(96, 165, 250, 0.2);
              transform: scale(1.05);
            }
            100% {
              box-shadow: 0 0 0 0 rgba(96, 165, 250, 0);
              transform: scale(1);
            }
          }
        }

        /* Toast notification animations */
        .toast-enter {
          transform: translateX(100%);
          opacity: 0;
        }

        .toast-enter-active {
          transform: translateX(0);
          opacity: 1;
          transition: transform 300ms ease-out, opacity 300ms ease-out;
        }

        .toast-exit {
          transform: translateX(0);
          opacity: 1;
        }

        .toast-exit-active {
          transform: translateX(100%);
          opacity: 0;
          transition: transform 250ms ease-in, opacity 250ms ease-in;
        }

        /* Pin dot animations */
        @keyframes pin-pulse {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.8;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes zoom-in-smooth {
          0% {
            transform: scale(0.3) rotate(-2deg);
            opacity: 0;
            border-radius: 50%;
          }
          30% {
            transform: scale(0.6) rotate(-1deg);
            opacity: 0.3;
            border-radius: 24px;
          }
          70% {
            transform: scale(0.95) rotate(0deg);
            opacity: 0.8;
            border-radius: 16px;
          }
          100% {
            transform: scale(1) rotate(0deg);
            opacity: 1;
            border-radius: 16px;
          }
        }

        .animate-in {
          animation: zoom-in-smooth 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .animate-pulse-pin {
          animation: pin-pulse 2s infinite;
        }

        /* Hide scrollbars for all scrollable areas */
        .hide-scrollbar {
          -ms-overflow-style: none;  /* Internet Explorer 10+ */
          scrollbar-width: none;  /* Firefox */
        }
        
        .hide-scrollbar::-webkit-scrollbar {
          display: none;  /* Safari and Chrome */
        }

        /* Apply to all overflow areas */
        .overflow-auto,
        .overflow-y-auto,
        .overflow-x-auto {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        
        .overflow-auto::-webkit-scrollbar,
        .overflow-y-auto::-webkit-scrollbar,
        .overflow-x-auto::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      <div
        className={`h-screen w-screen transition-colors duration-300 font-sans relative flex flex-col ${
          darkMode ? "text-[#E6EAF2]" : "text-[#1A2233]"
        }`}
        style={{
          background: darkMode
            ? "linear-gradient(135deg, #181C24 0%, #232B3E 100%)"
            : "linear-gradient(135deg, #F6F8FB 0%, #E9F0FA 100%)",
        }}
      >
        <div
          className="pointer-events-none fixed inset-0 z-0"
          aria-hidden="true"
          style={{
            background: darkMode
              ? "radial-gradient(ellipse at 60% 20%, rgba(60,120,255,0.13) 0%, transparent 60%), radial-gradient(ellipse at 20% 80%, rgba(255,120,180,0.10) 0%, transparent 70%)"
              : "radial-gradient(ellipse at 60% 20%, rgba(60,120,255,0.10) 0%, transparent 60%), radial-gradient(ellipse at 20% 80%, rgba(255,200,120,0.08) 0%, transparent 70%)",
          }}
        />
        <header
          className={`border-b transition-colors duration-300 shadow-md z-[200] relative w-full box-border flex-shrink-0 ${
            darkMode
              ? "border-[#232B3E] bg-gradient-to-r from-[#232B3E] to-[#1A2233]"
              : "border-[#E3E7EB] bg-gradient-to-r from-[#F6F8FB] to-[#E3EFFF]"
          }`}
          style={{
            boxShadow: darkMode
              ? "0 2px 12px 0 rgba(30,40,80,0.22)"
              : "0 2px 12px 0 rgba(60,120,200,0.10)",
          }}
        >
          <div className="flex items-center justify-between px-4 sm:px-8 py-5 w-full">
            <div className="flex items-center space-x-4 sm:space-x-6">
              <h1
                className={`text-3xl font-black tracking-tight select-none transition-colors duration-200 ${
                  darkMode ? "text-[#5B8CFF]" : "text-[#1A4DFF]"
                }`}
              >
                Document Review Pro
              </h1>
              <span
                className={`px-3 py-1 rounded-full text-sm font-semibold shadow-sm transition-colors duration-200 ${
                  darkMode
                    ? "bg-[#2E4D2F] text-[#B6F5C6]"
                    : "bg-[#E6F9F0] text-[#1A7F5B]"
                }`}
              >
                Live Collaboration
              </span>
            </div>
            <div className="hidden sm:flex items-center space-x-4">
              <button
                onClick={() => setShowVersionModal(!showVersionModal)}
                className={`px-6 py-3 rounded-xl font-semibold text-base transition-all duration-200 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 cursor-pointer ${
                  showVersionModal
                    ? darkMode
                      ? "bg-blue-600 text-white border-2 border-blue-500"
                      : "bg-blue-600 text-white border-2 border-blue-500"
                    : darkMode
                    ? "bg-slate-800 text-blue-200 border-2 border-slate-600 hover:bg-slate-700 hover:border-slate-500"
                    : "bg-white text-blue-700 border-2 border-gray-200 hover:bg-gray-50 hover:border-gray-300"
                }`}
              >
                {showVersionModal ? "Hide Changes" : "Show Changes"}
              </button>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-3 rounded-xl border-2 transition-all duration-200 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 cursor-pointer ${
                  darkMode
                    ? "bg-slate-800 border-slate-600 hover:bg-slate-700 hover:border-slate-500"
                    : "bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300"
                }`}
                aria-label="Toggle dark mode"
                style={{
                  minWidth: 48,
                  minHeight: 48,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {darkMode ? (
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-yellow-300"
                  >
                    <circle cx="12" cy="12" r="5" fill="currentColor" />
                    <g stroke="currentColor">
                      <line x1="12" y1="1" x2="12" y2="3" />
                      <line x1="12" y1="21" x2="12" y2="23" />
                      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                      <line x1="1" y1="12" x2="3" y2="12" />
                      <line x1="21" y1="12" x2="23" y2="12" />
                      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                    </g>
                  </svg>
                ) : (
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-blue-700"
                  >
                    <path
                      d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z"
                      fill="currentColor"
                    />
                  </svg>
                )}
              </button>
            </div>
            <div className="sm:hidden flex items-center relative">
              <button
                className={`p-3 rounded-xl border-2 transition-all duration-200 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 cursor-pointer ${
                  darkMode
                    ? "bg-slate-800 border-slate-600 hover:bg-slate-700 hover:border-slate-500"
                    : "bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300"
                }`}
                aria-label="Open menu"
                onClick={() => setBurgerOpen((v) => !v)}
              >
                <svg
                  width="24"
                  height="24"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className={`${darkMode ? "text-blue-200" : "text-blue-700"}`}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
              {burgerOpen && (
                <>
                  <div
                    className="fixed inset-0 z-[300] bg-black bg-opacity-20 transition-opacity"
                    aria-hidden="true"
                  ></div>
                  <div
                    ref={burgerMenuRef}
                    className={`fixed right-4 top-[80px] z-[310] flex flex-col min-w-[200px] rounded-xl shadow-xl border ${
                      darkMode
                        ? "bg-slate-800 border-slate-600"
                        : "bg-white border-gray-200"
                    }`}
                    tabIndex={-1}
                    style={{ outline: "none" }}
                  >
                    <button
                      onClick={() => {
                        setDarkMode(!darkMode);
                        setBurgerOpen(false);
                      }}
                      className={`px-5 py-4 text-left font-semibold rounded-xl transition-all duration-200 active:scale-95 cursor-pointer ${
                        darkMode
                          ? "bg-slate-800 text-blue-200 hover:bg-slate-700"
                          : "bg-white text-blue-700 hover:bg-gray-50"
                      } flex items-center gap-3`}
                      aria-label={
                        darkMode
                          ? "Switch to light mode"
                          : "Switch to dark mode"
                      }
                    >
                      {darkMode ? (
                        <svg
                          width="22"
                          height="22"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-yellow-300"
                        >
                          <circle cx="12" cy="12" r="5" fill="currentColor" />
                          <g stroke="currentColor">
                            <line x1="12" y1="1" x2="12" y2="3" />
                            <line x1="12" y1="21" x2="12" y2="23" />
                            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                            <line x1="1" y1="12" x2="3" y2="12" />
                            <line x1="21" y1="12" x2="23" y2="12" />
                            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                          </g>
                        </svg>
                      ) : (
                        <svg
                          width="22"
                          height="22"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-blue-700"
                        >
                          <path
                            d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z"
                            fill="currentColor"
                          />
                        </svg>
                      )}
                      <span className="ml-2 font-semibold">
                        {darkMode ? "Light Mode" : "Dark Mode"}
                      </span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>
        <div className="flex flex-col lg:flex-row w-full max-w-[1600px] mx-auto gap-4 lg:gap-8 px-2 sm:px-4 md:px-6 box-border overflow-x-hidden flex-1 min-h-0">
          <div
            className={`w-full lg:w-1/4 border-b lg:border-b-0 lg:border-r lg:border-l transition-colors duration-300 relative z-10 rounded-2xl ${
              darkMode
                ? "border-[#3A4553] bg-gradient-to-b from-[#232B3E] to-[#1A2233]"
                : "border-[#D1D9E6] bg-gradient-to-b from-[#F6F8FB] to-[#E3EFFF]"
            }`}
            style={{
              boxShadow: darkMode
                ? "2px 0 20px 0 rgba(30,40,80,0.18), -2px 0 20px 0 rgba(30,40,80,0.18), inset -1px 0 0 rgba(255,255,255,0.03), inset 1px 0 0 rgba(255,255,255,0.03)"
                : "2px 0 20px 0 rgba(60,120,200,0.12), -2px 0 20px 0 rgba(60,120,200,0.12), inset -1px 0 0 rgba(255,255,255,0.4), inset 1px 0 0 rgba(255,255,255,0.4)",
              borderRadius: 16,
              margin: "8px 0 8px 0",
              padding: 0,
            }}
          >
            <div className="p-5 sm:p-6 md:p-7 h-full flex flex-col justify-start overflow-y-auto">
              <h2
                className={`text-xl font-black mb-6 tracking-wide uppercase letter-spacing-1 transition-colors duration-200 ${
                  darkMode ? "text-[#5B8CFF]" : "text-[#1A4DFF]"
                }`}
              >
                Document Sections
              </h2>
              <div className="space-y-3">
                {documentSectionsState.map((section) => (
                  <div
                    key={section.id}
                    onClick={() => {
                      setSelectedSection(section.id);
                      setSelectedComment(null);
                    }}
                    className={`p-4 rounded-xl cursor-pointer shadow-sm border transition-all duration-200 group relative ${
                      selectedSection === section.id
                        ? darkMode
                          ? "bg-blue-950 border-blue-700 text-blue-100 shadow-md"
                          : "bg-blue-50 border-blue-300 text-blue-900 shadow-md"
                        : darkMode
                        ? "bg-[#232B3E] border-[#2D3238] hover:bg-[#26304A] hover:border-blue-700"
                        : "bg-[#F8FAFB] border-[#E3E7EB] hover:bg-blue-50 hover:border-blue-300"
                    }`}
                    style={{
                      boxShadow:
                        selectedSection === section.id
                          ? darkMode
                            ? "0 2px 12px 0 rgba(60,80,180,0.10)"
                            : "0 2px 12px 0 rgba(80,140,255,0.10)"
                          : undefined,
                    }}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-lg">{section.title}</span>
                      <div className="flex items-center space-x-2">
                        {section.hasChanges && (
                          <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                        )}
                        <span
                          className={`text-xs px-2 py-1 rounded font-semibold ${
                            darkMode
                              ? "bg-[#26304A] text-blue-200"
                              : "bg-[#E3EFFF] text-blue-800"
                          }`}
                        >
                          v{section.version}
                        </span>
                      </div>
                    </div>
                    <p
                      className={`text-sm mt-1 leading-snug ${
                        selectedSection === section.id
                          ? darkMode
                            ? "text-blue-100"
                            : "text-blue-800"
                          : darkMode
                          ? "text-[#A0A4AA]"
                          : "text-[#7A869A]"
                      }`}
                    >
                      {section.content.join("\n").substring(0, 60)}...
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div
            className="w-full lg:w-1/2 flex flex-col justify-stretch order-2 lg:order-none rounded-2xl"
            style={{ margin: "8px 0 8px 0" }}
          >
            <div
              ref={documentRef}
              className={`flex-1 overflow-auto px-3 sm:px-6 md:px-8 py-4 sm:py-6 transition-colors duration-300 rounded-2xl shadow-xl ${
                darkMode
                  ? "bg-gradient-to-b from-[#232B3E] to-[#181C24] border border-[#3A4553]"
                  : "bg-gradient-to-b from-[#F6F8FB] to-[#E9F0FA] border border-[#D1D9E6]"
              }`}
              style={{
                borderRadius: 24,
                boxShadow: darkMode
                  ? "0 4px 40px 0 rgba(30,40,80,0.20), inset 0 1px 0 rgba(255,255,255,0.05)"
                  : "0 4px 40px 0 rgba(60,120,200,0.15), inset 0 1px 0 rgba(255,255,255,0.6)",
                margin: 0,
                minHeight: 0,
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-start",
              }}
            >
              {selectedSection && (
                <div className="relative">
                  <div className="mb-8">
                    <h1
                      className={`text-4xl font-black mb-3 tracking-tight leading-tight transition-colors duration-200 ${
                        darkMode ? "text-[#FFD86B]" : "text-[#1A2233]"
                      }`}
                    >
                      {
                        documentSectionsState.find((s) => s.id === selectedSection)
                          ?.title
                      }
                    </h1>
                    <div
                      className={`prose prose-lg max-w-none ${
                        darkMode ? "prose-invert" : ""
                      }`}
                    >
                      <div className="space-y-4">
                        {documentSectionsState.find((s) => s.id === selectedSection)
                          ?.content.map((point, index) => {
                            // Skip empty points in display but keep them in data structure
                            if (point.trim() === '') {
                              return null;
                            }
                            
                            // Calculate display number by counting non-empty points up to this index
                            const displayNumber = documentSectionsState.find((s) => s.id === selectedSection)
                              ?.content.slice(0, index + 1)
                              .filter(p => p.trim() !== '').length || index + 1;
                            
                            return (
                              <div key={index} className="flex items-start space-x-3" data-point-index={index}>
                                <span className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 ${
                                  darkMode 
                                    ? "bg-blue-900/30 text-blue-300 border-blue-700" 
                                    : "bg-blue-100 text-blue-700 border-blue-300"
                                }`}>
                                  {displayNumber}
                                </span>
                                <p className="text-lg leading-relaxed flex-1">
                                  {point}
                                </p>
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  </div>

                  {/* Text Selection Popup */}
                  {showEditPopup && (
                    <div
                      className={`absolute z-30 p-3 rounded-xl shadow-xl border backdrop-blur-sm ${
                        darkMode
                          ? "bg-slate-800/95 border-slate-600"
                          : "bg-white/95 border-gray-300"
                      }`}
                      style={{
                        left: editPopupPosition.x,
                        top: editPopupPosition.y - 10,
                        transform: "translateX(-50%) translateY(-100%)",
                        boxShadow: darkMode
                          ? "0 8px 32px 0 rgba(30,40,80,0.25)"
                          : "0 8px 32px 0 rgba(60,120,200,0.15)",
                      }}
                    >
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={startEditing}
                          className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 active:scale-95 border shadow-md cursor-pointer ${
                            darkMode
                              ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white border-blue-500 hover:from-blue-500 hover:to-blue-600"
                              : "bg-gradient-to-r from-blue-500 to-blue-600 text-white border-blue-400 hover:from-blue-400 hover:to-blue-500"
                          }`}
                          title="Edit selected text"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                          </svg>
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={startCommenting}
                          className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 active:scale-95 border shadow-md cursor-pointer ${
                            darkMode
                              ? "bg-gradient-to-r from-purple-600 to-purple-700 text-white border-purple-500 hover:from-purple-500 hover:to-purple-600"
                              : "bg-gradient-to-r from-purple-500 to-purple-600 text-white border-purple-400 hover:from-purple-400 hover:to-purple-500"
                          }`}
                          title="Add comment for selected text"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                          </svg>
                          <span>Comment</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Inline Text Editor */}
                  {isEditing && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                      <div className={`max-w-2xl w-full mx-4 p-6 rounded-xl shadow-2xl ${
                        darkMode
                          ? "bg-slate-800 border border-slate-600"
                          : "bg-white border border-gray-200"
                      }`}>
                        <div className="flex items-center justify-between mb-4">
                          <h3 className={`text-lg font-semibold ${
                            darkMode ? "text-white" : "text-gray-900"
                          }`}>
                            Edit Text
                          </h3>
                          <button
                            onClick={cancelEdit}
                            className={`p-2 rounded-lg transition-colors cursor-pointer ${
                              darkMode
                                ? "hover:bg-slate-700 text-slate-400"
                                : "hover:bg-gray-100 text-gray-500"
                            }`}
                          >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <line x1="18" y1="6" x2="6" y2="18"></line>
                              <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                          </button>
                        </div>
                        <div className="mb-4">
                          <label className={`block text-sm font-medium mb-2 ${
                            darkMode ? "text-slate-300" : "text-gray-700"
                          }`}>
                            Selected text:
                          </label>
                          <textarea
                            value={editingText}
                            onChange={(e) => setEditingText(e.target.value)}
                            className={`w-full h-32 p-3 rounded-lg border resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                              darkMode
                                ? "bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                                : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                            }`}
                            placeholder="Enter your text..."
                          />
                        </div>
                        <div className="flex justify-end space-x-3">
                          <button
                            onClick={cancelEdit}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer ${
                              darkMode
                                ? "bg-slate-600 text-slate-200 hover:bg-slate-500"
                                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                            }`}
                          >
                            Cancel
                          </button>
                          <button
                            onClick={saveEdit}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors cursor-pointer"
                          >
                            Save Changes
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {showDraggableComments &&
                    comments
                      .filter(
                        (comment) => comment.sectionId === selectedSection
                      )
                      .map((comment) => {
                        const isPinnedAndCollapsed = comment.isPinned && !expandedPinnedComments.has(comment.id);
                        
                        if (isPinnedAndCollapsed) {
                          // Render pin dot for collapsed pinned comments
                          const originalPos = calculatePinDotPosition(comment);
                          const adjustedPos = adjustPinDotPosition(originalPos, comment.id);
                          const isRepositioned = originalPos.x !== adjustedPos.x || originalPos.y !== adjustedPos.y;
                          
                          return (
                            <React.Fragment key={comment.id}>
                              {/* Connection line if pin dot was repositioned */}
                              {isRepositioned && (
                                <svg
                                  className="absolute pointer-events-none z-10"
                                  style={{
                                    left: Math.min(originalPos.x, adjustedPos.x),
                                    top: Math.min(originalPos.y, adjustedPos.y),
                                    width: Math.abs(adjustedPos.x - originalPos.x) + 24,
                                    height: Math.abs(adjustedPos.y - originalPos.y) + 24,
                                  }}
                                >
                                  <line
                                    x1={originalPos.x - Math.min(originalPos.x, adjustedPos.x)}
                                    y1={originalPos.y - Math.min(originalPos.y, adjustedPos.y)}
                                    x2={adjustedPos.x - Math.min(originalPos.x, adjustedPos.x)}
                                    y2={adjustedPos.y - Math.min(originalPos.y, adjustedPos.y)}
                                    stroke={darkMode ? "#FCD34D" : "#F59E0B"}
                                    strokeWidth="1"
                                    strokeDasharray="2,2"
                                    opacity="0.6"
                                  />
                                </svg>
                              )}
                              
                              {/* Pin dot */}
                              <div
                                data-comment-id={comment.id}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  expandPinnedComment(comment.id);
                                  // Don't auto-select when expanding from pin dot to allow normal opacity behavior
                                  if (selectedComment?.id === comment.id) {
                                    setSelectedComment(null);
                                  }
                                }}
                                className={`absolute w-6 h-6 rounded-full cursor-pointer flex items-center justify-center transition-all duration-300 hover:scale-125 z-20 animate-pulse-pin ${
                                  darkMode 
                                    ? "bg-yellow-800 border-2 border-yellow-600 text-yellow-300 shadow-lg shadow-yellow-600/30" 
                                    : "bg-yellow-400 border-2 border-yellow-500 text-yellow-800 shadow-lg shadow-yellow-400/30"
                                }${isRepositioned ? ' ring-2 ring-yellow-400/50' : ''}`}
                                style={{
                                  left: adjustedPos.x,
                                  top: adjustedPos.y,
                                }}
                                title={`Pinned comment by ${comment.author.name}${
                                  comment.endPointIndex !== undefined 
                                    ? ` (spans multiple points)` 
                                    : ''
                                }${isRepositioned ? ' (repositioned to avoid overlap)' : ''}`}
                              >
                                <PiPushPinFill size={12} />
                              </div>
                            </React.Fragment>
                          );
                        }

                        // Render full comment card
                        return (
                          <div
                            key={comment.id}
                            data-comment-id={comment.id}
                            onMouseDown={(e) => {
                              // Don't start dragging if clicking on the collapse button, delete button, pin button, or if it's a pin dot click
                              if ((e.target as HTMLElement).closest('.collapse-button') || 
                                  (e.target as HTMLElement).closest('.delete-button') ||
                                  (e.target as HTMLElement).closest('.pin-button') ||
                                  (e.target as HTMLElement).closest('.pin-dot-click')) {
                                return;
                              }
                              handleCommentMouseDown(e, comment);
                            }}
                            onClick={(e) => {
                              // Check if clicked on the collapse button or pin button
                              if ((e.target as HTMLElement).closest('.collapse-button') || (e.target as HTMLElement).closest('.pin-button')) {
                                return;
                              }
                              
                              // Handle pin dot collapse click
                              if ((e.target as HTMLElement).closest('.pin-dot-click')) {
                                e.stopPropagation();
                                collapsePinnedComment(comment.id);
                                setSelectedComment(null);
                                return;
                              }
                              
                              if (comment.isPinned) {
                                if (expandedPinnedComments.has(comment.id)) {
                                  // If already expanded, either select it or toggle back to pin dot
                                  if (selectedComment?.id === comment.id) {
                                    // If already selected, collapse back to pin dot
                                    collapsePinnedComment(comment.id);
                                    setSelectedComment(null);
                                  } else {
                                    // If not selected, select it for interaction
                                    setSelectedComment(comment);
                                    handlePinnedCommentInteraction(comment.id);
                                  }
                                } else {
                                  // Just expand, don't select to allow normal opacity behavior
                                  handlePinnedCommentInteraction(comment.id);
                                }
                              } else {
                                setSelectedComment(comment);
                              }
                            }}
                            onMouseEnter={() => {
                              if (comment.isPinned) {
                                handlePinnedCommentInteraction(comment.id);
                              }
                            }}
                            className={`absolute ${comment.isPinned ? 'cursor-pointer' : 'cursor-move'} p-5 rounded-2xl shadow-xl border-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 z-20 ${
                              comment.isPinned && expandedPinnedComments.has(comment.id)
                                ? "animate-in zoom-in-95 duration-300"
                                : ""
                            } ${
                              draggedCommentId === comment.id
                                ? "opacity-100"
                                : selectedComment?.id === comment.id
                                ? "opacity-100 hover:shadow-2xl scale-105 transition-all duration-300"
                                : "opacity-30 hover:opacity-100 hover:shadow-2xl hover:scale-105 transition-all duration-300"
                            } ${
                            darkMode
                              ? "bg-[#23272B] border-blue-900 text-[#E6EAF2]"
                              : "bg-white border-blue-300 text-[#1A2233]"
                          }${
                            draggedCommentId === comment.id
                              ? " pointer-events-none"
                              : ""
                            }${
                              comment.isPinned
                                ? darkMode
                                  ? " border-yellow-600 shadow-yellow-600/20"
                                  : " border-yellow-400 shadow-yellow-400/20"
                              : ""
                          }`}
                          style={{
                            left:
                              draggedCommentId === comment.id &&
                              dragPosRef.current
                                ? (() => {
                                    const constrainedPos = constrainCommentPosition(dragPosRef.current!);
                                    return constrainedPos.x;
                                  })()
                                : comment.isPinned && comment.anchoredToPointIndex !== undefined
                                ? (() => {
                                    const pinPos = calculatePinDotPosition(comment);
                                    const constrainedPos = constrainCommentPosition(pinPos);
                                    return constrainedPos.x;
                                  })()
                                : (() => {
                                    const constrainedPos = constrainCommentPosition(comment.position);
                                    return constrainedPos.x;
                                  })(),
                            top:
                              draggedCommentId === comment.id &&
                              dragPosRef.current
                                ? (() => {
                                    const constrainedPos = constrainCommentPosition(dragPosRef.current!);
                                    return constrainedPos.y;
                                  })()
                                : comment.isPinned && comment.anchoredToPointIndex !== undefined
                                ? (() => {
                                    const pinPos = calculatePinDotPosition(comment);
                                    const constrainedPos = constrainCommentPosition(pinPos);
                                    return constrainedPos.y;
                                  })()
                                : (() => {
                                    const constrainedPos = constrainCommentPosition(comment.position);
                                    return constrainedPos.y;
                                  })(),
                            width: "320px",
                            zIndex: draggedCommentId === comment.id ? 999 : 20,
                            boxShadow: darkMode
                              ? "0 4px 24px 0 rgba(60,80,180,0.18)"
                              : "0 4px 24px 0 rgba(80,140,255,0.12)",
                          }}
                          tabIndex={0}
                        >
                          {/* Comment Position Indicator - always visible */}
                          <div className={`absolute -top-2 -right-2 w-4 h-4 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all duration-300 ${
                            selectedComment?.id === comment.id
                              ? "opacity-100"
                              : "opacity-60"
                          } ${getStatusColor(comment.status)} border-white shadow-md`}>
                          </div>
                          
                          {/* Pin Indicator */}
                          {comment.isPinned && (
                            <div 
                              className={`pin-dot-click absolute -top-2 -left-2 w-4 h-4 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all duration-300 cursor-pointer hover:scale-110 ${
                                darkMode 
                                  ? "bg-yellow-800 text-yellow-300 border-yellow-600" 
                                  : "bg-yellow-400 text-yellow-800 border-yellow-500"
                              } border-white shadow-md`}
                              onClick={(e) => {
                                e.stopPropagation();
                                collapsePinnedComment(comment.id);
                                setSelectedComment(null);
                              }}
                              title="Click to collapse to pin dot"
                            >
                              <PiPushPinFill size={10} />
                            </div>
                          )}
                          
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center space-x-3">
                              <div
                                className={`w-9 h-9 rounded-full flex items-center justify-center text-base font-bold shadow-sm border-2 ${
                                  darkMode
                                    ? "bg-blue-900 text-blue-200 border-blue-700"
                                    : "bg-blue-100 text-blue-800 border-blue-300"
                                }`}
                              >
                                {comment.author.avatar}
                              </div>
                              <div>
                                <p className="font-semibold text-base">
                                  {comment.author.name}
                                </p>
                                <p
                                  className={`text-xs ${
                                    darkMode
                                      ? "text-[#A0A4AA]"
                                      : "text-[#7A869A]"
                                  }`}
                                >
                                  {comment.timestamp.toLocaleTimeString()}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <div
                                className={`w-3 h-3 rounded-full mt-1 ${getStatusColor(
                                  comment.status
                                )}`}
                              ></div>
                              <button
                                className={`pin-button p-1 rounded-full transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 cursor-pointer ${
                                  comment.isPinned
                                    ? darkMode
                                      ? "bg-yellow-800/30 text-yellow-400 hover:bg-yellow-800/50"
                                      : "bg-yellow-100/70 text-yellow-600 hover:bg-yellow-200/70"
                                    : darkMode
                                      ? "hover:bg-blue-800/30 text-slate-400 hover:text-slate-200"
                                      : "hover:bg-blue-100/70 text-slate-600 hover:text-slate-800"
                                }`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleCommentPin(comment.id);
                                  // Blur the button to remove any focus states
                                  (e.target as HTMLElement).blur();
                                }}
                                aria-label={comment.isPinned ? "Unpin comment" : "Pin comment"}
                              >
                                {comment.isPinned ? (
                                  <PiPushPinSlashFill size={16} />
                                ) : (
                                  <PiPushPinFill size={16} />
                                )}
                              </button>
                              <button
                                className={`collapse-button p-1 rounded-full transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 cursor-pointer ${
                                  darkMode 
                                    ? "hover:bg-blue-800/30" 
                                    : "hover:bg-blue-100/70"
                                }`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleCommentCollapse(comment.id);
                                }}
                                aria-label={collapsedComments.has(comment.id) ? "Expand comment" : "Collapse comment"}
                              >
                                {collapsedComments.has(comment.id) ? (
                                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="12" y1="5" x2="12" y2="19"></line>
                                    <line x1="5" y1="12" x2="19" y2="12"></line>
                                  </svg>
                                ) : (
                                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="5" y1="12" x2="19" y2="12"></line>
                                  </svg>
                                )}
                              </button>
                              {comment.author.id === users[0].id && (
                                <button
                                  className={`delete-button p-1 rounded-full transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400 cursor-pointer ${
                                    darkMode 
                                      ? "hover:bg-red-800/30 text-red-400" 
                                      : "hover:bg-red-100/70 text-red-600"
                                  }`}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    console.log('Delete button clicked for comment:', comment.id);
                                    deleteComment(comment.id);
                                  }}
                                  aria-label="Delete comment"
                                >
                                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M3 6h18"></path>
                                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                                  </svg>
                                </button>
                              )}
                            </div>
                          </div>
                          {!collapsedComments.has(comment.id) && (
                            <>
                              <p className="text-sm mb-3 leading-snug font-medium">
                                {comment.content}
                              </p>
                              <div className="flex items-center justify-between mt-2">
                                <div className="flex space-x-1">
                                  {comment.mentions.map((mention) => (
                                    <span
                                      key={mention}
                                      className={`px-2 py-1 rounded text-xs font-semibold shadow-sm ${
                                        darkMode
                                          ? "bg-blue-900 text-blue-200"
                                          : "bg-blue-50 text-blue-800"
                                      }`}
                                    >
                                      @{mention}
                                    </span>
                                  ))}
                                </div>
                                <select
                                  value={comment.status}
                                  onChange={(e) =>
                                    updateCommentStatus(
                                      comment.id,
                                      e.target.value as Comment["status"]
                                    )
                                  }
                                  className={`text-xs rounded px-2 py-1 border font-semibold shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 transition-all duration-200 ${
                                    darkMode
                                      ? "bg-[#232B3E] border-blue-900 text-blue-200"
                                      : "bg-white border-blue-200 text-blue-800"
                                  }`}
                                >
                                  <option value="open">Open</option>
                                  <option value="pending">Pending</option>
                                  <option value="resolved">Resolved</option>
                                </select>
                              </div>
                            </>
                          )}
                        </div>
                      );
                    })}
                </div>
              )}
            </div>
          </div>
          <div
            className={`w-full lg:w-1/4 border-t lg:border-t-0 lg:border-l lg:border-r transition-colors duration-300 relative z-10 rounded-2xl ${
              darkMode
                ? "border-[#3A4553] bg-gradient-to-b from-[#232B3E] to-[#1A2233]"
                : "border-[#D1D9E6] bg-gradient-to-b from-[#F6F8FB] to-[#E3EFFF]"
            }`}
            style={{
              boxShadow: darkMode
                ? "-2px 0 20px 0 rgba(30,40,80,0.18), 2px 0 20px 0 rgba(30,40,80,0.18), inset 1px 0 0 rgba(255,255,255,0.03), inset -1px 0 0 rgba(255,255,255,0.03)"
                : "-2px 0 20px 0 rgba(60,120,200,0.12), 2px 0 20px 0 rgba(60,120,200,0.12), inset 1px 0 0 rgba(255,255,255,0.4), inset -1px 0 0 rgba(255,255,255,0.4)",
              borderRadius: 16,
              margin: "8px 0 8px 0",
              padding: 0,
            }}
          >
            <div className="p-5 sm:p-6 md:p-7 h-full flex flex-col justify-start overflow-y-auto">
              <div className="mb-6 flex-shrink-0">
                <div className="flex items-center space-x-3 mb-2">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    darkMode ? "bg-gradient-to-br from-blue-600 to-blue-700" : "bg-gradient-to-br from-blue-500 to-blue-600"
                  }`}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                    </svg>
                  </div>
                  <div>
                    <h2
                      className={`text-xl font-black tracking-wide uppercase letter-spacing-1 transition-colors duration-200 ${
                        darkMode ? "text-[#FFD86B]" : "text-[#1A4DFF]"
                      }`}
                    >
                      Feedback
                    </h2>
                    <p className={`text-xs ${
                      darkMode ? "text-[#A0A4AA]" : "text-[#7A869A]"
                    }`}>
                      Manage annotations & reviews
                    </p>
                  </div>
                </div>
                <div className="ml-13">
                  <span className={`text-xs px-3 py-1.5 rounded-full font-semibold shadow-sm ${
                    darkMode ? "bg-blue-900/50 text-blue-200 border border-blue-700" : "bg-blue-100 text-blue-800 border border-blue-200"
                  }`}>
                    {comments.filter(c => c.sectionId === selectedSection).length} annotations
                  </span>
                </div>
              </div>
              <div className="mb-7 flex-shrink-0">
                <textarea
                  ref={commentInputRef}
                  value={newComment}
                  onChange={handleMentionInput}
                  placeholder="Add a comment... Use @ to mention someone"
                  className={`w-full p-3 rounded-xl border resize-none transition-colors duration-200 shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-400 font-medium ${
                    darkMode
                      ? "bg-gradient-to-r from-[#232B3E] to-[#26304A] border-[#2D3238] text-[#E3E7EB] placeholder-[#7A869A]"
                      : "bg-gradient-to-r from-[#F8FAFB] to-[#E3EFFF] border-[#E3E7EB] text-[#23272B] placeholder-[#7A869A]"
                  }`}
                  rows={3}
                />
                {showMentionSuggestions && (
                  <div
                    className={`mt-2 rounded-xl border shadow-lg font-medium ${
                      darkMode
                        ? "bg-gradient-to-r from-[#232B3E] to-[#26304A] border-[#2D3238]"
                        : "bg-gradient-to-r from-[#F8FAFB] to-[#E3EFFF] border-[#E3E7EB]"
                    }`}
                  >
                    {filteredUsers.map((user) => (
                      <button
                        key={user.id}
                        onClick={() => insertMention(user.name)}
                        className={`w-full p-2 text-left hover:bg-blue-600 hover:text-white dark:hover:bg-blue-900 transition-colors duration-200 flex items-center space-x-2 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 cursor-pointer`}
                      >
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shadow-sm border-2 ${
                            darkMode
                              ? "bg-blue-900 text-blue-200 border-blue-700"
                              : "bg-blue-100 text-blue-800 border-blue-300"
                          }`}
                        >
                          {user.avatar}
                        </div>
                        <div>
                          <p className="font-semibold text-sm">{user.name}</p>
                          <p
                            className={`text-xs ${
                              darkMode ? "text-[#A0A4AA]" : "text-[#7A869A]"
                            }`}
                          >
                            {user.role}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
                <button
                  onClick={addComment}
                  disabled={!newComment.trim() || !selectedSection}
                  className={`w-full mt-3 px-4 py-2 rounded-xl font-semibold transition-all duration-200 shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-400 active:scale-95 ${
                    newComment.trim() && selectedSection
                      ? `cursor-pointer ${darkMode
                        ? "bg-pink-700 text-white hover:bg-pink-600"
                        : "bg-pink-600 text-white hover:bg-pink-700"}`
                      : `cursor-not-allowed ${darkMode
                      ? "bg-[#2D3238] text-[#7A869A]"
                      : "bg-[#E3E7EB] text-[#A0A4AA]"}`
                  }`}
                >
                  Add Comment
                </button>
              </div>
              <div className="space-y-5 flex-1 overflow-y-auto">
                {/* Filter Controls */}
                <div className={`p-4 rounded-xl border shadow-sm ${
                  darkMode ? "bg-gradient-to-br from-[#232B3E] to-[#1A2233] border-[#2D3238]" : "bg-gradient-to-br from-[#F8FAFB] to-[#E3EFFF] border-[#E3E7EB]"
                }`}>
                  <div className="flex items-center space-x-2 mb-4">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`${
                      darkMode ? "text-blue-400" : "text-blue-600"
                    }`}>
                      <polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46"/>
                    </svg>
                    <h3 className="font-bold text-sm tracking-wide uppercase letter-spacing-1 transition-colors duration-200">
                      Filter & Sort
                    </h3>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-semibold mb-2 block">Status Filter:</label>
                      <div className="flex flex-wrap gap-1">
                        {["all", "open", "pending", "resolved"].map((status) => (
                          <button
                            key={status}
                            onClick={() => setStatusFilter(status === "all" ? null : status as Comment["status"])}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 shadow-sm cursor-pointer ${
                              statusFilter === (status === "all" ? null : status)
                                ? darkMode
                                  ? "bg-blue-600 text-white shadow-blue-600/25"
                                  : "bg-blue-600 text-white shadow-blue-600/25"
                                : darkMode
                                ? "bg-[#2D3238] text-[#A0A4AA] hover:bg-[#26304A] border border-[#2D3238]"
                                : "bg-white text-[#7A869A] hover:bg-blue-50 border border-[#E3E7EB]"
                            }`}
                          >
                            {status === "all" ? "All" : status.charAt(0).toUpperCase() + status.slice(1)}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-semibold mb-2 block">Sort by:</label>
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className={`w-full text-xs rounded-lg px-3 py-1.5 border font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 transition-colors duration-200 ${
                          darkMode
                            ? "bg-[#232B3E] border-[#2D3238] text-[#E6EAF2] hover:border-blue-600"
                            : "bg-white border-[#E3E7EB] text-[#1A2233] hover:border-blue-400"
                        }`}
                      >
                        <option value="timestamp">Newest First</option>
                        <option value="timestamp-asc">Oldest First</option>
                        <option value="status">Status</option>
                        <option value="author">Author</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Statistics */}
                <div className={`p-4 rounded-xl border shadow-sm ${
                  darkMode ? "bg-gradient-to-br from-[#232B3E] to-[#1A2233] border-[#2D3238]" : "bg-gradient-to-br from-[#F8FAFB] to-[#E3EFFF] border-[#E3E7EB]"
                }`}>
                  <div className="flex items-center space-x-2 mb-4">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`${
                      darkMode ? "text-green-400" : "text-green-600"
                    }`}>
                      <line x1="18" y1="20" x2="18" y2="10"/>
                      <line x1="12" y1="20" x2="12" y2="4"/>
                      <line x1="6" y1="20" x2="6" y2="14"/>
                    </svg>
                    <h3 className="font-bold text-sm tracking-wide uppercase letter-spacing-1 transition-colors duration-200">
                      Statistics
                    </h3>
                  </div>
                  <div className="flex gap-3">
                    <div className={`flex-1 text-center p-3 rounded-lg border ${
                      darkMode ? "bg-blue-900/20 border-blue-700/50" : "bg-blue-50 border-blue-200"
                    }`}>
                      <div className={`text-2xl font-bold mb-1 ${
                        darkMode ? "text-blue-400" : "text-blue-600"
                      }`}>
                        {comments.filter(c => c.sectionId === selectedSection && c.status === "open").length}
                      </div>
                      <div className={`text-xs font-semibold ${
                        darkMode ? "text-blue-300" : "text-blue-700"
                      }`}>Open</div>
                    </div>
                    <div className={`flex-1 text-center p-3 rounded-lg border ${
                      darkMode ? "bg-yellow-900/20 border-yellow-700/50" : "bg-yellow-50 border-yellow-200"
                    }`}>
                      <div className={`text-2xl font-bold mb-1 ${
                        darkMode ? "text-yellow-400" : "text-yellow-600"
                      }`}>
                        {comments.filter(c => c.sectionId === selectedSection && c.status === "pending").length}
                      </div>
                      <div className={`text-xs font-semibold ${
                        darkMode ? "text-yellow-300" : "text-yellow-700"
                      }`}>Pending</div>
                    </div>
                    <div className={`flex-1 text-center p-3 rounded-lg border ${
                      darkMode ? "bg-green-900/20 border-green-700/50" : "bg-green-50 border-green-200"
                    }`}>
                      <div className={`text-2xl font-bold mb-1 ${
                        darkMode ? "text-green-400" : "text-green-600"
                      }`}>
                        {comments.filter(c => c.sectionId === selectedSection && c.status === "resolved").length}
                      </div>
                      <div className={`text-xs font-semibold ${
                        darkMode ? "text-green-300" : "text-green-700"
                      }`}>Resolved</div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`${
                      darkMode ? "text-purple-400" : "text-purple-600"
                    }`}>
                      <path d="M9 12l2 2 4-4"/>
                      <path d="M21 12c-1 0-2-1-2-2s1-2 2-2 2 1 2 2-1 2-2 2z"/>
                      <path d="M3 12c1 0 2-1 2-2s-1-2-2-2-2 1-2 2 1 2 2 2z"/>
                    </svg>
                    <h3 className="font-bold text-base tracking-wide uppercase letter-spacing-1 transition-colors duration-200">
                      Annotations ({filteredComments.length})
                    </h3>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      {["open", "pending", "resolved"].map((status) => (
                        <div
                          key={status}
                          className={`w-2.5 h-2.5 rounded-full ${getStatusColor(
                            status as Comment["status"]
                          )}`}
                          title={getStatusText(status as Comment["status"])}
                        />
                      ))}
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                      darkMode ? "bg-purple-900/50 text-purple-200" : "bg-purple-100 text-purple-800"
                    }`}>
                      {filteredComments.length}
                    </span>
                  </div>
                </div>
                {filteredComments.map((comment) => (
                  <div
                    key={comment.id}
                    onClick={() => {
                      scrollToComment(comment.id);
                    }}
                    className={`p-4 rounded-xl cursor-pointer transition-all duration-200 shadow-md border group relative ${
                      selectedComment?.id === comment.id
                        ? darkMode
                          ? "bg-blue-950 border-blue-700 text-blue-100 shadow-lg"
                          : "bg-blue-50 border-blue-300 text-blue-900 shadow-lg"
                        : darkMode
                        ? "bg-[#232B3E] border-[#2D3238] hover:bg-[#26304A] hover:border-blue-700"
                        : "bg-[#F8FAFB] border-[#E3E7EB] hover:bg-blue-50 hover:border-blue-300"
                    }`}
                    style={{
                      boxShadow:
                        selectedComment?.id === comment.id
                          ? darkMode
                            ? "0 2px 12px 0 rgba(60,80,180,0.10)"
                            : "0 2px 12px 0 rgba(80,140,255,0.10)"
                          : undefined,
                    }}
                    tabIndex={0}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shadow-sm border-2 ${
                            darkMode
                              ? "bg-blue-900 text-blue-200 border-blue-700"
                              : "bg-blue-100 text-blue-800 border-blue-300"
                          }`}
                        >
                          {comment.author.avatar}
                        </div>
                        <span className="font-semibold text-sm">
                          {comment.author.name}
                        </span>
                      </div>
                      <div
                        className={`w-2 h-2 rounded-full mt-1 ${getStatusColor(
                          comment.status
                        )}`}
                      ></div>
                    </div>
                    <p className="text-sm mb-2 line-clamp-2 font-medium">
                      {comment.content}
                    </p>
                    <div className="flex items-center justify-between mt-1">
                      <span
                        className={`text-xs font-semibold ${
                          selectedComment?.id === comment.id
                            ? darkMode
                              ? "text-blue-100"
                              : "text-blue-700"
                            : darkMode
                            ? "text-[#A0A4AA]"
                            : "text-[#7A869A]"
                        }`}
                      >
                        {comment.timestamp.toLocaleDateString()}
                      </span>
                      <span
                        className={`text-xs px-2 py-1 rounded font-semibold shadow-sm ${
                          darkMode
                            ? "bg-[#26304A] text-blue-200"
                            : "bg-[#E3EFFF] text-blue-800"
                        }`}
                      >
                        {
                          documentSectionsState.find(
                            (s) => s.id === comment.sectionId
                          )?.title
                        }
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Version Changes Modal */}
      {showVersionModal && (
        <div className="fixed inset-0 z-[1100] flex items-center justify-center p-4 overflow-hidden">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-pointer"
            onClick={() => setShowVersionModal(false)}
          />
          <div className={`relative w-full max-w-2xl max-h-[80vh] overflow-y-auto rounded-2xl shadow-2xl border z-[1101] ${
            darkMode 
              ? "bg-gradient-to-b from-[#1A2233] to-[#0F1419] border-slate-600 text-white" 
              : "bg-gradient-to-b from-white to-[#F8FAFC] border-slate-300 text-slate-900"
          }`}>
            <div className={`sticky top-0 p-6 border-b rounded-t-2xl backdrop-blur-sm z-[1102] ${
              darkMode 
                ? "border-slate-600 bg-[#1A2233]/95" 
                : "border-slate-300 bg-white/95"
            }`}>
              <div className="flex items-center justify-between">
                <h2 className={`text-2xl font-black tracking-tight ${
                  darkMode ? "text-slate-100" : "text-slate-900"
                }`}>
                  Version Changes
                </h2>
                <button
                  onClick={() => setShowVersionModal(false)}
                  className={`p-2 rounded-xl transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 cursor-pointer z-[1103] ${
                    darkMode 
                      ? "hover:bg-slate-700 text-slate-300 hover:text-white" 
                      : "hover:bg-slate-100 text-slate-600 hover:text-slate-900"
                  }`}
                  aria-label="Close modal"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
              <p className={`text-sm mt-2 ${
                darkMode ? "text-slate-400" : "text-slate-600"
              }`}>
                Showing changes for: {documentSectionsState.find(s => s.id === selectedSection)?.title}
              </p>
            </div>
            
            <div className="p-6 space-y-4 relative z-[1101]">
              {versionChanges
                .filter(change => change.sectionId === selectedSection)
                .map(change => (
                  <div key={change.id} className={`p-5 rounded-xl border shadow-lg ${
                    change.type === "added"
                      ? darkMode 
                        ? "bg-green-950/30 border-green-800/50 text-green-200" 
                        : "bg-green-50 border-green-300 text-green-900"
                      : change.type === "removed"
                      ? darkMode 
                        ? "bg-red-950/30 border-red-800/50 text-red-200" 
                        : "bg-red-50 border-red-300 text-red-900"
                      : darkMode 
                        ? "bg-amber-950/30 border-amber-800/50 text-amber-200" 
                        : "bg-amber-50 border-amber-300 text-amber-900"
                  }`}>
                    <div className="flex items-center gap-3 mb-3">
                      {change.type === "added" && (
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          darkMode 
                            ? "bg-green-900/40 text-green-400" 
                            : "bg-green-200 text-green-700"
                        }`}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="12" y1="5" x2="12" y2="19" />
                            <line x1="5" y1="12" x2="19" y2="12" />
                          </svg>
                        </div>
                      )}
                      {change.type === "removed" && (
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          darkMode 
                            ? "bg-red-900/40 text-red-400" 
                            : "bg-red-200 text-red-700"
                        }`}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="5" y1="12" x2="19" y2="12" />
                          </svg>
                        </div>
                      )}
                      {change.type === "modified" && (
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          darkMode 
                            ? "bg-amber-900/40 text-amber-400" 
                            : "bg-amber-200 text-amber-700"
                        }`}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                            <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                          </svg>
                        </div>
                      )}
                      <div>
                        <h3 className={`font-bold text-lg capitalize ${
                          change.type === "added" 
                            ? darkMode ? "text-green-300" : "text-green-800"
                            : change.type === "removed"
                            ? darkMode ? "text-red-300" : "text-red-800"
                            : darkMode ? "text-amber-300" : "text-amber-800"
                        }`}>
                          {change.type} Content
                        </h3>
                        <p className={`text-sm ${
                          change.type === "added" 
                            ? darkMode ? "text-green-400" : "text-green-700"
                            : change.type === "removed"
                            ? darkMode ? "text-red-400" : "text-red-700"
                            : darkMode ? "text-amber-400" : "text-amber-700"
                        }`}>
                          {change.content}
                        </p>
                      </div>
                    </div>
                    
                    {/* Version Comparison Overlay */}
                    <div className={`p-4 rounded-lg border ${
                        darkMode ? "bg-slate-900/50 border-slate-700" : "bg-slate-50 border-slate-200"
                    }`}>
                      <div className="flex items-center justify-between mb-3">
                          <h4 className={`font-semibold text-sm ${
                            darkMode ? "text-slate-200" : "text-slate-800"
                          }`}>Version Comparison</h4>
                          <span className={`text-xs px-3 py-1.5 rounded-full font-semibold ${
                          change.type === "added" 
                              ? darkMode ? "bg-green-900/70 text-green-300" : "bg-green-200 text-green-800"
                            : change.type === "removed"
                              ? darkMode ? "bg-red-900/70 text-red-300" : "bg-red-200 text-red-800"
                              : darkMode ? "bg-amber-900/70 text-amber-300" : "bg-amber-200 text-amber-800"
                        }`}>
                            Point {change.pointNumber}
                        </span>
                      </div>
                      
                      <div className="space-y-4">
                        {change.type === "added" && (
                          <div className="space-y-2">
                            <div className="flex items-start gap-3">
                                                             <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                                 darkMode 
                                   ? "bg-green-900/40 text-green-400" 
                                   : "bg-green-200 text-green-800"
                               }`}>
                                 <span className="text-sm font-bold">
                                   {change.pointNumber}
                                 </span>
                              </div>
                              <div className="flex-1">
                                 <div className={`p-4 rounded-lg border-l-4 ${
                                   darkMode 
                                     ? "bg-green-950/20 border-green-700/60 text-green-200" 
                                     : "bg-green-50 border-green-400 text-green-900"
                                }`}>
                                   <div className="flex items-center gap-2 mb-2">
                                     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`${
                                       darkMode ? "text-green-500" : "text-green-600"
                                     }`}>
                                       <line x1="12" y1="5" x2="12" y2="19" />
                                       <line x1="5" y1="12" x2="19" y2="12" />
                                     </svg>
                                     <span className="font-semibold text-sm">Added to Point {change.pointNumber}</span>
                                   </div>
                                  <p className="text-sm leading-relaxed">{change.newContent}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                        
                        {change.type === "removed" && (
                          <div className="space-y-2">
                            <div className="flex items-start gap-3">
                                                             <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                                 darkMode 
                                   ? "bg-red-900/40 text-red-400" 
                                   : "bg-red-200 text-red-800"
                               }`}>
                                 <span className="text-sm font-bold">
                                   {change.pointNumber}
                                 </span>
                              </div>
                              <div className="flex-1">
                                 <div className={`p-4 rounded-lg border-l-4 ${
                                   darkMode 
                                     ? "bg-red-950/20 border-red-700/60 text-red-200" 
                                     : "bg-red-50 border-red-400 text-red-900"
                                }`}>
                                   <div className="flex items-center gap-2 mb-2">
                                     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`${
                                       darkMode ? "text-red-500" : "text-red-600"
                                     }`}>
                                       <line x1="5" y1="12" x2="19" y2="12" />
                                     </svg>
                                     <span className="font-semibold text-sm">Removed from Point {change.pointNumber}</span>
                                   </div>
                                  <p className="text-sm leading-relaxed line-through opacity-75">{change.oldContent}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                        
                        {change.type === "modified" && (
                          <div className="space-y-3">
                            <div className="flex items-start gap-3">
                                                             <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                                 darkMode 
                                   ? "bg-amber-900/40 text-amber-400" 
                                   : "bg-amber-200 text-amber-800"
                               }`}>
                                 <span className="text-sm font-bold">
                                   {change.pointNumber}
                                 </span>
                              </div>
                              <div className="flex-1">
                                 <div className={`p-4 rounded-lg border-l-4 ${
                                   darkMode 
                                     ? "bg-red-950/20 border-red-700/60 text-red-200" 
                                     : "bg-red-50 border-red-400 text-red-900"
                                }`}>
                                   <div className="flex items-center gap-2 mb-2">
                                     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`${
                                       darkMode ? "text-red-500" : "text-red-600"
                                     }`}>
                                       <line x1="5" y1="12" x2="19" y2="12" />
                                     </svg>
                                     <span className="font-semibold text-sm">Previous Version (Point {change.pointNumber})</span>
                                   </div>
                                  <p className="text-sm leading-relaxed line-through opacity-75">{change.oldContent}</p>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-start gap-3">
                               <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                                 darkMode 
                                   ? "bg-amber-900/40 text-amber-400" 
                                   : "bg-amber-200 text-amber-800"
                               }`}>
                                 <span className="text-sm font-bold">
                                   {change.pointNumber}
                                 </span>
                              </div>
                              <div className="flex-1">
                                 <div className={`p-4 rounded-lg border-l-4 ${
                                   darkMode 
                                     ? "bg-green-950/20 border-green-700/60 text-green-200" 
                                     : "bg-green-50 border-green-400 text-green-900"
                                }`}>
                                   <div className="flex items-center gap-2 mb-2">
                                     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`${
                                       darkMode ? "text-green-500" : "text-green-600"
                                     }`}>
                                       <line x1="12" y1="5" x2="12" y2="19" />
                                       <line x1="5" y1="12" x2="19" y2="12" />
                                     </svg>
                                     <span className="font-semibold text-sm">Updated Version (Point {change.pointNumber})</span>
                                   </div>
                                  <p className="text-sm leading-relaxed">{change.newContent}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              
              {versionChanges.filter(change => change.sectionId === selectedSection).length === 0 && (
                <div className={`text-center py-8 ${
                  darkMode ? "text-slate-400" : "text-slate-600"
                }`}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-4 opacity-50">
                    <path d="M14.5 2H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                  <p className={`text-lg font-semibold ${
                    darkMode ? "text-slate-300" : "text-slate-700"
                  }`}>No changes found</p>
                  <p className="text-sm">This section has no version changes to display.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-4 right-4 z-[1100] animate-in slide-in-from-right-full duration-300 ease-out">
          <div className={`flex items-center p-4 rounded-xl shadow-2xl border max-w-sm backdrop-blur-sm ${
            darkMode 
              ? "bg-slate-800/95 border-slate-600 text-white shadow-slate-900/50" 
              : "bg-white/95 border-gray-300 text-gray-900 shadow-gray-900/20"
          }`}>
            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
              darkMode ? "bg-yellow-800/30 text-yellow-400" : "bg-yellow-100 text-yellow-600"
            }`}>
              <PiPushPinFill size={16} />
            </div>
            <div className="flex-1">
              <p className={`text-sm font-medium ${
                darkMode ? "text-slate-200" : "text-gray-800"
              }`}>
                {toastMessage}
              </p>
            </div>
            <button
              onClick={() => setShowToast(false)}
              className={`ml-2 p-1 rounded-lg transition-colors cursor-pointer ${
                darkMode 
                  ? "hover:bg-slate-600 text-slate-400 hover:text-slate-200" 
                  : "hover:bg-gray-100 text-gray-500 hover:text-gray-700"
              }`}
              aria-label="Close notification"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default DocumentReviewTool;
'use client';
 
import React, { useState, useEffect, useCallback, useRef } from 'react';
import type { CSSProperties } from 'react';
import {
  FaChevronLeft, FaChevronRight, FaChevronDown,
  FaUser, FaRightFromBracket,
  FaStar, FaHeart, FaBookmark, FaBell, FaEnvelope, FaGlobe
} from 'react-icons/fa6';
 
// --- TYPESCRIPT INTERFACES ---
interface Flashcard {
  id: string;
  word: string;
  translation: string;
  image: string;
  category: string;
}
 
interface Sentence {
  id: string;
  template: string[];
  correctOrder: string[];
  translation: string;
  wordBank: string[];
  grammarTipId?: string;
}
 
interface GrammarNote {
    id: string;
    language: Language;
    rule: string;
    example: string;
}
 
type Language = 'spanish' | 'french' | 'italian' | 'portuguese';
 
// Profile Dropdown Component
const ProfileDropdown = ({ isOpen, onClose, onLogout, userEmail, styles }: { isOpen: boolean; onClose: () => void; onLogout: () => void; userEmail: string; styles: any }) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
 
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
 
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
 
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);
 
  if (!isOpen) return null;
 
  return (
    <div ref={dropdownRef} style={styles.profileDropdown}>
      <div style={styles.profileDropdownHeader}>
        <div style={styles.profileHeaderInfo}>
          <div style={styles.profileName}>{userEmail.split('@')[0] || 'User'}</div>
          <div style={styles.profileEmail}>{userEmail}</div>
        </div>
      </div>
      <div style={styles.profileDropdownMenu}>
        <button style={{...styles.profileMenuItem, ...styles.profileMenuItemDanger}} onClick={() => { onClose(); onLogout(); }}>
          <FaRightFromBracket size={16} />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
};
 
// SVG Image Components for Vocabulary Cards
const VocabularySVG = ({ type, size = 80 }: { type: string; size?: number }) => {
  const svgStyle = {
    width: size,
    height: size,
    minWidth: size,
    minHeight: size,
    maxWidth: size,
    maxHeight: size,
    display: 'block',
    filter: 'none',
    backgroundColor: 'transparent',
    borderRadius: '8px',
    padding: '0',
    boxSizing: 'border-box' as const,
    objectFit: 'contain' as const,
    flexShrink: 0
  };
 
  switch (type) {
    case 'CAT':
      return (
        <img
          src="https://www.svgrepo.com/show/481271/cat-4.svg"
          alt="Cat"
          style={{...svgStyle, objectFit: 'contain'}}
        />
      );
 
    case 'DOG':
      return (
        <img
          src="https://www.svgrepo.com/show/147415/dog.svg"
          alt="Dog"
          style={{...svgStyle, objectFit: 'contain'}}
        />
      );
 
    case 'HOUSE':
      return (
        <svg style={svgStyle} viewBox="0 0 100 100" fill="none">
          <polygon points="50,15 20,45 80,45" fill="#DC143C" stroke="#333" strokeWidth="2"/>
          <rect x="25" y="45" width="50" height="40" fill="#F4A460" stroke="#333" strokeWidth="2"/>
          <rect x="40" y="60" width="12" height="25" fill="#8B4513" stroke="#333" strokeWidth="2"/>
          <rect x="30" y="52" width="10" height="10" fill="#87CEEB" stroke="#333" strokeWidth="2"/>
          <rect x="60" y="52" width="10" height="10" fill="#87CEEB" stroke="#333" strokeWidth="2"/>
          <circle cx="46" cy="72" r="1.5" fill="#333"/>
        </svg>
      );
 
    case 'EAT':
      return (
        <svg style={svgStyle} viewBox="0 0 100 100" fill="none">
          <circle cx="50" cy="40" r="25" fill="#FFE4B5" stroke="#333" strokeWidth="2"/>
          <rect x="15" y="25" width="3" height="30" fill="#C0C0C0" stroke="#333" strokeWidth="1"/>
          <rect x="12" y="25" width="9" height="3" fill="#C0C0C0" stroke="#333" strokeWidth="1"/>
          <path d="M75 20 L85 30 L80 35 L70 25 Z" fill="#C0C0C0" stroke="#333" strokeWidth="1"/>
          <path d="M75 20 L85 15 L90 20 L80 25 Z" fill="#C0C0C0" stroke="#333" strokeWidth="1"/>
          <ellipse cx="50" cy="40" rx="15" ry="8" fill="#FF6347"/>
          <rect x="25" y="70" width="50" height="8" rx="4" fill="#8B4513" stroke="#333" strokeWidth="2"/>
        </svg>
      );
 
    case 'DRINK':
      return (
        <svg style={svgStyle} viewBox="0 0 100 100" fill="none">
          <rect x="35" y="30" width="30" height="45" rx="5" fill="#87CEEB" stroke="#333" strokeWidth="2"/>
          <rect x="37" y="32" width="26" height="25" fill="#4169E1" opacity="0.7"/>
          <rect x="30" y="25" width="40" height="8" rx="4" fill="#F5F5DC" stroke="#333" strokeWidth="2"/>
          <path d="M65 35 Q75 40 70 50" stroke="#333" strokeWidth="2" fill="none"/>
          <ellipse cx="50" cy="20" rx="8" ry="3" fill="#F5F5DC" stroke="#333" strokeWidth="1"/>
          <path d="M45 15 Q50 10 55 15" stroke="#333" strokeWidth="2" fill="none"/>
        </svg>
      );
 
    case 'SUN':
      return (
        <svg style={svgStyle} viewBox="0 0 100 100" fill="none">
          <circle cx="50" cy="50" r="20" fill="#FFD700" stroke="#FFA500" strokeWidth="2"/>
          <g stroke="#FFA500" strokeWidth="3" strokeLinecap="round">
            <line x1="50" y1="10" x2="50" y2="20"/>
            <line x1="50" y1="80" x2="50" y2="90"/>
            <line x1="10" y1="50" x2="20" y2="50"/>
            <line x1="80" y1="50" x2="90" y2="50"/>
            <line x1="21.7" y1="21.7" x2="28.3" y2="28.3"/>
            <line x1="71.7" y1="71.7" x2="78.3" y2="78.3"/>
            <line x1="21.7" y1="78.3" x2="28.3" y2="71.7"/>
            <line x1="71.7" y1="28.3" x2="78.3" y2="21.7"/>
          </g>
          <circle cx="45" cy="45" r="2" fill="#FFA500"/>
          <circle cx="55" cy="45" r="2" fill="#FFA500"/>
          <path d="M45 55 Q50 60 55 55" stroke="#FFA500" strokeWidth="2" fill="none"/>
        </svg>
      );
 
    case 'WATER':
      return (
        <svg style={svgStyle} viewBox="0 0 100 100" fill="none">
          <path d="M50 20 Q35 35 35 55 Q35 75 50 75 Q65 75 65 55 Q65 35 50 20 Z"
                fill="#4169E1" stroke="#1E90FF" strokeWidth="2"/>
          <ellipse cx="45" cy="45" rx="3" ry="6" fill="#87CEEB" opacity="0.7"/>
          <ellipse cx="55" cy="55" rx="2" ry="4" fill="#87CEEB" opacity="0.7"/>
          <circle cx="50" cy="35" r="1.5" fill="#E0F6FF"/>
        </svg>
      );
 
    case 'ARTICLE_M':
      return (
        <svg style={svgStyle} viewBox="0 0 100 100" fill="none">
          <rect x="20" y="20" width="60" height="60" rx="5" fill="#E6F3FF" stroke="#4169E1" strokeWidth="2"/>
          <text x="50" y="55" textAnchor="middle" fontSize="24" fontWeight="bold" fill="#4169E1">M</text>
          <rect x="25" y="25" width="50" height="3" fill="#4169E1"/>
          <rect x="25" y="35" width="35" height="2" fill="#87CEEB"/>
          <rect x="25" y="65" width="40" height="2" fill="#87CEEB"/>
        </svg>
      );
 
    case 'ARTICLE_F':
      return (
        <svg style={svgStyle} viewBox="0 0 100 100" fill="none">
          <rect x="20" y="20" width="60" height="60" rx="5" fill="#FFE6F3" stroke="#DC143C" strokeWidth="2"/>
          <text x="50" y="55" textAnchor="middle" fontSize="24" fontWeight="bold" fill="#DC143C">F</text>
          <rect x="25" y="25" width="50" height="3" fill="#DC143C"/>
          <rect x="25" y="35" width="35" height="2" fill="#FFB6C1"/>
          <rect x="25" y="65" width="40" height="2" fill="#FFB6C1"/>
        </svg>
      );
 
    case 'ARTICLE':
      return (
        <svg style={svgStyle} viewBox="0 0 100 100" fill="none">
          <rect x="20" y="20" width="60" height="60" rx="5" fill="#F0F8FF" stroke="#333" strokeWidth="2"/>
          <rect x="25" y="25" width="50" height="3" fill="#333"/>
          <rect x="25" y="35" width="45" height="2" fill="#666"/>
          <rect x="25" y="42" width="40" height="2" fill="#666"/>
          <rect x="25" y="49" width="48" height="2" fill="#666"/>
          <rect x="25" y="56" width="35" height="2" fill="#666"/>
          <rect x="25" y="63" width="42" height="2" fill="#666"/>
          <rect x="25" y="70" width="30" height="2" fill="#666"/>
        </svg>
      );
 
    case 'IN':
      return (
        <svg style={svgStyle} viewBox="0 0 100 100" fill="none">
          <circle cx="50" cy="50" r="30" fill="none" stroke="#333" strokeWidth="3"/>
          <circle cx="50" cy="50" r="8" fill="#FF6347"/>
          <path d="M30 30 L50 50" stroke="#333" strokeWidth="2" markerEnd="url(#arrowhead)"/>
          <defs>
            <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="#333"/>
            </marker>
          </defs>
        </svg>
      );
 
    case 'FROM':
      return (
        <svg style={svgStyle} viewBox="0 0 100 100" fill="none">
          <circle cx="25" cy="50" r="8" fill="#32CD32"/>
          <circle cx="75" cy="50" r="8" fill="#FF6347"/>
          <path d="M33 50 L67 50" stroke="#333" strokeWidth="3" markerEnd="url(#arrowhead2)"/>
          <defs>
            <marker id="arrowhead2" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="#333"/>
            </marker>
          </defs>
          <text x="50" y="35" textAnchor="middle" fontSize="12" fill="#333">FROM</text>
        </svg>
      );
 
    case 'IS':
      return (
        <svg style={svgStyle} viewBox="0 0 100 100" fill="none">
          <circle cx="50" cy="50" r="25" fill="#98FB98" stroke="#32CD32" strokeWidth="3"/>
          <circle cx="50" cy="50" r="5" fill="#32CD32"/>
          <path d="M50 25 L50 35" stroke="#32CD32" strokeWidth="2"/>
          <path d="M50 65 L50 75" stroke="#32CD32" strokeWidth="2"/>
          <path d="M25 50 L35 50" stroke="#32CD32" strokeWidth="2"/>
          <path d="M65 50 L75 50" stroke="#32CD32" strokeWidth="2"/>
        </svg>
      );
 
    case 'BOOK':
      return (
        <svg style={svgStyle} viewBox="0 0 100 100" fill="none">
          <rect x="25" y="20" width="50" height="60" rx="3" fill="#8B4513" stroke="#333" strokeWidth="2"/>
          <rect x="27" y="22" width="46" height="56" rx="2" fill="#F4A460"/>
          <rect x="30" y="25" width="40" height="2" fill="#8B4513"/>
          <rect x="30" y="30" width="35" height="1.5" fill="#666"/>
          <rect x="30" y="35" width="38" height="1.5" fill="#666"/>
          <rect x="30" y="40" width="32" height="1.5" fill="#666"/>
          <rect x="30" y="45" width="36" height="1.5" fill="#666"/>
          <rect x="30" y="50" width="30" height="1.5" fill="#666"/>
          <rect x="30" y="55" width="34" height="1.5" fill="#666"/>
          <rect x="30" y="60" width="28" height="1.5" fill="#666"/>
          <rect x="30" y="65" width="32" height="1.5" fill="#666"/>
          <rect x="30" y="70" width="25" height="1.5" fill="#666"/>
        </svg>
      );
 
    case 'TREE':
      return (
        <svg style={svgStyle} viewBox="0 0 100 100" fill="none">
          <rect x="45" y="60" width="10" height="25" fill="#8B4513" stroke="#333" strokeWidth="2"/>
          <circle cx="50" cy="45" r="20" fill="#228B22" stroke="#006400" strokeWidth="2"/>
          <circle cx="40" cy="35" r="12" fill="#32CD32" stroke="#006400" strokeWidth="1"/>
          <circle cx="60" cy="35" r="12" fill="#32CD32" stroke="#006400" strokeWidth="1"/>
          <circle cx="50" cy="25" r="10" fill="#90EE90" stroke="#006400" strokeWidth="1"/>
          <ellipse cx="35" cy="80" rx="8" ry="3" fill="#8B4513" opacity="0.5"/>
          <ellipse cx="65" cy="82" rx="6" ry="2" fill="#8B4513" opacity="0.5"/>
          <path d="M42 70 Q38 75 35 80" stroke="#8B4513" strokeWidth="2" fill="none"/>
          <path d="M58 70 Q62 75 65 80" stroke="#8B4513" strokeWidth="2" fill="none"/>
        </svg>
      );
 
    case 'FLOWER':
      return (
        <svg style={svgStyle} viewBox="0 0 100 100" fill="none">
          <rect x="48" y="50" width="4" height="35" fill="#228B22" stroke="#006400" strokeWidth="1"/>
          <ellipse cx="50" cy="35" rx="8" ry="12" fill="#FF69B4" stroke="#FF1493" strokeWidth="1" transform="rotate(0 50 35)"/>
          <ellipse cx="50" cy="35" rx="8" ry="12" fill="#FF69B4" stroke="#FF1493" strokeWidth="1" transform="rotate(45 50 35)"/>
          <ellipse cx="50" cy="35" rx="8" ry="12" fill="#FF69B4" stroke="#FF1493" strokeWidth="1" transform="rotate(90 50 35)"/>
          <ellipse cx="50" cy="35" rx="8" ry="12" fill="#FF69B4" stroke="#FF1493" strokeWidth="1" transform="rotate(135 50 35)"/>
          <ellipse cx="50" cy="35" rx="8" ry="12" fill="#FFB6C1" stroke="#FF1493" strokeWidth="1" transform="rotate(22.5 50 35)"/>
          <ellipse cx="50" cy="35" rx="8" ry="12" fill="#FFB6C1" stroke="#FF1493" strokeWidth="1" transform="rotate(67.5 50 35)"/>
          <ellipse cx="50" cy="35" rx="8" ry="12" fill="#FFB6C1" stroke="#FF1493" strokeWidth="1" transform="rotate(112.5 50 35)"/>
          <ellipse cx="50" cy="35" rx="8" ry="12" fill="#FFB6C1" stroke="#FF1493" strokeWidth="1" transform="rotate(157.5 50 35)"/>
          <circle cx="50" cy="35" r="4" fill="#FFD700" stroke="#FFA500" strokeWidth="1"/>
          <ellipse cx="45" cy="60" rx="3" ry="8" fill="#228B22" stroke="#006400" strokeWidth="1"/>
          <ellipse cx="55" cy="65" rx="2" ry="6" fill="#228B22" stroke="#006400" strokeWidth="1"/>
        </svg>
      );
 
    default:
      return (
        <svg style={svgStyle} viewBox="0 0 100 100" fill="none">
          <rect x="20" y="20" width="60" height="60" rx="5" fill="#F5F5F5" stroke="#333" strokeWidth="2"/>
          <text x="50" y="55" textAnchor="middle" fontSize="16" fill="#333">?</text>
        </svg>
      );
  }
};
 
// --- MOCK DATABASE & ASSETS ---
const vocabularyData: Record<Language, Flashcard[]> = {
  spanish: [
    { id: 'es1', word: 'gato', translation: 'cat', image: 'CAT', category: 'animals' },
    { id: 'es2', word: 'perro', translation: 'dog', image: 'DOG', category: 'animals' },
    { id: 'es3', word: 'casa', translation: 'house', image: 'HOUSE', category: 'objects' },
    { id: 'es4', word: 'comer', translation: 'to eat', image: 'EAT', category: 'verbs' },
    { id: 'es5', word: 'el', translation: 'the (m)', image: 'ARTICLE_M', category: 'articles' },
    { id: 'es6', word: 'la', translation: 'the (f)', image: 'ARTICLE_F', category: 'articles' },
    { id: 'es7', word: 'sol', translation: 'sun', image: 'SUN', category: 'nature' },
    { id: 'es8', word: 'agua', translation: 'water', image: 'WATER', category: 'nature' },
    { id: 'es9', word: 'bebe', translation: 'drinks', image: 'DRINK', category: 'verbs' },
    { id: 'es10', word: 'está', translation: 'is', image: 'IS', category: 'verbs' },
    { id: 'es11', word: 'en', translation: 'in/at', image: 'IN', category: 'prepositions' },
    { id: 'es12', word: 'un', translation: 'a/an (m)', image: 'ARTICLE', category: 'articles' },
    { id: 'es13', word: 'libro', translation: 'book', image: 'BOOK', category: 'objects' },
    { id: 'es14', word: 'árbol', translation: 'tree', image: 'TREE', category: 'nature' },
    { id: 'es15', word: 'flor', translation: 'flower', image: 'FLOWER', category: 'nature' },
  ],
  french: [
    { id: 'fr1', word: 'chat', translation: 'cat', image: 'CAT', category: 'animals' },
    { id: 'fr2', word: 'chien', translation: 'dog', image: 'DOG', category: 'animals' },
    { id: 'fr3', word: 'maison', translation: 'house', image: 'HOUSE', category: 'objects' },
    { id: 'fr4', word: 'manger', translation: 'to eat', image: 'EAT', category: 'verbs' },
    { id: 'fr5', word: 'le', translation: 'the (m)', image: 'ARTICLE_M', category: 'articles' },
    { id: 'fr6', word: 'la', translation: 'the (f)', image: 'ARTICLE_F', category: 'articles' },
    { id: 'fr7', word: 'soleil', translation: 'sun', image: 'SUN', category: 'nature' },
    { id: 'fr8', word: 'eau', translation: 'water', image: 'WATER', category: 'nature' },
    { id: 'fr9', word: 'boit', translation: 'drinks', image: 'DRINK', category: 'verbs' },
    { id: 'fr10', word: 'est', translation: 'is', image: 'IS', category: 'verbs' },
    { id: 'fr11', word: 'dans', translation: 'in', image: 'IN', category: 'prepositions' },
    { id: 'fr12', word: 'un', translation: 'a/an', image: 'ARTICLE', category: 'articles' },
    { id: 'fr13', word: 'de', translation: 'of/from', image: 'FROM', category: 'prepositions' },
  ],
  italian: [
    { id: 'it1', word: 'gatto', translation: 'cat', image: 'CAT', category: 'animals' },
    { id: 'it2', word: 'cane', translation: 'dog', image: 'DOG', category: 'animals' },
    { id: 'it3', word: 'casa', translation: 'house', image: 'HOUSE', category: 'objects' },
    { id: 'it4', word: 'mangiare', translation: 'to eat', image: 'EAT', category: 'verbs' },
    { id: 'it5', word: 'il', translation: 'the (m)', image: 'ARTICLE_M', category: 'articles' },
    { id: 'it6', word: 'la', translation: 'the (f)', image: 'ARTICLE_F', category: 'articles' },
    { id: 'it7', word: 'sole', translation: 'sun', image: 'SUN', category: 'nature' },
    { id: 'it8', word: 'acqua', translation: 'water', image: 'WATER', category: 'nature' },
    { id: 'it9', word: 'beve', translation: 'drinks', image: 'DRINK', category: 'verbs' },
    { id: 'it10', word: 'è', translation: 'is', image: 'IS', category: 'verbs' },
    { id: 'it11', word: 'nella', translation: 'in the', image: 'IN', category: 'prepositions' },
    { id: 'it12', word: 'un', translation: 'a/an', image: 'ARTICLE', category: 'articles' },
  ],
  portuguese: [
    { id: 'pt1', word: 'gato', translation: 'cat', image: 'CAT', category: 'animals' },
    { id: 'pt2', word: 'cão', translation: 'dog', image: 'DOG', category: 'animals' },
    { id: 'pt3', word: 'casa', translation: 'house', image: 'HOUSE', category: 'objects' },
    { id: 'pt4', word: 'comer', translation: 'to eat', image: 'EAT', category: 'verbs' },
    { id: 'pt5', word: 'o', translation: 'the (m)', image: 'ARTICLE_M', category: 'articles' },
    { id: 'pt6', word: 'a', translation: 'the (f)', image: 'ARTICLE_F', category: 'articles' },
    { id: 'pt7', word: 'sol', translation: 'sun', image: 'SUN', category: 'nature' },
    { id: 'pt8', word: 'água', translation: 'water', image: 'WATER', category: 'nature' },
    { id: 'pt9', word: 'bebe', translation: 'drinks', image: 'DRINK', category: 'verbs' },
    { id: 'pt10', word: 'está', translation: 'is', image: 'IS', category: 'verbs' },
    { id: 'pt11', word: 'na', translation: 'in the', image: 'IN', category: 'prepositions' },
    { id: 'pt12', word: 'um', translation: 'a/an', image: 'ARTICLE', category: 'articles' },
  ]
};
 
const sentenceData: Record<Language, Sentence[]> = {
  spanish: [
    { id: 'es_s1', template: ['___', '___', 'bebe', '___'], correctOrder: ['el', 'gato', 'bebe', 'agua'], translation: 'The cat drinks water', wordBank: ['el', 'la', 'gato', 'bebe', 'agua', 'sol'].sort(() => Math.random() - 0.5), grammarTipId: 'es_gender' },
    { id: 'es_s2', template: ['___', '___', 'está', 'en', 'la', '___'], correctOrder: ['el', 'perro', 'está', 'en', 'la', 'casa'], translation: 'The dog is in the house', wordBank: ['perro', 'en', 'la', 'casa', 'el', 'un', 'está'].sort(() => Math.random() - 0.5), grammarTipId: 'es_gender' },
  ],
  french: [
    { id: 'fr_s1', template: ['___', '___', 'boit', 'de', "l'eau"], correctOrder: ['le', 'chat', 'boit', 'de', "l'eau"], translation: 'The cat drinks water', wordBank: ['le', 'la', 'chat', 'boit', 'de', "l'eau", 'mange'].sort(() => Math.random() - 0.5), grammarTipId: 'fr_articles' },
    { id: 'fr_s2', template: ['___', '___', 'est', 'dans', 'la', 'maison'], correctOrder: ['le', 'chien', 'est', 'dans', 'la', 'maison'], translation: 'The dog is in the house', wordBank: ['chien', 'est', 'dans', 'la', 'maison', 'le', 'un'].sort(() => Math.random() - 0.5), grammarTipId: 'fr_articles' },
  ],
  italian: [
    { id: 'it_s1', template: ['___', '___', 'beve', "l'acqua"], correctOrder: ['il', 'gatto', 'beve', "l'acqua"], translation: 'The cat drinks water', wordBank: ['il', 'la', 'gatto', 'beve', "l'acqua", 'sole'].sort(() => Math.random() - 0.5), grammarTipId: 'it_articles' },
    { id: 'it_s2', template: ['___', '___', 'è', 'nella', 'casa'], correctOrder: ['il', 'cane', 'è', 'nella', 'casa'], translation: 'The dog is in the house', wordBank: ['cane', 'è', 'nella', 'casa', 'il', 'un'].sort(() => Math.random() - 0.5), grammarTipId: 'it_articles' },
  ],
  portuguese: [
      { id: 'pt_s1', template: ['___', '___', 'bebe', '___'], correctOrder: ['o', 'gato', 'bebe', 'água'], translation: 'The cat drinks water', wordBank: ['o', 'a', 'gato', 'bebe', 'água', 'sol'].sort(() => Math.random() - 0.5), grammarTipId: 'pt_gender' },
      { id: 'pt_s2', template: ['___', '___', 'está', 'na', '___'], correctOrder: ['o', 'cão', 'está', 'na', 'casa'], translation: 'The dog is in the house', wordBank: ['cão', 'está', 'na', 'casa', 'o', 'um'].sort(() => Math.random() - 0.5), grammarTipId: 'pt_gender' },
  ]
};
 
const grammarTips: Record<string, Omit<GrammarNote, 'language'>> = {
    'es_gender': { id: 'es_gender', rule: "Gendered Articles", example: "Nouns in Spanish are masculine or feminine. Use 'el' for masculine (el gato) and 'la' for feminine (la casa)." },
    'fr_articles': { id: 'fr_articles', rule: "Definite Articles", example: "Use 'le' for masculine nouns (le chat) and 'la' for feminine nouns (la maison)." },
    'it_articles': { id: 'it_articles', rule: "Definite Articles", example: "Use 'il' for most masculine nouns (il gatto) and 'la' for feminine nouns (la casa)." },
    'pt_gender': { id: 'pt_gender', rule: "Gendered Articles", example: "Nouns in Portuguese have a gender. Use 'o' for masculine (o gato) and 'a' for feminine (a casa)." },
}
 
// SVG Flag Components
const FlagSVG = ({ country, size = 24 }: { country: string; size?: number }) => {
  const flagStyle = { width: size, height: size * 0.75, display: 'inline-block', borderRadius: '2px', border: '1px solid #ccc' };
 
  switch (country) {
    case 'ES': // Spain
      return (
        <svg style={flagStyle} viewBox="0 0 24 18" fill="none">
          <rect width="24" height="18" fill="#AA151B"/>
          <rect y="4.5" width="24" height="9" fill="#F1BF00"/>
          <g transform="translate(7, 9)">
            <circle cx="0" cy="0" r="2.5" fill="#AA151B" stroke="#000" strokeWidth="0.1"/>
            <rect x="-1.5" y="-1" width="3" height="2" fill="#F1BF00"/>
            <rect x="-0.5" y="-0.5" width="1" height="1" fill="#AA151B"/>
          </g>
        </svg>
      );
 
    case 'FR': // France
      return (
        <svg style={flagStyle} viewBox="0 0 24 18" fill="none">
          <rect width="8" height="18" fill="#002654"/>
          <rect x="8" width="8" height="18" fill="#FFFFFF"/>
          <rect x="16" width="8" height="18" fill="#CE1126"/>
        </svg>
      );
 
    case 'IT': // Italy
      return (
        <svg style={flagStyle} viewBox="0 0 24 18" fill="none">
          <rect width="8" height="18" fill="#009246"/>
          <rect x="8" width="8" height="18" fill="#FFFFFF"/>
          <rect x="16" width="8" height="18" fill="#CE2B37"/>
        </svg>
      );
 
    case 'PT': // Portugal
      return (
        <svg style={flagStyle} viewBox="0 0 24 18" fill="none">
          <rect width="24" height="18" fill="#FF0000"/>
          <rect width="9.6" height="18" fill="#006600"/>
          <circle cx="9.6" cy="9" r="3.5" fill="#FFFF00" stroke="#000" strokeWidth="0.2"/>
          <circle cx="9.6" cy="9" r="2.5" fill="#0000FF"/>
          <circle cx="9.6" cy="9" r="1.5" fill="#FFFFFF"/>
          <rect x="8.8" y="8.2" width="1.6" height="1.6" fill="#FF0000"/>
        </svg>
      );
 
    default:
      return (
        <svg style={flagStyle} viewBox="0 0 24 18" fill="none">
          <rect width="24" height="18" fill="#f0f0f0" stroke="#ccc"/>
          <text x="12" y="12" textAnchor="middle" fontSize="8" fill="#666">?</text>
        </svg>
      );
  }
};
 
const languageAssets: Record<Language, { flag: string; color: string }> = {
    spanish: { flag: 'ES', color: '#3b82f6' },
    french: { flag: 'FR', color: '#ef4444' },
    italian: { flag: 'IT', color: '#22c55e' },
    portuguese: { flag: 'PT', color: '#f97316' },
};
 

 
// --- MAIN WRAPPER COMPONENT ---
export default function AppWrapper() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userEmail, setUserEmail] = useState('');
    const [appKey, setAppKey] = useState(0);
 
    const handleLogin = (email: string) => {
        setIsLoggedIn(true);
        setUserEmail(email);
        setAppKey(prevKey => prevKey + 1);
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        setUserEmail('');
        setAppKey(prevKey => prevKey + 1);
    };
 
    if (!isLoggedIn) {
        return <AuthPage onLogin={handleLogin} />;
    }
 
    return <LanguageLearningDashboard key={appKey} onLogout={handleLogout} userEmail={userEmail} />;
}
 
 
// --- AUTHENTICATION PAGE COMPONENT ---
const AuthPage = ({ onLogin }: {
    onLogin: (email: string) => void;
}) => {
    // Load Poppins font immediately for auth page
    React.useEffect(() => {
        const linkId = 'poppins-font';
        if (!document.getElementById(linkId)) {
            const link = document.createElement('link');
            link.id = linkId;
            link.rel = 'stylesheet';
            link.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap';
            document.head.appendChild(link);
        }
    }, []);
    const [authStage, setAuthStage] = useState<'welcome' | 'login'>('welcome');
    const [isExiting, setIsExiting] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);
    const [screenSize, setScreenSize] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');
    const [windowDimensions, setWindowDimensions] = useState({ width: 1024, height: 768 });
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [isTermsAccepted, setIsTermsAccepted] = useState(false);
    const [isFormValid, setIsFormValid] = useState(false);
 
    const styles = getStyles(screenSize, windowDimensions);
    const isMobile = screenSize === 'mobile';

    // Validation functions
    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email.trim()) {
            return 'Email is required';
        }
        if (!emailRegex.test(email)) {
            return 'Please enter a valid email address';
        }
        return '';
    };

    const validatePassword = (password: string) => {
        if (!password) {
            return 'Password is required';
        }
        if (password.length < 8) {
            return 'Password must be at least 8 characters long';
        }
        if (!/(?=.*[a-z])/.test(password)) {
            return 'Password must contain at least one lowercase letter';
        }
        if (!/(?=.*[A-Z])/.test(password)) {
            return 'Password must contain at least one uppercase letter';
        }
        if (!/(?=.*\d)/.test(password)) {
            return 'Password must contain at least one number';
        }
        return '';
    };

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const email = e.target.value;
        const error = validateEmail(email);
        setEmailError(error);
        updateFormValidity(email, (document.getElementById('password') as HTMLInputElement)?.value || '', isTermsAccepted);
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const password = e.target.value;
        const error = validatePassword(password);
        setPasswordError(error);
        updateFormValidity((document.getElementById('email') as HTMLInputElement)?.value || '', password, isTermsAccepted);
    };

    const handleTermsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const termsAccepted = e.target.checked;
        setIsTermsAccepted(termsAccepted);
        updateFormValidity(
            (document.getElementById('email') as HTMLInputElement)?.value || '',
            (document.getElementById('password') as HTMLInputElement)?.value || '',
            termsAccepted
        );
    };

    const updateFormValidity = (email: string, password: string, termsAccepted: boolean) => {
        const emailValid = validateEmail(email) === '';
        const passwordValid = validatePassword(password) === '';
        setIsFormValid(emailValid && passwordValid && termsAccepted);
    };
 
    // Handle mobile detection and window resize
    useEffect(() => {
        const updateScreenSize = () => {
            const width = window.innerWidth;
            const height = window.innerHeight;
            setWindowDimensions({ width, height });
 
            if (width < 768) {
                setScreenSize('mobile');
            } else if (width < 1024) {
                setScreenSize('tablet');
            } else {
                setScreenSize('desktop');
            }
        };
 
        updateScreenSize();
        window.addEventListener('resize', updateScreenSize);
        return () => window.removeEventListener('resize', updateScreenSize);
    }, []);
 
    useEffect(() => {
        // Initialize immediately
        setIsInitialized(true);
    }, []);

    useEffect(() => {
        // Set up animation based on actual detected screen size
        if (isInitialized) {
            if (screenSize === 'desktop' || screenSize === 'tablet') {
                const timer = setTimeout(() => {
                    setAuthStage('login');
                }, 1500);
                return () => clearTimeout(timer);
            } else {
                // For mobile, go directly to login
                setAuthStage('login');
            }
        }
    }, [isInitialized, screenSize]);
 
    const handleAction = () => {
        const emailInput = document.getElementById('email') as HTMLInputElement;
        const passwordInput = document.getElementById('password') as HTMLInputElement;
        const email = emailInput?.value || '';
        const password = passwordInput?.value || '';

        // Validate all fields
        const emailValidationError = validateEmail(email);
        const passwordValidationError = validatePassword(password);

        setEmailError(emailValidationError);
        setPasswordError(passwordValidationError);

        // Only proceed if all fields are valid and terms are accepted
        if (!emailValidationError && !passwordValidationError && isTermsAccepted) {
            setIsExiting(true);
            setTimeout(() => onLogin(email), 500);
        }
    };

    const handleSocialLogin = (type: 'account' | 'profile') => {
        // For social login, bypass email/password validation
        // Use a default email based on the login type
        const defaultEmail = type === 'account' ? 'user@account.com' : 'user@profile.com';
        setIsExiting(true);
        setTimeout(() => onLogin(defaultEmail), 500);
    };
 
    // Show loading screen only briefly during initialization
    if (!isInitialized) {
        return (
            <div style={styles.authContainer}>
                <div style={styles.authLoadingScreen}>
                    <div style={styles.authLogo}>L</div>
                </div>
            </div>
        );
    }
 
    return (
        <div className="auth-container" style={{...styles.authContainer, opacity: isExiting ? 0 : 1}}>
            <div className="auth-welcome-panel" style={{...styles.authWelcomePanel, ...(authStage === 'login' ? styles.authWelcomePanelActive : {})}}>
                <div style={styles.authLogo}>L</div>
                <h1 style={styles.authTitle}>Start your language journey with LingoDeck</h1>
                <p style={styles.authSubtitle}>Your future in multi-linguistics.</p>
            </div>
            <div className="auth-form-panel" style={{...styles.authFormPanel, ...(authStage === 'login' ? styles.authFormPanelActive : {})}}>
                <div style={styles.authFormContent}>
                    <h2 style={{margin: '0 0 2rem 0', fontSize: '2rem', fontWeight: 600, color: styles.theme.colors.text}}>Sign up</h2>
                    <div style={styles.inputGroup}>
                        <label htmlFor="email" style={styles.inputLabel}>Email</label>
                        <input 
                            id="email" 
                            type="email" 
                            placeholder="you@email.com" 
                            className="auth-input" 
                            style={{
                                ...styles.authInput,
                                borderColor: emailError ? styles.theme.colors.error : styles.theme.colors.border
                            }}
                            onChange={handleEmailChange}
                        />
                        {emailError && <div style={styles.errorMessage}>{emailError}</div>}
                    </div>
                    <div style={styles.inputGroup}>
                        <label htmlFor="password" style={styles.inputLabel}>Password</label>
                        <input 
                            id="password" 
                            type="password" 
                            placeholder="••••••••" 
                            className="auth-input" 
                            style={{
                                ...styles.authInput,
                                borderColor: passwordError ? styles.theme.colors.error : styles.theme.colors.border
                            }}
                            onChange={handlePasswordChange}
                        />
                        {passwordError && <div style={styles.errorMessage}>{passwordError}</div>}
                    </div>
                    <div style={styles.authConsent}>
                        <input 
                            type="checkbox" 
                            id="agree" 
                            checked={isTermsAccepted}
                            onChange={handleTermsChange}
                        />
                        <label htmlFor="agree">I agree to the <a href="#" style={styles.authConsentLink}>Terms of Service</a> and <a href="#" style={styles.authConsentLink}>Privacy Policy</a>.</label>
                    </div>
                    <button 
                        className="primary-button" 
                        style={{
                            ...styles.primaryButton, 
                            width: '100%', 
                            maxWidth: '100%',
                            flex: 'none',
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            ...((!isFormValid) ? {
                                backgroundColor: '#e9ecef',
                                color: '#6c757d',
                                cursor: 'not-allowed'
                            } : {})
                        }} 
                        onClick={handleAction}
                        disabled={!isFormValid}
                    >
                        Continue
                    </button>
                    <div className="auth-separator" style={styles.authSeparator}><span>OR</span></div>
                    <button style={{...styles.socialButton, ...styles.googleButton}} onClick={() => handleSocialLogin('account')}><FaGlobe size={18} style={{marginRight: '0.5rem'}} /> Continue with Account</button>
                    <button style={{...styles.socialButton, ...styles.githubButton}} onClick={() => handleSocialLogin('profile')}><FaStar size={18} style={{marginRight: '0.5rem'}} /> Continue with Profile</button>
                </div>
            </div>
        </div>
    );
};
 
 
// --- MAIN DASHBOARD COMPONENT ---
function LanguageLearningDashboard({ onLogout, userEmail }: {
    onLogout: () => void;
    userEmail: string;
}) {
  // Logout handler
  const handleLogout = () => {
    // Reset the app to show login page
    onLogout();
  };
  // Add CSS for webkit scrollbar hiding and other pseudo-selectors
  React.useEffect(() => {
    const styleId = 'component-styles';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.innerHTML = `
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap');
        
        * {
          font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        .flashcard-carousel-wrapper::-webkit-scrollbar {
          display: none;
        }
        .flashcard-carousel-wrapper {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .theme-toggle-button:hover {
          background-color: #f8f9fa !important;
          color: #007bff !important;
        }
        .primary-button:disabled {
          background-color: #e9ecef !important;
          color: #6c757d !important;
          cursor: not-allowed !important;
        }
        .grammar-note-dismiss:hover {
          background-color: #e9ecef !important;
          color: #212529 !important;
        }
        .auth-input:focus {
          border-color: #007bff !important;
          box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1) !important;
          outline: none !important;
        }
        .auth-separator::before,
        .auth-separator::after {
          content: "";
          height: 1px;
          flex: 1;
          background-color: #e9ecef;
        }
        .auth-separator span {
          flex-shrink: 0;
          padding: 0 1rem;
        }
        .auth-container {
          position: relative;
          overflow: hidden;
        }
        .auth-form-panel {
          box-sizing: border-box;
        }
        .auth-welcome-panel {
          box-sizing: border-box;
        }
        .footer-list-item:hover {
          color: #007bff !important;
        }
        .footer-social-link:hover {
          transform: scale(1.2) !important;
        }
        .footer-link:hover {
          color: #007bff !important;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
 
        /* Mobile-specific improvements */
        @media (max-width: 768px) {
          .flashcard-carousel-wrapper {
            -webkit-overflow-scrolling: touch;
            scroll-behavior: smooth;
          }
 
          /* Improve touch targets */
          button, .draggable-word, .sentence-slot {
            min-height: 44px !important;
            min-width: 44px !important;
          }

          /* Touch-friendly drag and drop */
          .draggable-word, .sentence-slot {
            touch-action: manipulation;
            user-select: none;
            -webkit-user-select: none;
            -webkit-touch-callout: none;
          }

          /* Improve visual feedback for touch */
          .draggable-word:active, .sentence-slot:active {
            transform: scale(1.02) !important;
            opacity: 0.9 !important;
            transition: none !important;
          }

          /* Better visual feedback for selected items */
          .selected-word {
            animation: pulse 1.5s infinite !important;
          }

          @keyframes pulse {
            0% { box-shadow: 0 0 0 0 rgba(0, 123, 255, 0.7); }
            70% { box-shadow: 0 0 0 10px rgba(0, 123, 255, 0); }
            100% { box-shadow: 0 0 0 0 rgba(0, 123, 255, 0); }
          }
 
          /* Better mobile typography */
          body {
            -webkit-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
          }
 
          /* Prevent zoom on input focus */
          input, select, textarea {
            font-size: 16px !important;
          }
        }
 
        /* Tablet-specific improvements */
        @media (min-width: 769px) and (max-width: 1024px) {
          .main-content {
            grid-template-columns: 1fr !important;
          }
        }
      `;
      document.head.appendChild(style);
    }
  }, []);
 
  const [selectedLanguage, setSelectedLanguage] = useState<Language>('spanish');
  const [transitioningTo, setTransitioningTo] = useState<Language | null>(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showTranslation, setShowTranslation] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isLanguageSelectorOpen, setIsLanguageSelectorOpen] = useState(false);
  const [draggedItem, setDraggedItem] = useState<{word: string, fromIndex: number | null} | null>(null);
  const [touchStartPos, setTouchStartPos] = useState<{x: number, y: number} | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedWordForMove, setSelectedWordForMove] = useState<{word: string, fromIndex: number | null} | null>(null);
  const [currentSentence, setCurrentSentence] = useState<(string | null)[]>([]);
  const [selectedSentenceIndex, setSelectedSentenceIndex] = useState(0);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' });
  const [isSentenceComplete, setIsSentenceComplete] = useState(false);
  const [learnedWords, setLearnedWords] = useState<Set<string>>(new Set());
  const [completedSentences, setCompletedSentences] = useState<Set<string>>(new Set());
  const [grammarNotes, setGrammarNotes] = useState<GrammarNote[]>([]);
  const [accuracy, setAccuracy] = useState(100);
  const [attempts, setAttempts] = useState(0);
  const [correctAttempts, setCorrectAttempts] = useState(0);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [lessonCompleted, setLessonCompleted] = useState(false);
  const [collapsedSections, setCollapsedSections] = useState({
      flashcards: false,
      sentences: false,
      progress: false,
      grammar: false,
  });
 
  // Responsive state management
  const [screenSize, setScreenSize] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');
  const [windowDimensions, setWindowDimensions] = useState({ width: 1024, height: 768 });
 
  // Update screen size and dimensions on resize
  useEffect(() => {
    const updateScreenSize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      setWindowDimensions({ width, height });
 
      if (width < 768) {
        setScreenSize('mobile');
      } else if (width < 1024) {
        setScreenSize('tablet');
      } else {
        setScreenSize('desktop');
      }
    };
 
    // Set initial values
    updateScreenSize();
 
    // Add resize listener
    window.addEventListener('resize', updateScreenSize);
    return () => window.removeEventListener('resize', updateScreenSize);
  }, []);

  // Close language selector when screen size changes to mobile
  useEffect(() => {
    if (screenSize === 'mobile') {
      setIsLanguageSelectorOpen(false);
    }
  }, [screenSize]);
 
  const carouselRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  
  const languageSelectorRef = useRef<HTMLDivElement>(null);
 
  const currentVocabulary = vocabularyData[selectedLanguage];
  const currentSentences = sentenceData[selectedLanguage];
  const currentSentenceData = currentSentences[selectedSentenceIndex];
  
  useEffect(() => {
    if (!currentSentenceData) return;
    setCurrentSentence(new Array(currentSentenceData.template.length).fill(null));
    setFeedback({ type: null, message: '' });
    setIsSentenceComplete(false);
    setSelectedWordForMove(null);
  }, [selectedSentenceIndex, selectedLanguage, currentSentenceData]);
  
  useEffect(() => {
    setCurrentCardIndex(0);
    setSelectedSentenceIndex(0);
    setLearnedWords(new Set());
    setCompletedSentences(new Set());
    setGrammarNotes([]);
    setAccuracy(100);
    setAttempts(0);
    setCorrectAttempts(0);
    setShowCompletionModal(false);
    setLessonCompleted(false);
    if(carouselRef.current) carouselRef.current.scrollLeft = 0;
  }, [selectedLanguage]);

  // Close language selector when clicking outside (mobile only)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (screenSize === 'mobile' && languageSelectorRef.current && !languageSelectorRef.current.contains(event.target as Node)) {
        const target = event.target as HTMLElement;
        // Don't close if clicking on the language toggle button
        if (!target.closest('.language-toggle-button')) {
          setIsLanguageSelectorOpen(false);
        }
      }
    };

    if (screenSize === 'mobile' && isLanguageSelectorOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isLanguageSelectorOpen, screenSize]);
 
  const addGrammarNote = useCallback((tipId: string) => {
      const tip = grammarTips[tipId];
      if (tip && !grammarNotes.some(note => note.id === tipId)) {
          setGrammarNotes(prev => [{ ...tip, language: selectedLanguage }, ...prev]);
      }
  }, [grammarNotes, selectedLanguage]);
  
  const removeGrammarNote = (tipId: string) => {
      setGrammarNotes(prev => prev.filter(note => note.id !== tipId));
  }
 
  const handleSubmitSentence = useCallback(() => {
      setAttempts(prev => prev + 1);
      const isCorrect = currentSentence.every((word, index) => word === currentSentenceData.correctOrder[index]);
      if (isCorrect) {
        setFeedback({ type: 'success', message: 'Correct!' });
        setIsSentenceComplete(true);
        setCorrectAttempts(prev => prev + 1);
        setCompletedSentences(prev => new Set(prev).add(currentSentenceData.id));
        setLearnedWords(prev => new Set([...prev, ...(currentSentence as string[])]));
        
        // Check if this is the last sentence and auto-open completion modal
        const nextIndex = selectedSentenceIndex + 1;
        if (nextIndex >= currentSentences.length) {
          setTimeout(() => {
            setShowCompletionModal(true);
            setLessonCompleted(true);
          }, 1500); // Delay to show "Correct!" message first
        }
      } else {
        setFeedback({ type: 'error', message: 'Not quite right. Try again.' });
        setIsSentenceComplete(false);
        if(currentSentenceData.grammarTipId){
            addGrammarNote(currentSentenceData.grammarTipId);
        }
      }
  }, [currentSentence, currentSentenceData, addGrammarNote, selectedSentenceIndex, currentSentences.length]);
 
  useEffect(() => {
    if (attempts > 0) {
      setAccuracy(Math.round((correctAttempts / attempts) * 100));
    } else {
      setAccuracy(100);
    }
  }, [attempts, correctAttempts]);
  
  const handleLanguageChange = (lang: Language) => {
    if (lang !== selectedLanguage && !transitioningTo) setTransitioningTo(lang);
  };
  const handleTransitionPeak = () => {
    if(transitioningTo) setSelectedLanguage(transitioningTo);
  };
  const handleTransitionEnd = () => setTransitioningTo(null);
 
  const handleDragStart = (word: string, fromIndex: number | null) => {
    setDraggedItem({ word, fromIndex });
  };
 
  const handleDrop = (toIndex: number) => {
    if (!draggedItem) return;
    const { word, fromIndex } = draggedItem;
    const newSentence = [...currentSentence];
    if (fromIndex !== null) {
      const wordAtTarget = newSentence[toIndex];
      newSentence[toIndex] = word;
      newSentence[fromIndex] = wordAtTarget;
    } else {
      newSentence[toIndex] = word;
    }
    setCurrentSentence(newSentence);
    setFeedback({ type: null, message: '' }); 
    setDraggedItem(null);
    setIsDragging(false);
  };
 
  const handleDragOver = (e: React.DragEvent) => e.preventDefault();

  // Touch event handlers for mobile
  const handleTouchStart = (e: React.TouchEvent, word: string, fromIndex: number | null) => {
    const touch = e.touches[0];
    setTouchStartPos({ x: touch.clientX, y: touch.clientY });
    setDraggedItem({ word, fromIndex });
    setIsDragging(false); // Don't set dragging immediately
    // Don't prevent default to allow click events to work
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStartPos || !draggedItem) return;
    
    const touch = e.touches[0];
    const deltaX = Math.abs(touch.clientX - touchStartPos.x);
    const deltaY = Math.abs(touch.clientY - touchStartPos.y);
    
    // Only start dragging if moved more than 10px
    if (deltaX > 10 || deltaY > 10) {
      setIsDragging(true);
      e.preventDefault();
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartPos || !draggedItem) {
      setIsDragging(false);
      setDraggedItem(null);
      setTouchStartPos(null);
      return;
    }

    // If we were dragging, handle drop
    if (isDragging) {
      const touch = e.changedTouches[0];
      const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY);
      
      // Find the sentence slot that was touched
      const slotElement = elementBelow?.closest('[data-slot-index]');
      if (slotElement) {
        const slotIndex = parseInt(slotElement.getAttribute('data-slot-index') || '0');
        handleDrop(slotIndex);
      }
      e.preventDefault();
    }
    
    setIsDragging(false);
    setTouchStartPos(null);
    setDraggedItem(null);
  };

  const handleTouchCancel = () => {
    setIsDragging(false);
    setDraggedItem(null);
    setTouchStartPos(null);
  };

  // Click-to-move functionality for easier mobile interaction
  const handleWordClick = (word: string, fromIndex: number | null) => {
    if (lessonCompleted) return;
    
    // Don't handle click if we were dragging
    if (isDragging) return;
    
    if (selectedWordForMove && selectedWordForMove.word === word && selectedWordForMove.fromIndex === fromIndex) {
      // Deselect if clicking the same word
      setSelectedWordForMove(null);
    } else {
      // Select word for moving
      setSelectedWordForMove({ word, fromIndex });
    }
  };

  const handleSlotClick = (toIndex: number) => {
    if (lessonCompleted) return;
    
    // Don't handle click if we were dragging
    if (isDragging) return;
    
    if (!selectedWordForMove) return;
    
    const { word, fromIndex } = selectedWordForMove;
    const newSentence = [...currentSentence];
    
    if (fromIndex !== null) {
      const wordAtTarget = newSentence[toIndex];
      newSentence[toIndex] = word;
      newSentence[fromIndex] = wordAtTarget;
    } else {
      newSentence[toIndex] = word;
    }
    
    setCurrentSentence(newSentence);
    setFeedback({ type: null, message: '' });
    setSelectedWordForMove(null);
  };
  
  const changeCard = (direction: 'next' | 'prev') => {
      const newIndex = direction === 'next'
          ? (currentCardIndex + 1) % currentVocabulary.length
          : (currentCardIndex - 1 + currentVocabulary.length) % currentVocabulary.length;
      
      cardRefs.current[newIndex]?.scrollIntoView({
          behavior: 'smooth',
          inline: 'center',
          block: 'nearest'
      });
  };
  
  const onCarouselScroll = useCallback(() => {
    if (!carouselRef.current || currentVocabulary.length === 0) return;
    const container = carouselRef.current;
    const scrollLeft = container.scrollLeft;
    const cardWidth = container.scrollWidth / currentVocabulary.length;
    if (cardWidth === 0) return;
    const newIndex = Math.round(scrollLeft / cardWidth);
 
    if (newIndex !== currentCardIndex && newIndex >= 0 && newIndex < currentVocabulary.length) {
        setShowTranslation(false);
        setCurrentCardIndex(newIndex);
    }
  }, [currentCardIndex, currentVocabulary.length]);
 
  const resetSentence = () => {
    setCurrentSentence(new Array(currentSentenceData.template.length).fill(null));
    setFeedback({ type: null, message: '' });
    setIsSentenceComplete(false);
    setSelectedWordForMove(null);
  };
  
  const nextChallenge = () => {
      const nextIndex = selectedSentenceIndex + 1;
      if (nextIndex >= currentSentences.length) {
          // All sentences completed, show completion modal
          setShowCompletionModal(true);
          setLessonCompleted(true);
      } else {
          setSelectedSentenceIndex(nextIndex);
      }
  };
 
  const toggleSection = (section: keyof typeof collapsedSections) => {
    setCollapsedSections(prev => ({...prev, [section]: !prev[section]}));
  };
 
  const handleLessonComplete = () => {
    setShowCompletionModal(false);
    // Reset lesson to start over
    setSelectedSentenceIndex(0);
    setLessonCompleted(false);
    setCurrentSentence(new Array(currentSentenceData.template.length).fill(null));
    setFeedback({ type: null, message: '' });
    setIsSentenceComplete(false);
  };
 
  const dynamicStyles = getStyles(screenSize, windowDimensions);
  const currentCard = currentVocabulary[currentCardIndex];
 
  if (!currentSentenceData || !currentCard) {
      return <div style={{...dynamicStyles.appContainer, ...dynamicStyles.loadingScreen}}>Loading...</div>;
  }
 
  const isSentenceFilled = currentSentence.every(word => word !== null);
 
  return (
    <div style={dynamicStyles.appContainer}>
      {transitioningTo && <LanguageTransition targetLanguage={transitioningTo} onPeak={handleTransitionPeak} onTransitionEnd={handleTransitionEnd} />}
      <LessonCompletionModal
        isOpen={showCompletionModal}
        onClose={handleLessonComplete}
        stats={{
          accuracy,
          attempts,
          correctAttempts,
          completedSentences: completedSentences.size,
          totalSentences: currentSentences.length
        }}
        selectedLanguage={selectedLanguage}
        styles={dynamicStyles}
      />
      
      <header style={dynamicStyles.header}>
        <div style={dynamicStyles.headerTopRow}>
        <h1 style={dynamicStyles.title}>LingoDeck</h1>
          <div style={dynamicStyles.headerActions}>
            {screenSize === 'mobile' && (
            <button
                onClick={() => setIsLanguageSelectorOpen(!isLanguageSelectorOpen)}
                className="language-toggle-button"
                style={{...dynamicStyles.tutorialButton, ...(isLanguageSelectorOpen ? dynamicStyles.languageToggleActive : {})}}
                title="Select Language"
              >
                <FaGlobe size={18} />
            </button>
            )}

            <div style={{position: 'relative'}}>
              <button
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                style={dynamicStyles.profileButton}
                title="Profile Menu"
              >
                <FaUser size={16} />
              </button>
              <ProfileDropdown
                isOpen={isProfileDropdownOpen}
                onClose={() => setIsProfileDropdownOpen(false)}
                onLogout={handleLogout}
                userEmail={userEmail}
                styles={dynamicStyles}
              />
            </div>
        </div>
        </div>
        {(screenSize !== 'mobile' || isLanguageSelectorOpen) && (
          <div ref={languageSelectorRef} style={dynamicStyles.languageSelector}>
            {(Object.keys(languageAssets) as Language[]).map(lang => (
              <button key={lang} onClick={() => {
                handleLanguageChange(lang);
                if (screenSize === 'mobile') {
                  setIsLanguageSelectorOpen(false);
                }
              }} disabled={!!transitioningTo} style={{...dynamicStyles.languageButton, ...(selectedLanguage === lang ? dynamicStyles.languageButtonActive : {})}}>
                <FlagSVG country={languageAssets[lang].flag} size={20} /> <span style={dynamicStyles.langLabel}>{lang}</span>
              </button>
            ))}
          </div>
        )}
      </header>
      
      <main style={dynamicStyles.mainContent}>
        <div style={dynamicStyles.leftPanel}>
           <CollapsiblePanel title="Vocabulary Cards" isCollapsed={collapsedSections.flashcards} onToggle={() => toggleSection('flashcards')} styles={dynamicStyles}>
              <div ref={carouselRef} onScroll={onCarouselScroll} className="flashcard-carousel-wrapper" style={dynamicStyles.flashcardCarouselWrapper}>
                  {currentVocabulary.map((card, index) => (
                     <FlashcardItem
                        ref={(el: HTMLDivElement | null) => { cardRefs.current[index] = el; return undefined; }}
                        key={card.id}
                        card={card}
                        isCurrent={card.id === currentCard.id}
                        styles={dynamicStyles}
                        showTranslation={showTranslation}
                        onFlip={() => setShowTranslation(p => !p)}
                        screenSize={screenSize}
                      />
                  ))}
              </div>
              <div style={dynamicStyles.cardControls}>
                  <button style={dynamicStyles.controlButton} onClick={() => changeCard('prev')} aria-label="Previous card">
                    <FaChevronLeft size={20} />
                  </button>
                  <span style={dynamicStyles.cardCounter}>{currentCardIndex + 1} / {currentVocabulary.length}</span>
                  <button style={dynamicStyles.controlButton} onClick={() => changeCard('next')} aria-label="Next card">
                    <FaChevronRight size={20} />
                  </button>
              </div>
          </CollapsiblePanel>
 
          <CollapsiblePanel title="Grammar Tips" isCollapsed={collapsedSections.grammar} onToggle={() => toggleSection('grammar')} styles={dynamicStyles} size="small">
            <div style={dynamicStyles.grammarFeedbackContainer}>
              {grammarNotes.length === 0 ? (
                <p style={dynamicStyles.noGrammarNotes}>No feedback yet. Keep practicing!</p>
              ) : (
                <ul style={dynamicStyles.grammarNoteList}>
                  {grammarNotes.map(note => (
                    <li key={note.id} style={dynamicStyles.grammarNoteItem}>
                      <div style={dynamicStyles.grammarNoteHeader}>
                        <strong style={dynamicStyles.grammarNoteRule}><FlagSVG country={languageAssets[note.language].flag} size={16} /> {note.rule}</strong>
                        <button className="grammar-note-dismiss" style={dynamicStyles.grammarNoteDismiss} onClick={() => removeGrammarNote(note.id)} title="Dismiss tip">✓</button>
                      </div>
                      <p style={dynamicStyles.grammarNoteExample}>{note.example}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </CollapsiblePanel>
        </div>
        
        <div style={dynamicStyles.rightPanel}>
          <CollapsiblePanel title="Sentence Builder" isCollapsed={collapsedSections.sentences} onToggle={() => toggleSection('sentences')} styles={dynamicStyles}>
               <div style={dynamicStyles.sentenceBuilder}>
                  <p style={dynamicStyles.translationHint}>
                    Construct the sentence: "{currentSentenceData.translation}"
                    {screenSize === 'mobile' && (
                      <><br /><span style={{fontSize: '0.8rem', opacity: 0.8}}>
                        Tap words to select, then tap slots to place them
                      </span></>
                    )}
                  </p>
                  <div style={dynamicStyles.sentenceArea} onDragOver={handleDragOver}>
                      {currentSentence.map((word, index) => (
                        <div 
                          key={index} 
                          data-slot-index={index}
                          className={`${selectedWordForMove?.word === word && selectedWordForMove?.fromIndex === index ? 'selected-word' : ''} ${selectedWordForMove && !word ? 'target-slot' : ''}`}
                          onDrop={() => handleDrop(index)} 
                          onClick={() => word ? handleWordClick(word, index) : handleSlotClick(index)}
                          style={{
                            ...dynamicStyles.sentenceSlot, 
                            ...(word ? dynamicStyles.filledSlot : {}),
                            ...(isDragging && draggedItem?.word === word ? { opacity: 0.5, transform: 'scale(1.05)' } : {}),
                            ...(selectedWordForMove?.word === word && selectedWordForMove?.fromIndex === index ? { 
                              boxShadow: `0 0 0 3px ${dynamicStyles.theme.colors.accent}`,
                              borderWidth: '2px',
                              borderStyle: 'solid',
                              borderColor: dynamicStyles.theme.colors.accent 
                            } : {}),
                            ...(selectedWordForMove && !word ? { 
                              backgroundColor: dynamicStyles.theme.colors.accentLight,
                              borderWidth: '2px',
                              borderStyle: 'dashed',
                              borderColor: dynamicStyles.theme.colors.accent
                            } : {})
                          }} 
                          onDragStart={() => handleDragStart(word!, index)} 
                          onTouchStart={(e) => word && !lessonCompleted && handleTouchStart(e, word, index)}
                          onTouchMove={handleTouchMove}
                          onTouchEnd={handleTouchEnd}
                          onTouchCancel={handleTouchCancel}
                          draggable={!!word && !lessonCompleted}
                        >
                          {word}
                        </div>
                      ))}
                  </div>
                  
                  <div style={dynamicStyles.feedbackContainer}>
                    {feedback.type && (
                        <div style={{...dynamicStyles.feedback, ...(feedback.type === 'success' ? dynamicStyles.successFeedback : dynamicStyles.errorFeedback)}} aria-live="polite">
                        {feedback.message}
                        </div>
                    )}
                  </div>
 
                  <h3 style={dynamicStyles.wordBankTitle}>Word Bank</h3>
                   <div style={dynamicStyles.wordBank}>
                      {currentSentenceData.wordBank.map(word => (
                      <div 
                        key={word} 
                        className={selectedWordForMove?.word === word && selectedWordForMove?.fromIndex === null ? 'selected-word' : ''}
                        draggable={!lessonCompleted} 
                        onDragStart={() => handleDragStart(word, null)} 
                        onClick={() => handleWordClick(word, null)}
                        onTouchStart={(e) => !lessonCompleted && handleTouchStart(e, word, null)}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                        onTouchCancel={handleTouchCancel}
                        style={{
                          ...dynamicStyles.draggableWord, 
                          ...(draggedItem?.word === word ? dynamicStyles.draggableWordActive : {}), 
                          ...(lessonCompleted ? { cursor: 'not-allowed', opacity: 0.5 } : {}),
                          ...(isDragging && draggedItem?.word === word ? { opacity: 0.5, transform: 'scale(1.05)' } : {}),
                          ...(selectedWordForMove?.word === word && selectedWordForMove?.fromIndex === null ? { 
                            boxShadow: `0 0 0 3px ${dynamicStyles.theme.colors.accent}`,
                            borderWidth: '1px',
                            borderStyle: 'solid',
                            borderColor: dynamicStyles.theme.colors.accent,
                            transform: 'scale(1.05)'
                          } : {})
                        }}
                      >
                          {word}
                      </div>
                      ))}
                  </div>
                   <div style={dynamicStyles.sentenceControls}>
                      <button style={dynamicStyles.secondaryButton} onClick={resetSentence}>Reset</button>
                      {isSentenceComplete ? (
                          // Only show Next Challenge if it's not the last sentence
                          selectedSentenceIndex + 1 < currentSentences.length ? (
                          <button className="primary-button" style={dynamicStyles.primaryButton} onClick={nextChallenge}>Next Challenge →</button>
                      ) : (
                              <div style={{...dynamicStyles.primaryButton, backgroundColor: dynamicStyles.theme.colors.success, cursor: 'default', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem'}}>
                                  Lesson Complete! <FaStar style={{color: '#ffffff'}} />
                              </div>
                          )
                      ) : (
                          <button 
                            className="primary-button" 
                            style={{
                              ...dynamicStyles.primaryButton,
                              ...((!isSentenceFilled) ? {
                                backgroundColor: '#e9ecef',
                                color: '#6c757d',
                                cursor: 'not-allowed'
                              } : {})
                            }} 
                            onClick={handleSubmitSentence} 
                            disabled={!isSentenceFilled}
                          >
                            Check Answer
                          </button>
                      )}
                  </div>
              </div>
          </CollapsiblePanel>
          
           <CollapsiblePanel title="Lesson Progress" isCollapsed={collapsedSections.progress} onToggle={() => toggleSection('progress')} styles={dynamicStyles} size="small">
             <div style={dynamicStyles.progressContainer}>
                <ProgressBar label="Words Learned" value={learnedWords.size} max={currentVocabulary.length} styles={dynamicStyles} />
                <ProgressBar label="Sentences Mastered" value={completedSentences.size} max={currentSentences.length} styles={dynamicStyles} color={dynamicStyles.theme.colors.success} />
                <ProgressBar label="Accuracy" value={accuracy} max={100} unit="%" styles={dynamicStyles} color={accuracy > 75 ? dynamicStyles.theme.colors.success : accuracy > 50 ? dynamicStyles.theme.colors.warning : dynamicStyles.theme.colors.error} />
              </div>
           </CollapsiblePanel>
        </div>
      </main>
      <Footer styles={dynamicStyles} />
    </div>
  );
}
 
// --- SUB-COMPONENTS ---

const LessonCompletionModal = ({ isOpen, onClose, stats, selectedLanguage, styles }: {
    isOpen: boolean;
    onClose: () => void;
    stats: { accuracy: number; attempts: number; correctAttempts: number; completedSentences: number; totalSentences: number };
    selectedLanguage: Language;
    styles: any;
}) => {
    // Prevent background scrolling when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            } else {
            document.body.style.overflow = 'unset';
        }
        
        // Cleanup on unmount
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const getScoreColor = (accuracy: number) => {
        if (accuracy >= 90) return styles.theme.colors.success;
        if (accuracy >= 75) return '#f59e0b';
        return styles.theme.colors.error;
    };

    const getPerformanceMessage = (accuracy: number) => {
        if (accuracy >= 90) return (
            <span style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem'}}>
                Excellent work! <FaStar style={{color: '#fbbf24'}} />
            </span>
        );
        if (accuracy >= 75) return (
            <span style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem'}}>
                Good job! Keep practicing! <FaHeart style={{color: '#ef4444'}} />
            </span>
        );
        return (
            <span style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem'}}>
                Nice try! Practice makes perfect! <FaBookmark style={{color: '#3b82f6'}} />
            </span>
        );
    };

        return (
        <div style={styles.modalOverlay}>
            <div style={styles.completionModal}>
                <div style={styles.completionHeader}>
                    <div style={styles.completionIcon}>
                        <FaStar size={48} style={{color: '#fbbf24'}} />
                </div>
                    <h2 style={styles.completionTitle}>Lesson Complete!</h2>
                    <p style={styles.completionSubtitle}>
                        You've completed all {selectedLanguage} sentence exercises!
                    </p>
            </div>

                <div style={styles.statsContainer}>
                    <div style={styles.statItem}>
                        <div style={{...styles.statValue, color: getScoreColor(stats.accuracy)}}>{stats.accuracy}%</div>
                        <div style={styles.statLabel}>Accuracy</div>
                    </div>
                    <div style={styles.statItem}>
                        <div style={styles.statValue}>{stats.correctAttempts}/{stats.attempts}</div>
                        <div style={styles.statLabel}>Correct Answers</div>
                    </div>
                    <div style={styles.statItem}>
                        <div style={styles.statValue}>{stats.completedSentences}/{stats.totalSentences}</div>
                        <div style={styles.statLabel}>Sentences Completed</div>
                    </div>
                </div>

                <div style={styles.performanceMessage}>
                    {getPerformanceMessage(stats.accuracy)}
            </div>
 
                <div style={styles.completionActions}>
                        <button
                            style={styles.modalSecondaryButton}
                        onClick={() => {
                            // Reset to first sentence
                            onClose();
                        }}
                    >
                        Practice Again
                        </button>
                            <button
                                className="primary-button"
                                style={styles.modalPrimaryButton}
                        onClick={onClose}
                            >
                        Continue Learning
                            </button>
                    </div>
            </div>
        </div>
    );
};
 
const CollapsiblePanel = React.forwardRef<HTMLElement, any>(({ title, isCollapsed, onToggle, children, styles, size = 'normal' }, ref) => {
    const expandedStyle = size === 'small' ? styles.panelExpandedSmall : styles.panelExpanded;
    return (
        <section ref={ref} style={{...styles.panel, ...(!isCollapsed ? expandedStyle : {})}}>
            <h2 style={styles.panelTitle} onClick={onToggle} role="button" aria-expanded={!isCollapsed}>
                <span>{title}</span>
                <span style={{...styles.collapseIcon, ...(isCollapsed ? {} : styles.collapseIconActive)}}>
                    <FaChevronDown size={16} />
                </span>
            </h2>
            <div style={{...styles.collapsibleContentContainer, ...(!isCollapsed ? styles.collapsibleContentContainerExpanded : {})}}>
                <div style={{...styles.collapsibleContentInner, ...(!isCollapsed ? styles.collapsibleContentInnerExpanded : {})}}>
                    {!isCollapsed && children}
                </div>
            </div>
        </section>
    );
});
CollapsiblePanel.displayName = 'CollapsiblePanel';
 
 
const FlashcardItem = React.forwardRef<HTMLDivElement, any>(({ card, isCurrent, showTranslation, onFlip, styles, screenSize }, ref) => {
    const isMobile = screenSize === 'mobile';
    return (
        <div ref={ref} style={styles.flashcardContainer}>
            <div style={{...styles.flashcard, ...(isCurrent ? styles.flashcardCurrent : {})}}>
                <div style={{...styles.flashcardInner, ...(showTranslation && isCurrent ? styles.flashcardInnerFlipped : {})}} onClick={isCurrent ? onFlip : undefined}>
                    <div style={{...styles.flashcardFace, ...styles.flashcardFront}}>
                        <div style={styles.cardImage}><VocabularySVG type={card.image} size={isMobile ? 60 : 80} /></div>
                        <div style={styles.cardWord}>{card.word}</div>
                        <div style={styles.cardCategory}>{card.category}</div>
                    </div>
                    <div style={{...styles.flashcardFace, ...styles.flashcardBack}}>
                        <div style={styles.cardTranslation}>{card.translation}</div>
                        <div style={styles.cardCategory}>{card.category}</div>
                    </div>
                </div>
            </div>
        </div>
    );
});
FlashcardItem.displayName = 'FlashcardItem';
 
const ProgressBar = ({ label, value, max, unit = '', styles, color }: any) => {
    const [animatedValue, setAnimatedValue] = useState(0);
 
    useEffect(() => {
        const timeout = setTimeout(() => setAnimatedValue(value), 100);
        return () => clearTimeout(timeout);
    }, [value]);
 
    return (
        <div style={styles.progressItem}>
            <div style={styles.progressLabel}>
                <span style={styles.progressTitle}>{label}</span>
                <span style={styles.progressValue}>{value}{unit} / {max}{unit}</span>
            </div>
            <div style={styles.progressBar}>
                <div style={{ ...styles.progressFill, width: `${(animatedValue / max) * 100}%`, backgroundColor: color || styles.theme.colors.accent }} />
            </div>
        </div>
    );
};
 
const Footer = ({ styles }: { styles: any }) => {
    const currentYear = new Date().getFullYear();
 
    return (
        <footer style={styles.footer}>
            <div style={styles.footerContainer}>
                <div style={styles.footerContent}>
                    <div style={styles.footerBrand}>
                        <div style={styles.footerLogo}>L</div>
                        <div style={styles.footerBrandText}>
                            <h3 style={styles.footerBrandName}>LingoDeck</h3>
                            <p style={styles.footerBrandTagline}>Master languages with interactive learning</p>
                        </div>
                    </div>
                    
                    <div style={styles.footerLinks}>
                        <a href="#" style={styles.footerLink}>About</a>
                        <a href="#" style={styles.footerLink}>Features</a>
                        <a href="#" style={styles.footerLink}>Languages</a>
                        <a href="#" style={styles.footerLink}>Support</a>
                    </div>
                </div>
 
                <div style={styles.footerBottom}>
                    <p style={styles.footerCopyright}>
                        © {currentYear} LingoDeck. All rights reserved.
                    </p>
                    <div style={styles.footerBottomLinks}>
                        <a href="#" style={styles.footerBottomLink}>Privacy</a>
                        <span style={styles.footerSeparator}>•</span>
                        <a href="#" style={styles.footerBottomLink}>Terms</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};
 
 
const LanguageTransition = ({ targetLanguage, onPeak, onTransitionEnd }: { targetLanguage: Language, onPeak: () => void, onTransitionEnd: () => void }) => {
    const [animationStage, setAnimationStage] = useState<'start' | 'peaked' | 'end'>('start');
    const { color, flag } = languageAssets[targetLanguage];
    
    useEffect(() => {
        const keyframesId = 'wave-keyframes';
        if (!document.getElementById(keyframesId)) {
            const style = document.createElement('style');
            style.id = keyframesId;
            style.innerHTML = `@keyframes wave-move { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }`;
            document.head.appendChild(style);
        }
        const riseTimer = setTimeout(() => { setAnimationStage('peaked'); onPeak(); }, 50);
        const peakTimer = setTimeout(() => setAnimationStage('end'), 1300);
        const fallTimer = setTimeout(onTransitionEnd, 2000);
        return () => { clearTimeout(riseTimer); clearTimeout(peakTimer); clearTimeout(fallTimer); };
    }, [onPeak, onTransitionEnd]);
    
    const overlayStyle: CSSProperties = { position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 100, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'center', color: 'white', overflow: 'hidden' };
    const waveContainerStyle: CSSProperties = { position: 'absolute', bottom: 0, left: 0, width: '100%', height: '110%', transform: animationStage === 'start' ? 'translateY(100%)' : animationStage === 'peaked' ? 'translateY(0)' : 'translateY(100%)', transition: `transform 0.7s ${animationStage === 'peaked' ? 'cubic-bezier(0.25, 0.46, 0.45, 0.94)' : 'cubic-bezier(0.55, 0.085, 0.68, 0.53)'}`, backgroundColor: color, };
    const waveStyle: CSSProperties = { position: 'absolute', bottom: '99%', left: 0, width: '200%', height: '120px', animation: 'wave-move 10s linear infinite' };
    const contentStyle: CSSProperties = { position: 'relative', opacity: animationStage === 'peaked' ? 1 : 0, transform: animationStage === 'peaked' ? 'translateY(0)' : 'translateY(20px)', transition: 'opacity 0.5s ease-out 0.4s, transform 0.5s ease-out 0.4s', textAlign: 'center', marginBottom: '40vh', };
    
    return (
        <div style={overlayStyle}>
            <div style={waveContainerStyle}>
                <div style={{...waveStyle, animationDuration: '12s', opacity: 0.3, fill: color}}><svg width="100%" height="100%" viewBox="0 0 1440 120" preserveAspectRatio="none"><path d="M0,64 C240,112 480,112 720,64 S1200,16 1440,64 V120 H0 Z"></path></svg></div>
                <div style={{...waveStyle, animationDuration: '10s', animationDirection: 'reverse', opacity: 0.5, fill: color}}><svg width="100%" height="100%" viewBox="0 0 1440 120" preserveAspectRatio="none"><path d="M0,80 C240,32 480,32 720,80 S1200,128 1440,80 V120 H0 Z"></path></svg></div>
                <div style={{...waveStyle, animationDuration: '8s', opacity: 1, fill: color}}><svg width="100%" height="100%" viewBox="0 0 1440 120" preserveAspectRatio="none"><path d="M0,96 C240,144 480,144 720,96 S1200,48 1440,96 V120 H0 Z"></path></svg></div>
            </div>
            <div style={contentStyle}>
                <div style={{ fontSize: '6rem' }}><FlagSVG country={flag} size={120} /></div>
                <h2 style={{ fontSize: '3rem', fontWeight: 700, margin: 0, textTransform: 'capitalize', textShadow: '0 2px 8px rgba(0,0,0,0.2)' }}>{targetLanguage}</h2>
            </div>
        </div>
    );
};
 
// --- STYLING OBJECT ---
const getStyles = (
  screenSize: 'mobile' | 'tablet' | 'desktop',
  windowDimensions: { width: number; height: number }
): { [key: string]: CSSProperties, theme: any } => {
    const isMobile = screenSize === 'mobile';
    const isTablet = screenSize === 'tablet';
    const theme = {
        colors: {
            background: '#f8f9fa',
            panel: '#ffffff',
            border: '#e9ecef',
            text: '#212529',
            textLight: '#6c757d',
            accent: '#007bff',
            accentLight: 'rgba(0, 123, 255, 0.1)',
            secondary: '#6c757d',
            success: '#28a745',
            error: '#dc3545',
            warning: '#ffc107',
            gradientStart: '#1A2980',
            gradientEnd: '#26D0CE',
        },
        shadows: {
            soft: '0 4px 12px rgba(0, 0, 0, 0.05)',
            medium: '0 8px 24px rgba(0, 0, 0, 0.1)',
            hard: '0 10px 30px rgba(0, 0, 0, 0.2)',
        },
        borderRadius: '12px',
        fontFamily: '"Poppins", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    };
 
    return {
        theme,
        appContainer: { minHeight: '100vh', backgroundColor: theme.colors.background, color: theme.colors.text, fontFamily: theme.fontFamily, display: 'flex', flexDirection: 'column' },
        loadingScreen: { display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: isMobile ? '1.5rem' : '2rem' },
        header: {
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            alignItems: isMobile ? 'stretch' : 'center',
            justifyContent: isMobile ? 'flex-start' : 'space-between',
            padding: isMobile ? '1rem 1rem' : '1rem 2rem',
            backgroundColor: theme.colors.panel,
            borderBottom: `1px solid ${theme.colors.border}`,
            position: 'sticky',
            top: 0,
            zIndex: 50,
            gap: isMobile ? '0.75rem' : '1rem',
            minHeight: isMobile ? 'auto' : '81px'
        },
        headerTopRow: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            order: isMobile ? 1 : 0
        },
        headerActions: {
            display: 'flex',
            alignItems: 'center',
            gap: isMobile ? '0.75rem' : '1rem'
        },
        languageToggleActive: {
            backgroundColor: theme.colors.accentLight,
            color: theme.colors.accent,
            border: `1px solid ${theme.colors.accent}`
        },
        title: {
            fontSize: isMobile ? '1.4rem' : '1.5rem',
            fontWeight: 600,
            color: theme.colors.accent,
            margin: 0,
            textAlign: 'left'
        },
        languageSelector: {
            display: 'flex',
            gap: isMobile ? '0.5rem' : '0.5rem',
            alignItems: 'center',
            position: isMobile ? 'static' : 'absolute',
            left: isMobile ? 'auto' : '50%',
            transform: isMobile ? 'none' : 'translateX(-50%)',
            order: isMobile ? 2 : 0,
            width: isMobile ? '100%' : 'auto',
            justifyContent: isMobile ? 'center' : 'flex-start'
        },
        languageButton: {
            display: 'flex',
            alignItems: 'center',
            gap: isMobile ? '0.25rem' : '0.5rem',
            padding: isMobile ? '0.375rem 0.75rem' : '0.5rem 1rem',
            backgroundColor: 'transparent',
            border: '1px solid transparent',
            color: theme.colors.textLight,
            borderRadius: theme.borderRadius,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            fontWeight: 500,
            fontSize: isMobile ? '0.8rem' : '0.9rem',
            minHeight: '44px' // Ensure touch-friendly size
        },
        languageButtonActive: { color: theme.colors.accent, backgroundColor: theme.colors.accentLight },
        langLabel: { display: isMobile ? 'none' : 'inline' },
        userAvatar: {
            width: isMobile ? '36px' : '40px',
            height: isMobile ? '36px' : '40px',
            borderRadius: '50%',
            backgroundColor: theme.colors.accent,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 600,
            color: 'white'
        },
        tutorialButton: {
            backgroundColor: 'transparent',
            border: `1px solid ${theme.colors.border}`,
            color: theme.colors.textLight,
            width: isMobile ? '36px' : '40px',
            height: isMobile ? '36px' : '40px',
            borderRadius: '50%',
            cursor: 'pointer',
            fontSize: isMobile ? '1rem' : '1.2rem',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '44px', // Touch-friendly
            minWidth: '44px'
        },
 
        // Profile Button & Dropdown Styles
        profileButton: {
            position: 'relative',
            width: isMobile ? '36px' : '40px',
            height: isMobile ? '36px' : '40px',
            borderRadius: '50%',
            backgroundColor: theme.colors.panel,
            border: `2px solid ${theme.colors.border}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            color: theme.colors.accent,
            boxShadow: theme.shadows.soft,
            minHeight: '44px', // Touch-friendly
            minWidth: '44px',
            order: isMobile ? 3 : 0
        },
        profileIndicator: {
            position: 'absolute',
            top: '2px',
            right: '2px',
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            backgroundColor: '#22c55e',
            border: '2px solid white',
            boxShadow: '0 0 0 1px rgba(0,0,0,0.1)'
        },
        profileDropdown: {
            position: 'absolute',
            top: isMobile ? '45px' : '50px',
            right: '0',
            width: isMobile ? '260px' : '280px',
            backgroundColor: theme.colors.panel,
            borderRadius: '12px',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
            border: `1px solid ${theme.colors.border}`,
            zIndex: 1000,
            overflow: 'hidden',
            maxWidth: isMobile ? 'calc(100vw - 2rem)' : '280px'
        },
        profileDropdownHeader: {
            padding: '20px',
            borderBottom: `1px solid ${theme.colors.border}`
        },
        profileHeaderInfo: {
            display: 'flex',
            flexDirection: 'column',
            gap: '4px'
        },
        profileName: {
            fontSize: '16px',
            fontWeight: 600,
            color: theme.colors.text,
            margin: 0
        },
        profileEmail: {
            fontSize: '14px',
            color: theme.colors.textLight,
            margin: 0
        },
        profileDropdownMenu: {
            padding: '8px'
        },
        profileMenuItem: {
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px 16px',
            backgroundColor: 'transparent',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 500,
            color: theme.colors.text,
            transition: 'all 0.2s ease',
            textAlign: 'left'
        },
        profileMenuItemDanger: {
            color: '#ef4444'
        },
        profileDropdownDivider: {
            height: '1px',
            backgroundColor: theme.colors.border,
            margin: '8px 0'
        },
        
        mainContent: {
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : isTablet ? '1fr' : '1fr 1fr',
            gap: isMobile ? '1rem' : '2rem',
            padding: isMobile ? '1rem' : '2rem',
            alignItems: 'start',
            flex: 1
        },
        leftPanel: {
            display: 'flex',
            flexDirection: 'column',
            gap: isMobile ? '1rem' : '2rem'
        },
        rightPanel: {
            position: isMobile || isTablet ? 'static' : 'sticky',
            top: 'calc(2rem + 81px)',
            display: 'flex',
            flexDirection: 'column',
            gap: isMobile ? '1rem' : '2rem'
        },
        
        panel: {
            backgroundColor: theme.colors.panel,
            border: `1px solid ${theme.colors.border}`,
            borderRadius: '16px',
            boxShadow: theme.shadows.soft,
            display: 'flex',
            flexDirection: 'column'
        },
        panelExpanded: {
            minHeight: isMobile ? '500px' : '600px',
            height: isMobile ? '500px' : '600px'
        },
        panelExpandedSmall: {
            minHeight: isMobile ? '250px' : '300px',
            height: isMobile ? '250px' : '300px'
        },
        panelTitle: {
            fontSize: isMobile ? '1.1rem' : '1.2rem',
            fontWeight: 600,
            color: theme.colors.text,
            margin: 0,
            padding: isMobile ? '1.25rem 1rem' : '1.5rem 1.5rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            cursor: 'pointer',
            minHeight: isMobile ? '60px' : '70px',
            boxSizing: 'border-box'
        },
        
        collapseIcon: { fontSize: '1rem', color: theme.colors.textLight, transition: 'transform 0.3s ease', transform: 'rotate(-90deg)' },
        collapseIconActive: { transform: 'rotate(0deg)'},
        collapsibleContentContainer: { 
            display: 'grid', 
            gridTemplateRows: '0fr', 
            transition: 'grid-template-rows 0.4s ease-out',
            overflow: 'hidden'
        },
        collapsibleContentContainerExpanded: { 
            gridTemplateRows: '1fr',
            flex: 1
        },
        collapsibleContentInner: {
            overflow: 'hidden',
            minHeight: 0
        },
        collapsibleContentInnerExpanded: {
            paddingTop: '0',
            paddingLeft: isMobile ? '1rem' : '1.5rem',
            paddingRight: isMobile ? '1rem' : '1.5rem',
            paddingBottom: isMobile ? '1rem' : '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            width: '100%',
            maxWidth: '100%',
            boxSizing: 'border-box',
            overflow: 'hidden'
        },
 
        flashcardCarouselWrapper: {
            display: 'flex',
            overflowX: 'auto',
            scrollSnapType: 'x mandatory',
            padding: 0,
            margin: 0,
            flex: 1,
            minHeight: isMobile ? '360px' : '420px',
            alignItems: 'center',
            justifyContent: 'flex-start'
        },
        flashcardContainer: {
            flex: '0 0 100%',
            width: '100%',
            height: isMobile ? '360px' : '420px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            scrollSnapAlign: 'center',
            scrollSnapStop: 'always',
            padding: 0,
            margin: 0,
            boxSizing: 'border-box'
        },
        flashcard: {
            width: isMobile ? '280px' : '320px',
            height: isMobile ? '280px' : '320px',
            minWidth: isMobile ? '280px' : '320px',
            minHeight: isMobile ? '280px' : '320px',
            maxWidth: isMobile ? '280px' : '320px',
            maxHeight: isMobile ? '280px' : '320px',
            transition: 'transform 0.5s ease, opacity 0.5s ease',
            flexShrink: 0,
            position: 'relative',
            margin: 0,
            padding: 0
        },
        flashcardCurrent: { transform: 'scale(1)', opacity: 1 },
        flashcardInner: { position: 'relative', width: '100%', height: '100%', transformStyle: 'preserve-3d', transition: 'transform 0.6s' },
        flashcardInnerFlipped: { transform: 'rotateY(180deg)' },
        flashcardFace: {
            position: 'absolute',
            top: 0,
            left: 0,
            width: isMobile ? '280px' : '320px',
            height: isMobile ? '280px' : '320px',
            minWidth: isMobile ? '280px' : '320px',
            minHeight: isMobile ? '280px' : '320px',
            maxWidth: isMobile ? '280px' : '320px',
            maxHeight: isMobile ? '280px' : '320px',
            backfaceVisibility: 'hidden',
            borderRadius: '16px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: isMobile ? '1.5rem' : '2rem',
            border: `1px solid ${theme.colors.border}`,
            boxShadow: `0 8px 24px rgba(0, 102, 204, 0.15)`,
            cursor: 'pointer',
            boxSizing: 'border-box',
            margin: 0
        },
        flashcardFront: { backgroundColor: theme.colors.panel },
        flashcardBack: { backgroundColor: theme.colors.accent, color: 'white', transform: 'rotateY(180deg)' },
        cardImage: {
            position: 'absolute',
            top: isMobile ? '60px' : '70px',
            left: '50%',
            transform: 'translateX(-50%)',
            color: theme.colors.accent,
            backgroundColor: '#ffffff',
            padding: isMobile ? '0.75rem' : '1rem',
            borderRadius: '12px',
            border: `2px solid ${theme.colors.accent}`,
            width: isMobile ? '80px' : '100px',
            height: isMobile ? '80px' : '100px',
            minWidth: isMobile ? '80px' : '100px',
            minHeight: isMobile ? '80px' : '100px',
            maxWidth: isMobile ? '80px' : '100px',
            maxHeight: isMobile ? '80px' : '100px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            boxSizing: 'border-box'
        },
        cardWord: {
            position: 'absolute',
            top: isMobile ? '170px' : '190px',
            left: '50%',
            transform: 'translateX(-50%)',
            fontSize: isMobile ? '1.5rem' : '2rem',
            fontWeight: 700,
            color: theme.colors.text,
            textAlign: 'center',
            lineHeight: 1.2,
            width: '90%',
            maxWidth: '90%',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
        },
        cardTranslation: {
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            fontSize: isMobile ? '1.5rem' : '2rem',
            fontWeight: 600,
            textAlign: 'center',
            lineHeight: 1.2,
            width: '90%',
            maxWidth: '90%',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
        },
        cardCategory: {
            position: 'absolute',
            top: isMobile ? '0.75rem' : '1rem',
            right: isMobile ? '0.75rem' : '1rem',
            backgroundColor: '#f0f0f0',
            color: theme.colors.text,
            padding: isMobile ? '0.2rem 0.5rem' : '0.25rem 0.75rem',
            borderRadius: '99px',
            fontSize: isMobile ? '0.65rem' : '0.75rem',
            border: `1px solid ${theme.colors.border}`
        },
        cardControls: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: isMobile ? '0.75rem' : '1rem',
            width: '100%',
            marginTop: isMobile ? '1rem' : '1.5rem'
        },
        controlButton: {
            width: isMobile ? '2.5rem' : '3rem',
            height: isMobile ? '2.5rem' : '3rem',
            borderRadius: '50%',
            border: `1px solid ${theme.colors.border}`,
            backgroundColor: theme.colors.panel,
            color: theme.colors.text,
            fontSize: isMobile ? '1.25rem' : '1.5rem',
            cursor: 'pointer',
            transition: 'all 0.2s',
            minHeight: '44px', // Touch-friendly
            minWidth: '44px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        },
        cardCounter: {
            fontSize: isMobile ? '0.9rem' : '1rem',
            color: theme.colors.textLight,
            fontWeight: 500,
            minWidth: isMobile ? '40px' : '50px',
            textAlign: 'center'
        },
 
        sentenceBuilder: {
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            overflow: isMobile ? 'auto' : 'visible'
        },
        translationHint: {
            fontSize: isMobile ? '0.85rem' : '0.9rem',
            color: theme.colors.textLight,
            textAlign: 'center',
            lineHeight: 1.4,
            padding: isMobile ? '0 0.5rem 1rem 0.5rem' : '0 0 1rem 0',
            margin: 0,
            flexShrink: 0
        },
        sentenceArea: {
            display: 'flex',
            gap: isMobile ? '0.5rem' : '0.75rem',
            flexWrap: 'wrap',
            padding: isMobile ? '0.75rem 0.5rem' : '1.4rem 1rem',
            backgroundColor: theme.colors.background,
            borderRadius: '8px',
            height: isMobile ? '100px' : '140px',
            alignItems: 'center',
            justifyContent: isMobile ? 'space-evenly' : 'center',
            alignContent: isMobile ? 'center' : 'normal',
            border: `1px solid ${theme.colors.border}`,
            flexShrink: 0,
            margin: 0
        },
        sentenceSlot: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: isMobile ? '44px' : '52px',
            minWidth: isMobile ? '70px' : '80px',
            padding: isMobile ? '0.5rem 0.75rem' : '0.5rem 1rem',
            backgroundColor: theme.colors.panel,
            borderRadius: isMobile ? '12px' : '8px',
            textAlign: 'center',
            fontSize: isMobile ? '0.9rem' : '1rem',
            fontWeight: 500,
            color: theme.colors.textLight,
            borderWidth: '2px',
            borderStyle: 'dashed',
            borderColor: theme.colors.border,
            transition: 'all 0.2s ease',
            flex: isMobile ? '1 1 0' : 'none',
            maxWidth: isMobile ? '110px' : 'none'
        },
        filledSlot: {
            cursor: 'grab',
            backgroundColor: theme.colors.accentLight,
            borderColor: theme.colors.accent,
            color: theme.colors.accent,
            borderStyle: 'solid',
            fontWeight: 600,
            borderRadius: isMobile ? '12px' : '8px',
            boxShadow: theme.shadows.soft
        },
        wordBankTitle: {
            fontSize: isMobile ? '0.75rem' : '0.8rem',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            color: theme.colors.textLight,
            textAlign: 'center',
            margin: 0,
            padding: isMobile ? '0.375rem 0 0.375rem 0' : '0.75rem 0 0.75rem 0',
            flexShrink: 0
        },
        wordBank: {
            display: 'flex',
            flexWrap: 'wrap',
            gap: isMobile ? '0.5rem' : '0.75rem',
            justifyContent: 'center',
            alignItems: 'center',
            padding: isMobile ? '0.75rem 0.75rem' : '1rem 1rem',
            borderTop: `1px solid ${theme.colors.border}`,
            backgroundColor: 'rgba(0, 0, 0, 0.02)',
            borderRadius: '0 0 12px 12px',
            height: isMobile ? '110px' : '120px',
            minHeight: isMobile ? '110px' : '120px',
            flex: 1,
            alignContent: 'center',
            width: '100%',
            maxWidth: '100%',
            boxSizing: 'border-box',
            overflow: 'hidden'
        },
        draggableWord: {
            padding: isMobile ? '0.5rem 0.75rem' : '0.5rem 1rem',
            backgroundColor: theme.colors.panel,
            borderRadius: isMobile ? '12px' : '2rem',
            textAlign: 'center',
            cursor: 'grab',
            fontSize: isMobile ? '0.85rem' : '0.9rem',
            fontWeight: 500,
            color: theme.colors.text,
            transition: 'all 0.2s ease',
            borderWidth: '1px',
            borderStyle: 'solid',
            borderColor: theme.colors.border,
            boxShadow: theme.shadows.soft,
            minHeight: isMobile ? '40px' : '40px', // Touch-friendly
            minWidth: isMobile ? '60px' : '80px', // Smaller minimum width on mobile
            maxWidth: isMobile ? '120px' : 'none', // Prevent words from getting too wide
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flex: isMobile ? '0 0 auto' : 'none',
            boxSizing: 'border-box',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
        },
        draggableWordActive: {
            cursor: 'grabbing',
            backgroundColor: theme.colors.accent,
            color: 'white',
            transform: 'scale(1.05)',
            boxShadow: theme.shadows.medium
        },
        feedbackContainer: {
            height: isMobile ? '35px' : '50px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: isMobile ? '0.25rem 0' : '0.75rem 0',
            flexShrink: 0
        },
        feedback: {
            width: '100%',
            padding: isMobile ? '0.625rem' : '0.75rem',
            borderRadius: '8px',
            textAlign: 'center',
            fontSize: isMobile ? '0.8rem' : '0.9rem',
            fontWeight: 600,
            transition: 'transform 0.2s'
        },
        successFeedback: {
            backgroundColor: 'rgba(40, 167, 69, 0.1)',
            color: theme.colors.success,
            border: `1px solid ${theme.colors.success}`
        },
        errorFeedback: {
            backgroundColor: 'rgba(220, 53, 69, 0.1)',
            color: theme.colors.error,
            border: `1px solid ${theme.colors.error}`
        },
        sentenceControls: {
            display: 'flex',
            gap: isMobile ? '0.5rem' : '1rem',
            justifyContent: isMobile ? 'center' : 'flex-end',
            padding: isMobile ? '0.625rem 0.75rem' : '1rem 1rem',
            flexWrap: isMobile ? 'wrap' : 'nowrap',
            borderTop: `1px solid ${theme.colors.border}`,
            flexShrink: 0,
            margin: 0,
            height: isMobile ? '65px' : '80px',
            alignItems: 'center',
            boxSizing: 'border-box',
            overflow: 'hidden',
            width: '100%',
            marginTop: isMobile ? '1rem' : '2rem'
        },
        primaryButton: {
            padding: isMobile ? '0.75rem 0.5rem' : '0.75rem 1.5rem',
            backgroundColor: theme.colors.accent,
            color: '#ffffff',
            border: 'none',
            borderRadius: '12px',
            fontSize: isMobile ? '0.75rem' : '0.875rem',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s',
            boxSizing: 'border-box',
            minHeight: '44px', // Touch-friendly
            flex: isMobile ? '1' : 'none',
            maxWidth: isMobile ? 'calc(50% - 0.25rem)' : 'none',
            textAlign: 'center',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            minWidth: 0 // Allow flex items to shrink below content size
        },
        secondaryButton: {
            padding: isMobile ? '0.75rem 0.5rem' : '0.75rem 1.5rem',
            backgroundColor: 'transparent',
            color: theme.colors.textLight,
            border: `1px solid ${theme.colors.border}`,
            borderRadius: '12px',
            fontSize: isMobile ? '0.75rem' : '0.875rem',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s',
            minHeight: '44px', // Touch-friendly
            flex: isMobile ? '1' : 'none',
            maxWidth: isMobile ? 'calc(50% - 0.25rem)' : 'none',
            textAlign: 'center',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            boxSizing: 'border-box',
            minWidth: 0 // Allow flex items to shrink below content size
        },
        
        // Modal-specific button styles
        modalPrimaryButton: {
            padding: isMobile ? '1rem 2rem' : '0.75rem 1.5rem',
            backgroundColor: theme.colors.accent,
            color: '#ffffff',
            border: 'none',
            borderRadius: '12px',
            fontSize: isMobile ? '1rem' : '0.875rem',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s',
            boxSizing: 'border-box',
            minHeight: '48px',
            width: isMobile ? '100%' : 'auto',
            maxWidth: isMobile ? '100%' : 'none',
            textAlign: 'center',
            whiteSpace: 'nowrap',
            minWidth: isMobile ? '200px' : '140px'
        },
        modalSecondaryButton: {
            padding: isMobile ? '1rem 2rem' : '0.75rem 1.5rem',
            backgroundColor: 'transparent',
            color: theme.colors.textLight,
            border: `1px solid ${theme.colors.border}`,
            borderRadius: '12px',
            fontSize: isMobile ? '1rem' : '0.875rem',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s',
            minHeight: '48px',
            width: isMobile ? '100%' : 'auto',
            maxWidth: isMobile ? '100%' : 'none',
            textAlign: 'center',
            whiteSpace: 'nowrap',
            boxSizing: 'border-box',
            minWidth: isMobile ? '200px' : '140px'
        },
        
        progressContainer: { 
            display: 'flex', 
            flexDirection: 'column', 
            gap: isMobile ? '1.25rem' : '1.5rem',
            flex: 1,
            minHeight: 0,
            width: '100%',
            maxWidth: '100%',
            boxSizing: 'border-box'
        },
        progressItem: {
            width: '100%',
            maxWidth: '100%',
            boxSizing: 'border-box'
        },
        progressLabel: { 
            display: 'flex', 
            justifyContent: 'space-between', 
            marginBottom: '0.5rem',
            width: '100%',
            boxSizing: 'border-box'
        },
        progressTitle: { 
            fontSize: isMobile ? '0.85rem' : '0.9rem', 
            fontWeight: 500, 
            color: theme.colors.text,
            flex: 1,
            minWidth: 0
        },
        progressValue: { 
            fontSize: isMobile ? '0.75rem' : '0.8rem', 
            fontWeight: 400, 
            color: theme.colors.textLight,
            flexShrink: 0,
            marginLeft: '0.5rem'
        },
        progressBar: { 
            width: '100%', 
            maxWidth: '100%',
            height: '16px', 
            backgroundColor: '#e0e0e0', 
            borderRadius: '8px', 
            overflow: 'hidden', 
            boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.1)',
            boxSizing: 'border-box'
        },
        progressFill: { height: '100%', transition: 'width 0.5s ease-out, background-color 0.4s ease' },
 
        grammarFeedbackContainer: { 
            flex: 1, 
            overflowY: 'auto', 
            paddingRight: '0.5rem',
            minHeight: 0,
            maxHeight: 'none'
        },
        noGrammarNotes: { color: theme.colors.textLight, textAlign: 'center', fontStyle: 'italic' },
        grammarNoteList: {
            listStyle: 'none',
            paddingTop: 0,
            paddingLeft: 0,
            paddingRight: 0,
            paddingBottom: 0,
            margin: 0
        },
        grammarNoteItem: {
            position: 'relative',
            marginBottom: '1rem',
            paddingTop: 0,
            paddingLeft: 0,
            paddingRight: 0,
            paddingBottom: '1rem',
            borderBottom: `1px solid ${theme.colors.border}`
        },
        grammarNoteHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' },
        grammarNoteRule: { display: 'block', fontWeight: 600, color: theme.colors.text },
        grammarNoteDismiss: {
            backgroundColor: 'transparent',
            border: 'none',
            color: theme.colors.textLight,
            cursor: 'pointer',
            fontSize: '1rem',
            paddingTop: '0.25rem',
            paddingLeft: '0.25rem',
            paddingRight: '0.25rem',
            paddingBottom: '0.25rem',
            borderRadius: '50%'
        },
        grammarNoteExample: { fontSize: '0.9rem', color: theme.colors.textLight, margin: 0, lineHeight: 1.5 },
 
        authContainer: { display: 'flex', width: '100vw', height: '100vh', backgroundColor: theme.colors.background, transition: 'opacity 0.5s ease', overflow: 'hidden', position: 'relative', fontFamily: '"Poppins", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' },
        authLoadingScreen: { 
            width: '100vw', 
            height: '100vh', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            background: `linear-gradient(45deg, ${theme.colors.gradientStart}, ${theme.colors.gradientEnd})`,
            backgroundColor: theme.colors.gradientStart,
            color: '#ffffff'
        },
        authWelcomePanel: {
            width: '100vw',
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: `linear-gradient(45deg, ${theme.colors.gradientStart}, ${theme.colors.gradientEnd})`,
            backgroundColor: theme.colors.gradientStart,
            color: '#ffffff',
            transition: 'all 0.8s cubic-bezier(0.76, 0, 0.24, 1)',
            position: 'absolute',
            top: 0,
            left: 0,
            zIndex: 1
        },
        authWelcomePanelActive: {
            width: isMobile ? '0vw' : '50vw',
            transform: isMobile ? 'translateX(-100%)' : 'none'
        },
        authFormPanel: {
            width: isMobile ? '100vw' : '0vw',
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: isMobile ? '2rem' : '0',
            opacity: 0,
            transform: isMobile ? 'translateX(100%)' : 'translateX(20px)',
            transition: 'all 0.8s cubic-bezier(0.76, 0, 0.24, 1)',
            backgroundColor: theme.colors.background,
            position: 'absolute',
            top: 0,
            right: 0,
            zIndex: 2,
            overflowY: isMobile ? 'auto' : 'visible'
        },
        authFormPanelActive: {
            width: isMobile ? '100vw' : '50vw',
            padding: isMobile ? '2rem' : '4rem 4rem 4rem 4rem',
            opacity: 1,
            transform: 'translateX(0)'
        },
        authFormContent: {
            maxWidth: isMobile ? '100%' : '380px',
            width: '100%',
            margin: '0 auto',
            paddingTop: '0',
            paddingLeft: '0',
            paddingRight: isMobile ? '0' : '1rem',
            paddingBottom: '0',
            boxSizing: 'border-box'
        },
        authLogo: { 
            width: '80px', 
            height: '80px', 
            borderRadius: '50%', 
            backgroundColor: 'rgba(255, 255, 255, 0.2)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            fontSize: '2.5rem', 
            fontWeight: 700, 
            color: '#ffffff',
            marginBottom: '2rem', 
            backdropFilter: 'blur(10px)', 
            border: '2px solid rgba(255, 255, 255, 0.3)',
            fontFamily: '"Poppins", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
        },
        authTitle: {
            fontSize: isMobile ? '2.5rem' : '4rem',
            fontWeight: 700,
            margin: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            paddingTop: '0',
            paddingLeft: '2rem',
            paddingRight: '2rem',
            paddingBottom: '0',
            position: 'relative',
            lineHeight: 1.2,
            color: '#ffffff',
            fontFamily: '"Poppins", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
        },
          
        authSubtitle: { 
            fontSize: '1.2rem', 
            marginTop: '0.5rem', 
            opacity: 0.8,
            color: '#ffffff',
            fontFamily: '"Poppins", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
        },
        authPrompt: { color: theme.colors.textLight, marginBottom: '2rem' },
        inputGroup: { width: '100%', display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' },
        inputLabel: { fontSize: '0.9rem', fontWeight: 600, color: theme.colors.text, marginBottom: '0.25rem', fontFamily: '"Poppins", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' },
        authInput: { padding: '0.75rem 1rem', borderRadius: theme.borderRadius, border: `1px solid ${theme.colors.border}`, fontSize: '1rem', boxSizing: 'border-box', backgroundColor: '#ffffff', color: theme.colors.text, transition: 'border-color 0.2s ease', fontFamily: '"Poppins", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' },
        errorMessage: { fontSize: '0.8rem', color: theme.colors.error, marginTop: '0.25rem', fontWeight: 500, fontFamily: '"Poppins", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' },
        authConsent: { display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.8rem', color: theme.colors.textLight, margin: '1rem 0', fontFamily: '"Poppins", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' },
        authConsentLink: { color: '#007bff', textDecoration: 'underline' },
        authSeparator: { 
            margin: isMobile ? '1.25rem 0' : '1.5rem 0', 
            color: theme.colors.textLight, 
            textAlign: 'center', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            gap: '1rem',
            fontSize: isMobile ? '0.85rem' : '0.9rem',
            fontWeight: 500,
            width: '100%',
            fontFamily: '"Poppins", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
        },
        socialButton: { 
            padding: isMobile ? '0.875rem 1rem' : '0.75rem 1.5rem', 
            backgroundColor: theme.colors.panel, 
            color: theme.colors.text, 
            borderWidth: '1px', 
            borderStyle: 'solid', 
            borderColor: theme.colors.border, 
            borderRadius: theme.borderRadius, 
            fontSize: isMobile ? '0.85rem' : '0.875rem', 
            fontWeight: 600, 
            cursor: 'pointer', 
            transition: 'all 0.2s', 
            width: '100%', 
            marginBottom: isMobile ? '0.75rem' : '0.75rem', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            gap: '0.5rem', 
            boxSizing: 'border-box',
            minHeight: isMobile ? '48px' : '44px',
            fontFamily: '"Poppins", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
        },
        googleButton: { backgroundColor: theme.colors.panel, borderColor: theme.colors.border, color: theme.colors.text },
        githubButton: { backgroundColor: theme.colors.accent, borderColor: theme.colors.accent, color: '#ffffff' },
        socialIcon: { fontSize: '1.2rem', fontWeight: 'bold'},
        


        // Lesson Completion Modal Styles
        modalOverlay: {
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 200,
            backdropFilter: 'blur(4px)'
        },
        completionModal: {
            backgroundColor: theme.colors.panel,
            borderRadius: '16px',
            padding: isMobile ? '2rem 1.5rem' : '3rem 2.5rem',
            maxWidth: isMobile ? '90vw' : '500px',
            width: '100%',
            maxHeight: '90vh',
            overflow: 'auto',
            boxShadow: theme.shadows.hard,
            border: `1px solid ${theme.colors.border}`,
            textAlign: 'center'
        },
        completionHeader: {
            marginBottom: '2rem'
        },
        completionIcon: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: '1rem',
            height: isMobile ? '60px' : '72px'
        },
        completionTitle: {
            fontSize: isMobile ? '1.8rem' : '2.2rem',
            fontWeight: 700,
            color: theme.colors.text,
            margin: '0 0 0.5rem 0',
            letterSpacing: '-0.02em'
        },
        completionSubtitle: {
            fontSize: isMobile ? '1rem' : '1.1rem',
            color: theme.colors.textLight,
            margin: 0,
            lineHeight: 1.5
        },
        statsContainer: {
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: isMobile ? '1rem' : '1.5rem',
            marginBottom: '2rem',
            padding: isMobile ? '1.5rem 1rem' : '2rem',
            backgroundColor: 'rgba(0, 0, 0, 0.02)',
            borderRadius: '12px',
            border: `1px solid ${theme.colors.border}`
        },
        statItem: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.5rem'
        },
        statValue: {
            fontSize: isMobile ? '1.5rem' : '2rem',
            fontWeight: 700,
            color: theme.colors.accent,
            lineHeight: 1
        },
        statLabel: {
            fontSize: isMobile ? '0.8rem' : '0.9rem',
            color: theme.colors.textLight,
            fontWeight: 500,
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
        },
        performanceMessage: {
            fontSize: isMobile ? '1.1rem' : '1.2rem',
            fontWeight: 600,
            color: theme.colors.text,
            marginBottom: '2rem',
            padding: '1rem',
            backgroundColor: theme.colors.accentLight,
            borderRadius: '8px',
            border: `1px solid ${theme.colors.accent}`
        },
        completionActions: {
            display: 'flex',
            gap: isMobile ? '1rem' : '1.5rem',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: isMobile ? 'column' : 'row',
            width: '100%',
            padding: isMobile ? '0 1rem' : '0'
        },
 
        // Footer Styles
        footer: {
            backgroundColor: theme.colors.panel,
            borderTop: `1px solid ${theme.colors.border}`,
            marginTop: isMobile ? '3rem' : '4rem',
            boxShadow: '0 -2px 10px rgba(0, 0, 0, 0.05)'
        },
        footerContainer: {
            maxWidth: '1200px',
            margin: '0 auto',
            padding: isMobile ? '1.5rem 1.5rem' : '1.5rem 2rem'
        },
        footerContent: {
            display: 'flex',
            justifyContent: isMobile ? 'flex-start' : 'space-between',
            alignItems: isMobile ? 'flex-start' : 'center',
            flexDirection: isMobile ? 'column' : 'row',
            gap: isMobile ? '1.5rem' : '2rem',
            marginBottom: isMobile ? '1.5rem' : '2rem'
        },
        footerBrand: { 
            display: 'flex', 
            alignItems: 'flex-start', 
            gap: '0.75rem',
            textAlign: 'left',
            flex: isMobile ? 'none' : '1',
            width: isMobile ? '100%' : 'auto'
        },
        footerBrandText: {
            display: 'flex',
            flexDirection: 'column',
            gap: '0.1rem'
        },
        footerLogo: { 
            width: isMobile ? '40px' : '36px', 
            height: isMobile ? '40px' : '36px', 
            borderRadius: '50%', 
            backgroundColor: theme.colors.accent, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            fontSize: isMobile ? '1.2rem' : '1rem', 
            fontWeight: 700, 
            color: 'white', 
            flexShrink: 0
        },
        footerBrandName: { 
            fontSize: isMobile ? '1.2rem' : '1.1rem', 
            fontWeight: 600, 
            color: theme.colors.text, 
            margin: 0,
            letterSpacing: '-0.01em'
        },
        footerBrandTagline: { 
            fontSize: isMobile ? '0.75rem' : '0.7rem', 
            color: theme.colors.textLight, 
            margin: 0,
            fontWeight: 400
        },
        footerLinks: {
            display: 'flex',
            gap: isMobile ? '1.25rem' : '1.5rem',
            alignItems: 'center',
            flexWrap: 'wrap',
            justifyContent: isMobile ? 'flex-start' : 'flex-end',
            flex: isMobile ? 'none' : '1',
            width: isMobile ? '100%' : 'auto'
        },
        footerLink: { 
            fontSize: isMobile ? '0.85rem' : '0.8rem', 
            color: theme.colors.textLight, 
            textDecoration: 'none',
            fontWeight: 500,
            transition: 'color 0.2s ease',
            padding: isMobile ? '0.25rem 0' : '0.1rem 0'
        },
        footerBottom: {
            borderTop: `1px solid ${theme.colors.border}`,
            paddingTop: isMobile ? '1rem' : '1.25rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexDirection: isMobile ? 'column' : 'row',
            gap: isMobile ? '0.75rem' : 0
        },
        footerCopyright: { 
            fontSize: isMobile ? '0.75rem' : '0.7rem', 
            color: theme.colors.textLight, 
            margin: 0,
            fontWeight: 400
        },
        footerBottomLinks: { 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.75rem'
        },
        footerBottomLink: { 
            fontSize: isMobile ? '0.75rem' : '0.7rem', 
            color: theme.colors.textLight, 
            textDecoration: 'none', 
            transition: 'color 0.2s ease',
            fontWeight: 400
        },
        footerSeparator: { 
            color: theme.colors.border, 
            fontSize: isMobile ? '1rem' : '0.8rem',
            display: isMobile ? 'none' : 'inline'
        }
    };
};
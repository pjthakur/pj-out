"use client"

import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence, useAnimation } from 'framer-motion';
import { Cormorant_Garamond, Raleway } from 'next/font/google';
import { Sun, Moon, X, Menu, Check } from 'lucide-react';
import { useInView } from 'framer-motion';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  variable: '--font-cormorant',
  display: 'swap',
  weight: ['300', '400', '600', '700']
});

const raleway = Raleway({
  subsets: ['latin'],
  variable: '--font-raleway',
  display: 'swap',
  weight: ['200', '300', '400', '500', '600']
});

const artPieces = [
  {
    id: 1,
    title: "Starry Night",
    artist: "Vincent van Gogh",
    image: "https://images.pexels.com/photos/1191710/pexels-photo-1191710.jpeg?auto=compress&cs=tinysrgb&w=1000",
    year: "1889",
    style: "Post-Impressionism",
    description: "One of Van Gogh's most famous works, painted during his stay at an asylum in Saint-Rémy-de-Provence. The painting depicts a night scene with swirling clouds, a crescent moon, and stars radiating with a dreamlike quality above a sleeping village."
  },
  {
    id: 2,
    title: "The Persistence of Memory",
    artist: "Salvador Dalí",
    image: "https://images.pexels.com/photos/1193743/pexels-photo-1193743.jpeg?auto=compress&cs=tinysrgb&w=1000",
    year: "1931",
    style: "Surrealism",
    description: "Often referred to as 'The Melting Clocks', this surrealist masterpiece features soft, melting pocket watches in a dreamscape setting. It symbolizes the fluidity and relativity of time and has become an iconic image of surrealism."
  },
  {
    id: 3,
    title: "Water Lilies",
    artist: "Claude Monet",
    image: "https://images.pexels.com/photos/40784/drops-of-water-water-nature-liquid-40784.jpeg?auto=compress&cs=tinysrgb&w=1000",
    year: "1919",
    style: "Impressionism",
    description: "Part of Monet's series of approximately 250 oil paintings depicting his flower garden at his home in Giverny. The paintings capture the changing light and atmosphere of the water garden throughout different times of day and seasons."
  },
  {
    id: 4,
    title: "The Scream",
    artist: "Edvard Munch",
    image: "https://images.pexels.com/photos/2179483/pexels-photo-2179483.jpeg?auto=compress&cs=tinysrgb&w=1000",
    year: "1893",
    style: "Expressionism",
    description: "This iconic piece expresses intense anxiety and despair, depicted through a figure with an agonized expression against a landscape with a tumultuous orange sky. It symbolizes the existential angst of the modern human condition."
  },
  {
    id: 5,
    title: "Guernica",
    artist: "Pablo Picasso",
    image: "https://images.pexels.com/photos/1585325/pexels-photo-1585325.jpeg?auto=compress&cs=tinysrgb&w=1000",
    year: "1937",
    style: "Cubism",
    description: "A powerful anti-war statement created in response to the bombing of Guernica, a Basque town in northern Spain, by Nazi Germany. The massive painting portrays the suffering of people and animals in a style that's both chaotic and precise."
  },
  {
    id: 6,
    title: "The Night Café",
    artist: "Vincent van Gogh",
    image: "https://images.pexels.com/photos/15239/flower-roses-red-roses-bloom.jpg?auto=compress&cs=tinysrgb&w=1000",
    year: "1888",
    style: "Post-Impressionism",
    description: "Painted in Arles, this work depicts the interior of a café late at night. Van Gogh described it as a place 'where one could ruin oneself, go mad, or commit a crime.' The harsh colors and tilted perspective create a sense of psychological tension."
  },
  {
    id: 7,
    title: "The Birth of Venus",
    artist: "Sandro Botticelli",
    image: "https://images.pexels.com/photos/2486168/pexels-photo-2486168.jpeg?auto=compress&cs=tinysrgb&w=1000",
    year: "1484",
    style: "Early Renaissance",
    description: "This iconic Renaissance painting depicts the goddess Venus arriving at the shore after her birth. It combines Christian and Neo-platonic elements with classical mythology, representing both earthly and spiritual love through masterful composition and delicate lines."
  },
  {
    id: 8,
    title: "The Great Wave off Kanagawa",
    artist: "Katsushika Hokusai",
    image: "https://images.pexels.com/photos/1295138/pexels-photo-1295138.jpeg?auto=compress&cs=tinysrgb&w=1000",
    year: "1831",
    style: "Ukiyo-e",
    description: "This famous woodblock print depicts an enormous wave threatening boats near the Japanese prefecture of Kanagawa. The wave is the focus, dwarfing even Mount Fuji in the background. It's part of the series 'Thirty-six Views of Mount Fuji'."
  },
  {
    id: 9,
    title: "Nighthawks",
    artist: "Edward Hopper",
    image: "https://images.pexels.com/photos/1477166/pexels-photo-1477166.jpeg?auto=compress&cs=tinysrgb&w=1000",
    year: "1942",
    style: "American Realism",
    description: "One of the most recognizable paintings in American art, depicting nighttime customers at a downtown diner. The painting portrays urban alienation and loneliness through its stark lighting, anonymous figures, and empty streets."
  },
  {
    id: 10,
    title: "The Son of Man",
    artist: "René Magritte",
    image: "https://images.pexels.com/photos/131046/pexels-photo-131046.jpeg?auto=compress&cs=tinysrgb&w=1000",
    year: "1964",
    style: "Surrealism",
    description: "This surrealist self-portrait shows a man in a suit and bowler hat with an apple obscuring his face. Magritte described it as reflecting the human condition - the visible that hides the visible. It explores themes of visible reality and hidden truth."
  },
];

const artistBios = [
  {
    name: "Clara Renoir",
    specialty: "Abstract Expressionism",
    image: "https://images.pexels.com/photos/2613260/pexels-photo-2613260.jpeg?auto=compress&cs=tinysrgb&w=1000",
    bio: "Clara Renoir is a contemporary abstract expressionist whose work explores the relationship between color, emotion, and movement. Born in Paris and educated at École des Beaux-Arts, her pieces have been exhibited in galleries across Europe and North America. Renoir's technique combines traditional brushwork with innovative textural elements that create depth and dimension in her abstract compositions.",
    gallery: [
      {
        id: 101,
        title: "Emotion in Purple",
        image: "https://images.pexels.com/photos/5022849/pexels-photo-5022849.jpeg?auto=compress&cs=tinysrgb&w=1000",
        year: "2023",
        description: "An exploration of purple tones representing emotional states."
      },
      {
        id: 102,
        title: "Cerulean Dreams",
        image: "https://images.pexels.com/photos/417173/pexels-photo-417173.jpeg?auto=compress&cs=tinysrgb&w=1000",
        year: "2022",
        description: "A blue-dominated abstract expressing the subconscious mind."
      },
      {
        id: 103,
        title: "Coral Symphony",
        image: "https://images.pexels.com/photos/1295138/pexels-photo-1295138.jpeg?auto=compress&cs=tinysrgb&w=1000",
        year: "2021",
        description: "A vibrant composition inspired by underwater coral landscapes."
      }
    ]
  },
  {
    name: "Marcus Venezia",
    specialty: "Contemporary",
    image: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=1000",
    bio: "Marcus Venezia's contemporary works blend digital techniques with traditional painting methods. After studying at the Royal College of Art in London, he developed his signature style that comments on technology's impact on modern life. His pieces often incorporate elements of digital glitches, pixelation, and fragmented imagery within meticulously painted canvases that challenge viewers to reconsider their relationship with the digital world.",
    gallery: [
      {
        id: 201,
        title: "Digital Fragmentation",
        image: "https://images.pexels.com/photos/6985045/pexels-photo-6985045.jpeg?auto=compress&cs=tinysrgb&w=1000",
        year: "2024",
        description: "A commentary on the fragmentation of digital identity."
      },
      {
        id: 202,
        title: "Pixelated Reality",
        image: "https://images.pexels.com/photos/2110951/pexels-photo-2110951.jpeg?auto=compress&cs=tinysrgb&w=1000",
        year: "2023",
        description: "An exploration of how digital media alters our perception of reality."
      },
      {
        id: 203,
        title: "Virtual Memory",
        image: "https://images.pexels.com/photos/2693212/pexels-photo-2693212.png?auto=compress&cs=tinysrgb&w=1000",
        year: "2022",
        description: "A study of how memories are affected by digital experiences."
      }
    ]
  },
  {
    name: "Elise Monet",
    specialty: "Neo-Impressionism",
    image: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1000",
    bio: "Elise Monet revitalizes impressionist techniques for the modern age through her neo-impressionist landscapes and urban scenes. A descendant of the famous impressionist Claude Monet, she honors her heritage while pushing boundaries with vibrant color palettes and contemporary subject matter. Her work has been celebrated for capturing fleeting moments of light and atmosphere in settings that range from bustling city streets to serene natural environments.",
    gallery: [
      {
        id: 301,
        title: "Urban Sunset",
        image: "https://images.pexels.com/photos/208701/pexels-photo-208701.jpeg?auto=compress&cs=tinysrgb&w=1000",
        year: "2024",
        description: "A neo-impressionist interpretation of a city skyline at sunset."
      },
      {
        id: 302,
        title: "Spring Garden",
        image: "https://images.pexels.com/photos/414974/pexels-photo-414974.jpeg?auto=compress&cs=tinysrgb&w=1000",
        year: "2023",
        description: "A vibrant garden scene capturing the fleeting beauty of spring blossoms."
      },
      {
        id: 303,
        title: "Rainy Reflection",
        image: "https://images.pexels.com/photos/3617453/pexels-photo-3617453.jpeg?auto=compress&cs=tinysrgb&w=1000",
        year: "2022",
        description: "A study of light and water reflections during rainfall in an urban setting."
      }
    ]
  },
];

// Theme Toggle Component
const ThemeToggle = ({ darkMode, toggleDarkMode }: { darkMode: boolean; toggleDarkMode: () => void }) => {
  return (
    <motion.button 
      onClick={toggleDarkMode}
      className={`p-2 rounded-full z-50 ${
        darkMode ? 'bg-neutral-800 text-amber-300' : 'bg-white/30 text-neutral-800 backdrop-blur-sm'
      } transition-all duration-300 hover:scale-110 shadow-lg`}
      whileTap={{ scale: 0.9 }}
      whileHover={{ y: -2 }}
      aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
    >
      {darkMode ? (
        <Sun className="w-5 h-5" />
      ) : (
        <Moon className="w-5 h-5" />
      )}
    </motion.button>
  );
};

const Navbar = ({ darkMode, toggleDarkMode }: { darkMode: boolean; toggleDarkMode: () => void }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    if (menuOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [menuOpen]);

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
      setMenuOpen(false); // Close menu on navigation
    }
  };

  return (
    <header className={`fixed top-0 left-0 w-full z-40 backdrop-blur-sm transition-colors duration-300 ${
      darkMode ? 'bg-neutral-900/70' : 'bg-white/30'
    }`}>
      <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4 flex flex-row justify-between items-center gap-2 sm:gap-0">
        <motion.h1 
          className={`text-lg sm:text-xl md:text-2xl font-medium tracking-wider ${darkMode ? 'text-white' : 'text-neutral-800'} ${cormorant.className} relative group`}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="relative inline-block">
            Artistry Collective
            <span className={`absolute bottom-0 left-0 w-full h-0.5 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ${
              darkMode ? 'bg-amber-400' : 'bg-amber-600'
            }`}></span>
          </span>
        </motion.h1>
        {/* Hamburger for mobile */}
        <button
          className="sm:hidden ml-auto p-2 rounded focus:outline-none focus:ring-2 focus:ring-amber-500"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        >
          {menuOpen ? (
            <X className="w-7 h-7 text-amber-500" />
          ) : (
            <Menu className="w-7 h-7 text-amber-500" />
          )}
        </button>
        {/* Desktop nav */}
        <nav className="hidden sm:flex items-center w-full sm:w-auto justify-between">
          <ul className="flex space-x-2 sm:space-x-4 md:space-x-6 mr-2 sm:mr-6">
            {['Gallery', 'Artists', 'Exhibitions', 'Contact'].map((item, index) => (
              <motion.li 
                key={item}
                className={`cursor-pointer ${raleway.className} text-xs sm:text-sm tracking-wide relative group ${darkMode ? 'text-neutral-200' : 'text-neutral-700'} hover:text-amber-600 transition-colors duration-300`}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                onClick={() => scrollToSection(item.toLowerCase())}
              >
                <span className="relative inline-block">
                  {item}
                  <span className={`absolute bottom-0 left-0 w-full h-0.5 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ${
                    darkMode ? 'bg-amber-400' : 'bg-amber-600'
                  }`}></span>
                </span>
              </motion.li>
            ))}
          </ul>
          <ThemeToggle darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
        </nav>
        {/* Mobile nav dropdown */}
        <AnimatePresence>
          {menuOpen && (
            <motion.nav
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className={`fixed top-0 left-0 w-full h-screen bg-black/80 z-50 flex flex-col items-center justify-center sm:hidden`}
            >
              <button
                className="absolute top-4 right-4 p-2 rounded-full bg-neutral-800 text-white hover:bg-amber-600 hover:text-white transition-colors"
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
              >
                <X className="w-7 h-7" />
              </button>
              <ul className="flex flex-col space-y-8 text-2xl">
                {['Gallery', 'Artists', 'Exhibitions', 'Contact'].map((item) => (
                  <li
                    key={item}
                    className={`cursor-pointer ${raleway.className} tracking-wide ${darkMode ? 'text-white' : 'text-neutral-100'} hover:text-amber-400 transition-colors`}
                    onClick={() => scrollToSection(item.toLowerCase())}
                  >
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-12">
                <ThemeToggle darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  darkMode: boolean;
}

const Modal = ({ isOpen, onClose, children, darkMode }: ModalProps) => {
  // Prevent background scroll when modal is open
  React.useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;
  
  return (
    <motion.div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div 
        className="absolute inset-0 bg-black/80"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      />
      <motion.div 
        className={`relative max-w-6xl w-full max-h-[90vh] rounded-xl overflow-hidden shadow-2xl ${darkMode ? 'bg-neutral-800' : 'bg-white'}`}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
      >
        <button 
          onClick={onClose}
          className={`absolute top-4 right-4 p-2 rounded-full z-10 ${
            darkMode ? 'bg-neutral-700 text-neutral-200' : 'bg-white/80 text-neutral-800'
          } hover:bg-amber-600 hover:text-white transition-colors`}
          aria-label="Close"
        >
          <X className="w-6 h-6" />
        </button>
        {children}
      </motion.div>
    </motion.div>
  );
};

const ArtCollage = ({ darkMode }: { darkMode: boolean }) => {
  const [hoveredPiece, setHoveredPiece] = useState<number | null>(null);
  const [selectedPiece, setSelectedPiece] = useState<typeof artPieces[0] | null>(null);
  const { scrollYProgress } = useScroll();
  const xMovement = useTransform(scrollYProgress, [0, 1], [-50, 50]);
  const reverseXMovement = useTransform(scrollYProgress, [0, 1], [50, -50]);
  
  const handlePieceClick = (piece: typeof artPieces[0]) => {
    setSelectedPiece(piece);
  };
  
  const [favoriteTick, setFavoriteTick] = useState(false);
  const [shareTick, setShareTick] = useState(false);
  
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 flex flex-col justify-center w-full h-full">
        {/* First Row - Moves Left to Right, now scrollable */}
        <div className="w-full overflow-x-auto scrollbar-thin scrollbar-thumb-amber-400/70 scrollbar-track-transparent mb-6">
          <motion.div 
            className="flex space-x-6 px-4 min-w-max"
            style={{ x: xMovement }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
          >
            {artPieces.slice(0, 5).map((piece) => (
              <ArtPieceCard 
                key={piece.id} 
                piece={piece} 
                isHovered={hoveredPiece === piece.id}
                onHover={() => setHoveredPiece(piece.id)}
                onLeave={() => setHoveredPiece(null)}
                onClick={() => handlePieceClick(piece)}
                darkMode={darkMode}
              />
            ))}
          </motion.div>
        </div>
        
        {/* Second Row - Moves Right to Left, now scrollable */}
        <div className="w-full overflow-x-auto scrollbar-thin scrollbar-thumb-amber-400/70 scrollbar-track-transparent">
          <motion.div 
            className="flex space-x-6 px-4 min-w-max"
            style={{ x: reverseXMovement }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, delay: 0.3 }}
          >
            {artPieces.slice(5).map((piece) => (
              <ArtPieceCard 
                key={piece.id} 
                piece={piece} 
                isHovered={hoveredPiece === piece.id}
                onHover={() => setHoveredPiece(piece.id)}
                onLeave={() => setHoveredPiece(null)}
                onClick={() => handlePieceClick(piece)}
                darkMode={darkMode}
              />
            ))}
          </motion.div>
        </div>
      </div>
      
      <AnimatePresence>
        {selectedPiece && (
          <Modal isOpen={!!selectedPiece} onClose={() => setSelectedPiece(null)} darkMode={darkMode}>
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="h-[50vh] md:h-[70vh] overflow-hidden">
                <img 
                  src={selectedPiece.image} 
                  alt={selectedPiece.title} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className={`p-6 md:p-8 flex flex-col justify-between ${darkMode ? 'text-white' : 'text-neutral-800'}`}> 
                <div>
                  <h2 className={`text-2xl md:text-3xl font-bold mb-2 ${cormorant.className}`}>{selectedPiece.title}</h2>
                  <p className={`text-sm md:text-base ${raleway.className} ${darkMode ? 'text-neutral-300' : 'text-neutral-600'} mb-3`}>
                    by {selectedPiece.artist}, {selectedPiece.year}
                  </p>
                  <div className={`inline-block px-3 py-1 rounded-full ${darkMode ? 'bg-amber-600/80' : 'bg-amber-700/80'} text-white text-xs mb-6 ${raleway.className}`}>
                    {selectedPiece.style}
                  </div>
                  <div className="my-6 h-px bg-gradient-to-r from-transparent via-neutral-400/30 to-transparent"></div>
                  <h3 className={`text-lg font-semibold mb-3 ${cormorant.className}`}>About This Artwork</h3>
                  <p className={`text-sm md:text-base leading-relaxed ${raleway.className} ${darkMode ? 'text-neutral-200' : 'text-neutral-600'}`}> 
                    {selectedPiece.description}
                  </p>
                </div>
                
                <div className="mt-auto pt-6">
                  <button 
                    className={`py-2 px-6 rounded-full flex items-center justify-center gap-2 ${
                      darkMode 
                        ? 'bg-amber-600 text-white hover:bg-amber-700' 
                        : 'bg-amber-700 text-white hover:bg-amber-800'
                    } transition-colors duration-300 text-sm ${raleway.className} mr-3`}
                    onClick={() => {
                      setFavoriteTick(true);
                      setTimeout(() => setFavoriteTick(false), 2000);
                    }}
                  >
                    {favoriteTick ? <Check className="w-5 h-5" /> : 'Add to Favorites'}
                  </button>
                  <button 
                    className={`py-2 px-6 rounded-full border flex items-center justify-center gap-2 ${
                      darkMode 
                        ? 'border-white/30 text-white/90 hover:bg-white/10' 
                        : 'border-neutral-300 text-neutral-700 hover:bg-neutral-100'
                    } transition-colors duration-300 text-sm ${raleway.className}`}
                    onClick={() => {
                      setShareTick(true);
                      setTimeout(() => setShareTick(false), 2000);
                    }}
                  >
                    {shareTick ? <Check className="w-5 h-5" /> : 'Share'}
                  </button>
                </div>
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
};

interface ArtPieceCardProps {
  piece: typeof artPieces[0];
  isHovered: boolean;
  onHover: () => void;
  onLeave: () => void;
  onClick: () => void;
  darkMode: boolean;
}

const ArtPieceCard = ({ piece, isHovered, onHover, onLeave, onClick, darkMode }: ArtPieceCardProps) => {
  return (
    <motion.div 
      className="relative flex-shrink-0 h-40 w-40 sm:h-52 sm:w-52 md:h-72 md:w-72 group cursor-pointer"
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      onClick={onClick}
      whileHover={{ scale: 1.05, zIndex: 10 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <div className="absolute inset-0 rounded-lg overflow-hidden shadow-lg">
        <img 
          src={piece.image} 
          alt={piece.title}
          className="w-full h-full object-cover transition-all duration-500"
          style={{ filter: isHovered ? 'brightness(1.1)' : 'brightness(0.9)' }}
        />
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 flex flex-col justify-end p-4 bg-gradient-to-t from-black/80 to-transparent"
              style={{ borderRadius: 'inherit' }}
            >
              <motion.h3 className={`text-lg md:text-xl text-white font-semibold ${cormorant.className}`}>{piece.title}</motion.h3>
              <motion.p className={`text-xs md:text-sm text-neutral-200 ${raleway.className}`}>by {piece.artist}, {piece.year}</motion.p>
              <motion.span className={`text-xs bg-amber-600/80 text-white px-2 py-1 rounded-full inline-block w-fit mt-2 ${raleway.className}`}>{piece.style}</motion.span>
              <motion.p className={`text-xs text-white/80 mt-2 ${raleway.className}`}>Click to view details</motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

interface SectionProps {
  title: string;
  description: string;
  children?: React.ReactNode;
  darkMode: boolean;
  direction?: "left" | "right";
  isLast?: boolean;
}

const Section = ({ title, description, children, darkMode, direction = "left", isLast = false }: SectionProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.3 });
  const controls = useAnimation();
  
  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [isInView, controls]);
  
  const variants = {
    hidden: { 
      opacity: 0, 
      x: direction === "left" ? -100 : 100 
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
        staggerChildren: 0.2
      }
    }
  };
  
  const childVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    }
  };
  
  return (
    <motion.section 
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={variants}
      className={`py-12 px-6 md:px-12${!isLast ? ' mb-8 md:mb-12' : ''} ${darkMode ? 'bg-neutral-900 text-neutral-100' : 'bg-neutral-100 text-neutral-800'}`}
    >
      <div className="container mx-auto">
        <motion.h2 
          variants={childVariants}
          className={`text-3xl md:text-4xl lg:text-5xl mb-6 ${cormorant.className} font-semibold`}
        >
          {title}
        </motion.h2>
        <motion.p 
          variants={childVariants}
          className={`text-lg md:text-xl mb-12 max-w-2xl ${raleway.className} font-light`}
        >
          {description}
        </motion.p>
        <motion.div variants={childVariants}>
          {children}
        </motion.div>
      </div>
    </motion.section>
  );
};

const FeaturedArtists = ({ darkMode }: { darkMode: boolean }) => {
  const [selectedArtist, setSelectedArtist] = useState<typeof artistBios[0] | null>(null);
  const [viewGallery, setViewGallery] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
        {artistBios.map((artist, index) => (
          <motion.div 
            key={artist.name}
            className={`rounded-lg overflow-hidden shadow-lg ${darkMode ? 'bg-neutral-800' : 'bg-white'}`}
            whileHover={{ y: -10, transition: { duration: 0.3 } }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 * index }}
          >
            <div className="h-48 sm:h-56 md:h-64 overflow-hidden">
              <img
                src={artist.image}
                alt={artist.name}
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
              />
            </div>
            <div className="p-4 sm:p-6">
              <h3 className={`text-lg sm:text-xl font-semibold mb-2 ${cormorant.className} ${darkMode ? 'text-white' : 'text-neutral-800'}`}>{artist.name}</h3>
              <p className={`text-xs sm:text-sm ${raleway.className} ${darkMode ? 'text-neutral-200' : 'text-neutral-600'}`}>
                {artist.specialty}
              </p>
              <button 
                onClick={() => {
                  setSelectedArtist(artist);
                  setViewGallery(false);
                  setShowContactForm(false);
                }}
                className={`mt-3 sm:mt-4 py-1.5 sm:py-2 px-3 sm:px-4 border rounded-full ${
                  darkMode 
                    ? 'border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-neutral-900' 
                    : 'border-amber-700 text-amber-700 hover:bg-amber-700 hover:text-white'
                } transition-colors duration-300 text-xs sm:text-sm ${raleway.className}`}
              >
                View Profile
              </button>
            </div>
          </motion.div>
        ))}
      </div>
      
      <AnimatePresence>
        {selectedArtist && !viewGallery && !showContactForm && (
          <Modal isOpen={!!selectedArtist} onClose={() => setSelectedArtist(null)} darkMode={darkMode}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1">
                <div className="h-full">
                  <img 
                    src={selectedArtist.image} 
                    alt={selectedArtist.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className={`p-6 md:p-8 md:col-span-2 ${darkMode ? 'text-white' : 'text-neutral-800'}`}>
                <h2 className={`text-2xl md:text-3xl font-bold mb-2 ${cormorant.className}`}>{selectedArtist.name}</h2>
                <div className={`inline-block px-3 py-1 rounded-full ${darkMode ? 'bg-amber-600' : 'bg-amber-700'} text-white text-xs mb-6 ${raleway.className}`}>
                  {selectedArtist.specialty}
                </div>
                <div className="my-6 h-px bg-gradient-to-r from-transparent via-neutral-400/30 to-transparent"></div>
                <h3 className={`text-lg font-semibold mb-3 ${cormorant.className}`}>Biography</h3>
                <p className={`text-sm md:text-base leading-relaxed ${raleway.className} ${darkMode ? 'text-neutral-200' : 'text-neutral-600'}`}>
                  {selectedArtist.bio}
                </p>
                
                <div className="mt-8 flex space-x-4">
                  <button 
                    onClick={() => setViewGallery(true)}
                    className={`py-2 px-6 rounded-full ${
                      darkMode 
                        ? 'bg-amber-600 text-white hover:bg-amber-700' 
                        : 'bg-amber-700 text-white hover:bg-amber-800'
                    } transition-colors duration-300 text-sm ${raleway.className}`}
                  >
                    View Gallery
                  </button>
                  <button 
                    onClick={() => setShowContactForm(true)}
                    className={`py-2 px-6 rounded-full border ${
                      darkMode 
                        ? 'border-white/30 text-white/90 hover:bg-white/10' 
                        : 'border-neutral-300 text-neutral-700 hover:bg-neutral-100'
                    } transition-colors duration-300 text-sm ${raleway.className}`}
                  >
                    Contact Artist
                  </button>
                </div>
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {viewGallery && selectedArtist && (
          <Modal isOpen={viewGallery} onClose={() => setViewGallery(false)} darkMode={darkMode}>
            <div className={`p-6 md:p-8 ${darkMode ? 'text-white' : 'text-neutral-800'}`}>
              <h2 className={`text-2xl md:text-3xl font-bold mb-6 ${cormorant.className}`}>{selectedArtist.name}'s Gallery</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {selectedArtist.gallery.map((artwork) => (
                  <div key={artwork.id} className={`rounded-lg overflow-hidden shadow-lg ${darkMode ? 'bg-neutral-700' : 'bg-white/90'}`}>
                    <div className="h-64 overflow-hidden">
                      <img
                        src={artwork.image}
                        alt={artwork.title}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className={`text-xl font-semibold mb-2 ${cormorant.className}`}>{artwork.title}</h3>
                      <p className={`text-sm ${raleway.className} ${darkMode ? 'text-neutral-300' : 'text-neutral-600'}`}>
                        {artwork.year}
                      </p>
                      <p className={`text-sm mt-2 ${raleway.className} ${darkMode ? 'text-neutral-200' : 'text-neutral-600'}`}>
                        {artwork.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-8 text-center">
                <button 
                  onClick={() => setViewGallery(false)}
                  className={`py-2 px-6 rounded-full ${
                    darkMode 
                      ? 'bg-amber-600 text-white hover:bg-amber-700' 
                      : 'bg-amber-700 text-white hover:bg-amber-800'
                  } transition-colors duration-300 text-sm ${raleway.className}`}
                >
                  Back to Profile
                </button>
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>
      
      <AnimatePresence>
        {showContactForm && selectedArtist && (
          <Modal isOpen={showContactForm} onClose={() => setShowContactForm(false)} darkMode={darkMode}>
            <div className={`p-6 md:p-8 ${darkMode ? 'text-white' : 'text-neutral-800'}`}>
              <h2 className={`text-2xl md:text-3xl font-bold mb-2 ${cormorant.className}`}>Contact {selectedArtist.name}</h2>
              <p className={`text-sm md:text-base mb-6 ${raleway.className} ${darkMode ? 'text-neutral-300' : 'text-neutral-600'}`}>
                Send a message directly to the artist. We will forward your inquiry and help establish a connection.
              </p>
              
              <ArtistContactForm darkMode={darkMode} artistName={selectedArtist.name} onBack={() => setShowContactForm(false)} />
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </>
  );
};

const ArtistContactForm = ({ darkMode, artistName, onBack }: { darkMode: boolean; artistName: string; onBack: () => void }) => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [tick, setTick] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Artist contact form submitted:', formData);
    setTick(true);
    setTimeout(() => setTick(false), 2000);
  };

  return (
    <form onSubmit={handleSubmit} className={`space-y-5 ${darkMode ? 'text-white' : 'text-neutral-800'}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label htmlFor="name" className={`block text-sm font-medium mb-2 ${raleway.className}`}>Your Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`w-full px-4 py-2 rounded-lg border ${
              darkMode ? 'border-neutral-700 bg-neutral-800/50 text-white' : 'border-neutral-300 bg-white text-neutral-800'
            } ${raleway.className}`}
            required
          />
        </div>
        <div>
          <label htmlFor="email" className={`block text-sm font-medium mb-2 ${raleway.className}`}>Your Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full px-4 py-2 rounded-lg border ${
              darkMode ? 'border-neutral-700 bg-neutral-800/50 text-white' : 'border-neutral-300 bg-white text-neutral-800'
            } ${raleway.className}`}
            required
          />
        </div>
      </div>
      <div>
        <label htmlFor="subject" className={`block text-sm font-medium mb-2 ${raleway.className}`}>Subject</label>
        <input
          type="text"
          id="subject"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          className={`w-full px-4 py-2 rounded-lg border ${
            darkMode ? 'border-neutral-700 bg-neutral-800/50 text-white' : 'border-neutral-300 bg-white text-neutral-800'
          } ${raleway.className}`}
          required
        />
      </div>
      <div>
        <label htmlFor="message" className={`block text-sm font-medium mb-2 ${raleway.className}`}>Message</label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          className={`w-full px-4 py-2 rounded-lg border ${
            darkMode ? 'border-neutral-700 bg-neutral-800/50 text-white' : 'border-neutral-300 bg-white text-neutral-800'
          } ${raleway.className}`}
          rows={5}
          required
        />
      </div>
      <div className="flex justify-between pt-2">
        <button
          type="button"
          onClick={onBack}
          className={`py-2 px-6 rounded-full border ${
            darkMode ? 'border-white/30 text-white/90 hover:bg-white/10' : 'border-neutral-300 text-neutral-700 hover:bg-neutral-100'
          } transition-colors duration-300 text-sm ${raleway.className}`}
        >
          Back
        </button>
        <button
          type="submit"
          className={`py-2 px-6 rounded-full flex items-center justify-center gap-2 ${
            darkMode ? 'bg-amber-600 text-white hover:bg-amber-700' : 'bg-amber-700 text-white hover:bg-amber-800'
          } transition-colors duration-300 text-sm ${raleway.className}`}
          disabled={tick}
        >
          {tick ? <Check className="w-5 h-5" /> : 'Send Message'}
        </button>
      </div>
    </form>
  );
};

const Exhibitions = ({ darkMode }: { darkMode: boolean }) => {
  const exhibitions = [
    { title: "Echoes of the Past", date: "May 15 - June 30, 2025", location: "Main Gallery", description: "A journey through the echoes of art history, featuring masterpieces and their modern interpretations. Experience the dialogue between past and present in this immersive exhibition." },
    { title: "Modern Perspectives", date: "July 10 - August 20, 2025", location: "East Wing", description: "Explore the bold visions of contemporary artists as they challenge conventions and redefine artistic boundaries. This exhibition highlights innovation and fresh perspectives in the art world." },
    { title: "Beyond Reality", date: "September 5 - October 15, 2025", location: "Interactive Space", description: "Step into a world where imagination knows no limits. 'Beyond Reality' invites you to interact with surreal and immersive installations that blur the line between art and experience." },
  ];
  const [selectedExhibition, setSelectedExhibition] = useState<typeof exhibitions[0] | null>(null);

  return (
    <div className="space-y-8">
      {exhibitions.map((exhibition, index) => (
        <motion.div 
          key={exhibition.title}
          className={`p-6 rounded-lg ${darkMode ? 'bg-neutral-800' : 'bg-white'} shadow-lg`}
          whileHover={{ x: 10 }}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 * index }}
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h3 className={`text-xl md:text-2xl font-semibold ${cormorant.className}`}>{exhibition.title}</h3>
              <p className={`text-sm ${darkMode ? 'text-neutral-300' : 'text-neutral-600'} ${raleway.className}`}>
                {exhibition.date} | {exhibition.location}
              </p>
            </div>
            <button 
              className={`py-2 px-6 rounded-full ${
                darkMode 
                  ? 'bg-amber-600 text-white hover:bg-amber-700' 
                  : 'bg-amber-700 text-white hover:bg-amber-800'
              } transition-colors duration-300 text-sm ${raleway.className}`}
              onClick={() => setSelectedExhibition(exhibition)}
            >
              Learn More
            </button>
          </div>
        </motion.div>
      ))}
      <AnimatePresence>
        {selectedExhibition && (
          <Modal isOpen={!!selectedExhibition} onClose={() => setSelectedExhibition(null)} darkMode={darkMode}>
            <div className={`p-6 md:p-10 ${darkMode ? 'text-white' : 'text-neutral-800'} mx-auto w-full max-w-sm`}> 
              <h2 className={`text-2xl md:text-3xl font-bold mb-2 ${cormorant.className}`}>{selectedExhibition.title}</h2>
              <div className={`mb-4 text-sm ${raleway.className} ${darkMode ? 'text-neutral-300' : 'text-neutral-600'}`}>{selectedExhibition.date} | {selectedExhibition.location}</div>
              <div className="my-4 h-px bg-gradient-to-r from-transparent via-neutral-400/30 to-transparent"></div>
              <p className={`text-base md:text-lg leading-relaxed mb-6 ${raleway.className}`}>{selectedExhibition.description}</p>
              <button 
                onClick={() => setSelectedExhibition(null)}
                className={`py-2 px-6 rounded-full ${
                  darkMode 
                    ? 'bg-amber-600 text-white hover:bg-amber-700' 
                    : 'bg-amber-700 text-white hover:bg-amber-800'
                } transition-colors duration-300 text-sm ${raleway.className}`}
              >
                Close
              </button>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
};

const ContactForm = ({ darkMode }: { darkMode: boolean }) => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [tick, setTick] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    setTick(true);
    setTimeout(() => setTick(false), 2000);
  };

  return (
    <form onSubmit={handleSubmit} className={`space-y-6 ${darkMode ? 'text-white' : 'text-neutral-800'}`}>
      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-2">Name</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className={`w-full px-4 py-2 rounded-lg border ${
            darkMode ? 'border-neutral-700 bg-neutral-800 text-white' : 'border-neutral-300 bg-white text-neutral-800'
          }`}
          required
        />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-2">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className={`w-full px-4 py-2 rounded-lg border ${
            darkMode ? 'border-neutral-700 bg-neutral-800 text-white' : 'border-neutral-300 bg-white text-neutral-800'
          }`}
          required
        />
      </div>
      <div>
        <label htmlFor="message" className="block text-sm font-medium mb-2">Message</label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          className={`w-full px-4 py-2 rounded-lg border ${
            darkMode ? 'border-neutral-700 bg-neutral-800 text-white' : 'border-neutral-300 bg-white text-neutral-800'
          }`}
          rows={4}
          required
        />
      </div>
      <button
        type="submit"
        className={`py-2 px-6 rounded-full flex items-center justify-center gap-2 ${
          darkMode ? 'bg-amber-600 text-white hover:bg-amber-700' : 'bg-amber-700 text-white hover:bg-amber-800'
        } transition-colors duration-300 text-sm ${raleway.className}`}
        disabled={tick}
      >
        {tick ? <Check className="w-5 h-5" /> : 'Send Message'}
      </button>
    </form>
  );
};

const Footer = ({ darkMode }: { darkMode: boolean }) => {
  return (
    <footer className={`py-12 px-6 ${darkMode ? 'bg-neutral-800 text-neutral-300' : 'bg-neutral-200 text-neutral-700'}`}>
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className={`text-xl font-semibold mb-4 ${cormorant.className}`}>Artistry Collective</h3>
            <p className={`text-sm ${raleway.className}`}>
              Showcasing extraordinary art pieces from around the world. Join us in celebrating creativity and artistic expression.
            </p>
          </div>
          <div>
            <h3 className={`text-xl font-semibold mb-4 ${cormorant.className}`}>Connect</h3>
            <ul className={`space-y-2 text-sm ${raleway.className}`}>
              <li>Follow us on Instagram</li>
              <li>Like us on Facebook</li>
              <li>Join our Newsletter</li>
              <li>Email: info@artistrycollective.com</li>
            </ul>
          </div>
          <div>
            <h3 className={`text-xl font-semibold mb-4 ${cormorant.className}`}>Visit Us</h3>
            <address className={`text-sm not-italic ${raleway.className}`}>
              123 Gallery Street<br />
              Art District<br />
              City, State 12345<br />
              Open Tuesday - Sunday, 10am - 6pm
            </address>
          </div>
        </div>
        <div className={`mt-12 pt-6 border-t ${darkMode ? 'border-neutral-700' : 'border-neutral-300'} text-center text-sm ${raleway.className}`}>
          <p>&copy; 2025 Artistry Collective. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

// ErrorBoundary for runtime error capture
class ErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean, error: any}> {
  constructor(props: {children: React.ReactNode}) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }
  componentDidCatch(error: any, errorInfo: any) {
    // You can log errorInfo here if needed
    console.error('ErrorBoundary caught:', error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ color: 'red', padding: 32, fontSize: 20 }}>
          <b>Something went wrong:</b>
          <pre>{this.state.error?.toString()}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

const ArtistryCollective = () => {
  console.log('Rendering ArtistryCollective');
  const [darkMode, setDarkMode] = useState(false);
  
  useEffect(() => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setDarkMode(true);
    }
  }, []);
  
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  return (
    <ErrorBoundary>
      <div className={`${cormorant.variable} ${raleway.variable} ${darkMode ? 'bg-neutral-900 text-white' : 'bg-neutral-50 text-neutral-900'} transition-colors duration-500`}>
        <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
        
        <main>
          <div id="home" className="min-h-screen flex flex-col justify-center items-center px-4 sm:px-6 text-center relative">
            <div className="absolute inset-0 -z-10">
              <div className={`absolute inset-0 ${darkMode ? 'bg-neutral-900/80' : 'bg-neutral-200/50'}`} />
              <img 
                src="https://images.pexels.com/photos/20967/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=1600" 
                alt="Art Gallery Background" 
                className="w-full h-full object-cover opacity-30"
              />
            </div>
            
            <motion.h1 
              className={`text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6 ${cormorant.className}`}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              Discover Artistic Brilliance
            </motion.h1>
            
            <motion.p 
              className={`text-base sm:text-lg md:text-xl max-w-2xl mx-auto mb-8 sm:mb-10 px-4 ${raleway.className} font-light`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              Explore our curated collection of masterpieces from renowned artists across the globe. 
              Experience the beauty of artistic expression through our interactive gallery.
            </motion.p>
            
            <motion.button 
              onClick={() => scrollToSection('gallery')}
              className={`py-2 sm:py-3 px-6 sm:px-8 rounded-full ${
                darkMode 
                  ? 'bg-amber-600 text-white hover:bg-amber-700' 
                  : 'bg-amber-700 text-white hover:bg-amber-800'
              } transition-all duration-300 text-sm sm:text-base ${raleway.className} font-medium`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              Explore Gallery
            </motion.button>
            
            <motion.div 
              onClick={() => scrollToSection('gallery')}
              className="absolute bottom-10 left-0 right-0 flex justify-center cursor-pointer"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              transition={{ duration: 0.8, delay: 1.2 }}
              whileHover={{ opacity: 1, scale: 1.2 }}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-6 w-6 animate-bounce" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </motion.div>
          </div>
          
          {/* Art Collage Section */}
          <section id="gallery">
            <Section 
              title="Interactive Art Collection" 
              description="Hover over each piece to discover its story. Click on artwork to see details and descriptions. Our collection spans centuries of artistic innovation and expression."
              darkMode={darkMode}
            >
              <ArtCollage darkMode={darkMode} />
            </Section>
          </section>
          
          {/* Featured Artists Section */}
          <section id="artists">
            <Section 
              title="Featured Artists" 
              description="Meet the creative minds behind our curated collection. Each artist brings their unique perspective and technique to our gallery."
              darkMode={darkMode}
              direction="right"
            >
              <FeaturedArtists darkMode={darkMode} />
            </Section>
          </section>
          
          {/* Upcoming Exhibitions Section */}
          <section id="exhibitions">
            <Section 
              title="Upcoming Exhibitions" 
              description="Mark your calendar for our special exhibitions featuring exclusive collections and immersive artistic experiences."
              darkMode={darkMode}
            >
              <Exhibitions darkMode={darkMode} />
            </Section>
          </section>
          
          {/* Contact Section */}
          <section id="contact">
            <Section 
              title="Get in Touch" 
              description="Have questions or interested in our exhibitions? We'd love to hear from you."
              darkMode={darkMode}
              isLast={true}
            >
              <ContactForm darkMode={darkMode} />
            </Section>
          </section>
        </main>
        
        <Footer darkMode={darkMode} />
      </div>
    </ErrorBoundary>
  );
};

export default ArtistryCollective;
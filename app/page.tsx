"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Artwork = {
  id: number;
  title: string;
  category: string;
  image: string;
};

export default function FamilyArtGallery() {
  const [darkMode, setDarkMode] = useState(false);
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);

  const gameArt = [
    { 
      id: 1, 
      title: "Dragon Adventure", 
      category: "fantasy", 
      image: "https://images.unsplash.com/photo-1608889825205-eebdb9fc5806?w=500&auto=format&fit=crop&q=60" 
    },
    { 
      id: 2, 
      title: "Animal Puzzle", 
      category: "puzzle", 
      image: "https://images.unsplash.com/photo-1637858868799-7f26a0640eb6?w=500&auto=format&fit=crop&q=60" 
    },
    { 
      id: 3, 
      title: "Space Explorers", 
      category: "sci-fi", 
      image: "https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?w=500&auto=format&fit=crop&q=60" 
    },
    { 
      id: 4, 
      title: "Jungle Quest", 
      category: "adventure", 
      image: "https://images.unsplash.com/photo-1559494007-9f5847c49d94?w=500&auto=format&fit=crop&q=60" 
    },
    { 
      id: 5, 
      title: "Fairy Garden", 
      category: "fantasy", 
      image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500&auto=format&fit=crop&q=60" 
    },
    { 
      id: 6, 
      title: "Dinosaur Park", 
      category: "adventure", 
      image: "https://images.unsplash.com/photo-1633876204719-dd74580764ea?q=80&w=3150&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
    },
    { 
      id: 7, 
      title: "Robot City", 
      category: "sci-fi", 
      image: "https://images.unsplash.com/photo-1589254065878-42c9da997008?w=500&auto=format&fit=crop&q=60" 
    },
    { 
      id: 8, 
      title: "Treasure Hunt", 
      category: "puzzle", 
      image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500&auto=format&fit=crop&q=60" 
    }
  ];

  useEffect(() => {
    setTimeout(() => {
      setArtworks(gameArt);
      setIsLoading(false);
    }, 800);

    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setDarkMode(true);
    }
  }, []);

  useEffect(() => {
    document.body.style.backgroundColor = darkMode ? "#1a1a2e" : "#f8f9fa";
    document.body.style.color = darkMode ? "#f0f0f0" : "#333333";
  }, [darkMode]);

  const filteredArt = selectedCategory === "all" 
    ? artworks 
    : artworks.filter(art => art.category === selectedCategory);

  return (
    <div className={`min-h-screen p-5 max-w-7xl mx-auto transition-all duration-300 ${darkMode ? "bg-[#1a1a2e] text-[#f0f0f0]" : "bg-[#f5f7fa] text-[#22223b]"}`}>
      <header className={`relative flex flex-row items-center justify-between gap-3 mb-8 flex-wrap ${darkMode ? "bg-transparent" : "bg-[#e3eafc]"} rounded-xl px-4 py-3`}>
        <h1 className={`min-w-0 truncate font-['Comic_Sans_MS'] text-xl sm:text-3xl md:text-4xl ${darkMode ? "text-[#ff9e00]" : "text-[#ff8800]"} mr-12 sm:mr-0`}>🎨 Family Games Illustrations</h1>
        <button 
          className={`${darkMode ? "bg-gray-800 text-white" : "bg-[#f1f5f9] text-[#2563eb]"} h-9 w-9 sm:h-auto sm:w-auto rounded-full flex justify-center items-center gap-2 font-bold transition-all duration-200 hover:scale-105 shrink-0 absolute right-4 top-1/2 -translate-y-1/2 z-10 sm:static sm:right-auto sm:top-auto sm:translate-y-0 p-3`}
          onClick={() => setDarkMode(!darkMode)}
        >
          <span className="block sm:hidden text-xl">{darkMode ? "☀️" : "🌙"}</span>
          <span className="hidden sm:block">{darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}</span>
        </button>
      </header>

      <div className="flex gap-2.5 mb-5 overflow-x-auto pb-2.5 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent">
        <button 
          className={`${selectedCategory === "all" ? (darkMode ? "bg-[#ff9e00] text-white" : "bg-[#2563eb] text-white") : (darkMode ? "bg-gray-800 text-white" : "bg-[#f1f5f9] text-[#2563eb]")} px-4 py-2 rounded-full whitespace-nowrap transition-all duration-200 hover:-translate-y-0.5 font-medium`}
          onClick={() => setSelectedCategory("all")}
        >
          All Games
        </button>
        <button 
          className={`${selectedCategory === "fantasy" ? (darkMode ? "bg-[#ff9e00] text-white" : "bg-[#2563eb] text-white") : (darkMode ? "bg-gray-800 text-white" : "bg-[#f1f5f9] text-[#2563eb]")} px-4 py-2 rounded-full whitespace-nowrap transition-all duration-200 hover:-translate-y-0.5 font-medium`}
          onClick={() => setSelectedCategory("fantasy")}
        >
          Fantasy
        </button>
        <button 
          className={`${selectedCategory === "adventure" ? (darkMode ? "bg-[#ff9e00] text-white" : "bg-[#2563eb] text-white") : (darkMode ? "bg-gray-800 text-white" : "bg-[#f1f5f9] text-[#2563eb]")} px-4 py-2 rounded-full whitespace-nowrap transition-all duration-200 hover:-translate-y-0.5 font-medium`}
          onClick={() => setSelectedCategory("adventure")}
        >
          Adventure
        </button>
        <button 
          className={`${selectedCategory === "puzzle" ? (darkMode ? "bg-[#ff9e00] text-white" : "bg-[#2563eb] text-white") : (darkMode ? "bg-gray-800 text-white" : "bg-[#f1f5f9] text-[#2563eb]")} px-4 py-2 rounded-full whitespace-nowrap transition-all duration-200 hover:-translate-y-0.5 font-medium`}
          onClick={() => setSelectedCategory("puzzle")}
        >
          Puzzle
        </button>
        <button 
          className={`${selectedCategory === "sci-fi" ? (darkMode ? "bg-[#ff9e00] text-white" : "bg-[#2563eb] text-white") : (darkMode ? "bg-gray-800 text-white" : "bg-[#f1f5f9] text-[#2563eb]")} px-4 py-2 rounded-full whitespace-nowrap transition-all duration-200 hover:-translate-y-0.5 font-medium`}
          onClick={() => setSelectedCategory("sci-fi")}
        >
          Sci-Fi
        </button>
      </div>

      {isLoading ? (
        <div className={`flex justify-center items-center h-48 text-lg ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
          Loading family-friendly artwork...
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filteredArt.map(art => (
            <div 
              key={art.id} 
              className={`${darkMode ? "bg-[#16213e] text-white" : "bg-white text-[#22223b]"} rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-1 cursor-pointer`} 
              onClick={() => setSelectedArtwork(art)}
            >
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={art.image} 
                  alt={art.title} 
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null;
                    target.src = `data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='250' height='200' viewBox='0 0 250 200'%3E%3Crect fill='%23${darkMode ? "2d3748" : "e2e8f0"}' width='250' height='200'/%3E%3Ctext fill='%23${darkMode ? "718096" : "a0aec0"}' font-family='sans-serif' font-size='16' dy='.3em' text-anchor='middle' x='125' y='100'%3E${art.title}%3C/text%3E%3C/svg%3E`;
                  }}
                />
              </div>
              <div className="p-4">
                <h3 className={`font-semibold mb-1 ${darkMode ? "text-white" : "text-[#22223b]"}`}>{art.title}</h3>
                <p className={`text-sm capitalize ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{art.category}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {selectedArtwork && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={() => setSelectedArtwork(null)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className={`${darkMode ? "bg-[#16213e]" : "bg-white"} rounded-lg p-6 max-w-2xl w-full mx-4 relative`}
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              <div className="relative">
                <button 
                  className={`absolute -top-3 -right-3 w-8 h-8 rounded-full flex items-center justify-center ${darkMode ? "bg-gray-800 hover:bg-gray-700" : "bg-gray-200 hover:bg-gray-300"} transition-all duration-200 hover:scale-110 z-10`}
                  onClick={() => setSelectedArtwork(null)}
                >
                  <span className="text-lg">✕</span>
                </button>
                <img 
                  src={selectedArtwork.image} 
                  alt={selectedArtwork.title} 
                  className="w-full h-96 object-cover rounded-lg mb-4 transition-transform duration-300 hover:scale-105"
                />
              </div>
              <h2 className={`${darkMode ? "text-white" : "text-gray-800"} text-2xl font-bold mb-2`}>
                {selectedArtwork.title}
              </h2>
              <p className={`${darkMode ? "text-gray-400" : "text-gray-600"} text-lg capitalize`}>
                {selectedArtwork.category}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Add these styles to your globals.css or create a new CSS file
const styles = `
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes scaleIn {
  from {
    transform: scale(0.9);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

.animate-fadeIn {
  animation: fadeIn 0.3s ease-out;
}

.animate-scaleIn {
  animation: scaleIn 0.3s ease-out;
}
`;
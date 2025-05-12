"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Space_Grotesk, Playfair_Display, Outfit } from "next/font/google";
import {
  Heart,
  Share2,
  Eye,
  Palette,
  GalleryVertical,
  LogIn,
  Upload,
  Trash2,
  Check,
  X,
  Moon,
  Sun,
} from "lucide-react";

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"] });
const playfairDisplay = Playfair_Display({ subsets: ["latin"] });
const outfit = Outfit({ subsets: ["latin"] });

const DUMMY_ARTWORKS = [
  {
    id: "artwork-1",
    title: "Ephemeral Bloom",
    description:
      "A fleeting digital blossom that challenges perceptions of beauty and impermanence in the virtual realm.",
    image:
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=500&h=500&q=60&fit=crop",
    likes: 1247,
    views: 5623,
    artistNotes:
      "I created this piece by combining organic 3D modeling with AI-generated color palettes. The flower blooms and wilts in a 3D loop, symbolizing the transient nature of beauty in the digital age.",
    tags: ["3D Art", "Generative Art", "Digital Art"],
    dimensions: "1500 x 1000 px",
    createdAt: "2024-03-15T10:30:00Z",
  },
  {
    id: "artwork-2",
    title: "Neon Dreamscape",
    description:
      "A vibrant, immersive world where neon lights and digital geometry create a surreal dreamscape.",
    image:
      "https://images.unsplash.com/photo-1536851101967-55988a52f455?w=500&h=500&q=60&fit=crop",
    likes: 986,
    views: 4219,
    artistNotes:
      "This artwork explores the intersection of digital architecture and neon aesthetics. I used a combination of Three.js and custom shaders to create the glowing geometry.",
    tags: ["Digital Art", "Neon Art", "3D Art"],
    dimensions: "2000 x 1500 px",
    createdAt: "2024-02-20T14:45:00Z",
  },
  {
    id: "artwork-3",
    title: "Cybernetic Eye",
    description:
      "A conceptual artwork exploring the relationship between human vision and digital perception through a cybernetic eye motif.",
    image:
      "https://images.stockcake.com/public/0/2/9/02907f80-d192-47dd-9ea4-c6c1c01ae119_large/futuristic-eye-art-stockcake.jpg",
    likes: 1562,
    views: 7391,
    artistNotes:
      "This piece examines the fusion of biological and artificial vision. I employed a mix of 3D modeling and post-processing effects to achieve the cybernetic aesthetic.",
    tags: ["Digital Art", "Cyberpunk", "Conceptual Art"],
    dimensions: "1800 x 1200 px",
    createdAt: "2024-01-10T09:15:00Z",
  },
  {
    id: "artwork-4",
    title: "Data Visualization",
    description:
      "A visual representation of complex data structures transformed into an abstract digital landscape.",
    image: "https://i.ytimg.com/vi/pcnvp8llj5A/maxresdefault.jpg",
    likes: 893,
    views: 3987,
    artistNotes:
      "I developed a custom data visualization algorithm to transform raw data into this abstract landscape. The colors represent different data clusters.",
    tags: ["Data Art", "Digital Art", "Abstract"],
    dimensions: "2500 x 2000 px",
    createdAt: "2023-12-05T16:20:00Z",
  },
  {
    id: "artwork-5",
    title: "Virtual Fragment",
    description:
      "A digital abstraction exploring the concept of fractured identity in virtual spaces.",
    image:
      "https://fubar.space/wp-content/uploads/2024/10/2024-fubar-bckg-hd_flat.png",
    likes: 674,
    views: 3124,
    artistNotes:
      "This artwork uses algorithmic fragmentation to explore digital identity. The scattered elements represent the fractured self in virtual environments.",
    tags: ["Digital Art", "Abstract", "Conceptual"],
    dimensions: "1200 x 800 px",
    createdAt: "2023-11-15T11:10:00Z",
  },
  {
    id: "artwork-6",
    title: "Neon Uprising",
    description:
      "A vibrant digital artwork capturing the energy of a neon-lit urban uprising.",
    image:
      "https://img.artiversehub.ai/online/2025/2/16/f4c955f9-f172-41fa-8df1-65c8f469413a_1305143.png",
    likes: 1453,
    views: 6235,
    artistNotes:
      "I created this piece by layering multiple neon elements in a dynamic composition. The artwork represents the power of collective action in urban environments.",
    tags: ["Digital Art", "Neon", "Urban Art"],
    dimensions: "3000 x 2000 px",
    createdAt: "2023-10-20T15:25:00Z",
  },
  {
    id: "artwork-7",
    title: "Cybernetic Dreams",
    description:
      "A futuristic digital artwork merging human and machine elements in a neon-infused dreamscape.",
    image:
      "https://images.stockcake.com/public/3/2/b/32b84cb7-c585-4dba-8b2a-54bab0c82c07_large/neon-robot-art-stockcake.jpg",
    likes: 2198,
    views: 9432,
    artistNotes:
      "This artwork explores the intersection of human consciousness and artificial intelligence. I used a combination of 3D rendering and AI-assisted techniques to create the surreal landscape.",
    tags: ["Digital Art", "Cyberpunk", "AI Art"],
    dimensions: "2800 x 1800 px",
    createdAt: "2023-09-15T10:05:00Z",
  },
  {
    id: "artwork-8",
    title: "Digital Displacement",
    description:
      "A conceptual artwork examining the effects of digital technology on human perception and reality.",
    image:
      "https://news.mit.edu/sites/default/files/images/202306/MIT-3Q-GenerativeAI-01-press.jpg",
    likes: 1873,
    views: 7654,
    artistNotes:
      "I created this piece by manipulating digital artifacts and glitches to create a distorted reality effect. The artwork questions the reliability of digital information.",
    tags: ["Digital Art", "Conceptual", "Glitch Art"],
    dimensions: "2200 x 1500 px",
    createdAt: "2023-08-10T14:30:00Z",
  },
  {
    id: "artwork-9",
    title: "Quantum Entanglement",
    description:
      "An abstract representation of quantum physics principles visualized through digital art.",
    image:
      "https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?w=500&h=500&q=60&fit=crop",
    likes: 2304,
    views: 8971,
    artistNotes:
      "This piece attempts to visualize the mysterious world of quantum mechanics through abstract forms and ethereal connections.",
    tags: ["Digital Art", "Science Art", "Abstract"],
    dimensions: "2400 x 1600 px",
    createdAt: "2023-07-05T09:45:00Z",
  },
  {
    id: "artwork-10",
    title: "Fractal Dimensions",
    description:
      "A mesmerizing exploration of mathematical beauty through fractal patterns and geometric shapes.",
    image:
      "https://images.unsplash.com/photo-1519608487953-e999c86e7455?w=500&h=500&q=60&fit=crop",
    likes: 1876,
    views: 7562,
    artistNotes:
      "I used mathematical algorithms to generate recursive patterns that create infinite visual depth and complexity.",
    tags: ["Digital Art", "Geometric", "Mathematics"],
    dimensions: "2600 x 1800 px",
    createdAt: "2023-06-20T11:20:00Z",
  },
  {
    id: "artwork-11",
    title: "Ethereal Landscapes",
    description:
      "Dreamlike digital landscapes that blur the line between reality and imagination.",
    image:
      "https://images.unsplash.com/photo-1519638831568-d9897f54ed69?w=500&h=500&q=60&fit=crop",
    likes: 1543,
    views: 6389,
    artistNotes:
      "These landscapes are created by blending photography with digital painting techniques to create surreal environments.",
    tags: ["Digital Art", "Surreal", "Landscape"],
    dimensions: "3200 x 1800 px",
    createdAt: "2023-05-15T14:10:00Z",
  },
  {
    id: "artwork-12",
    title: "Neural Networks",
    description:
      "Visual interpretation of artificial neural networks and machine learning concepts.",
    image:
      "https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?w=500&h=500&q=60&fit=crop",
    likes: 2067,
    views: 9128,
    artistNotes:
      "This artwork visualizes how artificial intelligence processes and learns from data through interconnected nodes.",
    tags: ["Digital Art", "AI Art", "Technology"],
    dimensions: "2800 x 2000 px",
    createdAt: "2023-04-10T16:55:00Z",
  },
];

interface Artwork {
  id: string;
  title: string;
  description: string;
  image: string;
  likes: number;
  views: number;
  artistNotes: string;
  tags: string[];
  dimensions: string;
  createdAt: string;
}

interface ArtworkCardProps {
  artwork: Artwork;
  index: number;
  hoveredArtwork: string | null;
  setHoveredArtwork: (id: string | null) => void;
  onLike: (id: string) => void;
  onShare: (artwork: Artwork) => void;
  onViewDetails: (artwork: Artwork) => void;
  isDarkMode: boolean;
  likedArtworks: string[];
}

interface ArtworkDetails {
  artwork: Artwork;
  codeModalOpen: boolean;
  shareModalOpen: boolean;
  liked: boolean;
  likeCount: number;
  animationKey: number;
}

interface AdminPanelProps {
  artworks: Artwork[];
  onAddArtwork: (artwork: Artwork) => void;
  onDeleteArtwork: (id: string) => void;
  isDarkMode: boolean;
  onLogout: () => void;
}

interface NewArtwork {
  title: string;
  description: string;
  image: string;
  artistNotes: string;
  tags: string[];
  dimensions: string;
}

interface TagOption {
  label: string;
  value: string;
}

const tagOptions: TagOption[] = [
  { label: "3D Art", value: "3d-art" },
  { label: "Abstract", value: "abstract" },
  { label: "AI Art", value: "ai-art" },
  { label: "Conceptual", value: "conceptual" },
  { label: "Cyberpunk", value: "cyberpunk" },
  { label: "Data Art", value: "data-art" },
  { label: "Digital Art", value: "digital-art" },
  { label: "Generative Art", value: "generative-art" },
  { label: "Glitch Art", value: "glitch-art" },
  { label: "Neon Art", value: "neon-art" },
  { label: "Urban Art", value: "urban-art" },
];

const AdminPanel: React.FC<AdminPanelProps> = ({
  artworks,
  onAddArtwork,
  onDeleteArtwork,
  isDarkMode,
  onLogout,
}) => {
  const [newArtwork, setNewArtwork] = useState<NewArtwork>({
    title: "",
    description: "",
    image: "",
    artistNotes: "",
    tags: [],
    dimensions: "",
  });

  const [uploadModalOpen, setUploadModalOpen] = useState(false);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (uploadModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    // Cleanup function to reset overflow when component unmounts
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [uploadModalOpen]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewArtwork((prev) => ({ ...prev, [name]: value }));
  };

  const handleTagChange = (selectedOptions: TagOption[]) => {
    setNewArtwork((prev) => ({
      ...prev,
      tags: selectedOptions.map((option) => option.value),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !newArtwork.title ||
      !newArtwork.description ||
      !newArtwork.image ||
      !newArtwork.artistNotes ||
      !newArtwork.dimensions
    ) {
      alert("Please fill out all required fields.");
      return;
    }

    const artworkToAdd: Artwork = {
      id: `artwork-${Date.now()}`,
      title: newArtwork.title,
      description: newArtwork.description,
      image: newArtwork.image,
      artistNotes: newArtwork.artistNotes,
      tags: newArtwork.tags,
      dimensions: newArtwork.dimensions,
      likes: 0,
      views: 0,
      createdAt: new Date().toISOString(),
    };

    onAddArtwork(artworkToAdd);

    // Reset the form
    setNewArtwork({
      title: "",
      description: "",
      image: "",
      artistNotes: "",
      tags: [],
      dimensions: "",
    });
    
    // Close the modal after successful submission
    setUploadModalOpen(false);
  };

  const toggleUploadModal = () => {
    setUploadModalOpen(!uploadModalOpen);
    setNewArtwork({
      title: "",
      description: "",
      image: "",
      artistNotes: "",
      tags: [],
      dimensions: "",
    });
  };

  return (
    <div
      className={`rounded-xl shadow-lg shadow-purple-500/10 overflow-hidden border ${
        isDarkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"
      }`}
    >
      <div
        className={`flex justify-between items-center p-6 border-b ${
          isDarkMode ? "border-gray-800" : "border-gray-200"
        }`}
      >
        <h2
          className={`text-xl font-bold flex items-center gap-2 ${
            isDarkMode ? "text-white" : "text-gray-900"
          }`}
        >
          <Palette className="w-6 h-6 text-purple-400" />
          Admin Panel
        </h2>
        <div className="flex items-center gap-4">
          <motion.button
            onClick={toggleUploadModal}
            className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-3 sm:px-4 rounded-lg transition-colors duration-300 flex items-center gap-2 cursor-pointer"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <Upload className="w-4 h-4" />
            <span className="hidden sm:inline">Upload New Artwork</span>
          </motion.button>
          
          <motion.button
            onClick={onLogout}
            className="bg-gray-700 hover:bg-gray-800 text-white font-medium py-2 px-3 sm:px-4 rounded-lg transition-colors duration-300 flex items-center gap-2 cursor-pointer"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <LogIn className="w-4 h-4 transform rotate-180" />
            <span className="hidden sm:inline">Logout</span>
          </motion.button>
        </div>
      </div>

      {uploadModalOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className={`rounded-xl shadow-2xl w-full max-w-2xl border flex flex-col ${
              isDarkMode
                ? "bg-gray-900 border-gray-800"
                : "bg-white border-gray-200"
            } max-h-[90vh]`}
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
          >
            <div
              className={`flex justify-between items-center p-6 border-b flex-shrink-0 ${
                isDarkMode ? "border-gray-800" : "border-gray-200"
              }`}
            >
              <h3
                className={`text-xl font-bold ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Upload New Artwork
              </h3>
              <motion.button
                onClick={toggleUploadModal}
                className={`p-1 rounded-full transition-colors cursor-pointer ${
                  isDarkMode
                    ? "text-gray-400 hover:bg-gray-700 hover:text-white"
                    : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>

            <div className="overflow-y-auto">
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div className="space-y-2">
                  <label
                    htmlFor="title"
                    className={`text-sm font-medium block ${
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="title"
                    type="text"
                    name="title"
                    value={newArtwork.title}
                    onChange={handleInputChange}
                    className={`w-full border rounded-lg p-3 ${
                      isDarkMode
                        ? "bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                        : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500"
                    } focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all`}
                    placeholder="Artwork title"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="description"
                    className={`text-sm font-medium block ${
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={newArtwork.description}
                    onChange={handleInputChange}
                    className={`w-full border rounded-lg p-3 ${
                      isDarkMode
                        ? "bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                        : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500"
                    } focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all`}
                    placeholder="Artwork description"
                    rows={3}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="image"
                    className={`text-sm font-medium block ${
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Image URL <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="image"
                    type="url"
                    name="image"
                    value={newArtwork.image}
                    onChange={handleInputChange}
                    className={`w-full border rounded-lg p-3 ${
                      isDarkMode
                        ? "bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                        : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500"
                    } focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all`}
                    placeholder="https://example.com/image.jpg"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label
                      htmlFor="dimensions"
                      className={`text-sm font-medium block ${
                        isDarkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Dimensions <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="dimensions"
                      type="text"
                      name="dimensions"
                      value={newArtwork.dimensions}
                      onChange={handleInputChange}
                      className={`w-full border rounded-lg p-3 ${
                        isDarkMode
                          ? "bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                          : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500"
                      } focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all`}
                      placeholder="e.g., 1920 x 1080 px"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="tags"
                      className={`text-sm font-medium block ${
                        isDarkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Tags
                    </label>
                    <select
                      id="tags"
                      multiple
                      value={newArtwork.tags}
                      onChange={(e) =>
                        handleTagChange(
                          Array.from(e.target.selectedOptions, (option) => ({
                            label: option.text,
                            value: option.value,
                          }))
                        )
                      }
                      className={`w-full border rounded-lg p-3 cursor-pointer h-24 ${
                        isDarkMode
                          ? "bg-gray-800 border-gray-700 text-white"
                          : "bg-gray-50 border-gray-300 text-gray-900"
                      } focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all`}
                    >
                      {tagOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="artistNotes"
                    className={`text-sm font-medium block ${
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Artist Notes <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="artistNotes"
                    name="artistNotes"
                    value={newArtwork.artistNotes}
                    onChange={handleInputChange}
                    className={`w-full border rounded-lg p-3 ${
                      isDarkMode
                        ? "bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                        : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500"
                    } focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all`}
                    placeholder="Notes about the artwork"
                    rows={3}
                    required
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <motion.button
                    type="button"
                    onClick={toggleUploadModal}
                    className={`font-medium py-2 px-4 rounded-lg transition-colors duration-300 cursor-pointer ${
                      isDarkMode
                        ? "text-gray-300 hover:bg-gray-700"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    type="submit"
                    className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-300 cursor-pointer"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    Upload Artwork
                  </motion.button>
                </div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}

      <div className="p-6">
        <h3
          className={`text-lg font-semibold mb-4 ${
            isDarkMode ? "text-white" : "text-gray-900"
          }`}
        >
          Manage Artworks
        </h3>

        <div
          className={`overflow-x-auto rounded-lg border ${
            isDarkMode ? "border-gray-800" : "border-gray-200"
          }`}
        >
          <table className="min-w-full divide-y ${isDarkMode ? 'divide-gray-800' : 'divide-gray-200'}">
            <thead className={isDarkMode ? "bg-gray-800" : "bg-gray-50"}>
              <tr>
                <th
                  scope="col"
                  className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                    isDarkMode ? "text-gray-300" : "text-gray-500"
                  }`}
                >
                  Title
                </th>
                <th
                  scope="col"
                  className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                    isDarkMode ? "text-gray-300" : "text-gray-500"
                  }`}
                >
                  Views
                </th>
                <th
                  scope="col"
                  className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                    isDarkMode ? "text-gray-300" : "text-gray-500"
                  }`}
                >
                  Likes
                </th>
                <th
                  scope="col"
                  className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                    isDarkMode ? "text-gray-300" : "text-gray-500"
                  }`}
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody
              className={`divide-y ${
                isDarkMode
                  ? "bg-gray-900 divide-gray-800"
                  : "bg-white divide-gray-200"
              }`}
            >
              {artworks.length > 0 ? (
                artworks.map((artwork) => (
                  <motion.tr
                    key={artwork.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className={`transition-colors duration-200 ${
                      isDarkMode ? "hover:bg-gray-800/50" : "hover:bg-gray-50"
                    }`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-16 h-16 rounded-lg overflow-hidden flex items-center justify-center ${
                            isDarkMode ? "bg-gray-800" : "bg-gray-100"
                          }`}
                        >
                          <img
                            src={artwork.image}
                            alt={artwork.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <div
                            className={`text-sm font-medium ${
                              isDarkMode ? "text-white" : "text-gray-900"
                            }`}
                          >
                            {artwork.title}
                          </div>
                          <div
                            className={`text-xs ${
                              isDarkMode ? "text-gray-400" : "text-gray-500"
                            }`}
                          >
                            {artwork.dimensions}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td
                      className={`px-6 py-4 whitespace-nowrap text-sm ${
                        isDarkMode ? "text-gray-300" : "text-gray-900"
                      }`}
                    >
                      {artwork.views}
                    </td>
                    <td
                      className={`px-6 py-4 whitespace-nowrap text-sm ${
                        isDarkMode ? "text-gray-300" : "text-gray-900"
                      }`}
                    >
                      {artwork.likes}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <motion.button
                        onClick={() => onDeleteArtwork(artwork.id)}
                        className="text-red-500 hover:text-red-400 cursor-pointer"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </motion.button>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4}>
                    <div
                      className={`flex flex-col items-center justify-center py-12 ${
                        isDarkMode
                          ? "bg-gray-900 text-gray-400"
                          : "bg-white text-gray-500"
                      }`}
                    >
                      <svg
                        className="w-12 h-12 mb-4 text-purple-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.5}
                      >
                        <circle
                          cx="12"
                          cy="12"
                          r="9"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          fill="none"
                        />
                        <line
                          x1="8"
                          y1="8"
                          x2="16"
                          y2="16"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                        <line
                          x1="16"
                          y1="8"
                          x2="8"
                          y2="16"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                      </svg>
                      <span className="text-lg font-semibold mb-1">
                        No artworks found
                      </span>
                      <span className="text-sm">
                        Get started by uploading your first artwork!
                      </span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const ArtworkCard: React.FC<ArtworkCardProps> = ({
  artwork,
  index,
  hoveredArtwork,
  setHoveredArtwork,
  onLike,
  onShare,
  onViewDetails,
  isDarkMode,
  likedArtworks,
}) => {
  const isHovered = hoveredArtwork === artwork.id;

  return (
    <motion.div
      className={`group relative rounded-xl shadow-lg shadow-purple-500/10 overflow-hidden border cursor-pointer h-full flex flex-col ${
        isDarkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"
      }`}
      initial={{ opacity: 0, y: 20 }}
      animate={{
        opacity: 1,
        y: 0,
        scale: isHovered ? 1.05 : 1,
        boxShadow: isHovered
          ? "0 25px 50px -12px rgba(168,85,247,0.4)"
          : isDarkMode
          ? "0 4px 6px -1px rgba(0,0,0,0.1)"
          : "0 4px 6px -1px rgba(0,0,0,0.1)",
      }}
      transition={{
        duration: 0.3,
        delay: index * 0.05,
        scale: { duration: 0.2 },
      }}
      onMouseEnter={() => setHoveredArtwork(artwork.id)}
      onMouseLeave={() => setHoveredArtwork(null)}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      onClick={() => onViewDetails(artwork)}
    >
      <div
        className={`aspect-[4/3] w-full relative overflow-hidden ${
          isDarkMode ? "bg-gray-800" : "bg-gray-100"
        }`}
      >
        <img
          src={artwork.image}
          alt={artwork.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-60 group-hover:opacity-100 transition-opacity duration-300"></div>

        <div className="absolute top-4 left-4 flex flex-wrap gap-2">
          {artwork.tags.length > 0 && (
            <div className="bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {artwork.tags[0]}
            </div>
          )}
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-0 transition-transform duration-300">
          <h3 className="text-2xl font-bold text-white mb-2 drop-shadow-lg line-clamp-1">
            {artwork.title}
          </h3>
          <p className="text-xs text-gray-200 mb-4 line-clamp-2 drop-shadow-md h-8">
            {artwork.description}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.button
                onClick={(e) => {
                  e.stopPropagation();
                  onLike(artwork.id);
                }}
                className="flex items-center gap-2 text-pink-400 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full hover:bg-white/20 transition-colors cursor-pointer"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Heart
                  className={`w-4 h-4 ${likedArtworks.includes(artwork.id) ? "fill-current" : ""}`}
                />
                <span className="text-sm font-medium">{artwork.likes}</span>
              </motion.button>

              <motion.button
                onClick={(e) => {
                  e.stopPropagation();
                  onShare(artwork);
                }}
                className="text-gray-200 bg-white/10 backdrop-blur-md p-2 rounded-full hover:bg-white/20 transition-colors cursor-pointer"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Share2 className="w-4 h-4" />
              </motion.button>
            </div>

            <div className="flex items-center gap-2 text-gray-200 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full">
              <Eye className="w-4 h-4" />
              <span className="text-sm font-medium">{artwork.views}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const ArtworkDetailsModal: React.FC<{
  details: ArtworkDetails;
  onClose: () => void;
  onLike: (id: string) => void;
  onShare: (artwork: Artwork) => void;
  isDarkMode: boolean;
}> = ({ details, onClose, onLike, onShare, isDarkMode }) => {
  const { artwork, liked, likeCount } = details;

  const handleLike = () => {
    onLike(artwork.id);
  };

  const handleShareClick = () => {
    onShare(artwork);
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm cursor-pointer p-4 overflow-y-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className={`rounded-xl shadow-2xl w-full max-w-5xl mx-auto border overflow-hidden ${
          isDarkMode
            ? "bg-gray-900 border-gray-800"
            : "bg-white border-gray-200"
        } my-4 max-h-[90vh] flex flex-col`}
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 flex justify-end p-3 bg-opacity-80 backdrop-blur-sm border-b border-gray-800">
          <motion.button
            onClick={onClose}
            className="bg-purple-600 hover:bg-purple-700 text-white font-medium px-3 py-1.5 rounded-lg transition-colors duration-300 flex items-center gap-1.5 cursor-pointer text-sm"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <X className="w-4 h-4" />
            Close
          </motion.button>
        </div>

        <div className="overflow-y-auto flex-grow">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-4 sm:p-6">
            <div className="relative">
              <img
                src={artwork.image}
                alt={artwork.title}
                className="w-full h-auto max-h-[50vh] object-cover rounded-lg mx-auto"
              />

              <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <motion.button
                    onClick={handleLike}
                    className="flex items-center gap-2 text-pink-400 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full hover:bg-white/20 transition-colors cursor-pointer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Heart
                      className={`w-4 h-4 ${liked ? "fill-current" : ""}`}
                    />
                    <span className="text-sm font-medium">{likeCount}</span>
                  </motion.button>

                  <motion.button
                    onClick={handleShareClick}
                    className="text-gray-200 bg-white/10 backdrop-blur-md p-2 rounded-full hover:bg-white/20 transition-colors cursor-pointer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Share2 className="w-4 h-4" />
                  </motion.button>
                </div>

                <span className="bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium text-white">
                  {artwork.dimensions}
                </span>
              </div>
            </div>

            <div className="pb-4">
              <div className="flex flex-col justify-between mb-4">
                <h3
                  className={`text-2xl sm:text-3xl font-bold mb-1 ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {artwork.title}
                </h3>
                <span
                  className={`text-sm ${
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  {new Date(artwork.createdAt).toLocaleDateString()}
                </span>
              </div>

              <div className="mb-4">
                <h4
                  className={`text-lg font-semibold mb-2 flex items-center gap-2 ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  <Palette className="w-4 h-4 text-purple-400" />
                  Artist Notes
                </h4>
                <p
                  className={`leading-relaxed ${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  {artwork.artistNotes}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 mt-4">
                {artwork.tags.map((tag, index) => (
                  <span
                    key={index}
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      isDarkMode
                        ? "bg-gray-800 text-gray-300"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const LoginPanel: React.FC<{
  onLogin: (username: string, password: string) => boolean;
  error: string | null;
  setError: (error: string | null) => void;
  isDarkMode: boolean;
}> = ({ onLogin, error, setError, isDarkMode }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (onLogin(username, password)) {
      setUsername("");
      setPassword("");
    } else {
      setError("Invalid username or password");
    }
  };

  return (
    <motion.div
      className={`rounded-xl shadow-lg shadow-purple-500/10 overflow-hidden border h-full flex flex-col ${
        isDarkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"
      }`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="p-6 flex flex-col h-full">
        <h2
          className={`text-2xl font-bold mb-6 flex items-center gap-2 ${
            isDarkMode ? "text-white" : "text-gray-900"
          }`}
        >
          <LogIn className="w-6 h-6 text-purple-400" />
          Admin Login
        </h2>

        {error && (
          <motion.div
            className="bg-red-500/20 border border-red-500/30 text-red-400 p-3 rounded-lg mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col flex-grow">
          <div className="space-y-5 flex-grow">
            <div>
              <label
                htmlFor="username"
                className={`block text-sm font-medium mb-2 ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={`w-full border rounded-lg p-3 ${
                  isDarkMode
                    ? "bg-gray-800 border-gray-700 text-white"
                    : "bg-gray-50 border-gray-300 text-gray-900"
                } focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all`}
                placeholder="Enter your username"
                required
                autoComplete="username"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className={`block text-sm font-medium mb-2 ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full border rounded-lg p-3 ${
                    isDarkMode
                      ? "bg-gray-800 border-gray-700 text-white"
                      : "bg-gray-50 border-gray-300 text-gray-900"
                  } focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all`}
                  placeholder="Enter your password"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute right-3 top-3 cursor-pointer transition-colors ${
                    isDarkMode
                      ? "text-gray-400 hover:text-white"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>
            
            <div className="flex-grow"></div>
          </div>

          {(() => {
            if (typeof window !== "undefined") {
              if (username === "" && password === "") {
                setUsername("admin");
                setPassword("password");
              }
            }
            return null;
          })()}

          <motion.button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-300 mt-6 cursor-pointer text-lg"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            Login
          </motion.button>
        </form>
      </div>
    </motion.div>
  );
};

const Gallery: React.FC<{
  artworks: Artwork[];
  hoveredArtwork: string | null;
  setHoveredArtwork: (id: string | null) => void;
  onLike: (id: string) => void;
  onShare: (artwork: Artwork) => void;
  onViewDetails: (artwork: Artwork) => void;
  isDarkMode: boolean;
  likedArtworks: string[];
}> = ({
  artworks,
  hoveredArtwork,
  setHoveredArtwork,
  onLike,
  onShare,
  onViewDetails,
  isDarkMode,
  likedArtworks,
}) => {
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [0, 1]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [0.95, 1]);
  const y = useTransform(scrollYProgress, [0, 0.2], [50, 0]);

  return (
    <motion.section
      className={`min-h-screen py-24 px-4 sm:px-6 lg:px-8 ${
        isDarkMode ? "bg-gray-950" : "bg-gray-50"
      }`}
      style={{ opacity, scale, y }}
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="inline-block mb-6"
            whileHover={{ scale: 1.05, y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="w-16 h-1 bg-gradient-to-r from-purple-500 to-indigo-600 mx-auto mb-6 rounded-full"></div>
            <h2
              className={`text-5xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent mb-4 leading-relaxed ${spaceGrotesk.className}`}
            >
              Digital Artworks
            </h2>
            <p
              className={`text-xl max-w-2xl mx-auto ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Explore our curated collection of digital art, where technology
              and creativity converge to create immersive visual experiences.
            </p>
          </motion.div>
        </motion.div>

        {artworks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 auto-rows-fr">
            {artworks.map((artwork, index) => (
              <motion.div
                key={artwork.id}
                className="h-full"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                whileHover={{ y: -5 }}
                layout
              >
                <ArtworkCard
                  artwork={artwork}
                  index={index}
                  hoveredArtwork={hoveredArtwork}
                  setHoveredArtwork={setHoveredArtwork}
                  onLike={onLike}
                  onShare={onShare}
                  onViewDetails={onViewDetails}
                  isDarkMode={isDarkMode}
                  likedArtworks={likedArtworks}
                />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-500 mb-6 shadow-lg">
              <svg
                className="w-10 h-10 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <circle
                  cx="12"
                  cy="12"
                  r="9"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  fill="none"
                />
                <line
                  x1="8"
                  y1="8"
                  x2="16"
                  y2="16"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <line
                  x1="16"
                  y1="8"
                  x2="8"
                  y2="16"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <div className="text-2xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
              No artworks found
            </div>
            <div className="text-base text-gray-500 dark:text-gray-400 mb-4">
              Get started by uploading your first artwork!
            </div>
          </div>
        )}
      </div>
    </motion.section>
  );
};

const Hero: React.FC<{
  scrollToGallery: () => void;
  artworks: Artwork[];
  isDarkMode: boolean;
}> = ({ scrollToGallery, artworks, isDarkMode }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [featuredArtwork, setFeaturedArtwork] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setFeaturedArtwork((prev) => (prev + 1) % artworks.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [artworks.length]);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setMousePosition({ x: event.clientX, y: event.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);
  const y = useTransform(scrollYProgress, [0, 0.2], [0, -50]);

  return (
    <motion.section
      className={`min-h-[90vh] relative overflow-hidden ${
        isDarkMode ? "bg-gray-950" : "bg-gray-300"
      }`}
      style={{ opacity, scale, y }}
    >
      <div
        className={`absolute inset-0 z-0 ${
          isDarkMode
            ? "bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950"
            : "bg-gradient-to-b from-purple-50 via-indigo-50 to-purple-50"
        }`}
      ></div>

      <div className="absolute inset-0 overflow-hidden">
        {artworks.map((artwork, index) => (
          <motion.div
            key={artwork.id}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{
              opacity: featuredArtwork === index ? 1 : 0,
              scale: featuredArtwork === index ? 1 : 0.95,
              y: featuredArtwork === index ? 0 : 30,
            }}
            transition={{
              duration: 0.3,
              opacity: { duration: 0.3 },
              scale: { duration: 0.3 },
              y: { duration: 0.3 },
            }}
          >
            <div className="w-full h-full relative">
              <img
                src={artwork.image}
                alt={artwork.title}
                className="w-full h-full object-cover"
              />
              <div
                className={`absolute inset-0 ${
                  isDarkMode
                    ? "bg-gradient-to-t from-black/90 via-black/60 to-black/30"
                    : "bg-gradient-to-t from-gray-900/90 via-gray-900/60 to-gray-900/30"
                }`}
              ></div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="h-screen w-full flex items-center justify-center relative px-4 sm:px-6 lg:px-8 z-10">
        <motion.div
          className="max-w-5xl w-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="text-center">
            <motion.div
              className="inline-block mb-6"
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="w-16 h-1 bg-gradient-to-r from-purple-500 to-indigo-600 mx-auto mb-6 rounded-full"></div>
              <h1
                className={`text-6xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent mb-6 leading-relaxed drop-shadow-lg ${spaceGrotesk.className}`}
              >
                Digital Art Gallery
              </h1>
              <p
                className={`text-xl max-w-2xl mx-auto drop-shadow-md text-white`}
              >
                Explore our curated collection of digital art, where technology
                and creativity converge to create immersive visual experiences.
              </p>
            </motion.div>

            <motion.div
              className="flex flex-wrap justify-center gap-4 mt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <motion.button
                onClick={scrollToGallery}
                className={`px-8 py-4 rounded-lg font-medium text-lg transition-colors duration-300 flex items-center gap-2 shadow-lg shadow-purple-500/20 cursor-pointer ${
                  isDarkMode
                    ? "bg-white text-gray-900 hover:bg-gray-200"
                    : "bg-gray-900 text-white hover:bg-gray-800"
                }`}
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
              >
                <GalleryVertical className="w-5 h-5 text-purple-400" />
                Explore Gallery
              </motion.button>
            </motion.div>
          </div>
        </motion.div>
      </div>

      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
        animate={{
          y: [0, 10, 0],
        }}
        transition={{
          duration: 2,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      >
        <div className="flex flex-col items-center gap-2">
          <span
            className={`text-xs ${
              isDarkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Scroll Down
          </span>
          <div
            className={`w-5 h-10 rounded-full border-2 flex justify-center p-1 ${
              isDarkMode ? "border-gray-400" : "border-gray-600"
            }`}
          >
            <motion.div
              className={`w-1 h-2 rounded-full ${
                isDarkMode ? "bg-gray-400" : "bg-gray-600"
              }`}
              animate={{
                y: [0, 15, 0],
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            />
          </div>
        </div>
      </motion.div>
    </motion.section>
  );
};

const ArtworkShareModal: React.FC<{
  artwork: Artwork;
  onClose: () => void;
  isDarkMode: boolean;
}> = ({ artwork, onClose, isDarkMode }) => {
  const [copied, setCopied] = useState(false);

  const shareUrl = `${window.location.origin}/artwork/${artwork.id}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm cursor-pointer p-4 overflow-y-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className={`rounded-xl shadow-2xl w-full max-w-md mx-auto border overflow-hidden ${
          isDarkMode
            ? "bg-gray-900 border-gray-800"
            : "bg-white border-gray-200"
        } my-4`}
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 sm:p-6">
          <div className="flex justify-between items-center mb-4 sm:mb-6">
            <h3
              className={`text-lg sm:text-xl font-bold ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Share Artwork
            </h3>
            <motion.button
              onClick={onClose}
              className={`cursor-pointer transition-colors ${
                isDarkMode
                  ? "text-gray-400 hover:text-white"
                  : "text-gray-600 hover:text-gray-900"
              }`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <X className="w-5 h-5" />
            </motion.button>
          </div>

          <div className="space-y-4">
            <div
              className={`rounded-lg p-3 sm:p-4 flex items-center justify-between ${
                isDarkMode ? "bg-gray-800" : "bg-gray-50"
              }`}
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <div
                  className={`w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 ${
                    isDarkMode ? "bg-gray-700" : "bg-gray-200"
                  }`}
                >
                  <img
                    src={artwork.image}
                    alt={artwork.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="overflow-hidden">
                  <p
                    className={`text-sm font-medium truncate ${
                      isDarkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {artwork.title}
                  </p>
                  <p
                    className={`text-xs truncate ${
                      isDarkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {artwork.dimensions}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <label
                className={`text-sm font-medium block ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Share Link
              </label>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={shareUrl}
                  readOnly
                  className={`w-full border rounded-lg p-3 cursor-pointer ${
                    isDarkMode
                      ? "bg-gray-800 border-gray-700 text-white"
                      : "bg-gray-50 border-gray-300 text-gray-900"
                  } focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all text-sm`}
                  onClick={(e) => e.currentTarget.select()}
                />
                <motion.button
                  onClick={handleCopyLink}
                  className={`sm:flex-shrink-0 bg-purple-600 hover:bg-purple-700 text-white font-medium px-6 py-3 rounded-lg transition-colors duration-300 flex items-center justify-center gap-2 cursor-pointer ${
                    copied ? "opacity-75 cursor-not-allowed" : ""
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={copied}
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Share2 className="w-4 h-4" />
                      Copy Link
                    </>
                  )}
                </motion.button>
              </div>
            </div>

            <div className="pt-4">
              <p
                className={`text-sm mb-3 ${
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Or share on
              </p>
              <div className="grid grid-cols-2 gap-3">
                <motion.a
                  href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
                    shareUrl
                  )}&text=${encodeURIComponent(artwork.title)}`}
                  target="_blank"
                  className="bg-[#1DA1F2] hover:bg-[#0d95e8] text-white px-4 py-3 rounded-lg transition-colors duration-300 flex items-center justify-center gap-2 cursor-pointer"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                  </svg>
                  Twitter
                </motion.a>

                <motion.a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                    shareUrl
                  )}`}
                  target="_blank"
                  className="bg-[#1877F2] hover:bg-[#1565d8] text-white px-4 py-3 rounded-lg transition-colors duration-300 flex items-center justify-center gap-2 cursor-pointer"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                  </svg>
                  Facebook
                </motion.a>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const Page: React.FC = () => {
  const [artworks, setArtworks] = useState<Artwork[]>(DUMMY_ARTWORKS);
  const [hoveredArtwork, setHoveredArtwork] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  const [likedArtworks, setLikedArtworks] = useState<string[]>([]);
  const [likeCounts, setLikeCounts] = useState(
    artworks.reduce((acc, artwork) => {
      acc[artwork.id] = artwork.likes;
      return acc;
    }, {} as Record<string, number>)
  );
  const [viewCounts, setViewCounts] = useState(
    artworks.reduce((acc, artwork) => {
      acc[artwork.id] = artwork.views;
      return acc;
    }, {} as Record<string, number>)
  );
  const [artworkDetails, setArtworkDetails] = useState<ArtworkDetails | null>(
    null
  );
  const [animationKey, setAnimationKey] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(true);

  const galleryRef = useRef<HTMLDivElement>(null);

  // Prevent background scrolling when modals are open
  useEffect(() => {
    if (artworkDetails || shareModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    // Cleanup function to reset overflow when component unmounts
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [artworkDetails, shareModalOpen]);

  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth";
    return () => {
      document.documentElement.style.scrollBehavior = "auto";
    };
  }, []);

  const scrollToGallery = () => {
    galleryRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const handleScroll = () => {
      const heroSection = document.getElementById("hero");
      const gallerySection = document.getElementById("gallery");

      if (!heroSection || !gallerySection) return;

      const heroHeight = heroSection.offsetHeight;
      const scrollPosition = window.scrollY + window.innerHeight / 2;

      if (scrollPosition < heroHeight * 0.7) {
        setActiveSection("hero");
      } else if (
        scrollPosition >= heroHeight * 0.7 &&
        scrollPosition < heroHeight + gallerySection.offsetHeight * 0.7
      ) {
        setActiveSection("gallery");
      } else {
        setActiveSection(null);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogin = (username: string, password: string) => {
    if (username === "admin" && password === "password") {
      setIsAuthenticated(true);
      setError(null);
      return true;
    }
    return false;
  };

  const handleAddArtwork = (artwork: Artwork) => {
    setArtworks((prev) => [artwork, ...prev]);
  };

  const handleDeleteArtwork = (id: string) => {
    setArtworks((prev) => prev.filter((artwork) => artwork.id !== id));
  };

  const handleLike = (id: string) => {
    // Check if artwork is already liked
    const isAlreadyLiked = likedArtworks.includes(id);
    
    // Update like counts based on toggle behavior
    setLikeCounts((prev) => ({
      ...prev,
      [id]: isAlreadyLiked ? (prev[id] || 0) - 1 : (prev[id] || 0) + 1,
    }));

    // Update liked artworks list
    if (isAlreadyLiked) {
      setLikedArtworks((prev) => prev.filter((artworkId) => artworkId !== id));
    } else {
      setLikedArtworks((prev) => [...prev, id]);
    }

    // Update artworks state with new like count
    setArtworks((prev) =>
      prev.map((artwork) =>
        artwork.id === id
          ? { 
              ...artwork, 
              likes: isAlreadyLiked 
                ? (likeCounts[id] || artwork.likes) - 1 
                : (likeCounts[id] || artwork.likes) + 1 
            }
          : artwork
      )
    );

    // Update artwork details if open
    if (artworkDetails && artworkDetails.artwork.id === id) {
      setArtworkDetails({
        ...artworkDetails,
        liked: !isAlreadyLiked,
        likeCount: isAlreadyLiked 
          ? (artworkDetails.likeCount || 0) - 1 
          : (artworkDetails.likeCount || 0) + 1,
      });
    }
  };

  const handleViewDetails = (artwork: Artwork) => {
    setAnimationKey((prev) => prev + 1);

    // Increment view count when details are opened
    const newViewCount = (viewCounts[artwork.id] || artwork.views) + 1;
    
    // Update view counts
    setViewCounts((prev) => ({
      ...prev,
      [artwork.id]: newViewCount,
    }));

    // Update artworks with new view count
    setArtworks((prev) =>
      prev.map((a) =>
        a.id === artwork.id
          ? { ...a, views: newViewCount }
          : a
      )
    );

    // Set artwork details with updated view count
    setArtworkDetails({
      artwork: {
        ...artwork,
        views: newViewCount,
      },
      codeModalOpen: false,
      shareModalOpen: false,
      liked: likedArtworks.includes(artwork.id),
      likeCount: likeCounts[artwork.id] || artwork.likes,
      animationKey,
    });
  };

  const handleCloseDetails = () => {
    setArtworkDetails(null);
  };

  const handleShare = (artwork: Artwork) => {
    setSelectedArtwork(artwork);
    setShareModalOpen(true);
  };

  const handleCloseShareModal = () => {
    setShareModalOpen(false);
    setSelectedArtwork(null);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  return (
    <div className={`${outfit.className} transition-colors duration-300`}>
      <motion.div
        className={`fixed top-6 left-1/2 -translate-x-1/2 backdrop-blur-md px-6 py-3 rounded-lg flex items-center gap-4 z-50 border shadow-lg shadow-purple-500/10 ${
          isDarkMode
            ? "bg-gray-900/90 border-gray-800"
            : "bg-white/90 border-gray-200"
        }`}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.a
          href="#"
          className={`text-lg font-bold transition-colors cursor-pointer ${
            activeSection === "hero"
              ? "text-purple-400"
              : isDarkMode
              ? "text-white hover:text-purple-400"
              : "text-gray-700 hover:text-purple-600"
          }`}
          whileHover={{ scale: 1.05, y: -5 }}
          whileTap={{ scale: 0.95 }}
        >
          Home
        </motion.a>

        <motion.a
          href="#gallery"
          className={`text-lg font-bold transition-colors cursor-pointer ${
            activeSection === "gallery"
              ? "text-purple-400"
              : isDarkMode
              ? "text-white hover:text-purple-400"
              : "text-gray-700 hover:text-purple-600"
          }`}
          whileHover={{ scale: 1.05, y: -5 }}
          whileTap={{ scale: 0.95 }}
        >
          Gallery
        </motion.a>

        {isAuthenticated && (
          <>
            <motion.div
              className={`w-px h-6 bg-gradient-to-b from-transparent to-transparent ${
                isDarkMode ? "via-gray-600" : "via-gray-400"
              }`}
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            />

            <motion.a
              href="#admin"
              className={`text-lg font-bold transition-colors cursor-pointer ${
                isDarkMode
                  ? "text-white hover:text-purple-400"
                  : "text-gray-700 hover:text-purple-600"
              }`}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              Admin Panel
            </motion.a>
          </>
        )}

        <motion.div
          className={`w-px h-6 bg-gradient-to-b from-transparent to-transparent ${
            isDarkMode ? "via-gray-600" : "via-gray-400"
          }`}
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        />

        <motion.button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className={`p-2 rounded-lg transition-colors cursor-pointer ${
            isDarkMode
              ? "text-white hover:text-purple-400"
              : "text-gray-700 hover:text-purple-600"
          }`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {isDarkMode ? (
            <Sun className="w-5 h-5" />
          ) : (
            <Moon className="w-5 h-5" />
          )}
        </motion.button>
      </motion.div>

      <main>
        <section id="hero">
          <Hero
            scrollToGallery={scrollToGallery}
            artworks={artworks}
            isDarkMode={isDarkMode}
          />
        </section>

        <section id="gallery" ref={galleryRef}>
          <Gallery
            artworks={artworks}
            hoveredArtwork={hoveredArtwork}
            setHoveredArtwork={setHoveredArtwork}
            onLike={handleLike}
            onShare={handleShare}
            onViewDetails={handleViewDetails}
            isDarkMode={isDarkMode}
            likedArtworks={likedArtworks}
          />
        </section>

        {isAuthenticated && (
          <section
            id="admin"
            className={`py-16 px-4 sm:px-6 lg:px-8 ${
              isDarkMode ? "bg-gray-950" : "bg-gray-50"
            }`}
          >
            <div className="max-w-7xl mx-auto">
              <AdminPanel
                artworks={artworks}
                onAddArtwork={handleAddArtwork}
                onDeleteArtwork={handleDeleteArtwork}
                isDarkMode={isDarkMode}
                onLogout={handleLogout}
              />
            </div>
          </section>
        )}

        {!isAuthenticated && (
          <section
            className={`py-16 px-4 sm:px-6 lg:px-8 ${
              isDarkMode ? "bg-gray-950" : "bg-gray-50"
            }`}
          >
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="h-full"
              >
                <LoginPanel
                  onLogin={handleLogin}
                  error={error}
                  setError={setError}
                  isDarkMode={isDarkMode}
                />
              </motion.div>

              <motion.div
                className={`rounded-xl shadow-lg shadow-purple-500/10 overflow-hidden border h-full flex flex-col ${
                  isDarkMode
                    ? "bg-gray-900 border-gray-800"
                    : "bg-white border-gray-200"
                }`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="p-6 flex flex-col h-full">
                  <h2
                    className={`text-2xl font-bold mb-6 flex items-center gap-2 ${
                      isDarkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    <Palette className="w-6 h-6 text-purple-400" />
                    Artwork Guidelines
                  </h2>

                  <div className="space-y-5 flex-grow">
                    <div>
                      <h3
                        className={`text-lg font-semibold mb-2 ${
                          isDarkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        Rights and Usage
                      </h3>
                      <ul
                        className={`space-y-1 ${
                          isDarkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        <li>* My artworks are for personal use only. </li>
                        <li>
                          * Commercial use is not allowed without prior
                          permission.
                        </li>
                        <li>
                          * Please respect the copyright and usage rights of the
                          artworks.
                        </li>
                      </ul>
                    </div>

                    <div className="flex-grow flex flex-col justify-end">
                      <div
                        className={`mt-6 p-4 rounded-lg border border-purple-500/30 ${
                          isDarkMode ? "bg-gray-800" : "bg-purple-50"
                        }`}
                      >
                        <h3
                          className={`text-lg font-semibold mb-3 ${
                            isDarkMode ? "text-white" : "text-gray-900"
                          }`}
                        >
                          Admin Access
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p
                              className={`text-sm font-medium mb-1 ${
                                isDarkMode ? "text-gray-400" : "text-gray-600"
                              }`}
                            >
                              Username:
                            </p>
                            <p className="text-lg font-mono text-purple-400">
                              admin
                            </p>
                          </div>
                          <div>
                            <p
                              className={`text-sm font-medium mb-1 ${
                                isDarkMode ? "text-gray-400" : "text-gray-600"
                              }`}
                            >
                              Password:
                            </p>
                            <p className="text-lg font-mono text-purple-400">
                              password
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </section>
        )}
      </main>

      <footer
        className={`border-t py-12 px-4 sm:px-6 lg:px-8 ${
          isDarkMode
            ? "bg-gray-950 border-gray-800"
            : "bg-gray-50 border-gray-200"
        }`}
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-wrap gap-6">
            <a
              href="#"
              className={`transition-colors font-medium cursor-pointer ${
                isDarkMode
                  ? "text-gray-300 hover:text-purple-400"
                  : "text-gray-600 hover:text-purple-600"
              }`}
            >
              Privacy
            </a>
            <a
              href="#"
              className={`transition-colors font-medium cursor-pointer ${
                isDarkMode
                  ? "text-gray-300 hover:text-purple-400"
                  : "text-gray-600 hover:text-purple-600"
              }`}
            >
              Terms
            </a>
            <a
              href="#"
              className={`transition-colors font-medium cursor-pointer ${
                isDarkMode
                  ? "text-gray-300 hover:text-purple-400"
                  : "text-gray-600 hover:text-purple-600"
              }`}
            >
              Support
            </a>
          </div>
        </div>
      </footer>

      {artworkDetails && (
        <ArtworkDetailsModal
          details={artworkDetails}
          onClose={handleCloseDetails}
          onLike={handleLike}
          onShare={handleShare}
          isDarkMode={isDarkMode}
        />
      )}

      {shareModalOpen && selectedArtwork && (
        <ArtworkShareModal
          artwork={selectedArtwork}
          onClose={handleCloseShareModal}
          isDarkMode={isDarkMode}
        />
      )}
    </div>
  );
};

export default Page;

"use client";

import { useState, useEffect } from "react";
import { Playfair_Display, Montserrat } from "next/font/google";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiSun,
  FiMoon,
  FiInfo,
  FiX,
  FiMap,
  FiFilter,
  FiGlobe,
  FiClock,
  FiFlag,
  FiChevronDown,
} from "react-icons/fi";

const playfair = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-playfair",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-montserrat",
});

const styles = `
  .font-playfair {
    font-family: var(--font-playfair), serif;
  }
  .font-montserrat {
    font-family: var(--font-montserrat), sans-serif;
  }
  
  /* Custom scrollbar styling */
  .custom-scrollbar {
    scrollbar-width: thin;
    scroll-behavior: smooth;
    padding-right: 6px;
  }
  
  .custom-scrollbar::-webkit-scrollbar {
    width: 6px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
    margin: 4px 0;
  }
  
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background-color: rgba(155, 155, 155, 0.4);
    border-radius: 10px;
    border: 1px solid transparent;
    background-clip: padding-box;
    transition: all 0.3s ease;
    opacity: 0.6;
  }
  
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background-color: rgba(155, 155, 155, 0.7);
    opacity: 1;
  }
  
  .dark-scrollbar::-webkit-scrollbar-thumb {
    background-color: rgba(200, 200, 200, 0.25);
  }
  
  .dark-scrollbar::-webkit-scrollbar-thumb:hover {
    background-color: rgba(200, 200, 200, 0.4);
  }
  
  /* Hide scrollbar when not hovering over modal content */
  .scroll-hidden::-webkit-scrollbar-thumb {
    opacity: 0;
    visibility: hidden;
  }
  
  .modal-content:hover .scroll-hidden::-webkit-scrollbar-thumb {
    opacity: 0.6;
    visibility: visible;
  }
  
  /* Smooth fade effect for scroll indicators */
  .scroll-fade-top {
    background: linear-gradient(to bottom, var(--card-bg) 0%, rgba(255,255,255,0) 100%);
    height: 10px;
    opacity: 0.95;
  }
  
  .scroll-fade-bottom {
    background: linear-gradient(to top, var(--card-bg) 0%, rgba(255,255,255,0) 100%);
    height: 10px;
    opacity: 0.95;
  }
  
  /* Filter container hover effects */
  .filter-container {
    transform: translateY(0);
    transition: all 0.3s ease;
  }
  
  .filter-container:hover {
    transform: translateY(-2px);
  }
  
  /* Custom focus rings for filters */
  .era-select:focus {
    box-shadow: 0 0 0 3px rgba(var(--era-color-rgb), 0.2);
  }
  
  .continent-select:focus {
    box-shadow: 0 0 0 3px rgba(var(--continent-color-rgb), 0.2);
  }
`;

type ThemeType = {
  background: string;
  text: string;
  primary: string;
  secondary: string;
  accent: string;
  card: string;
  border: string;
};

const lightTheme: ThemeType = {
  background: "#f8f9fa",
  text: "#212529",
  primary: "#0a6c74",
  secondary: "#7c3aed",
  accent: "#f59e0b",
  card: "#ffffff",
  border: "#e2e8f0",
};

const darkTheme: ThemeType = {
  background: "#111827",
  text: "#f1f5f9",
  primary: "#3b82f6",
  secondary: "#8b5cf6",
  accent: "#f59e0b",
  card: "#1f2937",
  border: "#374151",
};

type Era = "Ancient" | "Medieval" | "Modern";
type Continent =
  | "Asia"
  | "Africa"
  | "Europe"
  | "North America"
  | "South America"
  | "Australia";

interface Wonder {
  id: number;
  name: string;
  era: Era;
  continent: Continent;
  location: string;
  country: string;
  year: string;
  architect: string;
  height?: string;
  facts: string[];
  description: string;
  image: string;
  coordinates: [number, number];
}

const wondersData: Wonder[] = [
  {
    id: 1,
    name: "Great Pyramid of Giza",
    era: "Ancient",
    continent: "Africa",
    location: "Giza, Egypt",
    country: "Egypt",
    year: "2560 BCE",
    architect: "Pharaoh Khufu",
    height: "146.5 meters (originally)",
    facts: [
      "Only wonder of the ancient world still in existence",
      "Built with over 2.3 million stone blocks",
      "Aligned with the cardinal points with amazing precision",
    ],
    description:
      "The Great Pyramid of Giza is the oldest and largest of the three pyramids in the Giza pyramid complex. For almost 4,000 years it was the tallest man-made structure in the world.",
    image: "https://images.unsplash.com/photo-1503177119275-0aa32b3a9368",
    coordinates: [29.9792, 31.1342],
  },
  {
    id: 2,
    name: "Colosseum",
    era: "Ancient",
    continent: "Europe",
    location: "Rome, Italy",
    country: "Italy",
    year: "80 CE",
    architect: "Vespasian",
    facts: [
      "Could hold up to 80,000 spectators",
      "Used for gladiatorial contests and public spectacles",
      "Built of concrete and sand with a stones facade",
    ],
    description:
      "The Colosseum is an oval amphitheatre in the center of Rome. It was the largest amphitheatre ever built at the time and could hold between 50,000 and 80,000 spectators.",
    image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5",
    coordinates: [41.8902, 12.4922],
  },
  {
    id: 3,
    name: "Taj Mahal",
    era: "Medieval",
    continent: "Asia",
    location: "Agra, India",
    country: "India",
    year: "1643 CE",
    architect: "Ustad Ahmad Lahauri",
    facts: [
      "Built as a tomb for Emperor Shah Jahan's wife Mumtaz Mahal",
      "Constructed using white marble",
      "Incorporates Persian, Islamic and Indian architectural styles",
    ],
    description:
      "The Taj Mahal is an ivory-white marble mausoleum on the south bank of the Yamuna river in the Indian city of Agra. It was commissioned in 1632 by the Mughal emperor Shah Jahan to house the tomb of his favorite wife, Mumtaz Mahal.",
    image: "https://images.unsplash.com/photo-1548013146-72479768bada",
    coordinates: [27.1751, 78.0421],
  },
  {
    id: 4,
    name: "Machu Picchu",
    era: "Medieval",
    continent: "South America",
    location: "Cusco Region, Peru",
    country: "Peru",
    year: "1450 CE",
    architect: "Incan Emperor Pachacuti",
    facts: [
      "Built in a classical Inca style",
      'Often referred to as the "Lost City of the Incas"',
      "Situated at 2,430 meters above sea level",
    ],
    description:
      "Machu Picchu is a 15th-century Inca citadel situated on a mountain ridge above the Sacred Valley. Most archaeologists believe that Machu Picchu was constructed as an estate for the Inca emperor Pachacuti.",
    image: "https://images.unsplash.com/photo-1526392060635-9d6019884377",
    coordinates: [-13.1631, -72.545],
  },
  {
    id: 5,
    name: "Great Wall of China",
    era: "Medieval",
    continent: "Asia",
    location: "Northern China",
    country: "China",
    year: "700 BCE - 1644 CE",
    architect: "Various Chinese dynasties",
    facts: [
      "Total length of over 21,000 km",
      "Built over many dynasties spanning over 2,000 years",
      "Visible from space is a myth, but it's still impressive",
    ],
    description:
      "The Great Wall of China is a series of fortifications built along the historical northern borders of China to protect Chinese states and empires against nomadic groups.",
    image: "https://images.unsplash.com/photo-1508804185872-d7badad00f7d",
    coordinates: [40.4319, 116.5704],
  },
  {
    id: 6,
    name: "Petra",
    era: "Ancient",
    continent: "Asia",
    location: "Ma'an Governorate, Jordan",
    country: "Jordan",
    year: "312 BCE",
    architect: "Nabataeans",
    facts: [
      "Known as the Rose City due to the color of the stone",
      "Featured in many films including Indiana Jones",
      "Access is through a narrow canyon called the Siq",
    ],
    description:
      "Petra is a historical and archaeological city in southern Jordan. It is famous for its rock-cut architecture and water conduit system. Petra was established possibly as early as 312 BCE as the capital city of the Arab Nabataeans.",
    image:
      "https://images.pexels.com/photos/3846629/pexels-photo-3846629.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    coordinates: [30.3285, 35.4444],
  },
  {
    id: 7,
    name: "Christ the Redeemer",
    era: "Modern",
    continent: "South America",
    location: "Rio de Janeiro, Brazil",
    country: "Brazil",
    year: "1931 CE",
    architect: "Heitor da Silva Costa",
    height: "30 meters (98 ft)",
    facts: [
      "Made of reinforced concrete and soapstone",
      "Sits atop the 700-meter Corcovado mountain",
      "Symbol of Christianity across the world",
    ],
    description:
      "Christ the Redeemer is an Art Deco statue of Jesus Christ in Rio de Janeiro, Brazil. The statue is 30 metres tall, excluding its 8-metre pedestal, and its arms stretch 28 metres wide.",
    image:
      "https://images.pexels.com/photos/9977483/pexels-photo-9977483.jpeg?auto=compress&cs=tinysrgb&w=600",
    coordinates: [-22.9519, -43.2105],
  },
  {
    id: 8,
    name: "Chichen Itza",
    era: "Medieval",
    continent: "North America",
    location: "Yucatán, Mexico",
    country: "Mexico",
    year: "600 CE",
    architect: "Mayans",
    facts: [
      "Features the Temple of Kukulkan, a step pyramid",
      "During the spring and autumn equinoxes, a shadow pattern resembling a serpent appears on the pyramid",
      "Has the largest ball court in the Americas",
    ],
    description:
      "Chichen Itza was a large pre-Columbian city built by the Maya people. The archaeological site is located in Tinúm Municipality, Yucatán State, Mexico.",
    image: "https://images.unsplash.com/photo-1518638150340-f706e86654de",
    coordinates: [20.6843, -88.5699],
  },
  {
    id: 9,
    name: "Sydney Opera House",
    era: "Modern",
    continent: "Australia",
    location: "Sydney, Australia",
    country: "Australia",
    year: "1973 CE",
    architect: "Jørn Utzon",
    facts: [
      "Has over 1 million roof tiles",
      "Hosts more than 1,500 performances annually",
      "One of the 20th century's most distinctive buildings",
    ],
    description:
      "The Sydney Opera House is a multi-venue performing arts centre at Sydney Harbour. It is one of the 20th century's most famous and distinctive buildings.",
    image: "https://images.unsplash.com/photo-1624138784614-87fd1b6528f8",
    coordinates: [-33.8568, 151.2153],
  },
  {
    id: 10,
    name: "Stonehenge",
    era: "Ancient",
    continent: "Europe",
    location: "Wiltshire, England",
    country: "United Kingdom",
    year: "3000 BCE - 2000 BCE",
    architect: "Unknown",
    facts: [
      "Composed of a circular setting of large standing stones",
      "Aligned with midsummer sunrise and midwinter sunset",
      "Some stones traveled over 250km from Wales to the site",
    ],
    description:
      "Stonehenge is a prehistoric monument in Wiltshire, England. It consists of a ring of standing stones, with each stone around 13 feet high, seven feet wide, and weighing around 25 tons.",
    image:
      "https://images.pexels.com/photos/1427569/pexels-photo-1427569.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    coordinates: [51.1789, -1.8262],
  },
  {
    id: 11,
    name: "Statue of Liberty",
    era: "Modern",
    continent: "North America",
    location: "New York Harbor, USA",
    country: "United States",
    year: "1886 CE",
    architect: "Frédéric Auguste Bartholdi",
    height: "93 meters (305 ft)",
    facts: [
      "Gift from the people of France to the United States",
      "Made of copper sheets on a steel framework",
      "The seven spikes on the crown represent the seven seas and continents",
    ],
    description:
      "The Statue of Liberty is a colossal neoclassical sculpture on Liberty Island in New York Harbor in New York City. The statue was a gift from the people of France to the people of the United States.",
    image: "https://images.unsplash.com/photo-1605130284535-11dd9eedc58a",
    coordinates: [40.6892, -74.0445],
  },
  {
    id: 12,
    name: "Angkor Wat",
    era: "Medieval",
    continent: "Asia",
    location: "Siem Reap, Cambodia",
    country: "Cambodia",
    year: "1150 CE",
    architect: "King Suryavarman II",
    facts: [
      "Largest religious monument in the world",
      "Initially built as a Hindu temple, later became Buddhist",
      "Oriented to the west, unusual for Hindu temples which typically face east",
    ],
    description:
      "Angkor Wat is a temple complex in Cambodia and one of the largest religious monuments in the world. Originally constructed as a Hindu temple dedicated to the god Vishnu for the Khmer Empire, it was gradually transformed into a Buddhist temple.",
    image:
      "https://images.pexels.com/photos/5769435/pexels-photo-5769435.jpeg?auto=compress&cs=tinysrgb&w=600",
    coordinates: [13.4125, 103.867],
  },
];

export default function Home() {
  const [selectedEra, setSelectedEra] = useState<Era | "All">("All");
  const [selectedContinent, setSelectedContinent] = useState<Continent | "All">(
    "All"
  );
  const [selectedWonder, setSelectedWonder] = useState<Wonder | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isDark, setIsDark] = useState(false);

  const [theme, setTheme] = useState<ThemeType>(lightTheme);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  useEffect(() => {
    setTheme(isDark ? darkTheme : lightTheme);
  }, [isDark]);

  const filteredWonders = wondersData.filter((wonder) => {
    const matchesEra = selectedEra === "All" || wonder.era === selectedEra;
    const matchesContinent =
      selectedContinent === "All" || wonder.continent === selectedContinent;
    return matchesEra && matchesContinent;
  });

  const openWonderDetails = (wonder: Wonder) => {
    setSelectedWonder(wonder);
    setShowModal(true);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setShowModal(false);
    document.body.style.overflow = "auto";
  };

  const eras: (Era | "All")[] = ["All", "Ancient", "Medieval", "Modern"];
  const continents: (Continent | "All")[] = [
    "All",
    "Asia",
    "Africa",
    "Europe",
    "North America",
    "South America",
    "Australia",
  ];

  const hexToRgb = (hex: string) => {
    hex = hex.replace("#", "");

    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    return `${r}, ${g}, ${b}`;
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <div
        className={`${playfair.variable} ${montserrat.variable} min-h-screen transition-colors duration-300`}
        style={{ backgroundColor: theme.background, color: theme.text }}
      >
        <header
          className="sticky top-0 z-50 shadow-md"
          style={{ backgroundColor: theme.card }}
        >
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <h1
              className="text-2xl md:text-3xl font-bold font-playfair"
              style={{ color: theme.primary }}
            >
              Wonders of the World
            </h1>

            <div className="flex items-center gap-4">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full transition-colors cursor-pointer"
                style={{ backgroundColor: theme.background }}
                aria-label="Toggle theme"
              >
                {isDark ? <FiSun size={20} /> : <FiMoon size={20} />}
              </button>
            </div>
          </div>
        </header>

        <section className="relative h-[90vh] overflow-hidden">
          <div className="absolute inset-0 bg-black/30 z-10 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center text-white px-4"
            >
              <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 font-playfair">
                Explore the Wonders
              </h2>
              <p className="text-lg md:text-xl max-w-2xl mx-auto font-montserrat">
                Discover the most magnificent monuments and natural marvels from
                across history and around the globe
              </p>
            </motion.div>
          </div>
          <div className="h-full w-full">
            <img
              src="https://images.pexels.com/photos/27602819/pexels-photo-27602819/free-photo-of-view-of-the-milky-way-and-a-shooting-star.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
              alt="Wonders of the World"
              className="object-cover w-full h-full"
            />
          </div>
        </section>

        <main className="container mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-16"
          >
            <div className="flex flex-col items-center mb-6">
              <h3
                className="text-2xl font-bold font-playfair mb-3"
                style={{ color: theme.primary }}
              >
                Filter Wonders
              </h3>
              <div
                className="w-24 h-1 rounded-full"
                style={{ backgroundColor: theme.accent }}
              ></div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-stretch max-w-4xl mx-auto">
              <div
                className="filter-container relative flex-1 p-4 rounded-lg shadow-sm transition-all duration-300 hover:shadow-md"
                style={{
                  backgroundColor: `${theme.card}`,
                  borderLeft: `4px solid ${theme.secondary}`,
                }}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div
                    className="flex items-center justify-center w-10 h-10 rounded-full"
                    style={{ backgroundColor: `${theme.secondary}20` }}
                  >
                    <FiClock size={20} style={{ color: theme.secondary }} />
                  </div>
                  <span className="font-montserrat font-semibold">Era</span>
                </div>

                <div className="relative">
                  <select
                    value={selectedEra}
                    onChange={(e) =>
                      setSelectedEra(e.target.value as Era | "All")
                    }
                    className="w-full py-3 px-4 pr-10 rounded-md cursor-pointer font-montserrat appearance-none border transition-all focus:outline-none era-select"
                    style={
                      {
                        backgroundColor: isDark
                          ? `${theme.card}`
                          : `${theme.background}90`,
                        borderColor: theme.border,
                        color: theme.text,
                        "--era-color-rgb": hexToRgb(theme.secondary),
                      } as React.CSSProperties
                    }
                  >
                    {eras.map((era) => (
                      <option key={era} value={era}>
                        {era}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <FiChevronDown size={18} style={{ color: theme.text }} />
                  </div>
                </div>
              </div>

              <div
                className="filter-container relative flex-1 p-4 rounded-lg shadow-sm transition-all duration-300 hover:shadow-md"
                style={{
                  backgroundColor: `${theme.card}`,
                  borderLeft: `4px solid ${theme.primary}`,
                }}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div
                    className="flex items-center justify-center w-10 h-10 rounded-full"
                    style={{ backgroundColor: `${theme.primary}20` }}
                  >
                    <FiGlobe size={20} style={{ color: theme.primary }} />
                  </div>
                  <span className="font-montserrat font-semibold">
                    Continent
                  </span>
                </div>

                <div className="relative">
                  <select
                    value={selectedContinent}
                    onChange={(e) =>
                      setSelectedContinent(e.target.value as Continent | "All")
                    }
                    className="w-full py-3 px-4 pr-10 rounded-md cursor-pointer font-montserrat appearance-none border transition-all focus:outline-none continent-select"
                    style={
                      {
                        backgroundColor: isDark
                          ? `${theme.card}`
                          : `${theme.background}90`,
                        borderColor: theme.border,
                        color: theme.text,
                        "--continent-color-rgb": hexToRgb(theme.primary),
                      } as React.CSSProperties
                    }
                  >
                    {continents.map((continent) => (
                      <option key={continent} value={continent}>
                        {continent}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <FiChevronDown size={18} style={{ color: theme.text }} />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-col items-center">
              {selectedEra !== "All" || selectedContinent !== "All" ? (
                <>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mb-3 font-montserrat text-sm font-medium"
                  >
                    <span
                      className="inline-flex items-center justify-center w-5 h-5 rounded-full mr-2 text-xs text-white"
                      style={{ backgroundColor: theme.accent }}
                    >
                      {(selectedEra !== "All" ? 1 : 0) +
                        (selectedContinent !== "All" ? 1 : 0)}
                    </span>
                    Active{" "}
                    {selectedEra !== "All" && selectedContinent !== "All"
                      ? "Filters"
                      : "Filter"}
                  </motion.div>

                  <div className="flex flex-wrap gap-2 justify-center">
                    {selectedEra !== "All" && (
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium transition-all hover:shadow-md"
                        style={{
                          backgroundColor: `${theme.secondary}20`,
                          color: theme.secondary,
                        }}
                      >
                        <span>{selectedEra}</span>
                        <button
                          onClick={() => setSelectedEra("All")}
                          className="ml-2 focus:outline-none hover:bg-white/10 rounded-full p-1 transition-colors cursor-pointer"
                          aria-label="Remove era filter"
                        >
                          <FiX size={16} />
                        </button>
                      </motion.div>
                    )}

                    {selectedContinent !== "All" && (
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium transition-all hover:shadow-md"
                        style={{
                          backgroundColor: `${theme.primary}20`,
                          color: theme.primary,
                        }}
                      >
                        <span>{selectedContinent}</span>
                        <button
                          onClick={() => setSelectedContinent("All")}
                          className="ml-2 focus:outline-none hover:bg-white/10 rounded-full p-1 transition-colors cursor-pointer"
                          aria-label="Remove continent filter"
                        >
                          <FiX size={16} />
                        </button>
                      </motion.div>
                    )}
                  </div>
                </>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.7 }}
                  className="text-sm font-montserrat italic"
                >
                  No filters applied
                </motion.div>
              )}
            </div>
          </motion.div>

          {filteredWonders.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {filteredWonders.map((wonder, index) => (
                <motion.div
                  key={wonder.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                  className="rounded-lg overflow-hidden shadow-lg cursor-pointer hover:shadow-xl transition-shadow"
                  onClick={() => openWonderDetails(wonder)}
                  style={{
                    backgroundColor: theme.card,
                    borderColor: theme.border,
                  }}
                >
                  <div className="relative h-64 w-full overflow-hidden">
                    <img
                      src={`${wonder.image}?auto=format&fit=crop&w=600&q=80`}
                      alt={wonder.name}
                      className="object-cover w-full h-full transition-transform hover:scale-105 duration-500"
                    />
                    <div
                      className="absolute top-0 right-0 m-2 px-3 py-1 rounded-full text-xs font-bold font-montserrat text-white"
                      style={{
                        backgroundColor:
                          wonder.era === "Ancient"
                            ? "#f59e0b"
                            : wonder.era === "Medieval"
                            ? "#8b5cf6"
                            : "#3b82f6",
                      }}
                    >
                      {wonder.era}
                    </div>
                  </div>

                  <div className="p-6">
                    <h3
                      className="text-xl font-bold mb-2 font-playfair"
                      style={{ color: theme.primary }}
                    >
                      {wonder.name}
                    </h3>

                    <div className="flex items-center text-sm mb-3 font-montserrat opacity-80">
                      <FiFlag className="mr-1" />
                      <span>{wonder.country}</span>
                      <span className="mx-2">•</span>
                      <span>{wonder.year}</span>
                    </div>

                    <p
                      className="text-sm line-clamp-3 font-montserrat mb-4"
                      style={{ color: theme.text }}
                    >
                      {wonder.description}
                    </p>

                    <button
                      className="flex items-center text-sm font-medium transition-colors cursor-pointer"
                      style={{ color: theme.secondary }}
                    >
                      Explore <FiChevronDown className="ml-1" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="py-16 text-center mb-16"
            >
              <div
                className="mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4"
                style={{ backgroundColor: `${theme.accent}20` }}
              >
                <FiFilter size={24} style={{ color: theme.accent }} />
              </div>
              <h3
                className="text-xl font-bold mb-2 font-playfair"
                style={{ color: theme.primary }}
              >
                No Wonders Found
              </h3>
              <p className="max-w-md mx-auto font-montserrat">
                No wonders match your current filter selection. Try adjusting
                your filters to see more results.
              </p>
              <button
                onClick={() => {
                  setSelectedEra("All");
                  setSelectedContinent("All");
                }}
                className="mt-6 px-5 py-2 rounded-full font-montserrat font-medium transition-all hover:opacity-90 cursor-pointer"
                style={{ backgroundColor: theme.primary, color: "white" }}
              >
                Reset Filters
              </button>
            </motion.div>
          )}
        </main>

        <footer
          className="py-8 text-center"
          style={{ backgroundColor: theme.card }}
        >
          <p className="font-montserrat text-sm opacity-70">
            © {new Date().getFullYear()} Wonders of the World • Images from
            Unsplash
          </p>
        </footer>

        <AnimatePresence>
          {showModal && selectedWonder && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6"
            >
              <motion.div
                className="absolute inset-0 backdrop-blur-sm bg-black/50"
                onClick={closeModal}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />

              <motion.div
                className={`relative w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-xl shadow-2xl`}
                style={{ backgroundColor: theme.card }}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: "spring", damping: 25 }}
              >
                <button
                  onClick={closeModal}
                  className="absolute top-4 right-4 z-10 p-2 rounded-full cursor-pointer"
                  style={{ backgroundColor: `${theme.background}80` }}
                  aria-label="Close modal"
                >
                  <FiX size={20} />
                </button>

                <div className="relative h-80 w-full">
                  <img
                    src={`${selectedWonder.image}?auto=format&fit=crop&w=1200&q=80`}
                    alt={selectedWonder.name}
                    className="object-cover w-full h-full"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                    <div className="p-6 text-white">
                      <h2 className="text-3xl md:text-4xl font-bold mb-2 font-playfair">
                        {selectedWonder.name}
                      </h2>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 font-montserrat">
                        <span className="flex items-center">
                          <FiGlobe className="mr-1" />{" "}
                          {selectedWonder.continent}
                        </span>
                        <span className="flex items-center">
                          <FiFlag className="mr-1" /> {selectedWonder.country}
                        </span>
                        <span className="flex items-center">
                          <FiClock className="mr-1" /> {selectedWonder.year}
                        </span>
                        <span
                          className="px-3 py-1 rounded-full text-xs font-bold"
                          style={{
                            backgroundColor:
                              selectedWonder.era === "Ancient"
                                ? "#f59e0b"
                                : selectedWonder.era === "Medieval"
                                ? "#8b5cf6"
                                : "#3b82f6",
                          }}
                        >
                          {selectedWonder.era}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  className="relative modal-content"
                  style={{ "--card-bg": theme.card } as React.CSSProperties}
                >
                  <div
                    className="absolute top-0 left-0 right-0 z-10 pointer-events-none scroll-fade-top"
                    style={{
                      background: `linear-gradient(to bottom, ${theme.card} 20%, transparent 100%)`,
                      height: "16px",
                    }}
                  ></div>

                  <div
                    className={`max-h-[calc(90vh-20rem)] overflow-y-auto p-0.5 custom-scrollbar scroll-hidden ${
                      isDark ? "dark-scrollbar" : ""
                    }`}
                  >
                    <div className="p-6 pr-8">
                      <div className="mb-6">
                        <h3
                          className="text-xl font-bold mb-3 font-playfair"
                          style={{ color: theme.primary }}
                        >
                          About
                        </h3>
                        <p
                          className="font-montserrat leading-relaxed"
                          style={{ color: theme.text }}
                        >
                          {selectedWonder.description}
                        </p>
                      </div>

                      {selectedWonder.architect && (
                        <div className="mb-6">
                          <h3
                            className="text-xl font-bold mb-3 font-playfair"
                            style={{ color: theme.primary }}
                          >
                            Architect
                          </h3>
                          <p
                            className="font-montserrat"
                            style={{ color: theme.text }}
                          >
                            {selectedWonder.architect}
                          </p>
                        </div>
                      )}

                      <div className="mb-6">
                        <h3
                          className="text-xl font-bold mb-3 font-playfair"
                          style={{ color: theme.primary }}
                        >
                          Fascinating Facts
                        </h3>
                        <ul
                          className="list-disc list-inside space-y-2 font-montserrat"
                          style={{ color: theme.text }}
                        >
                          {selectedWonder.facts.map((fact, index) => (
                            <motion.li
                              key={index}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.1 * index }}
                            >
                              {fact}
                            </motion.li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div
                    className="absolute bottom-0 left-0 right-0 z-10 pointer-events-none scroll-fade-bottom"
                    style={{
                      background: `linear-gradient(to top, ${theme.card} 20%, transparent 100%)`,
                      height: "16px",
                    }}
                  ></div>
                </div>

                <div
                  className="p-6 text-center border-t"
                  style={{ borderColor: theme.border }}
                >
                  <button
                    onClick={closeModal}
                    className="px-6 py-2 rounded-full font-montserrat font-medium text-white cursor-pointer transition-transform hover:scale-105"
                    style={{ backgroundColor: theme.primary }}
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
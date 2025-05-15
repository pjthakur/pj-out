"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Playfair_Display, Rubik, Lora } from "next/font/google";
import { FiInfo, FiX, FiChevronDown } from "react-icons/fi";
import { toast, Toaster } from "react-hot-toast";
import React from "react";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

const rubik = Rubik({
  subsets: ["latin"],
  variable: "--font-rubik",
});

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-lora",
});

type OceanLayer = {
  id: string;
  name: string;
  depth: string;
  depthRange: string;
  description: string;
  color: string;
  darkColor: string;
  lightColor: string;
  image: string;
  creatures: Creature[];
  facts: Fact[];
};

type Creature = {
  id: string;
  name: string;
  description: string;
  image: string;
};

type Fact = {
  id: string;
  title: string;
  content: string;
};

const oceanLayersData: OceanLayer[] = [
  {
    id: "sunlight",
    name: "Sunlight Zone",
    depth: "0-200m",
    depthRange: "Surface to 200 meters",
    description:
      "The uppermost layer of the ocean, where sunlight penetrates easily. This zone contains the most biodiversity and is home to many familiar marine species.",
    color: "#0284c7",
    darkColor: "#075985",
    lightColor: "#7dd3fc",
    image:
      "https://images.unsplash.com/photo-1533713692156-f70938dc0d54?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80",
    creatures: [
      {
        id: "dolphin",
        name: "Dolphin",
        description:
          "Highly intelligent marine mammals known for their playful behavior and complex social structures.",
        image:
          "https://images.unsplash.com/photo-1607153333879-c174d265f1d2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80",
      },
      {
        id: "coral",
        name: "Coral Reef",
        description:
          "Diverse underwater ecosystems held together by calcium carbonate structures secreted by corals.",
        image:
          "https://images.unsplash.com/photo-1546026423-cc4642628d2b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80",
      },
      {
        id: "sea-turtle",
        name: "Sea Turtle",
        description:
          "Ancient marine reptiles that have existed for over 100 million years, known for their long migrations.",
        image:
          "https://images.unsplash.com/photo-1591025207163-942350e47db2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80",
      },
    ],
    facts: [
      {
        id: "sunlight-fact-1",
        title: "Photosynthesis Hub",
        content:
          "90% of all marine life lives in the sunlight zone because plants can photosynthesize here.",
      },
      {
        id: "sunlight-fact-2",
        title: "Temperature Variation",
        content:
          "Temperatures in this zone range from 40°F (4°C) to 75°F (24°C) depending on location and season.",
      },
    ],
  },
  {
    id: "twilight",
    name: "Twilight Zone",
    depth: "200-1000m",
    depthRange: "200 to 1,000 meters",
    description:
      "A dimly lit region where only a small amount of sunlight can penetrate. Many creatures in this zone have bioluminescent abilities.",
    color: "#1e40af",
    darkColor: "#1e3a8a",
    lightColor: "#93c5fd",
    image:
      "https://images.unsplash.com/photo-1551244072-5d12893278ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80",
    creatures: [
      {
        id: "angler-fish",
        name: "Angler Fish",
        description:
          "Deep-sea fish with a bioluminescent growth on their head used to lure prey in the dark waters.",
        image:
          "https://images.unsplash.com/photo-1545671913-b89ac1b4ac10?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80",
      },
      {
        id: "squid",
        name: "Giant Squid",
        description:
          "Elusive deep-sea dwelling squid that can grow up to 43 feet (13 meters) in length.",
        image:
          "https://images.pexels.com/photos/2505042/pexels-photo-2505042.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      },
    ],
    facts: [
      {
        id: "twilight-fact-1",
        title: "Bioluminescence",
        content:
          "Over 90% of creatures in this zone can produce their own light through bioluminescence.",
      },
      {
        id: "twilight-fact-2",
        title: "Vertical Migration",
        content:
          "Many creatures migrate to the surface at night to feed and return to the depths during the day.",
      },
    ],
  },
  {
    id: "midnight",
    name: "Midnight Zone",
    depth: "1000-4000m",
    depthRange: "1,000 to 4,000 meters",
    description:
      "A zone of complete darkness where the pressure is intense. Strange and unique creatures have adapted to these extreme conditions.",
    color: "#312e81",
    darkColor: "#1e1b4b",
    lightColor: "#a5b4fc",
    image:
      "https://images.pexels.com/photos/137610/pexels-photo-137610.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    creatures: [
      {
        id: "vampire-squid",
        name: "Vampire Squid",
        description:
          "Neither a squid nor an octopus, this unique creature can turn itself inside out as a defense mechanism.",
        image:
          "https://images.unsplash.com/photo-1545671913-b89ac1b4ac10?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80",
      },
      {
        id: "deep-sea-jellyfish",
        name: "Deep Sea Jellyfish",
        description:
          "Jellyfish adapted to the extreme pressures of the deep, often with bioluminescent capabilities.",
        image:
          "https://images.pexels.com/photos/982229/pexels-photo-982229.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      },
    ],
    facts: [
      {
        id: "midnight-fact-1",
        title: "Pressure Extremes",
        content:
          "The pressure at this depth is more than 40 times that at sea level, enough to crush a submarine.",
      },
      {
        id: "midnight-fact-2",
        title: "Food Scarcity",
        content:
          "Food is scarce, causing creatures to develop unusual adaptations for finding and conserving energy.",
      },
    ],
  },
  {
    id: "abyssal",
    name: "Abyssal Zone",
    depth: "4000-6000m",
    depthRange: "4,000 to 6,000 meters",
    description:
      "One of the deepest oceanic zones, characterized by extreme pressure and frigid temperatures. Life forms here have evolved unique adaptations.",
    color: "#1e1b4b",
    darkColor: "#0f172a",
    lightColor: "#818cf8",
    image:
      "https://images.pexels.com/photos/1086585/pexels-photo-1086585.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    creatures: [
      {
        id: "deep-sea-cucumber",
        name: "Deep Sea Cucumber",
        description:
          "Unusual echinoderms that crawl along the seafloor, playing a crucial role in ocean floor ecosystems.",
        image:
          "https://images.unsplash.com/photo-1551244072-5d12893278ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80",
      },
      {
        id: "blobfish",
        name: "Blobfish",
        description:
          "A gelatinous fish that appears very different at depth than when brought to the surface due to pressure changes.",
        image:
          "https://images.pexels.com/photos/2156311/pexels-photo-2156311.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      },
    ],
    facts: [
      {
        id: "abyssal-fact-1",
        title: "Hydrothermal Vents",
        content:
          "Unique ecosystems form around hydrothermal vents, where life thrives on chemosynthesis rather than photosynthesis.",
      },
      {
        id: "abyssal-fact-2",
        title: "Unexplored Terrain",
        content:
          "Less than 10% of the abyssal zone has been explored, making it one of Earth's last great frontiers.",
      },
    ],
  },
  {
    id: "hadal",
    name: "Hadal Zone",
    depth: "6000-11000m",
    depthRange: "6,000 to 11,000 meters",
    description:
      "The deepest part of the ocean, found in trenches. Despite extreme conditions, unique life forms have been discovered here.",
    color: "#020617",
    darkColor: "#000000",
    lightColor: "#6366f1",
    image:
      "https://images.unsplash.com/photo-1551244072-5d12893278ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80",
    creatures: [
      {
        id: "mariana-snailfish",
        name: "Mariana Snailfish",
        description:
          "The deepest-living fish ever discovered, found at depths of up to 8,178 meters in the Mariana Trench.",
        image:
          "https://images.pexels.com/photos/1145274/pexels-photo-1145274.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      },
      {
        id: "amphipod",
        name: "Deep Sea Amphipod",
        description:
          "Shrimp-like crustaceans that have adapted to the crushing pressures of the deepest ocean trenches.",
        image:
          "https://images.unsplash.com/photo-1551244072-5d12893278ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80",
      },
    ],
    facts: [
      {
        id: "hadal-fact-1",
        title: "Extreme Pressure",
        content:
          "Pressure in the Hadal zone exceeds 1,100 times that at sea level, equivalent to having 100 elephants standing on your head.",
      },
      {
        id: "hadal-fact-2",
        title: "Challenger Deep",
        content:
          "The deepest known point on Earth is Challenger Deep in the Mariana Trench, at approximately 10,994 meters (36,070 feet).",
      },
    ],
  },
];

export default function Home() {
  const [selectedLayer, setSelectedLayer] = useState<OceanLayer | null>(null);
  const [selectedCreature, setSelectedCreature] = useState<Creature | null>(
    null
  );
  const [modalOpen, setModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeLayerIndex, setActiveLayerIndex] = useState(0);
  const layerRefs = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isMenuOpen]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight / 2;

      if (window.scrollY < window.innerHeight / 2) {
        setActiveLayerIndex(-1);
        return;
      }

      for (let i = 0; i < layerRefs.current.length; i++) {
        const element = layerRefs.current[i];
        if (!element) continue;

        const rect = element.getBoundingClientRect();
        const elementTop = rect.top + window.scrollY;
        const elementBottom = elementTop + rect.height;

        if (scrollPosition >= elementTop && scrollPosition <= elementBottom) {
          setActiveLayerIndex(i);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const openCreatureModal = (creature: Creature) => {
    setSelectedCreature(creature);
    setModalOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setModalOpen(false);
    document.body.style.overflow = "auto";
  };

  const scrollToLayer = (index: number) => {
    if (layerRefs.current[index]) {
      layerRefs.current[index]?.scrollIntoView({ behavior: "smooth" });
      setIsMenuOpen(false);
    }
  };

  const showLayerInfo = (layer: OceanLayer) => {
    setSelectedLayer(layer);
    toast.success(`Exploring the ${layer.name}`, {
      icon: "🌊",
      style: {
        borderRadius: "10px",
        background: layer.darkColor,
        color: "#fff",
      },
    });
  };

  const ColorTransition = ({
    topColor,
    bottomColor,
  }: {
    topColor: string;
    bottomColor: string;
  }) => {
    return (
      <div
        className="absolute left-0 right-0 h-32 -mt-16 z-0 pointer-events-none"
        style={{
          background: `linear-gradient(to bottom, ${topColor} 0%, ${bottomColor} 100%)`,
        }}
      />
    );
  };

  return (
    <main
      className={`relative min-h-screen w-full overflow-x-hidden bg-gradient-to-b from-[#0ea5e9] to-[#020617] ${playfair.variable} ${rubik.variable} ${lora.variable}`}
    >
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 md:px-10 lg:px-16 xl:px-24 backdrop-blur-md bg-slate-900/70">
        <div className="relative z-50 flex items-center">
          <h1 className="text-2xl font-bold text-white font-playfair md:text-3xl">
            Ocean Depths
          </h1>
        </div>

        <div
          className={`fixed inset-0 z-[60] flex-col items-center justify-center bg-black backdrop-blur-lg ${
            isMenuOpen ? "flex" : "hidden"
          } md:static md:flex md:flex-row md:bg-transparent md:backdrop-blur-none md:z-50`}
        >
          <button
            onClick={() => setIsMenuOpen(false)}
            className="absolute p-4 text-white top-4 right-4 md:hidden"
          >
            <FiX size={24} />
          </button>

          <div className="flex flex-col items-center space-y-6 md:flex-row md:space-y-0 md:space-x-8 bg-slate-900/90 p-8 rounded-lg md:bg-transparent md:p-0">
            {oceanLayersData.map((layer, index) => (
              <button
                key={layer.id}
                onClick={() => scrollToLayer(index)}
                className={`text-lg font-medium transition-colors duration-300 cursor-pointer font-rubik px-4 py-2 rounded-md 
                  ${
                    activeLayerIndex === index
                      ? "text-blue-300 border-b-2 border-blue-300 bg-slate-900/80 md:bg-transparent"
                      : "text-white hover:text-blue-300 bg-slate-900/60 md:bg-transparent"
                  }`}
              >
                {layer.name}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <section className="relative flex flex-col items-center justify-center h-screen px-6 md:px-10 lg:px-16 xl:px-24 text-center overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="z-10 max-w-4xl"
        >
          <h1 className="mb-6 text-5xl font-bold text-white font-playfair md:text-7xl">
            Journey to the Depths
          </h1>
          <p className="mb-8 text-xl text-blue-100 font-lora md:text-2xl">
            Explore the mysteries of our oceans, from sunlit shores to the
            darkest trenches
          </p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block"
          >
            <button
              onClick={() => scrollToLayer(0)}
              className="px-8 py-3 text-lg font-medium text-white rounded-full shadow-lg cursor-pointer bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 font-rubik"
            >
              Begin Exploration
            </button>
          </motion.div>
        </motion.div>

        <motion.div
          animate={{ y: [10, -10] }}
          transition={{ repeat: Infinity, repeatType: "reverse", duration: 2 }}
          className="absolute bottom-10 z-10"
        >
          <FiChevronDown className="w-10 h-10 text-white animate-pulse" />
        </motion.div>

        <div className="absolute inset-0 z-0">
          <img
            src="https://images.pexels.com/photos/189349/pexels-photo-189349.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
            alt="Ocean background"
            className="object-cover w-full h-full"
          />
        </div>

        <div className="absolute inset-0 z-1 bg-gradient-to-b from-blue-800/60 to-blue-900/90"></div>

        <div className="absolute bottom-0 left-0 right-0 h-64 z-0 overflow-hidden">
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-r from-blue-500 to-blue-600 opacity-60"
            style={{ borderRadius: "100% 100% 0 0" }}
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-r from-blue-400 to-blue-500 opacity-50"
            style={{ borderRadius: "100% 100% 0 0" }}
            animate={{ y: [0, -8, 0] }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.3,
            }}
          />
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-r from-blue-300 to-blue-400 opacity-70"
            style={{ borderRadius: "100% 100% 0 0" }}
            animate={{ y: [0, -6, 0] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.6,
            }}
          />
        </div>
      </section>

      {oceanLayersData.map((layer, index) => (
        <React.Fragment key={layer.id}>
          <section
            ref={(el) => {
              layerRefs.current[index] = el as HTMLDivElement;
            }}
            className="relative min-h-screen py-20 overflow-hidden"
            style={{
              background: `linear-gradient(to bottom, ${layer.color}, ${layer.darkColor})`,
            }}
          >
            <div className="container relative z-10 grid grid-cols-1 gap-8 mx-auto px-6 md:px-10 lg:px-16 xl:px-24 md:grid-cols-2 lg:gap-12">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="flex flex-col justify-center"
              >
                <h2 className="mb-4 text-4xl font-bold text-white font-playfair md:text-5xl">
                  {layer.name}
                </h2>
                <div className="mb-4 text-xl font-medium text-blue-100 font-rubik">
                  {layer.depthRange}
                </div>
                <p className="mb-6 text-lg text-white/90 font-lora">
                  {layer.description}
                </p>

                <div className="mb-6">
                  <h3 className="mb-4 text-2xl font-semibold text-white font-playfair inline-block relative">
                    Key Facts
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-300 to-transparent"></span>
                  </h3>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {layer.facts.map((fact) => (
                      <motion.div
                        key={fact.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        viewport={{ once: true, margin: "-100px" }}
                        whileHover={{ y: -4, scale: 1.02 }}
                        className="p-4 rounded-lg bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-md border border-white/10 shadow-lg transition-all duration-300 hover:border-blue-300/30 hover:shadow-blue-300/10"
                      >
                        <div className="flex items-start">
                          <div
                            className="flex items-center justify-center w-10 h-10 mr-4 rounded-full shrink-0"
                            style={{
                              background: `linear-gradient(135deg, ${layer.lightColor}, ${layer.color})`,
                            }}
                          >
                            <FiInfo className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h4 className="text-lg font-medium text-blue-100 font-rubik mb-1">
                              {fact.title}
                            </h4>
                            <p className="text-white/80 font-lora">
                              {fact.content}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="flex flex-col"
              >
                <div className="relative overflow-hidden rounded-lg aspect-[4/3] shadow-2xl">
                  <img
                    src={layer.image}
                    alt={layer.name}
                    className="object-cover w-full h-full transition-transform duration-700 hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                </div>

                <h3 className="mt-8 mb-4 text-2xl font-semibold text-white font-playfair">
                  Creatures
                </h3>

                <div className="grid grid-cols-1 gap-4 mt-2 sm:grid-cols-2 md:grid-cols-3">
                  {layer.creatures.map((creature, i) => (
                    <motion.div
                      key={creature.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: i * 0.1 }}
                      viewport={{ once: true, margin: "-100px" }}
                      whileHover={{ y: -5, scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                      className="overflow-hidden cursor-pointer group"
                      onClick={() => openCreatureModal(creature)}
                    >
                      <div className="relative overflow-hidden rounded-lg aspect-square">
                        <img
                          src={creature.image}
                          alt={creature.name}
                          className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 transition-opacity duration-300 bg-gradient-to-t from-black/80 to-transparent opacity-80 group-hover:opacity-100"></div>
                        <div className="absolute bottom-0 left-0 right-0 p-3">
                          <h3 className="text-lg font-medium text-white font-rubik">
                            {creature.name}
                          </h3>
                          <div className="h-0 overflow-hidden transition-all duration-300 group-hover:h-auto group-hover:mt-2">
                            <p className="text-sm text-white/80">
                              {creature.description.length > 60
                                ? `${creature.description.substring(0, 60)}...`
                                : creature.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>

            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
              {layer.id === "sunlight" && (
                <>
                  {Array.from({ length: 15 }).map((_, i) => (
                    <motion.div
                      key={`sunray-${i}`}
                      className="absolute bg-yellow-500/20"
                      style={{
                        width: Math.random() * 3 + 1,
                        height: Math.random() * 300 + 200,
                        left: `${Math.random() * 100}%`,
                        top: -100,
                        transformOrigin: "top",
                        rotate: Math.random() * 20 - 10,
                      }}
                      animate={{
                        opacity: [0.1, 0.3, 0.1],
                        scaleY: [0.8, 1.2, 0.8],
                      }}
                      transition={{
                        duration: Math.random() * 5 + 5,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                  ))}
                  {Array.from({ length: 10 }).map((_, i) => (
                    <motion.div
                      key={`bubble-${i}`}
                      className="absolute rounded-full bg-white/30"
                      style={{
                        width: Math.random() * 10 + 5,
                        height: Math.random() * 10 + 5,
                        left: `${Math.random() * 100}%`,
                        bottom: -20,
                      }}
                      animate={{
                        y: [0, -Math.random() * 500 - 200],
                        x: [0, Math.random() * 50 - 25],
                        opacity: [0.7, 0],
                      }}
                      transition={{
                        duration: Math.random() * 10 + 10,
                        repeat: Infinity,
                        ease: "easeOut",
                        delay: Math.random() * 5,
                      }}
                    />
                  ))}
                </>
              )}

              {layer.id === "twilight" && (
                <>
                  {Array.from({ length: 24 }).map((_, i) => (
                    <motion.div
                      key={`glow-${i}`}
                      className="absolute rounded-full bg-blue-400/40"
                      style={{
                        width: Math.random() * 12 + 5,
                        height: Math.random() * 12 + 5,
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        filter: "blur(2px)",
                      }}
                      animate={{
                        opacity: [0.2, 0.6, 0.2],
                        scale: [0.8, 1.2, 0.8],
                      }}
                      transition={{
                        duration: Math.random() * 4 + 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: Math.random() * 2,
                      }}
                    />
                  ))}
                </>
              )}

              {(layer.id === "midnight" ||
                layer.id === "abyssal" ||
                layer.id === "hadal") && (
                <>
                  {Array.from({ length: 30 }).map((_, i) => (
                    <motion.div
                      key={`deep-particle-${i}`}
                      className="absolute rounded-full"
                      style={{
                        width: Math.random() * 4 + 1,
                        height: Math.random() * 4 + 1,
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        filter: "blur(1px)",
                        background: `rgba(${Math.random() * 100 + 100}, ${
                          Math.random() * 100 + 100
                        }, ${Math.random() * 255}, ${
                          Math.random() * 0.3 + 0.1
                        })`,
                      }}
                      animate={{
                        y: [0, Math.random() * 100 - 50],
                        x: [0, Math.random() * 100 - 50],
                        opacity: [0.1, 0.5, 0.1],
                      }}
                      transition={{
                        duration: Math.random() * 10 + 10,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: Math.random() * 3,
                      }}
                    />
                  ))}
                </>
              )}
            </div>

            {index < oceanLayersData.length - 1 && (
              <div className="absolute bottom-0 left-0 right-0 h-32 overflow-hidden">
                <motion.div
                  className="absolute w-full h-full"
                  style={{
                    background: `linear-gradient(to bottom, transparent, ${
                      oceanLayersData[index + 1].color
                    })`,
                    clipPath:
                      "polygon(0 100%, 100% 100%, 100% 50%, 75% 75%, 50% 55%, 25% 75%, 0 50%)",
                  }}
                  animate={{
                    y: [0, -10, 0],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              </div>
            )}
          </section>
        </React.Fragment>
      ))}

      <ColorTransition
        topColor={oceanLayersData[oceanLayersData.length - 1].darkColor}
        bottomColor="#000000"
      />

      <footer className="relative py-12 text-center text-white bg-black z-20">
        <div className="container relative z-20 px-6 md:px-10 lg:px-16 xl:px-24 mx-auto">
          <h2 className="mb-6 text-3xl font-bold font-playfair">
            Ocean Depths Explorer
          </h2>
          <p className="mx-auto mb-8 text-lg max-w-2xl font-lora text-blue-100/80">
            Continue your ocean exploration journey and learn more about these
            fascinating ecosystems and the creatures that inhabit them.
          </p>
          <p className="mt-10 text-sm text-blue-100/60 font-lora">
            &copy; {new Date().getFullYear()} Ocean Depths Explorer. All images
            sourced from Unsplash.
          </p>
        </div>
      </footer>

      <AnimatePresence>
        {modalOpen && selectedCreature && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl p-6 mx-auto overflow-hidden bg-gradient-to-b from-blue-900 to-blue-950 rounded-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={closeModal}
                className="absolute p-2 text-white rounded-full top-4 right-4 hover:bg-white/10 cursor-pointer"
              >
                <FiX size={24} />
              </button>

              <div className="overflow-hidden rounded-lg aspect-video">
                <img
                  src={selectedCreature.image}
                  alt={selectedCreature.name}
                  className="object-cover w-full h-full"
                />
              </div>

              <h3 className="mt-6 mb-3 text-2xl font-bold text-white font-playfair">
                {selectedCreature.name}
              </h3>
              <p className="text-blue-100 font-lora">
                {selectedCreature.description}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Toaster position="bottom-right" />
    </main>
  );
}
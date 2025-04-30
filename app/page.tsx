"use client";
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Head from 'next/head';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';

interface Artwork {
  id: number;
  image: string;
  title: string;
  artist: string;
  description: string;
  year: number;
  medium: string;
}

// Typography constants
const Typography = {
  // Headings
  h1: {
    size: '48px',
    lineHeight: '1.25',
    weight: '700'
  },
  h2: {
    size: '32px',
    lineHeight: '1.3',
    weight: '600'
  },
  h3: {
    size: '24px',
    lineHeight: '1.4',
    weight: '600'
  },
  // Body text
  body: {
    size: '16px',
    lineHeight: '1.75',
    weight: '400'
  },
  // Buttons and CTAs
  cta: {
    size: '18px',
    lineHeight: '1.5',
    weight: '600'
  }
};

const FALLBACK_IMAGE_PATH = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iIzFhMWEzZiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjAiIGZpbGw9IiNmZmYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5JbWFnZSBVbmF2YWlsYWJsZTwvdGV4dD48L3N2Zz4=';

const DigitalGallery = () => {
  const [artworks, setArtworks] = useState<Artwork[]>([
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1534796636912-3b95b3ab5986',
      title: 'Celestial Dreams',
      artist: 'Emma Rivers',
      description: 'An exploration of cosmic landscapes through vibrant color harmonies and fluid forms.',
      year: 2023,
      medium: 'Digital',
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1514565131-fce0801e5785',
      title: 'Urban Symphony',
      artist: 'Marcus Chen',
      description: 'A rhythmic composition inspired by city lights and the pulse of metropolitan life.',
      year: 2022,
      medium: 'Mixed Media Digital',
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
      title: 'Ephemeral Whispers',
      artist: 'Sophia James',
      description: 'Delicate forms emerge from a mist of color, inviting the viewer into a dreamlike state.',
      year: 2023,
      medium: 'Digital Painting',
    },
    {
      id: 4,
      image: 'https://images.unsplash.com/photo-1515266591878-f93e32bc5937',
      title: 'Digital Odyssey',
      artist: 'Alex Mercer',
      description: 'A technological journey through layers of reality and digital abstraction.',
      year: 2021,
      medium: 'Generative Art',
    },
    {
      id: 5,
      image: 'https://images.unsplash.com/photo-1500462918059-b1a0cb512f1d',
      title: 'Chromatic Emotions',
      artist: 'Olivia Pascal',
      description: 'An emotional landscape rendered through a spectrum of colors that shift with perspective.',
      year: 2022,
      medium: 'Digital Collage',
    },
    {
      id: 6,
      image: 'https://images.unsplash.com/photo-1550684376-efcbd6e3f031',
      title: 'Neon Reverie',
      artist: 'Zane Thompson',
      description: 'Bold neon expressions create a vibrant alternative reality filled with energy.',
      year: 2023,
      medium: 'Digital Art',
    },
  ]);

  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [imagesLoadedCount, setImagesLoadedCount] = useState(0);

  useEffect(() => {
    console.log(`Images loaded: ${imagesLoadedCount}/${artworks.length}`);

    if (imagesLoadedCount === artworks.length) {
      console.log('All images loaded, setting isLoading to false');
      setIsLoading(false);
    }

    const timeout = setTimeout(() => {
      if (isLoading) {
        console.warn('Loading timeout reached, forcing isLoading to false');
        setIsLoading(false);
      }
    }, 5000);

    return () => clearTimeout(timeout);
  }, [imagesLoadedCount, artworks.length, isLoading]);

  const handleImageLoad = () => {
    setImagesLoadedCount((count) => {
      const newCount = count + 1;
      console.log(`Image loaded, count: ${newCount}`);
      return newCount;
    });
  };

  const handleImageError = (artwork: Artwork, event: React.SyntheticEvent<HTMLImageElement>) => {
    const target = event.currentTarget;
    if (target.src !== FALLBACK_IMAGE_PATH) {
      console.error(`Failed to load image: ${artwork.image}`);
      target.src = FALLBACK_IMAGE_PATH;
      target.alt = `The image for "${artwork.title}" could not be loaded. Showing fallback image instead.`;
    }
    setImagesLoadedCount((count) => {
      const newCount = count + 1;
      console.log(`Image error, count: ${newCount}`);
      return newCount;
    });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15,
      },
    },
  };

  const modalVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 25,
      },
    },
    exit: {
      scale: 0.8,
      opacity: 0,
      transition: { duration: 0.3 },
    },
  };

  const scrollToGallery = () => {
    const gallerySection = document.getElementById('gallery');
    if (gallerySection) {
      gallerySection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <Head>
        <title>Digital Gallery | Explore Artistic Innovation</title>
        <meta
          content="A dynamic digital gallery showcasing innovative artistic expressions in the digital medium."
          name="description"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Montserrat:wght@300;400;600&display=swap"
          rel="stylesheet"
        />
        <style jsx global>{`
          @font-face {
            font-family: 'Playfair Display';
            src: url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&display=swap');
            font-weight: 400 700;
            font-display: swap;
          }
          @font-face {
            font-family: 'Montserrat';
            src: url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;600&display=swap');
            font-weight: 300 600;
            font-display: swap;
          }
        `}</style>
      </Head>

      {isLoading ? (
        <motion.div
          className="fixed inset-0 bg-[#1A1A3A] flex items-center justify-center z-50"
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 1, delay: 1 }}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1, rotate: 360 }}
            transition={{ duration: 1.5, ease: 'easeInOut', repeat: Infinity }}
            className="w-24 h-24 border-t-4 border-l-4 border-[#FF6B6B] rounded-full"
          />
          <motion.h2
            className="absolute mt-32 text-white text-2xl font-['Playfair_Display']"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Digital Gallery
          </motion.h2>
        </motion.div>
      ) : (
        <main className="min-h-screen bg-[#1A1A3A] font-['Montserrat']">
          <section className="relative h-screen overflow-hidden">
            <motion.div
              className="absolute inset-0 bg-[#1A1A3A]"
              animate={{
                background: [
                  'linear-gradient(135deg, #1A1A3A, #2A4066)',
                  'linear-gradient(135deg, #2A4066, #1A1A3A)',
                  'linear-gradient(135deg, #1A1A3A, #2C3E50)',
                  'linear-gradient(135deg, #2C3E50, #1A1A3A)',
                  'linear-gradient(135deg, #1A1A3A, #2A4066)',
                ],
              }}
              transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
            >
              <motion.div
                className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-[#FF6B6B] opacity-20 blur-3xl"
                animate={{
                  x: [0, 30, 0, -30, 0],
                  y: [0, -30, 0, 30, 0],
                }}
                transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
              />
              <motion.div
                className="absolute top-2/3 right-1/4 w-48 h-48 rounded-full bg-[#2A9D8F] opacity-20 blur-3xl"
                animate={{
                  x: [0, -20, 0, 20, 0],
                  y: [0, 20, 0, -20, 0],
                }}
                transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
              />
              <motion.div
                className="absolute bottom-1/4 right-1/3 w-40 h-40 rounded-full bg-[#FF6B6B] opacity-20 blur-3xl"
                animate={{
                  x: [0, 25, 0, -25, 0],
                  y: [0, -25, 0, 25, 0],
                }}
                transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
              />
            </motion.div>

            <div className="relative z-10 container mx-auto px-4 h-full flex flex-col items-center justify-center text-center">
              <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.2 }}
              >
                <h1 className="text-6xl md:text-7xl lg:text-8xl font-['Playfair Display'] font-[700] text-white mb-6 tracking-tight leading-[1.2]">
                  Digital Gallery
                </h1>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.5 }}
              >
                <p className="text-xl md:text-2xl text-[#D1D5DB] max-w-3xl mb-12 leading-[1.75] font-['Montserrat'] font-[400]">
                  Explore our curated collection of innovative digital artworks from talented artists
                  around the world.
                </p>
                <motion.button
                  onClick={scrollToGallery}
                  className="px-8 py-3 bg-gradient-to-r from-[#4A90E2] to-[#5D5FEF] text-white rounded-full text-lg font-semibold hover:from-[#357ABD] hover:to-[#4A4CBF] shadow-lg transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  View Gallery
                </motion.button>
              </motion.div>

              <motion.div
                className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="cursor-pointer"
                  onClick={scrollToGallery}
                >
                  <path d="M7 13l5 5 5-5"></path>
                  <path d="M7 7l5 5 5-5"></path>
                </svg>
              </motion.div>
            </div>
          </section>

          <section id="gallery" className="relative py-20 bg-gradient-to-b from-[#1A1A3A] to-[#2A4066]">
            <div className="container mx-auto px-4">
              <motion.h2
                className="text-4xl md:text-5xl font-['Playfair Display'] font-[600] text-white mb-16 text-center leading-[1.3]"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
              >
                Featured Artworks
              </motion.h2>

              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4 md:px-6 lg:px-8"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }}
              >
                {artworks.map((artwork) => (
                  <motion.div
                    key={artwork.id}
                    variants={itemVariants}
                    whileHover={{ y: -10 }}
                    className="rounded-xl overflow-hidden bg-gradient-to-br from-[#2A4066] to-[#1A1A3A] shadow-lg transition-all duration-300 hover:shadow-2xl hover:shadow-[#4A90E2]/30 transform perspective-1000"
                  >
                    <div
                      className="group relative aspect-[4/3] overflow-hidden cursor-pointer rounded-xl"
                      onClick={() => setSelectedArtwork(artwork)}
                      tabIndex={0}
                      role="button"
                      aria-label={`Open details for artwork id ${artwork.id}`}
                    >
                      <motion.img
                        src={artwork.image}
                        alt={artwork.title}
                        className="object-cover w-full h-full transition-all duration-500 group-hover:scale-105"
                        onLoad={handleImageLoad}
                        onError={(e) => handleImageError(artwork, e)}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-60 transition-opacity group-hover:opacity-80" />
                      <motion.div
                        className="absolute bottom-0 left-0 right-0 p-6 text-white transform transition-transform duration-300 group-hover:translate-y-0 translate-y-2"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        <h3 className="text-2xl font-['Playfair Display'] font-[600] mb-2 transform transition-all duration-300 group-hover:scale-105">
                          {artwork.title}
                        </h3>
                        <p className="text-[#D1D5DB] text-lg font-['Montserrat'] font-[400] transform transition-all duration-300 group-hover:text-white">{artwork.artist}</p>
                      </motion.div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </section>

          <AnimatePresence>
            {selectedArtwork && (
              <motion.div
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedArtwork(null)}
              >
                <motion.div
                  className="relative max-w-5xl w-full max-h-[90vh] bg-gradient-to-b from-gray-900 to-black rounded-2xl overflow-hidden shadow-2xl shadow-purple-900/30"
                  variants={modalVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
                  aria-labelledby="artwork-modal-title"
                  aria-describedby="artwork-modal-description"
                  role="dialog"
                >
                  <button
                    className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-[#1F1F2A] backdrop-blur-sm flex items-center justify-center text-white hover:bg-[#2A2A3A] transition-all"
                    onClick={() => setSelectedArtwork(null)}
                    aria-label="Close artwork details"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>

                  <div className="flex flex-col md:flex-row gap-8 md:gap-12 p-8 md:p-12 bg-[#1F1F2A] rounded-2xl shadow-2xl shadow-[#4A90E2]/20">
                    <div className="md:w-3/5 relative">
                      <TransformWrapper
                        initialScale={1}
                        minScale={1}
                        maxScale={3}
                        wheel={{ wheelDisabled: false }}
                        panning={{ disabled: false }}
                        doubleClick={{ disabled: false }}
                      >
                        <TransformComponent
                          wrapperStyle={{
                            width: '100%',
                            height: '70vh',
                            overflow: 'hidden',
                            borderRadius: '12px',
                            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
                          }}
                        >
                          <img
                            src={selectedArtwork.image}
                            alt={selectedArtwork.title}
                            className="w-full h-full object-cover"
                            id="artwork-modal-title"
                          />
                        </TransformComponent>
                      </TransformWrapper>
                    </div>
                    <div className="md:w-2/5 p-6 flex flex-col justify-center">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        id="artwork-modal-description"
                      >
                        <h2 className="text-4xl font-['Playfair Display'] font-[600] text-white mb-6 leading-[1.3]">
                          {selectedArtwork.title}
                        </h2>
                        <p className="text-[#4A90E2] mb-6">By {selectedArtwork.artist}</p>
                        <div className="mb-6">
                          <p className="text-[#D1D5DB] mb-8 leading-[1.75] font-['Montserrat'] font-[400]">{selectedArtwork.description}</p>
                          <div className="grid grid-cols-2 gap-6 text-base font-['Montserrat'] font-[400]">
                            <div>
                              <p className="text-[#D1D5DB] font-['Montserrat'] font-[400]">Year</p>
                              <p className="text-white font-['Montserrat'] font-[400]">{selectedArtwork.year}</p>
                            </div>
                            <div>
                              <p className="text-[#D1D5DB] font-['Montserrat'] font-[400]">Medium</p>
                              <p className="text-white font-['Montserrat'] font-[400]">{selectedArtwork.medium}</p>
                            </div>
                          </div>
                        </div>
                        <motion.button
                          className="px-8 py-3 bg-gradient-to-r from-[#4A90E2] to-[#5D5FEF] text-white rounded-xl font-semibold hover:from-[#357ABD] hover:to-[#4A4CBF] transition-all duration-300"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setSelectedArtwork(null)}
                        >
                          Explore More
                        </motion.button>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      )}
    </>
  );
};

export default DigitalGallery;
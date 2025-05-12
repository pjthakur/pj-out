"use client";

import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';


const LogoIcon = () => (
  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const TwitterIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.39.106-.803.162-1.227.162-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z"/></svg>
);
const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948s.014 3.667.072 4.947c.2 4.359 2.618 6.78 6.98 6.98 1.281.059 1.689.073 4.948.073s3.667-.014 4.947-.072c4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.947s-.014-3.667-.072-4.947c-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4s1.791-4 4-4c2.21 0 4 1.791 4 4s-1.79 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
);
const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"/></svg>
);


interface Artwork {
  id: string;
  title: string;
  artist: string;
  year: string;
  imageUrl: string;
  description: string;
  category: string;
  palette: [string, string, string];
  medium?: string;
  dimensions?: string;
  collectionTheme?: string;
}


const PLACEHOLDER_IMAGE_URL = 'https://picsum.photos/seed/placeholder/300/400';


const artworksData: Artwork[] = [
  {
    id: '1', title: 'Celestial Dreams', artist: 'Aurora Lynn', year: '2023',
    imageUrl: 'https://picsum.photos/seed/art1/800/600',
    description: 'A mesmerizing journey through cosmic nebulae, exploring the fabric of stardust and dreams, rendered in vibrant acrylics and digital enhancements.',
    category: 'Abstract', palette: ['#0A1931', '#185ADB', '#E8F0F2'], medium: "Mixed Media", dimensions: "120 x 80 cm", collectionTheme: 'Abstract Realities'
  },
  {
    id: '2', title: 'Urban Echoes', artist: 'Mason Vane', year: '2022',
    imageUrl: 'https://picsum.photos/seed/art2/800/600',
    description: 'Reflections of a bustling metropolis, capturing the vibrant energy and hidden stories of city life in a digital age. A study in light and motion.',
    category: 'Digital', palette: ['#393E46', '#F7F7F7', '#FFD369'], medium: "Digital Painting", dimensions: "1920 x 1080 px", collectionTheme: 'Cyberpunk Visions'
  },
  {
    id: '3', title: 'Verdant Whisper', artist: 'Elara Green', year: '2024',
    imageUrl: 'https://picsum.photos/seed/art3/800/600',
    description: 'The serene and vibrant hues of an untouched wilderness, painted by the gentle hand of nature itself. Oil on canvas capturing diffused light.',
    category: 'Nature', palette: ['#2E8B57', '#90EE90', '#FAFAD2'], medium: "Oil Painting", dimensions: "90 x 120 cm", collectionTheme: 'Ethereal Landscapes'
  },
  {
    id: '4', title: 'Future Noir', artist: 'Jax Ryder', year: '2023',
    imageUrl: 'https://picsum.photos/seed/art4/800/600',
    description: 'A haunting glimpse into a dystopian, neon-lit future where shadows dance with artificial lights. Explores themes of transhumanism.',
    category: 'Sci-Fi', palette: ['#1A1A2E', '#C04848', '#F26B38'], medium: "3D Render", dimensions: "4000 x 2500 px", collectionTheme: 'Cyberpunk Visions'
  },
  {
    id: '5', title: 'Ephemeral Light', artist: 'Seraphina Moon', year: '2022',
    imageUrl: 'https://picsum.photos/seed/art5/800/600',
    description: 'Capturing the fleeting, delicate moments of light and shadow that play upon the world\'s surfaces. A study in minimalist beauty.',
    category: 'Abstract', palette: ['#ADA9B2', '#E4D0D0', '#FFF8E1'], medium: "Photography", dimensions: "60 x 60 cm", collectionTheme: 'Abstract Realities'
  }
];

const categories = ['All', ...new Set(artworksData.map(art => art.category)), "User Uploads"];

const collectionMappings: Record<string, string> = {
    'Ethereal Landscapes': 'Nature',
    'Cyberpunk Visions': 'Sci-Fi',
    'Abstract Realities': 'Abstract',
};


const useIntersectionObserver = (
  options?: IntersectionObserverInit
): [React.RefObject<HTMLElement>, boolean] => {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        if (elementRef.current) {
          observer.unobserve(elementRef.current);
        }
      }
    }, options);

    const currentElement = elementRef.current;
    if (currentElement) {
      observer.observe(currentElement);
    }

    return () => {
      if (currentElement) {
        observer.unobserve(currentElement);
      }
    };
  }, [options]);

  // Fix type error: cast elementRef to correct type for return
  return [elementRef as React.RefObject<HTMLElement>, isVisible];
};


const ArtGalleryPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(artworksData[0] || null);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [dynamicBgStyle, setDynamicBgStyle] = useState({});
  const galleryScrollRef = useRef<HTMLDivElement>(null);
  const [parallaxOffset, setParallaxOffset] = useState(0);
  const [navbarBgVisible, setNavbarBgVisible] = useState(false);
  const [userArtworks, setUserArtworks] = useState<Artwork[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [newsletterMessage, setNewsletterMessage] = useState<string | null>(null);

  const [showDetailModal, setShowDetailModal] = useState<boolean>(false);
  const [detailArtwork, setDetailArtwork] = useState<Artwork | null>(null);
  const [favoriteArtworks, setFavoriteArtworks] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showSearch, setShowSearch] = useState<boolean>(false);
  const [showShareOptions, setShowShareOptions] = useState<boolean>(false);
  const zoomImageRef = useRef<HTMLImageElement>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [colorFilter, setColorFilter] = useState<string | null>(null);

  const [curatedSectionRef, isCuratedSectionVisible] = useIntersectionObserver({ threshold: 0.1 });
  const [artistSpotlightRef, isArtistSpotlightVisible] = useIntersectionObserver({ threshold: 0.1 });
  const [journeySectionRef, isJourneySectionVisible] = useIntersectionObserver({ threshold: 0.1 });
  const [userUploadsSectionRef, isUserUploadsSectionVisible] = useIntersectionObserver({ threshold: 0.1 });
  const [favoritesSectionRef, isFavoritesSectionVisible] = useIntersectionObserver({ threshold: 0.1 });

  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  const [backgroundStyles, setBackgroundStyles] = useState({
    backgroundPosition: '50% 50%'
  });

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (selectedArtwork) {
      setDynamicBgStyle({
        backgroundImage: `linear-gradient(135deg, ${selectedArtwork.palette[0]}, ${selectedArtwork.palette[1]}, ${selectedArtwork.palette[2]})`,
      });
    } else if (artworksData.length > 0) {
      setDynamicBgStyle({
        backgroundImage: `linear-gradient(135deg, ${artworksData[0].palette[0]}, ${artworksData[0].palette[1]}, ${artworksData[0].palette[2]})`,
      });
    } else {
      setDynamicBgStyle({ 
        backgroundImage: `linear-gradient(135deg, #0a0a0a, #1a1a1a, #2a2a2a)` 
      });
    }
  }, [selectedArtwork]);

  const allArtworksToDisplay = useMemo(() => [...artworksData, ...userArtworks], [userArtworks]);

  const filteredArtworks = useMemo(() => {
    if (activeCategory === 'All') return allArtworksToDisplay;
    if (activeCategory === 'User Uploads') return userArtworks;
    return allArtworksToDisplay.filter(art => art.category === activeCategory && art.category !== "User Uploads");
  }, [activeCategory, allArtworksToDisplay, userArtworks]);

  const handleSelectArtwork = useCallback((artwork: Artwork) => {
    setSelectedArtwork(artwork);
    const itemElement = galleryScrollRef.current?.querySelector(`[data-id="${artwork.id}"]`) || document.querySelector(`[data-id="${artwork.id}"]`);
    itemElement?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.pageYOffset;
      setParallaxOffset(offset);
      setNavbarBgVisible(offset > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleImageError = useCallback((event: React.SyntheticEvent<HTMLImageElement, Event>) => {
    event.currentTarget.src = PLACEHOLDER_IMAGE_URL;
  }, []);

  const handleExploreCollection = useCallback((collectionName: string) => {
      const targetCategory = collectionMappings[collectionName];
      if (targetCategory) {
          setActiveCategory(targetCategory);
          const filterSectionEl = document.getElementById('filter-section-anchor');
          filterSectionEl?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
          console.warn(`No category mapping found for collection: ${collectionName}`);
          setActiveCategory('All');
      }
  }, []);

  const handleStartJourneyClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const newArtworksPromises = Array.from(files).map(file => {
      return new Promise<Artwork>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve({
            id: `user-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
            title: file.name.split('.').slice(0, -1).join('.') || "Untitled User Art",
            artist: "You",
            year: new Date().getFullYear().toString(),
            imageUrl: reader.result as string,
            description: "Artwork uploaded by user.",
            category: "User Uploads",
            palette: ['#555555', '#888888', '#cccccc'],
            medium: "Digital Upload",
            dimensions: "Variable"
          });
        };
        reader.readAsDataURL(file);
      });
    });

    const createdArtworks = await Promise.all(newArtworksPromises);
    setUserArtworks(prev => [...prev, ...createdArtworks]);
    setActiveCategory("User Uploads");
    document.getElementById('user-uploads-section')?.scrollIntoView({ behavior: 'smooth' });

    if(fileInputRef.current) fileInputRef.current.value = "";
  }, []);

  const handleContactUs = useCallback(() => {
    window.location.href = 'mailto:contact@auragallery.com?subject=Inquiry from Aura Gallery Website';
  }, []);

  const handleViewFullDetails = useCallback(() => {
    if (selectedArtwork) {
      openDetailView(selectedArtwork);
    }
  }, [selectedArtwork]);

  const handleDiscoverArtist = useCallback((artistName: string, category: string) => {
    const artistArtwork = artworksData.find(art => art.artist === artistName);
    if (artistArtwork) {
        setActiveCategory(category);
        setSelectedArtwork(artistArtwork);
        document.getElementById('featured')?.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  const handleNewsletterSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setNewsletterMessage("Thank you for subscribing!");
    setTimeout(() => setNewsletterMessage(null), 3000);
    (e.target as HTMLFormElement).reset();
  }, []);

  useEffect(() => {
    try {
      const storedFavorites = localStorage.getItem('auraGalleryFavorites');
      if (storedFavorites) {
        setFavoriteArtworks(new Set(JSON.parse(storedFavorites)));
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('auraGalleryFavorites', JSON.stringify([...favoriteArtworks]));
    } catch (error) {
      console.error('Error saving favorites:', error);
    }
  }, [favoriteArtworks]);

  const toggleFavorite = (artworkId: string, event?: React.MouseEvent) => {
    if (event) event.stopPropagation();
    
    setFavoriteArtworks(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(artworkId)) {
        newFavorites.delete(artworkId);
      } else {
        newFavorites.add(artworkId);
      }
      return newFavorites;
    });
  };

  const openDetailView = (artwork: Artwork) => {
    setDetailArtwork(artwork);
    setShowDetailModal(true);
    setZoomLevel(1);
    document.body.style.overflow = 'hidden';
  };

  const closeDetailView = () => {
    setShowDetailModal(false);
    setShowShareOptions(false);
    document.body.style.overflow = '';
  };

  const handleZoom = (direction: 'in' | 'out') => {
    if (direction === 'in' && zoomLevel < 3) {
      setZoomLevel(prev => prev + 0.5);
    } else if (direction === 'out' && zoomLevel > 1) {
      setZoomLevel(prev => prev - 0.5);
    }
  };

  const handleImageMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (zoomLevel <= 1 || !zoomImageRef.current) return;
    
    const { left, top, width, height } = zoomImageRef.current.getBoundingClientRect();
    const x = (e.clientX - left) / width;
    const y = (e.clientY - top) / height;
    
    setZoomPosition({ x, y });
  };

  const filteredBySearch = useMemo(() => {
    if (!searchQuery.trim()) return filteredArtworks;
    
    const query = searchQuery.toLowerCase();
    return filteredArtworks.filter(art => 
      art.title.toLowerCase().includes(query) || 
      art.artist.toLowerCase().includes(query) || 
      art.description.toLowerCase().includes(query) ||
      art.year.toLowerCase().includes(query)
    );
  }, [filteredArtworks, searchQuery]);

  const getRelatedArtworks = (artwork: Artwork, count: number = 3) => {
    let related = allArtworksToDisplay.filter(art => 
      art.id !== artwork.id && art.artist === artwork.artist
    );
    
    if (related.length < count) {
      const sameCategory = allArtworksToDisplay.filter(art => 
        art.id !== artwork.id && 
        art.artist !== artwork.artist && 
        art.category === artwork.category
      );
      related = [...related, ...sameCategory].slice(0, count);
    }
    
    if (related.length < count) {
      const others = allArtworksToDisplay.filter(art => 
        art.id !== artwork.id && 
        !related.some(r => r.id === art.id)
      );
      related = [...related, ...others].slice(0, count);
    }
    
    return related.slice(0, count);
  };

  const handleShare = (platform: 'twitter' | 'facebook' | 'pinterest' | 'email', artwork: Artwork) => {
    const shareUrl = `${window.location.origin}?artwork=${artwork.id}`;
    const shareText = `Check out "${artwork.title}" by ${artwork.artist} at Aura Gallery`;
    
    let shareLink = '';
    
    switch (platform) {
      case 'twitter':
        shareLink = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
        break;
      case 'facebook':
        shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
        break;
      case 'pinterest':
        shareLink = `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(shareUrl)}&media=${encodeURIComponent(artwork.imageUrl)}&description=${encodeURIComponent(shareText)}`;
        break;
      case 'email':
        shareLink = `mailto:?subject=${encodeURIComponent(`Aura Gallery - ${artwork.title}`)}&body=${encodeURIComponent(`${shareText}\n\n${shareUrl}`)}`;
        break;
    }
    
    window.open(shareLink, '_blank');
    setShowShareOptions(false);
  };

  const filterByColor = (color: string | null) => {
    setColorFilter(color);
    if (color) {
      const filteredByColor = allArtworksToDisplay.filter(art => 
        art.palette.some(paletteColor => 
          paletteColor.toLowerCase().includes(color.toLowerCase())
        )
      );
      
      if (filteredByColor.length > 0) {
        setActiveCategory('All');
      } else {
        alert(`No artworks found with ${color} as a dominant color.`);
      }
    } else {
      setActiveCategory('All');
    }
  };

  const handleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    const button = document.querySelector('.mobile-menu-button');
    if (button) {
      button.classList.toggle('open');
    }
    document.body.style.overflow = !mobileMenuOpen ? 'hidden' : '';
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (window.innerWidth / 2 - e.clientX) / 50;
      const y = (window.innerHeight / 2 - e.clientY) / 50;
      
      setBackgroundStyles({
        backgroundPosition: `calc(50% + ${x}px) calc(50% + ${y}px)`
      });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  if (isLoading) {
    return (
      <div className="loading-overlay">
        <div className="spinner"></div>
        <p>Loading Artistry...</p>
        <style jsx>{`
          .loading-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: #0B0A0F; display: flex; flex-direction: column; justify-content: center; align-items: center; z-index: 9999; color: #E0E0E0; }
          .spinner { border: 4px solid rgba(255, 255, 255, 0.2); border-left-color: #BB86FC; border-radius: 50%; width: 50px; height: 50px; animation: spin 1s linear infinite; margin-bottom: 20px; }
          @keyframes spin { to { transform: rotate(360deg); } }
          p { font-size: 1.2rem; letter-spacing: 1px; }
        `}</style>
      </div>
    );
  }

  return (
    <>
      <div 
        className="dynamic-background" 
        style={{ 
          ...dynamicBgStyle, 
          backgroundPosition: backgroundStyles.backgroundPosition 
        }}
      ></div>

      <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" multiple style={{ display: 'none' }} />

      <nav className={`navbar ${navbarBgVisible ? 'navbar-scrolled' : ''}`}>
        <div className="navbar-logo"> <LogoIcon /> <span>Aura Gallery</span> </div>
        
        <button 
          className="mobile-menu-button"
          onClick={handleMobileMenu}
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
        
        <div className={`navbar-links ${mobileMenuOpen ? 'mobile-open' : ''}`}>
          {['Featured', 'Collections', 'Journey', 'Artists', 'My Favorites',
            ...(userArtworks.length > 0 ? ['My Uploads'] : [])
          ].map((link, index) => (
            <a 
              key={link}
              href={`#${link.toLowerCase().replace(' ', '-')}`}
              onClick={() => setMobileMenuOpen(false)}
              style={{"--index": index} as React.CSSProperties}
            >
              {link}
            </a>
          ))}
        </div>
        
        <div className={`search-container ${showSearch ? 'search-active' : ''}`}>
          {showSearch ? (
            <div className="search-input-container">
              <input
                type="text"
                placeholder="Search artworks or artists..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
                autoFocus
              />
              <button 
                onClick={() => {
                  setSearchQuery('');
                  setShowSearch(false);
                }}
                className="search-close-btn"
                aria-label="Close search"
              >
                ×
              </button>
            </div>
          ) : (
            <button onClick={() => setShowSearch(true)} className="search-icon-btn" aria-label="Search">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>
          )}
        </div>
        
        <button className="navbar-cta" onClick={handleContactUs}>Contact Us</button>
      </nav>

      {mobileMenuOpen && <div className="mobile-overlay" onClick={() => setMobileMenuOpen(false)}></div>}

      <main className="gallery-app">
        {selectedArtwork && (
          <section id="featured" className="featured-artwork-section">
            <div className="featured-image-container">
              <img 
                key={selectedArtwork.id} src={selectedArtwork.imageUrl} alt={selectedArtwork.title} 
                className="featured-image" onError={handleImageError}
              />
              <div className="featured-image-vignette"></div>
            </div>
            <div className="featured-info">
              <h1 className="featured-title">{selectedArtwork.title}</h1>
              <p className="featured-artist">{selectedArtwork.artist} - {selectedArtwork.year}</p>
              <p className="featured-details">{selectedArtwork.medium} | {selectedArtwork.dimensions}</p>
              <p className="featured-description">{selectedArtwork.description}</p>
              <button className="view-details-button" onClick={handleViewFullDetails}>View Full Details</button>
            </div>
          </section>
        )}
        
        <div id="filter-section-anchor"></div>
        <section className="filter-section" >
          {categories.map(category => (
             (category === "User Uploads" && userArtworks.length === 0) ? null :
            <button key={category}
              className={`filter-button ${activeCategory === category ? 'active' : ''}`}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </section>

        <section className="color-filter-section">
          <h3 className="color-filter-title">Explore by Color</h3>
          <div className="color-palette">
            {[
              { name: 'Red', color: '#e63946' },
              { name: 'Blue', color: '#457b9d' },
              { name: 'Green', color: '#2a9d8f' },
              { name: 'Purple', color: '#8a2be2' },
              { name: 'Yellow', color: '#fcbf49' },
              { name: 'Pink', color: '#f28482' },
              { name: 'Teal', color: '#00b4d8' },
              { name: 'Orange', color: '#fb8500' }
            ].map(colorObj => (
              <button
                key={colorObj.name}
                className={`color-filter-btn ${colorFilter === colorObj.name.toLowerCase() ? 'active' : ''}`}
                style={{ backgroundColor: colorObj.color }}
                onClick={() => filterByColor(colorFilter === colorObj.name.toLowerCase() ? null : colorObj.name.toLowerCase())}
                aria-label={`Filter by ${colorObj.name}`}
                title={colorObj.name}
              />
            ))}
            {colorFilter && (
              <button 
                className="color-filter-reset" 
                onClick={() => filterByColor(null)}
              >
                Reset Filter
              </button>
            )}
          </div>
        </section>

        {activeCategory !== "User Uploads" && (
          <section className="horizontal-gallery-container">
            <div className="horizontal-gallery" ref={galleryScrollRef}>
              {filteredBySearch.map((art, index) => (
                <div key={art.id} data-id={art.id}
                  className={`gallery-item ${selectedArtwork?.id === art.id ? 'selected' : ''}`}
                  onClick={() => handleSelectArtwork(art)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSelectArtwork(art)}
                  tabIndex={0} style={{ animationDelay: `${index * 0.07}s` }}
                >
                  <img src={art.imageUrl} alt={art.title} className="gallery-item-image" onError={handleImageError} />
                  <div className="gallery-item-overlay">
                    <div className="item-info"> 
                      <h3>{art.title}</h3> 
                      <p>{art.artist}</p> 
                    </div>
                    <div className="item-actions">
                      <button 
                        className={`favorite-btn ${favoriteArtworks.has(art.id) ? 'favorited' : ''}`}
                        onClick={(e) => toggleFavorite(art.id, e)}
                        aria-label={favoriteArtworks.has(art.id) ? 'Remove from favorites' : 'Add to favorites'}
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill={favoriteArtworks.has(art.id) ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                        </svg>
                      </button>
                      <button 
                        className="expand-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          openDetailView(art);
                        }}
                        aria-label="View detailed"
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M15 3h6v6"></path>
                          <path d="M9 21H3v-6"></path>
                          <path d="M21 3l-7 7"></path>
                          <path d="M3 21l7-7"></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {filteredArtworks.filter(art => art.category !== "User Uploads").length === 0 && activeCategory !== "All" && (
                <p className="no-artworks-message">No artworks found in the '{activeCategory}' category.</p>
              )}
            </div>
          </section>
        )}

        <section className="art-journey-bridge">
          <div className="bridge-canvas">
            <div className="floating-frame frame-1"></div>
            <div className="floating-frame frame-2"></div>
            <div className="floating-frame frame-3"></div>
            <div className="bridge-particles"></div>
          </div>
          <div className="bridge-content">
            <h2>Explore the Artistic Universe</h2>
            <p>Journey through curated collections and discover new dimensions of creativity</p>
          </div>
        </section>

        
        <section 
          id="my-favorites" 
          ref={favoritesSectionRef as React.RefObject<HTMLDivElement>}
          className={`content-section favorites-section ${isFavoritesSectionVisible ? 'visible' : ''}`}
        >
          <h2 className="section-title">My Favorite Artworks</h2>
          <p className="section-subtitle">Your personal collection of artworks that have captured your heart.</p>
          
          {favoriteArtworks.size > 0 ? (
            <div className="favorites-gallery">
              {allArtworksToDisplay
                .filter(art => favoriteArtworks.has(art.id))
                .map((art, index) => (
                  <div 
                    key={art.id} 
                    className="favorite-item"
                    onClick={() => openDetailView(art)}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <img src={art.imageUrl} alt={art.title} onError={handleImageError} />
                    <div className="favorite-overlay">
                      <h3>{art.title}</h3>
                      <p>{art.artist}, {art.year}</p>
                      <button 
                        className="remove-favorite-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(art.id);
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <div className="empty-favorites">
              <div className="empty-favorites-icon">
                <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.6">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
              </div>
              <h3>No favorites yet</h3>
              <p>Click the heart icon on any artwork to add it to your favorites collection</p>
              <button className="cta-button" onClick={() => document.getElementById('filter-section-anchor')?.scrollIntoView({ behavior: 'smooth' })}>
                Browse Gallery
              </button>
            </div>
          )}
        </section>

        <section 
          id="collections" ref={curatedSectionRef as React.RefObject<HTMLDivElement>} 
          className={`content-section curated-collections ${isCuratedSectionVisible ? 'visible' : ''}`}
        >
          <h2 className="section-title">Curated Collections</h2>
          <p className="section-subtitle">Discover art thematically grouped to inspire and provoke thought.</p>
          <div className="collections-grid">
            {[
              { name: 'Ethereal Landscapes', img: 'https://picsum.photos/seed/landscape/500/300' },
              { name: 'Cyberpunk Visions', img: 'https://picsum.photos/seed/cyberpunk/500/300' },
              { name: 'Abstract Realities', img: 'https://picsum.photos/seed/abstract/500/300' },
            ].map((collection, idx) => (
              <div key={idx} className="collection-card" style={{animationDelay: `${idx * 0.15}s`}}>
                <img src={collection.img} alt={collection.name} className="collection-image" onError={handleImageError} />
                <div className="collection-info">
                  <h3>{collection.name}</h3>
                  <button onClick={() => handleExploreCollection(collection.name)}>Explore Collection</button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section 
          id="journey" ref={journeySectionRef as React.RefObject<HTMLDivElement>}
          className={`content-section journey-section ${isJourneySectionVisible ? 'visible' : ''}`}
        >
          <div className="journey-background-container">
            <div className="journey-stars-bg"></div>
            <div 
              className="journey-parallax-bg primary-bg" 
              style={{ 
                backgroundImage: `url(https://picsum.photos/seed/galaxy/1920/1080)`,
                transform: `translateY(${parallaxOffset * 0.1}px)` 
              }}
            ></div>
            <div 
              className="journey-parallax-bg secondary-bg" 
              style={{ 
                backgroundImage: `url(https://picsum.photos/seed/nebula/1920/1080)`,
                transform: `translateY(${parallaxOffset * 0.2}px)` 
              }}
            ></div>
            <div className="journey-gradient-overlay"></div>
          </div>
          
          <div className="journey-content">
            <h2 className="section-title light-text">A Journey Through Art</h2>
            <p className="section-subtitle light-text">Upload your own masterpieces and see them come alive in your personal collection. Share your vision with the world, or keep it as your private sanctuary.</p>
            <button className="cta-button" onClick={handleStartJourneyClick}>Start Your Journey & Upload</button>
          </div>
        </section>

        {userArtworks.length > 0 && (
          <section 
            id="user-uploads" 
            ref={userUploadsSectionRef as React.RefObject<HTMLDivElement>} 
            className={`content-section user-uploads-gallery ${isUserUploadsSectionVisible ? 'visible' : ''}`}
          >
            <h2 className="section-title">My Uploaded Creations</h2>
            <p className="section-subtitle">Your personal space to showcase the art you've brought to Aura Gallery.</p>
            <div className="horizontal-gallery">
              {userArtworks.map((art, index) => (
                <div
                  key={art.id} data-id={art.id}
                  className={`gallery-item ${selectedArtwork?.id === art.id ? 'selected' : ''}`}
                  onClick={() => handleSelectArtwork(art)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSelectArtwork(art)}
                  tabIndex={0} style={{ animationDelay: `${index * 0.07}s` }}
                >
                  <img src={art.imageUrl} alt={art.title} className="gallery-item-image" onError={handleImageError} />
                  <div className="gallery-item-overlay">
                    <div className="item-info"> <h3>{art.title}</h3> <p>{art.artist}</p> </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        <section 
          id="artists" ref={artistSpotlightRef as React.RefObject<HTMLDivElement>} 
          className={`content-section artist-spotlight ${isArtistSpotlightVisible ? 'visible' : ''}`}
        >
          <div className="artist-image-container">
            <img src="https://picsum.photos/seed/artist/400/400" alt="Artist Elara Green" className="artist-image" onError={handleImageError}/>
          </div>
          <div className="artist-info">
            <h2 className="section-title">Artist Spotlight: Elara Green</h2>
            <p className="section-subtitle">"My work explores the delicate dance between nature's raw power and its ephemeral beauty. Each piece is a conversation with the wild, an echo of the earth's soul."</p>
            <p>Elara Green is a contemporary painter known for her immersive landscapes and profound connection to the natural world. Her unique use of texture and light invites viewers to step into her vibrant canvases, feeling the wind and sun she so masterfully captures.</p>
            <button className="cta-button" onClick={() => handleDiscoverArtist('Elara Green', 'Nature')}>Discover Elara's Work</button>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-column">
            <h4>Aura Gallery</h4>
            <p>Immersive art experiences for the modern connoisseur. Curating beauty, inspiring minds.</p>
            <div className="social-icons">
              <a href="#" aria-label="Twitter" title="Twitter"><TwitterIcon /></a>
              <a href="#" aria-label="Instagram" title="Instagram"><InstagramIcon /></a>
              <a href="#" aria-label="Facebook" title="Facebook"><FacebookIcon /></a>
            </div>
          </div>
          <div className="footer-column">
            <h4>Explore</h4>
            <ul>
              <li><a href="#featured">Featured Art</a></li>
              <li><a href="#collections">Collections</a></li>
              <li><a href="#artists">Artists</a></li>
              <li><a href="#my-favorites">My Favorites</a></li>
              {userArtworks.length > 0 && <li><a href="#user-uploads">My Uploads</a></li>}
              <li><a href="#">Exhibitions (Soon)</a></li>
            </ul>
          </div>
          <div className="footer-column">
            <h4>About Us</h4>
            <ul>
              <li><a href="#">Our Story</a></li>
              <li><a href="#">Press & Media</a></li>
              <li><a href="#">Careers</a></li>
              <li><a href="#" onClick={handleContactUs}>Contact Support</a></li>
            </ul>
          </div>
          <div className="footer-column">
            <h4>Stay Connected</h4>
            <p>Subscribe to our newsletter for the latest acquisitions, events, and insights.</p>
            <form className="newsletter-form" onSubmit={handleNewsletterSubmit}>
              <input type="email" placeholder="Enter your email address" aria-label="Email for newsletter" required/>
              <button type="submit">Subscribe</button>
            </form>
            {newsletterMessage && <p className="newsletter-feedback">{newsletterMessage}</p>}
          </div>
        </div>
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Aura Gallery. All Rights Reserved. Crafted with passion.</p>
          <p><a href="#">Privacy Policy</a> | <a href="#">Terms of Service</a> | <a href="#">Accessibility</a></p>
        </div>
      </footer>

      
      {showDetailModal && detailArtwork && (
        <div className="detail-modal-overlay" onClick={closeDetailView}>
          <div 
            className="detail-modal-content" 
            onClick={e => e.stopPropagation()}
          >
            <button className="detail-close-btn" onClick={closeDetailView}>×</button>
            
            <div className="detail-image-container" onMouseMove={handleImageMouseMove}>
              <div className="detail-zoom-controls">
                <button onClick={() => handleZoom('out')} disabled={zoomLevel <= 1}>−</button>
                <span>{Math.round(zoomLevel * 100)}%</span>
                <button onClick={() => handleZoom('in')} disabled={zoomLevel >= 3}>+</button>
              </div>
              
              <img
                ref={zoomImageRef}
                src={detailArtwork.imageUrl}
                alt={detailArtwork.title}
                className="detail-image"
                style={{
                  transform: `scale(${zoomLevel})`,
                  transformOrigin: zoomLevel > 1 ? `${zoomPosition.x * 100}% ${zoomPosition.y * 100}%` : 'center center'
                }}
                onError={handleImageError}
              />
            </div>
            
            <div className="detail-info">
              <div className="detail-header">
                <div>
                  <h2 className="detail-title">{detailArtwork.title}</h2>
                  <p className="detail-artist">{detailArtwork.artist}, {detailArtwork.year}</p>
                </div>
                <div className="detail-actions">
                  <button 
                    className={`detail-favorite-btn ${favoriteArtworks.has(detailArtwork.id) ? 'favorited' : ''}`}
                    onClick={() => toggleFavorite(detailArtwork.id)}
                    aria-label={favoriteArtworks.has(detailArtwork.id) ? 'Remove from favorites' : 'Add to favorites'}
                  >
                    <svg width="22" height="22" viewBox="0 0 24 24" fill={favoriteArtworks.has(detailArtwork.id) ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                    <span>{favoriteArtworks.has(detailArtwork.id) ? 'Favorited' : 'Add to Favorites'}</span>
                  </button>
                  
                  <div className="detail-share-container">
                    <button 
                      className="detail-share-btn"
                      onClick={() => setShowShareOptions(!showShareOptions)}
                      aria-label="Share"
                    >
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="18" cy="5" r="3"></circle>
                        <circle cx="6" cy="12" r="3"></circle>
                        <circle cx="18" cy="19" r="3"></circle>
                        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                        <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                      </svg>
                      <span>Share</span>
                    </button>
                    
                    {showShareOptions && (
                      <div className="share-options">
                        <button onClick={() => handleShare('twitter', detailArtwork)}>
                          <TwitterIcon /> Twitter
                        </button>
                        <button onClick={() => handleShare('facebook', detailArtwork)}>
                          <FacebookIcon /> Facebook
                        </button>
                        <button onClick={() => handleShare('pinterest', detailArtwork)}>
                          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                            <path d="M12 0c-6.627 0-12 5.373-12 12 0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.83.345-.091.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 12-5.373 12-12 0-6.628-5.392-12-12-12z"/>
                          </svg> Pinterest
                        </button>
                        <button onClick={() => handleShare('email', detailArtwork)}>
                          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                            <polyline points="22,6 12,13 2,6"></polyline>
                          </svg> Email
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="detail-specs">
                <div className="detail-spec-item">
                  <span>Medium:</span> {detailArtwork.medium || 'Not specified'}
                </div>
                <div className="detail-spec-item">
                  <span>Dimensions:</span> {detailArtwork.dimensions || 'Not specified'}
                </div>
                <div className="detail-spec-item">
                  <span>Category:</span> {detailArtwork.category}
                </div>
                {detailArtwork.collectionTheme && (
                  <div className="detail-spec-item">
                    <span>Collection:</span> {detailArtwork.collectionTheme}
                  </div>
                )}
              </div>
              
              <div className="detail-description">
                <h3>About This Artwork</h3>
                <p>{detailArtwork.description}</p>
              </div>
              
              <div className="detail-color-palette">
                <h3>Color Palette</h3>
                <div className="palette-colors">
                  {detailArtwork.palette.map((color, index) => (
                    <div key={index} className="palette-color" style={{ backgroundColor: color }} title={color} />
                  ))}
                </div>
              </div>
              
              <div className="related-artworks">
                <h3>You May Also Like</h3>
                <div className="related-grid">
                  {getRelatedArtworks(detailArtwork, 3).map(art => (
                    <div key={art.id} className="related-item" onClick={() => {
                      setDetailArtwork(art);
                      setZoomLevel(1);
                    }}>
                      <img src={art.imageUrl} alt={art.title} onError={handleImageError} />
                      <div className="related-info">
                        <h4>{art.title}</h4>
                        <p>{art.artist}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        html, body { margin: 0; padding: 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #08070B; color: #E0E0E0; overscroll-behavior-y: none; min-height: 100%; scroll-behavior: smooth; }
        body { overflow-x: hidden; } * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 10px; height: 10px; }
        ::-webkit-scrollbar-track { background: rgba(255, 255, 255, 0.03); border-radius: 10px; }
        ::-webkit-scrollbar-thumb { background-color: rgba(187, 134, 252, 0.5); border-radius: 10px; border: 2px solid transparent; background-clip: content-box; }
        ::-webkit-scrollbar-thumb:hover { background-color: rgba(187, 134, 252, 0.7); }
        html { scrollbar-width: thin; scrollbar-color: rgba(187, 134, 252, 0.5) rgba(255, 255, 255, 0.03); }
        @font-face {
          font-family: 'Inter';
          font-style: normal;
          font-weight: 300;
          src: url('https://fonts.gstatic.com/s/inter/v12/UcCo3FwrK3iLTcviflSQ.woff2') format('woff2');
        }
        @font-face {
          font-family: 'Inter';
          font-style: normal;
          font-weight: 400;
          src: url('https://fonts.gstatic.com/s/inter/v12/UcCl3FwrK3iLVYUxxgEN.woff2') format('woff2');
        }
        @font-face {
          font-family: 'Inter';
          font-style: normal;
          font-weight: 500;
          src: url('https://fonts.gstatic.com/s/inter/v12/UcCm3FwrK3iLVa4AvgEN.woff2') format('woff2');
        }
        @font-face {
          font-family: 'Inter';
          font-style: normal;
          font-weight: 600;
          src: url('https://fonts.gstatic.com/s/inter/v12/UcCo3FwrK3iLVdv5flSQ.woff2') format('woff2');
        }
        @font-face {
          font-family: 'Inter';
          font-style: normal;
          font-weight: 700;
          src: url('https://fonts.gstatic.com/s/inter/v12/UcCl3FwrK3iLVdv6FlSQ.woff2') format('woff2');
        }
        @font-face {
          font-family: 'Playfair Display';
          font-style: normal;
          font-weight: 700;
          src: url('https://fonts.gstatic.com/s/playfairdisplay/v30/nuFiD-vYSZviVYUb_rj3ij__anPXDTvA.woff2') format('woff2');
        }
      `}</style>
      <style jsx>{`
        .dynamic-background { 
          position: fixed; 
          top: 0; 
          left: 0; 
          width: 100%; 
          height: 100%; 
          z-index: -2; 
          background-blend-mode: overlay;
          background-size: 200% 200%, cover;
          transition: background-position 0.5s ease;
          animation: gradientAnimation 15s ease infinite alternate;
          filter: brightness(0.6) saturate(1.2);
          opacity: 0.8;
        }
        @keyframes gradientAnimation {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .gallery-app { display: flex; flex-direction: column; min-height: 100vh; padding: 0 clamp(15px, 4vw, 60px) clamp(40px, 6vw, 80px); padding-top: 100px; gap: clamp(50px, 7vw, 100px); position: relative; z-index: 1; }
        .navbar { position: fixed; top: 0; left: 0; right: 0; display: flex; justify-content: space-between; align-items: center; padding: 20px clamp(15px, 4vw, 60px); background-color: transparent; z-index: 1000; transition: background-color 0.4s ease, box-shadow 0.4s ease; }
        .navbar.navbar-scrolled { background-color: rgba(11, 10, 15, 0.85); backdrop-filter: blur(18px) saturate(150%); box-shadow: 0 5px 35px rgba(0,0,0,0.25); border-bottom: 1px solid rgba(255, 255, 255, 0.07); }
        .navbar-logo { display: flex; align-items: center; gap: 12px; font-family: 'Playfair Display', serif; font-size: 1.7rem; font-weight: 700; color: #FFFFFF; cursor: pointer; }
        .navbar-logo svg { color: #BB86FC; }
        .navbar-links { display: none; }
        @media (min-width: 880px) { .navbar-links { display: flex; gap: 35px; } .navbar-links a { color: #C8C8C8; text-decoration: none; font-size: 1rem; font-weight: 500; transition: color 0.25s ease, transform 0.25s ease; position: relative; padding-bottom: 5px; } .navbar-links a::after { content: ''; position: absolute; bottom: 0; left: 50%; transform: translateX(-50%); width: 0; height: 2px; background-color: #BB86FC; transition: width 0.3s ease; } .navbar-links a:hover, .navbar-links a:focus-visible { color: #FFFFFF; transform: translateY(-1px); } .navbar-links a:hover::after, .navbar-links a:focus-visible::after { width: 60%; } }
        .navbar-cta { padding: 12px 24px; font-size: 0.95rem; font-weight: 600; color: #FFFFFF; background-color: #BB86FC; border: none; border-radius: 25px; cursor: pointer; transition: all 0.3s ease; box-shadow: 0 3px 10px rgba(187, 134, 252, 0.35); }
        .navbar-cta:hover, .navbar-cta:focus-visible { background-color: #a362f7; transform: translateY(-2.5px) scale(1.02); box-shadow: 0 5px 15px rgba(187, 134, 252, 0.45); }
        .featured-artwork-section { display: flex; flex-direction: column; gap: clamp(30px, 4.5vw, 45px); padding: clamp(30px, 4.5vw, 45px); background-color: rgba(22, 20, 28, 0.7); border-radius: 24px; backdrop-filter: blur(20px) saturate(170%); border: 1px solid rgba(255, 255, 255, 0.13); box-shadow: 0 18px 55px rgba(0, 0, 0, 0.55); animation: fadeInFeatured 1.3s cubic-bezier(0.165, 0.84, 0.44, 1) forwards; }
        @keyframes fadeInFeatured { from { opacity: 0; transform: translateY(45px) scale(0.97); } to { opacity: 1; transform: translateY(0) scale(1); } }
        .featured-image-container { width: 100%; max-height: 75vh; position: relative; border-radius: 18px; overflow: hidden; box-shadow: 0 14px 40px rgba(0,0,0,0.4); }
        .featured-image { display: block; width: 100%; height: 100%; object-fit: cover; border-radius: 18px; animation: subtleMotion 38s infinite alternate cubic-bezier(0.42, 0, 0.58, 1); }
        .featured-image-vignette { position: absolute; top: 0; left: 0; right: 0; bottom: 0; border-radius: 18px; box-shadow: inset 0 0 100px rgba(0,0,0,0.35); pointer-events: none; }
        @keyframes subtleMotion { 0% { transform: scale(1.03) translate(0.5%, -0.5%); } 50% { transform: scale(1.12) translate(1.8%, -1.8%); } 100% { transform: scale(1.03) translate(-0.8%, 0.8%); } }
        .featured-info { text-align: center; }
        .featured-title { font-family: 'Playfair Display', serif; font-size: clamp(2.4rem, 5.5vw, 3.8rem); margin-bottom: 0.25em; color: #FFFFFF; font-weight: 700; letter-spacing: -1px; }
        .featured-artist { font-size: clamp(1.15rem, 2.3vw, 1.5rem); margin-bottom: 0.35em; color: #BB86FC; font-weight: 500; }
        .featured-details { font-size: clamp(0.9rem, 1.8vw, 1.05rem); color: #A8A8A8; margin-bottom: 1.3em; }
        .featured-description { font-size: clamp(1rem, 2vw, 1.2rem); color: #B8B8B8; line-height: 1.8; max-width: 70ch; margin: 0 auto 1.8em auto; }
        .view-details-button { padding: 14px 35px; font-size: clamp(0.95rem, 1.9vw, 1.05rem); font-weight: 600; color: #FFFFFF; background: linear-gradient(95deg, #BB86FC, #8A2BE2); border: none; border-radius: 30px; cursor: pointer; transition: all 0.3s ease; box-shadow: 0 5px 18px rgba(187, 134, 252, 0.35); }
        .view-details-button:hover, .view-details-button:focus-visible { transform: translateY(-3.5px) scale(1.04); box-shadow: 0 7px 22px rgba(187, 134, 252, 0.5); background: linear-gradient(95deg, #a362f7, #7A1FB5); }
        @media (min-width: 992px) { .featured-artwork-section { flex-direction: row; align-items: center; } .featured-image-container { flex: 0 0 58%; max-width: 750px; } .featured-info { flex: 1; text-align: left; padding-left: clamp(35px, 4.5vw, 55px); } .featured-description { margin: 0 0 1.8em 0; } }
        .filter-section { display: flex; justify-content: center; flex-wrap: wrap; gap: 20px; padding: 25px 0; }
        .filter-button { padding: 15px 35px; font-size: clamp(1rem, 1.7vw, 1.1rem); font-weight: 500; color: #B8B8B8; background-color: rgba(40, 38, 48, 0.8); border: 1px solid rgba(255, 255, 255, 0.12); border-radius: 35px; cursor: pointer; transition: all 0.38s cubic-bezier(0.25, 0.8, 0.25, 1); }
        .filter-button:hover, .filter-button:focus-visible { color: #FFFFFF; background-color: rgba(60, 58, 70, 0.95); transform: translateY(-4.5px) scale(1.03); box-shadow: 0 9px 20px rgba(0,0,0,0.35); border-color: rgba(187, 134, 252, 0.65); }
        .filter-button.active { color: #FFFFFF; background-image: linear-gradient(to right, #c08fff 0%, #9932CC 100%); border-color: #BB86FC; box-shadow: 0 0 28px rgba(187, 134, 252, 0.5), 0 6px 14px rgba(0,0,0,0.3); transform: translateY(-3.5px) scale(1.06); }
        .horizontal-gallery-container { width: 100%; overflow: hidden; }
        .horizontal-gallery { display: flex; gap: clamp(20px, 3.2vw, 35px); padding: 30px clamp(10px, 2vw, 25px); overflow-x: auto; overflow-y: hidden; min-height: 420px; }
        .gallery-item { flex: 0 0 auto; width: clamp(230px, 33vw, 340px); aspect-ratio: 3/4.3; background-color: #1E1C24; border-radius: 18px; overflow: hidden; cursor: pointer; transition: transform 0.48s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.48s cubic-bezier(0.25, 0.8, 0.25, 1), border 0.38s ease; position: relative; box-shadow: 0 9px 25px rgba(0,0,0,0.4); border: 2px solid transparent; animation: slideInItem 0.75s cubic-bezier(0.25, 0.8, 0.25, 1) forwards; opacity: 0; }
        @keyframes slideInItem { from { opacity: 0; transform: translateY(28px) scale(0.92); } to { opacity: 1; transform: translateY(0) scale(1); } }
        .gallery-item-image { width: 100%; height: 100%; object-fit: cover; transition: transform 0.6s cubic-bezier(0.25, 0.8, 0.25, 1); }
        .gallery-item-overlay { position: absolute; bottom: 0; left: 0; right: 0; padding: 20px; background: linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.75) 60%, transparent 100%); opacity: 0; transform: translateY(28px); transition: opacity 0.48s ease, transform 0.48s ease; display: flex; flex-direction: column; justify-content: flex-end; height: 58%; }
        .gallery-item:hover .gallery-item-overlay, .gallery-item:focus-visible .gallery-item-overlay { opacity: 1; transform: translateY(0); }
        .gallery-item:hover .gallery-item-image, .gallery-item:focus-visible .gallery-item-image { transform: scale(1.12); }
        .gallery-item:hover, .gallery-item:focus-visible { transform: translateY(-12px) scale(1.04); box-shadow: 0 20px 45px rgba(0,0,0,0.5); border-color: rgba(187, 134, 252, 0.85); }
        .gallery-item.selected { border-color: #BB86FC; box-shadow: 0 0 35px rgba(187, 134, 252, 0.6), 0 12px 28px rgba(0,0,0,0.4); transform: scale(1.06); }
        .gallery-item.selected .gallery-item-overlay { opacity: 1; transform: translateY(0); }
        .item-info h3 { font-size: clamp(1.1rem, 2.2vw, 1.3rem); font-weight: 600; color: #FFF; margin:0 0 5px 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .item-info p { font-size: clamp(0.88rem, 1.7vw, 0.98rem); color: #B0B0B0; margin:0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;}
        .no-artworks-message { width: 100%; text-align: center; padding: 50px 20px; font-size: 1.2rem; color: #999; }
        .content-section { padding: clamp(30px, 5vw, 70px) 0; opacity: 0; transform: translateY(60px); transition: opacity 0.9s cubic-bezier(0.165, 0.84, 0.44, 1), transform 0.9s cubic-bezier(0.165, 0.84, 0.44, 1); }
        .content-section.visible { opacity: 1; transform: translateY(0); }
        .curated-collections { margin-top: 0; }
        .section-title { font-family: 'Playfair Display', serif; font-size: clamp(2.2rem, 5vw, 3.2rem); color: #FFFFFF; text-align: center; margin-bottom: 0.35em; font-weight: 700; }
        .section-subtitle { font-size: clamp(1.05rem, 2.1vw, 1.25rem); color: #A8A8A8; text-align: center; max-width: 65ch; margin: 0 auto clamp(35px, 4.5vw, 55px) auto; line-height: 1.7; }
        .cta-button { display: inline-block; padding: 15px 38px; font-size: clamp(1rem, 1.9vw, 1.1rem); font-weight: 600; color: #FFFFFF; background: linear-gradient(95deg, #BB86FC, #8A2BE2); border: none; border-radius: 30px; cursor: pointer; transition: all 0.3s ease; box-shadow: 0 6px 20px rgba(187, 134, 252, 0.35); text-decoration: none; }
        .cta-button:hover, .cta-button:focus-visible { transform: translateY(-3.5px) scale(1.04); box-shadow: 0 8px 25px rgba(187, 134, 252, 0.5); background: linear-gradient(95deg, #a362f7, #7A1FB5); }
        .collections-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: clamp(25px, 3.5vw, 35px); }
        .collection-card { background-color: rgba(28, 26, 34, 0.85); border-radius: 18px; overflow: hidden; box-shadow: 0 12px 35px rgba(0,0,0,0.35); transition: transform 0.45s ease, box-shadow 0.45s ease; opacity: 0; transform: translateY(35px) scale(0.96); animation: popInCard 0.65s cubic-bezier(0.165, 0.84, 0.44, 1) forwards; }
        @keyframes popInCard { to { opacity: 1; transform: translateY(0) scale(1); } }
        .collection-card:hover { transform: translateY(-10px) scale(1.03); box-shadow: 0 18px 40px rgba(187, 134, 252, 0.25); }
        .collection-image { width: 100%; height: 240px; object-fit: cover; transition: transform 0.45s ease; }
        .collection-card:hover .collection-image { transform: scale(1.06); }
        .collection-info { padding: 25px; text-align: center; }
        .collection-info h3 { font-family: 'Playfair Display', serif; font-size: 1.5rem; margin: 0 0 18px 0; color: #EDEDED; }
        .collection-info button { padding: 12px 28px; font-size: 0.95rem; font-weight: 500; color: #BB86FC; background-color: transparent; border: 1.5px solid #BB86FC; border-radius: 25px; cursor: pointer; transition: all 0.3s ease; }
        .collection-info button:hover { background-color: #BB86FC; color: #0B0A0F; box-shadow: 0 0 15px rgba(187,134,252,0.3); }
        .journey-section { 
          position: relative;
          padding: clamp(120px, 15vw, 200px) 0;
          overflow: hidden;
          border-radius: 24px;
          margin: clamp(50px, 7vw, 100px) 0;
          isolation: isolate;
        }
        .journey-background-container {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: -1;
          overflow: hidden;
        }
        .journey-stars-bg {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-image: url('https://picsum.photos/seed/stars/1000/1000');
          background-size: cover;
          opacity: 0.3;
          filter: brightness(1.5);
        }
        .journey-parallax-bg {
          position: absolute;
          top: -20%;
          left: 0;
          width: 100%;
          height: 140%;
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          transition: transform 0.1s linear;
          will-change: transform;
          transform-style: preserve-3d;
          backface-visibility: hidden;
        }
        .journey-parallax-bg.primary-bg {
          opacity: 0.7;
          filter: brightness(0.6) saturate(1.2) contrast(1.2);
        }
        .journey-parallax-bg.secondary-bg {
          opacity: 0.3;
          filter: brightness(0.5) saturate(0.8) blur(2px);
          transform: scale(1.1);
        }
        .journey-gradient-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, rgba(10, 25, 49, 0.7), rgba(24, 90, 219, 0.5), rgba(10, 25, 49, 0.7));
          mix-blend-mode: overlay;
        }
        .journey-content {
          position: relative;
          z-index: 1;
          text-align: center;
          padding: 0 clamp(15px, 4vw, 60px);
        }
        .light-text {
          color: #FFFFFF !important;
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
        }
        .user-uploads-gallery .horizontal-gallery { overflow-x: auto; overflow-y: hidden; min-height: 420px; padding: 30px clamp(10px, 2vw, 25px); display: flex; gap: clamp(20px, 3.2vw, 35px); }
        .artist-spotlight { display: flex; flex-direction: column; align-items: center; gap: clamp(35px, 5.5vw, 55px); background-color: rgba(22, 20, 28, 0.55); border-radius: 24px; padding: clamp(35px, 5.5vw, 65px); border: 1px solid rgba(255,255,255,0.09); }
        .artist-image-container { width: clamp(220px, 42vw, 320px); height: clamp(220px, 42vw, 320px); border-radius: 50%; overflow: hidden; box-shadow: 0 0 0 12px rgba(187, 134, 252, 0.12), 0 12px 35px rgba(0,0,0,0.35); transition: transform 0.4s ease; }
        .artist-image-container:hover { transform: scale(1.03); }
        .artist-image { width: 100%; height: 100%; object-fit: cover; }
        .artist-info { text-align: center; }
        .artist-info .section-title { font-size: clamp(2rem, 4.2vw, 2.8rem); }
        .artist-info .section-subtitle { font-style: italic; color: #BB86FC; font-weight: 400; font-size: clamp(1.1rem, 2.2vw, 1.3rem); }
        .artist-info p:not(.section-subtitle) { font-size: clamp(1rem, 1.9vw, 1.15rem); color: #B8B8B8; line-height: 1.75; max-width: 65ch; margin: 0 auto 25px auto; }
        @media (min-width: 820px) { .artist-spotlight { flex-direction: row; text-align: left; } .artist-info { text-align: left; } .artist-info .section-title, .artist-info .section-subtitle, .artist-info p { margin-left: 0; margin-right: 0; } }
        .footer { background-color: #060508; color: #A8A8A8; padding: clamp(50px, 7vw, 80px) clamp(15px, 4vw, 60px); border-top: 1px solid rgba(255, 255, 255, 0.06); }
        .footer-content { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: clamp(35px, 4.5vw, 55px); margin-bottom: 45px; }
        .footer-column h4 { font-family: 'Playfair Display', serif; font-size: 1.35rem; color: #E8E8E8; margin-bottom: 18px; font-weight: 700; }
        .footer-column p { font-size: 0.95rem; line-height: 1.65; margin-bottom: 18px; }
        .footer-column ul { list-style: none; padding: 0; margin: 0; }
        .footer-column ul li { margin-bottom: 12px; }
        .footer-column ul li a { color: #A8A8A8; text-decoration: none; font-size: 0.95rem; transition: color 0.2s ease, padding-left 0.2s ease; }
        .footer-column ul li a:hover { color: #BB86FC; padding-left: 5px; }
        .social-icons { display: flex; gap: 18px; }
        .social-icons a { color: #A8A8A8; transition: color 0.2s ease, transform 0.2s ease; }
        .social-icons a:hover { color: #BB86FC; transform: translateY(-2px) scale(1.05); }
        .newsletter-form { display: flex; flex-direction: column; gap: 10px; }
        @media (min-width: 480px) { .newsletter-form { flex-direction: row; } }
        .newsletter-form input { flex-grow: 1; padding: 12px 15px; border-radius: 6px; border: 1px solid rgba(255,255,255,0.25); background-color: rgba(255,255,255,0.06); color: #E0E0E0; font-size: 0.95rem; outline: none; transition: border-color 0.2s ease, background-color 0.2s ease; }
        .newsletter-form input::placeholder { color: #888; }
        .newsletter-form input:focus { border-color: #BB86FC; background-color: rgba(187,134,252,0.05); }
        .newsletter-form button { padding: 12px 18px; background-color: #BB86FC; color: #0B0A0F; border: none; border-radius: 6px; cursor: pointer; font-weight: 600; transition: background-color 0.2s ease, transform 0.2s ease; white-space: nowrap; }
        .newsletter-form button:hover { background-color: #a362f7; transform: scale(1.02); }
        .newsletter-feedback { color: #BB86FC; font-size: 0.9rem; margin-top: 10px; text-align: left; }
        .footer-bottom { border-top: 1px solid rgba(255, 255, 255, 0.12); padding-top: 35px; text-align: center; font-size: 0.9rem; }
        .footer-bottom p { margin: 8px 0; }
        .footer-bottom a { color: #A8A8A8; text-decoration: none; transition: color 0.2s ease; }
        .footer-bottom a:hover { color: #BB86FC; text-decoration: underline; }
        
       
        .search-container { position: relative; margin: 0 10px; }
        .search-input-container { display: flex; align-items: center; background-color: rgba(40, 38, 48, 0.8); border-radius: 30px; overflow: hidden; width: 280px; transition: width 0.3s ease; }
        .search-input { background: transparent; border: none; color: #fff; padding: 10px 15px; outline: none; width: 100%; font-size: 0.95rem; }
        .search-close-btn { background: transparent; border: none; color: #888; cursor: pointer; padding: 8px 12px; font-size: 20px; }
        .search-close-btn:hover { color: #fff; }
        .search-icon-btn { background: transparent; border: none; color: #BB86FC; cursor: pointer; padding: 8px; display: flex; align-items: center; justify-content: center; }
        .search-icon-btn:hover { color: #fff; }

        .item-actions { display: flex; gap: 10px; margin-top: 10px; }
        .favorite-btn, .expand-btn { background-color: rgba(0, 0, 0, 0.6); border: none; color: white; border-radius: 50%; width: 34px; height: 34px; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.3s ease; }
        .favorite-btn:hover, .expand-btn:hover { transform: scale(1.1); background-color: rgba(187, 134, 252, 0.8); }
        .favorite-btn.favorited { color: #FF3E6C; }

        .color-filter-section { padding: 20px 0; text-align: center; }
        .color-filter-title { font-size: 1.3rem; margin-bottom: 15px; color: #EDEDED; }
        .color-palette { display: flex; justify-content: center; gap: 12px; flex-wrap: wrap; }
        .color-filter-btn { width: 36px; height: 36px; border-radius: 50%; border: 2px solid transparent; cursor: pointer; transition: all 0.3s ease; }
        .color-filter-btn:hover { transform: scale(1.15); box-shadow: 0 0 10px rgba(255, 255, 255, 0.5); }
        .color-filter-btn.active { border-color: #fff; transform: scale(1.15); box-shadow: 0 0 15px rgba(255, 255, 255, 0.7); }
        .color-filter-reset { background: linear-gradient(to right, #BB86FC, #8A2BE2); color: white; border: none; padding: 8px 14px; border-radius: 20px; margin-left: 10px; cursor: pointer; font-size: 0.9rem; }
        .color-filter-reset:hover { transform: translateY(-2px); box-shadow: 0 5px 15px rgba(187, 134, 252, 0.4); }

        .detail-modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background-color: rgba(0, 0, 0, 0.9); z-index: 2000; display: flex; align-items: center; justify-content: center; padding: 20px; animation: fadeIn 0.3s forwards; backdrop-filter: blur(5px); }
        .detail-modal-content { display: flex; flex-direction: column; background-color: #16141C; border-radius: 12px; max-width: 90vw; max-height: 90vh; width: 1200px; overflow: hidden; box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(187, 134, 252, 0.2); animation: scaleIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .detail-image-container { position: relative; height: 50vh; overflow: hidden; cursor: move; width: 100%; }
        .detail-image { width: 100%; height: 100%; object-fit: contain; transition: transform 0.1s ease-out; background-color: rgba(0, 0, 0, 0.4); }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scaleIn { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }

        .detail-close-btn { position: absolute; top: 15px; right: 20px; background: rgba(0, 0, 0, 0.5); color: white; border: none; font-size: 30px; width: 40px; height: 40px; border-radius: 50%; cursor: pointer; z-index: 3000; line-height: 1; display: flex; align-items: center; justify-content: center; }
        .detail-close-btn:hover { background: rgba(187, 134, 252, 0.8); }

        .detail-zoom-controls { position: absolute; bottom: 20px; right: 20px; background-color: rgba(0, 0, 0, 0.7); border-radius: 25px; display: flex; align-items: center; padding: 5px 12px; z-index: 5; }
        .detail-zoom-controls button { background: none; border: none; color: white; font-size: 18px; width: 30px; cursor: pointer; }
        .detail-zoom-controls button:disabled { color: #555; cursor: not-allowed; }
        .detail-zoom-controls span { color: white; margin: 0 8px; font-size: 14px; }

        .detail-info { flex: 1; padding: 30px; overflow-y: auto; height: 100%; }
        .detail-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; flex-wrap: wrap; gap: 20px; }
        .detail-title { font-family: 'Playfair Display', serif; font-size: 2.2rem; margin: 0 0 5px 0; color: #FFFFFF; }
        .detail-artist { font-size: 1.2rem; color: #BB86FC; margin: 0; }
        .detail-actions { display: flex; gap: 15px; }
        .detail-favorite-btn, .detail-share-btn { display: flex; align-items: center; gap: 8px; background-color: rgba(40, 38, 48, 0.8); border: 1px solid rgba(255, 255, 255, 0.1); color: white; padding: 10px 15px; border-radius: 25px; cursor: pointer; transition: all 0.3s ease; }
        .detail-favorite-btn:hover, .detail-share-btn:hover { background-color: rgba(60, 58, 70, 0.9); transform: translateY(-2px); }
        .detail-favorite-btn.favorited { color: #FF3E6C; border-color: rgba(255, 62, 108, 0.5); }
        .detail-favorite-btn.favorited svg { color: #FF3E6C; }

        .detail-share-container { position: relative; }
        .share-options { position: absolute; top: 100%; right: 0; margin-top: 10px; background-color: #1E1C24; border-radius: 10px; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.4); padding: 10px; width: 180px; z-index: 10; animation: fadeIn 0.2s forwards; }
        .share-options button { display: flex; align-items: center; gap: 10px; width: 100%; padding: 10px; border: none; background: transparent; color: white; text-align: left; cursor: pointer; border-radius: 5px; transition: background-color 0.2s ease; }
        .share-options button:hover { background-color: rgba(187, 134, 252, 0.2); }

        .detail-specs { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 20px; margin-bottom: 30px; }
        .detail-spec-item { font-size: 0.95rem; color: #B8B8B8; }
        .detail-spec-item span { color: #BB86FC; font-weight: 500; }

        .detail-description h3, .detail-color-palette h3, .related-artworks h3 { font-size: 1.4rem; color: #FFFFFF; margin-bottom: 15px; }
        .detail-description p { font-size: 1.05rem; line-height: 1.8; color: #B8B8B8; }
        .detail-color-palette { margin: 30px 0; }
        .palette-colors { display: flex; gap: 15px; }
        .palette-color { width: 40px; height: 40px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3); }

        .related-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 20px; }
        .related-item { border-radius: 10px; overflow: hidden; cursor: pointer; transition: transform 0.3s ease, box-shadow 0.3s ease; background-color: #1A1824; }
        .related-item:hover { transform: translateY(-5px); box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3); }
        .related-item img { width: 100%; height: 150px; object-fit: cover; }
        .related-info { padding: 12px; }
        .related-info h4 { font-size: 1rem; margin: 0 0 5px 0; color: #FFFFFF; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .related-info p { font-size: 0.9rem; color: #A8A8A8; margin: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

        .favorites-section { background-color: rgba(22, 20, 28, 0.65); border-radius: 24px; padding: clamp(50px, 7vw, 90px) clamp(30px, 5vw, 70px); margin-top: 30px; margin-bottom: 50px; border: 1px solid rgba(255, 255, 255, 0.12); box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3); position: relative; overflow: hidden; text-align: center; }
        .favorites-section::before { content: ''; position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: radial-gradient(circle at 75% 25%, rgba(187, 134, 252, 0.1) 0%, transparent 50%); pointer-events: none; }
        .favorites-section .section-title { margin-bottom: 15px; position: relative; display: inline-block; }
        .favorites-section .section-title::after { content: ''; position: absolute; bottom: -8px; left: 50%; transform: translateX(-50%); width: 80px; height: 3px; background: linear-gradient(to right, #BB86FC, transparent); border-radius: 3px; }
        .empty-favorites { display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 80px 20px; background-color: rgba(30, 28, 36, 0.5); border-radius: 16px; border: 1px solid rgba(187, 134, 252, 0.2); box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2); transition: transform 0.3s ease, box-shadow 0.3s ease; }
        .empty-favorites:hover { transform: translateY(-5px); box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3); }
        .empty-favorites-icon { color: rgba(187, 134, 252, 0.7); margin-bottom: 30px; animation: pulse 2s infinite; transform: scale(1.2); }
        .empty-favorites h3 { font-size: 1.8rem; margin: 0 0 15px 0; color: #FFFFFF; font-weight: 600; }
        .empty-favorites p { font-size: 1.2rem; color: #B8B8B8; max-width: 450px; margin: 0 auto 35px; line-height: 1.6; }
        .favorites-gallery { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 30px; justify-content: center; }
        .favorite-item { position: relative; border-radius: 12px; overflow: hidden; aspect-ratio: 3/4; cursor: pointer; box-shadow: 0 12px 25px rgba(0, 0, 0, 0.3); transition: transform 0.4s ease, box-shadow 0.4s ease; border: 2px solid transparent; }
        .favorite-item:hover { transform: translateY(-15px) scale(1.02); box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5); border-color: rgba(187, 134, 252, 0.4); }

        @media (min-width: 768px) {
          .detail-modal-content { flex-direction: row; height: 85vh; }
          .detail-image-container { width: 50%; height: auto; max-height: 85vh; }
          .detail-info { padding: 40px; width: 50%; overflow-y: auto; }
        }

        @media (max-width: 767px) {
          .search-input-container { width: 200px; }
          .detail-header { flex-direction: column; }
          .detail-modal-content { flex-direction: column; height: auto; max-height: 90vh; }
          .detail-image-container { height: 40vh; }
          .detail-info { height: 50vh; overflow-y: auto; }
        }
        
        .mobile-menu-button {
          display: none;
          flex-direction: column;
          justify-content: space-between;
          width: 30px;
          height: 21px;
          background: transparent;
          border: none;
          cursor: pointer;
          padding: 0;
          z-index: 10;
        }

        .mobile-menu-button span {
          display: block;
          width: 100%;
          height: 3px;
          background-color: #FFFFFF;
          border-radius: 3px;
          transform-origin: center;
          transition: transform 0.3s ease, opacity 0.3s ease, background-color 0.3s ease;
        }

        .mobile-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.7);
          z-index: 800;
          animation: fadeIn 0.3s forwards;
        }

        @media (max-width: 879px) {
          .mobile-menu-button {
            display: flex;
          }
          
          .navbar-links {
            position: fixed;
            top: 0;
            right: -280px;
            width: 280px;
            height: 100vh;
            background-color: #0F0E14;
            flex-direction: column;
            align-items: flex-start;
            padding: 100px 30px 30px;
            gap: 25px;
            z-index: 900;
            box-shadow: -10px 0 30px rgba(0, 0, 0, 0.4);
            transition: right 0.3s cubic-bezier(0.16, 1, 0.3, 1);
            overflow-y: auto;
          }
          
          .navbar-links.mobile-open {
            right: 0;
            display: flex;
          }
          
          .navbar-links a {
            font-size: 1.2rem !important;
            opacity: 0;
            transform: translateX(20px);
            animation: slideInNavLink 0.5s forwards;
            animation-delay: calc(0.05s * var(--index));
          }
          
          .navbar-logo {
            z-index: 910;
          }
          
          .mobile-menu-button.open span:nth-child(1) {
            transform: translateY(9px) rotate(45deg);
            background-color: #BB86FC;
          }
          
          .mobile-menu-button.open span:nth-child(2) {
            opacity: 0;
          }
          
          .mobile-menu-button.open span:nth-child(3) {
            transform: translateY(-9px) rotate(-45deg);
            background-color: #BB86FC;
          }
          
          .search-container {
            position: static;
            margin-left: auto;
          }
          
          .search-input-container {
            position: absolute;
            top: 80px;
            left: 50%;
            transform: translateX(-50%);
            width: 90%;
            max-width: 400px;
            z-index: 920;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
            animation: dropDown 0.3s forwards;
          }
        }

        @keyframes slideInNavLink {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes dropDown {
          from {
            opacity: 0;
            transform: translateX(-50%) translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }

        
        .search-container {
          position: relative;
          margin: 0 15px;
          transition: all 0.3s ease;
        }

        .search-container.search-active {
          margin: 0 25px;
        }

        .search-input-container {
          display: flex;
          align-items: center;
          background-color: rgba(40, 38, 48, 0.95);
          border-radius: 30px;
          overflow: hidden;
          width: 280px;
          border: 1px solid rgba(187, 134, 252, 0.3);
          box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
          animation: expandSearch 0.3s forwards;
        }

        .search-input {
          background: transparent;
          border: none;
          color: #fff;
          padding: 12px 18px;
          outline: none;
          width: 100%;
          font-size: 0.95rem;
        }

        .search-close-btn {
          background: transparent;
          border: none;
          color: #888;
          cursor: pointer;
          padding: 8px 12px;
          font-size: 24px;
          transition: color 0.2s ease;
        }

        .search-close-btn:hover {
          color: #BB86FC;
        }

        .search-icon-btn {
          background: transparent;
          border: none;
          color: #BB86FC;
          cursor: pointer;
          padding: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          transition: all 0.3s ease;
          animation: pulseAnimation 2s infinite;
        }

        .search-icon-btn:hover {
          color: #fff;
          background-color: rgba(187, 134, 252, 0.2);
          transform: scale(1.1);
        }

        @keyframes pulseAnimation {
          0% {
            box-shadow: 0 0 0 0 rgba(187, 134, 252, 0.4);
          }
          70% {
            box-shadow: 0 0 0 10px rgba(187, 134, 252, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(187, 134, 252, 0);
          }
        }

        @keyframes expandSearch {
          from {
            width: 60px;
            opacity: 0;
          }
          to {
            width: 280px;
            opacity: 1;
          }
        }

       
        .detail-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.9);
          z-index: 2000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          animation: fadeIn 0.3s forwards;
          backdrop-filter: blur(5px);
        }

        .detail-modal-content {
          display: flex;
          flex-direction: column;
          background-color: #16141C;
          border-radius: 12px;
          max-width: 90vw;
          max-height: 90vh;
          width: 1200px;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(187, 134, 252, 0.2);
          animation: scaleIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }

        .detail-close-btn {
          position: absolute;
          top: 15px;
          right: 20px;
          background: rgba(0, 0, 0, 0.5);
          color: white;
          border: none;
          font-size: 30px;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          cursor: pointer;
          z-index: 10;
          line-height: 1;
          transition: all 0.3s ease;
        }

        .detail-close-btn:hover {
          background: rgba(187, 134, 252, 0.8);
          transform: rotate(90deg);
        }

        
        .view-details-button {
          padding: 14px 35px;
          font-size: clamp(0.95rem, 1.9vw, 1.05rem);
          font-weight: 600;
          color: #FFFFFF;
          background: linear-gradient(95deg, #BB86FC, #8A2BE2);
          border: none;
          border-radius: 30px;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 5px 18px rgba(187, 134, 252, 0.35);
          position: relative;
          overflow: hidden;
        }

        .view-details-button:hover, .view-details-button:focus-visible {
          transform: translateY(-3.5px) scale(1.04);
          box-shadow: 0 7px 22px rgba(187, 134, 252, 0.5);
          background: linear-gradient(95deg, #a362f7, #7A1FB5);
        }

        .view-details-button::after {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 5px;
          height: 5px;
          background: rgba(255, 255, 255, 0.5);
          opacity: 0;
          border-radius: 100%;
          transform: scale(1, 1) translate(-50%);
          transform-origin: 50% 50%;
        }

        .view-details-button:hover::after {
          animation: ripple 1s ease-out;
        }

        @keyframes ripple {
          0% {
            transform: scale(0, 0);
            opacity: 0.5;
          }
          20% {
            transform: scale(25, 25);
            opacity: 0.3;
          }
          100% {
            opacity: 0;
            transform: scale(40, 40);
          }
        }
       
        .art-journey-bridge {
          position: relative;
          width: 100%;
          height: 65vh; 
          min-height: 500px;
          overflow: hidden;
          margin: 60px 0 20px;
          background: linear-gradient(125deg, #0a0a12 0%, #191927 50%, #0a0a12 100%);
          border-radius: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          perspective: 1000px;
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.4);
          border: 1px solid rgba(187, 134, 252, 0.15);
        }

        .bridge-content {
          position: relative;
          z-index: 1;
          text-align: center;
          padding: 40px 30px;
          max-width: 700px;
          transform: translateZ(20px);
          background-color: rgba(10, 10, 15, 0.6);
          backdrop-filter: blur(5px);
          border-radius: 16px;
          border: 1px solid rgba(187, 134, 252, 0.2);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        }

        .bridge-content h2 {
          font-family: 'Playfair Display', serif;
          font-size: clamp(2.4rem, 5vw, 3.2rem);
          margin-bottom: 25px;
          background: linear-gradient(to right, #BB86FC, #61DAFB, #BB86FC);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          filter: drop-shadow(0 2px 10px rgba(187, 134, 252, 0.5));
          opacity: 0;
          transform: translateY(20px);
          animation: fadeInUp 0.8s ease forwards;
          animation-delay: 0.2s;
        }

      
        .favorites-section {
          background-color: rgba(22, 20, 28, 0.65); 
          border-radius: 24px;
          padding: clamp(50px, 7vw, 90px) clamp(30px, 5vw, 70px); 
          margin-top: 30px; 
          margin-bottom: 50px;
          border: 1px solid rgba(255, 255, 255, 0.12);
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
          position: relative;
          overflow: hidden;
        }

        .favorites-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: radial-gradient(circle at 75% 25%, rgba(187, 134, 252, 0.1) 0%, transparent 50%);
          pointer-events: none;
        }

        .favorites-section .section-title {
          margin-bottom: 15px;
          position: relative;
          display: inline-block;
        }

        .favorites-section .section-title::after {
          content: '';
          position: absolute;
          bottom: -8px;
          left: 50%;
          transform: translateX(-50%);
          width: 80px;
          height: 3px;
          background: linear-gradient(to right, #BB86FC, transparent);
          border-radius: 3px;
        }

        .empty-favorites {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 80px 20px; 
          background-color: rgba(30, 28, 36, 0.5);
          border-radius: 16px;
          border: 1px solid rgba(187, 134, 252, 0.2);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .empty-favorites:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3);
        }

        .empty-favorites-icon {
          color: rgba(187, 134, 252, 0.7); 
          margin-bottom: 30px;
          animation: pulse 2s infinite;
          transform: scale(1.2); 
        }

        .empty-favorites h3 {
          font-size: 1.8rem; 
          margin: 0 0 15px 0;
          color: #FFFFFF;
          font-weight: 600;
        }

        .empty-favorites p {
          font-size: 1.2rem;
          color: #B8B8B8;
          max-width: 450px;
          margin: 0 auto 35px;
          line-height: 1.6;
        }

        .favorites-gallery {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 30px; 
          justify-content: center;
        }

        .favorite-item {
          position: relative;
          border-radius: 12px;
          overflow: hidden;
          aspect-ratio: 3/4;
          cursor: pointer;
          box-shadow: 0 12px 25px rgba(0, 0, 0, 0.3);
          transition: transform 0.4s ease, box-shadow 0.4s ease;
          border: 2px solid transparent;
        }

        .favorite-item:hover {
          transform: translateY(-15px) scale(1.02);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
          border-color: rgba(187, 134, 252, 0.4);
        }
       
        .favorite-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 20px;
          background: linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.7) 60%, transparent 100%);
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.4s ease, transform 0.4s ease;
          height: 50%;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
        }
        
        .favorite-item:hover .favorite-overlay {
          opacity: 1;
          transform: translateY(0);
        }
        
        .favorite-overlay h3 {
          font-size: 1.1rem;
          font-weight: 600;
          color: #FFF;
          margin: 0 0 5px 0;
        }
        
        .favorite-overlay p {
          font-size: 0.9rem;
          color: #B0B0B0;
          margin: 0 0 10px 0;
        }
        
        .remove-favorite-btn {
          padding: 8px 16px;
          background-color: rgba(255, 62, 108, 0.7);
          border: none;
          border-radius: 20px;
          color: white;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.3s ease;
          align-self: flex-start;
        }
        
        .remove-favorite-btn:hover {
          background-color: rgba(255, 62, 108, 1);
          transform: translateY(-2px);
        }
        .bridge-canvas {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
          z-index: 0;
        }
        
        .floating-frame {
          position: absolute;
          background-color: rgba(187, 134, 252, 0.15);
          border: 1px solid rgba(187, 134, 252, 0.3);
          border-radius: 12px;
          transform-style: preserve-3d;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
          animation: float 12s infinite ease-in-out;
        }
        
        .frame-1 {
          width: 180px;
          height: 240px;
          top: 20%;
          left: 15%;
          animation-delay: 0s;
        }
        
        .frame-2 {
          width: 220px;
          height: 160px;
          bottom: 25%;
          right: 15%;
          animation-delay: -2s;
        }
        
        .frame-3 {
          width: 150px;
          height: 200px;
          top: 10%;
          right: 25%;
          animation-delay: -4s;
        }
        
        .bridge-particles {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-image: radial-gradient(circle at center, rgba(187, 134, 252, 0.1) 0%, transparent 70%);
          opacity: 0.7;
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0) rotate(0deg) translateZ(20px);
          }
          25% {
            transform: translateY(-15px) rotate(2deg) translateZ(30px);
          }
          50% {
            transform: translateY(5px) rotate(-1deg) translateZ(40px);
          }
          75% {
            transform: translateY(-8px) rotate(1deg) translateZ(25px);
          }
        }
        
       
        .bridge-content {
          z-index: 2;
          position: relative;
        }
      `}</style>
    </>
  );
};

export default ArtGalleryPage;
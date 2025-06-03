"use client";
import React, { useState, useEffect } from 'react';
import { AlertCircle, Sun, Moon, Menu, X, ChevronRight, Calendar, Tag, MapPin, Search, Instagram, Twitter, Facebook, Youtube, ArrowRight } from 'lucide-react';


const TravelBlog = () => {
  const [currentView, setCurrentView] = useState('home');
  const [currentPostId, setCurrentPostId] = useState<number | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('');
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [currentBrowseView, setCurrentBrowseView] = useState('destinations');
  const [isThemeChanging, setIsThemeChanging] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [emailInput, setEmailInput] = useState('');

 
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedDarkMode);
    if (savedDarkMode) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  }, []);


  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setIsThemeChanging(true); 

    
    setTimeout(() => {
      if (newMode) {
        document.body.classList.add('dark-theme');
      } else {
        document.body.classList.remove('dark-theme');
      }
      localStorage.setItem('darkMode', String(newMode));
      setDarkMode(newMode);

     
      setTimeout(() => {
        setIsThemeChanging(false);
      }, 50);
    }, 300); 
  };
  
  const showToastMessage = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleNewsletterSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubscribed(true);
    setEmailInput('');
    setTimeout(() => setIsSubscribed(false), 3000);
  };

  type ViewType = 'home' | 'about' | 'post' | 'destinations' | 'blog';

  const navigateTo = (view: ViewType, postId: number | null = null) => {
    setCurrentView(view);
    setCurrentPostId(postId);
    setIsSidebarOpen(false);
    if (view === 'blog') {
      setActiveCategory('');
    } else {
      setSearchQuery('');
      setShowSearchInput(false);
    }
    window.scrollTo(0, 0);
  };

  const notImplemented = (feature: string) => showToastMessage(`${feature} will be added soon.`);

  const blogPosts = [
    {
      id: 1,
      title: 'The Enchanting Streets of Paris',
      excerpt: 'Exploring the hidden gems of Paris beyond the Eiffel Tower and Louvre...',
      content: `
<h1>The Enchanting Streets of Paris</h1>
<img src="https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1200&h=600&fit=crop" alt="Paris Streets" class="post-image" />
<h2>Beyond the Tourist Spots</h2>
<p>Paris has always been known for its iconic landmarks - the Eiffel Tower, the Louvre, Notre-Dame. But the true essence of Paris lies in its charming streets and hidden corners that most tourists never discover.</p>
<h2>Le Marais: A Cultural Haven</h2>
<p>The historic Le Marais district was my favorite discovery. With its preserved pre-revolutionary buildings and vibrant Jewish and LGBTQ+ communities, it's a place where history and modernity blend seamlessly.</p>
      `,
      date: 'March 15, 2025',
      image: 'https://plus.unsplash.com/premium_photo-1688410049290-d7394cc7d5df?w=500&auto=format&fit=crop&q=60',
      featuredImage: 'https://plus.unsplash.com/premium_photo-1661919210043-fd847a58522d?w=500&auto=format&fit=crop&q=60',
      category: 'Europe',
      location: 'Paris, France',
      author: 'Lily Adams',
      authorImage: 'https://i.pravatar.cc/40?u=LilyParis'
    },
    {
      id: 2,
      title: 'Kyoto in Cherry Blossom Season',
      excerpt: 'Experiencing the magical sakura season in Japan\'s cultural capital...',
      content: `
<h1>Kyoto in Cherry Blossom Season</h1>
<img src="https://plus.unsplash.com/premium_photo-1744865471089-01408227d295?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8S3lvdG8lMjBpbiUyMENoZXJyeSUyMEJsb3Nzb20lMjBTZWFzb258ZW58MHx8MHx8fDA%3D" alt="Kyoto Cherry Blossoms" class="post-image" />
<h2>A Timeless Experience</h2>
<p>Visiting Kyoto during cherry blossom season has been on my bucket list for years, and this spring I finally made it happen. The experience exceeded every expectation, transforming the already beautiful city into something truly magical.</p>
      `,
      date: 'April 2, 2025',
      image: 'https://images.unsplash.com/photo-1558862107-d49ef2a04d72?w=500&auto=format&fit=crop&q=60',
      featuredImage: 'https://plus.unsplash.com/premium_photo-1661964177687-57387c2cbd14?w=500&auto=format&fit=crop&q=60',
      category: 'Asia',
      location: 'Kyoto, Japan',
      author: 'Lily Adams',
      authorImage: 'https://i.pravatar.cc/40?u=LilyKyoto'
    },
     {
      id: 3,
      title: 'Trekking Through Patagonia',
      excerpt: 'Adventures in one of Earth\'s last true wilderness frontiers...',
      content: `
<h1>Trekking Through Patagonia</h1>
<img src="https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?w=1200&h=600&fit=crop" alt="Patagonia Mountains" class="post-image" />
<h2>The Edge of the World</h2>
<p>There are few places left on Earth that make you feel like you've reached the end of the world. Patagonia is one of them. Spanning Chile and Argentina at the southern tip of South America, this region captivated me with its raw, untamed landscapes and ever-changing weather.</p>
      `,
      date: 'February 20, 2025',
      image: 'https://plus.unsplash.com/premium_photo-1697729940854-0f73aadaff88?w=500&auto=format&fit=crop&q=60',
      featuredImage: 'https://images.unsplash.com/photo-1478827387698-1527781a4887?w=500&auto=format&fit=crop&q=60',
      category: 'South America',
      location: 'Torres del Paine, Chile',
      author: 'Lily Adams',
      authorImage: 'https://i.pravatar.cc/40?u=LilyPatagonia'
    },
    {
      id: 7, 
      title: 'Where to Travel in 2025 Based on Your Zodiac Sign',
      excerpt: 'Let the stars guide your next adventure with these cosmic travel recommendations...',
      content: `
<h1>Where to Travel in 2025 Based on Your Zodiac Sign</h1>
<img src="https://plus.unsplash.com/premium_photo-1700763472780-1174dae06186?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8em9kaWFjJTIwdHJhdmVsfGVufDB8fDB8fHww" alt="Zodiac Travel" class="post-image" />
<p>Ready for your next adventure? The stars know exactly where you should go! Here's my cosmic guide to the perfect 2025 destinations for each zodiac sign.</p>
<h2>Aries (March 21 - April 19): Iceland</h2>
<p>For the bold and adventurous Aries, Iceland offers the perfect playground.</p>
      `,
      date: 'January 5, 2025',
      image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=500&auto=format&fit=crop&q=60',
      featuredImage: 'https://images.unsplash.com/photo-1746310783422-16df7622e7c9?w=500&auto=format&fit=crop&q=60',
      category: 'Travel Tips',
      location: 'Global',
      author: 'Lily Adams',
      authorImage: 'https://i.pravatar.cc/40?u=LilyZodiac',
      featured: true
    },
  ];

  const continentData = [
    { name: 'Africa', image: 'https://plus.unsplash.com/premium_photo-1661936361131-c421746dcd0d?w=500&q=60', countries: ['Tanzania', 'Morocco', 'Egypt'] },
    { name: 'Asia', image: 'https://images.unsplash.com/photo-1574236170878-f66e35f83207?w=500&q=60', countries: ['Japan', 'Thailand', 'India'] },
    { name: 'Europe', image: 'https://images.unsplash.com/photo-1491557345352-5929e343eb89?w=500&q=60', countries: ['France', 'Italy', 'Spain'] },
    { name: 'North America', image: 'https://images.unsplash.com/photo-1603015245012-68988952fc73?w=500&q=60', countries: ['USA', 'Canada', 'Mexico'] },
    { name: 'Oceania', image: 'https://images.unsplash.com/photo-1656177303261-bb9dfbdd37ae?w=500&q=60', countries: ['Australia', 'New Zealand'] },
    { name: 'South America', image: 'https://images.unsplash.com/photo-1619546952812-520e98064a52?w=500&q=60', countries: ['Chile', 'Peru', 'Brazil'] },
  ];

  const popularDestinations = [
    { name: 'Greece', image: 'https://plus.unsplash.com/premium_photo-1661964068107-6d7f6f4fea51?w=500&q=60' },
    { name: 'Italy', image: 'https://images.unsplash.com/photo-1499678329028-101435549a4e?w=500&q=60' },
    { name: 'Bali', image: 'https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=500&q=60' },
  ];

  const travelTypes = [
    { name: 'Solo Travel' }, { name: 'Budget Travel' }, { name: 'Luxury Travel' },
    { name: 'Adventure' }, { name: 'Family' }, { name: 'Cultural' },

  ];

  const categories = Array.from(new Set(blogPosts.map(post => post.category)));
  const recentPostsAll = [...blogPosts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = !searchQuery || 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !activeCategory || post.category === activeCategory;
    return matchesSearch && matchesCategory;
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const featuredPost = blogPosts.find(post => post.featured) || blogPosts[0] || null;

  const navItems = [
    { label: 'Home', action: () => navigateTo('home') },
    { label: 'About', action: () => navigateTo('about') },
    { label: 'Blog', action: () => navigateTo('blog') },
    { label: 'Destinations', action: () => { setCurrentBrowseView('destinations'); navigateTo('destinations'); } },
  ];


  const renderHome = () => {
    if (!featuredPost) return <div className="text-center py-10">No featured post available.</div>;
    return (
    <div className="w-full page-content">
      <section className="hero-section">
        <div className="hero-image-container">
          <img src={featuredPost.featuredImage} alt={featuredPost.title} className="hero-image" />
          <div className="featured-badge">FEATURED POST</div>
        </div>
        <div className="hero-content">
          <h1 className="hero-title">{featuredPost.title}</h1>
          <p className="hero-excerpt">{featuredPost.excerpt}</p>
          <div className="post-meta hero-meta">
            <span><Calendar size={16} /> {featuredPost.date}</span>
            <span><Tag size={16} /> {featuredPost.category}</span>
            <span><MapPin size={16} /> {featuredPost.location}</span>
          </div>
          <button onClick={() => navigateTo('post', featuredPost.id)} className="button button-primary">
            VIEW POST <ArrowRight size={16} className="ml-2" />
          </button>
        </div>
      </section>

      <section className="travel-types-section">
        <h2 className="section-subtitle text-center">I'm looking for...</h2>
        <div className="travel-types-grid">
          {travelTypes.map(type => (
            <button key={type.name} onClick={() => { setActiveCategory(type.name); navigateTo('blog'); }} className="travel-type-button">
              {type.name}
            </button>
          ))}
        </div>
      </section>

      <section className="latest-posts-section">
        <div className="text-center">
          <h3 className="section-title-italic">Recent</h3>
          <h2 className="section-title-caps">Posts</h2>
        </div>
        <div className="post-grid">
          {recentPostsAll.slice(0, 3).map(post => (
            <div key={post.id} className="card post-card" onClick={() => navigateTo('post', post.id)}>
              <div className="post-card-image-container">
                <img src={post.image} alt={post.title} className="post-card-image" />
                <div className="post-card-category-badge">{post.category}</div>
              </div>
              <div className="post-card-content">
                <h3 className="post-card-title">{post.title}</h3>
                <div className="post-meta"><Calendar size={14} /> {post.date}</div>
                <span className="post-card-readmore">VIEW POST <ArrowRight size={14} /></span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )};

  const renderAbout = () => (
    <div className="page-content page-about">
      <div className="card about-card">
        <div className="about-image-container">
          <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&auto=format&fit=crop&q=80" alt="Author portrait" className="about-image" />
        </div>
        <div className="about-content">
          <h2 className="about-title">ABOUT LILY</h2>
          <p className="about-subtitle">The Wandering Spirit</p>
          <p className="about-text">I'm Lily, a passionate traveler sharing stories and guides from around the globe. Join me on this journey of discovery!</p>
          <p className="about-text">This blog is a collection of my adventures, tips, and insights to help you plan your own unforgettable trips.</p>
          <button onClick={() => notImplemented("About Page")} className="button button-primary">
            MORE ABOUT ME
          </button>
        </div>
      </div>
    </div>
  );

  const renderDestinations = () => (
    <div className="page-content page-destinations">
      <section className="destinations-hero">
        <img src="https://images.unsplash.com/photo-1488085061387-422e29b40080?q=80&w=1920&auto=format&fit=crop" alt="World destinations" className="destinations-hero-image" />
        <div className="destinations-hero-overlay">
          <div className="destinations-hero-content">
            <h1 className="destinations-hero-title">Discover Your Next Adventure</h1>
            <p className="destinations-hero-subtitle">From majestic mountains to pristine beaches, find inspiration.</p>
          </div>
        </div>
      </section>
      
      <section className="continent-explorer">
        <div className="section-header">
          <h2 className="section-title">Explore by Continent</h2>
          {currentBrowseView !== 'destinations' && (
            <button onClick={() => setCurrentBrowseView('destinations')} className="button-link back-button">
              <ChevronRight size={16} className="mr-1 rotate-180" /> Back
            </button>
          )}
        </div>
        
        {currentBrowseView === 'destinations' ? (
          <div className="continent-grid">
            {continentData.map(continent => (
              <div key={continent.name} onClick={() => setCurrentBrowseView(continent.name)} className="card continent-card">
                <div className="continent-card-image-container">
                  <img src={continent.image} alt={continent.name} className="continent-card-image" />
                  <div className="continent-card-overlay">
                    <h3 className="continent-card-title">{continent.name}</h3>
                  </div>
                </div>
                <div className="continent-card-countries">{continent.countries.join(', ')}...</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card continent-detail-view">
            {(() => {
              const continent = continentData.find(c => c.name === currentBrowseView);
              if (!continent) return <p>Continent not found.</p>;
              return (
                <>
                  <img src={continent.image} alt={continent.name} className="continent-detail-image" />
                  <h1 className="continent-detail-title">{continent.name}</h1>
                  <p className="continent-detail-description">Discover {continent.countries.length} unique countries in {continent.name}.</p>
                  <h3 className="section-subtitle">Countries in {continent.name}</h3>
                  <div className="countries-grid">
                    {continent.countries.map(country => (
                      <button key={country} onClick={() => notImplemented(`${country} guides`)} className="country-button">
                        {country}
                      </button>
                    ))}
                  </div>
                  <h3 className="section-subtitle">Travel Guides for {continent.name}</h3>
                  <div className="post-grid">
                    {blogPosts.filter(p => p.category === continent.name).slice(0,3).map(post => (
                       <div key={post.id} onClick={() => navigateTo('post', post.id)} className="card post-card-condensed">
                         <img src={post.image} alt={post.title} className="post-card-condensed-image"/>
                         <div className="post-card-condensed-content">
                           <h4 className="post-card-condensed-title">{post.title}</h4>
                           <p className="post-meta text-xs">{post.date}</p>
                         </div>
                       </div>
                    ))}
                    {blogPosts.filter(p => p.category === continent.name).length === 0 && <p className="no-results-text">No guides for {continent.name} yet.</p>}
                  </div>
                </>
              );
            })()}
          </div>
        )}
      </section>
    </div>
  );

  const renderBlog = () => (
    <div className="page-content page-blog">
      <section className="blog-hero">
        <img src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1920&auto=format&fit=crop" alt="Travel blogging" className="blog-hero-image" />
        <div className="blog-hero-overlay">
          <div className="blog-hero-content">
            <h1 className="blog-hero-title">Travel Stories & Inspiration</h1>
            <p className="blog-hero-subtitle">Guides, tips, and adventures to fuel your wanderlust.</p>
            <div className="search-bar-container">
              <input type="text" placeholder="Search articles..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="search-input" />
              <Search className="search-icon" size={20} />
            </div>
          </div>
        </div>
      </section>

      <nav className="category-filter">
        <button onClick={() => setActiveCategory('')} className={`category-button ${!activeCategory ? 'active' : ''}`}>All</button>
        {categories.map(cat => (
          <button key={cat} onClick={() => setActiveCategory(cat)} className={`category-button ${activeCategory === cat ? 'active' : ''}`}>{cat}</button>
        ))}
      </nav>

      <section className="blog-grid-section">
        <div className="post-grid">
          {filteredPosts.length > 0 ? filteredPosts.map(post => (
            <div key={post.id} className="card post-card" onClick={() => navigateTo('post', post.id)}>
              <div className="post-card-image-container">
                <img src={post.image} alt={post.title} className="post-card-image" />
                <div className="post-card-category-badge">{post.category}</div>
              </div>
              <div className="post-card-content">
                <h3 className="post-card-title">{post.title}</h3>
                <div className="post-meta-multiple">
                  <span><Calendar size={12}/> {post.date}</span>
                  <span><MapPin size={12}/> {post.location}</span>
                </div>
                <p className="post-card-excerpt">{post.excerpt}</p>
                <span className="post-card-readmore">READ MORE <ArrowRight size={16} /></span>
              </div>
            </div>
          )) : (
            <p className="no-results-text col-span-full">No articles found.</p>
          )}
        </div>
      </section>
      
      <section className="newsletter-section card">
        <h2 className="section-title text-center">Join Our Community</h2>
        <p className="text-center mb-6">Get travel inspiration and tips straight to your inbox.</p>
        <form onSubmit={handleNewsletterSubscribe} className="newsletter-form">
          <input 
            type="email" 
            placeholder="Your email address" 
            required 
            className="form-input flex-grow"
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
          />
          <button type="submit" className="button button-primary">
            {isSubscribed ? 'Subscribed!' : 'Subscribe'}
          </button>
        </form>
      </section>
    </div>
  );

  const renderPost = () => {
    const post = blogPosts.find(p => p.id === currentPostId);
    if (!post) return <div className="text-center py-10">Post not found.</div>;
    
    return (
      <article className="card post-full-content">
        <button 
          onClick={() => navigateTo('blog')} 
          className="back-button-post"
          aria-label="Back to blog"
        >
          <ChevronRight size={20} className="back-icon" />
          <span>Back to Blog</span>
        </button>
        
        <img src={post.featuredImage} alt={post.title} className="post-full-image" />
        <h1 className="post-full-title">{post.title}</h1>
        <div className="post-full-meta">
          <img src={post.authorImage} alt={post.author} className="author-image" />
          <div>
            <p className="author-name">{post.author}</p>
            <p className="post-date">{post.date}</p>
          </div>
        </div>
        <div className="prose-content" dangerouslySetInnerHTML={{ __html: post.content }} />
        
        <div className="related-posts-section">
          <h3 className="section-subtitle">You might also like</h3>
          <div className="post-grid related-posts-grid">
            {recentPostsAll.filter(p => p.id !== currentPostId).slice(0, 2).map(relatedPost => (
              <div key={relatedPost.id} onClick={() => navigateTo('post', relatedPost.id)} className="card post-card-condensed">
                <img src={relatedPost.image} alt={relatedPost.title} className="post-card-condensed-image"/>
                <div className="post-card-condensed-content">
                  <h4 className="post-card-condensed-title">{relatedPost.title}</h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      </article>
    );
  };

  return (
    <div className={`app-wrapper ${darkMode ? 'dark-theme-active' : ''}`}>
      <div className={`theme-transition-overlay ${isThemeChanging ? 'active' : ''}`}></div>
      
      <header className="main-header">
        <div className="container header-container">
          <div className="header-left">
            <button onClick={() => setIsSidebarOpen(true)} className="icon-button mobile-menu-button" aria-label="Open menu"><Menu size={24} /></button>
            <h1 onClick={() => navigateTo('home')} className="site-title">Wanderlust</h1>
          </div>
          <nav className="main-nav">
            {navItems.map(item => (
              <div key={item.label} className="nav-item-wrapper">
                <button onClick={item.action} className="nav-link">
                  {item.label}
                </button>
              </div>
            ))}
          </nav>
          <div className="header-right">
            {currentView === 'blog' && (
              <button onClick={() => setShowSearchInput(!showSearchInput)} className="icon-button" aria-label="Toggle search"><Search size={20} /></button>
            )}
            <button onClick={toggleDarkMode} className="icon-button" aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}>{darkMode ? <Sun size={20} /> : <Moon size={20} />}</button>
          </div>
        </div>
        {showSearchInput && currentView === 'blog' && (
          <div className="search-bar-fullwidth"><input type="text" placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="search-input-fullwidth" /></div>
        )}
      </header>
      
      <div className={`mobile-sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="mobile-sidebar-overlay" onClick={() => setIsSidebarOpen(false)}></div>
        <div className="mobile-sidebar-content">
          <div className="mobile-sidebar-header">
            <h2 className="mobile-sidebar-title">Menu</h2>
            <button onClick={() => setIsSidebarOpen(false)} className="icon-button" aria-label="Close menu"><X size={24} /></button>
          </div>
          <nav className="mobile-sidebar-nav">
            <ul>
              {navItems.map(item => (
                <li key={item.label}>
                  <button onClick={() => { if(item.action) item.action(); setIsSidebarOpen(false); }} className="mobile-nav-link">
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
      
      <main className="main-content container">
        {currentView === 'home' && renderHome()}
        {currentView === 'about' && renderAbout()}
        {currentView === 'blog' && renderBlog()}
        {currentView === 'destinations' && renderDestinations()}
        {currentView === 'post' && renderPost()}
      </main>
      
      <footer className="main-footer">
        <div className="container footer-container">
          <div className="footer-column">
            <h3 className="footer-heading">Wanderlust</h3>
            <p className="footer-text">Explore the world with us.</p>
            <div className="social-icons">
               {[Instagram, Facebook, Twitter, Youtube].map((Icon, idx) => (
                <button key={idx} onClick={() => notImplemented("Social Media")} className="social-icon-button"><Icon size={20} /></button>
              ))}
            </div>
          </div>
          <div className="footer-column">
            <h3 className="footer-heading">Explore</h3>
            <ul className="footer-links">
              {['Home', 'About', 'Blog', 'Destinations'].map(label => (
                <li key={label}><button onClick={() => navigateTo(label.toLowerCase() as ViewType)} className="footer-link">{label}</button></li>
              ))}
            </ul>
          </div>
          <div className="footer-column">
            <h3 className="footer-heading">Categories</h3>
            <ul className="footer-links">
              {categories.slice(0, 4).map(cat => (
                <li key={cat}><button onClick={() => { setActiveCategory(cat); navigateTo('blog'); }} className="footer-link">{cat}</button></li>
              ))}
            </ul>
          </div>
          <div className="footer-column">
            <h3 className="footer-heading">Newsletter</h3>
            <form onSubmit={handleNewsletterSubscribe} className="newsletter-form">
              <input 
                type="email" 
                placeholder="Your email address" 
                required 
                className="form-input flex-grow"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
              />
              <button type="submit" className="button button-primary">
                {isSubscribed ? 'Subscribed!' : 'Subscribe'}
              </button>
            </form>
          </div>
        </div>
        <div className="footer-bottom-text">© {new Date().getFullYear()} Wanderlust. All rights reserved.</div>
      </footer>
      
      {showToast && (
        <div className="toast-notification">
          <AlertCircle size={22} className="toast-icon" />
          <div className="toast-content">
            <p className="toast-title">Heads up!</p>
            <p className="toast-message">{toastMessage}</p>
          </div>
          <button onClick={() => setShowToast(false)} className="toast-close-button"><X size={18}/></button>
        </div>
      )}
      
      <style jsx global>{`
        
        :root {
          --font-primary: 'Inter', sans-serif;
          --font-serif: 'Lora', serif;
          --transition-duration: 0.3s;

          
          --bg-primary: #ffffff;
          --bg-secondary: #f9fafb; 
          --bg-tertiary: #f3f4f6; 
          --bg-overlay: rgba(255, 255, 255, 0.8);

          --text-primary: #1f2937; 
          --text-secondary: #4b5563; 
          --text-muted: #6b7280; 
          --text-on-accent: #ffffff;
          --text-accent: #0d9488; 
          --text-accent-hover: #0f766e; 
          --text-inverted: #ffffff; 
          
          --border-primary: #e5e7eb; 
          --border-secondary: #d1d5db; 

          --accent-primary: #14b8a6; 
          --accent-secondary: #0d9488; 
          --accent-hover: #0f766e; 
          --accent-bg-subtle: #ccfbf1; 

          --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
          --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);

          --image-filter: none;
          --prose-text: var(--text-primary);
          --prose-headings: var(--text-primary);
          --prose-links: var(--text-accent);
          --prose-hr: var(--border-secondary);
        }

        body.dark-theme {
          
          --bg-primary: #111827; 
          --bg-secondary: #1f2937; 
          --bg-tertiary: #374151; 
          --bg-overlay: rgba(17, 24, 39, 0.8);

          --text-primary: #f3f4f6; 
          --text-secondary: #9ca3af; 
          --text-muted: #6b7280; 
          --text-on-accent: #111827; 
          --text-accent: #2dd4bf; 
          --text-accent-hover: #5eead4; 
          --text-inverted: #1f2937; 
          
          --border-primary: #374151;
          --border-secondary: #4b5563; 

          --accent-primary: #2dd4bf; 
          --accent-secondary: #5eead4;
          --accent-hover: #99f6e4;  
          --accent-bg-subtle: #0f766e; 

          --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.25);
          --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.26);
          --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.25);
          
          --image-filter: brightness(0.85) contrast(1.05);
          --prose-text: var(--text-secondary);
          --prose-headings: var(--text-primary);
          --prose-links: var(--text-accent);
          --prose-hr: var(--border-secondary);
        }

        
        body { 
          font-family: var(--font-primary); 
          background-color: var(--bg-primary);
          color: var(--text-primary);
          transition: background-color var(--transition-duration) ease, color var(--transition-duration) ease;
          margin: 0;
          -webkit-font-smoothing: antialiased; 
          -moz-osx-font-smoothing: grayscale;
        }
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Lora:ital,wght@0,400;0,500;0,600;1,400&display=swap');
        
        .app-wrapper { min-height: 100vh; display: flex; flex-direction: column; }
        .container { width: 100%; max-width: 1280px; margin-left: auto; margin-right: auto; padding-left: 1rem; padding-right: 1rem; }
        .page-content { padding-top: 2rem; padding-bottom: 2rem; }

        h1, h2, h3, h4, h5, h6 { font-family: var(--font-serif); color: var(--text-primary); margin-bottom: 1rem; }
        p { color: var(--text-secondary); line-height: 1.6; margin-bottom: 1rem; }
        a { color: var(--text-accent); text-decoration: none; transition: color var(--transition-duration) ease; }
        a:hover { color: var(--text-accent-hover); }
        img { max-width: 100%; height: auto; display: block; }
        img:not(.icon) { filter: var(--image-filter); transition: filter var(--transition-duration) ease; }
        
        .button {
          padding: 0.75rem 1.5rem;
          border-radius: 0.5rem; 
          font-weight: 500;
          text-align: center;
          cursor: pointer;
          transition: background-color var(--transition-duration) ease, color var(--transition-duration) ease, transform var(--transition-duration) ease;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border: 1px solid transparent;
          box-shadow: none;
        }
        .button:hover { transform: translateY(-1px); }
        .button-primary { background-color: var(--accent-primary); color: var(--text-on-accent); }
        .button-primary:hover { background-color: var(--accent-hover); }
        .button-secondary { background-color: var(--bg-tertiary); color: var(--text-primary); border-color: var(--border-secondary); }
        .button-secondary:hover { background-color: var(--border-primary); }
        .button-link { background: none; border: none; box-shadow: none; padding: 0; color: var(--text-accent); }
        .button-link:hover { color: var(--text-accent-hover); text-decoration: underline; transform: none; }

        .icon-button {
          background: none; border: none; padding: 0.5rem; cursor: pointer;
          color: var(--text-secondary); border-radius: 0.5rem;
          transition: color var(--transition-duration) ease, background-color var(--transition-duration) ease;
        }
        .icon-button:hover { color: var(--text-accent); background-color: var(--bg-tertiary); }

        .card {
          background-color: var(--bg-secondary);
          border: none;
          border-radius: 0.5rem; 
          padding: 1.5rem;
          box-shadow: none;
          transition: background-color var(--transition-duration) ease, transform var(--transition-duration) ease;
        }
        .card:hover { transform: translateY(-2px); background-color: var(--bg-tertiary); }

        .form-input {
          padding: 0.75rem 1rem;
          border: none;
          border-radius: 0.375rem;
          background-color: var(--bg-tertiary);
          color: var(--text-primary);
          transition: background-color var(--transition-duration) ease, box-shadow var(--transition-duration) ease;
        }
        .form-input:focus { outline: none; background-color: var(--bg-primary); box-shadow: 0 0 0 2px var(--accent-primary); }

        .section-title { font-size: 2rem; font-weight: 600; margin-bottom: 0.5rem; text-align: center; }
        .section-title-italic { font-size: 2.5rem; font-style: italic; font-weight: 300; margin-bottom: 0.25rem; color: var(--text-muted); text-align: center; }
        .section-title-caps { font-size: 1.5rem; text-transform: uppercase; letter-spacing: 0.1em; font-weight: 600; margin-bottom: 2rem; text-align: center; }
        .section-subtitle { font-size: 1.5rem; font-weight: 500; margin-bottom: 1.5rem; color: var(--text-primary); }
        .section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
        
        
        .main-header { 
          position: sticky; top: 0; z-index: 40; 
          background-color: var(--bg-overlay); backdrop-filter: blur(8px);
          border-bottom: 1px solid var(--border-primary);
          box-shadow: var(--shadow-sm);
          transition: background-color var(--transition-duration) ease, border-color var(--transition-duration) ease;
        }
        .header-container { display: flex; justify-content: space-between; align-items: center; padding-top: 0.75rem; padding-bottom: 0.75rem; }
        .header-left { display: flex; align-items: center; gap: 1rem; }
        .site-title { font-size: 1.75rem; font-weight: 600; cursor: pointer; color: var(--text-primary); transition: color var(--transition-duration) ease; margin: 0; line-height: 1; }
        .site-title:hover { color: var(--text-accent); }
        .main-nav { display: none; } 
        @media (min-width: 1024px) { .main-nav { display: flex; align-items: center; gap: 0.25rem; } }
        .nav-item-wrapper { position: relative; }
        .nav-link { 
          padding: 0.5rem 0.75rem; font-size: 0.9rem; font-weight: 500; color: var(--text-secondary); 
          border-radius: 0.375rem; display: flex; align-items: center;
          transition: color var(--transition-duration) ease, background-color var(--transition-duration) ease;
          cursor: pointer;
        }
        .nav-link:hover { color: var(--text-accent); background-color: var(--bg-tertiary); }
        .nav-dropdown-icon { margin-left: 0.25rem; transition: transform var(--transition-duration) ease; }
        .nav-item-wrapper:hover .nav-dropdown-icon { transform: rotate(90deg); }
        .nav-dropdown {
          position: absolute; left: 0; top: 100%; margin-top: 0.5rem; width: 14rem; 
          background-color: var(--bg-primary); border: 1px solid var(--border-primary);
          border-radius: 0.375rem; box-shadow: var(--shadow-lg); padding: 0.5rem;
          display: none; z-index: 50;
        }
        .nav-item-wrapper:hover .nav-dropdown { display: block; }
        .nav-dropdown-link {
          display: block; width: 100%; text-align: left;
          padding: 0.625rem 1rem; font-size: 0.875rem; color: var(--text-primary);
          border-radius: 0.25rem;
          transition: color var(--transition-duration) ease, background-color var(--transition-duration) ease;
          cursor: pointer;
        }
        .nav-dropdown-link:hover { color: var(--text-accent); background-color: var(--bg-tertiary); }
        .header-right { display: flex; align-items: center; gap: 0.75rem; }
        .mobile-menu-button { display: block; }
        @media (min-width: 1024px) { .mobile-menu-button { display: none; } }
        .search-bar-fullwidth { padding: 1rem; background-color: var(--bg-primary); }
        .search-input-fullwidth {
          width: 100%; padding: 0.75rem 1rem; border-radius: 0.375rem;
          border: 1px solid var(--border-secondary); background-color: var(--bg-secondary);
          color: var(--text-primary);
        }
        .search-input-fullwidth:focus { outline: none; border-color: var(--accent-primary); box-shadow: 0 0 0 2px var(--accent-bg-subtle); }
        
        
        .mobile-sidebar { position: fixed; inset: 0; z-index: 50; transform: translateX(-100%); transition: transform 0.3s ease-in-out; }
        .mobile-sidebar.open { transform: translateX(0); }
        .mobile-sidebar-overlay { position: fixed; inset: 0; background-color: rgba(0,0,0,0.5); backdrop-filter: blur(4px); }
        .mobile-sidebar-content { 
          position: relative; width: 18rem; /* 288px */ max-width: calc(100vw - 4rem); height: 100%; 
          background-color: var(--bg-primary); box-shadow: var(--shadow-xl);
          display: flex; flex-direction: column;
        }
        .mobile-sidebar-header { display: flex; justify-content: space-between; align-items: center; padding: 1.25rem; border-bottom: 1px solid var(--border-primary); }
        .mobile-sidebar-title { font-size: 1.25rem; font-weight: 600; color: var(--text-primary); }
        .mobile-sidebar-nav { flex-grow: 1; padding: 1.25rem; overflow-y: auto; }
        .mobile-sidebar-nav ul { list-style: none; padding: 0; margin: 0; }
        .mobile-sidebar-nav li { margin-bottom: 0.25rem; }
        .mobile-nav-link {
          display: flex; justify-content: space-between; align-items: center; width: 100%; text-align: left;
          font-size: 1.125rem; font-weight: 500; color: var(--text-primary);
          padding: 0.625rem 0.75rem; border-radius: 0.375rem;
          transition: color var(--transition-duration) ease, background-color var(--transition-duration) ease;
          cursor: pointer;
        }
        .mobile-nav-link:hover { color: var(--text-accent); background-color: var(--bg-tertiary); }
        .mobile-nav-dropdown { margin-left: 1rem; margin-top: 0.25rem; padding-left: 0.75rem; border-left: 1px solid var(--border-primary); }
        .mobile-nav-dropdown-link {
          display: block; width: 100%; text-align: left; font-size: 1rem; color: var(--text-secondary);
          padding: 0.5rem 0.5rem; border-radius: 0.375rem;
          cursor: pointer;
        }
        .mobile-nav-dropdown-link:hover { color: var(--text-accent); background-color: var(--bg-tertiary); }

        
        .main-content { flex-grow: 1; padding-top: 2rem; padding-bottom: 2rem; }
        
      
        .hero-section { display: grid; grid-template-columns: 1fr; gap: 2rem; align-items: center; margin-bottom: 4rem; }
        @media (min-width: 1024px) { .hero-section { grid-template-columns: 1fr 1fr; } .hero-image-container { order: 2; } }
        .hero-image-container { position: relative; }
        .hero-image { width: 100%; height: 24rem; lg:height: 32rem; object-fit: cover; border-radius: 0.5rem; box-shadow: var(--shadow-lg); }
        .featured-badge { 
          position: absolute; top: 1.5rem; right: 1.5rem; 
          background-color: var(--bg-primary); opacity: 0.9;
          padding: 0.5rem 1rem; border-radius: 0.375rem; box-shadow: var(--shadow-sm);
          font-size: 0.875rem; font-weight: 500; color: var(--text-accent);
        }
        .hero-title { font-size: 2.25rem; lg:font-size: 2.75rem; font-weight: 300; margin-bottom: 1rem; line-height: 1.2; }
        .hero-excerpt { font-size: 1.125rem; color: var(--text-secondary); margin-bottom: 1.5rem; }
        .post-meta { display: flex; flex-wrap: wrap; align-items: center; gap: 0.5rem 1rem; font-size: 0.875rem; color: var(--text-muted); margin-bottom: 1.5rem; }
        .post-meta span { display: flex; align-items: center; gap: 0.25rem; }
        .hero-meta { margin-bottom: 2rem; }
        
        .travel-types-section { margin-bottom: 5rem; }
        .travel-types-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 1rem; }
        .travel-type-button {
          padding: 0.75rem; border-radius: 0.5rem; text-align: center; cursor: pointer;
          background-color: var(--bg-tertiary); color: var(--text-primary);
          font-size: 0.875rem; font-weight: 500; text-transform: uppercase;
          transition: background-color var(--transition-duration) ease, color var(--transition-duration) ease, transform var(--transition-duration) ease;
          box-shadow: none;
          border: none;
        }
        .travel-type-button:hover { background-color: var(--accent-primary); color: var(--text-on-accent); transform: translateY(-1px); }
        
        .latest-posts-section { margin-bottom: 3rem; }
        .post-grid { display: grid; grid-template-columns: 1fr; gap: 2rem; }
        @media (min-width: 768px) { .post-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (min-width: 1024px) { .post-grid { grid-template-columns: repeat(3, 1fr); } }
        
        .post-card { padding: 0; overflow: hidden; cursor: pointer; transition: transform var(--transition-duration) ease, background-color var(--transition-duration) ease; border: none; border-radius: 0.5rem; background-color: var(--bg-secondary); }
        .post-card:hover { transform: translateY(-3px); background-color: var(--bg-tertiary); }
        .post-card-image-container { position: relative; height: 16rem; overflow: hidden; }
        .post-card-image { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s ease; }
        .post-card:hover .post-card-image { transform: scale(1.05); }
        .post-card-category-badge {
          position: absolute; top: 1rem; left: 1rem;
          background-color: var(--bg-primary); opacity: 0.95;
          padding: 0.25rem 0.75rem; border-radius: 9999px; box-shadow: none;
          font-size: 0.75rem; text-transform: uppercase; font-weight: 500; color: var(--text-primary);
          border: none;
        }
        .post-card-content { padding: 1.5rem; }
        .post-card-title { font-size: 1.25rem; font-family: var(--font-serif); margin-bottom: 0.75rem; color: var(--text-primary); }
        .post-card:hover .post-card-title { color: var(--text-accent); }
        .post-card-excerpt { font-size: 0.9rem; color: var(--text-secondary); margin-bottom: 1rem; line-clamp: 3; -webkit-line-clamp: 3; display: -webkit-box; -webkit-box-orient: vertical; overflow: hidden; }
        .post-card-readmore { display: inline-flex; align-items: center; font-size: 0.875rem; font-weight: 500; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-accent); }
        .post-card-readmore svg { margin-left: 0.25rem; transition: transform var(--transition-duration) ease; }
        .post-card:hover .post-card-readmore svg { transform: translateX(4px); }

        
        .page-about { display: flex; justify-content: center; align-items: center; }
        .about-card { display: grid; grid-template-columns: 1fr; gap: 3rem; align-items: center; max-width: 56rem; /* 896px */ }
        @media (min-width: 1024px) { .about-card { grid-template-columns: 2fr 3fr; } }
        .about-image-container { display: flex; justify-content: center; }
        .about-image { width: 100%; max-width: 20rem; /* 320px */ border-radius: 0.5rem; box-shadow: var(--shadow-xl); aspect-ratio: 1/1; object-fit: cover; }
        .about-content { text-align: center; }
        @media (min-width: 1024px) { .about-content { text-align: left; } }
        .about-title { font-size: 2rem; text-transform: uppercase; letter-spacing: 0.1em; font-weight: 600; margin-bottom: 0.25rem; }
        .about-subtitle { font-size: 1.25rem; font-style: italic; color: var(--text-accent); margin-bottom: 1.5rem; }
        .about-text { font-size: 1.125rem; color: var(--text-secondary); margin-bottom: 1rem; line-height: 1.7; }
        
       
        .destinations-hero { position: relative; margin-bottom: 4rem; border-radius: 0.5rem; overflow: hidden; box-shadow: none; border: none; }
        .destinations-hero-image { width: 100%; height: 28rem; /* 448px */ object-fit: cover; }
        .destinations-hero-overlay { position: absolute; inset: 0; background: linear-gradient(to bottom, transparent, rgba(0,0,0,0.7)); display: flex; align-items: flex-end; }
        .destinations-hero-content { padding: 2rem; lg:padding: 3rem; max-width: 40rem; }
        .destinations-hero-title { font-size: 2.5rem; md:font-size: 3rem; font-family: var(--font-serif); font-weight: 300; color: var(--text-inverted); margin-bottom: 1rem; line-height: 1.2; }
        .destinations-hero-subtitle { font-size: 1.125rem; color: #e5e7eb; /* gray-200 fixed for overlay */ margin-bottom: 1.5rem; }
        
        .continent-explorer { margin-bottom: 3rem; }
        .back-button svg { transition: transform var(--transition-duration) ease; }
        .back-button:hover svg { transform: translateX(-3px) rotate(180deg); }
        
        .continent-grid { display: grid; grid-template-columns: 1fr; gap: 2rem; }
        @media (min-width: 768px) { .continent-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (min-width: 1024px) { .continent-grid { grid-template-columns: repeat(3, 1fr); } }
        .continent-card { padding:0; overflow:hidden; cursor:pointer; transition: transform var(--transition-duration) ease, background-color var(--transition-duration) ease; border: none; border-radius: 0.5rem; background-color: var(--bg-secondary); }
        .continent-card:hover { transform: translateY(-3px); background-color: var(--bg-tertiary); }
        .continent-card-image-container { position: relative; height: 18rem; overflow: hidden; }
        .continent-card-image { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s ease; }
        .continent-card:hover .continent-card-image { transform: scale(1.05); }
        .continent-card-overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.7), transparent); display: flex; align-items: flex-end; padding: 1.5rem; }
        .continent-card-title { font-size: 1.5rem; font-weight: 500; color: var(--text-inverted); }
        .continent-card:hover .continent-card-title { color: var(--accent-primary); } 
        .continent-card-countries { padding: 1rem; font-size: 0.875rem; color: var(--text-muted); }

        .continent-detail-view { padding: 2rem; }
        .continent-detail-image { width: 100%; height: 18rem; object-fit: cover; border-radius: 0.5rem; margin-bottom: 2rem; box-shadow: none; border: none; }
        .continent-detail-title { font-size: 2.5rem; font-family: var(--font-serif); margin-bottom: 0.5rem; }
        .continent-detail-description { font-size: 1.1rem; color: var(--text-secondary); margin-bottom: 2rem; }
        .countries-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(100px, 1fr)); gap: 1rem; margin-bottom: 2.5rem; }
        .country-button { 
          padding: 0.75rem; border-radius: 0.5rem; text-align: center; cursor: pointer;
          background-color: var(--bg-tertiary); color: var(--text-primary);
          transition: background-color var(--transition-duration) ease, color var(--transition-duration) ease, transform var(--transition-duration) ease;
          border: none;
        }
        .country-button:hover { background-color: var(--accent-primary); color: var(--text-on-accent); transform: translateY(-1px); }
        .post-card-condensed { 
          display: flex; 
          flex-direction: column; 
          overflow: hidden; 
          cursor: pointer; 
          border: none; 
          border-radius: 0.75rem; 
          transition: transform var(--transition-duration) ease, background-color var(--transition-duration) ease; 
          background-color: var(--bg-primary);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
        .post-card-condensed:hover { 
          transform: translateY(-4px); 
          background-color: var(--bg-secondary); 
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
        }
        body.dark-theme .post-card-condensed {
          background-color: var(--bg-secondary);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
        }
        body.dark-theme .post-card-condensed:hover {
          background-color: var(--bg-tertiary);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4);
        }
        .post-card-condensed-image { width:100%; height:10rem; object-fit:cover; transition: transform 0.5s ease; }
        .post-card-condensed:hover .post-card-condensed-image { transform: scale(1.05); }
        .post-card-condensed-content { padding: 1rem; }
        .post-card-condensed-title { font-size: 1rem; font-weight:500; margin-bottom:0.25rem; line-clamp: 2; -webkit-line-clamp: 2; display: -webkit-box; -webkit-box-orient: vertical; overflow: hidden; }
        .post-card-condensed:hover .post-card-condensed-title { color: var(--text-accent); }

        
        .blog-hero { position: relative; margin-bottom: 0rem; border-radius: 0.5rem; overflow: hidden; box-shadow: none; border: none; }
        .blog-hero-image { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; z-index: -1; }
        .blog-hero-overlay { background: linear-gradient(to bottom right, var(--accent-secondary) 0%, var(--accent-primary) 100%); opacity: 0.7; mix-blend-mode: multiply; position: absolute; inset:0; }
        body.dark-theme .blog-hero-overlay { background: linear-gradient(to bottom right, var(--accent-secondary) 0%, var(--accent-primary) 100%); opacity: 0.6; }
        .blog-hero-content { position: relative; z-index: 10; padding: 5rem 1rem; text-align: center; }
        .blog-hero-title { font-size: 2.5rem; md:font-size: 3.5rem; color: var(--text-inverted); margin-bottom: 1rem; line-height: 1.2; }
        .blog-hero-subtitle { font-size: 1.125rem; color: #e5e7eb; /* fixed gray-200 */ max-width: 36rem; margin: 0 auto 2rem auto; }
        .search-bar-container { position: relative; max-width: 32rem; margin: 0 auto; }
        .search-input {
          width: 100%; padding: 1rem 3rem 1rem 1.25rem; border-radius: 0.5rem; 
          background-color: var(--bg-overlay); border: none;
          color: var(--text-inverted); placeholder-color: rgba(255,255,255,0.7);
          box-shadow: none;
        }
        .search-input:focus { outline: none; box-shadow: 0 0 0 3px rgba(255,255,255,0.1); }
        .search-icon { position: absolute; right: 1.25rem; top: 50%; transform: translateY(-50%); color: rgba(255,255,255,0.7); }
        
        .category-filter { display: flex; flex-wrap: wrap; justify-content: center; gap: 0.75rem; margin-bottom: 2rem; }
        .category-button {
          padding: 0.5rem 1.25rem; border-radius: 9999px; font-size: 0.875rem; font-weight: 500;
          background-color: var(--bg-tertiary); color: var(--text-primary);
          transition: background-color var(--transition-duration) ease, color var(--transition-duration) ease, transform var(--transition-duration) ease;
          box-shadow: none;
          cursor: pointer;
          border: none;
        }
        .category-button:hover { background-color: var(--border-primary); transform: translateY(-1px); }
        .category-button.active { background-color: var(--accent-primary); color: var(--text-on-accent); }
        .category-button.active:hover { background-color: var(--accent-hover); }

        .main-footer { 
          background-color: var(--bg-secondary); border-top: 1px solid var(--border-primary);
          padding-top: 3rem; padding-bottom: 3rem;
          transition: background-color var(--transition-duration) ease, border-color var(--transition-duration) ease;
        }
        .footer-container { display: grid; grid-template-columns: 1fr; gap: 2.5rem; }
        @media (min-width: 768px) { .footer-container { grid-template-columns: repeat(2, 1fr); } }
        @media (min-width: 1024px) { .footer-container { grid-template-columns: repeat(4, 1fr); } }
        .footer-column {}
        .footer-heading { font-size: 1.125rem; font-weight: 500; margin-bottom: 1rem; color: var(--text-primary); }
        .footer-text { font-size: 0.875rem; color: var(--text-secondary); margin-bottom: 1rem; line-height: 1.6; }
        .social-icons { display: flex; gap: 1rem; }
        .social-icon-button { color: var(--text-muted); cursor: pointer; }
        .social-icon-button:hover { color: var(--text-accent); }
        .footer-links { list-style: none; padding: 0; margin: 0; space-y: 0.625rem; }
        .footer-link { font-size: 0.875rem; color: var(--text-secondary); cursor: pointer; }
        .footer-link:hover { color: var(--text-accent); }
        .footer-bottom-text { margin-top: 3rem; padding-top: 2rem; border-top: 1px solid var(--border-primary); text-align: center; font-size: 0.875rem; color: var(--text-muted); }

       
        .toast-notification {
          position: fixed; 
          bottom: 1.5rem; 
          right: 1.5rem;
          background-color: rgba(255, 255, 255, 0.95); 
          border: 1px solid var(--border-primary);
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04), 0 0 0 1px rgba(0, 0, 0, 0.05);
          border-radius: 0.75rem; 
          padding: 0.875rem 1.25rem;
          display: flex; align-items: center; 
          max-width: 20rem; min-width: 18rem;
          z-index: 60; 
          animation: toastSlideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
        }
        
        @media (max-width: 640px) {
          .toast-notification {
            bottom: 1rem; right: 1rem; left: 1rem;
            max-width: none; min-width: 0;
            padding: 0.75rem 1rem;
          }
        }
        
        @keyframes toastSlideIn { 
          from { 
            opacity: 0; 
            transform: translateY(0.75rem) translateX(0.5rem) scale(0.96); 
          } 
          to { 
            opacity: 1; 
            transform: translateY(0) translateX(0) scale(1); 
          } 
        }
        
        body.dark-theme .toast-notification {
          background-color: rgba(31, 41, 55, 0.95);
          border-color: var(--border-secondary);
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.4), 0 10px 10px -5px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.05);
        }
        
        .toast-icon { 
          color: #f59e0b; 
          margin-right: 0.875rem; 
          flex-shrink: 0; 
        }
        body.dark-theme .toast-icon { color: #fbbf24; }
        
        .toast-content { flex-grow: 1; }
        .toast-title { 
          font-weight: 600; 
          color: var(--text-primary); 
          font-size: 0.875rem;
          margin-bottom: 0.125rem;
          line-height: 1.3;
        }
        .toast-message { 
          font-size: 0.8rem; 
          color: var(--text-secondary); 
          line-height: 1.3;
        }
        .toast-close-button { 
          margin-left: 0.875rem; 
          margin-right: -0.125rem; 
          padding: 0.375rem; 
          color: var(--text-muted); 
          border-radius: 0.375rem; 
          cursor: pointer; 
          transition: all 0.15s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .toast-close-button:hover { 
          color: var(--text-primary); 
          background-color: var(--bg-tertiary); 
          transform: scale(1.05);
        }

     
        .theme-transition-overlay {
          position: fixed; inset: 0;
          background-color: var(--bg-primary); 
          z-index: 9999;
          opacity: 0;
          pointer-events: none;
          transition: opacity var(--transition-duration) ease-in-out;
        }
        .theme-transition-overlay.active {
          opacity: 1;
        }

        .blog-grid-section { margin-bottom: 4rem; }
        .post-meta-multiple { display: flex; flex-wrap: wrap; gap: 0.25rem 0.75rem; font-size: 0.75rem; color: var(--text-muted); margin-bottom: 0.75rem; }
        .post-meta-multiple span { display: flex; align-items: center; gap: 0.25rem; }
        
        .newsletter-section { padding: 2.5rem; text-align: center; }
        .newsletter-form { display: flex; flex-direction: column; gap: 0.75rem; max-width: 28rem; margin: 0 auto; }
        @media (min-width: 640px) { .newsletter-form { flex-direction: row; } }
        .no-results-text { text-align: center; padding: 2.5rem 0; color: var(--text-muted); font-size: 1.125rem; }
        .col-span-full { grid-column: 1 / -1; }

        
        .post-full-content { max-width: 64rem; margin: 0 auto; position: relative; }
        
        .back-button-post {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1rem;
          margin-bottom: 2rem;
          background-color: var(--bg-tertiary);
          color: var(--text-secondary);
          border: none;
          border-radius: 0.5rem;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: all var(--transition-duration) ease;
        }
        
        .back-button-post:hover {
          background-color: var(--accent-primary);
          color: var(--text-on-accent);
          transform: translateY(-1px);
        }
        
        .back-icon {
          transform: rotate(180deg);
          transition: transform var(--transition-duration) ease;
        }
        
        .back-button-post:hover .back-icon {
          transform: rotate(180deg) translateX(-2px);
        }
        
        .post-full-image { 
          width: 100%; 
          height: auto; 
          max-height: 40rem; 
          object-fit: cover; 
          border-radius: 0.5rem; 
          margin-bottom: 3rem; 
          box-shadow: none; 
          border: none;
        }
        
        .post-full-title { font-size: 2.25rem; md:font-size: 2.75rem; font-family: var(--font-serif); font-weight: 600; margin-bottom: 1.5rem; line-height: 1.2; }
        .post-full-meta { display: flex; align-items: center; gap: 1rem; margin-bottom: 2rem; padding-bottom: 1.5rem; border-bottom: 1px solid var(--border-primary); }
        .author-image { width: 3rem; height: 3rem; border-radius: 9999px; box-shadow: none; border: none; }
        .author-name { font-size: 0.875rem; font-weight: 500; color: var(--text-primary); }
        .post-date { font-size: 0.75rem; color: var(--text-muted); }
        
        .prose-content { 
          line-height: 1.75; 
          font-size: 1.125rem; 
          color: var(--prose-text); 
          max-width: none;
        }
        
        .prose-content h1 { 
          font-family: var(--font-serif); 
          color: var(--prose-headings); 
          font-size: 2.5rem;
          font-weight: 700;
          line-height: 1.2;
          margin-top: 3rem; 
          margin-bottom: 1.5rem;
          letter-spacing: -0.025em;
        }
        
        .prose-content h2 { 
          font-family: var(--font-serif); 
          color: var(--prose-headings); 
          font-size: 2rem;
          font-weight: 600;
          line-height: 1.3;
          margin-top: 2.5rem; 
          margin-bottom: 1.25rem;
          letter-spacing: -0.025em;
        }
        
        .prose-content h3 { 
          font-family: var(--font-serif); 
          color: var(--prose-headings); 
          font-size: 1.5rem;
          font-weight: 600;
          line-height: 1.4;
          margin-top: 2rem; 
          margin-bottom: 1rem;
          letter-spacing: -0.015em;
        }
        
        .prose-content h4 { 
          font-family: var(--font-serif); 
          color: var(--prose-headings); 
          font-size: 1.25rem;
          font-weight: 600;
          line-height: 1.5;
          margin-top: 1.75rem; 
          margin-bottom: 0.75rem;
        }
        
        .prose-content p { 
          margin-bottom: 1.5rem; 
          line-height: 1.75;
          font-size: 1.125rem;
          color: var(--prose-text);
        }
        
        .prose-content p:first-of-type {
          font-size: 1.25rem;
          color: var(--text-secondary);
          line-height: 1.7;
          margin-bottom: 2rem;
        }
        
        .prose-content a { 
          color: var(--prose-links); 
          text-decoration: underline; 
          text-decoration-thickness: 2px;
          text-underline-offset: 2px;
          transition: color 0.2s ease;
        }
        
        .prose-content a:hover {
          color: var(--text-accent-hover);
        }
        
        .prose-content hr { 
          border: none;
          border-top: 2px solid var(--prose-hr); 
          margin: 3rem 0; 
          opacity: 0.3;
        }
        
        .prose-content img.post-image { 
          border-radius: 0.5rem;  
          box-shadow: none; 
          filter: var(--image-filter);
          width: 70%;
          max-width: 600px;
          height: auto;
          display: block;
        }
        
        @media (max-width: 768px) {
          .prose-content img.post-image {
            width: 90%;
          }
        }
        
        .prose-content blockquote {
          border-left: 4px solid var(--accent-primary);
          padding-left: 1.5rem;
          margin: 2rem 0;
          font-style: italic;
          font-size: 1.2rem;
          color: var(--text-secondary);
          background-color: var(--bg-tertiary);
          padding: 1.5rem;
          border-radius: 0.5rem;
        }
        
        .prose-content ul, .prose-content ol {
          margin: 1.5rem 0;
          padding-left: 1.5rem;
        }
        
        .prose-content li {
          margin-bottom: 0.5rem;
          line-height: 1.7;
        }

        .related-posts-section { border-top: 1px solid var(--border-primary); padding-top: 2rem; margin-top: 3rem; }
        .related-posts-grid { grid-template-columns: 1fr; } 
        @media (min-width: 768px) { .related-posts-grid { grid-template-columns: repeat(2, 1fr); } }

      `}</style>
    </div>
  );
};

export default TravelBlog;
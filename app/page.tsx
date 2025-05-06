'use client'

import { useState, useEffect } from 'react'
import Head from 'next/head'
import { motion } from 'framer-motion'
import { Eye, X, ChevronDown, Search, Sliders, Heart, Share2, Instagram, Twitter, Facebook } from 'lucide-react'



interface Project {
  id: number
  title: string
    author: string
  category: string
  image: string  
             likes: number
  views: number
date: string
}


type SortOption = 'recommended' | 'recent' | 'popular'
type FilterCategory = 'all' | 'illustration' | 'branding' | 'web' | 'photography'

export default function Home() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [sortOption, setSortOption] = useState<SortOption>('recommended')
  const [filterCategory, setFilterCategory] = useState<FilterCategory>('all')
  const [showFilterMenu, setShowFilterMenu] = useState(false)
  const [showSortMenu, setShowSortMenu] = useState(false)
  const [displayedProjects, setDisplayedProjects] = useState<Project[]>([])
  const [likedProjects, setLikedProjects] = useState<number[]>([])
  const [searchQuery, setSearchQuery] = useState('');
  const [showSubscribe, setShowSubscribe] = useState(false);


  const allProjects: Project[] = [
    {
      id: 1,
      title: "PSI Microbes",
      author: "Chragi Frei",
      category: "illustration",
      image: "https://www.psi.ch/sites/default/files/styles/primer_full_xl/public/2020-09/5232_3-20_cover.jpg.webp?itok=wTctCPs6",
      likes: 119,
      views: 525,
      date: "2025-03-15"
    },
    {
      id: 2,
      title: "Taitung Art  ",
      author: "Bo-Wei Wang",
      category: "branding",
      image: "https://www.eastcoast-nsa.gov.tw/content/images/2019-static/punch-taitung-01.jpg",
      likes: 169,
      views: 2200,
      date: "2025-04-01"
    },
    {
      id: 3,
      title: "Identity Design",
      author: "Junyoup Bong",
      category: "branding",
      image: "https://5.imimg.com/data5/SELLER/Default/2021/1/MZ/HI/UI/10388100/branding-identity-design-services.jpg",
      likes: 35,
      views: 156,
      date: "2025-02-28"
    },
    {
      id: 4,
      title: "Botanical Elegance",
      author: "Maria Chen",
      category: "photography",
      image: "https://walltrend.com/cdn/shop/files/botanical-elegance-wallpaper-b919-187436.jpg?v=1728003826&width=1780",
      likes: 87,
      views: 432,
      date: "202Exhibition5-03-22"
    },
    {
      id: 5,
      title: "Tech Minimal",
      author: "James Wright",
      category: "web",
      image: "https://img.freepik.com/free-vector/flat-design-minimal-technology-landing-page_23-2149123973.jpg?semt=ais_hybrid&w=740",
      likes: 142,
      views: 893,
      date: "2025-04-10"
    },
    {
      id: 6,
      title: "Urban Perspective",
      author: "Sarah Johnson",
      category: "photography",
      image: "https://imgproxy.domestika.org/unsafe/w:1200/rs:fill/plain/src://blog-post-open-graph-covers/000/005/107/5107-original.jpg?1709920814",
      likes: 55,
      views: 310,
      date: "2025-03-05"
    },
    {
      id: 7,
      title: "Neon Dreams",
      author: "Alex Wong",
      category: "illustration",
      image: "https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/f58f0975005653.5c406bee2a803.jpg",
      likes: 203,
      views: 1240,
      date: "2025-04-15"
    },
    {
      id: 8,
      title: "Modern Architecture",
      author: "Emma Davis",
      category: "photography",
      image: "https://api.gharpedia.com/wp-content/uploads/2019/02/Heydar-Aliyev-Cultural-Centre-by-Zaha-Hadid-01-0101070001.jpg",
      likes: 78,
      views: 420,
      date: "2025-03-30"
    },
    {
      id: 9,
      title: "Digital Landscapes",
      author: "Marcus Lee",
      category: "illustration",
      image: "https://blog.icons8.com/wp-content/uploads/2020/02/digital-illustration-brian-edward-miller.jpg",
      likes: 164,
      views: 890,
      date: "2025-04-08"
    }
  ]


  useEffect(() => {
    let filtered = [...allProjects];

   
    if (filterCategory !== 'all') {
      filtered = filtered.filter(project => project.category === filterCategory);
    }


    if (searchQuery.trim() !== '') {
      filtered = filtered.filter(project =>
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.author.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }


    switch (sortOption) {
      case 'recent':
        filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        break;
      case 'popular':
        filtered.sort((a, b) => b.likes - a.likes);
        break;
      case 'recommended':
      default:
   
        filtered.sort((a, b) => {
          const popularityA = a.likes * 0.7 + a.views * 0.3;
          const popularityB = b.likes * 0.7 + b.views * 0.3;
          return popularityB - popularityA;
        });
    }

    setDisplayedProjects(filtered);
  }, [filterCategory, sortOption, searchQuery]);

  const getCategoryLabel = (category: FilterCategory): string => {
    return {
      'all': 'All Creative Fields',
      'illustration': 'Illustration',
      'branding': 'Branding',
      'web': 'Web Design',
      'photography': 'Photography'
    }[category]
  }

  const getSortLabel = (sort: SortOption): string => {
    return {
      'recommended': 'Recommended',
      'recent': 'Most Recent',
      'popular': 'Most Popular'
    }[sort]
  }


  const handleLike = (projectId: number) => {
    setDisplayedProjects((prev) =>
      prev.map((proj) => {
        if (proj.id === projectId) {
          const isLiked = likedProjects.includes(projectId)
          return { ...proj, likes: proj.likes + (isLiked ? -1 : 1) }
        }
        return proj
      })
    )
    setLikedProjects((prev) =>
      prev.includes(projectId)
        ? prev.filter((id) => id !== projectId)
        : [...prev, projectId]
    )
  }

  const handleShare = (project: Project) => {
    const shareUrl = typeof window !== "undefined"
      ? `${window.location.origin}?project=${project.id}`
      : '';
    const shareData = {
      title: project.title,
      text: `Check out this project: ${project.title} by ${project.author}`,
      url: shareUrl,
    };

    if (navigator.share) {
      navigator.share(shareData).catch(() => {});
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl);
      alert("Project link copied to clipboard!");
    } else {
      alert("Sharing is not supported on this device.");
    }
  };

  return (
    <>
      <Head>
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        <style>
          {`
            body {
              font-family: 'Plus Jakarta Sans', sans-serif;
              margin: 0;
              padding: 0;
              box-sizing: border-box;
              background: #f8fafc;
              color: #222;
              color-scheme: light; /* Force light mode */
            }
            html {
              color-scheme: light; /* Force light mode */
            }
            .glass-card {
              background: #fff; /* No transparency */
              backdrop-filter: none;
              -webkit-backdrop-filter: none;
              border: 1px solid #f1f1f1;
            }
            .glass-nav {
              background: #000 !important; /* Black background */
              color: #fff !important;      /* White text for contrast */
              border-bottom: 1px solid #000; /* Black border */
              backdrop-filter: none;
              -webkit-backdrop-filter: none;
            }
            .glass-modal {
              background: #fff; /* No transparency */
              backdrop-filter: none;
              -webkit-backdrop-filter: none;
              border: 1px solid #f1f1f1;
            }
            .newsletter-input {
              background: #fff;
              backdrop-filter: none;
              -webkit-backdrop-filter: none;
              border: 1px solid #e5e7eb;
              color: #222;
            }
          `}
        </style>
      </Head>

      <main className="min-h-screen bg-gradient-to-br from-pink-50 to-gray-100">
        <header className="glass-nav sticky  w-full border-b border-gray-300">
          <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="flex items-center w-full md:w-auto justify-between md:justify-start">
              <div className="text-3xl font-bold mr-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Bē</div>
    <nav className="hidden md:block"></nav>
            </div>
            <div className="relative w-full max-w-xl mx-0 md:mx-4 mb-3 md:mb-0">
              <input
                type="text"
                placeholder="Search the creative world at work"
                          value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full py-3 px-10 bg-white border border-gray-200 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <Search className="h-5 w-5 text-gray-400" />
        </div>
            </div>
            <div className="flex items-center w-full md:w-auto justify-end">
              <button
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full px-6 py-2.5 text-sm font-medium shadow-md hover:shadow-lg transition-shadow w-full  md:w-auto"
                onClick={() => {
                  document.getElementById('subscribe')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Stay Updated !
                     </button>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row items-start md:items-center justify-between border-b border-gray-200/60 mt-2">
          <div className="relative z-30 mb-4 md:mb-0">
            <button 
                      className="flex items-center py-2.5 px-6 bg-white/80 shadow-sm border border-gray-200/60 rounded-full text-sm"
              onClick={() => setShowFilterMenu(!showFilterMenu)}
            >
              <Sliders className="h-4 w-4 mr-2" />
              <span>Filter: {getCategoryLabel(filterCategory)}</span>
              <ChevronDown className="h-4 w-4 ml-2" />
            </button>
            
            {showFilterMenu && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute left-0 top-full mt-2 w-56 bg-white/90 backdrop-blur-md rounded-xl shadow-lg border border-gray-100 overflow-hidden"
              >
                <div className="py-1">
                  {(['all', 'illustration', 'branding', 'web', 'photography'] as FilterCategory[]).map((category) => (
                    <button
                      key={category}
                      className={`block px-4 py-2.5 text-sm w-full text-left hover:bg-gray-100/80 ${filterCategory === category ? 'text-blue-600 font-medium' : 'text-gray-700'}`}
                      onClick={() => {
                        setFilterCategory(category)
                        setShowFilterMenu(false)
                      }}
                    >
                      {getCategoryLabel(category)}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
          
          <div className="relative z-30">
            <button 
              className="flex items-center py-2.5 px-6 bg-white/80 shadow-sm border border-gray-200/60 rounded-full text-sm"
                       onClick={() => setShowSortMenu(!showSortMenu)}
            >
              <span>Sort: {getSortLabel(sortOption)}</span>
              <ChevronDown className="h-4 w-4 ml-2" />
            </button>
            
            {showSortMenu && (
                     <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-0 top-full mt-2 w-48 bg-white/90 backdrop-blur-md rounded-xl shadow-lg border border-gray-100 overflow-hidden"
              >
                <div className="py-1">
                  {(['recommended', 'recent', 'popular'] as SortOption[]).map((sort) => (
                    <button
                               key={sort}
                      className={`block px-4 py-2.5 text-sm w-full text-left hover:bg-gray-100/80 ${sortOption === sort ? 'text-blue-600 font-medium' : 'text-gray-700'}`}
                      onClick={() => {
                        setSortOption(sort)
setShowSortMenu(false)
                      }}
                    >
                      {getSortLabel(sort)}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {displayedProjects.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="text-gray-400 mb-4">
<svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15.5 14H14.71L14.43 13.73C15.41 12.59 16 11.11 16 9.5C16 5.91 13.09 3 9.5 3C5.91 3 3 5.91 3 9.5C3 13.09 5.91 16 9.5 16C11.11 16 12.59 15.41 13.73 14.43L14 14.71V15.5L19 20.49L20.49 19L15.5 14ZM9.5 14C7.01 14 5 11.99 5 9.5C5 7.01 7.01 5 9.5 5C11.99 5 14 7.01 14 9.5C14 11.99 11.99 14 9.5 14Z" fill="currentColor"/>
                </svg>
              </div>
              <h3 className="text-xl font-medium text-gray-700">No projects found</h3>
              <p className="text-gray-500 mt-2">Try changing your filter or search criteria</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {displayedProjects.map((project) => (
                <motion.div 
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="glass-card rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
                  onClick={() => setSelectedProject(project)}
                >
                  <div className="relative h-64 md:h-72 lg:h-80 w-full bg-gradient-to-br from-gray-900 to-gray-800">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="object-cover w-full h-full"
                      style={{ borderRadius: 'inherit' }}
                      onError={e => { e.currentTarget.style.display = 'none'; }}
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <div className="bg-white/20 backdrop-blur-sm rounded-full px-6 py-2.5 text-white font-medium">
                        View Project
                      </div>
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-lg leading-tight text-gray-800">{project.title}</h3>
                      <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">{project.category}</span>
                    </div>
                    <p className="text-gray-600 text-sm">{project.author}</p>
<div className="flex items-center justify-between mt-4">
                      <div className="flex items-center text-gray-500 text-sm  space-x-4">
                        <button
                          type="button"
                          onClick={e => {
                            e.stopPropagation()
                            handleLike(project.id)
     }}
                          className={`flex items-center transition-colors focus:outline-none ${likedProjects.includes(project.id) ? 'text-red-500' : 'text-gray-500 hover:text-red-500'}`}
                          aria-label={likedProjects.includes(project.id) ? "Dislike" : "Like"}
                        >
                          <motion.span
                            animate={likedProjects.includes(project.id) ? { scale: [1, 1.3, 1] } : { scale: 1 }}
                            transition={{ duration: 0.2 }}
                            className="flex"
                          >
                            <Heart fill={likedProjects.includes(project.id) ? "#ef4444" : "none"} className="h-4 w-4 mr-0.5" />
                          </motion.span>
                          <span>{project.likes.toLocaleString()}</span>
                        </button>
<div className="flex items-center">
                          < Eye className="h-9 w-5 mr-1" />
                          <span>{project.views.toLocaleString()}</span>
                        </div>
 </div>
                      <div className="text-xs text-gray-400">
                        {new Date(project.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                    </div>
           </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        <section
          id="subscribe"
          className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 mt-16"
        >
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
  <h2 className="text-3xl font-bold text-white mb-6">Stay Inspired</h2>
              <p className="text-blue-100 mb-8">Join our newsletter and get the latest creative trends, inspiration, and featured projects delivered to your inbox.</p>
              
              <div className="flex flex-col md:flex-row gap-3 justify-center">
                <input 
                  type="email"
                  placeholder="Your email address"
                  className="newsletter-input px-6 py-3 rounded-full text-white placeholder:text-blue-200 focus:outline-none focus:ring-2 focus:ring-white/30 md:w-96"
                />
                <button
 className="bg-white text-blue-600 font-medium px-8 py-3 rounded-full hover:bg-opacity-90 transition-opacity shadow-lg"
                  onClick={() => alert('Thanks for subscription')}
                >
                  Subscribe
  </button>
              </div>
  </div>
          </div>
        </section>

        <footer className="bg-gray-900 text-gray-300">
          <div className="container mx-auto px-4 py-12 flex flex-col items-center">
            <div className="flex flex-col items-center">
              <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Bē</h3>
              <p className="text-gray-400 mb-4 text-center">A platform to showcase and discover amazing creative work and talent from around the world.</p>
              <div className="flex space-x-4 mb-4">
                <a href="www.instagram.com/demo" target ="_blank"  className="text-gray-400 hover:text-white">
                  <Instagram className="h-5 w-5" />
                </a>
                <a href="www.x.com/demo" target ="_blank"  className="text-gray-400 hover:text-white">
                  <Twitter className="h-5 w-5" />
                </a>
                <a href="www.facebook.com/demo" target ="_blank" className="text-gray-400 hover:text-white">
                  <Facebook className="h-5 w-5" />
                </a>
              </div>
            </div>
            <div className="border-t border-gray-800 mt-12 pt-6 w-full flex justify-center">
              <p className="text-gray-500 text-center">© 2025 Be Creative Network. All rights reserved.</p>
 </div>
          </div>
        </footer>

        {selectedProject && (
                 <div
            className="fixed inset-0 bg-black z-50 flex items-center justify-center p-4 overflow-y-auto"
 onClick={() => setSelectedProject(null)}
          >
            <div
              className="rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto shadow-xl bg-white"
              onClick={(e) => e.stopPropagation()}
            >
              <div className=" glass-nav p-5 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">{selectedProject.title}</h2>
                <button
                  onClick={() => setSelectedProject(null)}
                  className="p-2 rounded-full hover:bg-gray-100/80 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="p-5">
                <div className="relative w-full h-96 md:h-[550px] bg-gray-100 mb-8 rounded-xl overflow-hidden flex items-center justify-center">
                  <img
                    src={selectedProject.image}
                    alt={selectedProject.title}
                    className="object-cover w-full h-full"
                    style={{ borderRadius: 'inherit' }}
                    onError={e => { e.currentTarget.style.display = 'none'; }}
                  />
                </div>

<div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 pb-8 border-b border-gray-200/60">
                  <div className="flex items-center mb-4 md:mb-0">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 mr-4 flex items-center justify-center text-white font-bold">
                      {selectedProject.author.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">{selectedProject.author}</p>
                      <p className="text-sm text-gray-500">Creative Designer • {selectedProject.category}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-6">
           <button
                      type="button"
                      onClick={() => handleLike(selectedProject.id)}
                              className={`flex items-center transition-colors   focus:outline-none ${likedProjects.includes(selectedProject.id) ? 'text-red-500' : 'text-gray-600 hover:text-red-500'}`}
                      aria-label={likedProjects.includes(selectedProject.id) ? "Dislike" : "Like"}
                    >
                      <motion.span
                        animate={likedProjects.includes(selectedProject.id) ? { scale: [1, 1.3, 1] } : { scale: 1 }}
                        transition={{ duration: 0.2 }}
                        className="flex"
                      >
                        <Heart fill={likedProjects.includes(selectedProject.id) ? "#ef4444" : "none"} className="h-5 w-5 mr-2" />
                      </motion.span>
                      <span>{selectedProject.likes.toLocaleString()}</span>
                           </button>
                    <button className="flex items-center text-gray-600 hover:text-blue-600 transition-colors">
                      <Eye className="h-5 w-5 mr-2" />
                      <span>{selectedProject.views.toLocaleString()}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleShare(selectedProject)}
                      className="flex items-center text-gray-600 hover:text-blue-600 transition-colors"
                    >
                      <Share2 className="h-5 w-5 mr-2" />
    <span>Share</span>
                    </button>
    </div>
                </div>

                <div className="prose max-w-none text-gray-700">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">About this project</h3>
                  <p>
                    This is a project description for {selectedProject.title}. The author would typically provide details 
                    about their creative process, techniques used, and the context of the project.
                  </p>
                  <p>
                    Created by {selectedProject.author}, this project showcases innovative design concepts and creative 
                    techniques. The work represents a unique perspective in the field of {selectedProject.category} design 
                    and has gathered significant attention from the creative community.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {showSubscribe && (
<div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center" onClick={() => setShowSubscribe(false)}>
            <div
              className="bg-white rounded-2xl max-w-lg w-full p-8 shadow-xl relative"
              onClick={e => e.stopPropagation()}
            >
              <button
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"
                onClick={() => setShowSubscribe(false)}
              >
                <X className="h-6 w-6" />
              </button>
              <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Stay Inspired</h2>
              <p className="text-gray-500 mb-6 text-center">
                Join our newsletter and get the latest creative trends, inspiration, and featured projects delivered to your inbox.
              </p>
              <div className="flex flex-col md:flex-row gap-3 justify-center">
 <input
                  type="email"
                  placeholder="Your email address"
                  className="newsletter-input px-6 py-3 rounded-full text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 md:w-72"
                />
                <button
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium px-8 py-3 rounded-full hover:bg-opacity-90 transition-opacity shadow-lg"
                  onClick={() => alert('Thanks for subscription')}
                >
                  Subscribe
                                 </button>
              </div>
    </div>
          </div>
        )}
      </main>
    </>
  )
}
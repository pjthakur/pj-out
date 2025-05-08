"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { Montserrat } from 'next/font/google'

// Initialize the Montserrat font
const montserrat = Montserrat({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-montserrat',
})

export default function TreeBusiness() {
  const [activeSection, setActiveSection] = useState("home")
  const [cartItems, setCartItems] = useState<
    Array<{ id: number; name: string; price: string; quantity: number; image: string }>
  >([])
  const [showCart, setShowCart] = useState(false)
  const [showNotification, setShowNotification] = useState(false)
  const [notificationMessage, setNotificationMessage] = useState("")
  const [quantityToAdd, setQuantityToAdd] = useState<{ [key: number]: number }>({})
  const [scrolled, setScrolled] = useState(false)
  const [addedButtons, setAddedButtons] = useState<{ [key: number]: boolean }>({})

  const sections = useRef<{ [key: string]: HTMLElement | null }>({
    home: null,
    about: null,
    products: null,
    reviews: null,
    contact: null,
  })

  // Add a helper function to set section refs
  const setSectionRef = (sectionName: string) => (el: HTMLElement | null) => {
    sections.current[sectionName] = el
  }

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY

      if (scrollPosition > 50) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }

      Object.entries(sections.current).forEach(([key, section]) => {
        if (!section) return

        const sectionTop = section.offsetTop
        const sectionBottom = sectionTop + section.offsetHeight

        if (scrollPosition + 100 >= sectionTop && scrollPosition + 100 < sectionBottom) {
          setActiveSection(key)
        }
      })
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToSection = (sectionId: string) => {
    const section = sections.current[sectionId]
    if (section) {
      window.scrollTo({
        top: section.offsetTop - 80,
        behavior: "smooth",
      })
    }
  }

  const initQuantity = (id: number) => {
    if (!quantityToAdd[id]) {
      setQuantityToAdd((prev) => ({ ...prev, [id]: 1 }))
    }
  }

  const incrementQuantity = (id: number) => {
    setQuantityToAdd((prev) => ({ ...prev, [id]: (prev[id] || 1) + 1 }))
  }

  const decrementQuantity = (id: number) => {
    if ((quantityToAdd[id] || 1) > 1) {
      setQuantityToAdd((prev) => ({ ...prev, [id]: prev[id] - 1 }))
    }
  }

  const addToCart = (id: number, name: string, price: string, image: string) => {
    const quantity = quantityToAdd[id] || 1

    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === id)

      if (existingItem) {
        return prevItems.map((item) => (item.id === id ? { ...item, quantity: item.quantity + quantity } : item))
      } else {
        return [...prevItems, { id, name, price, quantity, image }]
      }
    })

    // Set button to "Added" state
    setAddedButtons(prev => ({ ...prev, [id]: true }))
    
    // Reset button after 2 seconds
    setTimeout(() => {
      setAddedButtons(prev => ({ ...prev, [id]: false }))
    }, 2000)

    setQuantityToAdd((prev) => ({ ...prev, [id]: 1 }))
    showToast(`${quantity} ${name}${quantity > 1 ? "s" : ""} added to cart!`)
  }

  const removeFromCart = (id: number) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id))
  }

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0)
  }

  const getTotalPrice = () => {
    return cartItems
      .reduce((total, item) => {
        const price = Number.parseFloat(item.price.replace("$", ""))
        return total + price * item.quantity
      }, 0)
      .toFixed(2)
  }

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      showToast("Your cart is empty! Add some trees before checking out.")
      return
    }

    showToast("Thank you for your purchase! Your order has been placed.")
    setCartItems([])
    setShowCart(false)
  }

  const showToast = (message: string) => {
    setNotificationMessage(message)
    setShowNotification(true)
    setTimeout(() => setShowNotification(false), 3000)
  }

  const handleSubmitMessage = (e: React.FormEvent) => {
    e.preventDefault()
    const form = e.target as HTMLFormElement
    const nameInput = form.querySelector('input[placeholder="Your name"]') as HTMLInputElement
    const emailInput = form.querySelector('input[placeholder="Your email"]') as HTMLInputElement
    const subjectInput = form.querySelector('input[placeholder="Subject"]') as HTMLInputElement
    const messageInput = form.querySelector("textarea") as HTMLTextAreaElement

    if (!nameInput.value || !emailInput.value || !subjectInput.value || !messageInput.value) {
      showToast("Please fill in all fields to send your message")
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(emailInput.value)) {
      showToast("Please enter a valid email address")
      return
    }

    showToast("Message sent successfully!")
    form.reset()
  }

  return (
    <div className={`${montserrat.variable} font-sans text-gray-800`}>
      {showNotification && (
        <div className="fixed top-24 right-4 bg-[#81a094] text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300 animate-fade-in">
          {notificationMessage}
        </div>
      )}

      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? "bg-white shadow-md" : "bg-transparent"
        }`}
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div
              className={`text-2xl font-bold font-montserrat transition-colors duration-500 ${
                scrolled ? "text-[#775b59]" : "text-white"
              }`}
            >
              GreenLeaf Trees
            </div>
            <div className="hidden md:flex space-x-8">
              {Object.keys(sections.current).map((section) => (
                <button
                  key={section}
                  onClick={() => scrollToSection(section)}
                  className={`capitalize transition-all duration-300 font-montserrat cursor-pointer ${
                    scrolled
                      ? activeSection === section
                        ? "text-[#9ae5e6] font-semibold"
                        : "text-[#775b59] hover:text-[#9ae5e6]"
                      : "text-white hover:text-[#9ae5e6] font-semibold"
                  }`}
                >
                  {section}
                </button>
              ))}
              <button
                onClick={() => setShowCart(!showCart)}
                className={`relative transition-all duration-300 font-montserrat flex items-center cursor-pointer ${
                  scrolled ? "text-[#775b59] hover:text-[#9ae5e6]" : "text-white hover:text-[#9ae5e6]"
                }`}
              >
                <svg
                  className="w-5 h-5 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  ></path>
                </svg>
                Purchase
                {getTotalItems() > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#9ae5e6] text-[#775b59] rounded-full w-5 h-5 flex items-center justify-center text-xs">
                    {getTotalItems()}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {showCart && (
        <div className="fixed top-20 right-4 bg-white rounded-2xl shadow-2xl z-50 w-[380px] overflow-hidden transition-all duration-300 animate-slide-in">
          <div className="bg-[#775b59] text-white px-6 py-5">
            <div className="flex justify-between items-center">
              <h3 className="font-montserrat font-bold text-xl flex items-center">
                <svg
                  className="w-6 h-6 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  ></path>
                </svg>
                Your Cart
              </h3>
              <button
                onClick={() => setShowCart(false)}
                className="bg-[#775b59] bg-opacity-40 p-1.5 rounded-full text-white hover:bg-opacity-60 transition-all cursor-pointer"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
          </div>

          <div className="max-h-[420px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            {cartItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="bg-gray-50 rounded-full p-4 mb-4">
                  <svg
                    className="w-12 h-12 text-[#81a094]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                    ></path>
                  </svg>
                </div>
                <p className="text-gray-600 font-medium text-center text-lg">Your cart is empty</p>
                <p className="text-gray-400 text-center mt-2 mb-6">Add some beautiful trees to get started!</p>
                <button
                  onClick={() => {
                    setShowCart(false)
                    scrollToSection("products")
                  }}
                  className="text-[#775b59] border border-[#775b59] px-5 py-2 rounded-full font-montserrat font-medium hover:bg-[#775b59] hover:text-white transition-all duration-300"
                >
                  Browse Trees
                </button>
              </div>
            ) : (
              <div className="py-3">
                {cartItems.map((item) => (
                  <div key={item.id} className="px-6 py-4 hover:bg-gray-50 transition-colors duration-200">
                    <div className="flex items-start">
                      <div className="relative w-[72px] h-[72px] overflow-hidden rounded-xl mr-4 flex-shrink-0">
                        <img
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <h4 className="font-montserrat font-semibold text-[#775b59] text-lg">{item.name}</h4>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-gray-400 hover:text-red-500 transition-colors cursor-pointer ml-2 p-1 rounded-full hover:bg-gray-100"
                            aria-label="Remove item"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                          </button>
                        </div>
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-[#81a094] font-bold text-lg">{item.price}</span>
                          <div className="flex items-center bg-gray-100 rounded-full overflow-hidden">
                            <button
                              onClick={() => {
                                if (item.quantity > 1) {
                                  setCartItems(prevItems =>
                                    prevItems.map(cartItem =>
                                      cartItem.id === item.id
                                        ? { ...cartItem, quantity: cartItem.quantity - 1 }
                                        : cartItem
                                    )
                                  )
                                } else {
                                  removeFromCart(item.id)
                                }
                              }}
                              className="px-2 py-1 text-gray-500 hover:bg-gray-200 transition-colors cursor-pointer flex items-center justify-center"
                              aria-label="Decrease quantity"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-3 w-3"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                              </svg>
                            </button>
                            <div className="px-3 py-1 font-medium text-gray-700">{item.quantity}</div>
                            <button
                              onClick={() => {
                                setCartItems(prevItems =>
                                  prevItems.map(cartItem =>
                                    cartItem.id === item.id
                                      ? { ...cartItem, quantity: cartItem.quantity + 1 }
                                      : cartItem
                                  )
                                )
                              }}
                              className="px-2 py-1 text-gray-500 hover:bg-gray-200 transition-colors cursor-pointer flex items-center justify-center"
                              aria-label="Increase quantity"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-3 w-3"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {cartItems.length > 0 && (
            <div className="p-6 bg-white border-t border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <span className="font-montserrat font-bold text-xl text-gray-700">Total:</span>
                <span className="font-montserrat font-bold text-xl text-[#775b59]">${getTotalPrice()}</span>
              </div>
              <button
                onClick={handleCheckout}
                className="w-full py-3.5 bg-gradient-to-r from-[#9ae5e6] to-[#81a094] text-[#775b59] font-montserrat font-semibold rounded-xl hover:opacity-90 transition-all duration-300 flex items-center justify-center cursor-pointer shadow-sm"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                Checkout
              </button>
            </div>
          )}
        </div>
      )}

      <section
        ref={setSectionRef('home')}
        className="min-h-screen flex items-center justify-center relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[#1b4332] via-[#2d6a4f] to-[#40916c] z-0"></div>

        <div className="absolute inset-0 z-10">
          <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#1b4332] to-transparent"></div>
          <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-[#1b4332] to-transparent"></div>
          <div className="absolute left-0 top-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1IiBoZWlnaHQ9IjUiPgo8cmVjdCB3aWR0aD0iNSIgaGVpZ2h0PSI1IiBmaWxsPSIjMWI0MzMyIj48L3JlY3Q+CjxwYXRoIGQ9Ik0wIDVMNSAwWk02IDRMNCA2Wk0tMSAxTDEgLTFaIiBzdHJva2U9IiMyZDZhNGYiIHN0cm9rZS13aWR0aD0iMSI+PC9wYXRoPgo8L3N2Zz4=')] opacity-5"></div>
        </div>

        <div className="container mx-auto px-6 relative z-20 text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 font-montserrat drop-shadow-lg">
            Bring Nature Home
          </h1>
          <p className="text-xl md:text-2xl text-white mb-8 max-w-3xl mx-auto drop-shadow-md">
            Premium trees for your garden, handpicked by experts with over 20 years of experience
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={() => scrollToSection("products")}
              className="px-8 py-3 bg-[#9ae5e6] text-[#775b59] font-montserrat font-semibold rounded-full hover:bg-[#81a094] transition-all duration-300 transform hover:scale-105 cursor-pointer shadow-lg"
            >
              Explore Our Trees
            </button>
            <button
              onClick={() => setShowCart(true)}
              className="px-8 py-3 bg-[#775b59] text-white font-montserrat font-semibold rounded-full hover:bg-[#81a094] transition-all duration-300 transform hover:scale-105 cursor-pointer shadow-lg"
            >
              View Cart
            </button>
          </div>
        </div>
      </section>

      <section ref={setSectionRef('about')} className="py-20 bg-[#f9f5f0]">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-16 font-montserrat" style={{ color: "#775b59" }}>
            Our Journey
          </h2>

          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-[#81a094]"></div>

            {[
              {
                year: "1998",
                title: "Our Beginnings",
                description: "Started as a small family nursery with just 10 varieties of trees.",
                icon: (
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                    ></path>
                  </svg>
                ),
              },
              {
                year: "2005",
                title: "Expansion",
                description:
                  "Expanded our nursery to include over 50 varieties of trees and opened our first retail location.",
                icon: (
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    ></path>
                  </svg>
                ),
              },
              {
                year: "2012",
                title: "Sustainability Focus",
                description: "Implemented eco-friendly growing practices and became certified organic.",
                icon: (
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                    ></path>
                  </svg>
                ),
              },
              {
                year: "2018",
                title: "Online Store Launch",
                description: "Launched our online store to serve customers nationwide.",
                icon: (
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                    ></path>
                  </svg>
                ),
              },
              {
                year: "2023",
                title: "Today",
                description: "Now offering over 200 varieties of trees with nationwide delivery and planting services.",
                icon: (
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    ></path>
                  </svg>
                ),
              },
            ].map((item, index) => (
              <div
                key={index}
                className={`relative mb-16 ${index % 2 === 0 ? "md:ml-auto md:mr-[49.8%]" : "md:mr-auto md:ml-[49.8%]"} md:w-[45%] transition-all duration-500 hover:transform hover:translate-y-[-5px]`}
              >
                <div className="bg-white p-6 rounded-lg shadow-lg">
                  <div className="absolute top-6 left-1/2 transform -translate-x-1/2 md:translate-x-0 md:left-auto md:right-0 md:translate-x-[50%] w-10 h-10 rounded-full bg-[#9ae5e6] border-4 border-white flex items-center justify-center text-[#775b59]">
                    {item.icon}
                  </div>
                  <span className="inline-block px-3 py-1 rounded-full bg-[#81a094] text-white text-sm mb-3 font-montserrat">
                    {item.year}
                  </span>
                  <h3 className="text-xl font-bold mb-2 font-montserrat" style={{ color: "#775b59" }}>
                    {item.title}
                  </h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section ref={setSectionRef('products')} className="py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-16 font-montserrat" style={{ color: "#775b59" }}>
            Our Trees
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                id: 1,
                name: "Sugar Maple",
                price: "$145",
                description: "Spectacular fall colors with vibrant orange, red, and yellow foliage.",
                image: "https://images.unsplash.com/photo-1508193638397-1c4234db14d8?auto=format&fit=crop&w=2069&q=80",
              },
              {
                id: 2,
                name: "White Oak",
                price: "$159",
                description: "Majestic shade tree with excellent strength and longevity.",
                image: "https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?auto=format&fit=crop&w=2340&q=80",
              },
              {
                id: 3,
                name: "Weeping Willow",
                price: "$119",
                description: "Graceful, cascading branches perfect for waterside planting.",
                image: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=2070&q=80",
              },
              {
                id: 5,
                name: "Dogwood",
                price: "$99",
                description: "Beautiful spring flowers and attractive fall color.",
                image: "https://images.unsplash.com/photo-1558694440-03ade9215d7b?auto=format&fit=crop&w=2340&q=80",
              },
              {
                id: 6,
                name: "Japanese Maple",
                price: "$249",
                description: "Elegant, lacy foliage in stunning red or purple.",
                image: "https://images.unsplash.com/photo-1440342359743-84fcb8c21f21?auto=format&fit=crop&w=2340&q=80",
              },
            ].map((tree) => {
              initQuantity(tree.id)
              return (
                <div
                  key={tree.id}
                  className="bg-white rounded-lg overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl transform hover:-translate-y-2"
                >
                  <div className="h-64 overflow-hidden">
                    <img
                      src={tree.image || "/placeholder.svg"}
                      alt={tree.name}
                      className="w-full h-full object-cover transition-all duration-700 hover:scale-110"
                    />
                  </div>
                  <div className="p-6 flex flex-col h-[calc(100%-16rem)]">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-xl font-bold font-montserrat" style={{ color: "#775b59" }}>
                        {tree.name}
                      </h3>
                      <span className="text-lg font-bold text-[#81a094]">{tree.price}</span>
                    </div>
                    <p className="text-gray-600 mb-4">{tree.description}</p>

                    <div className="mt-auto">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center bg-gray-50 rounded-full border border-gray-200 overflow-hidden shadow-sm">
                          <button
                            onClick={() => decrementQuantity(tree.id)}
                            className="px-3 py-2 text-[#775b59] hover:bg-gray-100 transition-colors cursor-pointer flex items-center justify-center"
                            aria-label="Decrease quantity"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                            </svg>
                          </button>
                          <div className="px-4 py-2 font-medium text-[#775b59] min-w-[40px] text-center">
                            {quantityToAdd[tree.id] || 1}
                          </div>
                          <button
                            onClick={() => incrementQuantity(tree.id)}
                            className="px-3 py-2 text-[#775b59] hover:bg-gray-100 transition-colors cursor-pointer flex items-center justify-center"
                            aria-label="Increase quantity"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                          </button>
                        </div>
                      </div>

                      <button
                        onClick={() => addToCart(tree.id, tree.name, tree.price, tree.image)}
                        className={`w-full py-2 ${
                          addedButtons[tree.id] 
                            ? "bg-[#81a094] text-white" 
                            : "bg-[#9ae5e6] text-[#775b59]"
                        } font-montserrat font-semibold rounded-lg hover:bg-[#81a094] hover:text-white transition-all duration-300 flex items-center justify-center cursor-pointer`}
                        disabled={addedButtons[tree.id]}
                      >
                        {addedButtons[tree.id] ? (
                          <>
                            <svg 
                              className="w-5 h-5 mr-2" 
                              fill="none" 
                              stroke="currentColor" 
                              viewBox="0 0 24 24" 
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth="2" 
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                            Added
                          </>
                        ) : (
                          <>
                            <svg
                              className="w-5 h-5 mr-2"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                              ></path>
                            </svg>
                            Add to Cart
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section ref={setSectionRef('reviews')} className="py-20 bg-[#e8f4f4]">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-16 font-montserrat" style={{ color: "#775b59" }}>
            Customer Reviews
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Johnson",
                rating: 5,
                review:
                  "The Japanese Maple I purchased is thriving in my garden. The delivery was prompt and the tree was carefully packaged.",
                image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=2340&q=80",
              },
              {
                name: "Michael Thompson",
                rating: 5,
                review:
                  "Excellent selection and quality. The staff was very knowledgeable and helped me choose the perfect trees for my yard.",
                image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=2340&q=80",
              },
              {
                name: "Emily Rodriguez",
                rating: 4,
                review:
                  "Beautiful White Oak delivered right to my door. It's growing well and looks exactly as described on the website.",
                image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=2340&q=80",
              },
              {
                name: "David Wilson",
                rating: 5,
                review:
                  "I've been buying trees from GreenLeaf for years. Their quality and customer service are consistently outstanding.",
                image: "https://images.unsplash.com/photo-1552058544-f2b08422138a?auto=format&fit=crop&w=2344&q=80",
              },
              {
                name: "Jennifer Lee",
                rating: 5,
                review:
                  "The planting service was worth every penny. Professional, efficient, and they even followed up to make sure my trees were doing well.",
                image: "https://images.unsplash.com/photo-1554151228-14d9def656e4?auto=format&fit=crop&w=2340&q=80",
              },
              {
                name: "Robert Garcia",
                rating: 4,
                review:
                  "Great experience overall. The Dogwood I purchased is beautiful and was delivered in perfect condition.",
                image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=2340&q=80",
              },
            ].map((review, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl"
              >
                <div className="flex items-center mb-4">
                  <img
                    src={review.image || "/placeholder.svg"}
                    alt={review.name}
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h3 className="font-bold font-montserrat" style={{ color: "#775b59" }}>
                      {review.name}
                    </h3>
                    <div className="flex">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <svg
                          key={i}
                          className={`w-4 h-4 ${i < review.rating ? "text-yellow-400" : "text-gray-300"} fill-current`}
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 italic">"{review.review}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section ref={setSectionRef('contact')} className="py-20 bg-[#81a094] text-white">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-16 font-montserrat">Get In Touch</h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="flex flex-col h-full">
              <h3 className="text-2xl font-bold mb-6 font-montserrat">Contact Information</h3>
              <div className="space-y-4 mb-8">
                <p className="flex items-center">
                  <svg
                    className="w-6 h-6 mr-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    ></path>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    ></path>
                  </svg>
                  123 Forest Lane, Greenville, GA 30222
                </p>
                <p className="flex items-center">
                  <svg
                    className="w-6 h-6 mr-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    ></path>
                  </svg>
                  (555) 123-4567
                </p>
                <p className="flex items-center">
                  <svg
                    className="w-6 h-6 mr-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    ></path>
                  </svg>
                  info@greenleaftrees.com
                </p>
                <p className="flex items-center">
                  <svg
                    className="w-6 h-6 mr-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                  Mon-Sat: 8am-6pm, Sun: 10am-4pm
                </p>
              </div>

              <div className="mt-auto">
                <img
                  src="https://images.unsplash.com/photo-1605000797499-95a51c5269ae?auto=format&fit=crop&w=2342&q=80"
                  alt="Our Nursery"
                  className="rounded-lg shadow-lg w-full h-64 object-cover"
                />
              </div>
            </div>

            <div className="bg-white text-gray-800 rounded-lg shadow-lg p-8">
              <h3 className="text-2xl font-bold mb-6 font-montserrat" style={{ color: "#775b59" }}>
                Send Us a Message
              </h3>
              <form className="space-y-6" onSubmit={handleSubmitMessage}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 mb-2 font-montserrat">Name</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9ae5e6]"
                      placeholder="Your name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2 font-montserrat">Email</label>
                    <input
                      type="email"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9ae5e6]"
                      placeholder="Your email"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-gray-700 mb-2 font-montserrat">Subject</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9ae5e6]"
                    placeholder="Subject"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2 font-montserrat">Message</label>
                  <textarea
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9ae5e6] h-32"
                    placeholder="Your message"
                    required
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full py-3 bg-[#9ae5e6] text-[#775b59] font-montserrat font-semibold rounded-lg hover:bg-[#81a094] hover:text-white transition-all duration-300 cursor-pointer"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-[#775b59] text-white py-8">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-2xl font-bold mb-4 md:mb-0 font-montserrat">GreenLeaf Trees</div>
            <div className="flex space-x-4">
              {Object.keys(sections.current).map((section) => (
                <button
                  key={section}
                  onClick={() => scrollToSection(section)}
                  className="capitalize hover:text-[#9ae5e6] transition-all duration-300 font-montserrat cursor-pointer"
                >
                  {section}
                </button>
              ))}
            </div>
          </div>
          <div className="border-t border-white border-opacity-20 mt-6 pt-6 text-center text-sm">
            © {new Date().getFullYear()} GreenLeaf Trees. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}

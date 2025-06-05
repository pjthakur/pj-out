"use client";

import type React from "react";

import { useState, useEffect, useRef } from "react";
import { Pacifico, Quicksand } from "next/font/google";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, X, Star, Sun, Moon, Menu, ArrowUp } from "lucide-react";

const pacifico = Pacifico({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-pacifico",
});

const quicksand = Quicksand({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-quicksand",
});

const theme = {
  light: {
    background: "#FFF6F9",
    text: "#5A3D5C",
    primary: "#FF66B3",
    secondary: "#8A4FFF",
    accent: "#FFD166",
    cardBg: "#FFFFFF",
    navBg: "rgba(255, 246, 249, 0.85)",
  },
  dark: {
    background: "#1A1A2E",
    text: "#E5E5E5",
    primary: "#FF6B9D",
    secondary: "#A855F7",
    accent: "#FFA726",
    cardBg: "#2D2D44",
    navBg: "rgba(26, 26, 46, 0.9)",
  },
};

type Product = {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
  featured: boolean;
  rating: number;
  reviews: number;
};

type CartItem = {
  product: Product;
  quantity: number;
};

type Review = {
  id: number;
  name: string;
  avatar: string;
  rating: number;
  comment: string;
  date: string;
};

const products: Product[] = [
  {
    id: 1,
    name: "Rainbow Swirl Lollipop",
    price: 2.99,
    description:
      "A colorful spiral lollipop with fruity flavors that will take your taste buds on a magical journey! Each swirl represents a different fruit flavor that blends perfectly as you enjoy this sweet treat.",
    image:
      "https://images.pexels.com/photos/90919/pexels-photo-90919.png?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    category: "lollipops",
    featured: true,
    rating: 4.8,
    reviews: 124,
  },
  {
    id: 2,
    name: "Gummy Bear Assortment",
    price: 4.99,
    description:
      "A delightful mix of gummy bears in various flavors and colors. These soft, chewy treats are perfect for sharing or enjoying all by yourself!",
    image:
      "https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?q=80&w=500&auto=format&fit=crop",
    category: "gummies",
    featured: true,
    rating: 4.9,
    reviews: 89,
  },
  {
    id: 3,
    name: "Chocolate Truffle Box",
    price: 12.99,
    description:
      "Luxurious chocolate truffles with a smooth, creamy center. Each bite melts in your mouth for an unforgettable chocolate experience.",
    image:
      "https://images.pexels.com/photos/10390457/pexels-photo-10390457.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    category: "chocolate",
    featured: true,
    rating: 5.0,
    reviews: 76,
  },
  {
    id: 4,
    name: "Cotton Candy Clouds",
    price: 3.49,
    description:
      "Fluffy, melt-in-your-mouth cotton candy in pastel colors. Tastes like a sweet dream and looks like a magical cloud!",
    image:
      "https://images.pexels.com/photos/10477112/pexels-photo-10477112.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    category: "cotton candy",
    featured: false,
    rating: 4.7,
    reviews: 52,
  },
  {
    id: 5,
    name: "Sour Candy Strips",
    price: 1.99,
    description:
      "Tangy, chewy candy strips that pack a punch of flavor. Perfect for kids who love that sour kick!",
    image:
      "https://images.pexels.com/photos/7110203/pexels-photo-7110203.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    category: "sour",
    featured: false,
    rating: 4.6,
    reviews: 118,
  },
  {
    id: 6,
    name: "Caramel Popcorn Bucket",
    price: 5.99,
    description:
      "Sweet caramel-coated popcorn that's crunchy, sticky, and utterly delicious. A perfect treat for movie nights!",
    image:
      "https://images.pexels.com/photos/7676079/pexels-photo-7676079.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    category: "popcorn",
    featured: true,
    rating: 4.8,
    reviews: 64,
  },
];

const reviews: Review[] = [
  {
    id: 1,
    name: "Emma S.",
    avatar:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=100&auto=format&fit=crop",
    rating: 5,
    comment:
      "My kids absolutely love the Rainbow Swirl Lollipops! They're now a birthday party staple in our house.",
    date: "October 12, 2023",
  },
  {
    id: 2,
    name: "Michael T.",
    avatar:
      "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=100&auto=format&fit=crop",
    rating: 4,
    comment:
      "The Gummy Bear Assortment has the perfect balance of flavors. My only complaint is that they disappear too quickly!",
    date: "September 3, 2023",
  },
  {
    id: 3,
    name: "Sophia L.",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=100&auto=format&fit=crop",
    rating: 5,
    comment:
      "The Chocolate Truffle Box made the perfect gift. The presentation was beautiful and the chocolates were divine!",
    date: "November 15, 2023",
  },
];

export default function CandyKingdom() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const currentTheme = isDarkMode ? theme.dark : theme.light;

  const heroRef = useRef<HTMLDivElement>(null);
  const productsRef = useRef<HTMLDivElement>(null);
  const whyUsRef = useRef<HTMLDivElement>(null);
  const reviewsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (selectedProduct || isCartOpen || isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [selectedProduct, isCartOpen, isMenuOpen]);

  const addToCart = (product: Product, quantity = 1) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (item) => item.product.id === product.id
      );

      if (existingItem) {
        return prevCart.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [...prevCart, { product, quantity }];
      }
    });

    showToast(`Added ${quantity} ${product.name} to cart!`);
  };

  const removeFromCart = (productId: number) => {
    setCart((prevCart) =>
      prevCart.filter((item) => item.product.id !== productId)
    );
    showToast("Item removed from cart");
  };

  const updateQuantity = (productId: number, newQuantity: number) => {
    if (newQuantity < 1) return;

    setCart((prevCart) =>
      prevCart.map((item) =>
        item.product.id === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cart.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
  };

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
    setIsMenuOpen(false);
    ref.current?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div
      className={`${pacifico.variable} ${quicksand.variable}`}
      style={{
        backgroundColor: currentTheme.background,
        color: currentTheme.text,
      }}
    >
      <nav
        className="fixed w-full z-50 py-4 px-6 flex justify-between items-center"
        style={{
          backgroundColor: currentTheme.navBg,
          backdropFilter: "blur(8px)",
        }}
      >
        <div className="flex items-center">
          <h1
            className="text-2xl md:text-3xl font-bold"
            style={{
              fontFamily: "var(--font-pacifico)",
              color: currentTheme.primary,
            }}
          >
            Candy Kingdom
          </h1>
        </div>

        <div className="hidden md:flex items-center space-x-8">
          <button
            onClick={() => scrollToSection(heroRef)}
            className="font-medium hover:text-opacity-80 transition-colors cursor-pointer"
            style={{ fontFamily: "var(--font-quicksand)" }}
          >
            Home
          </button>
          <button
            onClick={() => scrollToSection(productsRef)}
            className="font-medium hover:text-opacity-80 transition-colors cursor-pointer"
            style={{ fontFamily: "var(--font-quicksand)" }}
          >
            Products
          </button>
          <button
            onClick={() => scrollToSection(whyUsRef)}
            className="font-medium hover:text-opacity-80 transition-colors cursor-pointer"
            style={{ fontFamily: "var(--font-quicksand)" }}
          >
            Why Us
          </button>
          <button
            onClick={() => scrollToSection(reviewsRef)}
            className="font-medium hover:text-opacity-80 transition-colors cursor-pointer"
            style={{ fontFamily: "var(--font-quicksand)" }}
          >
            Reviews
          </button>
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 rounded-full hover:bg-opacity-10 transition-colors cursor-pointer"
            aria-label="Toggle dark mode"
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-2 rounded-full hover:bg-opacity-10 transition-colors cursor-pointer"
            aria-label="Open cart"
          >
            <ShoppingCart size={20} />
            {getTotalItems() > 0 && (
              <span
                className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-xs flex items-center justify-center text-white"
                style={{ backgroundColor: currentTheme.primary }}
              >
                {getTotalItems()}
              </span>
            )}
          </button>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-full hover:bg-opacity-10 transition-colors cursor-pointer"
            aria-label="Toggle menu"
          >
            <Menu size={20} />
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-16 left-0 right-0 z-40 p-4 flex flex-col space-y-4"
            style={{
              backgroundColor: currentTheme.navBg,
              backdropFilter: "blur(8px)",
            }}
          >
            <button
              onClick={() => scrollToSection(heroRef)}
              className="py-2 font-medium text-left cursor-pointer"
              style={{ fontFamily: "var(--font-quicksand)" }}
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection(productsRef)}
              className="py-2 font-medium text-left cursor-pointer"
              style={{ fontFamily: "var(--font-quicksand)" }}
            >
              Products
            </button>
            <button
              onClick={() => scrollToSection(whyUsRef)}
              className="py-2 font-medium text-left cursor-pointer"
              style={{ fontFamily: "var(--font-quicksand)" }}
            >
              Why Us
            </button>
            <button
              onClick={() => scrollToSection(reviewsRef)}
              className="py-2 font-medium text-left cursor-pointer"
              style={{ fontFamily: "var(--font-quicksand)" }}
            >
              Reviews
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="pt-16">
        <section
          ref={heroRef}
          className="min-h-[90vh] flex flex-col items-center justify-center px-6 py-20 relative overflow-hidden"
        >
          <div className="absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-gradient-to-br from-pink-200 to-purple-200 opacity-50"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-[800px] h-[800px] rounded-full bg-gradient-to-r from-pink-300/20 to-purple-300/20 blur-3xl"></div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl"
          >
            <h1
              className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6"
              style={{
                fontFamily: "var(--font-pacifico)",
                color: currentTheme.primary,
              }}
            >
              Sweet Treats for Everyone
            </h1>
            <p
              className="text-lg md:text-xl mb-8"
              style={{ fontFamily: "var(--font-quicksand)" }}
            >
              Discover a magical world of delicious candies that will bring joy
              to children and adults alike. From colorful lollipops to gourmet
              chocolates, we have treats for every sweet tooth!
            </p>
            <button
              onClick={() => scrollToSection(productsRef)}
              className="px-8 py-3 rounded-full text-white font-medium text-lg transition-transform hover:scale-105 active:scale-95 cursor-pointer"
              style={{
                backgroundColor: currentTheme.primary,
                fontFamily: "var(--font-quicksand)",
                boxShadow: "0 10px 25px rgba(255, 102, 179, 0.5)",
              }}
            >
              Explore Our Candies
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-pink-100/50 to-transparent -z-10"
          ></motion.div>
        </section>

        <section ref={productsRef} className="py-20 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2
                className="text-3xl md:text-4xl font-bold mb-4"
                style={{
                  fontFamily: "var(--font-pacifico)",
                  color: currentTheme.primary,
                }}
              >
                Our Sweet Collection
              </h2>
              <p
                className="text-lg max-w-2xl mx-auto"
                style={{ fontFamily: "var(--font-quicksand)" }}
              >
                Browse through our delicious selection of handcrafted candies
                made with the finest ingredients and lots of love!
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.5 }}
                  className="rounded-2xl overflow-hidden cursor-pointer group"
                  style={{
                    backgroundColor: currentTheme.cardBg,
                    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
                  }}
                  onClick={() => setSelectedProduct(product)}
                >
                  <div className="h-64 overflow-hidden relative">
                    <img
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    {product.featured && (
                      <div
                        className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-medium text-white"
                        style={{ backgroundColor: currentTheme.secondary }}
                      >
                        Featured
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3
                        className="text-xl font-bold"
                        style={{ fontFamily: "var(--font-quicksand)" }}
                      >
                        {product.name}
                      </h3>
                      <span
                        className="text-xl font-bold"
                        style={{ color: currentTheme.primary }}
                      >
                        ${product.price.toFixed(2)}
                      </span>
                    </div>

                    <div className="flex items-center mb-4">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={16}
                            className={
                              i < Math.floor(product.rating)
                                ? "fill-current"
                                : ""
                            }
                            style={{ color: currentTheme.accent }}
                          />
                        ))}
                      </div>
                      <span className="text-sm ml-2">({product.reviews})</span>
                    </div>

                    <p
                      className="text-sm mb-6 line-clamp-2"
                      style={{ fontFamily: "var(--font-quicksand)" }}
                    >
                      {product.description}
                    </p>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(product);
                      }}
                      className="w-full py-2 rounded-full text-white font-medium transition-transform hover:scale-105 active:scale-95 cursor-pointer"
                      style={{
                        backgroundColor: currentTheme.primary,
                        fontFamily: "var(--font-quicksand)",
                      }}
                    >
                      Add to Cart
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section
          ref={whyUsRef}
          className="py-20 px-6"
          style={{
            backgroundColor: isDarkMode
              ? "rgba(255, 102, 179, 0.05)"
              : "rgba(255, 102, 179, 0.1)",
          }}
        >
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2
                className="text-3xl md:text-4xl font-bold mb-4"
                style={{
                  fontFamily: "var(--font-pacifico)",
                  color: currentTheme.primary,
                }}
              >
                Why Choose Candy Kingdom?
              </h2>
              <p
                className="text-lg max-w-2xl mx-auto"
                style={{ fontFamily: "var(--font-quicksand)" }}
              >
                We're not just selling candy - we're creating magical
                experiences that bring joy to children and adults alike!
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  title: "Premium Quality",
                  description:
                    "We use only the finest ingredients to create our delicious treats, ensuring every bite is perfect.",
                  icon: "🍬",
                },
                {
                  title: "Handcrafted",
                  description:
                    "Each candy is made with love and attention to detail by our skilled candy artisans.",
                  icon: "👩‍🍳",
                },
                {
                  title: "Kid-Friendly",
                  description:
                    "Our candies are designed to delight children with vibrant colors and amazing flavors.",
                  icon: "👧",
                },
                {
                  title: "Fast Delivery",
                  description:
                    "We ship your sweet treats quickly so you can enjoy them as soon as possible.",
                  icon: "🚚",
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="rounded-2xl p-6 text-center"
                  style={{
                    backgroundColor: currentTheme.cardBg,
                    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <div
                    className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center text-2xl"
                    style={{ backgroundColor: `${currentTheme.primary}20` }}
                  >
                    {item.icon}
                  </div>
                  <h3
                    className="text-xl font-bold mb-3"
                    style={{ fontFamily: "var(--font-quicksand)" }}
                  >
                    {item.title}
                  </h3>
                  <p
                    className="text-sm"
                    style={{ fontFamily: "var(--font-quicksand)" }}
                  >
                    {item.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section ref={reviewsRef} className="py-20 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2
                className="text-3xl md:text-4xl font-bold mb-4"
                style={{
                  fontFamily: "var(--font-pacifico)",
                  color: currentTheme.primary,
                }}
              >
                Sweet Words from Happy Customers
              </h2>
              <p
                className="text-lg max-w-2xl mx-auto"
                style={{ fontFamily: "var(--font-quicksand)" }}
              >
                Don't just take our word for it - see what our customers have to
                say about their Candy Kingdom experience!
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {reviews.map((review, index) => (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="rounded-2xl p-6"
                  style={{
                    backgroundColor: currentTheme.cardBg,
                    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                      <img
                        src={review.avatar || "/placeholder.svg"}
                        alt={review.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h4
                        className="font-bold"
                        style={{ fontFamily: "var(--font-quicksand)" }}
                      >
                        {review.name}
                      </h4>
                      <p className="text-sm opacity-70">{review.date}</p>
                    </div>
                  </div>

                  <div className="flex mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className={i < review.rating ? "fill-current" : ""}
                        style={{ color: currentTheme.accent }}
                      />
                    ))}
                  </div>

                  <p
                    className="text-sm"
                    style={{ fontFamily: "var(--font-quicksand)" }}
                  >
                    "{review.comment}"
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 px-6">
          <div
            className="max-w-4xl mx-auto rounded-3xl p-8 md:p-12"
            style={{
              background: `linear-gradient(135deg, ${currentTheme.primary}, ${currentTheme.secondary})`,
            }}
          >
            <div className="text-center text-white mb-8">
              <h2
                className="text-3xl md:text-4xl font-bold mb-4"
                style={{ fontFamily: "var(--font-pacifico)" }}
              >
                Join Our Sweet Community
              </h2>
              <p
                className="text-lg max-w-2xl mx-auto"
                style={{ fontFamily: "var(--font-quicksand)" }}
              >
                Subscribe to our newsletter for exclusive offers, new candy
                announcements, and sweet surprises!
              </p>
            </div>

            <form
              className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto"
              onSubmit={(e) => {
                e.preventDefault();
                showToast("Thanks for subscribing!");
                (e.target as HTMLFormElement).reset();
              }}
            >
              <input
                type="email"
                placeholder="Your email address"
                required
                className="flex-grow px-6 py-3 rounded-full text-gray-800 outline-none bg-"
                style={{
                  fontFamily: "var(--font-quicksand)",
                  backgroundColor: currentTheme.background,
                  color: currentTheme.text,
                }}
              />
              <button
                type="submit"
                className="px-8 py-3 rounded-full font-medium text-white transition-transform hover:scale-105 active:scale-95 cursor-pointer"
                style={{
                  backgroundColor: currentTheme.accent,
                  color: "#5A3D5C",
                  fontFamily: "var(--font-quicksand)",
                }}
              >
                Subscribe
              </button>
            </form>
          </div>
        </section>
      </main>

      <footer
        className="py-12 px-6"
        style={{
          backgroundColor: isDarkMode
            ? "rgba(0, 0, 0, 0.2)"
            : "rgba(0, 0, 0, 0.05)",
        }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center text-center">
            <h3
              className="text-2xl font-bold mb-4"
              style={{
                fontFamily: "var(--font-pacifico)",
                color: currentTheme.primary,
              }}
            >
              Candy Kingdom
            </h3>
            <p
              className="text-sm mb-6 max-w-md"
              style={{ fontFamily: "var(--font-quicksand)" }}
            >
              Bringing sweetness and joy to children and adults since 2010. Our
              mission is to create magical candy experiences that bring smiles
              to faces everywhere.
            </p>
            <p
              className="text-sm opacity-70"
              style={{ fontFamily: "var(--font-quicksand)" }}
            >
              © 2023 Candy Kingdom. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      <AnimatePresence>
        {selectedProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4"
            style={{ 
              backgroundColor: isDarkMode ? "rgba(0, 0, 0, 0.75)" : "rgba(0, 0, 0, 0.4)",
              backdropFilter: "blur(12px)" 
            }}
            onClick={() => setSelectedProduct(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl border-4 border-white/20 shadow-2xl"
              style={{ 
                backgroundColor: currentTheme.cardBg,
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1)"
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 p-2 rounded-full bg-black/60 text-white hover:bg-black/80 transition-all duration-200 cursor-pointer shadow-lg hover:shadow-xl border-2 border-white/20"
                onClick={() => setSelectedProduct(null)}
                aria-label="Close modal"
              >
                <X size={20} className="sm:w-6 sm:h-6" />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="h-48 sm:h-64 md:h-auto relative">
                  <img
                    src={selectedProduct.image || "/placeholder.svg"}
                    alt={selectedProduct.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="p-4 sm:p-6 md:p-8">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3 sm:mb-2 pr-0 sm:pr-8">
                    <h3
                      className="text-xl sm:text-2xl font-bold flex-grow pr-0 sm:pr-4 mb-2 sm:mb-0"
                      style={{ fontFamily: "var(--font-quicksand)" }}
                    >
                      {selectedProduct.name}
                    </h3>
                    <span
                      className="text-xl sm:text-2xl font-bold flex-shrink-0"
                      style={{ color: currentTheme.primary }}
                    >
                      ${selectedProduct.price.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex items-center mb-4">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          className={`sm:w-4 sm:h-4 ${
                            i < Math.floor(selectedProduct.rating)
                              ? "fill-current"
                              : ""
                          }`}
                          style={{ color: currentTheme.accent }}
                        />
                      ))}
                    </div>
                    <span className="text-xs sm:text-sm ml-2">
                      ({selectedProduct.reviews} reviews)
                    </span>
                  </div>

                  <p
                    className="text-xs sm:text-sm mb-4 sm:mb-6 leading-relaxed"
                    style={{ fontFamily: "var(--font-quicksand)" }}
                  >
                    {selectedProduct.description}
                  </p>

                  <div className="mb-4 sm:mb-6">
                    <h4
                      className="font-bold mb-2 text-sm sm:text-base"
                      style={{ fontFamily: "var(--font-quicksand)" }}
                    >
                      Category
                    </h4>
                    <div
                      className="inline-block px-3 py-1 rounded-full text-xs sm:text-sm"
                      style={{
                        backgroundColor: `${currentTheme.primary}20`,
                        color: currentTheme.primary,
                      }}
                    >
                      {selectedProduct.category}
                    </div>
                  </div>

                  <div className="mb-4 sm:mb-6">
                    <h4
                      className="font-bold mb-2 text-sm sm:text-base"
                      style={{ fontFamily: "var(--font-quicksand)" }}
                    >
                      Quantity
                    </h4>
                    <div className="flex items-center">
                      <button
                        className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center cursor-pointer text-sm sm:text-base"
                        style={{
                          backgroundColor: `${currentTheme.primary}20`,
                          color: currentTheme.primary,
                        }}
                        onClick={() => {
                          const input = document.getElementById(
                            "quantity"
                          ) as HTMLInputElement;
                          const currentValue = Number.parseInt(input.value);
                          if (currentValue > 1) {
                            input.value = (currentValue - 1).toString();
                          }
                        }}
                      >
                        -
                      </button>
                      <input
                        id="quantity"
                        min="1"
                        max="10"
                        defaultValue="1"
                        readOnly
                        className="w-12 sm:w-14 mx-2 sm:mx-3 text-center bg-transparent text-sm sm:text-base py-1 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none cursor-default"
                        style={{ fontFamily: "var(--font-quicksand)" }}
                      />
                      <button
                        className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center cursor-pointer text-sm sm:text-base"
                        style={{
                          backgroundColor: `${currentTheme.primary}20`,
                          color: currentTheme.primary,
                        }}
                        onClick={() => {
                          const input = document.getElementById(
                            "quantity"
                          ) as HTMLInputElement;
                          const currentValue = Number.parseInt(input.value);
                          if (currentValue < 10) {
                            input.value = (currentValue + 1).toString();
                          }
                        }}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="flex gap-3 sm:gap-4">
                    <button
                      onClick={() => {
                        const input = document.getElementById(
                          "quantity"
                        ) as HTMLInputElement;
                        const quantity = Number.parseInt(input.value);
                        addToCart(selectedProduct, quantity);
                        setSelectedProduct(null);
                      }}
                      className="flex-grow py-3 sm:py-4 rounded-full text-white font-medium text-sm sm:text-base transition-transform hover:scale-105 active:scale-95 cursor-pointer"
                      style={{
                        backgroundColor: currentTheme.primary,
                        fontFamily: "var(--font-quicksand)",
                      }}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isCartOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex justify-end"
            style={{ backdropFilter: "blur(8px)" }}
            onClick={() => setIsCartOpen(false)}
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween" }}
              className="w-full max-w-md h-full overflow-auto"
              style={{ backgroundColor: currentTheme.cardBg }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3
                    className="text-2xl font-bold"
                    style={{
                      fontFamily: "var(--font-pacifico)",
                      color: currentTheme.primary,
                    }}
                  >
                    Your Cart
                  </h3>
                  <button
                    className="p-2 rounded-full hover:bg-opacity-10 transition-colors cursor-pointer"
                    onClick={() => setIsCartOpen(false)}
                  >
                    <X size={20} />
                  </button>
                </div>

                {cart.length === 0 ? (
                  <div className="text-center py-12">
                    <ShoppingCart
                      size={48}
                      className="mx-auto mb-4 opacity-30"
                    />
                    <p
                      className="text-lg font-medium mb-6"
                      style={{ fontFamily: "var(--font-quicksand)" }}
                    >
                      Your cart is empty
                    </p>
                    <button
                      onClick={() => {
                        setIsCartOpen(false);
                        scrollToSection(productsRef);
                      }}
                      className="px-6 py-2 rounded-full text-white font-medium transition-transform hover:scale-105 active:scale-95 cursor-pointer"
                      style={{
                        backgroundColor: currentTheme.primary,
                        fontFamily: "var(--font-quicksand)",
                      }}
                    >
                      Browse Products
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="space-y-4 mb-6">
                      {cart.map((item) => (
                        <div
                          key={item.product.id}
                          className="flex items-center gap-4 p-3 rounded-lg"
                          style={{
                            backgroundColor: `${currentTheme.primary}10`,
                          }}
                        >
                          <div className="w-16 h-16 rounded-lg overflow-hidden relative flex-shrink-0">
                            <img
                              src={item.product.image || "/placeholder.svg"}
                              alt={item.product.name}
                              className="w-full h-full object-cover"
                            />
                          </div>

                          <div className="flex-grow">
                            <h4
                              className="font-medium"
                              style={{ fontFamily: "var(--font-quicksand)" }}
                            >
                              {item.product.name}
                            </h4>
                            <div className="flex items-center justify-between mt-1">
                              <div className="flex items-center">
                                <button
                                  className="w-6 h-6 rounded-full flex items-center justify-center text-xs cursor-pointer"
                                  style={{
                                    backgroundColor: `${currentTheme.primary}20`,
                                    color: currentTheme.primary,
                                  }}
                                  onClick={() =>
                                    updateQuantity(
                                      item.product.id,
                                      item.quantity - 1
                                    )
                                  }
                                >
                                  -
                                </button>
                                <span className="w-8 text-center">
                                  {item.quantity}
                                </span>
                                <button
                                  className="w-6 h-6 rounded-full flex items-center justify-center text-xs cursor-pointer"
                                  style={{
                                    backgroundColor: `${currentTheme.primary}20`,
                                    color: currentTheme.primary,
                                  }}
                                  onClick={() =>
                                    updateQuantity(
                                      item.product.id,
                                      item.quantity + 1
                                    )
                                  }
                                >
                                  +
                                </button>
                              </div>
                              <span
                                className="font-medium"
                                style={{ color: currentTheme.primary }}
                              >
                                $
                                {(item.product.price * item.quantity).toFixed(
                                  2
                                )}
                              </span>
                            </div>
                          </div>

                          <button
                            className="p-2 rounded-full hover:bg-opacity-10 transition-colors cursor-pointer"
                            onClick={() => removeFromCart(item.product.id)}
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ))}
                    </div>

                    <div
                      className="p-4 rounded-lg mb-6"
                      style={{ backgroundColor: `${currentTheme.primary}10` }}
                    >
                      <div className="flex justify-between mb-2">
                        <span>Subtotal</span>
                        <span>${getTotalPrice().toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between mb-2">
                        <span>Shipping</span>
                        <span>$5.00</span>
                      </div>
                      <div className="flex justify-between font-bold">
                        <span>Total</span>
                        <span>${(getTotalPrice() + 5).toFixed(2)}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setCart([]);
                        setIsCartOpen(false);
                        showToast("Order placed successfully!");
                      }}
                      className="w-full py-3 rounded-full text-white font-medium transition-transform hover:scale-105 active:scale-95 cursor-pointer"
                      style={{
                        backgroundColor: currentTheme.primary,
                        fontFamily: "var(--font-quicksand)",
                      }}
                    >
                      Checkout
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-6 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-full z-50 max-w-xs sm:max-w-md"
            style={{
              backgroundColor: currentTheme.primary,
              color: "white",
              boxShadow: "0 10px 25px rgba(0, 0, 0, 0.2)",
            }}
          >
            <p 
              className="whitespace-nowrap text-center text-sm sm:text-base"
              style={{ fontFamily: "var(--font-quicksand)" }}
            >
              {toastMessage}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed bottom-6 right-6 w-12 h-12 rounded-full flex items-center justify-center z-40 cursor-pointer"
            style={{
              backgroundColor: currentTheme.primary,
              color: "white",
              boxShadow: "0 10px 25px rgba(0, 0, 0, 0.2)",
            }}
            onClick={scrollToTop}
            aria-label="Scroll to top"
          >
            <ArrowUp size={20} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
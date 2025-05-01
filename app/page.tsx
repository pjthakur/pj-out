"use client";

import { useState, useEffect } from 'react';
import { faker } from '@faker-js/faker';
import { FaStar, FaRegStar, FaStarHalfAlt, FaSearch, FaShoppingCart } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

// Types
interface FoodItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  ratings: number[];
  ratingByCurrentUser: number | null;
}

interface Restaurant {
  ratingByCurrentUser: number | null;
  id: string;
  name: string;
  description: string;
  image: string;
  ratings: number[];
  menu: FoodItem[];
}

interface Order {
  restaurantId: string;
  restaurantName: string;
  items: {
    id: string;
    name: string;
    price: number;
    quantity: number;
  }[];
}

const restaurantImages = [
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
"https://plus.unsplash.com/premium_photo-1661883237884-263e8de8869b?q=80&w=2689&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
"https://images.unsplash.com/photo-1647109063447-e01ab743ee8f?q=80&w=2532&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
"https://images.unsplash.com/photo-1613946069412-38f7f1ff0b65?q=80&w=2535&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
"https://images.unsplash.com/photo-1613946069412-38f7f1ff0b65?q=80&w=2535&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
"https://plus.unsplash.com/premium_photo-1676310055316-d73c9d5eeb51?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
"https://plus.unsplash.com/premium_photo-1676310055316-d73c9d5eeb51?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
"https://plus.unsplash.com/premium_photo-1676310055316-d73c9d5eeb51?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
"https://plus.unsplash.com/premium_photo-1676310055316-d73c9d5eeb51?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
"https://plus.unsplash.com/premium_photo-1671394138398-fe1ce5e5b03b?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
"https://plus.unsplash.com/premium_photo-1671394138398-fe1ce5e5b03b?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
"https://plus.unsplash.com/premium_photo-1671394138398-fe1ce5e5b03b?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
"https://plus.unsplash.com/premium_photo-1671394138398-fe1ce5e5b03b?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
"https://plus.unsplash.com/premium_photo-1671394138398-fe1ce5e5b03b?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
"https://plus.unsplash.com/premium_photo-1671394138398-fe1ce5e5b03b?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
"https://plus.unsplash.com/premium_photo-1671394138398-fe1ce5e5b03b?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
"https://images.unsplash.com/photo-1623800330578-2cd67efaec75?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
]

// Generate fake data
const generateFakeData = (): Restaurant[] => {
  const cuisines = ['Italian', 'Japanese', 'Mexican', 'Indian', 'American', 'Thai', 'French', 'Chinese'];
  
  return Array.from({ length: 12 }, () => {
    const cuisineType = faker.helpers.arrayElement(cuisines);
    
    return {
      id: faker.string.uuid(),
      name: `${faker.company.name()} ${cuisineType} Restaurant`,
      description: faker.company.catchPhrase(),
      image: faker.helpers.arrayElement(restaurantImages),
      ratings: Array.from({ length: faker.number.int({ min: 5, max: 30 }) }, () => 
        faker.number.float({ min: 1, max: 5 })
      ),
      ratingByCurrentUser: null,
      menu: Array.from({ length: faker.number.int({ min: 8, max: 15 }) }, () => ({
        id: faker.string.uuid(),
        name: faker.lorem.words(3),
        description: faker.lorem.sentence(),
        price: parseFloat(faker.commerce.price({ min: 5, max: 30 })),
        image: faker.helpers.arrayElement(restaurantImages),
        ratings: Array.from({ length: faker.number.int({ min: 0, max: 20 }) }, () => 
          faker.number.float({ min: 1, max: 5 })
        ),
        ratingByCurrentUser: null
      }))
    };
  });
};

// Helper function to calculate average rating
const calculateAverage = (ratings: number[]): number => {
  if (ratings.length === 0) return 0;
  return ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;
};

// Star rating component
const StarRating = ({ rating, onRatingChange = null, size = "text-xl", interactive = false }: 
  { rating: number; interactive?:boolean; onRatingChange?: ((rating: number) => void) | null, size?: string }) => {
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);

  const stars = [];
  for (let i = 1; i <= 5; i++) {
    let isFilled;
    if(interactive) {
    isFilled = hoveredRating !== null ? i <= hoveredRating : i <= rating;
    }
    else {
      isFilled = i <= rating;
    }

    console.log("🚀 ~ isFilled:", i,isFilled)
    stars.push(
      <FaStar
        key={i}
        className={`${size} ${onRatingChange ? 'cursor-pointer' : ''} ${isFilled ? 'text-yellow-500' : 'text-gray-300'}`}
        onMouseEnter={() => setHoveredRating(i)}
        onMouseLeave={() => setHoveredRating(null)}
        onClick={() => onRatingChange && onRatingChange(i)}
      />
    );
  }

  return <div className="flex">{stars}</div>;
};

export default function Home() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  console.log("🚀 ~ Home ~ selectedRestaurant restaurants:", restaurants)
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  console.log("🚀 ~ Home ~ selectedRestaurant:", selectedRestaurant)
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filteredRestaurants, setFilteredRestaurants] = useState<Restaurant[]>([]);
  const [cart, setCart] = useState<Order[]>([]);
  const [showCart, setShowCart] = useState<boolean>(false);
  const [showOrderSuccess, setShowOrderSuccess] = useState<boolean>(false);
  const [notification, setNotification] = useState<string | null>(null);
  const [menuSearchQuery, setMenuSearchQuery] = useState<string>('');

  useEffect(() => {
    // Generate fake data on component mount
    const data = generateFakeData();
    setRestaurants(data);
    setFilteredRestaurants(data);
  }, []);

  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  const [ratedRestaurants, setRatedRestaurants] = useState<Record<string,number>>({});
  const [ratedMenuItems, setRatedMenuItems] = useState<Record<string,number>>({});

  const handleRateRestaurant = (restaurantId: string, newRating: number) => {
    setRestaurants(current => {
      return current.map(restaurant => {
        if (restaurant.id === restaurantId) {
          let updatedRatings = [...restaurant.ratings];
          if (restaurant.ratingByCurrentUser) {
            // Replace previous rating
            const idx = updatedRatings.findIndex(r => r === restaurant.ratingByCurrentUser);
            if (idx !== -1) updatedRatings[idx] = newRating;
          } else {
            updatedRatings.push(newRating);
          }
          const updatedRestaurant = {
            ...restaurant,
            ratingByCurrentUser: newRating,
            ratings: updatedRatings
          };
          // If this is the selected restaurant, update it too
          if (selectedRestaurant && selectedRestaurant.id === restaurantId) {
            setSelectedRestaurant(updatedRestaurant);
          }
          return updatedRestaurant;
        }
        return restaurant;
      });
    });
    setNotification('Thank you for your review!');
    setTimeout(() => setNotification(null), 2500);
  };

  const handleRateMenuItem = (restaurantId: string, menuItemId: string, newRating: number) => {
    setRestaurants(current => {
      return current.map(restaurant => {
        if (restaurant.id === restaurantId) {
          const updatedMenu = restaurant.menu.map(item => {
            if (item.id === menuItemId) {
              if(ratedMenuItems[menuItemId]) {
                const updatedRatings = item.ratings;
                for (let i = 0; i < updatedRatings.length; i++) {
                  if (updatedRatings[i] === ratedMenuItems[menuItemId]) {
                    updatedRatings[i] = newRating;
                    break;
                  }
                }
                setRatedMenuItems(prev => ({ ...prev, [menuItemId]: newRating }));
                return {
                  ...item,
                  ratings: [...updatedRatings],
                  ratingByCurrentUser: newRating
                };
              }
              setRatedMenuItems(prev => ({ ...prev, [menuItemId]: newRating }));
              return {
                ...item,
                ratings: [...item.ratings, newRating],
                ratingByCurrentUser: newRating
              };
            }
            return item;
          });

          setSelectedRestaurant({
            ...restaurant,
            menu: updatedMenu,
          });
          
          return {
            ...restaurant,
            menu: updatedMenu
          };
        }
        return restaurant;
      });
    });
    setNotification('Thank you for reviewing this dish!');
    setTimeout(() => setNotification(null), 2500);
  };

  const addToCart = (restaurant: Restaurant, item: FoodItem) => {
    setCart(currentCart => {
      // Check if the restaurant already exists in the cart
      const existingOrderIndex = currentCart.findIndex(order => order.restaurantId === restaurant.id);
      
      if (existingOrderIndex >= 0) {
        // Restaurant exists in cart, check if the item exists
        const existingOrder = currentCart[existingOrderIndex];
        const existingItemIndex = existingOrder.items.findIndex(orderItem => orderItem.id === item.id);
        
        if (existingItemIndex >= 0) {
          // Item exists, increment quantity
          const updatedItems = [...existingOrder.items];
          updatedItems[existingItemIndex] = {
            ...updatedItems[existingItemIndex],
            quantity: updatedItems[existingItemIndex].quantity + 1
          };
          
          const updatedOrder = {
            ...existingOrder,
            items: updatedItems
          };
          
          return [
            ...currentCart.slice(0, existingOrderIndex),
            updatedOrder,
            ...currentCart.slice(existingOrderIndex + 1)
          ];
        } else {
          // Item doesn't exist, add it to the order
          const updatedOrder = {
            ...existingOrder,
            items: [
              ...existingOrder.items,
              {
                id: item.id,
                name: item.name,
                price: item.price,
                quantity: 1
              }
            ]
          };
          
          return [
            ...currentCart.slice(0, existingOrderIndex),
            updatedOrder,
            ...currentCart.slice(existingOrderIndex + 1)
          ];
        }
      } else {
        // Restaurant doesn't exist in cart, add new order
        return [
          ...currentCart,
          {
            restaurantId: restaurant.id,
            restaurantName: restaurant.name,
            items: [
              {
                id: item.id,
                name: item.name,
                price: item.price,
                quantity: 1
              }
            ]
          }
        ];
      }
    });
    setNotification('Added to cart!');
    setTimeout(() => setNotification(null), 2000);
  };

  const removeFromCart = (restaurantId: string, itemId: string) => {
    setCart(currentCart => {
      const updatedCart = currentCart.map(order => {
        if (order.restaurantId === restaurantId) {
          const updatedItems = order.items
            .map(item => {
              if (item.id === itemId) {
                return {
                  ...item,
                  quantity: item.quantity - 1
                };
              }
              return item;
            })
            .filter(item => item.quantity > 0);
          
          return {
            ...order,
            items: updatedItems
          };
        }
        return order;
      }).filter(order => order.items.length > 0);
      
      return updatedCart;
    });
  };

  const getTotalCartItems = () => {
    return cart.reduce((total, order) => 
      total + order.items.reduce((orderTotal, item) => orderTotal + item.quantity, 0), 0);
  };

  const getTotalCartPrice = () => {
    return cart.reduce((total, order) => 
      total + order.items.reduce((orderTotal, item) => orderTotal + (item.price * item.quantity), 0), 0);
  };

  const placeOrder = () => {
    setShowOrderSuccess(true);
    setCart([]);
    setTimeout(() => {
      setShowOrderSuccess(false);
      setShowCart(false);
    }, 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    if (!selectedRestaurant) {
      setSearchQuery(value);
      if (value) {
        const filtered = restaurants.filter(restaurant => 
          restaurant.name.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredRestaurants(filtered);
      } else {
        setFilteredRestaurants(restaurants);
      }
    } else {
      setMenuSearchQuery(value);
    }
  };


  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 transition-colors" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between gap-4">
            {/* Logo (no link, no click) */}
            <h1
              className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 cursor-pointer select-none"
              onClick={() => {
                setSelectedRestaurant(null);
                setSearchQuery('');
                setFilteredRestaurants(restaurants);
                setMenuSearchQuery('');
              }}
            >
              FoodFinder
            </h1>
            <button 
              onClick={() => setShowCart(true)}
              className="flex items-center bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-5 rounded-lg transition-colors cursor-pointer"
            >
              <FaShoppingCart className="mr-2" />
              <span className="font-medium">Cart ({getTotalCartItems()})</span>
            </button>
          </div>
          <div className="mt-6">
            <div className="relative">
              <input
                type="text"
                placeholder={selectedRestaurant ? "Search for dish..." : "Search for restaurant..."}
                value={selectedRestaurant ? menuSearchQuery : searchQuery}
                onChange={handleChange}
                className="w-full py-3 px-5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-base"
              />
              <FaSearch className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto p-4">
        {selectedRestaurant ? (
          <div className="space-y-6">
            {/* Restaurant Details */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700">
              <div className="md:flex">
                <img 
                  src={selectedRestaurant.image} 
                  alt={selectedRestaurant.name}
                  className="w-full md:w-1/2 h-64 md:h-96 object-cover rounded-t-lg md:rounded-l-lg md:rounded-tr-none"
                />
                
                <div className="p-6 md:w-1/2">
                  <h2 className="text-2xl font-bold mb-2">{selectedRestaurant.name}</h2>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">{selectedRestaurant.description}</p>
                  
                  <div className="flex items-center mb-4">
                    <div className="flex items-center gap-1 mt-2">
                      <StarRating rating={calculateAverage(selectedRestaurant.ratings)} size="text-base" />
                      <span className="ml-2 text-sm text-gray-500 flex items-center" style={{lineHeight: '1'}}>
                        ({calculateAverage(selectedRestaurant.ratings).toFixed(1)}/5)
                      </span>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Rate this restaurant:</p>
                    <StarRating
                      rating={selectedRestaurant.ratingByCurrentUser || 0}
                      onRatingChange={(rating) => handleRateRestaurant(selectedRestaurant.id, rating)}
                      size="text-xl"
                      interactive={true}
                    />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Menu */}
            <div>
              <h3 className="text-xl font-bold mb-4">Menu</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {(menuSearchQuery
                  ? selectedRestaurant.menu.filter(item =>
                      item.name.toLowerCase().includes(menuSearchQuery.toLowerCase()) ||
                      item.description.toLowerCase().includes(menuSearchQuery.toLowerCase())
                    )
                  : selectedRestaurant.menu
                ).map((item) => (
                  <motion.div
                    key={item.id}
                    className="flex flex-col bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 hover:border-indigo-200 dark:hover:border-indigo-800 transition-colors h-full"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 30 }}
                    transition={{ duration: 0.4, type: 'spring', bounce: 0.2 }}
                  >
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    <div className="flex flex-col flex-1 p-4">
                      <div className="flex justify-between items-start">
                        <h4 className="text-lg font-semibold mb-2">{item.name}</h4>
                        <p className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
                          ${item.price.toFixed(2)}
                        </p>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">{item.description}</p>
                      <div className="mt-auto flex items-end justify-between pt-2">
                        <div className="flex items-center gap-1">
                          <StarRating rating={calculateAverage(item.ratings)} size="text-base" />
                          <span className="ml-2 text-sm text-gray-500 flex items-center" style={{lineHeight: '1'}}>
                            ({calculateAverage(item.ratings).toFixed(1)}/5)
                          </span>
                        </div>
                        <span className="text-sm text-gray-500">{item.ratings.length} ratings</span>
                      </div>
                    </div>
                    <div className="p-4 space-y-3 border-t border-gray-100 dark:border-gray-700">
                      <p className="text-sm text-gray-600">Rate this dish:</p>
                      <StarRating
                        interactive={true}
                        rating={item.ratingByCurrentUser || 0}
                        onRatingChange={(rating) => handleRateMenuItem(selectedRestaurant.id, item.id, rating)}
                      />
                      <button
                        onClick={() => addToCart(selectedRestaurant, item)}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg transition-colors cursor-pointer"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div>
            <h2 className="text-2xl font-bold mb-4">Popular Restaurants</h2>
            
            {filteredRestaurants.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-lg text-gray-600">No restaurants found matching your search.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredRestaurants.map((restaurant) => (
                  <motion.div
                    key={restaurant.id}
                    className="bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 hover:border-indigo-200 dark:hover:border-indigo-800 transition-colors cursor-pointer flex flex-col h-full"
                    onClick={() => setSelectedRestaurant(restaurant)}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 30 }}
                    transition={{ duration: 0.4, type: 'spring', bounce: 0.2 }}
                  >
                    <div className="relative">
                      <img 
                        src={restaurant.image} 
                        alt={restaurant.name}
                        className="w-full h-48 object-cover rounded-t-lg"
                      />
                    </div>
                    <div className="flex flex-col flex-1 p-4">
                      <h3 className="text-lg font-semibold mb-2">{restaurant.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">{restaurant.description}</p>
                      <div className="mt-auto flex items-end justify-between pt-2">
                        <div className="flex items-center gap-1">
                          <StarRating rating={calculateAverage(restaurant.ratings)} size="text-base" />
                          <span className="ml-2 text-sm text-gray-500 flex items-center" style={{lineHeight: '1'}}>
                            ({calculateAverage(restaurant.ratings).toFixed(1)}/5)
                          </span>
                        </div>
                        <span className="text-sm text-gray-500">{restaurant.menu.length} items</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Shopping Cart Modal */}
      <AnimatePresence>
        {showCart && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-center items-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-100 dark:border-gray-700"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold">Your Cart</h2>
                  <button 
                    onClick={() => setShowCart(false)}
                    className="text-xl text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 cursor-pointer"
                  >
                    &times;
                  </button>
                </div>
                
                {cart.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-lg text-gray-600 mb-4">Your cart is empty</p>
                    <button 
                      onClick={() => setShowCart(false)}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-6 rounded-lg transition-colors cursor-pointer"
                    >
                      Browse Restaurants
                    </button>
                  </div>
                ) : (
                  <>
                    {cart.map((order) => (
                      <div key={order.restaurantId} className="mb-6">
                        <h3 className="text-lg font-semibold mb-3">{order.restaurantName}</h3>
                        
                        {order.items.map((item) => (
                          <div key={item.id} className="flex justify-between items-center py-3 border-b border-gray-100 dark:border-gray-700">
                            <div>
                              <p className="font-medium">{item.name}</p>
                              <p className="text-sm text-gray-500">${item.price.toFixed(2)} x {item.quantity}</p>
                            </div>
                            
                            <div className="flex items-center">
                              <span className="font-semibold mr-4">${(item.price * item.quantity).toFixed(2)}</span>
                              <div className="flex items-center space-x-2">
                                <button 
                                  onClick={() => removeFromCart(order.restaurantId, item.id)}
                                  className="text-gray-500 hover:text-red-500 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                                >
                                  −
                                </button>
                                <span className="mx-2">{item.quantity}</span>
                                <button 
                                  onClick={() => addToCart(
                                    restaurants.find(r => r.id === order.restaurantId)!, 
                                    restaurants.find(r => r.id === order.restaurantId)!.menu.find(m => m.id === item.id)!
                                  )}
                                  className="text-gray-500 hover:text-green-500 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                                >
                                  +
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ))}
                    
                    <div className="border-t border-gray-100 dark:border-gray-700 pt-4 mt-6">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-lg font-semibold">Total:</span>
                        <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
                          ${getTotalCartPrice().toFixed(2)}
                        </span>
                      </div>
                      
                      <button 
                        onClick={placeOrder}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-medium text-lg transition-colors cursor-pointer"
                      >
                        Place Order
                      </button>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Order Success Message */}
      {showOrderSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-center items-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-8 text-center max-w-md border border-gray-100 dark:border-gray-700">
            <svg className="mx-auto h-12 w-12 text-green-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <h3 className="text-xl font-bold mb-2">Order Placed Successfully!</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
              Thank you for your order. Your food is being prepared.
            </p>
            <button 
              onClick={() => {
                setShowOrderSuccess(false);
                setShowCart(false);
              }}
              className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-6 rounded-lg transition-colors cursor-pointer"
            >
              Continue Browsing
            </button>
          </div>
        </div>
      )}

      {/* Notification Toast */}
      <AnimatePresence>
        {notification && (
          <motion.div
            className="fixed top-6 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded shadow-lg z-50 transition-all"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.4 }}
          >
            {notification}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="mt-12 bg-white dark:bg-gray-800 py-6 border-t border-gray-100 dark:border-gray-700">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} FoodFinder. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
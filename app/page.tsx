"use client"
import {
  SearchIcon,
  GlobeIcon,
  MenuIcon,
  HeartIcon,
  StarIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
  XIcon,
  ClockIcon,
  CalendarDaysIcon,
  CheckIcon,
  CalendarIcon,
  UserIcon,
  HomeIcon,
  WineIcon,
  BellRingIcon,
  HardHatIcon,
  Construction,
  PlusIcon,
  WifiIcon,
  CarIcon,
  UtensilsIcon,
  TvIcon,
  MapPinIcon,
  PhoneIcon,
  MailIcon,
  FacebookIcon,
  TwitterIcon,
  InstagramIcon,
  MinusIcon,
} from "lucide-react"
import type React from "react"

import { useState, useRef, useEffect, useMemo } from "react"

// Property data 
const popularHomesData = [
  {
    id: 1,
    type: "Hotel in Greater Noida",
    title: "Luxury Hotel Suite with City View",
    description:
      "Enjoy this spacious hotel suite with panoramic city views. Features include a king-size bed, en-suite bathroom with rainfall shower, and a private balcony.",
    price: "₹2,710 for 2 nights",
    rating: "4.94",
    isFavorite: true,
    amenities: ["Free WiFi", "Air conditioning", "Swimming pool", "Gym", "Room service"],
    bedrooms: 1,
    bathrooms: 1,
    guests: 2,
    host: "Raj Sharma",
    hostRating: 4.98,
    location: "Greater Noida, Uttar Pradesh, India",
    area: "Gautam Buddha Nagar",
    images: [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=500&fit=crop",
      "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&h=500&fit=crop",
      "https://images.unsplash.com/photo-1564078516393-cf04bd966897?w=800&h=500&fit=crop",
      "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&h=500&fit=crop",
    ],
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop",
  },
  {
    id: 2,
    type: "Home in Greater Noida",
    title: "Modern Family Home with Garden",
    description:
      "Spacious 3-bedroom home perfect for families. Features a large garden, modern kitchen, and comfortable living spaces. Close to shopping and restaurants.",
    price: "₹6,627 for 2 nights",
    rating: "4.85",
    isFavorite: false,
    amenities: ["Free parking", "Kitchen", "Washer", "Dryer", "Backyard", "TV"],
    bedrooms: 3,
    bathrooms: 2,
    guests: 6,
    host: "Priya Patel",
    hostRating: 4.92,
    location: "Greater Noida, Uttar Pradesh, India",
    area: "Gautam Buddha Nagar",
    images: [
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=500&fit=crop",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&h=500&fit=crop",
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800&h=500&fit=crop",
      "https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?w=800&h=500&fit=crop",
    ],
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop",
  },
  {
    id: 3,
    type: "Flat in Noida",
    title: "Cozy 2BHK Apartment Near Metro",
    description:
      "Comfortable 2-bedroom apartment located just 5 minutes from the metro station. Fully furnished with modern amenities and 24-hour security.",
    price: "₹4,222 for 2 nights",
    rating: "4.96",
    isFavorite: true,
    amenities: ["WiFi", "Kitchen", "Air conditioning", "Elevator", "Security", "Balcony"],
    bedrooms: 2,
    bathrooms: 2,
    guests: 4,
    host: "Amit Verma",
    hostRating: 4.95,
    location: "Sector 18, Noida, Uttar Pradesh, India",
    area: "Gautam Buddha Nagar",
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=500&fit=crop",
      "https://images.unsplash.com/photo-1502672023488-70e25813eb80?w=800&h=500&fit=crop",
      "https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800&h=500&fit=crop",
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&h=500&fit=crop",
    ],
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop",
  },
  {
    id: 4,
    type: "Home in Noida",
    title: "Luxury Villa with Private Pool",
    description:
      "Stunning 4-bedroom villa with private swimming pool and garden. Perfect for family gatherings or friend reunions. Includes housekeeping service.",
    price: "₹11,241 for 2 nights",
    rating: "4.99",
    isFavorite: false,
    amenities: ["Swimming pool", "Garden", "BBQ", "Kitchen", "Parking", "Housekeeping"],
    bedrooms: 4,
    bathrooms: 4,
    guests: 8,
    host: "Vikram Singh",
    hostRating: 4.99,
    location: "Sector 50, Noida, Uttar Pradesh, India",
    area: "Gautam Buddha Nagar",
    images: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=500&fit=crop",
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=500&fit=crop",
      "https://images.unsplash.com/photo-1576941089067-2de3c901e126?w=800&h=500&fit=crop",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=500&fit=crop",
    ],
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop",
  },
  {
    id: 5,
    type: "Hotel in Greater Noida",
    title: "Boutique Hotel Room with Breakfast",
    description:
      "Elegant hotel room in a boutique property. Includes daily breakfast, access to fitness center, and evening social hour with complimentary drinks.",
    price: "₹2,960 for 2 nights",
    rating: "4.87",
    isFavorite: true,
    amenities: ["Breakfast included", "Fitness center", "Bar", "Room service", "Concierge", "WiFi"],
    bedrooms: 1,
    bathrooms: 1,
    guests: 2,
    host: "The Lotus Boutique Hotel",
    hostRating: 4.9,
    location: "Greater Noida, Uttar Pradesh, India",
    area: "Gautam Buddha Nagar",
    images: [
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=500&fit=crop",
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&h=500&fit=crop",
      "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800&h=500&fit=crop",
      "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&h=500&fit=crop",
    ],
    image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=300&fit=crop",
  },
  {
    id: 6,
    type: "Flat in Greater Noida",
    title: "Modern 3BHK with City Skyline View",
    description:
      "Contemporary 3-bedroom apartment on the 15th floor with stunning city views. Features modern furnishings, fully equipped kitchen, and spacious balcony.",
    price: "₹4,519 for 2 nights",
    rating: "5.0",
    isFavorite: false,
    amenities: ["City view", "Balcony", "Kitchen", "Washer", "Gym access", "Parking"],
    bedrooms: 3,
    bathrooms: 2,
    guests: 6,
    host: "Neha Gupta",
    hostRating: 5.0,
    location: "Greater Noida West, Uttar Pradesh, India",
    area: "Gautam Buddha Nagar",
    images: [
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=500&fit=crop",
      "https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e?w=800&h=500&fit=crop",
      "https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=800&h=500&fit=crop",
      "https://images.unsplash.com/photo-1560448204-61dc36dc98c8?w=800&h=500&fit=crop",
    ],
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
  },
  {
    id: 7,
    type: "Flat in Greater Noida",
    title: "Cozy 1BHK Near Knowledge Park",
    description:
      "Comfortable 1-bedroom apartment perfect for students or professionals. Located near educational institutions and tech companies. Fully furnished with all essentials.",
    price: "₹4,091 for 2 nights",
    rating: "4.89",
    isFavorite: true,
    amenities: ["WiFi", "Study desk", "Kitchen", "Washing machine", "TV", "Balcony"],
    bedrooms: 1,
    bathrooms: 1,
    guests: 2,
    host: "Rahul Sharma",
    hostRating: 4.87,
    location: "Knowledge Park, Greater Noida, Uttar Pradesh, India",
    area: "Gautam Buddha Nagar",
    images: [
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&h=500&fit=crop",
      "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800&h=500&fit=crop",
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&h=500&fit=crop",
      "https://images.unsplash.com/photo-1560185007-c5ca9d2c014d?w=800&h=500&fit=crop",
    ],
    image: "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=400&h=300&fit=crop",
  },
  {
    id: 8,
    type: "Villa in Greater Noida",
    title: "Spacious Villa with Garden and Terrace",
    description:
      "Beautiful 5-bedroom villa with landscaped garden and rooftop terrace. Perfect for large families or groups. Includes housekeeping and optional chef service.",
    price: "₹5,200 for 2 nights",
    rating: "4.91",
    isFavorite: false,
    amenities: ["Garden", "Terrace", "BBQ", "Kitchen", "Parking", "Housekeeping"],
    bedrooms: 5,
    bathrooms: 4,
    guests: 10,
    host: "Sanjay Kapoor",
    hostRating: 4.93,
    location: "Sector 1, Greater Noida, Uttar Pradesh, India",
    area: "Gautam Buddha Nagar",
    images: [
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=500&fit=crop",
      "https://images.unsplash.com/photo-1600585153490-76fb20a32601?w=800&h=500&fit=crop",
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800&h=500&fit=crop",
      "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&h=500&fit=crop",
    ],
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400&h=300&fit=crop",
  },
  {
    id: 9,
    type: "Apartment in Greater Noida",
    title: "Stylish Studio Apartment with Balcony",
    description:
      "Modern studio apartment with stylish decor and a cozy balcony. Perfect for solo travelers or couples. Located in a quiet neighborhood with easy access to public transport.",
    price: "₹3,800 for 2 nights",
    rating: "4.86",
    isFavorite: false,
    amenities: ["WiFi", "Kitchen", "Balcony", "Air conditioning", "TV", "Workspace"],
    bedrooms: 1,
    bathrooms: 1,
    guests: 2,
    host: "Meera Joshi",
    hostRating: 4.89,
    location: "Sector 37, Greater Noida, Uttar Pradesh, India",
    area: "Gautam Buddha Nagar",
    images: [
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&h=500&fit=crop",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=500&fit=crop",
      "https://images.unsplash.com/photo-1560448075-57d0285fc78b?w=800&h=500&fit=crop",
      "https://images.unsplash.com/photo-1560448204-61dc36dc98c8?w=800&h=500&fit=crop",
    ],
    image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&h=300&fit=crop",
  },
]

// 
const gurgaonData = [
  {
    id: 10,
    type: "Flat in Gurugram",
    title: "Luxury Apartment in Cyber City",
    price: "₹9,362 for 2 nights",
    rating: "4.98",
    isFavorite: true,
    area: "Gurgaon District",
    location: "Cyber City, Gurugram, Haryana, India",
    image: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=400&h=300&fit=crop",
  },
  {
    id: 11,
    type: "Apartment in Gurugram",
    title: "Modern Studio Near Golf Course",
    price: "₹3,436 for 2 nights",
    rating: "4.88",
    isFavorite: false,
    area: "Gurgaon District",
    location: "Golf Course Road, Gurugram, Haryana, India",
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400&h=300&fit=crop",
  },
  {
    id: 12,
    type: "Flat in Gurugram",
    title: "Spacious 3BHK with Pool Access",
    price: "₹5,800 for 2 nights",
    rating: "4.81",
    isFavorite: true,
    area: "Gurgaon District",
    location: "DLF Phase 5, Gurugram, Haryana, India",
    image: "https://images.unsplash.com/photo-1540518614846-7eded433c457?w=400&h=300&fit=crop",
  },
  {
    id: 13,
    type: "Flat in Gurugram",
    title: "Cozy 2BHK in DLF Phase 3",
    price: "₹4,424 for 2 nights",
    rating: "4.82",
    isFavorite: false,
    area: "Gurgaon District",
    location: "DLF Phase 3, Gurugram, Haryana, India",
    image: "https://images.unsplash.com/photo-1556020685-ae41abfc9365?w=400&h=300&fit=crop",
  },
  {
    id: 14,
    type: "Flat in Gurugram",
    title: "Premium Apartment with City View",
    price: "₹4,798 for 2 nights",
    rating: "5.0",
    isFavorite: true,
    area: "Gurgaon District",
    location: "Sector 54, Gurugram, Haryana, India",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop",
  },
  {
    id: 15,
    type: "Flat in Gurugram",
    title: "Elegant 1BHK in Sohna Road",
    price: "₹4,309 for 2 nights",
    rating: "4.82",
    isFavorite: false,
    area: "Gurgaon District",
    location: "Sohna Road, Gurugram, Haryana, India",
    image: "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=400&h=300&fit=crop",
  },
  {
    id: 16,
    type: "Flat in Gurugram",
    title: "Modern Apartment in Sector 56",
    price: "₹4,600 for 2 nights",
    rating: "4.89",
    isFavorite: false,
    area: "Gurgaon District",
    location: "Sector 56, Gurugram, Haryana, India",
    image: "https://images.unsplash.com/photo-1747901718105-bf9beb57ba3a?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwzfHx8ZW58MHx8fHx8",
  },
  {
    id: 17,
    type: "Penthouse in Gurugram",
    title: "Luxury Penthouse with Terrace",
    price: "₹8,900 for 2 nights",
    rating: "4.93",
    isFavorite: true,
    area: "Gurgaon District",
    location: "DLF Phase 4, Gurugram, Haryana, India",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=300&fit=crop",
  },
  {
    id: 18,
    type: "Studio in Gurugram",
    title: "Compact Studio in MG Road",
    price: "₹3,100 for 2 nights",
    rating: "4.79",
    isFavorite: false,
    area: "Gurgaon District",
    location: "MG Road, Gurugram, Haryana, India",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&h=300&fit=crop",
  },
]

const dehradunData = [
  {
    id: 19,
    type: "Villa in Dehradun",
    title: "Mountain View Villa with Garden",
    price: "₹8,500 for 2 nights",
    rating: "4.95",
    isFavorite: true,
    area: "Dehradun",
    location: "Rajpur Road, Dehradun, Uttarakhand, India",
    image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop",
  },
  {
    id: 20,
    type: "Home in Dehradun",
    title: "Cozy Cottage Near Forest",
    price: "₹6,200 for 2 nights",
    rating: "4.87",
    isFavorite: false,
    area: "Dehradun",
    location: "Mussoorie Road, Dehradun, Uttarakhand, India",
    image: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=400&h=300&fit=crop",
  },
  {
    id: 21,
    type: "Cottage in Dehradun",
    title: "Rustic Cottage with Valley View",
    price: "₹4,800 for 2 nights",
    rating: "4.92",
    isFavorite: true,
    area: "Dehradun",
    location: "Sahastradhara Road, Dehradun, Uttarakhand, India",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
  },
  {
    id: 22,
    type: "Apartment in Dehradun",
    title: "Modern Flat in City Center",
    price: "₹3,600 for 2 nights",
    rating: "4.78",
    isFavorite: false,
    area: "Dehradun",
    location: "Chakrata Road, Dehradun, Uttarakhand, India",
    image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop",
  },
  {
    id: 23,
    type: "Flat in Dehradun",
    title: "Comfortable 2BHK with Mountain View",
    price: "₹5,400 for 2 nights",
    rating: "4.85",
    isFavorite: false,
    area: "Dehradun",
    location: "GMS Road, Dehradun, Uttarakhand, India",
    image: "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=400&h=300&fit=crop",
  },
  {
    id: 24,
    type: "House in Dehradun",
    title: "Family Home with Garden",
    price: "₹7,200 for 2 nights",
    rating: "4.91",
    isFavorite: true,
    area: "Dehradun",
    location: "Clement Town, Dehradun, Uttarakhand, India",
    image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400&h=300&fit=crop",
  },
  {
    id: 25,
    type: "Resort in Dehradun",
    title: "Luxury Resort with Spa",
    price: "₹12,000 for 2 nights",
    rating: "4.96",
    isFavorite: false,
    area: "Dehradun",
    location: "Malsi, Dehradun, Uttarakhand, India",
    image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400&h=300&fit=crop",
  },
 
  {
    id: 27,
    type: "Bungalow in Dehradun",
    title: "Colonial Bungalow with Garden",
    price: "₹9,800 for 2 nights",
    rating: "4.94",
    isFavorite: false,
    area: "Dehradun",
    location: "Dalanwala, Dehradun, Uttarakhand, India",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=300&fit=crop",
  },
]

// Experiences data
const experiencesData = [
  {
    id: 101,
    title: "Delhi Food Tour: Street Food Delights",
    location: "Delhi, India",
    price: "₹1,500 per person",
    rating: "4.97",
    duration: "3 hours",
    groupSize: "Up to 8 people",
    isFavorite: true,
    host: "Rahul's Food Tours",
    description:
      "Explore the vibrant street food scene of Delhi with a local food expert. Sample over 8 different authentic dishes from the best street vendors in Old Delhi.",
    image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=300&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&h=500&fit=crop",
      "https://images.unsplash.com/photo-1517244683847-7456b63c5969?w=800&h=500&fit=crop",
      "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&h=500&fit=crop",
      "https://images.unsplash.com/photo-1534256958597-7fe685cbd745?w=800&h=500&fit=crop",
    ],
    category: "Food & Drink",
  },
  {
    id: 102,
    title: "Taj Mahal Sunrise Private Tour",
    location: "Agra, Uttar Pradesh",
    price: "₹3,200 per person",
    rating: "4.95",
    duration: "6 hours",
    groupSize: "Private tour",
    isFavorite: false,
    host: "Heritage Tours India",
    description:
      "Experience the breathtaking beauty of the Taj Mahal at sunrise. This private tour includes hotel pickup, skip-the-line entry, and an expert guide to share the history and stories behind this wonder of the world.",
    image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=400&h=300&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&h=500&fit=crop",
      "https://images.unsplash.com/photo-1548013146-72479768bada?w=800&h=500&fit=crop",
      "https://images.unsplash.com/photo-1506461883276-594a12b11cf3?w=800&h=500&fit=crop",
      "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&h=500&fit=crop",
    ],
    category: "Sightseeing",
  },
  {
    id: 103,
    title: "Yoga and Meditation Retreat",
    location: "Rishikesh, Uttarakhand",
    price: "₹2,800 per person",
    rating: "4.92",
    duration: "4 hours",
    groupSize: "Up to 10 people",
    isFavorite: true,
    host: "Ananda Yoga Center",
    description:
      "Immerse yourself in a peaceful yoga and meditation session by the banks of the Ganges River. This retreat is suitable for all levels and includes yoga mats, refreshments, and a guided meditation session.",
    image: "https://images.unsplash.com/photo-1545389336-cf090694435e?w=400&h=300&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1545389336-cf090694435e?w=800&h=500&fit=crop",
      "https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=800&h=500&fit=crop",
      "https://images.unsplash.com/photo-1600618528240-fb9fc964b853?w=800&h=500&fit=crop",
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&h=500&fit=crop",
    ],
    category: "Wellness",
  },
  {
    id: 104,
    title: "Jaipur Cooking Class: Royal Rajasthani Cuisine",
    location: "Jaipur, Rajasthan",
    price: "₹2,100 per person",
    rating: "4.98",
    duration: "4 hours",
    groupSize: "Up to 6 people",
    isFavorite: false,
    host: "Chef Priya's Kitchen",
    description:
      "Learn to cook authentic Rajasthani dishes in a traditional home kitchen. This hands-on cooking class includes a local market visit, preparation of 4 dishes, and a feast to enjoy your creations.",
    image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=400&h=300&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&h=500&fit=crop",
      "https://images.unsplash.com/photo-1604152135912-04a022e23696?w=800&h=500&fit=crop",
      "https://images.unsplash.com/photo-1617692855027-33b14f061079?w=800&h=500&fit=crop",
      "https://images.unsplash.com/photo-1596797038530-2c107aa8e1fa?w=800&h=500&fit=crop",
    ],
    category: "Cooking",
  },
  {
    id: 105,
    title: "Wildlife Safari in Ranthambore",
    location: "Ranthambore, Rajasthan",
    price: "₹4,500 per person",
    rating: "4.89",
    duration: "5 hours",
    groupSize: "Up to 6 people",
    isFavorite: true,
    host: "Wild India Expeditions",
    description:
      "Embark on an exciting jeep safari through Ranthambore National Park, home to the majestic Bengal tiger. This guided tour includes park fees, an experienced naturalist, and refreshments.",
    image: "https://images.unsplash.com/photo-1549366021-9f761d450615?w=400&h=300&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1549366021-9f761d450615?w=800&h=500&fit=crop",
      "https://images.unsplash.com/photo-1581852017103-68ac65514cf7?w=800&h=500&fit=crop",
      "https://images.unsplash.com/photo-1566760375908-6ed8c3ce0b32?w=800&h=500&fit=crop",
      "https://images.unsplash.com/photo-1544979590-37e9b47eb705?w=800&h=500&fit=crop",
    ],
    category: "Nature & Wildlife",
  },
  {
    id: 106,
    title: "Bollywood Dance Workshop",
    location: "Mumbai, Maharashtra",
    price: "₹1,800 per person",
    rating: "4.91",
    duration: "2 hours",
    groupSize: "Up to 15 people",
    isFavorite: false,
    host: "Mumbai Dance Academy",
    description:
      "Learn the energetic and fun dance moves of Bollywood in this interactive workshop. No prior dance experience needed! Includes choreography to a popular Bollywood song and a video of your performance.",
    image: "https://images.unsplash.com/photo-1535525153412-5a42439a210d?w=400&h=300&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1535525153412-5a42439a210d?w=800&h=500&fit=crop",
      "https://images.unsplash.com/photo-1504609813442-a9924e2e4531?w=800&h=500&fit=crop",
      "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=800&h=500&fit=crop",
      "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&h=500&fit=crop",
    ],
    category: "Arts & Culture",
  },
  {
    id: 107,
    title: "Goa Sunset Sailing Adventure",
    location: "Goa",
    price: "₹3,000 per person",
    rating: "4.94",
    duration: "3 hours",
    groupSize: "Up to 8 people",
    isFavorite: true,
    host: "Goa Sailing Adventures",
    description:
      "Sail along the beautiful coastline of Goa and witness a spectacular sunset over the Arabian Sea. This cruise includes snacks, beverages, swimming opportunities, and amazing photo opportunities.",
    image: "https://images.unsplash.com/photo-1601524909162-ae8725290836?w=400&h=300&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1601524909162-ae8725290836?w=800&h=500&fit=crop",
      "https://images.unsplash.com/photo-1596627116790-af6f96d9ec1b?w=800&h=500&fit=crop",
      "https://images.unsplash.com/photo-1596627116790-af6f96d9ec1b?w=800&h=500&fit=crop",
      "https://images.unsplash.com/photo-1596627116790-af6f96d9ec1b?w=800&h=500&fit=crop",
    ],
    category: "Adventure",
  },
  {
    id: 108,
    title: "Varanasi Spiritual Walking Tour",
    location: "Varanasi, Uttar Pradesh",
    price: "₹1,600 per person",
    rating: "4.96",
    duration: "3 hours",
    groupSize: "Up to 8 people",
    isFavorite: false,
    host: "Sacred Walks",
    description:
      "Explore the spiritual heart of India with a walking tour through the ancient lanes of Varanasi. Visit sacred temples, witness rituals along the Ganges, and learn about the city's 3,000-year history.",
    image: "https://images.unsplash.com/photo-1561361058-c24cecae35ca?w=400&h=300&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1561361058-c24cecae35ca?w=800&h=500&fit=crop",
      "https://images.unsplash.com/photo-1567415746947-5a9a2d57e805?w=800&h=500&fit=crop",
      "https://images.unsplash.com/photo-1590077428593-a33c3abc4c47?w=800&h=500&fit=crop",
      "https://images.unsplash.com/photo-1627894483216-2138af692e32?w=800&h=500&fit=crop",
    ],
    category: "History & Culture",
  },
  {
    id: 109,
    title: "Himalayan Photography Expedition",
    location: "Manali, Himachal Pradesh",
    price: "₹5,200 per person",
    rating: "4.93",
    duration: "8 hours",
    groupSize: "Up to 6 people",
    isFavorite: true,
    host: "Himalayan Lens",
    description:
      "Capture the breathtaking beauty of the Himalayas with guidance from a professional photographer. This expedition takes you to stunning viewpoints and provides personalized photography tips for all skill levels.",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=500&fit=crop",
      "https://images.unsplash.com/photo-1585409677983-0f6c41ca9c3b?w=800&h=500&fit=crop",
      "https://images.unsplash.com/photo-1455156218388-5e61b526818b?w=800&h=500&fit=crop",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=500&fit=crop",
    ],
    category: "Photography",
  },
]

// Festival events data
const festivalData = [
 
  {
    id: 202,
    title: "Diwali Light Festival Tour",
    location: "Jaipur, Rajasthan",
    date: "October 31 - November 1, 2024",
    price: "₹3,200 per person",
    rating: "4.95",
    duration: "Evening tour",
    isFavorite: false,
    host: "Festive India Tours",
    description:
      "Witness the magical Festival of Lights in the Pink City. This evening tour includes visits to beautifully decorated homes and temples, participation in a traditional Lakshmi Puja ceremony, and enjoying festive sweets.",
    image: "https://images.unsplash.com/photo-1574781330855-d0db8cc6a79c?w=400&h=300&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1574781330855-d0db8cc6a79c?w=800&h=500&fit=crop",
      "https://images.unsplash.com/photo-1605021154242-affb1448b3b8?w=800&h=500&fit=crop",
      "https://images.unsplash.com/photo-1604217305989-16b15fad7e9a?w=800&h=500&fit=crop",
      "https://images.unsplash.com/photo-1605021157793-e9d252b0a3e3?w=800&h=500&fit=crop",
    ],
    category: "Cultural Festival",
  },
 
 
  {
    id: 205,
    title: "Onam Festival in Kerala",
    location: "Kochi, Kerala",
    price: "₹3,900 per person",
    rating: "4.94",
    duration: "Full day",
    isFavorite: true,
    host: "Kerala Cultural Tours",
    description:
      "Experience the harvest festival of Kerala with traditional celebrations. This tour includes witnessing the spectacular floral carpet (pookalam), enjoying a traditional Onam Sadhya feast, and watching Kathakali performances.",
    image: "https://images.unsplash.com/photo-1600697230088-4992c83b2804?w=400&h=300&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1600697230088-4992c83b2804?w=800&h=500&fit=crop",
      "https://images.unsplash.com/photo-1600697230088-4992c83b2804?w=800&h=500&fit=crop",
      "https://images.unsplash.com/photo-1600697230088-4992c83b2804?w=800&h=500&fit=crop",
      "https://images.unsplash.com/photo-1600697230088-4992c83b2804?w=800&h=500&fit=crop",
    ],
    category: "Cultural Festival",
  },
  
  {
    id: 207,
    title: "Hornbill Festival Cultural Experience",
    location: "Kohima, Nagaland",
    date: "December 1-10, 2024",
    price: "₹5,200 per person",
    rating: "4.96",
    duration: "Full day",
    isFavorite: true,
    host: "Northeast Explorations",
    description:
      "Discover the rich cultural heritage of Nagaland's 16 tribes at the Festival of Festivals. This tour includes traditional dance performances, indigenous games, craft exhibitions, and sampling authentic Naga cuisine.",
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=300&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&h=500&fit=crop",
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&h=500&fit=crop",
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&h=500&fit=crop",
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&h=500&fit=crop",
    ],
    category: "Cultural Festival",
  },
]

// Services data
const servicesData = [
  {
    id: 301,
    title: "Professional Cleaning Service",
    description:
      "Comprehensive cleaning service for your property. Our professional team will ensure your space is spotless, using eco-friendly products and paying attention to every detail.",
    price: "₹1,500 per session",
    rating: "4.92",
    duration: "3-4 hours",
    provider: "CleanHome Services",
    image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=300&fit=crop",
    category: "Home Services",
    features: [
      "Deep cleaning of all rooms",
      "Kitchen and bathroom sanitization",
      "Dusting and vacuuming",
      "Eco-friendly products",
      "Experienced professionals",
    ],
  },
  {
    id: 302,
    title: "Airport Transfer Service",
    description:
      "Reliable and comfortable airport transfer service. Our professional drivers will ensure you reach your destination safely and on time, with complimentary water and Wi-Fi during your journey.",
    price: "₹1,200 per trip",
    rating: "4.95",
    duration: "Varies by distance",
    provider: "Premium Transfers",
    image: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=400&h=300&fit=crop",
    category: "Transportation",
    features: [
      "Professional, punctual drivers",
      "Clean, air-conditioned vehicles",
      "Flight tracking for pickups",
      "Complimentary water and Wi-Fi",
      "24/7 customer support",
    ],
  },
  {
    id: 303,
    title: "Personal Chef Experience",
    description:
      "Enjoy a customized dining experience in the comfort of your accommodation. Our professional chefs will prepare a gourmet meal based on your preferences, using fresh, local ingredients.",
    price: "₹4,500 per meal (for 2 people)",
    rating: "4.98",
    duration: "3-4 hours",
    provider: "Gourmet At Home",
    image: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=400&h=300&fit=crop",
    category: "Food & Dining",
    features: [
      "Customized menu planning",
      "Fresh, local ingredients",
      "Professional chef service",
      "Table setting and presentation",
      "Kitchen cleanup included",
    ],
  },
  {
    id: 304,
    title: "Yoga and Wellness Session",
    description:
      "Personalized yoga and wellness sessions at your accommodation. Our certified instructors will tailor the session to your experience level and wellness goals, providing all necessary equipment.",
    price: "₹1,800 per session",
    rating: "4.91",
    duration: "1-2 hours",
    provider: "Mindful Wellness",
    image: "https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?w=400&h=300&fit=crop",
    category: "Wellness",
    features: [
      "Certified yoga instructors",
      "Personalized session plans",
      "All equipment provided",
      "Suitable for all experience levels",
      "Meditation and breathing techniques",
    ],
  },
  {
    id: 305,
    title: "Professional Photography Session",
    description:
      "Capture your travel memories with a professional photography session. Our experienced photographers will take you to scenic locations and provide high-quality digital images of your experience.",
    price: "₹3,500 per session",
    rating: "4.94",
    duration: "2 hours",
    provider: "Capture Memories",
    image: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=400&h=300&fit=crop",
    category: "Photography",
    features: [
      "Professional photographer",
      "Multiple scenic locations",
      "30+ edited digital photos",
      "Quick turnaround time",
      "Optional photo album service",
    ],
  },
 
  {
    id: 307,
    title: "Guided City Tour",
    description:
      "Explore the city with a knowledgeable local guide. Discover hidden gems, historical sites, and local culture with personalized commentary and insider tips on the best places to visit.",
    price: "₹2,200 per person",
    rating: "4.93",
    duration: "4 hours",
    provider: "Local Explorers",
    image: "https://images.unsplash.com/photo-1569949381669-ecf31ae8e613?w=400&h=300&fit=crop",
    category: "Tours",
    features: [
      "Expert local guide",
      "Customizable itinerary",
      "Historical and cultural insights",
      "Small group experience",
      "Pickup from your accommodation",
    ],
  },
]

const locations = [
  {
    name: "Gautam Buddha Nagar",
    description: "Homes, hotels, and more",
    icon: <UserIcon className="w-5 h-5" />,
    available: true,
  },
  {
    name: "Gurgaon District",
    description: "Flats, apartments, and more",
    icon: <UserIcon className="w-5 h-5" />,
    available: true,
  },
  {
    name: "Dehradun",
    description: "Villas, cottages, and more",
    icon: <UserIcon className="w-5 h-5" />,
    available: true,
  },
  {
    name: "Delhi",
    description: "Coming soon",
    icon: <UserIcon className="w-5 h-5" />,
    available: false,
  },
  {
    name: "Mumbai",
    description: "Coming soon",
    icon: <UserIcon className="w-5 h-5" />,
    available: false,
  },
  {
    name: "Bangalore",
    description: "Coming soon",
    icon: <UserIcon className="w-5 h-5" />,
    available: false,
  },
]

interface PropertyCardProps {
  property: {
    id: number
    type: string
    title?: string
    price: string
    rating: string
    image: string
    isFavorite: boolean
  }
  onClick: (property: any) => void
}

function PropertyCard({ property, onClick }: PropertyCardProps) {
  const [isLiked, setIsLiked] = useState(property.isFavorite)

  return (
    <div className="group cursor-pointer h-full flex flex-col border border-gray-100 rounded-2xl p-3 hover:border-gray-200 transition-all duration-300" onClick={() => onClick(property)}>
      <div className="relative mb-4 overflow-hidden rounded-xl aspect-[4/3] shadow-sm group-hover:shadow-lg transition-all duration-300">
        <img
          src={property.image || "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop"}
          alt={property.title || property.type}
          className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-300"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop";
          }}
        />
        <button
          className="absolute top-3 right-3 p-2.5 rounded-full bg-white/90 hover:bg-white hover:scale-110 transition-all duration-200 cursor-pointer shadow-sm"
          onClick={(e) => {
            e.stopPropagation()
            setIsLiked(!isLiked)
          }}
        >
          <HeartIcon className={`w-4 h-4 transition-colors ${isLiked ? "text-red-500 fill-red-500" : "text-gray-600"}`} />
        </button>
      </div>
      <div className="flex flex-col flex-1 space-y-3">
        <div className="flex justify-between items-start gap-3 min-h-[3rem]">
          <h3 className="font-semibold text-gray-900 text-base leading-tight line-clamp-2 flex-1">
            {property.title || property.type}
          </h3>
          <div className="flex items-center gap-1 flex-shrink-0 bg-gray-50 px-2 py-1 rounded-full">
            <StarIcon className="w-3.5 h-3.5 fill-black text-black" />
            <span className="text-sm font-medium">{property.rating}</span>
          </div>
        </div>
        <div>
          <p className="text-gray-900 font-semibold text-base">{property.price}</p>
        </div>
      </div>
    </div>
  )
}

interface ExperienceCardProps {
  experience: {
    id: number
    title: string
    location: string
    price: string
    rating: string
    duration: string
    image: string
    isFavorite?: boolean
    category?: string
  }
  onClick: (experience: any) => void
}

function ExperienceCard({ experience, onClick }: ExperienceCardProps) {
  const [isLiked, setIsLiked] = useState(experience.isFavorite)

  return (
    <div className="group cursor-pointer" onClick={() => onClick(experience)}>
      <div className="relative mb-3 overflow-hidden rounded-xl aspect-[4/3]">
        <img
          src={experience.image || "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=300&fit=crop"}
          alt={experience.title}
          className="w-full h-full object-cover transition-transform group-hover:scale-105"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=300&fit=crop";
          }}
        />
        <button
          className="absolute top-3 right-3 p-2 rounded-full bg-white/80 hover:bg-white transition-colors cursor-pointer"
          onClick={(e) => {
            e.stopPropagation()
            setIsLiked(!isLiked)
          }}
        >
          <HeartIcon className={`w-4 h-4 ${isLiked ? "text-red-500 fill-red-500" : "text-gray-600"}`} />
        </button>
      </div>
      <div className="space-y-1">
        <div className="flex justify-between items-start gap-2">
          <h3 className="font-semibold text-gray-900 text-sm leading-tight line-clamp-2 flex-1">{experience.title}</h3>
          <div className="flex items-center gap-1 flex-shrink-0">
            <StarIcon className="w-3 h-3 fill-black text-black" />
            <span className="text-sm font-medium">{experience.rating}</span>
          </div>
        </div>
        <p className="text-gray-600 text-sm truncate">{experience.location}</p>
        <div className="flex items-center text-gray-600 text-sm">
          <ClockIcon className="w-3 h-3 mr-1" />
          <span className="truncate">{experience.duration}</span>
        </div>
        <p className="text-gray-900 font-semibold text-sm">{experience.price}</p>
      </div>
    </div>
  )
}

interface ServiceCardProps {
  service: {
    id: number
    title: string
    description: string
    price: string
    rating: string
    duration: string
    image: string
    category: string
  }
  onClick: (service: any) => void
}

function ServiceCard({ service, onClick }: ServiceCardProps) {
  const [isLiked, setIsLiked] = useState(false)

  return (
    <div className="group cursor-pointer" onClick={() => onClick(service)}>
      <div className="relative mb-3 overflow-hidden rounded-xl aspect-[4/3]">
        <img
          src={service.image || "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=300&fit=crop"}
          alt={service.title}
          className="w-full h-full object-cover transition-transform group-hover:scale-105"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=300&fit=crop";
          }}
        />
        <div className="absolute top-3 left-3 bg-white px-2 py-1 rounded-full text-xs font-medium shadow-sm">
          {service.category}
        </div>
        <button
          className="absolute top-3 right-3 p-2 rounded-full bg-white/80 hover:bg-white transition-colors cursor-pointer"
          onClick={(e) => {
            e.stopPropagation()
            setIsLiked(!isLiked)
          }}
        >
          <HeartIcon className={`w-4 h-4 ${isLiked ? "text-red-500 fill-red-500" : "text-gray-600"}`} />
        </button>
      </div>
      <div className="space-y-1">
        <div className="flex justify-between items-start gap-2">
          <h3 className="font-semibold text-gray-900 text-sm leading-tight line-clamp-2 flex-1">{service.title}</h3>
          <div className="flex items-center gap-1 flex-shrink-0">
            <StarIcon className="w-3 h-3 fill-black text-black" />
            <span className="text-sm font-medium">{service.rating}</span>
          </div>
        </div>
        <div className="flex items-center text-gray-600 text-sm">
          <ClockIcon className="w-3 h-3 mr-1" />
          <span className="truncate">{service.duration}</span>
        </div>
        <p className="text-gray-900 font-semibold text-sm">{service.price}</p>
      </div>
    </div>
  )
}

interface SectionProps {
  title: string
  items: any[]
  renderItem: (item: any) => React.ReactNode
}

function Section({ title, items, renderItem }: SectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -364, behavior: "smooth" })
    }
  }

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 364, behavior: "smooth" })
    }
  }

  return (
    <div className="mb-16">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl md:text-3xl font-semibold text-gray-900">{title}</h2>
        <div className="flex items-center gap-3">
          <button
            onClick={scrollLeft}
            className="p-3 rounded-full bg-white border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200 cursor-pointer"
          >
            <ChevronLeftIcon className="w-4 h-4 text-gray-600" />
          </button>
          <button
            onClick={scrollRight}
            className="p-2 rounded-full border border-gray-300 hover:shadow-md transition-shadow cursor-pointer"
          >
            <ChevronRightIcon className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>

      <div ref={scrollRef} className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide scroll-smooth">
        {items.map((item, index) => (
          <div key={item.id || index} className="w-85 md:w-71 flex-shrink-0">
            {renderItem(item)}
          </div>
        ))}
      </div>
    </div>
  )
}

function PropertyDetailsModal({ property, onClose }: { property: any; onClose: () => void }) {
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [checkInDate, setCheckInDate] = useState<Date | null>(null)
  const [checkOutDate, setCheckOutDate] = useState<Date | null>(null)
  const [showCalendar, setShowCalendar] = useState(false)
  const [calendarType, setCalendarType] = useState<"checkIn" | "checkOut">("checkIn")
  const [isBooked, setIsBooked] = useState(false)

  const images = property.images || [property.image, property.image, property.image, property.image]

  const formatDate = (date: Date | null) => {
    if (!date) return "Select date"
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  }

  const handleDateSelect = (date: Date) => {
    if (calendarType === "checkIn") {
      setCheckInDate(date)
      setCalendarType("checkOut")
    } else {
      if (checkInDate && date <= checkInDate) {
        // If check-out date is before or same as check-in, set it as new check-in and clear check-out
        setCheckInDate(date)
        setCheckOutDate(null)
        setCalendarType("checkOut")
      } else {
        setCheckOutDate(date)
        setShowCalendar(false)
      }
    }
  }

  const resetDates = () => {
    setCheckInDate(null)
    setCheckOutDate(null)
  }

  const handleReserve = () => {
    setIsBooked(true)
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[85vh] overflow-y-auto scrollbar-hide border border-gray-100">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-50 bg-white rounded-full p-2 border border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer"
        >
          <XIcon className="w-4 h-4 text-gray-600" />
        </button>

        <div className="relative">
          <div className="aspect-video relative overflow-hidden rounded-t-2xl">
            <img
              src={images[activeImageIndex] || "/placeholder.svg"}
              alt={property.title || property.type}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex gap-2 p-3 bg-white border-b border-gray-100">
            {images.map((image: string, index: number) => (
              <button
                key={index}
                onClick={() => setActiveImageIndex(index)}
                className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                  activeImageIndex === index ? "border-red-500" : "border-gray-200"
                }`}
              >
                <img src={image || "/placeholder.svg"} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        <div className="p-5">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-xl font-semibold text-gray-900 mb-1">{property.title || property.type}</h1>
              <p className="text-gray-600 text-sm">{property.location || property.type}</p>
            </div>
            <div className="flex items-center gap-1">
              <StarIcon className="w-4 h-4 fill-black" />
              <span className="font-medium text-sm">{property.rating}</span>
            </div>
          </div>

          {property.host && (
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <div>
                <h2 className="text-sm font-medium">Hosted by {property.host}</h2>
                {property.hostRating && (
                  <div className="flex items-center gap-1 mt-1">
                    <StarIcon className="w-3 h-3 fill-black" />
                    <span className="text-xs text-gray-600">{property.hostRating} host rating</span>
                  </div>
                )}
              </div>
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium">{property.host.charAt(0)}</span>
              </div>
            </div>
          )}

          {(property.bedrooms || property.bathrooms || property.guests) && (
            <div className="flex gap-6 py-3 border-b border-gray-100">
              {property.guests && (
                <div>
                  <p className="font-medium text-sm">Guests</p>
                  <p className="text-gray-600 text-xs">{property.guests} max</p>
                </div>
              )}
              {property.bedrooms && (
                <div>
                  <p className="font-medium text-sm">Bedrooms</p>
                  <p className="text-gray-600 text-xs">{property.bedrooms}</p>
                </div>
              )}
              {property.bathrooms && (
                <div>
                  <p className="font-medium text-sm">Bathrooms</p>
                  <p className="text-gray-600 text-xs">{property.bathrooms}</p>
                </div>
              )}
            </div>
          )}

          {property.description && (
            <div className="py-3 border-b border-gray-100">
              <h2 className="text-sm font-medium mb-2">About this place</h2>
              <p className="text-gray-600 text-sm leading-relaxed">{property.description}</p>
            </div>
          )}

          {property.amenities && property.amenities.length > 0 && (
            <div className="py-3 border-b border-gray-100">
              <h2 className="text-sm font-medium mb-3">What this place offers</h2>
              <div className="grid grid-cols-2 gap-2">
                {property.amenities.map((amenity: string, index: number) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
                      <span className="text-xs">✓</span>
                    </div>
                    <span className="text-sm text-gray-700">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="py-3 border-b border-gray-100">
            <h2 className="text-sm font-medium mb-3">Select dates</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
              <button
                onClick={() => {
                  setCalendarType("checkIn")
                  setShowCalendar(true)
                }}
                className="p-4 border border-gray-200 rounded-lg flex flex-col items-start hover:border-gray-300 cursor-pointer transition-colors text-left min-h-[60px] justify-center"
              >
                <p className="text-xs font-semibold text-gray-700 mb-1">CHECK-IN</p>
                <p className="text-gray-900 text-sm font-medium">{formatDate(checkInDate)}</p>
              </button>
              <button
                onClick={() => {
                  setCalendarType("checkOut")
                  setShowCalendar(true)
                }}
                className="p-4 border border-gray-200 rounded-lg flex flex-col items-start hover:border-gray-300 cursor-pointer transition-colors text-left min-h-[60px] justify-center"
              >
                <p className="text-xs font-semibold text-gray-700 mb-1">CHECK-OUT</p>
                <p className="text-gray-900 text-sm font-medium">{formatDate(checkOutDate)}</p>
              </button>
            </div>

            {showCalendar && (
              <div className="rounded-2xl p-6 mb-4 bg-gray-50">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-base text-gray-900">
                    {calendarType === "checkIn" ? "Select check-in date" : "Select check-out date"}
                  </h3>
                  <button
                    onClick={() => setShowCalendar(false)}
                    className="text-gray-500 hover:text-gray-700 transition-colors cursor-pointer"
                  >
                    <XIcon className="w-5 h-5" />
                  </button>
                </div>
                <Calendar
                  mode="single"
                  selected={calendarType === "checkIn" ? checkInDate : checkOutDate}
                  onSelect={(date) => date && handleDateSelect(date)}
                  disabled={(date) => {
                    const today = new Date()
                    today.setHours(0, 0, 0, 0)
                    return date < today || (calendarType === "checkOut" && checkInDate ? date <= checkInDate : false)
                  }}
                  className=""
                />
                {(checkInDate || checkOutDate) && (
                  <div className="mt-4 flex justify-end">
                    <button onClick={resetDates} className="text-sm text-red-500 hover:text-red-600 font-medium cursor-pointer transition-colors">
                      Clear dates
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="mt-4 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div>
              <p className="text-xl font-semibold">{property.price}</p>
              <p className="text-gray-600 text-xs">Includes taxes and fees</p>
            </div>
            {isBooked ? (
              <div className="bg-green-500 text-white font-medium py-2 px-6 rounded-lg flex items-center gap-2 w-full sm:w-auto">
                <CheckIcon className="w-4 h-4" />
                <span className="text-sm">Reserved Successfully</span>
              </div>
            ) : (
              <button
                disabled={!checkInDate || !checkOutDate}
                onClick={handleReserve}
                className={`${
                  checkInDate && checkOutDate
                    ? "bg-red-500 hover:bg-red-600 cursor-pointer"
                    : "bg-gray-300 cursor-not-allowed"
                } text-white font-medium py-2 px-6 rounded-lg transition-colors w-full sm:w-auto text-sm`}
              >
                {checkInDate && checkOutDate ? "Reserve" : "Select dates to reserve"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function Calendar({
  className,
  mode,
  selected,
  onSelect,
  disabled,
}: {
  className?: string
  mode: "single"
  selected: Date | null
  onSelect: (date: Date | null) => void
  disabled?: (date: Date) => boolean
}) {
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay()
  }

  const renderCalendarDays = () => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()
    const daysInMonth = getDaysInMonth(year, month)
    const firstDay = getFirstDayOfMonth(year, month)

    const days = []

    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-10"></div>)
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day)
      const isSelected =
        selected &&
        date.getDate() === selected.getDate() &&
        date.getMonth() === selected.getMonth() &&
        date.getFullYear() === selected.getFullYear()

      const isDisabled = disabled ? disabled(date) : false

      days.push(
        <button
          key={day}
          onClick={() => !isDisabled && onSelect(date)}
          disabled={isDisabled}
          className={`h-10 w-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200 ${
            isSelected
              ? "bg-black text-white shadow-md scale-105"
              : isDisabled
                ? "text-gray-300 cursor-not-allowed"
                : "text-gray-700 hover:bg-gray-100 hover:scale-105 cursor-pointer"
          }`}
        >
          {day}
        </button>,
      )
    }

    return days
  }

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))
  }

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))
  }

  return (
    <div className={`${className} p-2`}>
      <div className="flex justify-between items-center mb-6">
        <button 
          onClick={prevMonth} 
          className="p-2 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
        >
          <ChevronLeftIcon className="w-5 h-5 text-gray-600" />
        </button>
        <h3 className="font-semibold text-lg text-gray-900">
          {currentMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
        </h3>
        <button 
          onClick={nextMonth} 
          className="p-2 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
        >
          <ChevronRightIcon className="w-5 h-5 text-gray-600" />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-2 mb-4">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
          <div key={day} className="h-10 flex items-center justify-center text-sm font-medium text-gray-500">
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-2">{renderCalendarDays()}</div>
    </div>
  )
}

function ExperienceDetailsModal({ experience, onClose }: { experience: any; onClose: () => void }) {
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [isBooked, setIsBooked] = useState(false)

  const images = experience.images || [experience.image, experience.image, experience.image, experience.image]

  const handleBookNow = () => {
    setIsBooked(true)
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white/90 backdrop-blur-md rounded-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-50 bg-white/80 backdrop-blur-sm rounded-full p-3 shadow-md hover:bg-gray-100 transition-colors cursor-pointer"
        >
          <XIcon className="w-6 h-6 text-gray-700" />
        </button>

        <div className="relative">
          <div className="aspect-video relative overflow-hidden">
            <img
              src={images[activeImageIndex] || "/placeholder.svg"}
              alt={experience.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex gap-3 p-4 bg-white/80 backdrop-blur-sm">
            {images.map((image: string, index: number) => (
              <button
                key={index}
                onClick={() => setActiveImageIndex(index)}
                className={`w-24 h-24 rounded-md overflow-hidden border-2 ${
                  activeImageIndex === index ? "border-red-500" : "border-transparent"
                }`}
              >
                <img src={image || "/placeholder.svg"} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        <div className="p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{experience.title}</h1>
              <p className="text-gray-600 text-lg">{experience.location}</p>
            </div>
            <div className="flex items-center gap-1">
              <StarIcon className="w-6 h-6 fill-black" />
              <span className="font-medium text-lg">{experience.rating}</span>
            </div>
          </div>

          {experience.host && (
            <div className="flex items-center justify-between py-6 border-b border-gray-200">
              <div>
                <h2 className="text-xl font-semibold">Hosted by {experience.host}</h2>
              </div>
            </div>
          )}

          {experience.description && (
            <div className="py-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold mb-3">About this experience</h2>
              <p className="text-gray-600 text-lg">{experience.description}</p>
            </div>
          )}

          <div className="mt-8 flex flex-col sm:flex-row justify-between items-center gap-6">
            <div>
              <p className="text-3xl font-bold">{experience.price}</p>
            </div>
            {isBooked ? (
              <div className="bg-green-500 text-white font-medium py-4 px-8 rounded-lg flex items-center gap-3 w-full sm:w-auto">
                <CheckIcon className="w-6 h-6" />
                Booked Successfully
              </div>
            ) : (
              <button
                onClick={handleBookNow}
                className="bg-red-500 hover:bg-red-600 text-white font-medium py-4 px-8 rounded-lg transition-colors w-full sm:w-auto text-lg cursor-pointer"
              >
                Book now
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function ServiceDetailsModal({ service, onClose }: { service: any; onClose: () => void }) {
  const [isBooked, setIsBooked] = useState(false)

  const handleBookNow = () => {
    setIsBooked(true)
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white/90 backdrop-blur-md rounded-xl max-w-md w-full p-8 shadow-xl modal-content">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-50 bg-white/90 rounded-full p-3 shadow-md hover:bg-gray-100 transition-colors cursor-pointer"
        >
          <XIcon className="w-5 h-5 text-gray-700" />
        </button>

        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">{service.title}</h2>
        <p className="text-gray-600 text-base md:text-lg mb-6">{service.description}</p>

        <div className="flex flex-col sm:flex-row items-center justify-between py-6 border-t border-gray-200 gap-4">
          <div>
            <p className="text-xl md:text-2xl font-bold">{service.price}</p>
            <p className="text-gray-600 text-base md:text-lg">Per session</p>
          </div>
          {isBooked ? (
            <div className="bg-green-500 text-white font-medium py-3 px-6 rounded-lg flex items-center gap-3">
              <CheckIcon className="w-5 h-5" />
              Booked
            </div>
          ) : (
            <button
              onClick={handleBookNow}
              className="bg-red-500 hover:bg-red-600 text-white font-medium py-3 px-6 rounded-lg transition-colors cursor-pointer"
            >
              Book now
            </button>
          )}
        </div>
      </div>
    </div>
  )
}


// Available amenities with icons
const availableAmenities = [
  { name: 'Free WiFi', icon: <WifiIcon className="w-4 h-4" /> },
  { name: 'Free parking', icon: <CarIcon className="w-4 h-4" /> },
  { name: 'Kitchen', icon: <UtensilsIcon className="w-4 h-4" /> },
  { name: 'TV', icon: <TvIcon className="w-4 h-4" /> },
  { name: 'Air conditioning', icon: <WifiIcon className="w-4 h-4" /> },
  { name: 'Swimming pool', icon: <WifiIcon className="w-4 h-4" /> },
  { name: 'Gym', icon: <WifiIcon className="w-4 h-4" /> },
  { name: 'Balcony', icon: <WifiIcon className="w-4 h-4" /> }
]

// Add Property Modal Component
function AddPropertyModal({ onClose, newProperty, setNewProperty }: { 
  onClose: () => void; 
  newProperty: {
    title: string;
    type: string;
    location: string;
    price: string;
    bedrooms: number;
    bathrooms: number;
    guests: number;
    description: string;
    amenities: string[];
    images: string[];
  };
  setNewProperty: React.Dispatch<React.SetStateAction<{
    title: string;
    type: string;
    location: string;
    price: string;
    bedrooms: number;
    bathrooms: number;
    guests: number;
    description: string;
    amenities: string[];
    images: string[];
  }>>;
}) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the data to your backend
    alert('Property added successfully! (This is a demo)')
    onClose()
  }

  const toggleAmenity = (amenity: string) => {
    setNewProperty(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }))
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto modal-content">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold">Add New Property</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Property Title</label>
              <input
                type="text"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                value={newProperty.title}
                onChange={(e) => setNewProperty(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Property Type</label>
              <select
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                value={newProperty.type}
                onChange={(e) => setNewProperty(prev => ({ ...prev, type: e.target.value }))}
              >
                <option value="">Select type</option>
                <option value="Apartment">Apartment</option>
                <option value="House">House</option>
                <option value="Villa">Villa</option>
                <option value="Hotel">Hotel</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
            <input
              type="text"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              value={newProperty.location}
              onChange={(e) => setNewProperty(prev => ({ ...prev, location: e.target.value }))}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Bedrooms</label>
              <input
                type="number"
                min="1"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                value={newProperty.bedrooms}
                onChange={(e) => setNewProperty(prev => ({ ...prev, bedrooms: parseInt(e.target.value) }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Bathrooms</label>
              <input
                type="number"
                min="1"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                value={newProperty.bathrooms}
                onChange={(e) => setNewProperty(prev => ({ ...prev, bathrooms: parseInt(e.target.value) }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Max Guests</label>
              <input
                type="number"
                min="1"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                value={newProperty.guests}
                onChange={(e) => setNewProperty(prev => ({ ...prev, guests: parseInt(e.target.value) }))}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Price per night</label>
            <input
              type="text"
              required
              placeholder="₹2,500"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              value={newProperty.price}
              onChange={(e) => setNewProperty(prev => ({ ...prev, price: e.target.value }))}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              rows={4}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
              value={newProperty.description}
              onChange={(e) => setNewProperty(prev => ({ ...prev, description: e.target.value }))}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Amenities</label>
            <div className="grid grid-cols-2 gap-2">
              {availableAmenities.map((amenity) => (
                <label key={amenity.name} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newProperty.amenities.includes(amenity.name)}
                    onChange={() => toggleAmenity(amenity.name)}
                    className="rounded border-gray-300 text-red-500 focus:ring-red-500"
                  />
                  <span className="flex items-center space-x-1">
                    {amenity.icon}
                    <span className="text-sm">{amenity.name}</span>
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Add Property
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Footer Component
function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <svg className="w-8 h-8 text-red-500" viewBox="0 0 32 32" fill="currentColor">
                <path d="M16 1C7.7 1 1 7.7 1 16s6.7 15 15 15 15-6.7 15-15S24.3 1 16 1zm0 2.8c6.7 0 12.2 5.5 12.2 12.2S22.7 28.2 16 28.2 3.8 22.7 3.8 16 9.3 3.8 16 3.8z" />
                <path d="M16 7.5c-4.7 0-8.5 3.8-8.5 8.5s3.8 8.5 8.5 8.5 8.5-3.8 8.5-8.5-3.8-8.5-8.5-8.5zm0 2.1c3.5 0 6.4 2.9 6.4 6.4s-2.9 6.4-6.4 6.4-6.4-2.9-6.4-6.4 2.9-6.4 6.4-6.4z" />
                <path d="M16 11.1c-2.7 0-4.9 2.2-4.9 4.9s2.2 4.9 4.9 4.9 4.9-2.2 4.9-4.9-2.2-4.9-4.9-4.9z" />
              </svg>
              <span className="ml-2 text-xl font-bold text-red-500">aircnc</span>
            </div>
            <p className="text-gray-600 text-sm">
              Your trusted platform for unique accommodations and unforgettable experiences.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Support</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="#" className="hover:text-gray-900">Help Center</a></li>
              <li><a href="#" className="hover:text-gray-900">Safety information</a></li>
              <li><a href="#" className="hover:text-gray-900">Cancellation options</a></li>
              <li><a href="#" className="hover:text-gray-900">Contact us</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Community</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="#" className="hover:text-gray-900">Diversity & Belonging</a></li>
              <li><a href="#" className="hover:text-gray-900">Accessibility</a></li>
              <li><a href="#" className="hover:text-gray-900">Partners</a></li>
              <li><a href="#" className="hover:text-gray-900">Guest Referrals</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Hosting</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="#" className="hover:text-gray-900">Try hosting</a></li>
              <li><a href="#" className="hover:text-gray-900">Responsible hosting</a></li>
              <li><a href="#" className="hover:text-gray-900">Community Center</a></li>
              <li><a href="#" className="hover:text-gray-900">Host resources</a></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-4 mb-4 md:mb-0">
            <p className="text-sm text-gray-600">© 2024 Aircnc, Inc.</p>
            <span className="text-gray-300">·</span>
            <a href="#" className="text-sm text-gray-600 hover:text-gray-900">Privacy</a>
            <span className="text-gray-300">·</span>
            <a href="#" className="text-sm text-gray-600 hover:text-gray-900">Terms</a>
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-900">
              <GlobeIcon className="w-4 h-4" />
              <span>English (IN)</span>
            </button>
            <button className="text-sm text-gray-600 hover:text-gray-900">₹ INR</button>
            <div className="flex space-x-2">
              <FacebookIcon className="w-5 h-5 text-gray-400 hover:text-gray-600 cursor-pointer" />
              <TwitterIcon className="w-5 h-5 text-gray-400 hover:text-gray-600 cursor-pointer" />
              <InstagramIcon className="w-5 h-5 text-gray-400 hover:text-gray-600 cursor-pointer" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default function AirCnCClone() {
  const [showSideMenu, setShowSideMenu] = useState(false)
  const [selectedProperty, setSelectedProperty] = useState<any>(null)
  const [selectedExperience, setSelectedExperience] = useState<any>(null)
  const [selectedService, setSelectedService] = useState<any>(null)
  const [activeTab, setActiveTab] = useState<"homes" | "experiences" | "services">("homes")
  const [showUnderConstruction, setShowUnderConstruction] = useState(false)
  const [underConstructionMessage, setUnderConstructionMessage] = useState("")
  const [showAddPropertyModal, setShowAddPropertyModal] = useState(false)

  // Search functionality
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null)
  const [checkInDate, setCheckInDate] = useState<Date | null>(null)
  const [checkOutDate, setCheckOutDate] = useState<Date | null>(null)
  const [guestCount, setGuestCount] = useState({ adults: 0, children: 0, infants: 0, pets: 0 })
  const [showWhereDropdown, setShowWhereDropdown] = useState(false)
  const [showDatesDropdown, setShowDatesDropdown] = useState(false)
  const [showGuestsDropdown, setShowGuestsDropdown] = useState(false)
  const [calendarType, setCalendarType] = useState<"checkIn" | "checkOut">("checkIn")

  // Add property form state
  const [newProperty, setNewProperty] = useState({
    title: '',
    type: '',
    location: '',
    price: '',
    bedrooms: 1,
    bathrooms: 1,
    guests: 2,
    description: '',
    amenities: [] as string[],
    images: [] as string[]
  })

  // Refs for dropdown positioning
  const whereRef = useRef<HTMLDivElement>(null)
  const datesRef = useRef<HTMLDivElement>(null)
  const guestsRef = useRef<HTMLDivElement>(null)

  // Format date function
  const formatDate = (date: Date | null) => {
    if (!date) return "Add date"
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  }

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (whereRef.current && !whereRef.current.contains(event.target as Node)) {
        setShowWhereDropdown(false)
      }
      if (datesRef.current && !datesRef.current.contains(event.target as Node)) {
        setShowDatesDropdown(false)
      }
      if (guestsRef.current && !guestsRef.current.contains(event.target as Node)) {
        setShowGuestsDropdown(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Prevent scrolling when dropdown or modal is open
  useEffect(() => {
    if (
      selectedProperty || 
      selectedExperience || 
      selectedService || 
      showSideMenu || 
      showUnderConstruction || 
      showAddPropertyModal
    ) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }

    return () => {
      document.body.style.overflow = "auto"
    }
  }, [
    selectedProperty, 
    selectedExperience, 
    selectedService, 
    showSideMenu, 
    showUnderConstruction, 
    showAddPropertyModal
  ])

  const handleBecomeHostClick = () => {
    setShowAddPropertyModal(true)
  }

  const handleGlobalIconClick = () => {
    setUnderConstructionMessage(
      "Global feature is currently under construction. We're working hard to bring you this feature soon!",
    )
    setShowUnderConstruction(true)
  }

  const handleLoginClick = () => {
    setUnderConstructionMessage(
      "Login feature is currently under construction. We're working hard to bring you this feature soon!"
    )
    setShowUnderConstruction(true)
    setShowSideMenu(false)
  }

  const handleBookingHistoryClick = () => {
    setUnderConstructionMessage(
      "Booking History feature is currently under construction. We're working hard to bring you this feature soon!",
    )
    setShowUnderConstruction(true)
    setShowSideMenu(false)
  }

  const handleLikedPropertiesClick = () => {
    setUnderConstructionMessage(
      "Liked Properties feature is currently under construction. We're working hard to bring you this feature soon!",
    )
    setShowUnderConstruction(true)
    setShowSideMenu(false)
  }

  const closePropertyModal = () => {
    setSelectedProperty(null)
  }

  const closeExperienceModal = () => {
    setSelectedExperience(null)
  }

  const closeServiceModal = () => {
    setSelectedService(null)
  }

  const handlePropertyClick = (property: any) => {
    setSelectedProperty(property)
  }

  const handleExperienceClick = (experience: any) => {
    setSelectedExperience(experience)
  }

  const handleServiceClick = (service: any) => {
    setSelectedService(service)
  }

  const handleLocationSelect = (locationName: string) => {
    setSelectedLocation(locationName)
    setShowWhereDropdown(false)
  }

  const updateGuestCount = (type: string, increment: boolean) => {
    setGuestCount((prev) => ({
      ...prev,
      [type as keyof typeof prev]: Math.max(0, prev[type as keyof typeof prev] + (increment ? 1 : -1)),
    }))
  }

  const totalGuests = guestCount.adults + guestCount.children + guestCount.infants + guestCount.pets

  const resetDates = () => {
    setCheckInDate(null)
    setCheckOutDate(null)
    setCalendarType("checkIn")
  }

  const handleDateSelect = (date: Date) => {
    if (calendarType === "checkIn") {
      setCheckInDate(date)
      setCalendarType("checkOut")
    } else {
      if (checkInDate && date <= checkInDate) {
        // If check-out date is before or same as check-in, set it as new check-in and clear check-out
        setCheckInDate(date)
        setCheckOutDate(null)
        setCalendarType("checkOut")
      } else {
        setCheckOutDate(date)
        setShowDatesDropdown(false)
      }
    }
  }

  // Add home page redirection function
  const goToHomePage = () => {
    setActiveTab("homes")
    setSelectedLocation(null)
    setCheckInDate(null)
    setCheckOutDate(null)
    setGuestCount({ adults: 0, children: 0, infants: 0, pets: 0 })
  }

  // Fix the search functionality - only filter when search button is clicked
  const [isSearchActive, setIsSearchActive] = useState(false)

  const handleSearchClick = () => {
    if (selectedLocation || checkInDate || checkOutDate || totalGuests > 0) {
      setIsSearchActive(true)
    }
  }

  const filteredProperties = useMemo(() => {
    if (!isSearchActive || !selectedLocation) {
      return []
    }

    return [...popularHomesData, ...gurgaonData, ...dehradunData].filter((property) => {
      if (property.area === selectedLocation) {
        return true
      }
      return false
    })
  }, [selectedLocation, isSearchActive])

  const isSearchReady = selectedLocation && checkInDate && checkOutDate && totalGuests > 0

  return (
    <div className="min-h-screen bg-white">
      {/* Side Menu - Mobile Only */}
      {showSideMenu && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="bg-black/50 flex-grow" onClick={() => setShowSideMenu(false)}></div>
          <div className="bg-white w-80 p-6 overflow-y-auto shadow-xl">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-bold">Menu</h2>
              <button
                onClick={() => setShowSideMenu(false)}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <XIcon className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">Your Account</h3>
                <div className="space-y-3">
                  <button
                    onClick={handleLoginClick}
                    className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-gray-100 text-left cursor-pointer"
                  >
                    <UserIcon className="w-5 h-5" />
                    <span>Log in</span>
                  </button>
                  <button
                    onClick={handleBookingHistoryClick}
                    className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-gray-100 text-left cursor-pointer"
                  >
                    <CalendarIcon className="w-5 h-5" />
                    <span>Booking History</span>
                  </button>
                  <button
                    onClick={handleLikedPropertiesClick}
                    className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-gray-100 text-left cursor-pointer"
                  >
                    <HeartIcon className="w-5 h-5" />
                    <span>Liked Properties</span>
                  </button>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-3">Hosting</h3>
                <button
                  onClick={handleBecomeHostClick}
                  className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-gray-100 text-left cursor-pointer"
                >
                  <PlusIcon className="w-5 h-5" />
                  <span>Become a host</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Under Construction Message */}
      {showUnderConstruction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-lg p-8 max-w-md mx-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              <Construction className="inline-block w-6 h-6 mr-2" /> Under Construction
            </h2>
            <p className="text-gray-600 mb-6">{underConstructionMessage}</p>
            <button
              onClick={() => setShowUnderConstruction(false)}
              className="w-full bg-red-500 hover:bg-red-600 text-white py-3 px-4 rounded-lg font-medium transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Add Property Modal */}
      {showAddPropertyModal && (
        <AddPropertyModal 
          onClose={() => setShowAddPropertyModal(false)} 
          newProperty={newProperty}
          setNewProperty={setNewProperty}
        />
      )}

      {/* Property Details Modal */}
      {selectedProperty && <PropertyDetailsModal property={selectedProperty} onClose={closePropertyModal} />}

      {/* Experience Details Modal */}
      {selectedExperience && <ExperienceDetailsModal experience={selectedExperience} onClose={closeExperienceModal} />}

      {/* Service Details Modal */}
      {selectedService && <ServiceDetailsModal service={selectedService} onClose={closeServiceModal} />}

      {/* Header with Search Section */}
      <div className="border-b border-gray-200 bg-white shadow-sm">
        {/* Header */}
        <div className="w-full px-4 md:px-6">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <div className="flex items-center cursor-pointer" onClick={goToHomePage}>
              <svg className="w-8 h-8 text-red-500" viewBox="0 0 32 32" fill="currentColor">
                <path d="M16 1C7.7 1 1 7.7 1 16s6.7 15 15 15 15-6.7 15-15S24.3 1 16 1zm0 2.8c6.7 0 12.2 5.5 12.2 12.2S22.7 28.2 16 28.2 3.8 22.7 3.8 16 9.3 3.8 16 3.8z" />
                <path d="M16 7.5c-4.7 0-8.5 3.8-8.5 8.5s3.8 8.5 8.5 8.5 8.5-3.8 8.5-8.5-3.8-8.5-8.5-8.5zm0 2.1c3.5 0 6.4 2.9 6.4 6.4s-2.9 6.4-6.4 6.4-6.4-2.9-6.4-6.4 2.9-6.4 6.4-6.4z" />
                <path d="M16 11.1c-2.7 0-4.9 2.2-4.9 4.9s2.2 4.9 4.9 4.9 4.9-2.2 4.9-4.9-2.2-4.9-4.9-4.9z" />
              </svg>
              <span className="ml-2 text-xl font-bold text-red-500">aircnc</span>
            </div>

            {/* Desktop Navigation - centered */}
            <div className="absolute left-1/2 transform -translate-x-1/2 hidden md:flex items-center space-x-8 h-full">
              <div
                className={`flex items-center space-x-2 h-full ${
                  activeTab === "homes" ? "border-b-2 border-black" : ""
                } cursor-pointer`}
                onClick={() => setActiveTab("homes")}
              >
                <HomeIcon className="w-5 h-5" />
                <span className={`font-medium ${activeTab === "homes" ? "text-black" : "text-gray-600"}`}>Homes</span>
              </div>
              <div
                className={`flex items-center space-x-2 h-full ${
                  activeTab === "experiences" ? "border-b-2 border-black" : ""
                } cursor-pointer`}
                onClick={() => setActiveTab("experiences")}
              >
                <WineIcon className="w-5 h-5" />
                <span className={`font-medium ${activeTab === "experiences" ? "text-black" : "text-gray-600"}`}>
                  Experiences
                </span>
              </div>
              <div
                className={`flex items-center space-x-2 h-full ${
                  activeTab === "services" ? "border-b-2 border-black" : ""
                } cursor-pointer`}
                onClick={() => setActiveTab("services")}
              >
                <BellRingIcon className="w-5 h-5" />
                <span className={`font-medium ${activeTab === "services" ? "text-black" : "text-gray-600"}`}>
                  Services
                </span>
              </div>
            </div>

            {/* Right side - Desktop */}
            <div className="hidden md:flex items-center space-x-4">
              <button
                onClick={handleBecomeHostClick}
                className="text-gray-700 hover:bg-gray-100 font-medium px-4 py-2 rounded-full transition-colors cursor-pointer"
              >
                Become a host
              </button>
              <button
                className="p-3 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
                onClick={handleGlobalIconClick}
              >
                <GlobeIcon className="w-5 h-5 text-gray-700" />
              </button>
              <button
                onClick={handleLoginClick}
                className="flex items-center space-x-2 border border-gray-300 rounded-full px-4 py-2 hover:shadow-md transition-shadow cursor-pointer"
              >
                <MenuIcon className="w-4 h-4 text-gray-700" />
                <UserIcon className="w-6 h-6 text-gray-700" />
              </button>
            </div>

            {/* Right side - Mobile */}
            <div className="flex md:hidden items-center space-x-2">
              <button
                className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
                onClick={handleGlobalIconClick}
              >
                <GlobeIcon className="w-5 h-5 text-gray-700" />
              </button>
              <button
                className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
                onClick={() => setShowSideMenu(true)}
              >
                <MenuIcon className="w-5 h-5 text-gray-700" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="flex md:hidden justify-center border-t border-gray-200 py-2">
          <div className="flex space-x-8">
            <button
              className={`flex flex-col items-center py-2 px-4 ${
                activeTab === "homes" ? "text-red-500" : "text-gray-500"
              }`}
              onClick={() => setActiveTab("homes")}
            >
              <HomeIcon className="w-5 h-5 mb-1" />
              <span className="text-xs font-medium">Homes</span>
            </button>
            <button
              className={`flex flex-col items-center py-2 px-4 ${
                activeTab === "experiences" ? "text-red-500" : "text-gray-500"
              }`}
              onClick={() => setActiveTab("experiences")}
            >
              <WineIcon className="w-5 h-5 mb-1" />
              <span className="text-xs font-medium">Experiences</span>
            </button>
            <button
              className={`flex flex-col items-center py-2 px-4 ${
                activeTab === "services" ? "text-red-500" : "text-gray-500"
              }`}
              onClick={() => setActiveTab("services")}
            >
              <BellRingIcon className="w-5 h-5 mb-1" />
              <span className="text-xs font-medium">Services</span>
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="py-4 pb-6 bg-white relative">
          <div className="max-w-4xl mx-auto px-4">
            <div className="flex items-center gap-4">
              <div className="bg-white rounded-full md:border md:border-gray-100 p-1 relative flex-1">
                <div className="flex flex-col md:flex-row items-stretch search-bar-mobile">
                  {/* Where dropdown */}
                  <div ref={whereRef} className="relative flex-1">
                    <div
                      className="px-4 md:px-6 py-3 cursor-pointer rounded-full md:rounded-r-none hover:bg-gray-50 transition-colors"
                      onClick={() => {
                        setShowWhereDropdown(!showWhereDropdown)
                        setShowDatesDropdown(false)
                        setShowGuestsDropdown(false)
                      }}
                    >
                      <div className="text-xs font-semibold text-gray-900 mb-1">Where</div>
                      <div className="text-gray-500 text-sm truncate">{selectedLocation || "Search destinations"}</div>
                    </div>
                    {showWhereDropdown && (
                      <div className="absolute top-full left-0 mt-2 w-full md:w-72 bg-white rounded-xl shadow-lg z-50 border border-gray-200">
                        <div className="p-4">
                          <h3 className="text-sm font-semibold mb-3">Search by destination</h3>
                          <div className="space-y-2">
                            {locations.map((location) => (
                              <div
                                key={location.name}
                                onClick={() => handleLocationSelect(location.name)}
                                className="flex items-center p-2 rounded-lg hover:bg-gray-100 cursor-pointer"
                              >
                                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                                  <MapPinIcon className="w-4 h-4 text-gray-600" />
                                </div>
                                <div>
                                  <h4 className="font-medium text-sm">{location.name}</h4>
                                  <p className="text-xs text-gray-500">{location.description}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="hidden md:block h-8 w-px bg-gray-200 my-auto"></div>

                  {/* Check-in dropdown */}
                  <div ref={datesRef} className="relative flex-1">
                    <div
                      className="px-4 md:px-6 py-3 cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => {
                        setShowDatesDropdown(!showDatesDropdown)
                        setShowWhereDropdown(false)
                        setShowGuestsDropdown(false)
                        setCalendarType("checkIn")
                      }}
                    >
                      <div className="text-xs font-semibold text-gray-900 mb-1">Check in</div>
                      <div className="text-gray-500 text-sm">{formatDate(checkInDate)}</div>
                    </div>
                    {showDatesDropdown && (
                      <div className="absolute top-full left-0 mt-2 w-full md:w-80 bg-white rounded-2xl shadow-xl z-50 overflow-hidden">
                        <div className="p-6">
                          <div className="flex justify-between items-center mb-4">
                            <h3 className="text-base font-semibold text-gray-900">
                              {calendarType === "checkIn" ? "Select check-in date" : "Select check-out date"}
                            </h3>
                            {(checkInDate || checkOutDate) && (
                              <button
                                onClick={resetDates}
                                className="text-sm text-red-500 hover:text-red-600 font-medium cursor-pointer transition-colors"
                              >
                                Clear dates
                              </button>
                            )}
                          </div>
                          <Calendar
                            mode="single"
                            selected={calendarType === "checkIn" ? checkInDate : checkOutDate}
                            onSelect={(date) => date && handleDateSelect(date)}
                            disabled={(date) => {
                              const today = new Date()
                              today.setHours(0, 0, 0, 0)
                              return (
                                date < today || (calendarType === "checkOut" && checkInDate ? date <= checkInDate : false)
                              )
                            }}
                            className=""
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="hidden md:block h-8 w-px bg-gray-200 my-auto"></div>

                  {/* Check-out dropdown */}
                  <div className="relative flex-1">
                    <div
                      className="px-4 md:px-6 py-3 cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => {
                        setShowDatesDropdown(!showDatesDropdown)
                        setShowWhereDropdown(false)
                        setShowGuestsDropdown(false)
                        setCalendarType("checkOut")
                      }}
                    >
                      <div className="text-xs font-semibold text-gray-900 mb-1">Check out</div>
                      <div className="text-gray-500 text-sm">{formatDate(checkOutDate)}</div>
                    </div>
                  </div>

                  <div className="hidden md:block h-8 w-px bg-gray-200 my-auto"></div>

                  {/* Guests dropdown */}
                  <div ref={guestsRef} className="relative flex-1">
                    <div
                      className="px-4 md:px-6 py-3 cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => {
                        setShowGuestsDropdown(!showGuestsDropdown)
                        setShowWhereDropdown(false)
                        setShowDatesDropdown(false)
                      }}
                    >
                      <div>
                        <div className="text-xs font-semibold text-gray-900 mb-1">Who</div>
                        <div className="text-gray-500 text-sm">
                          {totalGuests > 0 ? `${totalGuests} guest${totalGuests > 1 ? "s" : ""}` : "Add guests"}
                        </div>
                      </div>
                    </div>
                    {showGuestsDropdown && (
                      <div className="absolute top-full right-0 mt-2 w-full md:w-72 bg-white rounded-xl shadow-lg z-50 border border-gray-200">
                        <div className="p-4">
                          <h3 className="text-sm font-semibold mb-4">Who's coming?</h3>
                          <div className="space-y-4">
                            <div className="flex justify-between items-center">
                              <div>
                                <h4 className="font-medium text-sm">Adults</h4>
                                <p className="text-xs text-gray-500">Ages 13 or above</p>
                              </div>
                              <div className="flex items-center gap-3">
                                <button
                                  onClick={() => updateGuestCount("adults", false)}
                                  disabled={guestCount.adults === 0}
                                  className={`w-8 h-8 rounded-full border flex items-center justify-center ${
                                    guestCount.adults === 0 ? "text-gray-300 cursor-not-allowed" : "text-gray-700"
                                  } cursor-pointer`}
                                >
                                  <MinusIcon className="w-4 h-4" />
                                </button>
                                <span className="text-sm">{guestCount.adults}</span>
                                <button
                                  onClick={() => updateGuestCount("adults", true)}
                                  className="w-8 h-8 rounded-full border flex items-center justify-center text-gray-700 cursor-pointer"
                                >
                                  <PlusIcon className="w-4 h-4" />
                                </button>
                              </div>
                            </div>

                            <div className="flex justify-between items-center">
                              <div>
                                <h4 className="font-medium text-sm">Children</h4>
                                <p className="text-xs text-gray-500">Ages 2-12</p>
                              </div>
                              <div className="flex items-center gap-3">
                                <button
                                  onClick={() => updateGuestCount("children", false)}
                                  disabled={guestCount.children === 0}
                                  className={`w-8 h-8 rounded-full border flex items-center justify-center ${
                                    guestCount.children === 0 ? "text-gray-300 cursor-not-allowed" : "text-gray-700"
                                  } cursor-pointer`}
                                >
                                  <MinusIcon className="w-4 h-4" />
                                </button>
                                <span className="text-sm">{guestCount.children}</span>
                                <button
                                  onClick={() => updateGuestCount("children", true)}
                                  className="w-8 h-8 rounded-full border flex items-center justify-center text-gray-700 cursor-pointer"
                                >
                                  <PlusIcon className="w-4 h-4" />
                                </button>
                              </div>
                            </div>

                            <div className="flex justify-between items-center">
                              <div>
                                <h4 className="font-medium text-sm">Infants</h4>
                                <p className="text-xs text-gray-500">Under 2</p>
                              </div>
                              <div className="flex items-center gap-3">
                                <button
                                  onClick={() => updateGuestCount("infants", false)}
                                  disabled={guestCount.infants === 0}
                                  className={`w-8 h-8 rounded-full border flex items-center justify-center ${
                                    guestCount.infants === 0 ? "text-gray-300 cursor-not-allowed" : "text-gray-700"
                                  } cursor-pointer`}
                                >
                                  <MinusIcon className="w-4 h-4" />
                                </button>
                                <span className="text-sm">{guestCount.infants}</span>
                                <button
                                  onClick={() => updateGuestCount("infants", true)}
                                  className="w-8 h-8 rounded-full border flex items-center justify-center text-gray-700 cursor-pointer"
                                >
                                  <PlusIcon className="w-4 h-4" />
                                </button>
                              </div>
                            </div>

                            <div className="flex justify-between items-center">
                              <div>
                                <h4 className="font-medium text-sm">Pets</h4>
                                <p className="text-xs text-gray-500">Bringing a service animal?</p>
                              </div>
                              <div className="flex items-center gap-3">
                                <button
                                  onClick={() => updateGuestCount("pets", false)}
                                  disabled={guestCount.pets === 0}
                                  className={`w-8 h-8 rounded-full border flex items-center justify-center ${
                                    guestCount.pets === 0 ? "text-gray-300 cursor-not-allowed" : "text-gray-700"
                                  } cursor-pointer`}
                                >
                                  <MinusIcon className="w-4 h-4" />
                                </button>
                                <span className="text-sm">{guestCount.pets}</span>
                                <button
                                  onClick={() => updateGuestCount("pets", true)}
                                  className="w-8 h-8 rounded-full border flex items-center justify-center text-gray-700 cursor-pointer"
                                >
                                  <PlusIcon className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                          <div className="mt-4 flex justify-end">
                            <button
                              onClick={() => setShowGuestsDropdown(false)}
                              className="text-xs font-medium text-red-500 hover:underline cursor-pointer"
                            >
                              Done
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Mobile search button - only visible on mobile */}
                <div className="md:hidden mt-2 px-2">
                  <button
                    className={`${
                      isSearchReady ? "bg-red-500 hover:bg-red-600" : "bg-gray-300"
                    } text-white w-full py-3 rounded-full font-medium transition-colors cursor-pointer flex items-center justify-center gap-2`}
                    onClick={handleSearchClick}
                    disabled={!isSearchReady}
                  >
                    <SearchIcon className="w-4 h-4" />
                    Search
                  </button>
                </div>
              </div>
              
              {/* Separate Desktop search button */}
              <button
                className={`${
                  isSearchReady ? "bg-red-500 hover:bg-red-600" : "bg-gray-300"
                } text-white p-4 rounded-full cursor-pointer hidden md:block transition-colors`}
                onClick={handleSearchClick}
                disabled={!isSearchReady}
              >
                <SearchIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Homes Tab */}
        {activeTab === "homes" && (
          <>
            {selectedLocation && !locations.find((loc) => loc.name === selectedLocation)?.available ? (
              <div className="flex flex-col items-center justify-center py-16">
                <HardHatIcon className="w-24 h-24 text-gray-500 mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Coming Soon!</h2>
                <p className="text-gray-600 text-center max-w-md mb-6">
                  We're excited to announce that we'll be expanding to {selectedLocation} soon! Currently, we only have
                  listings in Gautam Buddha Nagar, Gurgaon District, and Dehradun.
                </p>
                <button
                  onClick={() => {
                    setSelectedLocation(null)
                    setIsSearchActive(false)
                  }}
                  className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition-colors cursor-pointer"
                >
                  Browse available locations
                </button>
              </div>
            ) : filteredProperties.length > 0 && isSearchActive ? (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl md:text-3xl font-semibold text-gray-900">Properties in {selectedLocation}</h2>
                  <button
                    onClick={() => {
                      setIsSearchActive(false)
                      setSelectedLocation(null)
                      setCheckInDate(null)
                      setCheckOutDate(null)
                      setGuestCount({ adults: 0, children: 0, infants: 0, pets: 0 })
                    }}
                    className="text-red-500 hover:underline cursor-pointer"
                  >
                    Clear search
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                  {filteredProperties.map((property) => (
                    <PropertyCard key={property.id} property={property} onClick={handlePropertyClick} />
                  ))}
                </div>
              </div>
            ) : (
              <>
                <Section
                  title="Popular homes in Gautam Buddha Nagar"
                  items={popularHomesData}
                  renderItem={(item) => <PropertyCard property={item} onClick={handlePropertyClick} />}
                />

                <Section
                  title="Available in Gurgaon District this weekend"
                  items={gurgaonData}
                  renderItem={(item) => <PropertyCard property={item} onClick={handlePropertyClick} />}
                />

                <Section
                  title="Stay in Dehradun"
                  items={dehradunData}
                  renderItem={(item) => <PropertyCard property={item} onClick={handlePropertyClick} />}
                />
              </>
            )}
          </>
        )}

        {/* Experiences Tab */}
        {activeTab === "experiences" && (
          <>
            <Section
              title="Popular Experiences"
              items={experiencesData}
              renderItem={(item) => <ExperienceCard experience={item} onClick={handleExperienceClick} />}
            />

            <Section
              title="Upcoming Festivals & Events"
              items={festivalData}
              renderItem={(item) => <ExperienceCard experience={item} onClick={handleExperienceClick} />}
            />
          </>
        )}

        {/* Services Tab */}
        {activeTab === "services" && (
          <>
            <Section
              title="Popular Services"
              items={servicesData}
              renderItem={(item) => <ServiceCard service={item} onClick={handleServiceClick} />}
            />
          </>
        )}
      </main>

      {/* Footer */}
      <Footer />

      <style jsx global>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        /* Mobile responsive improvements */
        @media (max-width: 768px) {
          .search-bar-mobile {
            flex-direction: column;
          }
          .search-bar-mobile > div {
            border-radius: 12px !important;
            border-bottom: 1px solid #e5e7eb;
          }
          .search-bar-mobile > div:last-child {
            border-bottom: 1px solid #e5e7eb;
          }
        }
        
        /* Calendar improvements */
        .calendar-responsive {
          max-width: 100%;
          overflow: hidden;
        }
        
        /* Property card improvements */
        .property-card-container {
          min-width: 0;
          flex: 1;
        }
        
        /* Fix for modal on mobile */
        @media (max-width: 640px) {
          .modal-content {
            margin: 1rem;
            max-height: calc(100vh - 2rem);
          }
        }
        
        /* Ensure proper stacking order */
        .sticky {
          position: -webkit-sticky;
          position: sticky;
        }
        
        /* Prevent overlapping elements */
        body {
          scroll-behavior: smooth;
        }
        
        /* Fix z-index stacking context */
        .modal-content {
          position: relative;
          z-index: 9999;
        }
        
        /* Ensure dropdowns appear above everything */
        .search-dropdown {
          position: absolute;
          z-index: 9999 !important;
        }
        
        /* Hide any stray floating elements */
        *:not(.modal-content):not(.search-bar-mobile):not(.dropdown-content) > div[style*="position: fixed"],
        *:not(.modal-content):not(.search-bar-mobile):not(.dropdown-content) > div[style*="position: absolute"]:not([class*="dropdown"]):not([class*="modal"]):not([class*="absolute"]) {
          display: none !important;
        }
        
        /* Ensure no floating circular elements appear */
        body > div:not(#__next):not([data-reactroot]):not([class]):not([id]) {
          display: none !important;
        }
        
        /* Hide any standalone circular elements */
        div[class*="rounded-full"]:not([class*="border"]):not([class*="button"]):not([class*="icon"]):not([class*="avatar"]):not([class*="badge"]) {
          position: relative !important;
        }
      `}</style>
    </div>
  )
}
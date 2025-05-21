"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Moon, Sun, Search, Car, Star, ChevronDown, X, Menu, Fuel, Clock, Gauge, Settings } from "lucide-react"
import Link from "next/link"

type Review = {
  id: number
  userName: string
  rating: number
  comment: string
  date: string
}

type Vehicle = {
  id: number
  name: string
  make: string
  model: string
  year: string
  rating: number
  reviews: number
  price: string
  description: string
  imageUrl: string
  trending: boolean
  category: string
  specs: {
    engine: string
    horsepower: string
    acceleration: string
    topSpeed: string
    transmission: string
    fuelEconomy: string
  }
  longDescription?: string
  userReviews?: Review[]
}

export default function AutoReviewApp() {
  const [theme, setTheme] = useState<"light" | "dark">("light")
  const [selectedMake, setSelectedMake] = useState<string>("")
  const [selectedModel, setSelectedModel] = useState<string>("")
  const [selectedYear, setSelectedYear] = useState<string>("")
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>([])
  const [showFiltered, setShowFiltered] = useState(false)
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [newReview, setNewReview] = useState({ userName: "", rating: 5, comment: "" })
  const [subscribed, setSubscribed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [makeDropdownOpen, setMakeDropdownOpen] = useState(false)
  const [modelDropdownOpen, setModelDropdownOpen] = useState(false)
  const [yearDropdownOpen, setYearDropdownOpen] = useState(false)
  const aboutUsRef = useRef<HTMLDivElement>(null)
  const vehiclesRef = useRef<HTMLDivElement>(null)
  const trendingRef = useRef<HTMLDivElement>(null)
  const makeDropdownRef = useRef<HTMLDivElement>(null)
  const modelDropdownRef = useRef<HTMLDivElement>(null)
  const yearDropdownRef = useRef<HTMLDivElement>(null)

  // Sample data for vehicles
  const vehicles: Vehicle[] = [
    {
      id: 1,
      name: "Velox M5 Competition",
      make: "Velox",
      model: "M5 Competition",
      year: "2023",
      rating: 4.8,
      reviews: 1245,
      price: "$110,000",
      description: "High-performance luxury sedan with twin-turbo V8 engine.",
      imageUrl: "https://media.istockphoto.com/id/685446372/photo/crash-text-dummy.webp?a=1&b=1&s=612x612&w=0&k=20&c=bfUhoAvs68pPWC9jEGPRv_nv2YWDPTNrjxCtgL1ND0Q=",
      trending: true,
      category: "Luxury",
      specs: {
        engine: "4.4L Twin-Turbo V8",
        horsepower: "617 hp",
        acceleration: "0-60 mph in 3.2s",
        topSpeed: "190 mph",
        transmission: "8-speed Automatic",
        fuelEconomy: "15/21 mpg",
      },
      longDescription:
        "The Velox M5 Competition is the pinnacle of performance sedans, combining luxury with breathtaking power. Its 4.4-liter twin-turbocharged V8 engine delivers 617 horsepower and 553 lb-ft of torque, propelling it from 0 to 60 mph in just 3.2 seconds. The M xDrive all-wheel-drive system with selectable rear-wheel drive mode provides exceptional handling and control. Inside, you'll find premium leather upholstery, a state-of-the-art infotainment system, and advanced driver assistance features. The M5 Competition represents the perfect balance of everyday usability and track-ready performance.",
      userReviews: [
        {
          id: 1,
          userName: "Michael Chen",
          rating: 5,
          comment: "Absolutely incredible performance! The acceleration is mind-blowing and the handling is precise.",
          date: "2023-10-15",
        },
        {
          id: 2,
          userName: "Sarah Johnson",
          rating: 4,
          comment: "Amazing car but the fuel economy is pretty terrible. Still worth it for the driving experience.",
          date: "2023-09-22",
        },
      ],
    },
    {
      id: 2,
      name: "Lumina S-Class",
      make: "Lumina",
      model: "S-Class",
      year: "2023",
      rating: 4.9,
      reviews: 876,
      price: "$115,000",
      description: "The epitome of luxury and technology in a full-size sedan.",
      imageUrl: "https://images.unsplash.com/photo-1619289943431-86fa4dfd6a06?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGR1bW15JTIwY2Fyc3xlbnwwfHwwfHx8MA%3D%3D",
      trending: true,
      category: "Luxury",
      specs: {
        engine: "3.0L Inline-6 Turbo",
        horsepower: "429 hp",
        acceleration: "0-60 mph in 4.9s",
        topSpeed: "155 mph",
        transmission: "9-speed Automatic",
        fuelEconomy: "22/29 mpg",
      },
      longDescription:
        "The Lumina S-Class has long been the standard-bearer for luxury sedans, and the latest generation continues this tradition with unparalleled refinement and cutting-edge technology. The cabin is a masterpiece of design, featuring premium materials, ambient lighting with 64 colors, and a massive OLED touchscreen. The augmented reality navigation system and level 3 autonomous driving capabilities showcase Lumina's commitment to innovation. The ride quality is exceptional thanks to the E-Active Body Control suspension that can even lean into corners. For those who demand the very best in comfort, technology, and prestige, the S-Class remains the benchmark.",
      userReviews: [
        {
          id: 1,
          userName: "Robert Williams",
          rating: 5,
          comment: "The most comfortable car I've ever owned. The technology is years ahead of competitors.",
          date: "2023-11-05",
        },
        {
          id: 2,
          userName: "Priya Patel",
          rating: 5,
          comment: "Absolutely worth every penny. The attention to detail is remarkable.",
          date: "2023-08-17",
        },
      ],
    },
    {
      id: 3,
      name: "Nimbus 911 GT3",
      make: "Nimbus",
      model: "911 GT3",
      year: "2023",
      rating: 4.7,
      reviews: 765,
      price: "$175,000",
      description: "Track-focused sports car with naturally aspirated flat-six engine.",
      imageUrl: "https://media.istockphoto.com/id/685446372/photo/crash-text-dummy.webp?a=1&b=1&s=612x612&w=0&k=20&c=bfUhoAvs68pPWC9jEGPRv_nv2YWDPTNrjxCtgL1ND0Q=",
      trending: true,
      category: "Sports",
      specs: {
        engine: "4.0L Flat-6",
        horsepower: "502 hp",
        acceleration: "0-60 mph in 3.2s",
        topSpeed: "197 mph",
        transmission: "7-speed PDK",
        fuelEconomy: "15/20 mpg",
      },
      longDescription:
        "The Nimbus 911 GT3 represents the purist's sports car, designed to deliver the most engaging driving experience possible. Its naturally aspirated 4.0-liter flat-six engine revs to a spine-tingling 9,000 rpm, producing 502 horsepower without the aid of turbochargers. Available with either a lightning-quick PDK dual-clutch transmission or a precise 6-speed manual, the GT3 offers unmatched driver engagement. The sophisticated aerodynamics, including a swan-neck rear wing and massive diffuser, generate significant downforce for track performance. Despite its racing pedigree, the GT3 remains comfortable enough for daily use, embodying Nimbus's philosophy of usable performance.",
      userReviews: [
        {
          id: 1,
          userName: "David Wilson",
          rating: 5,
          comment: "The most engaging driving experience you can have. The engine sound is intoxicating!",
          date: "2023-07-12",
        },
        {
          id: 2,
          userName: "Ananya Gupta",
          rating: 4,
          comment: "Incredible performance but the ride is quite firm for daily use. Perfect for weekend drives.",
          date: "2023-10-30",
        },
      ],
    },
    {
      id: 4,
      name: "Electra Model S Plaid",
      make: "Electra",
      model: "Model S Plaid",
      year: "2023",
      rating: 4.5,
      reviews: 987,
      price: "$130,000",
      description: "Revolutionary electric sedan with supercar-beating acceleration.",
      imageUrl: "https://media.istockphoto.com/id/1342350853/photo/destroyed-car-crash-test-3d-renderng.webp?a=1&b=1&s=612x612&w=0&k=20&c=OWSKSSLPN1OTg8gkQxxVqOrKuAe0RRpKlRdztm6a7xg=",
      trending: true,
      category: "Electric",
      specs: {
        engine: "Tri-Motor Electric",
        horsepower: "1,020 hp",
        acceleration: "0-60 mph in 1.99s",
        topSpeed: "200 mph",
        transmission: "Single-speed",
        fuelEconomy: "396 miles range",
      },
      longDescription:
        "The Electra Model S Plaid rewrites the rulebook for what a four-door sedan can achieve. With three electric motors producing a combined 1,020 horsepower, it accelerates from 0-60 mph in under 2 seconds, making it one of the quickest production cars ever made. The minimalist interior is dominated by a 17-inch landscape touchscreen and a controversial yoke-style steering wheel. Advanced features include Autopilot capability, over-the-air updates, and an extensive Supercharger network for convenient charging. With nearly 400 miles of range, the Model S Plaid combines everyday practicality with performance that embarrasses supercars costing twice as much.",
      userReviews: [
        {
          id: 1,
          userName: "Emma Roberts",
          rating: 5,
          comment: "The acceleration is absolutely mind-bending. Nothing else comes close for the price.",
          date: "2023-12-03",
        },
        {
          id: 2,
          userName: "Raj Malhotra",
          rating: 4,
          comment: "Amazing technology but the build quality could be better. Still an incredible machine.",
          date: "2023-11-15",
        },
      ],
    },
    {
      id: 5,
      name: "Astro RS e-tron GT",
      make: "Astro",
      model: "RS e-tron GT",
      year: "2023",
      rating: 4.6,
      reviews: 543,
      price: "$145,000",
      description: "Stunning electric grand tourer with Porsche-derived platform.",
      imageUrl: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?q=80&w=1000",
      trending: false,
      category: "Electric",
      specs: {
        engine: "Dual-Motor Electric",
        horsepower: "637 hp",
        acceleration: "0-60 mph in 3.1s",
        topSpeed: "155 mph",
        transmission: "2-speed Automatic",
        fuelEconomy: "232 miles range",
      },
      longDescription:
        "The Astro RS e-tron GT combines stunning design with cutting-edge electric performance. Sharing its platform with the Nimbus e-series, this four-door grand tourer features dual electric motors producing up to 637 horsepower with overboost. The 800-volt electrical architecture enables ultra-fast charging, adding 180 miles of range in just 22 minutes at compatible stations. Inside, the cabin showcases Astro's renowned craftsmanship with sustainable materials and a driver-focused layout. The adaptive air suspension provides a perfect balance between comfort and handling, while the quattro all-wheel drive ensures confident performance in all conditions. The RS e-tron GT represents Astro's vision for the future of high-performance luxury.",
      userReviews: [
        {
          id: 1,
          userName: "James Thompson",
          rating: 5,
          comment: "The most beautiful EV on the market with performance to match. Interior quality is outstanding.",
          date: "2023-09-08",
        },
        {
          id: 2,
          userName: "Neha Singh",
          rating: 4,
          comment: "Incredible car but the range could be better. The design turns heads everywhere.",
          date: "2023-10-22",
        },
      ],
    },
    {
      id: 6,
      name: "Vulcan Huracán Evo",
      make: "Vulcan",
      model: "Huracán Evo",
      year: "2023",
      rating: 4.8,
      reviews: 678,
      description: "Exotic mid-engine supercar with naturally aspirated V10 power.",
      price: "$270,000",
      imageUrl: "https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?q=80&w=1000",
      trending: false,
      category: "Supercar",
      specs: {
        engine: "5.2L V10",
        horsepower: "631 hp",
        acceleration: "0-60 mph in 2.9s",
        topSpeed: "202 mph",
        transmission: "7-speed Dual-Clutch",
        fuelEconomy: "13/18 mpg",
      },
      longDescription:
        "The Vulcan Huracán Evo delivers the quintessential supercar experience with its screaming naturally aspirated V10 engine, aggressive styling, and theatrical character. The 5.2-liter engine produces 631 horsepower without turbochargers, delivering linear power delivery and an intoxicating soundtrack all the way to its 8,500 rpm redline. Advanced aerodynamics and the VDVI (Vulcan Dinamica Veicolo Integrata) system coordinate all vehicle dynamics systems to predict driver intentions and optimize handling. The angular interior features a fighter jet-inspired cockpit with hexagonal design elements and premium materials. The Huracán Evo represents the pinnacle of automotive passion and performance.",
      userReviews: [
        {
          id: 1,
          userName: "Thomas Brown",
          rating: 5,
          comment: "Nothing compares to the sound of that V10 engine. A true automotive masterpiece.",
          date: "2023-08-14",
        },
        {
          id: 2,
          userName: "Meera Krishnan",
          rating: 5,
          comment: "The ultimate dream car. Surprisingly easy to drive despite the incredible performance.",
          date: "2023-11-27",
        },
      ],
    },
    {
      id: 7,
      name: "Terra Range Rover ",
      make: "Terra",
      model: "Autobiography",
      year: "2023",
      rating: 4.7,
      reviews: 2345,
      price: "$155,000",
      description: "The ultimate luxury SUV with unmatched off-road capability.",
      imageUrl: "https://images.unsplash.com/photo-1550355291-bbee04a92027?q=80&w=1200",
      trending: true,
      category: "Luxury",
      specs: {
        engine: "4.4L Twin-Turbo V8",
        horsepower: "523 hp",
        acceleration: "0-60 mph in 4.4s",
        topSpeed: "155 mph",
        transmission: "8-speed Automatic",
        fuelEconomy: "16/21 mpg",
      },
      longDescription:
        "The Terra Range Rover Autobiography represents the pinnacle of luxury SUVs, combining opulent comfort with genuine off-road capability. The latest generation features a clean, minimalist design with flush door handles and a floating roof. Inside, the cabin offers first-class accommodations with semi-aniline leather, real wood trim, and a 1,600-watt Meridian sound system. The dual 13.1-inch touchscreens run the latest Terra Pro infotainment system with wireless Apple CarPlay and Android Auto. Despite its luxury focus, the Range Rover remains incredibly capable off-road with its Terrain Response 2 system, adjustable air suspension, and wading depth of nearly 3 feet. For those seeking the ultimate combination of luxury, presence, and capability, the Terra Range Rover Autobiography stands alone.",
      userReviews: [
        {
          id: 1,
          userName: "Jennifer Lee",
          rating: 5,
          comment: "The most comfortable vehicle I've ever owned. Handles rough terrain as easily as highways.",
          date: "2023-07-19",
        },
        {
          id: 2,
          userName: "Arjun Mehta",
          rating: 4,
          comment: "Exceptional luxury and capability. Fuel economy is the only downside.",
          date: "2023-09-05",
        },
      ],
    },
    {
      id: 8,
      name: "Phoenix 296 GTB",
      make: "Phoenix",
      model: "296 GTB",
      year: "2023",
      rating: 4.8,
      reviews: 1987,
      price: "$330,000",
      description: "Hybrid supercar with twin-turbo V6 and electric motor.",
      imageUrl: "https://media.istockphoto.com/id/685446372/photo/crash-text-dummy.webp?a=1&b=1&s=612x612&w=0&k=20&c=bfUhoAvs68pPWC9jEGPRv_nv2YWDPTNrjxCtgL1ND0Q=",
      trending: true,
      category: "Supercar",
      specs: {
        engine: "3.0L Twin-Turbo V6 Hybrid",
        horsepower: "819 hp",
        acceleration: "0-60 mph in 2.9s",
        topSpeed: "205 mph",
        transmission: "8-speed Dual-Clutch",
        fuelEconomy: "18/24 mpg",
      },
      longDescription:
        "The Phoenix 296 GTB represents a new chapter in Phoenix's storied history, combining a twin-turbocharged V6 engine with a plug-in hybrid system to produce 819 horsepower. Despite having fewer cylinders than traditional Phoenix models, the 296 GTB delivers blistering performance with a 0-60 mph time of 2.9 seconds and a top speed over 205 mph. The electric motor allows for silent operation in EV mode for up to 15 miles. The compact dimensions and sophisticated chassis control systems make it incredibly agile on winding roads. Inside, the cockpit focuses entirely on the driver with a digital instrument cluster and minimalist controls. The 296 GTB proves that Phoenix's embrace of electrification enhances rather than dilutes the emotional appeal of their supercars.",
      userReviews: [
        {
          id: 1,
          userName: "Robert Johnson",
          rating: 5,
          comment: "The hybrid system adds performance without sacrificing the emotional experience. A masterpiece.",
          date: "2023-08-30",
        },
        {
          id: 2,
          userName: "Sophia Rossi",
          rating: 5,
          comment: "The perfect balance of technology and passion. The handling is simply magical.",
          date: "2023-10-12",
        },
      ],
    },
    {
      id: 9,
      name: "Horizon Civic Type R",
      make: "Horizon",
      model: "Civic Type R",
      year: "2023",
      rating: 4.5,
      reviews: 4567,
      price: "$44,000",
      description: "The ultimate hot hatch with track-ready performance.",
      imageUrl: "https://images.unsplash.com/photo-1594955800508-6e868e9d36a1?q=80&w=1000",
      trending: false,
      category: "Sports",
      specs: {
        engine: "2.0L Turbo 4-cylinder",
        horsepower: "315 hp",
        acceleration: "0-60 mph in 5.0s",
        topSpeed: "169 mph",
        transmission: "6-speed Manual",
        fuelEconomy: "22/28 mpg",
      },
      longDescription:
        "The Horizon Civic Type R continues its legacy as the ultimate performance compact car, combining everyday usability with track-ready capabilities. The 2.0-liter turbocharged engine produces 315 horsepower, sent exclusively to the front wheels through one of the best manual transmissions on the market. Despite its front-wheel-drive layout, sophisticated suspension tuning and a limited-slip differential allow it to corner with remarkable precision and minimal torque steer. The aggressive styling includes a large rear wing, vented hood, and triple exhaust outlets. Inside, the red bucket seats provide excellent support during spirited driving while still offering comfort for daily use. The Civic Type R proves that practical performance doesn't require an exotic badge or price tag.",
      userReviews: [
        {
          id: 1,
          userName: "Daniel Kim",
          rating: 5,
          comment: "The best front-wheel drive car ever made. The manual transmission is perfection.",
          date: "2023-11-08",
        },
        {
          id: 2,
          userName: "Lakshmi Nair",
          rating: 4,
          comment: "Incredible performance for the price. The styling is a bit too aggressive for some tastes.",
          date: "2023-12-01",
        },
      ],
    },
    {
      id: 10,
      name: "Quantum LC 500",
      make: "Quantum",
      model: "LC 500",
      year: "2023",
      rating: 4.6,
      reviews: 3456,
      price: "$95,000",
      description: "Stunning grand tourer with naturally aspirated V8 engine.",
      imageUrl: "https://media.istockphoto.com/id/685446372/photo/crash-text-dummy.webp?a=1&b=1&s=612x612&w=0&k=20&c=bfUhoAvs68pPWC9jEGPRv_nv2YWDPTNrjxCtgL1ND0Q=",
      trending: false,
      category: "Luxury",
      specs: {
        engine: "5.0L V8",
        horsepower: "471 hp",
        acceleration: "0-60 mph in 4.4s",
        topSpeed: "168 mph",
        transmission: "10-speed Automatic",
        fuelEconomy: "16/25 mpg",
      },
      longDescription:
        "The Quantum LC 500 stands as one of the most beautiful modern grand tourers, combining striking design with refined performance. Its naturally aspirated 5.0-liter V8 engine delivers 471 horsepower with a soul-stirring soundtrack that's becoming increasingly rare in the age of turbocharging. The interior is a masterpiece of craftsmanship, featuring hand-stitched leather, Alcantara, and unique design elements like the flowing door panels and layered dashboard. While not as razor-sharp as pure sports cars, the LC 500 excels as a comfortable high-speed cruiser with enough performance to excite when the road gets twisty. The attention to detail and build quality are exceptional, making the LC 500 a compelling alternative to competing luxury coupes at a more reasonable price point.",
      userReviews: [
        {
          id: 1,
          userName: "Alex Turner",
          rating: 5,
          comment: "The most beautiful car on the road. The V8 sound is worth the price of admission alone.",
          date: "2023-07-25",
        },
        {
          id: 2,
          userName: "Ravi Kumar",
          rating: 4,
          comment: "Stunning design and incredible build quality. Not as sporty as some rivals but more comfortable.",
          date: "2023-09-18",
        },
      ],
    },
    {
      id: 11,
      name: "Ventus R1T",
      make: "Ventus",
      model: "R1T",
      year: "2023",
      rating: 4.7,
      reviews: 5678,
      price: "$75,000",
      description: "Revolutionary electric pickup with adventure-focused features.",
      imageUrl: "https://images.unsplash.com/photo-1671271458505-2f5d1ae9c7c9?q=80&w=1200",
      trending: true,
      category: "Electric",
      specs: {
        engine: "Quad-Motor Electric",
        horsepower: "835 hp",
        acceleration: "0-60 mph in 3.0s",
        topSpeed: "125 mph",
        transmission: "Single-speed",
        fuelEconomy: "314 miles range",
      },
      longDescription:
        "The Ventus R1T redefines what a pickup truck can be, combining electric performance with genuine off-road capability and innovative features. With four independent motors producing 835 horsepower and 908 lb-ft of torque, it accelerates like a sports car while offering 11,000 pounds of towing capacity. The adjustable air suspension provides up to 14.9 inches of ground clearance for tackling serious trails. Unique features include the gear tunnel storage space behind the cab, a built-in air compressor, and a camp kitchen option for outdoor adventures. The spacious interior features premium materials and a minimalist design with a 16-inch touchscreen. The R1T represents the future of adventure vehicles, proving that electric power can enhance rather than limit capability.",
      userReviews: [
        {
          id: 1,
          userName: "Emily Wilson",
          rating: 5,
          comment: "The perfect adventure vehicle. Amazing performance on and off-road with clever storage solutions.",
          date: "2023-08-05",
        },
        {
          id: 2,
          userName: "Vikram Singhania",
          rating: 5,
          comment:
            "Revolutionary truck that makes traditional pickups feel ancient. The quad motors are incredible off-road.",
          date: "2023-10-19",
        },
      ],
    },
    {
      id: 12,
      name: "Royale Escalade",
      make: "Royale",
      model: "Escalade",
      year: "2023",
      rating: 4.6,
      reviews: 1876,
      price: "$85,000",
      description: "Iconic American luxury SUV with imposing presence.",
      imageUrl: "https://media.istockphoto.com/id/685446372/photo/crash-text-dummy.webp?a=1&b=1&s=612x612&w=0&k=20&c=bfUhoAvs68pPWC9jEGPRv_nv2YWDPTNrjxCtgL1ND0Q=",
      trending: true,
      category: "Luxury",
      specs: {
        engine: "6.2L V8",
        horsepower: "420 hp",
        acceleration: "0-60 mph in 5.9s",
        topSpeed: "130 mph",
        transmission: "10-speed Automatic",
        fuelEconomy: "14/19 mpg",
      },
      longDescription:
        "The Royale Escalade continues its reign as the quintessential luxury SUV, combining imposing presence with cutting-edge technology. The highlight of the interior is the curved OLED display that spans 38 inches across the dashboard, offering twice the pixel density of a 4K television. The AKG sound system features 36 speakers for an immersive audio experience. Available Pilot Cruise technology allows for hands-free driving on compatible highways. Despite its size, the Escalade offers surprising agility thanks to its independent rear suspension and magnetic ride control. With seating for up to eight passengers and generous cargo space, the Escalade excels as a luxury family vehicle while making a bold statement wherever it goes.",
      userReviews: [
        {
          id: 1,
          userName: "Mark Anderson",
          rating: 4,
          comment: "Incredibly comfortable and packed with technology. Fuel economy is expectedly poor.",
          date: "2023-11-12",
        },
        {
          id: 2,
          userName: "Aisha Patel",
          rating: 5,
          comment: "The ultimate luxury SUV. The curved OLED display and Super Cruise are game-changers.",
          date: "2023-12-05",
        },
      ],
    },
  ]

  // Get unique makes, models, and years for dropdowns
  const makes = [...new Set(vehicles.map((vehicle) => vehicle.make))]
  const models = selectedMake
    ? [...new Set(vehicles.filter((vehicle) => vehicle.make === selectedMake).map((vehicle) => vehicle.model))]
    : []
  const years = selectedModel
    ? [...new Set(vehicles.filter((vehicle) => vehicle.model === selectedModel).map((vehicle) => vehicle.year))]
    : []

  // Filter trending vehicles
  const trendingVehicles = vehicles.filter((vehicle) => vehicle.trending)

  // Toggle theme
  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light")
  }

  // Handle click outside dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (makeDropdownRef.current && !makeDropdownRef.current.contains(event.target as Node)) {
        setMakeDropdownOpen(false)
      }
      if (modelDropdownRef.current && !modelDropdownRef.current.contains(event.target as Node)) {
        setModelDropdownOpen(false)
      }
      if (yearDropdownRef.current && !yearDropdownRef.current.contains(event.target as Node)) {
        setYearDropdownOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Apply theme and font
  useEffect(() => {
    // Apply theme
    document.documentElement.classList.toggle("dark", theme === "dark")

    // Apply font family to the entire document
    document.documentElement.style.fontFamily = "'Raleway', system-ui, sans-serif"

    // Load fonts 
    const link = document.createElement("link")
    link.href = "https://fonts.googleapis.com/css2?family=Raleway:wght@300;400;500;600;700&display=swap"
    link.rel = "stylesheet"
    document.head.appendChild(link)

    return () => {
      document.head.removeChild(link)
    }
  }, [theme])

  // Handle search
  const handleSearch = () => {
    let filtered = [...vehicles]

    if (selectedMake) {
      filtered = filtered.filter((vehicle) => vehicle.make === selectedMake)
    }

    if (selectedModel) {
      filtered = filtered.filter((vehicle) => vehicle.model === selectedModel)
    }

    if (selectedYear) {
      filtered = filtered.filter((vehicle) => vehicle.year === selectedYear)
    }

    setFilteredVehicles(filtered)
    setShowFiltered(true)
  }

  // Reset filters
  const resetFilters = () => {
    setSelectedMake("")
    setSelectedModel("")
    setSelectedYear("")
    setShowFiltered(false)
  }

  // Handle view details
  const handleViewDetails = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle)
    setShowModal(true)
  }

  // Close modal
  const closeModal = () => {
    setShowModal(false)
    setSelectedVehicle(null)
    setNewReview({ userName: "", rating: 5, comment: "" })
  }
  
  // Prevent body scrolling when modal is open
  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }
    
    return () => {
      document.body.style.overflow = "auto"
    }
  }, [showModal])

  // Handle review submission
  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedVehicle || !newReview.userName || !newReview.comment) {
      alert("Please fill in all fields")
      return
    }

    // Create a copy of the selected vehicle
    const updatedVehicle = { ...selectedVehicle }

    // Initialize userReviews array if it doesn't exist
    if (!updatedVehicle.userReviews) {
      updatedVehicle.userReviews = []
    }

    // Add the new review
    const newReviewObj = {
      id: updatedVehicle.userReviews.length + 1,
      userName: newReview.userName,
      rating: newReview.rating,
      comment: newReview.comment,
      date: new Date().toISOString().split("T")[0],
    }

    updatedVehicle.userReviews = [...updatedVehicle.userReviews, newReviewObj]

    // Recalculate the average rating
    const totalRating = updatedVehicle.userReviews.reduce((sum, review) => sum + review.rating, 0)
    updatedVehicle.rating = Number.parseFloat((totalRating / updatedVehicle.userReviews.length).toFixed(1))
    updatedVehicle.reviews += 1

    // Update the vehicles array
    const updatedVehicles = vehicles.map((vehicle) => (vehicle.id === updatedVehicle.id ? updatedVehicle : vehicle))

    // Update filtered vehicles if needed
    if (showFiltered) {
      const updatedFilteredVehicles = filteredVehicles.map((vehicle) =>
        vehicle.id === updatedVehicle.id ? updatedVehicle : vehicle,
      )
      setFilteredVehicles(updatedFilteredVehicles)
    }

    // Update the selected vehicle
    setSelectedVehicle(updatedVehicle)

    // Reset the form
    setNewReview({ userName: "", rating: 5, comment: "" })
  }

  // Scroll to About Us section
  const scrollToAboutUs = () => {
    aboutUsRef.current?.scrollIntoView({ behavior: "smooth" })
    setMobileMenuOpen(false)
  }

  // Scroll to Trending Vehicles section
  const scrollToVehicles = () => {
    trendingRef.current?.scrollIntoView({ behavior: "smooth" })
    setMobileMenuOpen(false)
  }

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  // Filter luxury vehicles
  const handleExploreMoreLuxury = () => {
    const luxuryVehicles = vehicles.filter((vehicle) => vehicle.category === "Luxury")
    setFilteredVehicles(luxuryVehicles)
    setShowFiltered(true)
    vehiclesRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <div
      className={`min-h-screen ${
        theme === "dark" ? "bg-[#0D1B2A] text-[#E1E2E1]" : "bg-[#E1E2E1] text-[#0D1B2A]"
      } transition-colors duration-300`}
    >
      {/* Header */}
      <header
        className={`sticky top-0 z-10 ${
          theme === "dark" ? "bg-[#0D1B2A]/90 text-[#E1E2E1]" : "bg-[#E1E2E1]/90 text-[#0D1B2A]"
        } backdrop-blur-md shadow-md`}
      >
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <h1 className={`text-2xl font-bold ${theme === "dark" ? "text-[#E1E2E1]" : "text-[#1B3B6F]"}`}>
                AutoCritic
              </h1>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="font-medium hover:text-[#1B3B6F] transition-colors cursor-pointer"
            >
              Home
            </button>
            <button
              onClick={scrollToVehicles}
              className="font-medium hover:text-[#1B3B6F] transition-colors cursor-pointer"
            >
              Vehicles
            </button>
            <button
              onClick={scrollToAboutUs}
              className="font-medium hover:text-[#1B3B6F] transition-colors cursor-pointer"
            >
              About Us
            </button>
          </nav>

          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-full ${
                theme === "dark" ? "hover:bg-[#1B3B6F]/30" : "hover:bg-[#1B3B6F]/10"
              } transition-colors cursor-pointer`}
              aria-label="Toggle theme"
            >
              {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className={`md:hidden p-2 rounded-full ${
                theme === "dark" ? "hover:bg-[#1B3B6F]/30" : "hover:bg-[#1B3B6F]/10"
              } transition-colors cursor-pointer`}
              aria-label="Toggle mobile menu"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div
            className={`md:hidden ${
              theme === "dark" ? "bg-[#0D1B2A]/95 text-[#E1E2E1]" : "bg-[#E1E2E1]/95 text-[#0D1B2A]"
            } backdrop-blur-md py-4 px-4 shadow-lg`}
          >
            <nav className="flex flex-col space-y-4">
              <button
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: "smooth" })
                  setMobileMenuOpen(false)
                }}
                className={`font-medium hover:text-[#1B3B6F] transition-colors py-2 border-b ${
                  theme === "dark" ? "border-[#1B3B6F]/30" : "border-[#1B3B6F]/10"
                } cursor-pointer`}
              >
                Home
              </button>
              <button
                onClick={scrollToVehicles}
                className={`font-medium hover:text-[#1B3B6F] transition-colors py-2 border-b ${
                  theme === "dark" ? "border-[#1B3B6F]/30" : "border-[#1B3B6F]/10"
                } cursor-pointer`}
              >
                Vehicles
              </button>
              <button
                onClick={scrollToAboutUs}
                className="font-medium hover:text-[#1B3B6F] transition-colors py-2 cursor-pointer"
              >
                About Us
              </button>
            </nav>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className={`relative py-12 z-0 md:py-24 bg-gradient-to-r from-[#1B3B6F] to-[#34495E] text-[#E1E2E1]`}>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=2070')] bg-cover bg-center opacity-20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-5xl font-bold mb-8 tracking-tight">Find Your Perfect Drive</h2>

            <div
              className={`${
                theme === "dark" ? "bg-[#0D1B2A]/70" : "bg-[#E1E2E1]/70"
              } p-4 md:p-6 rounded-xl shadow-lg backdrop-blur-md border border-white/20`}
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Make Dropdown */}
                <div className="relative" ref={makeDropdownRef}>
                  <label className="block text-sm font-medium text-[#E1E2E1] mb-1">Make</label>
                  <div className="relative">
                    <button
                      onClick={() => setMakeDropdownOpen(!makeDropdownOpen)}
                      className={`w-full p-3 text-left flex items-center justify-between ${
                        theme === "dark"
                          ? "bg-[#1B3B6F]/80 text-[#E1E2E1] border-[#34495E]/50"
                          : "bg-white/80 text-[#0D1B2A] border-[#1B3B6F]/20"
                      } border rounded-xl backdrop-blur-sm transition-all hover:shadow-md cursor-pointer`}
                    >
                      <span>{selectedMake || "Select Make"}</span>
                      <ChevronDown
                        className={`h-5 w-5 text-gray-400 transition-transform ${makeDropdownOpen ? "rotate-180" : ""}`}
                      />
                    </button>

                    {makeDropdownOpen && (
                      <div
                        className={`absolute z-10 mt-1 w-full ${
                          theme === "dark"
                            ? "bg-[#1B3B6F] text-[#E1E2E1] border-[#34495E]/50"
                            : "bg-white text-[#0D1B2A] border-[#1B3B6F]/20"
                        } border rounded-xl shadow-lg max-h-60 overflow-auto`}
                      >
                        <div className="py-1">
                          <button
                            onClick={() => {
                              setSelectedMake("")
                              setSelectedModel("")
                              setSelectedYear("")
                              setMakeDropdownOpen(false)
                            }}
                            className={`w-full text-left px-4 py-2 text-sm ${
                              !selectedMake ? (theme === "dark" ? "bg-[#34495E]/50" : "bg-[#1B3B6F]/10") : ""
                            } hover:${theme === "dark" ? "bg-[#34495E]/30" : "bg-[#1B3B6F]/5"} cursor-pointer`}
                          >
                            Select Make
                          </button>
                          {makes.map((make) => (
                            <button
                              key={make}
                              onClick={() => {
                                setSelectedMake(make)
                                setSelectedModel("")
                                setSelectedYear("")
                                setMakeDropdownOpen(false)
                              }}
                              className={`w-full text-left px-4 py-2 text-sm ${
                                selectedMake === make ? (theme === "dark" ? "bg-[#34495E]/50" : "bg-[#1B3B6F]/10") : ""
                              } hover:${theme === "dark" ? "bg-[#34495E]/30" : "bg-[#1B3B6F]/5"} cursor-pointer`}
                            >
                              {make}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Model Dropdown */}
                <div className="relative" ref={modelDropdownRef}>
                  <label className="block text-sm font-medium text-[#E1E2E1] mb-1">Model</label>
                  <div className="relative">
                    <button
                      onClick={() => selectedMake && setModelDropdownOpen(!modelDropdownOpen)}
                      disabled={!selectedMake}
                      className={`w-full p-3 text-left flex items-center justify-between ${
                        theme === "dark"
                          ? "bg-[#1B3B6F]/80 text-[#E1E2E1] border-[#34495E]/50"
                          : "bg-white/80 text-[#0D1B2A] border-[#1B3B6F]/20"
                      } border rounded-xl backdrop-blur-sm transition-all hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer`}
                    >
                      <span>{selectedModel || "Select Model"}</span>
                      <ChevronDown
                        className={`h-5 w-5 text-gray-400 transition-transform ${modelDropdownOpen ? "rotate-180" : ""}`}
                      />
                    </button>

                    {modelDropdownOpen && (
                      <div
                        className={`absolute z-10 mt-1 w-full ${
                          theme === "dark"
                            ? "bg-[#1B3B6F] text-[#E1E2E1] border-[#34495E]/50"
                            : "bg-white text-[#0D1B2A] border-[#1B3B6F]/20"
                        } border rounded-xl shadow-lg max-h-60 overflow-auto`}
                      >
                        <div className="py-1">
                          <button
                            onClick={() => {
                              setSelectedModel("")
                              setSelectedYear("")
                              setModelDropdownOpen(false)
                            }}
                            className={`w-full text-left px-4 py-2 text-sm ${
                              !selectedModel ? (theme === "dark" ? "bg-[#34495E]/50" : "bg-[#1B3B6F]/10") : ""
                            } hover:${theme === "dark" ? "bg-[#34495E]/30" : "bg-[#1B3B6F]/5"} cursor-pointer`}
                          >
                            Select Model
                          </button>
                          {models.map((model) => (
                            <button
                              key={model}
                              onClick={() => {
                                setSelectedModel(model)
                                setSelectedYear("")
                                setModelDropdownOpen(false)
                              }}
                              className={`w-full text-left px-4 py-2 text-sm ${
                                selectedModel === model
                                  ? theme === "dark"
                                    ? "bg-[#34495E]/50"
                                    : "bg-[#1B3B6F]/10"
                                  : ""
                              } hover:${theme === "dark" ? "bg-[#34495E]/30" : "bg-[#1B3B6F]/5"} cursor-pointer`}
                            >
                              {model}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Year Dropdown */}
                <div className="relative" ref={yearDropdownRef}>
                  <label className="block text-sm font-medium text-[#E1E2E1] mb-1">Year</label>
                  <div className="relative">
                    <button
                      onClick={() => selectedModel && setYearDropdownOpen(!yearDropdownOpen)}
                      disabled={!selectedModel}
                      className={`w-full p-3 text-left flex items-center justify-between ${
                        theme === "dark"
                          ? "bg-[#1B3B6F]/80 text-[#E1E2E1] border-[#34495E]/50"
                          : "bg-white/80 text-[#0D1B2A] border-[#1B3B6F]/20"
                      } border rounded-xl backdrop-blur-sm transition-all hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer`}
                    >
                      <span>{selectedYear || "Select Year"}</span>
                      <ChevronDown
                        className={`h-5 w-5 text-gray-400 transition-transform ${yearDropdownOpen ? "rotate-180" : ""}`}
                      />
                    </button>

                    {yearDropdownOpen && (
                      <div
                        className={`absolute z-10 mt-1 w-full ${
                          theme === "dark"
                            ? "bg-[#1B3B6F] text-[#E1E2E1] border-[#34495E]/50"
                            : "bg-white text-[#0D1B2A] border-[#1B3B6F]/20"
                        } border rounded-xl shadow-lg max-h-60 overflow-auto`}
                      >
                        <div className="py-1">
                          <button
                            onClick={() => {
                              setSelectedYear("")
                              setYearDropdownOpen(false)
                            }}
                            className={`w-full text-left px-4 py-2 text-sm ${
                              !selectedYear ? (theme === "dark" ? "bg-[#34495E]/50" : "bg-[#1B3B6F]/10") : ""
                            } hover:${theme === "dark" ? "bg-[#34495E]/30" : "bg-[#1B3B6F]/5"} cursor-pointer`}
                          >
                            Select Year
                          </button>
                          {years.map((year) => (
                            <button
                              key={year}
                              onClick={() => {
                                setSelectedYear(year)
                                setYearDropdownOpen(false)
                              }}
                              className={`w-full text-left px-4 py-2 text-sm ${
                                selectedYear === year ? (theme === "dark" ? "bg-[#34495E]/50" : "bg-[#1B3B6F]/10") : ""
                              } hover:${theme === "dark" ? "bg-[#34495E]/30" : "bg-[#1B3B6F]/5"} cursor-pointer`}
                            >
                              {year}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={handleSearch}
                  className="px-6 py-3 bg-[#1B3B6F] text-white rounded-full hover:bg-[#34495E] transition-colors flex items-center justify-center gap-2 shadow-lg cursor-pointer"
                >
                  <Search className="h-5 w-5" />
                  Search Vehicles
                </button>

                <button
                  onClick={resetFilters}
                  className={`px-6 py-3 ${
                    theme === "dark"
                      ? "bg-[#34495E]/80 text-[#E1E2E1] hover:bg-[#34495E]"
                      : "bg-[#E1E2E1]/80 text-[#0D1B2A] hover:bg-[#E1E2E1]"
                  } backdrop-blur-sm rounded-full transition-colors shadow-lg cursor-pointer`}
                >
                  Reset Filters
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trending Vehicles Section */}
      {!showFiltered && (
        <section
          ref={trendingRef}
          className={`py-12 md:py-16 ${
            theme === "dark" ? "bg-[#0D1B2A] text-[#E1E2E1]" : "bg-[#E1E2E1] text-[#0D1B2A]"
          } backdrop-blur-sm`}
        >
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8 text-center tracking-tight">
              Trending Vehicles
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {trendingVehicles.map((vehicle) => (
                <div
                  key={vehicle.id}
                  className={`${
                    theme === "dark" ? "bg-[#1B3B6F]/30 border-[#34495E]/30" : "bg-white/70 border-[#1B3B6F]/10"
                  } backdrop-blur-md rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all border`}
                >
                  <div className="relative h-48 sm:h-60">
                    <img
                      src={vehicle.imageUrl || "/placeholder.svg"}
                      alt={vehicle.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=1000"
                      }}
                    />
                  </div>

                  <div className="p-4 md:p-5">
                                          <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg md:text-xl font-bold tracking-tight" style={{ color: theme === "light" ? "#1B3B6F" : "#FFFFFF" }}>{vehicle.name}</h3>
                        <div className="flex items-center">
                          <Star className="h-5 w-5 text-yellow-500 fill-current" />
                          <span className="ml-1 font-medium" style={{ color: theme === "light" ? "#1B3B6F" : "#FFFFFF" }}>{vehicle.rating}</span>
                        </div>
                      </div>

                      <div className="flex items-center mb-3">
                        <Car className="h-4 w-4 mr-1" style={{ color: theme === "light" ? "#666666" : "#E1E2E1/70" }} />
                        <span className="text-sm font-medium" style={{ color: theme === "light" ? "#666666" : "#E1E2E1/70" }}>
                          {vehicle.make}, {vehicle.model}, {vehicle.year}
                        </span>
                      </div>

                      <p
                        className="mb-4 line-clamp-2 text-sm md:text-base"
                        style={{ color: theme === "light" ? "#4B5563" : "#E1E2E1/90" }}
                      >
                        {vehicle.description}
                      </p>

                    <div className="flex items-center justify-between">
                      <span
                        className={`text-xs md:text-sm font-medium ${theme === "dark" ? "text-[#E1E2E1]/80" : "text-[#0D1B2A]/80"}`}
                      >
                        {vehicle.price}
                      </span>
                      <button
                        onClick={() => handleViewDetails(vehicle)}
                        className={`${
                          theme === "dark"
                            ? "text-[#E1E2E1] hover:text-[#E1E2E1]/80"
                            : "text-[#1B3B6F] hover:text-[#34495E]"
                        } font-medium text-sm transition-colors cursor-pointer`}
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Filtered Results Section */}
      {showFiltered && (
        <section
          ref={vehiclesRef}
          className={`py-12 md:py-16 ${
            theme === "dark" ? "bg-[#0D1B2A] text-[#E1E2E1]" : "bg-[#E1E2E1] text-[#0D1B2A]"
          } backdrop-blur-sm`}
        >
          <div className="container mx-auto px-4">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 md:mb-8 gap-4">
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
                {filteredVehicles.length > 0 ? `${filteredVehicles.length} Vehicles Found` : "No Vehicles Found"}
              </h2>
              <button
                onClick={resetFilters}
                className={`px-4 py-2 ${
                  theme === "dark"
                    ? "bg-[#34495E]/80 text-[#E1E2E1] hover:bg-[#34495E]"
                    : "bg-white/80 text-[#0D1B2A] hover:bg-white"
                } backdrop-blur-sm rounded-full transition-colors shadow-lg cursor-pointer`}
              >
                Back to Trending
              </button>
            </div>

            {filteredVehicles.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {filteredVehicles.map((vehicle) => (
                  <div
                    key={vehicle.id}
                    className={`${
                      theme === "dark" ? "bg-[#1B3B6F]/30 border-[#34495E]/30" : "bg-white/70 border-[#1B3B6F]/10"
                    } backdrop-blur-md rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all border`}
                  >
                    <div className="relative h-48 sm:h-60">
                      <img
                        src={vehicle.imageUrl || "/placeholder.svg"}
                        alt={vehicle.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src =
                            "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=1000"
                        }}
                      />
                    </div>

                    <div className="p-4 md:p-5">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg md:text-xl font-bold tracking-tight">{vehicle.name}</h3>
                        <div className="flex items-center">
                          <Star className="h-5 w-5 text-yellow-500 fill-current" />
                          <span className="ml-1 font-medium">{vehicle.rating}</span>
                        </div>
                      </div>

                      <div className="flex items-center mb-3">
                        <Car className="h-4 w-4 mr-1" style={{ color: theme === "light" ? "#000000" : "#E1E2E1" }} />
                        <span
                          className="text-sm font-bold"
                          style={{ color: theme === "light" ? "#000000" : "#E1E2E1" }}
                        >
                          {vehicle.make}, {vehicle.model}, {vehicle.year}
                        </span>
                      </div>

                      <p
                        className={`${
                          theme === "dark" ? "text-[#E1E2E1]/80" : "text-[#0D1B2A]/80"
                        } mb-4 line-clamp-2 text-sm md:text-base`}
                      >
                        {vehicle.description}
                      </p>

                      <div className="flex items-center justify-between">
                        <span
                          className="text-xs md:text-sm font-semibold"
                          style={{ color: theme === "light" ? "#1B3B6F" : "#FFFFFF" }}
                        >
                          {vehicle.price}
                        </span>
                        <button
                          onClick={() => handleViewDetails(vehicle)}
                          className="font-medium text-sm transition-colors cursor-pointer"
                          style={{ 
                            color: theme === "light" ? "#2563EB" : "#93C5FD",
                            textDecoration: "underline"
                          }}
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className={`${theme === "dark" ? "text-[#E1E2E1]/80" : "text-[#0D1B2A]/80"} mb-4`}>
                  No vehicles match your search criteria. Try adjusting your filters.
                </p>
                <button
                  onClick={resetFilters}
                  className="px-6 py-3 bg-[#1B3B6F] text-white rounded-full hover:bg-[#34495E] transition-colors shadow-lg cursor-pointer"
                >
                  View All Vehicles
                </button>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Luxury Vehicles Section */}
      {!showFiltered && (
        <section
          className={`py-12 md:py-16 ${
            theme === "dark" ? "bg-[#1B3B6F]/10 text-[#E1E2E1]" : "bg-white/80 text-[#0D1B2A]"
          } backdrop-blur-sm`}
        >
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8 text-center tracking-tight">Luxury Vehicles</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {vehicles
                .filter((vehicle) => vehicle.category === "Luxury" && !vehicle.trending)
                .slice(0, 6)
                .map((vehicle) => (
                  <div
                    key={vehicle.id}
                    className={`${
                      theme === "dark" ? "bg-[#0D1B2A]/70 border-[#34495E]/30" : "bg-[#E1E2E1]/70 border-[#1B3B6F]/10"
                    } backdrop-blur-md rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow flex flex-col sm:flex-row`}
                  >
                    <div className="relative w-full sm:w-1/3 h-48 sm:h-auto">
                      <img
                        src={vehicle.imageUrl || "/placeholder.svg"}
                        alt={vehicle.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src =
                            "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=1000"
                        }}
                      />
                    </div>

                    <div className="p-4 w-full sm:w-2/3">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="text-lg font-bold tracking-tight">{vehicle.name}</h3>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          <span className="ml-1 text-sm font-medium">{vehicle.rating}</span>
                        </div>
                      </div>

                      <div className="flex items-center mb-2">
                        <Car className="h-3 w-3 mr-1" style={{ color: theme === "light" ? "#000000" : "#E1E2E1" }} />
                        <span
                          className="text-xs font-bold"
                          style={{ color: theme === "light" ? "#000000" : "#E1E2E1" }}
                        >
                          {vehicle.make}, {vehicle.year}
                        </span>
                      </div>

                      <p
                        className={`${
                          theme === "dark" ? "text-[#E1E2E1]/80" : "text-[#0D1B2A]/80"
                        } text-sm mb-2 line-clamp-2`}
                      >
                        {vehicle.description}
                      </p>

                      <button
                        onClick={() => handleViewDetails(vehicle)}
                        className={`${
                          theme === "dark"
                            ? "text-[#E1E2E1] hover:text-[#E1E2E1]/80"
                            : "text-[#1B3B6F] hover:text-[#34495E]"
                        } font-medium text-xs transition-colors cursor-pointer`}
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
            </div>

            <div className="text-center mt-8 md:mt-10">
              <button
                onClick={handleExploreMoreLuxury}
                className="px-6 py-3 bg-[#1B3B6F] text-white rounded-full hover:bg-[#34495E] transition-colors inline-block shadow-lg cursor-pointer"
              >
                Explore More Luxury Vehicles
              </button>
            </div>
          </div>
        </section>
      )}

      {/* About Us Section */}
      <section
        ref={aboutUsRef}
        id="about-us"
        className={`py-12 md:py-16 ${
          theme === "dark" ? "bg-[#0D1B2A] text-[#E1E2E1]" : "bg-[#E1E2E1] text-[#0D1B2A]"
        } backdrop-blur-sm`}
      >
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8 text-center tracking-tight">About Us</h2>

            <div
              className={`${
                theme === "dark" ? "bg-[#1B3B6F]/30 border-[#34495E]/30" : "bg-white/70 border-[#1B3B6F]/10"
              } backdrop-blur-md rounded-xl p-4 md:p-6 shadow-lg border`}
            >
              <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-center">
                <div className="md:w-1/3">
                  <div className="relative h-56 md:h-64 w-full rounded-xl overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1000"
                      alt="Automotive Team"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                <div className="md:w-2/3">
                  <h3 className="text-xl md:text-2xl font-bold mb-4 tracking-tight">Our Story</h3>
                  <p
                    className={`${
                      theme === "dark" ? "text-[#E1E2E1]/80" : "text-[#0D1B2A]/80"
                    } mb-4 text-sm md:text-base`}
                  >
                    AutoCritic was founded in 2020 by a group of passionate automotive enthusiasts who wanted to create
                    a platform where people could share authentic vehicle experiences and help others find their perfect
                    ride.
                  </p>
                  <p
                    className={`${
                      theme === "dark" ? "text-[#E1E2E1]/80" : "text-[#0D1B2A]/80"
                    } mb-4 text-sm md:text-base`}
                  >
                    Our mission is to provide unbiased, detailed reviews of vehicles across all segments, from everyday
                    commuters to exotic supercars. We believe that finding the right vehicle is about more than just
                    specifications—it's about how a car makes you feel.
                  </p>
                  <p className={`${theme === "dark" ? "text-[#E1E2E1]/80" : "text-[#0D1B2A]/80"} text-sm md:text-base`}>
                    Today, AutoCritic has grown into a community of thousands of car enthusiasts who share their
                    experiences and help each other make informed decisions about their next vehicle purchase.
                  </p>
                </div>
              </div>

              <div className="mt-8 md:mt-12">
                <h3 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-center tracking-tight">Our Team</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                  {[
                    {
                      name: "James Mitchell",
                      role: "Founder & CEO",
                      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1000",
                    },
                    {
                      name: "Alexandra Chen",
                      role: "Head of Reviews",
                      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1000",
                    },
                    {
                      name: "Marcus Johnson",
                      role: "Technical Editor",
                      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1000",
                    },
                    {
                      name: "Priya Sharma",
                      role: "Performance Analyst",
                      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1000",
                    },
                  ].map((member, index) => (
                    <div key={index} className="text-center">
                      <div className="relative h-24 w-24 sm:h-32 sm:w-32 mx-auto rounded-full overflow-hidden mb-3 md:mb-4">
                        <img
                          src={member.image || "/placeholder.svg"}
                          alt={member.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <h4 className="font-bold text-sm md:text-base tracking-tight">{member.name}</h4>
                      <p
                        className={`text-xs md:text-sm ${theme === "dark" ? "text-[#E1E2E1]/60" : "text-[#0D1B2A]/60"}`}
                      >
                        {member.role}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-12 md:py-16 z-0 bg-gradient-to-r from-[#1B3B6F] to-[#34495E] text-white relative">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=2070')] bg-cover bg-center opacity-20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4 tracking-tight">Stay Updated</h2>
            <p className="mb-6">Subscribe to our newsletter for the latest automotive news and vehicle reviews.</p>

            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-grow px-4 py-3 rounded-full bg-white text-[#0D1B2A] focus:outline-none focus:ring-2 focus:ring-[#1B3B6F] border border-white"
              />
              <button
                onClick={() => setSubscribed(true)}
                className="px-6 py-3 bg-[#0D1B2A] text-white rounded-full hover:bg-[#34495E] transition-colors shadow-lg cursor-pointer"
              >
                {subscribed ? "Subscribed!" : "Subscribe"}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0D1B2A] text-white py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
            <div>
              <h3 className="text-xl font-bold text-[#E1E2E1] mb-4 tracking-tight">AutoCritic</h3>
              <p className="text-[#E1E2E1]/70 mb-4 text-sm md:text-base">
                Discover the world's most amazing vehicles with authentic reviews from real drivers.
              </p>
              <div className="flex space-x-4">
                <button
                  onClick={() => alert("Facebook page opened")}
                  className="text-[#E1E2E1]/50 hover:text-white transition-colors cursor-pointer"
                >
                  <span className="sr-only">Facebook</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
                <button
                  onClick={() => alert("Instagram page opened")}
                  className="text-[#E1E2E1]/50 hover:text-white transition-colors cursor-pointer"
                >
                  <span className="sr-only">Instagram</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-lg mb-4 tracking-tight">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={scrollToAboutUs}
                    className="text-[#E1E2E1]/50 hover:text-white transition-colors cursor-pointer"
                  >
                    About Us
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => alert("Contact page opened")}
                    className="text-[#E1E2E1]/50 hover:text-white transition-colors cursor-pointer"
                  >
                    Contact
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => alert("Privacy Policy page opened")}
                    className="text-[#E1E2E1]/50 hover:text-white transition-colors cursor-pointer"
                  >
                    Privacy Policy
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => alert("Terms of Service page opened")}
                    className="text-[#E1E2E1]/50 hover:text-white transition-colors cursor-pointer"
                  >
                    Terms of Service
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-lg mb-4 tracking-tight">Contact Us</h4>
              <address className="not-italic text-[#E1E2E1]/70 text-sm md:text-base">
                <p className="mb-2">123 Automotive Avenue</p>
                <p className="mb-2">Motor City, MC 12345</p>
                <p className="mb-2">
                  Email: <span className="text-[#E1E2E1] font-bold">info@autocritic.com</span>
                </p>
                <p>
                  Phone: <span className="text-[#E1E2E1] font-bold">+1 (555) 123-4567</span>
                </p>
              </address>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-[#1B3B6F]/30 text-center text-[#E1E2E1]/50">
            <p>&copy; {new Date().getFullYear()} AutoCritic. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Details Modal */}
      {showModal && selectedVehicle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
          <div
            className={`${
              theme === "dark" ? "bg-[#0D1B2A] text-[#E1E2E1]" : "bg-white text-[#0D1B2A]"
            } rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto my-4 md:my-8`}
          >
            <div className="relative h-56 sm:h-72 md:h-96">
              <img
                src={selectedVehicle.imageUrl || "/placeholder.svg"}
                alt={selectedVehicle.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=1000"
                }}
              />
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-4 md:p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl md:text-2xl font-bold tracking-tight" style={{ color: theme === "light" ? "#1B3B6F" : "#FFFFFF" }}>{selectedVehicle.name}</h2>
                <div className="flex items-center">
                  <Star className="h-5 w-5 text-yellow-500 fill-current" />
                  <span className="ml-1 font-medium" style={{ color: theme === "light" ? "#1B3B6F" : "#FFFFFF" }}>{selectedVehicle.rating}</span>
                </div>
              </div>

              <div className="flex items-center mb-4">
                <Car className="h-4 w-4 mr-1" style={{ color: theme === "light" ? "#666666" : "#E1E2E1/70" }} />
                <span className="text-sm font-medium" style={{ color: theme === "light" ? "#666666" : "#E1E2E1/70" }}>
                  {selectedVehicle.make}, {selectedVehicle.model}, {selectedVehicle.year}
                </span>
              </div>

              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-bold tracking-tight" style={{ color: theme === "light" ? "#1B3B6F" : "#FFFFFF" }}>Specifications</h3>
                  <span className="font-bold" style={{ color: theme === "light" ? "#1B3B6F" : "#FFFFFF" }}>
                    {selectedVehicle.price}
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                  <div
                    className={`p-3 rounded-lg ${
                      theme === "dark" ? "bg-[#1B3B6F]/20" : "bg-gray-200"
                    } flex items-center`}
                  >
                    <Settings className="h-5 w-5 mr-2" style={{ color: theme === "light" ? "#000000" : "#E1E2E1" }} />
                    <div>
                      <p className="text-xs font-light" style={{ color: theme === "light" ? "#666666" : "#E1E2E1/70" }}>
                        Engine
                      </p>
                      <p className="text-sm font-bold" style={{ color: theme === "light" ? "#000000" : "#E1E2E1" }}>
                        {selectedVehicle.specs.engine}
                      </p>
                    </div>
                  </div>

                  <div
                    className={`p-3 rounded-lg ${
                      theme === "dark" ? "bg-[#1B3B6F]/20" : "bg-gray-200"
                    } flex items-center`}
                  >
                    <Gauge className="h-5 w-5 mr-2" style={{ color: theme === "light" ? "#000000" : "#E1E2E1" }} />
                    <div>
                      <p className="text-xs font-light" style={{ color: theme === "light" ? "#666666" : "#E1E2E1/70" }}>
                        Horsepower
                      </p>
                      <p className="text-sm font-bold" style={{ color: theme === "light" ? "#000000" : "#E1E2E1" }}>
                        {selectedVehicle.specs.horsepower}
                      </p>
                    </div>
                  </div>

                  <div
                    className={`p-3 rounded-lg ${
                      theme === "dark" ? "bg-[#1B3B6F]/20" : "bg-gray-200"
                    } flex items-center`}
                  >
                    <Clock className="h-5 w-5 mr-2" style={{ color: theme === "light" ? "#000000" : "#E1E2E1" }} />
                    <div>
                      <p className="text-xs font-light" style={{ color: theme === "light" ? "#666666" : "#E1E2E1/70" }}>
                        Acceleration
                      </p>
                      <p className="text-sm font-bold" style={{ color: theme === "light" ? "#000000" : "#E1E2E1" }}>
                        {selectedVehicle.specs.acceleration}
                      </p>
                    </div>
                  </div>

                  <div
                    className={`p-3 rounded-lg ${
                      theme === "dark" ? "bg-[#1B3B6F]/20" : "bg-gray-200"
                    } flex items-center`}
                  >
                    <Gauge className="h-5 w-5 mr-2" style={{ color: theme === "light" ? "#000000" : "#E1E2E1" }} />
                    <div>
                      <p className="text-xs font-light" style={{ color: theme === "light" ? "#666666" : "#E1E2E1/70" }}>
                        Top Speed
                      </p>
                      <p className="text-sm font-bold" style={{ color: theme === "light" ? "#000000" : "#E1E2E1" }}>
                        {selectedVehicle.specs.topSpeed}
                      </p>
                    </div>
                  </div>

                  <div
                    className={`p-3 rounded-lg ${
                      theme === "dark" ? "bg-[#1B3B6F]/20" : "bg-gray-200"
                    } flex items-center`}
                  >
                    <Settings className="h-5 w-5 mr-2" style={{ color: theme === "light" ? "#000000" : "#E1E2E1" }} />
                    <div>
                      <p className="text-xs font-light" style={{ color: theme === "light" ? "#666666" : "#E1E2E1/70" }}>
                        Transmission
                      </p>
                      <p className="text-sm font-bold" style={{ color: theme === "light" ? "#000000" : "#E1E2E1" }}>
                        {selectedVehicle.specs.transmission}
                      </p>
                    </div>
                  </div>

                  <div
                    className={`p-3 rounded-lg ${
                      theme === "dark" ? "bg-[#1B3B6F]/20" : "bg-gray-200"
                    } flex items-center`}
                  >
                    <Fuel className="h-5 w-5 mr-2" style={{ color: theme === "light" ? "#000000" : "#E1E2E1" }} />
                    <div>
                      <p className="text-xs font-light" style={{ color: theme === "light" ? "#666666" : "#E1E2E1/70" }}>
                        Fuel Economy
                      </p>
                      <p className="text-sm font-bold" style={{ color: theme === "light" ? "#000000" : "#E1E2E1" }}>
                        {selectedVehicle.specs.fuelEconomy}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <p
                className="mb-6 text-sm md:text-base"
                style={{ color: theme === "light" ? "#4B5563" : "#E1E2E1/90" }}
              >
                {selectedVehicle.longDescription || selectedVehicle.description}
              </p>

              <div className="mb-8">
                <h3 className="text-xl font-bold mb-4 tracking-tight" style={{ color: theme === "light" ? "#1B3B6F" : "#FFFFFF" }}>Reviews</h3>

                {selectedVehicle.userReviews && selectedVehicle.userReviews.length > 0 ? (
                  <div className="space-y-4">
                    {selectedVehicle.userReviews.map((review) => (
                      <div
                        key={review.id}
                        className={`${theme === "dark" ? "bg-[#1B3B6F]/20" : "bg-[#E1E2E1]"} p-4 rounded-lg`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-bold" style={{ color: theme === "light" ? "#1B3B6F" : "#FFFFFF" }}>{review.userName}</h4>
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-yellow-500 fill-current" />
                            <span className="ml-1 text-sm" style={{ color: theme === "light" ? "#1B3B6F" : "#FFFFFF" }}>{review.rating}</span>
                          </div>
                        </div>
                        <p className="text-sm mb-1" style={{ color: theme === "light" ? "#4B5563" : "#E1E2E1/90" }}>
                          {review.comment}
                        </p>
                        <p className="text-xs" style={{ color: theme === "light" ? "#6B7280" : "#E1E2E1/50" }}>
                          {review.date}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className={`${theme === "dark" ? "text-[#E1E2E1]/50" : "text-[#0D1B2A]/50"}`}>
                    No reviews yet. Be the first to review!
                  </p>
                )}
              </div>

              <div>
                <h3 className="text-xl font-bold mb-4 tracking-tight" style={{ color: theme === "light" ? "#1B3B6F" : "#FFFFFF" }}>Write a Review</h3>
                <form
                  onSubmit={handleReviewSubmit}
                  className={`space-y-4 ${
                    theme === "dark" ? "bg-[#1B3B6F]/10 border-[#34495E]/30" : "bg-[#E1E2E1]/80 border-[#1B3B6F]/10"
                  } p-4 md:p-6 rounded-xl border`}
                >
                  <div>
                    <label
                      htmlFor="userName"
                      className="block text-sm font-medium mb-1"
                      style={{ color: theme === "light" ? "#4B5563" : "#E1E2E1/90" }}
                    >
                      Your Name
                    </label>
                    <input
                      type="text"
                      id="userName"
                      value={newReview.userName}
                      onChange={(e) => setNewReview({ ...newReview, userName: e.target.value })}
                      className={`w-full p-3 ${
                        theme === "dark"
                          ? "bg-[#0D1B2A]/80 text-[#E1E2E1] border-[#34495E]/50"
                          : "bg-white/80 text-[#0D1B2A] border-[#1B3B6F]/20"
                      } border rounded-xl`}
                      required
                    />
                  </div>

                  <div>
                    <label
                      className="block text-sm font-medium mb-1"
                      style={{ color: theme === "light" ? "#4B5563" : "#E1E2E1/90" }}
                    >
                      Rating
                    </label>
                    <div
                      className={`flex items-center space-x-1 ${
                        theme === "dark" ? "bg-[#0D1B2A]/80 border-[#34495E]/50" : "bg-white/80 border-[#1B3B6F]/20"
                      } p-3 rounded-xl border`}
                    >
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setNewReview({ ...newReview, rating: star })}
                          className="focus:outline-none transition-transform hover:scale-110 cursor-pointer"
                        >
                          <Star
                            className={`h-8 w-8 ${
                              star <= newReview.rating
                                ? "text-yellow-500 fill-current"
                                : theme === "dark"
                                  ? "text-[#1B3B6F]/30"
                                  : "text-[#1B3B6F]/20"
                            }`}
                          />
                        </button>
                      ))}
                      <span className={`ml-2 text-sm ${theme === "dark" ? "text-[#E1E2E1]/50" : "text-[#0D1B2A]/50"}`}>
                        {newReview.rating} out of 5
                      </span>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="comment"
                      className="block text-sm font-medium mb-1"
                      style={{ color: theme === "light" ? "#4B5563" : "#E1E2E1/90" }}
                    >
                      Your Review
                    </label>
                    <textarea
                      id="comment"
                      value={newReview.comment}
                      onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                      rows={4}
                      className={`w-full p-3 ${
                        theme === "dark"
                          ? "bg-[#0D1B2A]/80 text-[#E1E2E1] border-[#34495E]/50"
                          : "bg-white/80 text-[#0D1B2A] border-[#1B3B6F]/20"
                      } border rounded-xl`}
                      required
                      placeholder="Share your experience with this vehicle..."
                    ></textarea>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="px-6 py-3 bg-[#1B3B6F] text-white rounded-full hover:bg-[#34495E] transition-colors shadow-lg flex items-center gap-2 cursor-pointer"
                    >
                      <Star className="h-5 w-5" />
                      Submit Review
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
"use client"
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Search, Filter, Grid, List, ChevronDown, ChevronUp, Plus, Minus, X, Check, Apple, Truck, Eye, Leaf, CreditCard, Wallet, Heart } from 'lucide-react';
import { Titillium_Web, Poppins } from 'next/font/google';

const titillium = Poppins({ subsets: ['latin'], weight: ['200', '300', '400', '600', '700', '900'] });

// Fallback image - inline SVG as data URL to prevent 404 errors
const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1559181567-c3190ca9959b?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8ZnJ1aXR8ZW58MHx8MHx8fDA%3D"

// Custom styles for modern cards - moved outside component to prevent recreation
const cardStyles = `
  /* Hide scrollbars globally */
  * {
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none; /* Internet Explorer 10+ */
  }
  
  *::-webkit-scrollbar {
    display: none; /* Safari and Chrome */
  }
  
  .product-card {
    background: #ffffff;
    border-radius: 16px;
    border: 1px solid #f1f5f9;
    transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
    overflow: hidden;
    position: relative;
  }
  
  .product-card:hover {
    transform: translateY(-12px) scale(1.02);
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    border-color: #e2e8f0;
  }
  
  .product-card .image-container {
    position: relative;
    overflow: hidden;
  }
  
  .product-card:not(.list-layout) .image-container {
    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  }
  
  .product-card .product-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  }
  
  .product-card:hover .product-image {
    transform: scale(1.08);
  }
  
  .product-card .category-badge {
    position: absolute;
    top: 12px;
    left: 12px;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 8px;
    padding: 6px 12px;
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: #475569;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  }
  
  .product-card .content {
    padding: 20px;
    background: white;
  }
  
  .product-card .product-title {
    font-size: 18px;
    font-weight: 700;
    color: #1e293b;
    line-height: 1.4;
    margin-bottom: 8px;
    transition: color 0.3s ease;
  }
  
  .product-card:hover .product-title {
    color: #f97316;
  }
  
  .product-card .product-description {
    font-size: 14px;
    color: #64748b;
    line-height: 1.5;
    margin-bottom: 12px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  
  .product-card .rating-container {
    display: flex;
    align-items: center;
    margin-bottom: 16px;
  }
  
  .product-card .stars {
    display: flex;
    margin-right: 8px;
  }
  
  .product-card .star {
    width: 16px;
    height: 16px;
    fill: #fbbf24;
  }
  
  .product-card .rating-text {
    font-size: 12px;
    color: #64748b;
    font-weight: 500;
  }
  
  .product-card .price-section {
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding-top: 16px;
    border-top: 1px solid #f1f5f9;
  }
  
  .product-card .price-container {
    display: flex;
    flex-direction: column;
  }
  
  .product-card .price-row {
    display: flex;
    align-items: baseline;
    gap: 8px;
    margin-bottom: 4px;
  }
  
  .product-card .current-price {
    font-size: 24px;
    font-weight: 800;
    color: #1e293b;
  }
  
  .product-card .original-price {
    font-size: 14px;
    color: #94a3b8;
    text-decoration: line-through;
  }
  
  .product-card .per-unit {
    font-size: 12px;
    color: #64748b;
    font-weight: 500;
  }
  
  .product-card .add-to-cart-btn {
    background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
    color: white;
    border: none;
    border-radius: 12px;
    padding: 12px 20px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    box-shadow: 0 4px 14px 0 rgba(249, 115, 22, 0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    width: 100%;
  }
  
  .product-card .add-to-cart-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px 0 rgba(249, 115, 22, 0.4);
    background: linear-gradient(135deg, #ea580c 0%, #dc2626 100%);
  }
  
  .product-card .footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 12px;
    padding-top: 12px;
    border-top: 1px solid #f8fafc;
  }
  
  .product-card .stock-indicator {
    display: flex;
    align-items: center;
    gap: 6px;
  }
  
  .product-card .stock-dot {
    width: 6px;
    height: 6px;
    background: #22c55e;
    border-radius: 50%;
  }
  
  .product-card .stock-text {
    font-size: 12px;
    color: #64748b;
    font-weight: 500;
  }
  
  .product-card .delivery-text {
    font-size: 12px;
    color: #64748b;
  }
  
  .wishlist-btn {
    position: absolute;
    top: 12px;
    right: 12px;
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(8px);
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-radius: 8px;
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s ease;
    color: #64748b;
  }
  
  .wishlist-btn:hover {
    background: rgba(255, 255, 255, 0.95);
    transform: scale(1.1);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
  
  .wishlist-btn.text-red-500 {
    background: rgba(255, 240, 240, 0.9);
    border-color: rgba(239, 68, 68, 0.2);
  }
  
  .wishlist-btn.text-red-500:hover {
    background: rgba(254, 226, 226, 0.95);
    box-shadow: 0 4px 12px rgba(239, 68, 68, 0.2);
  }
  
  /* List Layout Styles */
  .product-card.list-layout {
    border-radius: 12px;
    overflow: hidden;
    min-height: 120px;
    padding: 0;
  }
  
  .product-card.list-layout:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 28px 0 rgba(0, 0, 0, 0.12);
  }
  
  @media (min-width: 640px) {
    .product-card.list-layout {
      min-height: 200px;
    }
  }
`;

interface Product {
 id: number;
 name: string;
 price: number;
 category: 'fruit' | 'vegetable' | 'fresh food' | 'grocery';
 image: string;
 description: string;
}

interface AddProductForm {
 name: string;
 price: string;
 category: Product['category'];
 image: string;
 description: string;
}

interface CartItem {
 product: Product;
 quantity: number;
}

interface ToastProps {
 message: string;
 onClose: () => void;
}

interface AddProductModalProps {
 addProductForm: AddProductForm;
 setAddProductForm: React.Dispatch<React.SetStateAction<AddProductForm>>;
 addProductImageFile: File | null;
 setAddProductImageFile: React.Dispatch<React.SetStateAction<File | null>>;
 handleAddProduct: () => void;
 setShowAddProductModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const initialProducts: Product[] = [
 { id: 1, name: 'Apple', price: 1.2, category: 'fruit', image: 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=500&h=500&fit=crop', description: 'Fresh red apples' },
 { id: 2, name: 'Carrot', price: 0.8, category: 'vegetable', image: 'https://plus.unsplash.com/premium_photo-1675237625753-c01705e314bb?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8ZnJ1aXR8ZW58MHx8MHx8fDA%3D', description: 'Crunchy orange carrots' },
 { id: 3, name: 'Chicken Breast', price: 5.99, category: 'fresh food', image: 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=500&h=500&fit=crop', description: 'Boneless, skinless chicken breast' },
 { id: 4, name: 'Rice', price: 2.49, category: 'grocery', image: 'https://images.unsplash.com/photo-1608198093002-ad4e005484ec?w=500&h=500&fit=crop', description: 'White long-grain rice' },
 { id: 5, name: 'Banana', price: 0.6, category: 'fruit', image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=500&h=500&fit=crop', description: 'Yellow bananas' },
 { id: 6, name: 'Broccoli', price: 1.5, category: 'vegetable', image: 'https://images.pexels.com/photos/128401/pexels-photo-128401.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500', description: 'Fresh green broccoli' },
 { id: 7, name: 'Ground Beef', price: 4.99, category: 'fresh food', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRe-ptf8tsROOfoWt7x4X81mwljbGs_VvYjJg&s', description: 'Lean ground beef' },
 { id: 8, name: 'Pasta', price: 1.99, category: 'grocery', image: 'data:image/jpeg;base64,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', description: 'Spaghetti pasta' },
 { id: 9, name: 'Orange', price: 0.7, category: 'fruit', image: 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=500&h=500&fit=crop', description: 'Juicy oranges' },
 { id: 10, name: 'Spinach', price: 1.2, category: 'vegetable', image: 'https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8ZnJ1aXR8ZW58MHx8MHx8fDA%3D', description: 'Fresh baby spinach' },
 { id: 11, name: 'Salmon Fillet', price: 7.99, category: 'fresh food', image: 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=500&h=500&fit=crop', description: 'Fresh Atlantic salmon' },
 { id: 12, name: 'Milk', price: 2.99, category: 'grocery', image: 'https://images.unsplash.com/photo-1608198093002-ad4e005484ec?w=500&h=500&fit=crop', description: 'Whole milk' },
];

const categoryColors: Record<Product['category'], string> = {
 fruit: 'bg-orange-100 text-orange-800 border-orange-200',
 vegetable: 'bg-green-100 text-green-800 border-green-200',
 'fresh food': 'bg-red-100 text-red-800 border-red-200',
 grocery: 'bg-blue-100 text-blue-800 border-blue-200',
};

const Toast: React.FC<ToastProps> = ({ message, onClose }) => {
 return (
   <motion.div
     initial={{ opacity: 0, y: 50 }}
     animate={{ opacity: 1, y: 0 }}
     exit={{ opacity: 0, y: 50 }}
     className="fixed bottom-4 right-4 bg-gray-800 text-white px-4 py-3 rounded-lg shadow-lg flex items-center z-50 max-w-[calc(100%-2rem)]"
   >
     <Check className="w-5 h-5 mr-2 text-orange-400 flex-shrink-0" />
     <span className="line-clamp-2">{message}</span>
     <button onClick={onClose} className="ml-4 text-orange-400 hover:text-orange-300 cursor-pointer flex-shrink-0">
       <X className="w-4 h-4" />
     </button>
   </motion.div>
 );
};

const AddProductModal: React.FC<AddProductModalProps> = ({
 addProductForm,
 setAddProductForm,
 addProductImageFile,
 setAddProductImageFile,
 handleAddProduct,
 setShowAddProductModal
}) => {
 return (
   <motion.div
     initial={{ opacity: 0 }}
     animate={{ opacity: 1 }}
     exit={{ opacity: 0 }}
     className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4"
   >
     <motion.div
       initial={{ scale: 0.9, y: 20, opacity: 0 }}
       animate={{ scale: 1, y: 0, opacity: 1 }}
       exit={{ scale: 0.9, y: 20, opacity: 0 }}
       className="bg-white rounded-xl sm:rounded-2xl w-full max-w-md max-h-[95vh] sm:max-h-[90vh] shadow-2xl overflow-hidden"
     >
       <div className="flex flex-col h-full max-h-[95vh] sm:max-h-[90vh]">
         <div className="flex justify-between items-center p-4 sm:p-6 border-b border-gray-100">
           <h2 className="text-lg sm:text-xl font-medium text-gray-900">Add New Product</h2>
           <motion.button
             whileHover={{ scale: 1.1, backgroundColor: "#FEE2E2" }}
             whileTap={{ scale: 0.9 }}
             onClick={() => setShowAddProductModal(false)}
             className="text-gray-400 hover:text-red-500 transition-colors p-1.5 hover:bg-red-50 rounded-full cursor-pointer"
           >
             <X className="w-4.5 h-4.5" />
           </motion.button>
         </div>

         <div className="flex-1 overflow-y-auto min-h-0 p-4 sm:p-6">
         <div className="space-y-4">
           <div>
               <label className="block text-sm font-medium text-gray-900 mb-2">Product Name</label>
             <input
               type="text"
               value={addProductForm.name}
               onChange={(e) => setAddProductForm({ ...addProductForm, name: e.target.value })}
                 className="w-full px-3 py-2.5 sm:py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-800 placeholder-gray-700 text-base sm:text-sm"
               placeholder="Enter product name"
             />
           </div>

           <div>
               <label className="block text-sm font-medium text-gray-900 mb-2">Price</label>
             <input
               type="number"
               step="0.01"
               value={addProductForm.price}
               onChange={(e) => setAddProductForm({ ...addProductForm, price: e.target.value })}
                 className="w-full px-3 py-2.5 sm:py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-800 placeholder-gray-700 text-base sm:text-sm"
               placeholder="Enter price"
             />
           </div>

           <div>
               <label className="block text-sm font-medium text-gray-900 mb-2">Category</label>
             <select
               value={addProductForm.category}
               onChange={(e) => setAddProductForm({ ...addProductForm, category: e.target.value as Product['category'] })}
                 className="w-full px-3 py-2.5 sm:py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-800 cursor-pointer text-base sm:text-sm"
             >
               <option value="fruit">Fruit</option>
               <option value="vegetable">Vegetable</option>
               <option value="fresh food">Fresh Food</option>
               <option value="grocery">Grocery</option>
             </select>
           </div>

           <div>
               <label className="block text-sm font-medium text-gray-900 mb-2">Image (Upload or URL)</label>
             <input
               type="file"
               accept="image/*"
               onChange={e => {
                 if (e.target.files && e.target.files[0]) {
                   setAddProductImageFile(e.target.files[0]);
                 } else {
                   setAddProductImageFile(null);
                 }
               }}
                 className="w-full mb-3 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100 cursor-pointer"
             />
             <input
               type="text"
               value={addProductForm.image}
               onChange={e => setAddProductForm({ ...addProductForm, image: e.target.value })}
                 className="w-full px-3 py-2.5 cursor-pointer sm:py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-800 placeholder-gray-700 text-base sm:text-sm"
               placeholder="Enter image URL (optional if uploading)"
               disabled={!!addProductImageFile}
             />
             {addProductImageFile && (
                 <div className="mt-2 p-2 bg-gray-50 rounded-lg">
                   <span className="text-xs text-gray-600">Selected: {addProductImageFile.name}</span>
                 <button
                   type="button"
                     className="ml-2 text-xs text-red-500 hover:underline cursor-pointer"
                   onClick={() => setAddProductImageFile(null)}
                 >
                   Remove
                 </button>
               </div>
             )}
           </div>

           <div>
               <label className="block text-sm font-medium text-gray-900 mb-2">Description</label>
             <textarea
               value={addProductForm.description}
               onChange={(e) => setAddProductForm({ ...addProductForm, description: e.target.value })}
                 className="w-full px-3 py-2.5 sm:py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-800 placeholder-gray-700 text-base sm:text-sm resize-none"
               placeholder="Enter product description"
               rows={3}
             />
             </div>
           </div>
           </div>

         <div className="p-4 sm:p-6 border-t border-gray-100 bg-white">
             <motion.button
               whileHover={{ scale: 1.02, backgroundColor: "#F97316" }}
               whileTap={{ scale: 0.98 }}
               onClick={handleAddProduct}
             className="w-full bg-orange-500 cursor-pointer text-white font-medium py-3 px-4 rounded-xl transition-colors shadow-md flex items-center justify-center text-base"
             >
               Add Product
             </motion.button>
         </div>
       </div>
     </motion.div>
   </motion.div>
 );
};

const App: React.FC = () => {
 const [products, setProducts] = useState<Product[]>(initialProducts);
 const [cart, setCart] = useState<CartItem[]>([]);
 const [searchTerm, setSearchTerm] = useState('');
 const [selectedCategory, setSelectedCategory] = useState<Product['category'] | null>(null);
 const [sortOption, setSortOption] = useState('default');
 const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
 const [priceRange, setPriceRange] = useState<[number, number]>([0, 10]);
 const [activeFilterCount, setActiveFilterCount] = useState(0);
 const [showFilters, setShowFilters] = useState(false);
 const [showCart, setShowCart] = useState(false);
 const [toast, setToast] = useState<string | null>(null);
 const [showCheckoutModal, setShowCheckoutModal] = useState(false);
 const [agreedToTerms, setAgreedToTerms] = useState(false);
 const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null);
 const [shippingMethod, setShippingMethod] = useState<string>('standard');
 const [isCartAnimating, setIsCartAnimating] = useState(false);
 const [highlightedProduct, setHighlightedProduct] = useState<number | null>(null);
 const [showAddProductModal, setShowAddProductModal] = useState(false);
 const [addProductForm, setAddProductForm] = useState<AddProductForm>({
   name: '',
   price: '',
   category: 'fruit',
   image: '',
   description: ''
 });
 const [addProductImageFile, setAddProductImageFile] = useState<File | null>(null);
 const [favorites, setFavorites] = useState<Set<number>>(new Set());
 const [recentlyAddedItems, setRecentlyAddedItems] = useState<Set<number>>(new Set());

 useEffect(() => {
   const activeFilters = [
     searchTerm,
     selectedCategory,
     sortOption !== 'default',
     priceRange[0] > 0 || priceRange[1] < 10,
   ].filter(Boolean).length;
   setActiveFilterCount(activeFilters);
 }, [searchTerm, selectedCategory, sortOption, priceRange[0], priceRange[1]]);

 // Disable/enable body scroll when modals are open
 useEffect(() => {
   const isAnyModalOpen = showCart || showCheckoutModal || showAddProductModal;
   
   if (isAnyModalOpen) {
     // Disable body scroll
     document.body.style.overflow = 'hidden';
   } else {
     // Enable body scroll
     document.body.style.overflow = 'unset';
   }

   // Cleanup function to restore scroll when component unmounts
   return () => {
     document.body.style.overflow = 'unset';
   };
 }, [showCart, showCheckoutModal, showAddProductModal]);

 const handleAddToCart = (product: Product): void => {
   setCart((prevCart) => {
     const existingItem = prevCart.find((item) => item.product.id === product.id);
     if (existingItem) {
       return prevCart.map((item) =>
         item.product.id === product.id
           ? { ...item, quantity: item.quantity + 1 }
           : item
       );
     }
     return [...prevCart, { product, quantity: 1 }];
   });
   
   setIsCartAnimating(true);
   setTimeout(() => setIsCartAnimating(false), 300);
   
   // Add to recently added items
   setRecentlyAddedItems(prev => new Set(prev).add(product.id));
   
   // Remove from recently added after 2 seconds
   setTimeout(() => {
     setRecentlyAddedItems(prev => {
       const newSet = new Set(prev);
       newSet.delete(product.id);
       return newSet;
     });
   }, 2000);
 };

 const toggleFavorite = (productId: number, productName: string): void => {
   setFavorites((prevFavorites) => {
     const newFavorites = new Set(prevFavorites);
     if (newFavorites.has(productId)) {
       newFavorites.delete(productId);
       setToast(`Removed ${productName} from favorites`);
     } else {
       newFavorites.add(productId);
       setToast(`Added ${productName} to favorites`);
     }
     setTimeout(() => setToast(null), 3000);
     return newFavorites;
   });
 };

 const updateQuantity = (index: number, newQuantity: number): void => {
   if (newQuantity < 1) return;
   setCart((prevCart) => prevCart.map((item, i) =>
     i === index ? { ...item, quantity: newQuantity } : item
   ));
 };

 const removeFromCart = (index: number): void => {
   setCart((prevCart) => prevCart.filter((_, i) => i !== index));
 };

 const cartTotal = cart.reduce((total, item) => total + item.product.price * item.quantity, 0);

 const filteredProducts = products.filter((product) => {
   const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
   const matchesCategory = selectedCategory ? product.category === selectedCategory : true;
   const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
   return matchesSearch && matchesCategory && matchesPrice;
 });

 const sortedProducts = [...filteredProducts].sort((a, b) => {
   if (sortOption === 'price-asc') return a.price - b.price;
   if (sortOption === 'price-desc') return b.price - a.price;
   if (sortOption === 'name') return a.name.localeCompare(b.name);
   return 0;
 });

 const handleCheckout = (): void => {
   if (!agreedToTerms || !selectedPaymentMethod) {
     alert('Please agree to the terms and select a payment method');
     return;
   }
   
   setShowCheckoutModal(false);
   setCart([]);
   setToast('Thank you for your purchase! Your order has been placed successfully.');
   setTimeout(() => setToast(null), 3000);
 };

 const handleAddProduct = (): void => {
   if (!addProductForm.name || !addProductForm.price || (!addProductForm.image && !addProductImageFile) || !addProductForm.description) {
     setToast('Please fill in all fields and provide an image (file or URL)');
     return;
   }

   let imageUrl = addProductForm.image;
   if (addProductImageFile) {
     imageUrl = URL.createObjectURL(addProductImageFile);
   }

   const newProduct: Product = {
     id: Math.max(...products.map(p => p.id), 0) + 1,
     name: addProductForm.name,
     price: parseFloat(addProductForm.price),
     category: addProductForm.category,
     image: imageUrl,
     description: addProductForm.description
   };

   setProducts(prev => {
     const updated = [...prev, newProduct];
     console.log('Updated products:', updated);
     return updated;
   });
   setShowAddProductModal(false);
   setAddProductForm({
     name: '',
     price: '',
     category: 'fruit',
     image: '',
     description: ''
   });
   setAddProductImageFile(null);
   setToast('Product added successfully!');
   // Clear filters and search so new product is visible
   setSearchTerm('');
   setSelectedCategory(null);
   setSortOption('default');
   // Reset price range to show all products including the new one
   setTimeout(() => {
     const allProducts = [...products, newProduct];
     const maxPrice = Math.max(...allProducts.map(p => p.price));
     setPriceRange([0, Math.ceil(maxPrice)]);
   }, 100);
 };

 return (
   <div className={`min-h-screen bg-white ${titillium.className}`}>
     <style dangerouslySetInnerHTML={{ __html: cardStyles }} />
     <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
       <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
         <div className="flex justify-between items-center">
           <h1 className="text-2xl font-extralight text-gray-900 tracking-wide">
             <span className="font-bold">FOOD</span>EXPRESS
           </h1>
           
           <div className="flex items-center space-x-4">
             <motion.button
               whileHover={{ scale: 1.05 }}
               whileTap={{ scale: 0.95 }}
               onClick={() => setShowAddProductModal(true)}
               className="relative p-3 rounded-full bg-orange-500 text-white hover:bg-orange-600 transition-colors cursor-pointer"
               aria-label="Add product"
             >
               <Plus className="w-5 h-5" />
             </motion.button>
             <div className="relative">
               <motion.button
                 onClick={() => setShowCart(!showCart)}
                 className="relative p-3 rounded-full bg-orange-500 text-white hover:bg-orange-600 transition-colors cursor-pointer"
                 whileHover={{ scale: 1.05 }}
                 whileTap={{ scale: 0.95 }}
                 aria-label="Shopping cart"
               >
                 <ShoppingCart className="w-5 h-5" />
                 {cart.length > 0 && (
                   <span className="absolute -top-1 -right-1 bg-amber-300 text-gray-800 text-xs w-5 h-5 flex items-center justify-center rounded-full font-bold">
                     {cart.reduce((acc, item) => acc + item.quantity, 0)}
                   </span>
                 )}
               </motion.button>
               
               <AnimatePresence>
                 {showCart && (
                   <motion.div
                     initial={{ opacity: 0, y: 10, scale: 0.95 }}
                     animate={{ opacity: 1, y: 0, scale: 1 }}
                     exit={{ opacity: 0, y: 10, scale: 0.95 }}
                     transition={{ duration: 0.2 }}
                     className="absolute right-0 mt-3 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl z-50 overflow-hidden border border-gray-200 max-h-[85vh] sm:max-h-[80vh] max-w-[calc(100vw-2rem)] sm:max-w-none"
                   >
                     <div className="flex flex-col h-full max-h-[85vh] sm:max-h-[80vh]">
                       <div className="sticky top-0 bg-gradient-to-r from-orange-500 to-orange-600 p-3 sm:p-4 flex justify-between items-center text-white z-10">
                         <h2 className="font-medium flex items-center text-sm sm:text-base">
                           <ShoppingCart className="w-4 h-4 mr-2" />
                           Your Cart
                           {cart.length > 0 && (
                             <motion.span
                               initial={{ scale: 0.8, opacity: 0 }}
                               animate={{ scale: 1, opacity: 1 }}
                               className="ml-2 bg-amber-300 text-gray-800 text-xs px-2 py-1 rounded-full font-bold"
                             >
                               {cart.reduce((acc, item) => acc + item.quantity, 0)}
                             </motion.span>
                           )}
                         </h2>
                         <motion.button
                           whileHover={{ scale: 1.1, backgroundColor: "rgba(255, 255, 255, 0.2)" }}
                           whileTap={{ scale: 0.9 }}
                           onClick={() => setShowCart(false)}
                           className="text-white/80 hover:text-white p-1.5 rounded-full transition-colors cursor-pointer"
                         >
                           <X className="w-4 h-4 sm:w-5 sm:h-5" />
                         </motion.button>
                       </div>
                       
                       {cart.length === 0 ? (
                         <div className="flex-1 flex items-center justify-center py-8 sm:py-16">
                           <motion.div
                             initial={{ opacity: 0, y: 10 }}
                             animate={{ opacity: 1, y: 0 }}
                             className="text-gray-400 text-center px-4"
                           >
                             <ShoppingCart className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 opacity-30" />
                             <p className="text-base sm:text-lg font-medium mb-2">Your cart is empty</p>
                             <p className="text-xs sm:text-sm mb-6 sm:mb-8 max-w-[200px] sm:max-w-[240px] mx-auto">Add some products to get started with your shopping experience</p>
                             <motion.button
                               whileHover={{ scale: 1.05 }}
                               whileTap={{ scale: 0.95 }}
                               onClick={() => setShowCart(false)}
                               className="inline-flex items-center px-3 py-2 sm:px-4 sm:py-2 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors cursor-pointer text-sm"
                             >
                               Continue Shopping
                             </motion.button>
                           </motion.div>
                         </div>
                       ) : (
                         <>
                           <div className="flex-1 overflow-y-auto min-h-0">
                           <ul className="divide-y divide-gray-200">
                             {cart.map((item, index) => (
                               <motion.li
                                 key={`${item.product.id}-${index}`}
                                 initial={{ opacity: 0, y: 10 }}
                                 animate={{ opacity: 1, y: 0 }}
                                 transition={{ delay: index * 0.05 }}
                                   className="py-3 sm:py-4 px-3 sm:px-4 hover:bg-gray-50 transition-colors"
                               >
                                 <div className="flex justify-between items-center">
                                     <div className="flex items-center flex-1 min-w-0">
                                     <motion.div
                                       whileHover={{ scale: 1.05 }}
                                         className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl overflow-hidden mr-2 sm:mr-3 bg-gray-100 flex items-center justify-center flex-shrink-0"
                                     >
                                       <img
                                           src={item.product.image || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk3YTNiMCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg=='}
                                         alt={item.product.name}
                                         className="w-full h-full object-cover"
                                           onError={(e) => {
                                             const target = e.currentTarget;
                                             if (target.src !== 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk3YTNiMCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==') {
                                               target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk3YTNiMCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==';
                                             }
                                           }}
                                       />
                                     </motion.div>
                                       <div className="flex-1 min-w-0">
                                         <span className="text-gray-900 font-medium block text-xs sm:text-sm mb-0.5 truncate">
                                         {item.product.name}
                                       </span>
                                         <span className="text-orange-600 font-bold text-xs sm:text-sm block">
                                         ${(item.product.price * item.quantity).toFixed(2)}
                                       </span>
                                     </div>
                                   </div>
                                     <div className="flex items-center ml-2">
                                       <div className="flex items-center mr-2 sm:mr-3 bg-white rounded-lg border border-gray-200 shadow-sm">
                                       <motion.button
                                         whileTap={{ scale: 0.9 }}
                                         onClick={() => updateQuantity(index, item.quantity - 1)}
                                           className="p-1 sm:p-1.5 text-gray-500 hover:text-orange-600 transition-colors disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
                                         disabled={item.quantity <= 1}
                                       >
                                         <Minus className="w-3 h-3" />
                                       </motion.button>
                                       <motion.span
                                         key={item.quantity}
                                         initial={{ scale: 0.8, opacity: 0 }}
                                         animate={{ scale: 1, opacity: 1 }}
                                           className="w-6 sm:w-8 text-center font-medium text-xs sm:text-sm text-gray-800"
                                       >
                                         {item.quantity}
                                       </motion.span>
                                       <motion.button
                                         whileTap={{ scale: 0.9 }}
                                         onClick={() => updateQuantity(index, item.quantity + 1)}
                                           className="p-1 sm:p-1.5 text-gray-500 hover:text-orange-600 transition-colors cursor-pointer"
                                       >
                                         <Plus className="w-3 h-3" />
                                       </motion.button>
                                     </div>
                                     <motion.button
                                       whileHover={{ scale: 1.1, backgroundColor: "#FEE2E2" }}
                                       whileTap={{ scale: 0.9 }}
                                       onClick={() => removeFromCart(index)}
                                         className="text-gray-400 hover:text-red-500 transition-colors p-1 sm:p-1.5 hover:bg-red-50 rounded-full cursor-pointer"
                                     >
                                         <X className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                                     </motion.button>
                                   </div>
                                 </div>
                               </motion.li>
                             ))}
                           </ul>
                           </div>
                           <div className="sticky bottom-0 bg-white p-3 sm:p-4 border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
                             <div className="rounded-lg bg-orange-50 p-2.5 sm:p-3 mb-3 sm:mb-4">
                               <div className="flex justify-between text-xs sm:text-sm text-orange-700 mb-2 font-medium">
                                 <span>Subtotal</span>
                                 <span>${cartTotal.toFixed(2)}</span>
                               </div>
                               <div className="flex justify-between text-xs sm:text-sm text-orange-700 mb-2 font-medium">
                                 <span>Delivery</span>
                                 <span>Free</span>
                               </div>
                               <div className="h-px bg-orange-100 my-2"></div>
                               <div className="flex justify-between font-bold text-orange-900">
                                 <span className="text-sm sm:text-base">Total</span>
                                 <motion.span
                                   key={cartTotal}
                                   initial={{ scale: 0.9 }}
                                   animate={{ scale: 1 }}
                                   className="text-lg sm:text-xl"
                                 >
                                   ${cartTotal.toFixed(2)}
                                 </motion.span>
                               </div>
                             </div>
                             
                               <motion.button
                                 whileHover={{ scale: 1.02, backgroundColor: "#F97316" }}
                                 whileTap={{ scale: 0.98 }}
                               className="w-full bg-orange-500 text-white font-medium cursor-pointer py-2.5 sm:py-3 px-4 rounded-xl transition-colors shadow-md flex items-center justify-center text-sm sm:text-base"
                                 onClick={() => {
                                   setShowCart(false);
                                   setShowCheckoutModal(true);
                                 }}
                               >
                                 Proceed to Checkout
                               </motion.button>
                           </div>
                         </>
                       )}
                     </div>
                   </motion.div>
                 )}
               </AnimatePresence>
             </div>
           </div>
         </div>
       </div>
     </header>
     
     <main>
       <section className="relative overflow-hidden bg-gradient-to-br from-orange-500 to-orange-600">
         <div className="max-w-7xl mx-auto px-4 py-20 sm:py-24 sm:px-6 lg:px-8 relative z-10">
           <div className="grid md:grid-cols-5 gap-8 items-center">
             <div className="md:col-span-3 space-y-8">
               <motion.div
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: 0.2 }}
                 className="space-y-4"
               >
                 <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
                   Fresh groceries delivered to your door
                 </h1>
                 <p className="text-orange-100 text-lg sm:text-xl pr-4 lg:pr-12 font-light leading-relaxed">
                   Experience the convenience of online grocery shopping with our premium quality products and express delivery service
                 </p>
               </motion.div>
               
               <motion.div
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: 0.4 }}
                 className="flex flex-wrap gap-3 md:gap-4 pt-4"
               >
                 <motion.a
                   whileHover={{ scale: 1.05 }}
                   whileTap={{ scale: 0.95 }}
                   href="#products"
                   className="inline-flex items-center bg-white text-orange-600 px-8 py-4 rounded-xl font-medium shadow-lg hover:bg-opacity-95 transition-all text-lg"
                 >
                   Start Shopping
                 </motion.a>
                 <motion.button
                   whileHover={{ scale: 1.05 }}
                   whileTap={{ scale: 0.95 }}
                   onClick={() => {
                     const element = document.getElementById('how-it-works');
                     if (element) {
                       const headerOffset = 100;
                       const elementPosition = element.getBoundingClientRect().top;
                       const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                       
                       window.scrollTo({
                         top: offsetPosition,
                         behavior: "smooth"
                       });
                     }
                   }}
                   className="inline-flex items-center bg-orange-600 border-2 border-white text-white px-8 py-4 rounded-xl font-medium shadow-lg hover:bg-orange-700 transition-all text-lg"
                 >
                   How it Works
                 </motion.button>
               </motion.div>
             </div>
             <motion.div
               initial={{ opacity: 0, scale: 0.9 }}
               animate={{ opacity: 1, scale: 1 }}
               transition={{ delay: 0.3, duration: 0.5 }}
               className="md:col-span-2 relative mt-8 md:mt-0 hidden md:block"
             >
               <div className="relative md:absolute md:inset-0 flex items-center justify-center px-4 md:px-0">
                 <div className="relative grid grid-cols-2 gap-3 sm:gap-4 md:gap-6 transform md:translate-x-6 scale-90 sm:scale-95 md:scale-110 max-w-[calc(100vw-2rem)] md:max-w-none">
                   {[
                     { image: 'https://images.unsplash.com/photo-1543528176-61b239494933?w=500&h=500&fit=crop', name: 'Fresh Strawberries', price: 2.49, id: 101, category: 'fruit' as const, description: 'Sweet and juicy fresh strawberries', delay: 0.4 },
                     { image: 'https://organicbox.com.au/cdn/shop/files/boxoforganicbroccoli.jpg?v=1712707543', name: 'Organic Broccoli', price: 1.99, id: 102, category: 'vegetable' as const, description: 'Fresh organic broccoli heads', delay: 0.5 },
                     { image: 'https://images.unsplash.com/photo-1608198093002-ad4e005484ec?w=500&h=500&fit=crop', name: 'Premium Rice', price: 3.29, id: 103, category: 'grocery' as const, description: 'High-quality long grain rice', delay: 0.6 },
                     { image: 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=500&h=500&fit=crop', name: 'Fresh Chicken Breast', price: 6.99, id: 104, category: 'fresh food' as const, description: 'Premium boneless chicken breast', delay: 0.7 },
                   ].map((item, index) => (
                     <motion.div
                       key={index}
                       initial={{ y: 30, opacity: 0 }}
                       animate={{ y: 0, opacity: 1 }}
                       transition={{ delay: item.delay, duration: 0.5 }}
                       whileHover={{ y: -12, transition: { duration: 0.3 } }}
                       className="bg-white rounded-2xl shadow-2xl overflow-hidden transform rotate-2 hover:rotate-0 transition-all"
                     >
                       <div className="h-40 overflow-hidden">
                         <img
                           src={item.image}
                           alt={item.name}
                           className="w-full h-full object-cover"
                         />
                       </div>
                       <div className="p-3 md:p-4">
                         <div className="text-sm md:text-base font-medium text-gray-900 line-clamp-1 mb-1">{item.name}</div>
                         <div className="flex items-center justify-between">
                           <span className="text-orange-600 font-bold text-base md:text-lg">${item.price}</span>
                           <motion.button
                             whileHover={{ scale: 1.1 }}
                             whileTap={{ scale: 0.9 }}
                             onClick={() => {
                               const heroProduct: Product = {
                                 id: item.id,
                                 name: item.name,
                                 price: item.price,
                                 category: item.category,
                                 image: item.image,
                                 description: item.description
                               };
                               handleAddToCart(heroProduct);
                               setHighlightedProduct(item.id);
                               setTimeout(() => setHighlightedProduct(null), 500);
                             }}
                             className="bg-orange-500 text-white px-2 py-1 md:px-3 md:py-1 rounded-lg hover:bg-orange-600 transition-colors cursor-pointer text-sm md:text-base flex items-center justify-center min-w-[60px] md:min-w-[70px]"
                           >
                             <AnimatePresence mode="wait">
                               {recentlyAddedItems.has(item.id) ? (
                                 <motion.div
                                   key="check"
                                   initial={{ scale: 0, opacity: 0 }}
                                   animate={{ scale: 1, opacity: 1 }}
                                   exit={{ scale: 0, opacity: 0 }}
                                   transition={{ duration: 0.2 }}
                                 >
                                   <Check className="w-3 h-3 md:w-4 md:h-4" />
                                 </motion.div>
                               ) : (
                                 <motion.div
                                   key="add"
                                   initial={{ scale: 0, opacity: 0 }}
                                   animate={{ scale: 1, opacity: 1 }}
                                   exit={{ scale: 0, opacity: 0 }}
                                   transition={{ duration: 0.2 }}
                                   className="flex items-center"
                                 >
                                   Add
                                 </motion.div>
                               )}
                             </AnimatePresence>
                           </motion.button>
                         </div>
                       </div>
                     </motion.div>
                   ))}
                 </div>
               </div>
             </motion.div>
           </div>
         </div>
         
         <div className="absolute inset-0 overflow-hidden hidden md:block">
           <motion.div
             initial={{ opacity: 0 }}
             animate={{ opacity: 0.07 }}
             transition={{ duration: 0.5 }}
             className="absolute top-0 right-0 w-[500px] h-[500px] bg-white rounded-full blur-[100px]"
           />
           <motion.div
             initial={{ opacity: 0 }}
             animate={{ opacity: 0.07 }}
             transition={{ duration: 0.5, delay: 0.2 }}
             className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-white rounded-full blur-[100px]"
           />
         </div>
       </section>
       
       <section id="products" className="py-16 bg-gray-50">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="mb-8 space-y-4">
             <div className="flex flex-col md:flex-row md:items-center md:justify-between">
               <div className="mb-4 md:mb-0">
                 <h2 className="text-3xl font-extralight text-gray-900 tracking-wide">Fresh Products</h2>
                 <p className="text-gray-500 mt-1 text-sm max-w-xl">Handpicked daily to bring you the best quality produce</p>
               </div>
               
               <div className="flex flex-col md:flex-row md:items-center space-y-3 md:space-y-0 md:space-x-4">
                 <div className="relative flex-1 max-w-xs">
                   <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                   <input
                     type="search"
                     value={searchTerm}
                     onChange={(e) => setSearchTerm(e.target.value)}
                     className="w-full pl-10 pr-4 py-2 h-10 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-800 placeholder-gray-700"
                     placeholder="Search products..."
                   />
                   {searchTerm && (
                     <motion.button
                       whileHover={{ scale: 1.1 }}
                       whileTap={{ scale: 0.9 }}
                       onClick={() => setSearchTerm('')}
                       className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                     >
                       <X className="w-3.5 h-3.5" />
                     </motion.button>
                   )}
                 </div>
                 
                 <div className="flex border border-gray-200 rounded-lg bg-white">
                   <motion.button
                     whileTap={{ scale: 0.9 }}
                     onClick={() => setViewMode('grid')}
                     className={`p-2 cursor-pointer ${viewMode === 'grid' ? 'text-orange-500' : 'text-gray-400 hover:text-gray-600'} transition-colors`}
                   >
                     <Grid className="w-5 h-5" />
                   </motion.button>
                   <motion.button
                     whileTap={{ scale: 0.9 }}
                     onClick={() => setViewMode('list')}
                     className={`p-2 cursor-pointer ${viewMode === 'list' ? 'text-orange-500' : 'text-gray-400 hover:text-gray-600'} transition-colors`}
                   >
                     <List className="w-5 h-5" />
                   </motion.button>
                 </div>
               </div>
             </div>
             
             {/* Sleek Filter Bar - Always Visible */}
             <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-3 sm:p-4">
               <div className="space-y-3 sm:space-y-0 sm:flex sm:flex-wrap sm:items-center sm:gap-4 lg:gap-6">
                 {/* Row 1: Category and Sort */}
                 <div className="flex flex-col xs:flex-row gap-3 sm:gap-4">
                   {/* Category Filter */}
                   <div className="flex items-center space-x-2 flex-1 xs:flex-initial">
                     <label className="text-sm font-medium text-gray-700 whitespace-nowrap">Category:</label>
                     <div className="relative flex-1 xs:flex-initial">
                         <select
                           value={selectedCategory || ''}
                           onChange={(e) => setSelectedCategory(e.target.value as Product['category'] | null)}
                         className="appearance-none bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-orange-500 focus:border-orange-500 px-3 py-1.5 pr-8 cursor-pointer w-full xs:min-w-[120px]"
                         >
                         <option value="">All</option>
                           <option value="fruit">Fruit</option>
                           <option value="vegetable">Vegetable</option>
                           <option value="fresh food">Fresh Food</option>
                           <option value="grocery">Grocery</option>
                         </select>
                       <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                       </div>
                     </div>
                     
                   {/* Sort Filter */}
                   <div className="flex items-center space-x-2 flex-1 xs:flex-initial">
                     <label className="text-sm font-medium text-gray-700 whitespace-nowrap">Sort:</label>
                     <div className="relative flex-1 xs:flex-initial">
                         <select
                           value={sortOption}
                           onChange={(e) => setSortOption(e.target.value)}
                         className="appearance-none bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-orange-500 focus:border-orange-500 px-3 py-1.5 pr-8 cursor-pointer w-full xs:min-w-[140px]"
                         >
                           <option value="default">Default</option>
                           <option value="price-asc">Price: Low to High</option>
                           <option value="price-desc">Price: High to Low</option>
                           <option value="name">Name</option>
                         </select>
                       <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                     </div>
                       </div>
                     </div>
                     
                 {/* Row 2: Price Range */}
                 <div className="flex items-center space-x-3 flex-1 min-w-0">
                   <label className="text-sm font-medium text-gray-700 whitespace-nowrap">Price:</label>
                   <div className="flex-1 relative min-w-0">
                     <div className="flex items-center justify-between mb-2">
                       <span className="text-xs font-medium text-orange-600">${priceRange[0].toFixed(2)}</span>
                       <span className="text-xs font-medium text-orange-600">${priceRange[1].toFixed(2)}</span>
                         </div>
                     <div className="relative h-6 flex items-center">
                       {/* Track background */}
                       <div className="absolute w-full h-2 bg-gray-200 rounded-full"></div>
                       
                       {/* Active range */}
                       <div
                         className="absolute h-2 bg-gradient-to-r from-orange-400 to-orange-500 rounded-full"
                         style={{
                           left: `${(priceRange[0] / 10) * 100}%`,
                           width: `${((priceRange[1] - priceRange[0]) / 10) * 100}%`,
                         }}
                       ></div>
                       
                       {/* Min range slider */}
                           <input
                             type="range"
                             min={0}
                             max={10}
                             step={0.1}
                         value={priceRange[0]}
                         onChange={(e) => {
                           const newValue = parseFloat(e.target.value);
                           if (newValue < priceRange[1]) {
                             setPriceRange(prev => [newValue, prev[1]]);
                           }
                         }}
                         className="absolute w-full h-6 opacity-0 cursor-pointer z-10"
                         style={{ pointerEvents: 'none' }}
                       />
                       
                       {/* Max range slider */}
                       <input
                         type="range"
                         min={0}
                         max={10}
                         step={0.1}
                         value={priceRange[1]}
                         onChange={(e) => {
                           const newValue = parseFloat(e.target.value);
                           if (newValue > priceRange[0]) {
                             setPriceRange(prev => [prev[0], newValue]);
                           }
                         }}
                         className="absolute w-full h-6 opacity-0 cursor-pointer z-20"
                         style={{ pointerEvents: 'none' }}
                       />
                       
                       
                       {/* Visible thumb handles with individual interaction areas */}
                             <div
                         className="absolute w-8 h-8 flex items-center justify-center z-30 transform -translate-x-1/2 cursor-pointer"
                         style={{ left: `${(priceRange[0] / 10) * 100}%` }}
                         onMouseDown={(e) => {
                           e.preventDefault();
                           const startX = e.clientX;
                           const startValue = priceRange[0];
                           const rect = e.currentTarget.parentElement?.getBoundingClientRect();
                           if (!rect) return;
                           
                           const handleMouseMove = (e: MouseEvent) => {
                             const deltaX = e.clientX - startX;
                             const deltaValue = (deltaX / rect.width) * 10;
                             const newValue = Math.max(0, Math.min(priceRange[1] - 0.1, startValue + deltaValue));
                             setPriceRange(prev => [Math.round(newValue * 10) / 10, prev[1]]);
                           };
                           
                           const handleMouseUp = () => {
                             document.removeEventListener('mousemove', handleMouseMove);
                             document.removeEventListener('mouseup', handleMouseUp);
                           };
                           
                           document.addEventListener('mousemove', handleMouseMove);
                           document.addEventListener('mouseup', handleMouseUp);
                         }}
                       >
                         <div className="w-5 h-5 bg-white border-2 border-orange-500 rounded-full shadow-md hover:scale-110 transition-transform"></div>
                           </div>
                       <div
                         className="absolute w-8 h-8 flex items-center justify-center z-30 transform -translate-x-1/2 cursor-pointer"
                         style={{ left: `${(priceRange[1] / 10) * 100}%` }}
                         onMouseDown={(e) => {
                           e.preventDefault();
                           const startX = e.clientX;
                           const startValue = priceRange[1];
                           const rect = e.currentTarget.parentElement?.getBoundingClientRect();
                           if (!rect) return;
                           
                           const handleMouseMove = (e: MouseEvent) => {
                             const deltaX = e.clientX - startX;
                             const deltaValue = (deltaX / rect.width) * 10;
                             const newValue = Math.max(priceRange[0] + 0.1, Math.min(10, startValue + deltaValue));
                             setPriceRange(prev => [prev[0], Math.round(newValue * 10) / 10]);
                           };
                           
                           const handleMouseUp = () => {
                             document.removeEventListener('mousemove', handleMouseMove);
                             document.removeEventListener('mouseup', handleMouseUp);
                           };
                           
                           document.addEventListener('mousemove', handleMouseMove);
                           document.addEventListener('mouseup', handleMouseUp);
                         }}
                       >
                         <div className="w-5 h-5 bg-white border-2 border-orange-500 rounded-full shadow-md hover:scale-110 transition-transform"></div>
                         </div>
                     </div>
                   </div>
                 </div>

                 {/* Results and Clear - Fixed positioning */}
                 <div className="flex items-center justify-between sm:justify-start sm:space-x-4 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                   <div className="text-center sm:text-left">
                     <span className="text-lg font-bold text-gray-900">{sortedProducts.length}</span>
                     <p className="text-xs text-gray-500">found</p>
                   </div>
                   
                   {(searchTerm || selectedCategory || sortOption !== 'default' || priceRange[0] > 0 || priceRange[1] < 10) && (
                     <motion.button
                       whileHover={{ scale: 1.02 }}
                       whileTap={{ scale: 0.98 }}
                       onClick={() => {
                         setSearchTerm('');
                         setSelectedCategory(null);
                         setSortOption('default');
                         setPriceRange([0, 10]);
                       }}
                       className="text-xs text-orange-600 hover:text-orange-800 transition-colors cursor-pointer px-2 py-1 border border-orange-200 rounded-md hover:bg-orange-50 whitespace-nowrap"
                           >
                       Clear All
                     </motion.button>
                   )}
                         </div>
                       </div>
                     </div>
             
             <div className={`grid gap-6 ${viewMode === 'list' ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'}`} id="product-grid">
               {sortedProducts.length === 0 ? (
                 <div className="col-span-full">
                   <motion.div
                     initial={{ opacity: 0, y: 20 }}
                     animate={{ opacity: 1, y: 0 }}
                     className="text-center py-8 px-4"
                   >
                     <div className="max-w-md mx-auto">
                       <motion.div
                         initial={{ scale: 0.8, opacity: 0 }}
                         animate={{ scale: 1, opacity: 1 }}
                         transition={{ delay: 0.2 }}
                         className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center"
                       >
                         <Search className="w-10 h-10 text-gray-400" />
                       </motion.div>
                       
                       <motion.h3
                         initial={{ opacity: 0, y: 10 }}
                         animate={{ opacity: 1, y: 0 }}
                         transition={{ delay: 0.3 }}
                         className="text-2xl font-medium text-gray-900 mb-3"
                       >
                         No products found
                       </motion.h3>
                       
                       <motion.p
                         initial={{ opacity: 0, y: 10 }}
                         animate={{ opacity: 1, y: 0 }}
                         transition={{ delay: 0.4 }}
                         className="text-gray-500 mb-8 leading-relaxed"
                       >
                         We couldn't find any products matching your current filters. Try adjusting your search criteria or clear all filters to see all products.
                       </motion.p>
                       
                       <motion.div
                         initial={{ opacity: 0, y: 10 }}
                         animate={{ opacity: 1, y: 0 }}
                         transition={{ delay: 0.5 }}
                         className="space-y-3"
                       >
                         <motion.button
                           whileHover={{ scale: 1.05, backgroundColor: "#F97316" }}
                           whileTap={{ scale: 0.95 }}
                           onClick={() => {
                             setSearchTerm('');
                             setSelectedCategory(null);
                             setSortOption('default');
                             setPriceRange([0, 10]);
                           }}
                           className="bg-orange-500 text-white px-8 py-3 rounded-xl font-medium hover:bg-orange-600 transition-colors shadow-md cursor-pointer"
                         >
                           Clear All Filters
                         </motion.button>
                         
                         <div className="text-sm text-gray-400">
                           or try searching for something else
                   </div>
                 </motion.div>
                       
                       {/* Active filters display */}
                       {(searchTerm || selectedCategory || sortOption !== 'default' || priceRange[0] > 0 || priceRange[1] < 10) && (
                         <motion.div
                           initial={{ opacity: 0, y: 10 }}
                           animate={{ opacity: 1, y: 0 }}
                           transition={{ delay: 0.6 }}
                           className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200"
                         >
                           <p className="text-sm font-medium text-gray-700 mb-3">Active filters:</p>
                           <div className="flex flex-wrap gap-2 justify-center">
                             {searchTerm && (
                               <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                                 Search: "{searchTerm}"
                               </span>
                             )}
                             {selectedCategory && (
                               <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                 Category: {selectedCategory}
                               </span>
                             )}
                             {sortOption !== 'default' && (
                               <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                 Sort: {sortOption === 'price-asc' ? 'Price: Low to High' : sortOption === 'price-desc' ? 'Price: High to Low' : 'Name'}
                               </span>
                             )}
                             {(priceRange[0] > 0 || priceRange[1] < 10) && (
                               <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                 Price: ${priceRange[0].toFixed(2)} - ${priceRange[1].toFixed(2)}
                               </span>
                             )}
                           </div>
                         </motion.div>
                       )}
                     </div>
                   </motion.div>
                 </div>
               ) : (
                 sortedProducts.map((product, index) => (
                 <motion.div
                   key={product.id}
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{
                     delay: viewMode === 'grid' ? index * 0.05 : 0,
                     duration: 0.3,
                     ease: "easeOut"
                   }}
                     className={`product-card ${viewMode === 'list' ? 'list-layout' : ''}`}
                   >
                     {viewMode === 'list' ? (
                       // List Layout
                       <div className="flex h-full overflow-hidden">
                         {/* Image Container - Left Side */}
                         <div className="relative w-24 sm:w-48 flex-shrink-0 overflow-hidden">
                     <img
                             src={product.image || FALLBACK_IMAGE}
                       alt={product.name}
                       className="w-full h-full object-cover"
                             onError={(e) => {
                               const target = e.currentTarget;
                               if (target.src !== FALLBACK_IMAGE) {
                                 target.src = FALLBACK_IMAGE;
                               }
                             }}
                     />
                           
                           {/* Category Badge - Mobile Only */}
                           <div className="absolute bottom-1 left-1 sm:top-3 sm:left-3 sm:bottom-auto bg-white/90 backdrop-blur-sm border border-gray-200 rounded px-1 sm:px-2 py-0.5 sm:py-1">
                             <span className="text-[10px] sm:text-xs font-medium text-gray-700 uppercase tracking-wide">
                         {product.category}
                       </span>
                     </div>
                           
                           {/* Wishlist Button */}
                           <motion.button
                             whileHover={{ scale: 1.1 }}
                             whileTap={{ scale: 0.9 }}
                             onClick={() => toggleFavorite(product.id, product.name)}
                             className={`absolute top-1 right-1 sm:top-3 sm:right-3 w-6 h-6 sm:w-8 sm:h-8 rounded bg-white/90 backdrop-blur-sm border border-gray-200 flex items-center justify-center cursor-pointer transition-colors ${favorites.has(product.id) ? 'text-red-500' : 'text-gray-400'}`}
                           >
                             <Heart 
                               className="w-3 h-3 sm:w-4 sm:h-4" 
                               fill={favorites.has(product.id) ? "currentColor" : "none"}
                             />
                           </motion.button>
                         </div>
                         
                         {/* Content Container - Right Side */}
                         <div className="flex-1 p-3 sm:p-6 flex flex-col justify-between min-h-0">
                           {/* Content Row */}
                           <div className="flex-1 min-h-0">
                             <h3 className="text-sm sm:text-xl font-bold text-gray-900 mb-1 sm:mb-2 line-clamp-1">{product.name}</h3>
                             <p className="text-gray-600 text-xs sm:text-sm mb-2 sm:mb-3 line-clamp-1 sm:line-clamp-2">{product.description}</p>
                             
                             {/* Rating - Hidden on small mobile, visible on larger screens */}
                             <div className="hidden xs:flex sm:flex items-center mb-2 sm:mb-3">
                               <div className="flex mr-2">
                                 {[...Array(5)].map((_, i) => (
                                   <svg key={i} className="w-3 h-3 sm:w-4 sm:h-4 fill-yellow-400" viewBox="0 0 20 20">
                                     <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                                   </svg>
                                 ))}
                               </div>
                               <span className="text-xs text-gray-500">(4.8)</span>
                             </div>
                             
                             {/* Price */}
                             <div className="flex items-baseline gap-1 sm:gap-2 mb-1">
                               <span className="text-lg sm:text-2xl font-bold text-gray-900">${product.price.toFixed(2)}</span>
                               <span className="text-xs sm:text-sm text-gray-400 line-through">${(product.price * 1.2).toFixed(2)}</span>
                             </div>
                             <span className="text-xs text-gray-500">per unit</span>
                           </div>
                           
                           {/* Button Row */}
                           <div className="flex items-center justify-between pt-2 sm:pt-3 border-t border-gray-100 mt-2 sm:mt-4">
                             <div className="flex items-center text-xs text-gray-500">
                               <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full mr-1 sm:mr-2"></div>
                               <span className="hidden sm:inline">In Stock • Free delivery</span>
                               <span className="sm:hidden">In Stock</span>
                             </div>
                             
                             <motion.button
                               whileHover={{ scale: 1.05 }}
                               whileTap={{ scale: 0.95 }}
                               onClick={() => {
                                 handleAddToCart(product);
                                 setHighlightedProduct(product.id);
                                 setTimeout(() => setHighlightedProduct(null), 500);
                               }}
                               className="bg-orange-500 text-white px-3 py-1.5 sm:px-6 sm:py-2 rounded-md sm:rounded-lg hover:bg-orange-600 transition-colors font-medium flex items-center gap-1 sm:gap-2 cursor-pointer text-xs sm:text-sm min-w-[80px] sm:min-w-[120px] justify-center"
                             >
                               <AnimatePresence mode="wait">
                                 {recentlyAddedItems.has(product.id) ? (
                                   <motion.div
                                     key="check"
                                     initial={{ scale: 0, opacity: 0 }}
                                     animate={{ scale: 1, opacity: 1 }}
                                     exit={{ scale: 0, opacity: 0 }}
                                     transition={{ duration: 0.2 }}
                                     className="flex items-center gap-1 sm:gap-2"
                                   >
                                     <Check className="w-3 h-3 sm:w-4 sm:h-4" />
                                     <span className="hidden xs:inline sm:inline">Added</span>
                                     <span className="xs:hidden sm:hidden">✓</span>
                                   </motion.div>
                                 ) : (
                                   <motion.div
                                     key="add"
                                     initial={{ scale: 0, opacity: 0 }}
                                     animate={{ scale: 1, opacity: 1 }}
                                     exit={{ scale: 0, opacity: 0 }}
                                     transition={{ duration: 0.2 }}
                                     className="flex items-center gap-1 sm:gap-2"
                                   >
                                     <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                                     <span className="hidden xs:inline sm:inline">Add to Cart</span>
                                     <span className="xs:hidden sm:hidden">Add</span>
                                   </motion.div>
                                 )}
                               </AnimatePresence>
                             </motion.button>
                           </div>
                         </div>
                       </div>
                     ) : (
                       // Grid Layout (existing)
                       <>
                         {/* Image Container */}
                         <div className="image-container h-64">
                           <img
                             src={product.image || FALLBACK_IMAGE}
                             alt={product.name}
                             className="product-image"
                             onError={(e) => {
                               const target = e.currentTarget;
                               if (target.src !== FALLBACK_IMAGE) {
                                 target.src = FALLBACK_IMAGE;
                               }
                             }}
                           />
                           
                           {/* Category Badge */}
                           <div className="category-badge">
                             {product.category}
                           </div>
                           
                           {/* Wishlist Button */}
                           <motion.button
                             whileHover={{ scale: 1.1 }}
                             whileTap={{ scale: 0.9 }}
                             onClick={() => toggleFavorite(product.id, product.name)}
                             className={`wishlist-btn ${favorites.has(product.id) ? 'text-red-500' : 'text-gray-400'}`}
                             animate={{
                               color: favorites.has(product.id) ? "#ef4444" : "#9ca3af"
                             }}
                           >
                             <Heart 
                               className="w-4 h-4" 
                               fill={favorites.has(product.id) ? "currentColor" : "none"}
                             />
                           </motion.button>
                           
                           {/* Highlight Border */}
                     {highlightedProduct === product.id && (
                       <motion.div
                         initial={{ scale: 0, opacity: 0 }}
                         animate={{ scale: 1, opacity: 1 }}
                         exit={{ scale: 0, opacity: 0 }}
                               className="absolute inset-0 border-3 border-orange-400 rounded-2xl pointer-events-none z-10 shadow-lg"
                               style={{ borderWidth: '3px' }}
                       />
                     )}
                   </div>
                   
                         {/* Content */}
                         <div className="content">
                           {/* Title */}
                           <h3 className="product-title">{product.name}</h3>
                           
                           {/* Description */}
                           <p className="product-description">{product.description}</p>
                           
                           {/* Rating */}
                           <div className="rating-container">
                             <div className="stars">
                               {[...Array(5)].map((_, i) => (
                                 <svg key={i} className="star" viewBox="0 0 20 20">
                                   <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                                 </svg>
                               ))}
                             </div>
                             <span className="rating-text">(4.8)</span>
                     </div>
                     
                           {/* Price Section */}
                           <div className="price-section">
                             <div className="price-container">
                               <div className="price-row">
                                 <span className="current-price">${product.price.toFixed(2)}</span>
                                 <span className="original-price">${(product.price * 1.2).toFixed(2)}</span>
                               </div>
                               <span className="per-unit">per unit</span>
                       </div>
                       
                       <motion.button
                         whileHover={{ scale: 1.05 }}
                         whileTap={{ scale: 0.95 }}
                         onClick={() => {
                           handleAddToCart(product);
                           setHighlightedProduct(product.id);
                           setTimeout(() => setHighlightedProduct(null), 500);
                         }}
                               className="add-to-cart-btn"
                       >
                               <AnimatePresence mode="wait">
                                 {recentlyAddedItems.has(product.id) ? (
                                   <motion.div
                                     key="check"
                                     initial={{ scale: 0, opacity: 0 }}
                                     animate={{ scale: 1, opacity: 1 }}
                                     exit={{ scale: 0, opacity: 0 }}
                                     transition={{ duration: 0.2 }}
                                     className="flex items-center gap-2"
                                   >
                                     <Check className="w-4 h-4" />
                                     Added to Cart
                                   </motion.div>
                                 ) : (
                                   <motion.div
                                     key="add"
                                     initial={{ scale: 0, opacity: 0 }}
                                     animate={{ scale: 1, opacity: 1 }}
                                     exit={{ scale: 0, opacity: 0 }}
                                     transition={{ duration: 0.2 }}
                                     className="flex items-center gap-2"
                                   >
                                     <Plus className="w-4 h-4" />
                                     Add to Cart
                                   </motion.div>
                                 )}
                               </AnimatePresence>
                       </motion.button>
                     </div>
                           
                           {/* Footer */}
                           <div className="footer">
                             <div className="stock-indicator">
                               <div className="stock-dot"></div>
                               <span className="stock-text">In Stock</span>
                   </div>
                             <span className="delivery-text">Free delivery</span>
                           </div>
                         </div>
                       </>
                     )}
                 </motion.div>
                 ))
               )}
             </div>
           </div>
         </div>
       </section>
       
       <section id="how-it-works" className="py-16 bg-white">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="text-center mb-16">
             <motion.h2
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               className="text-3xl font-extralight text-gray-900 tracking-wide"
             >
               How it Works
             </motion.h2>
             <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto">
               Simple steps to get your fresh groceries delivered
             </p>
           </div>
           
           <div className="grid md:grid-cols-3 gap-12 md:gap-6">
             {[
               {
                 title: 'Browse Products',
                 description: 'Explore our wide selection of fresh produce, meats, and pantry staples. Use our filters to find exactly what you need.',
                 icon: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=500&h=500&fit=crop',
                 delay: 0.2
               },
               {
                 title: 'Add to Cart',
                 description: 'Simply click the "Add" button on any product card to add it to your cart. You can adjust quantities or remove items at any time.',
                 icon: 'https://images.unsplash.com/photo-1608198093002-ad4e005484ec?w=500&h=500&fit=crop',
                 delay: 0.4
               },
               {
                 title: 'Checkout & Delivery',
                 description: 'Review your order, select your preferred delivery time, and complete payment. We\'ll deliver your groceries right to your doorstep.',
                 icon: 'https://images.unsplash.com/photo-1587300003388-59208cc4b425?w=500&h=500&fit=crop',
                 delay: 0.6
               }
             ].map((step, index) => (
               <motion.div
                 key={index}
                 initial={{ opacity: 0, y: 30 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 transition={{ delay: step.delay }}
                 className="text-center group"
               >
                 <div className="relative w-24 h-24 mx-auto mb-8">
                   <div className="absolute inset-0 bg-orange-500 rounded-full group-hover:scale-110 group-hover:bg-orange-600 transition-all duration-300 z-10 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                     {index + 1}
                   </div>
                   <div className="absolute inset-0 bg-orange-100 rounded-full blur-xl group-hover:blur-2xl transition-all duration-300 opacity-50"></div>
                   <img
                     src={step.icon}
                     alt={step.title}
                     className="absolute inset-0 w-full h-full object-cover rounded-full opacity-0 group-hover:opacity-30 transition-opacity duration-300"
                   />
                 </div>
                 <h3 className="text-xl font-medium text-gray-900 mb-3">{step.title}</h3>
                 <p className="text-gray-500 mx-auto max-w-xs leading-relaxed">{step.description}</p>
               </motion.div>
             ))}
           </div>
         </div>
       </section>
       
       <section className="py-16 bg-orange-500">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="text-center mb-12">
             <motion.h2
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               className="text-3xl font-extralight text-white tracking-wide"
             >
               Why Choose FoodExpress
             </motion.h2>
             <p className="mt-4 text-lg text-orange-100 max-w-2xl mx-auto">
               We're committed to providing the best grocery shopping experience
             </p>
           </div>
           
           <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
             {([
               {
                 title: 'Freshness Guaranteed',
                 description: 'We source directly from local farms to ensure the freshest produce every time.',
                 icon: Apple,
                 delay: 0.2
               },
               {
                 title: 'Fast Delivery',
                 description: 'Get your groceries delivered within 24 hours of ordering. Fresh and fast.',
                 icon: Truck,
                 delay: 0.3
               },
               {
                 title: 'Quality Control',
                 description: 'Our team carefully inspects every order to ensure you receive only the best quality products.',
                 icon: Eye,
                 delay: 0.4
               },
               {
                 title: 'Local Support',
                 description: "We're proud to support local farmers and producers in your community.",
                 icon: Leaf,
                 delay: 0.5
               }
             ] as const).map((feature, index) => (
               <motion.div
                 key={index}
                 initial={{ opacity: 0, y: 30 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 transition={{ delay: feature.delay }}
                 className="bg-orange-600 rounded-xl p-6 text-white"
               >
                 <div className="flex items-center mb-4">
                   <feature.icon className="w-8 h-8 mr-3 text-white" />
                   <h3 className="text-lg font-medium">{feature.title}</h3>
                 </div>
                 <p className="text-orange-100 text-sm leading-relaxed">{feature.description}</p>
               </motion.div>
             ))}
           </div>
         </div>
       </section>
     </main>
     
     <footer className="bg-gray-50 border-t border-gray-200">
       <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
         <div className="flex flex-col md:flex-row justify-between items-center">
           <div className="mb-8 md:mb-0">
             <h2 className="text-2xl font-extralight text-gray-900 tracking-wide">
               <span className="font-bold">FOOD</span>EXPRESS
             </h2>
             <p className="mt-2 text-gray-500 text-sm max-w-md">
               Your trusted partner for fresh groceries delivered right to your door. Quality, convenience, and freshness - every time.
             </p>
           </div>
           <div>
             <p className="text-xs text-gray-400">© {new Date().getFullYear()} FoodExpress. All rights reserved.</p>
           </div>
         </div>
       </div>
     </footer>
     
     <AnimatePresence>
       {showCheckoutModal && (
         <motion.div
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           exit={{ opacity: 0 }}
           className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4"
         >
           <motion.div
             initial={{ scale: 0.9, y: 20, opacity: 0 }}
             animate={{ scale: 1, y: 0, opacity: 1 }}
             exit={{ scale: 0.9, y: 20, opacity: 0 }}
             className="bg-white rounded-xl sm:rounded-2xl w-full max-w-md max-h-[95vh] sm:max-h-[90vh] shadow-2xl overflow-hidden"
           >
             <div className="flex flex-col h-full max-h-[95vh] sm:max-h-[90vh]">
               <div className="flex justify-between items-center p-4 sm:p-6 border-b border-gray-100">
                 <h2 className="text-lg sm:text-xl font-medium text-gray-900">Complete Your Order</h2>
                 <motion.button
                   whileHover={{ scale: 1.1, backgroundColor: "#FEE2E2" }}
                   whileTap={{ scale: 0.9 }}
                   onClick={() => setShowCheckoutModal(false)}
                   className="text-gray-400 hover:text-red-500 transition-colors p-1.5 hover:bg-red-50 rounded-full cursor-pointer"
                 >
                   <X className="w-4.5 h-4.5" />
                 </motion.button>
               </div>
               
               <div className="flex-1 overflow-y-auto min-h-0 p-4 sm:p-6">
                 <div className="space-y-4 sm:space-y-6">
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Address</label>
                     <div className="p-3 sm:p-4 bg-gray-50 rounded-lg border border-gray-200">
                     <p className="text-sm text-gray-900 font-medium">John Doe</p>
                     <p className="text-sm text-gray-500">123 Main St, Apt 4</p>
                     <p className="text-sm text-gray-500">New York, NY 10001</p>
                     <p className="text-sm text-gray-500">USA</p>
                   </div>
                 </div>
                 
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Method</label>
                     <div className="grid gap-2 sm:gap-3">
                     <motion.button
                       whileHover={{ scale: 1.02, backgroundColor: shippingMethod === 'express' ? "#FFF1F2" : undefined }}
                       whileTap={{ scale: 0.98 }}
                       onClick={() => setShippingMethod('express')}
                         className={`flex justify-between items-center p-3 sm:p-4 rounded-lg border-2 ${shippingMethod === 'express' ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-orange-300'} transition-all cursor-pointer`}
                     >
                       <div>
                         <p className="text-sm font-medium text-gray-900">Express Delivery</p>
                         <p className="text-xs text-gray-500 mt-1">Next day delivery. $9.99</p>
                       </div>
                       {shippingMethod === 'express' && <Check className="w-5 h-5 text-orange-500" />}
                     </motion.button>
                     
                     <motion.button
                       whileHover={{ scale: 1.02, backgroundColor: shippingMethod === 'standard' ? "#FFF1F2" : undefined }}
                       whileTap={{ scale: 0.98 }}
                       onClick={() => setShippingMethod('standard')}
                         className={`flex justify-between items-center p-3 sm:p-4 rounded-lg border-2 ${shippingMethod === 'standard' ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-orange-300'} transition-all cursor-pointer`}
                     >
                       <div>
                         <p className="text-sm font-medium text-gray-900">Standard Delivery</p>
                         <p className="text-xs text-gray-500 mt-1">2-3 business days. Free</p>
                       </div>
                       {shippingMethod === 'standard' && <Check className="w-5 h-5 text-orange-500" />}
                     </motion.button>
                   </div>
                 </div>
                 
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
                     <div className="grid gap-2 sm:gap-3">
                     <motion.button
                       whileHover={{ scale: 1.02, backgroundColor: selectedPaymentMethod === 'credit-card' ? "#FFF1F2" : undefined }}
                       whileTap={{ scale: 0.98 }}
                       onClick={() => setSelectedPaymentMethod('credit-card')}
                         className={`flex justify-between items-center p-3 sm:p-4 rounded-lg border-2 ${selectedPaymentMethod === 'credit-card' ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-orange-300'} transition-all cursor-pointer`}
                     >
                       <div className="flex items-center">
                           <div className="w-10 h-6 sm:w-12 sm:h-8 bg-gray-200 rounded-md mr-3 flex items-center justify-center">
                             <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                         </div>
                         <p className="text-sm font-medium text-gray-900">Credit / Debit Card</p>
                       </div>
                       {selectedPaymentMethod === 'credit-card' && <Check className="w-5 h-5 text-orange-500" />}
                     </motion.button>
                     
                     <motion.button
                       whileHover={{ scale: 1.02, backgroundColor: selectedPaymentMethod === 'paypal' ? "#FFF1F2" : undefined }}
                       whileTap={{ scale: 0.98 }}
                       onClick={() => setSelectedPaymentMethod('paypal')}
                         className={`flex justify-between items-center p-3 sm:p-4 rounded-lg border-2 ${selectedPaymentMethod === 'paypal' ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-orange-300'} transition-all cursor-pointer`}
                     >
                       <div className="flex items-center">
                           <div className="w-10 h-6 sm:w-12 sm:h-8 bg-gray-200 rounded-md mr-3 flex items-center justify-center">
                             <Wallet className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                         </div>
                         <p className="text-sm font-medium text-gray-900">PayPal</p>
                       </div>
                       {selectedPaymentMethod === 'paypal' && <Check className="w-5 h-5 text-orange-500" />}
                     </motion.button>
                   </div>
                 </div>
                 
                   <div className="pt-2 sm:pt-4 border-t border-gray-200">
                     <h3 className="text-base font-medium text-gray-900 mb-3 sm:mb-4">Order Summary</h3>
                     <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6 max-h-32 sm:max-h-40 overflow-y-auto pr-2">
                     {cart.map((item, index) => (
                       <div key={index} className="flex justify-between text-sm">
                           <span className="text-gray-700 truncate mr-2">
                           {item.product.name} x{item.quantity}
                         </span>
                           <span className="text-gray-900 font-medium flex-shrink-0">
                           ${(item.product.price * item.quantity).toFixed(2)}
                         </span>
                       </div>
                     ))}
                   </div>
                     <div className="flex justify-between font-bold text-lg border-t border-gray-100 pt-2">
                     <span>Total</span>
                     <span>${cartTotal.toFixed(2)}</span>
                   </div>
                 </div>
                 
                   <div className="flex items-start">
                   <motion.button
                     whileTap={{ scale: 0.9 }}
                     onClick={() => setAgreedToTerms(!agreedToTerms)}
                       className="w-5 h-5 rounded border-2 flex items-center justify-center cursor-pointer mt-0.5 flex-shrink-0"
                     animate={{
                       backgroundColor: agreedToTerms ? "#F97316" : "#FFFFFF",
                       borderColor: agreedToTerms ? "#F97316" : "#D1D5DB",
                     }}
                   >
                     {agreedToTerms && <Check className="w-3 h-3 text-white" />}
                   </motion.button>
                     <label className="ml-3 text-sm text-gray-700 leading-relaxed">
                       I agree to the <a href="#" className="text-orange-500 hover:text-orange-600 cursor-pointer">Terms & Conditions</a>
                   </label>
                 </div>
               </div>
             </div>
               
               <div className="p-4 sm:p-6 border-t border-gray-100 bg-white">
               <motion.button
                 whileHover={{ scale: 1.02, backgroundColor: "#F97316" }}
                 whileTap={{ scale: 0.98 }}
                   className="w-full bg-orange-500 text-white font-medium py-3 px-4 rounded-xl transition-colors shadow-md flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer text-base"
                 onClick={handleCheckout}
                 disabled={!agreedToTerms || !selectedPaymentMethod}
               >
                 Complete Order
               </motion.button>
               </div>
             </div>
           </motion.div>
         </motion.div>
       )}
     </AnimatePresence>
     
     <AnimatePresence>
       {showAddProductModal && (
         <AddProductModal
           addProductForm={addProductForm}
           setAddProductForm={setAddProductForm}
           addProductImageFile={addProductImageFile}
           setAddProductImageFile={setAddProductImageFile}
           handleAddProduct={handleAddProduct}
           setShowAddProductModal={setShowAddProductModal}
         />
       )}
     </AnimatePresence>
     
     <AnimatePresence>{toast && <Toast message={toast} onClose={() => setToast(null)} />}</AnimatePresence>
   </div>
 );
};

export default App;
// Zod Schema
export const Schema = {
   "commentary": "",
   "template": "nextjs-developer",
   "title": "Grocery E-commerce Website",
   "description": "A simple e-commerce website for selling fresh fruit, vegetables, fresh food, and other grocery items.",
   "additional_dependencies": [
       "lucide-react",
       "framer-motion"
   ],
   "has_additional_dependencies": true,
   "install_dependencies_command": "npm install lucide-react framer-motion",
   "port": 3000,
   "file_path": "app/page.tsx",
   "code": "<see code above>"
}


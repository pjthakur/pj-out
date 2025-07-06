"use client"
import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import {
  FiHome,
  FiShoppingCart,
  FiFilter,
  FiDownload,
  FiPackage,
  FiTruck,
  FiDollarSign,
  FiPlus,
  FiMinus,
  FiSearch,
  FiChevronDown,
  FiChevronRight,
  FiChevronLeft,
  FiMail,
  FiPhone,
  FiMapPin,
  FiMenu,
  FiX,
} from 'react-icons/fi';
import { FaStoreAlt, FaTrash } from "react-icons/fa";
const loadFonts = () => {
  if (typeof document !== 'undefined') {
    if (!document.getElementById('poppins-font') && !document.getElementById('opensans-font')) {
      const poppinsLink = document.createElement('link');
      poppinsLink.id = 'poppins-font';
      poppinsLink.rel = 'stylesheet';
      poppinsLink.href =
        'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap';
      poppinsLink.crossOrigin = 'anonymous';
      document.head.appendChild(poppinsLink);
      const openSansLink = document.createElement('link');
      openSansLink.id = 'opensans-font';
      openSansLink.rel = 'stylesheet';
      openSansLink.href =
        'https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;500;600;700;800&display=swap';
      openSansLink.crossOrigin = 'anonymous';
      document.head.appendChild(openSansLink);
    }
  }
};
loadFonts();
interface Product {
  id: string;
  name: string;
  category: string;
  subcategory: string;
  unit: string;
  basePrice: number;
  minOrderQty: number;
  maxOrderQty: number;
  palletSize: number;
  weight: number;
  tiers: PricingTier[];
}
interface PricingTier {
  minQty: number;
  maxQty: number;
  price: number;
  discount: number;
}
interface OrderItem {
  productId: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}
interface CategoryNode {
  name: string;
  subcategories: string[];
  expanded: boolean;
}
const useInventoryManagement = (products: Product[]) => {
  const [orderItems, setOrderItems] = useState<Map<string, OrderItem>>(new Map());
  const updateOrderItem = useCallback(
    (productId: string, quantity: number) => {
      const product = products.find((p) => p.id === productId);
      if (!product) return;
      const validatedQuantity = Math.max(0, Math.min(product.maxOrderQty, quantity));
      setOrderItems((prevItems) => {
        const newOrderItems = new Map(prevItems);
        if (validatedQuantity <= 0) {
          newOrderItems.delete(productId);
        } else {
          const tier = product.tiers.find(
            (t) => validatedQuantity >= t.minQty && validatedQuantity <= t.maxQty,
          );
          const unitPrice = tier ? tier.price : product.basePrice;
          newOrderItems.set(productId, {
            productId,
            quantity: validatedQuantity,
            unitPrice,
            totalPrice: unitPrice * validatedQuantity,
          });
        }
        return newOrderItems;
      });
    },
    [products],
  );
  const getProductPrice = useCallback((product: Product, quantity: number): number => {
    if (quantity < product.minOrderQty) return product.basePrice;
    const tier = product.tiers.find((t) => quantity >= t.minQty && quantity <= t.maxQty);
    return tier ? tier.price : product.basePrice;
  }, []);
  const orderSummary = useMemo(() => {
    const items = Array.from(orderItems.values());
    const totalValue = items.reduce((sum, item) => sum + item.totalPrice, 0);
    const totalWeight = items.reduce((sum, item) => {
      const product = products.find((p) => p.id === item.productId);
      return sum + (product ? product.weight * item.quantity : 0);
    }, 0);
    let totalPallets = 0;
    items.forEach((item) => {
      const product = products.find((p) => p.id === item.productId);
      if (product) {
        totalPallets += Math.ceil(item.quantity / product.palletSize);
      }
    });
    return { totalValue, totalWeight, totalPallets, itemCount: items.length };
  }, [orderItems, products]);
  return {
    orderItems,
    updateOrderItem,
    getProductPrice,
    orderSummary,
  };
};
const useDataTransition = <T,>(data: T, isTransitioning: boolean, timeout: number = 300): T => {
  const [timeExpired, setTimeExpired] = useState(false);
  const cache = useRef(data);
  useEffect(() => {
    if (!isTransitioning) cache.current = data;
  }, [isTransitioning, data]);
  useEffect(() => {
    let id: NodeJS.Timeout;
    if (isTransitioning) {
      id = setTimeout(() => setTimeExpired(true), timeout);
    } else {
      setTimeExpired(false);
    }
    return () => clearTimeout(id);
  }, [isTransitioning, timeout]);
  if (isTransitioning && !timeExpired) return cache.current;
  else return data;
};
const useProductFilters = (products: Product[]) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const filteredProducts = useMemo(() => {
    let filtered = products;
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(searchLower) ||
          p.category.toLowerCase().includes(searchLower) ||
          p.subcategory.toLowerCase().includes(searchLower),
      );
    }
    if (selectedCategory) {
      const [category, subcategory] = selectedCategory.split('|');
      filtered = filtered.filter((p) => {
        if (subcategory) {
          return p.category === category && p.subcategory === subcategory;
        }
        return p.category === category;
      });
    }
    return filtered;
  }, [products, searchTerm, selectedCategory]);
  return {
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    filteredProducts,
  };
};
interface QuantityInputProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  className?: string;
}
const QuantityInput = React.memo<QuantityInputProps>(
  ({ value, onChange, min = 0, max = Infinity, className = '' }) => {
    const [displayValue, setDisplayValue] = useState<string>(value.toString());
    useEffect(() => {
      setDisplayValue(value.toString());
    }, [value]);
    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value;
      if (inputValue === '') {
        setDisplayValue('');
        return;
      }
      if (!/^\d+$/.test(inputValue)) {
        return;
      }
      setDisplayValue(inputValue);
    }, []);
    const handleBlur = useCallback(() => {
      const numValue = displayValue === '' ? 0 : parseInt(displayValue, 10);
      const clampedValue = Math.max(min, Math.min(max, numValue));
      setDisplayValue(clampedValue.toString());
      onChange(clampedValue);
    }, [displayValue, min, max, onChange]);
    const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        e.currentTarget.blur();
      }
    }, []);
    return (
      <input
        type="text"
        inputMode="numeric"
        value={displayValue}
        onChange={handleInputChange}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className={`text-center border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${className}`}
        min={min}
        max={max}
      />
    );
  },
);
interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}
const SearchInput = React.memo<SearchInputProps>(
  ({ value, onChange, placeholder = 'Search...', className = '' }) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.value);
      },
      [onChange],
    );
    return (
      <div className={`relative ${className}`}>
        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 sm:h-5 sm:w-5 z-10 pointer-events-none" />
        <input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 focus:shadow-lg text-sm sm:text-base"
          value={value}
          onChange={handleChange}
          maxLength={100}
          autoComplete="off"
          spellCheck={false}
        />
      </div>
    );
  },
);
const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toLocaleString();
};
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};
const sampleProducts: Product[] = [
  {
    id: 'p001',
    name: 'Premium Steel Bolts M8x40',
    category: 'Hardware',
    subcategory: 'Fasteners',
    unit: 'pcs',
    basePrice: 0.45,
    minOrderQty: 100,
    maxOrderQty: 50000,
    palletSize: 5000,
    weight: 0.025,
    tiers: [
      { minQty: 100, maxQty: 999, price: 0.45, discount: 0 },
      { minQty: 1000, maxQty: 4999, price: 0.38, discount: 15 },
      { minQty: 5000, maxQty: 9999, price: 0.32, discount: 29 },
      { minQty: 10000, maxQty: 50000, price: 0.28, discount: 38 },
    ],
  },
  {
    id: 'p002',
    name: 'Industrial Grade Washers',
    category: 'Hardware',
    subcategory: 'Fasteners',
    unit: 'pcs',
    basePrice: 0.15,
    minOrderQty: 500,
    maxOrderQty: 100000,
    palletSize: 10000,
    weight: 0.008,
    tiers: [
      { minQty: 500, maxQty: 1999, price: 0.15, discount: 0 },
      { minQty: 2000, maxQty: 9999, price: 0.12, discount: 20 },
      { minQty: 10000, maxQty: 19999, price: 0.09, discount: 40 },
      { minQty: 20000, maxQty: 100000, price: 0.07, discount: 53 },
    ],
  },
  {
    id: 'p003',
    name: 'Heavy Duty Steel Cables 6mm',
    category: 'Hardware',
    subcategory: 'Cables',
    unit: 'meters',
    basePrice: 2.8,
    minOrderQty: 50,
    maxOrderQty: 10000,
    palletSize: 1000,
    weight: 0.18,
    tiers: [
      { minQty: 50, maxQty: 199, price: 2.8, discount: 0 },
      { minQty: 200, maxQty: 999, price: 2.45, discount: 12 },
      { minQty: 1000, maxQty: 2999, price: 2.1, discount: 25 },
      { minQty: 3000, maxQty: 10000, price: 1.85, discount: 34 },
    ],
  },
  {
    id: 'p004',
    name: 'Electrical Copper Wire 12AWG',
    category: 'Electrical',
    subcategory: 'Wiring',
    unit: 'feet',
    basePrice: 0.85,
    minOrderQty: 100,
    maxOrderQty: 25000,
    palletSize: 2500,
    weight: 0.032,
    tiers: [
      { minQty: 100, maxQty: 499, price: 0.85, discount: 0 },
      { minQty: 500, maxQty: 1999, price: 0.72, discount: 15 },
      { minQty: 2000, maxQty: 4999, price: 0.63, discount: 26 },
      { minQty: 5000, maxQty: 25000, price: 0.55, discount: 35 },
    ],
  },
  {
    id: 'p005',
    name: 'LED Strip Lights 5050 SMD',
    category: 'Electrical',
    subcategory: 'Lighting',
    unit: 'meters',
    basePrice: 12.5,
    minOrderQty: 10,
    maxOrderQty: 5000,
    palletSize: 500,
    weight: 0.15,
    tiers: [
      { minQty: 10, maxQty: 49, price: 12.5, discount: 0 },
      { minQty: 50, maxQty: 199, price: 10.25, discount: 18 },
      { minQty: 200, maxQty: 499, price: 8.75, discount: 30 },
      { minQty: 500, maxQty: 5000, price: 7.5, discount: 40 },
    ],
  },
  {
    id: 'p006',
    name: 'PVC Pipe Schedule 40 2"',
    category: 'Plumbing',
    subcategory: 'Pipes',
    unit: 'feet',
    basePrice: 3.25,
    minOrderQty: 20,
    maxOrderQty: 5000,
    palletSize: 200,
    weight: 0.95,
    tiers: [
      { minQty: 20, maxQty: 99, price: 3.25, discount: 0 },
      { minQty: 100, maxQty: 299, price: 2.85, discount: 12 },
      { minQty: 300, maxQty: 999, price: 2.45, discount: 25 },
      { minQty: 1000, maxQty: 5000, price: 2.15, discount: 34 },
    ],
  },
];
const ProductRow = React.memo<{
  product: Product;
  quantity: number;
  index: number;
  updateOrderItem: (productId: string, quantity: number) => void;
  getProductPrice: (product: Product, quantity: number) => number;
  shouldAnimate: boolean;
}>(({ product, quantity, index, updateOrderItem: updateFn, getProductPrice, shouldAnimate }) => {
  const currentPrice = getProductPrice(product, quantity);
  return (
    <tr
      className={`hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-purple-50/50 transition-all duration-300 ${
        shouldAnimate ? 'animate-fade-in-up' : ''
      }`}
      style={shouldAnimate ? { animationDelay: `${index * 50}ms` } : {}}
    >
      <td className="p-4 align-middle">
        <div className="flex flex-col justify-center h-full">
          <span className="font-medium text-gray-900 text-base break-words">{product.name}</span>
          <span className="text-sm text-gray-800 mt-1">{product.category} • {product.subcategory} • Min: {formatNumber(product.minOrderQty)} {product.unit}</span>
        </div>
      </td>
      <td className="p-4 align-middle">
        <div className="flex flex-col items-start justify-center h-full">
          <span className="font-medium text-gray-900 font-ui">{formatCurrency(currentPrice)}</span>
          <span className="text-sm text-gray-800 mt-1">per {product.unit}</span>
        </div>
      </td>
      <td className="p-4 align-middle">
        <div className="flex flex-col items-center justify-center h-full gap-y-1">
          <div className="flex items-center gap-2">
            <button
              onClick={() => updateFn(product.id, quantity === 0 ? product.minOrderQty : Math.max(0, quantity - 1))}
              className="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-red-100 hover:text-red-600 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transform hover:scale-110 cursor-pointer"
            >
              <FiMinus />
            </button>
            <QuantityInput
              value={quantity}
              onChange={(value) => updateFn(product.id, value)}
              min={0}
              max={product.maxOrderQty}
              className="w-20 px-2 py-1.5 text-sm"
            />
            <button
              onClick={() => updateFn(product.id, quantity === 0 ? product.minOrderQty : Math.min(product.maxOrderQty, quantity + 1))}
              className="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-green-100 hover:text-green-600 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transform hover:scale-110 cursor-pointer"
            >
              <FiPlus />
            </button>
          </div>
                      <span className="text-xs text-gray-800">Max: {formatNumber(product.maxOrderQty)}</span>
        </div>
      </td>
      <td className="p-4 align-middle">
        <div className="flex flex-col justify-center h-full gap-y-1">
          {product.tiers.map((tier, idx) => (
            <span
              key={idx}
              className={`text-xs px-2 py-1 rounded-md transition-all duration-200 font-ui ${
                quantity >= tier.minQty && quantity <= tier.maxQty
                  ? 'bg-gradient-to-r from-green-100 to-green-200 text-green-800 font-medium transform scale-105'
                  : 'text-gray-800 bg-gray-50'
              }`}
            >
              {formatNumber(tier.minQty)}+ units: {formatCurrency(tier.price)} ({tier.discount}% off)
            </span>
          ))}
        </div>
      </td>
      <td className="p-4 text-right align-middle">
        <div className="flex flex-col items-end justify-center h-full gap-y-1">
          <span className="font-semibold text-gray-900 font-ui">{formatCurrency(currentPrice * quantity)}</span>
          {quantity > 0 && (
            <span className="text-sm text-gray-800 font-ui">{Math.ceil(quantity / product.palletSize)} pallets</span>
          )}
        </div>
      </td>
    </tr>
  );
});
const ProductCard = React.memo<{
  product: Product;
  quantity: number;
  index: number;
  updateOrderItem: (productId: string, quantity: number) => void;
  getProductPrice: (product: Product, quantity: number) => number;
  shouldAnimate: boolean;
}>(({ product, quantity, index, updateOrderItem: updateFn, getProductPrice, shouldAnimate }) => {
  const currentPrice = getProductPrice(product, quantity);
  return (
    <div
      className={`bg-white rounded-xl shadow-sm border-2 border-gray-100 hover:border-blue-300 p-4 hover:shadow-md transition-all duration-300 ${
        shouldAnimate ? 'animate-fade-in-up' : ''
      }`}
      style={shouldAnimate ? { animationDelay: `${index * 100}ms` } : {}}
    >
      <div className="space-y-4">
        <div>
          <h3 className="font-medium text-gray-900 text-sm sm:text-base break-words">
            {product.name}
          </h3>
          <p className="text-xs sm:text-sm text-gray-800 mt-1">
            {product.category} • {product.subcategory}
          </p>
          <p className="text-xs text-gray-800">
            Min: {formatNumber(product.minOrderQty)} • Max: {formatNumber(product.maxOrderQty)}{' '}
            {product.unit}
          </p>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <div className="font-medium text-gray-900 text-sm sm:text-base font-ui">
              {formatCurrency(currentPrice)}
            </div>
            <div className="text-xs text-gray-800">per {product.unit}</div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => updateFn(product.id, quantity === 0 ? product.minOrderQty : Math.max(0, quantity - 1))}
              className="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-red-100 hover:text-red-600 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transform hover:scale-110 cursor-pointer"
            >
              <FiMinus className="text-sm" />
            </button>
            <QuantityInput
              value={quantity}
              onChange={(value) => updateFn(product.id, value)}
              min={0}
              max={product.maxOrderQty}
              className="w-16 px-2 py-1 text-sm"
            />
            <button
              onClick={() => updateFn(product.id, quantity === 0 ? product.minOrderQty : Math.min(product.maxOrderQty, quantity + 1))}
              className="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-green-100 hover:text-green-600 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transform hover:scale-110 cursor-pointer"
            >
              <FiPlus className="text-sm" />
            </button>
          </div>
        </div>
        <div className="space-y-1">
          <h4 className="text-xs font-medium text-gray-800">Pricing Tiers:</h4>
          <div className="flex flex-wrap gap-1">
            {product.tiers.map((tier, idx) => (
              <div
                key={idx}
                className={`text-xs px-2 py-1 rounded-md transition-all duration-200 ${
                  quantity >= tier.minQty && quantity <= tier.maxQty
                    ? 'bg-gradient-to-r from-green-100 to-green-200 text-green-800 font-medium'
                    : 'text-gray-800 bg-gray-50'
                }`}
              >
                {formatNumber(tier.minQty)}+: {formatCurrency(tier.price)}
              </div>
            ))}
          </div>
        </div>
        {quantity > 0 && (
          <div className="border-t pt-3 flex justify-between items-center">
            <span className="text-sm text-gray-600">Total:</span>
                          <div className="text-right">
                <div className="font-semibold text-gray-900 font-ui">
                  {formatCurrency(currentPrice * quantity)}
                </div>
                <div className="text-xs text-gray-800 font-ui">
                  {Math.ceil(quantity / product.palletSize)} pallets
                </div>
              </div>
          </div>
        )}
      </div>
    </div>
  );
});
const HomePage = ({ onStartOrdering }: { onStartOrdering: () => void }) => (
  <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 overflow-hidden">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 pb-24 sm:pb-32">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-black mb-4 sm:mb-6 leading-tight font-display animate-fade-in-up">
          Streamline Your
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 animate-gradient">
            {' '}
            B2B Orders
          </span>
        </h1>
        <p className="text-base sm:text-lg lg:text-xl text-gray-700 mb-6 sm:mb-8 leading-relaxed max-w-2xl mx-auto animate-fade-in-up animation-delay-200">
          Professional bulk ordering platform designed for B2B suppliers. Manage inventory,
          calculate pricing tiers, and optimize your supply chain with ease.
        </p>
        <button
          onClick={onStartOrdering}
          className="bg-gradient-to-r from-blue-600 cursor-pointer to-purple-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold text-base sm:text-lg hover:shadow-2xl hover:shadow-blue-500/25 transform hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-3 mx-auto animate-fade-in-up animation-delay-400 group"
        >
          <FaStoreAlt className="group-hover:rotate-12 transition-transform duration-300" />
          Start Bulk Ordering
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mt-12 sm:mt-16 lg:mt-20 max-w-6xl mx-auto">
        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-500 border border-gray-100 group animate-fade-in-up animation-delay-600 transform hover:-translate-y-2">
          <div className="w-12 h-12 sm:w-14 sm:h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-4 sm:mb-6 group-hover:bg-blue-200 transition-colors duration-300">
            <FiPackage className="text-blue-600 text-xl sm:text-2xl group-hover:scale-110 transition-transform duration-300" />
          </div>
          <h3 className="text-lg sm:text-xl font-semibold text-black mb-3 sm:mb-4">
            Smart Inventory
          </h3>
          <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
            Organized product catalog with category filtering and intelligent search capabilities.
          </p>
        </div>
        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm hover:shadow-xl hover:shadow-green-500/10 transition-all duration-500 border border-gray-100 group animate-fade-in-up animation-delay-800 transform hover:-translate-y-2">
          <div className="w-12 h-12 sm:w-14 sm:h-14 bg-green-100 rounded-xl flex items-center justify-center mb-4 sm:mb-6 group-hover:bg-green-200 transition-colors duration-300">
            <FiDollarSign className="text-green-600 text-xl sm:text-2xl group-hover:scale-110 transition-transform duration-300" />
          </div>
          <h3 className="text-lg sm:text-xl font-semibold text-black mb-3 sm:mb-4">
            Bulk Pricing
          </h3>
          <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
            Dynamic pricing tiers with real-time calculations and discount optimization.
          </p>
        </div>
        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-500 border border-gray-100 group animate-fade-in-up animation-delay-1000 transform hover:-translate-y-2 sm:col-span-2 lg:col-span-1">
          <div className="w-12 h-12 sm:w-14 sm:h-14 bg-purple-100 rounded-xl flex items-center justify-center mb-4 sm:mb-6 group-hover:bg-purple-200 transition-colors duration-300">
            <FiTruck className="text-purple-600 text-xl sm:text-2xl group-hover:scale-110 transition-transform duration-300" />
          </div>
          <h3 className="text-lg sm:text-xl font-semibold text-black mb-3 sm:mb-4">
            Pallet Calculator
          </h3>
          <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
            Automatic pallet calculations and shipping optimization for efficient logistics.
          </p>
        </div>
      </div>
    </div>
    <footer className="bg-gray-900 text-white py-12 sm:py-16 lg:py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 to-purple-900/20"></div>
      <div className="container px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-start">
          <div className="animate-fade-in-up animation-delay-1200">
            <h3 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">
              About B2B Trade Hub
            </h3>
            <p className="text-gray-400 leading-relaxed text-sm sm:text-base">
              We provide comprehensive B2B trading solutions designed to streamline your supply
              chain operations and maximize efficiency across all your business processes.
            </p>
          </div>
          <div className="space-y-4 sm:space-y-6 animate-fade-in-up animation-delay-1400 lg:justify-self-end">
            <h4 className="text-lg sm:text-xl font-semibold mb-4">Contact Information</h4>
            <div className="flex items-center gap-3 sm:gap-4 text-gray-400 hover:text-white transition-colors duration-300 group">
              <FiMail className="text-blue-400 flex-shrink-0 text-lg sm:text-xl group-hover:scale-110 transition-transform duration-300" />
              <span className="text-sm sm:text-base">contact@b2btradehub.com</span>
            </div>
            <div className="flex items-center gap-3 sm:gap-4 text-gray-400 hover:text-white transition-colors duration-300 group">
              <FiPhone className="text-blue-400 flex-shrink-0 text-lg sm:text-xl group-hover:scale-110 transition-transform duration-300" />
              <span className="text-sm sm:text-base">+1 (555) 123-4567</span>
            </div>
            <div className="flex items-center gap-3 sm:gap-4 text-gray-400 hover:text-white transition-colors duration-300 group">
              <FiMapPin className="text-blue-400 flex-shrink-0 text-lg sm:text-xl group-hover:scale-110 transition-transform duration-300" />
              <span className="text-sm sm:text-base">
                123 Business District, Commerce City, NY 10001
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  </div>
);
const Sidebar = ({
  sidebarOpen,
  setSidebarOpen,
  sidebarCollapsed,
  setSidebarCollapsed,
  searchTerm,
  setSearchTerm,
  categories,
  initialAnimationComplete,
  toggleCategory,
  selectedCategory,
  setSelectedCategory,
}: {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  categories: Map<string, CategoryNode>;
  initialAnimationComplete: boolean;
  toggleCategory: (name: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
}) => (
  <>
    {sidebarOpen && (
      <div
        className="fixed inset-0 bg-black/20 backdrop-blur-md z-40 lg:hidden animate-fade-in"
        onClick={() => setSidebarOpen(false)}
      />
    )}
    <div
      className={`
      fixed lg:static inset-y-0 left-0 z-50 lg:z-0
      ${sidebarCollapsed ? 'w-16' : 'w-72 sm:w-80'} bg-white border-r border-gray-100 flex flex-col shadow-xl lg:shadow-none
      transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0
      transition-all duration-300 ease-in-out
    `}
    >
      <div className="px-4 py-1">
        <div className="flex items-center justify-between h-12">
          {!sidebarCollapsed && (
            <SearchInput
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Search products..."
              className="flex-1 mr-3"
            />
          )}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                            className="hidden lg:flex p-2 text-gray-600 hover:text-gray-800 rounded-lg hover:bg-gray-100 transition-all duration-200 transform hover:scale-105 cursor-pointer flex-shrink-0"
            title={sidebarCollapsed ? 'Expand filters' : 'Collapse filters'}
          >
            {sidebarCollapsed ? <FiChevronRight/> : <FiChevronLeft/>}
          </button>
        </div>
      </div>
      <div className={`flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar ${sidebarCollapsed ? 'p-0' : ''}`}>
        {!sidebarCollapsed && (
          <>
            <h3 className={`text-xs sm:text-sm font-semibold text-gray-800 uppercase tracking-wide mb-4 flex items-center gap-2 ${sidebarCollapsed ? 'hidden' : ''}`}>
              <FiFilter className="animate-pulse" />
              Categories
            </h3>
            {Array.from(categories.entries()).map(([categoryName, category], index) => (
              <div
                key={categoryName}
                className={`mb-2 ${!initialAnimationComplete ? 'animate-fade-in-up' : ''}`}
                style={!initialAnimationComplete ? { animationDelay: `${index * 100}ms` } : {}}
              >
                <button
                  onClick={() => toggleCategory(categoryName)}
                  className={`w-full flex items-center justify-between p-3 text-left hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 rounded-xl transition-all duration-300 group ${
                    category.expanded ? 'bg-blue-50/50' : ''
                  } cursor-pointer`}
                >
                  <span
                    className={`font-medium text-sm sm:text-base ${
                      category.expanded ? 'text-blue-700' : 'text-gray-900'
                    } group-hover:text-blue-700`}
                  >
                    {categoryName}
                  </span>
                  <div
                    className={`${
                      category.expanded ? 'text-blue-500' : 'text-gray-400'
                    } group-hover:text-blue-500 transition-colors duration-300`}
                  >
                    <FiChevronDown
                      className={`transition-transform duration-300 ${
                        category.expanded ? 'rotate-180' : ''
                      }`}
                    />
                  </div>
                </button>
                {category.expanded && (
                  <div className="ml-4 mt-2 space-y-1">
                    {category.subcategories.map((subcategory, subIndex) => (
                      <button
                        key={subcategory}
                        onClick={() => {
                          setSelectedCategory(
                            selectedCategory === `${categoryName}|${subcategory}`
                              ? ''
                              : `${categoryName}|${subcategory}`,
                          );
                          setSidebarOpen(false);
                        }}
                                                  className={`w-full text-left p-2.5 text-xs sm:text-sm rounded-lg transition-all duration-300 transform hover:scale-105 ${
                            selectedCategory === `${categoryName}|${subcategory}`
                              ? 'bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 shadow-sm'
                              : 'text-gray-800 hover:bg-gray-50 hover:text-gray-900'
                          } cursor-pointer`}
                      >
                        {subcategory}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {(selectedCategory || searchTerm) && (
              <button
                onClick={() => {
                  setSelectedCategory('');
                  setSearchTerm('');
                  setSidebarOpen(false);
                }}
                className="w-full mt-4 p-2 text-sm text-gray-700 hover:text-gray-900 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Clear Filter
              </button>
            )}
          </>
        )}
        {sidebarCollapsed && (
          <div className="flex flex-col items-center space-y-1">
            <button
              onClick={() => setSidebarCollapsed(false)}
                              className="p-2.5 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-all duration-200 cursor-pointer"
              title="Expand to search"
            >
              <FiSearch />
            </button>
            <div className="w-6 h-px bg-gray-100"></div>
            {Array.from(categories.entries()).map(([categoryName, category], index) => (
              <button
                key={categoryName}
                onClick={() => setSidebarCollapsed(false)}
                className="p-2.5 rounded-lg transition-all duration-200 transform hover:scale-110 text-gray-600 hover:text-gray-800 hover:bg-gray-100 cursor-pointer"
                title={`Expand to filter by ${categoryName}`}
              >
                <FiFilter />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  </>
);
const BulkOrderInterface = ({
  sidebarOpen,
  setSidebarOpen,
  sidebarCollapsed,
  setSidebarCollapsed,
  searchTerm,
  setSearchTerm,
  categories,
  initialAnimationComplete,
  toggleCategory,
  selectedCategory,
  setSelectedCategory,
  tableContainerRef,
  mobileContainerRef,
  filteredProducts,
  orderItems,
  updateOrderItemWithScrollPreservation,
  getProductPrice,
  orderSummary,
  exportToCSV,
  showMobileSummary,
  setShowMobileSummary,
  products,
}: {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  categories: Map<string, CategoryNode>;
  initialAnimationComplete: boolean;
  toggleCategory: (name: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  tableContainerRef: React.ForwardedRef<HTMLDivElement>;
  mobileContainerRef: React.ForwardedRef<HTMLDivElement>;
  filteredProducts: Product[];
  orderItems: Map<string, OrderItem>;
  updateOrderItemWithScrollPreservation: (productId: string, quantity: number) => void;
  getProductPrice: (product: Product, quantity: number) => number;
  orderSummary: { totalValue: number; totalWeight: number; totalPallets: number; itemCount: number; };
  exportToCSV: () => void;
  showMobileSummary: boolean;
  setShowMobileSummary: (show: boolean) => void;
  products: Product[];
}) => (
  <div className="h-[calc(100vh_-_73px)] flex flex-col bg-gray-50">
    <div className="flex-1 flex overflow-hidden border-l border-t border-gray-100">
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        sidebarCollapsed={sidebarCollapsed}
        setSidebarCollapsed={setSidebarCollapsed}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        categories={categories}
        initialAnimationComplete={initialAnimationComplete}
        toggleCategory={toggleCategory}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <div ref={tableContainerRef} className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="hidden lg:block min-w-full">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-blue-50 sticky top-0 shadow-sm z-10">
                <tr>
                  <th className="text-left p-4 font-semibold text-black min-w-[250px]">
                    Product
                  </th>
                  <th className="text-left p-4 font-semibold text-black min-w-[120px]">
                    Unit Price
                  </th>
                  <th className="text-center p-4 font-semibold text-black min-w-[160px]">
                    Quantity
                  </th>
                  <th className="text-center p-4 font-semibold text-black min-w-[220px]">
                    Pricing Tiers
                  </th>
                  <th className="text-right p-4 font-semibold text-black min-w-[120px]">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredProducts.map((product, index) => {
                  const orderItem = orderItems.get(product.id);
                  const quantity = orderItem?.quantity || 0;
                  return (
                    <ProductRow
                      key={product.id}
                      product={product}
                      quantity={quantity}
                      index={index}
                      updateOrderItem={updateOrderItemWithScrollPreservation}
                      getProductPrice={getProductPrice}
                      shouldAnimate={!initialAnimationComplete}
                    />
                  );
                })}
              </tbody>
            </table>
          </div>
          <div ref={mobileContainerRef} className="lg:hidden p-4 space-y-4">
            {filteredProducts.map((product, index) => {
              const orderItem = orderItems.get(product.id);
              const quantity = orderItem?.quantity || 0;
              return (
                <ProductCard
                  key={product.id}
                  product={product}
                  quantity={quantity}
                  index={index}
                  updateOrderItem={updateOrderItemWithScrollPreservation}
                  getProductPrice={getProductPrice}
                  shouldAnimate={!initialAnimationComplete}
                />
              );
            })}
          </div>
        </div>
      </div>
      <div className="hidden lg:flex w-80 bg-gradient-to-b from-white to-blue-50/30 border-l border-gray-100 flex-col shadow-lg">
        <div className="p-4 border-b border-gray-100 bg-white/80 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-4">
            <FiShoppingCart className="text-blue-500 text-xl" />
            <h3 className="text-lg font-semibold text-black">Order Summary</h3>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-2 bg-blue-50/50 rounded-lg transition-all duration-300 hover:bg-blue-100/50">
              <div className="flex items-center gap-2">
                <FiPackage className="text-blue-500" />
                <span className="text-gray-700 font-medium">Items</span>
              </div>
              <span className="font-semibold text-black text-lg animate-pulse font-ui">
                {orderSummary.itemCount}
              </span>
            </div>
            <div className="flex justify-between items-center p-2 bg-green-50/50 rounded-lg transition-all duration-300 hover:bg-green-100/50">
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 bg-green-500 rounded-full"></span>
                <span className="text-gray-700 font-medium">Total Weight</span>
              </div>
              <span className="font-semibold text-black font-ui">
                {orderSummary.totalWeight.toFixed(2)} kg
              </span>
            </div>
            <div className="flex justify-between items-center p-2 bg-purple-50/50 rounded-lg transition-all duration-300 hover:bg-purple-100/50">
              <div className="flex items-center gap-2">
                <FiTruck className="text-purple-500" />
                <span className="text-gray-700 font-medium">Pallets Required</span>
              </div>
              <span className="font-semibold text-black font-ui">
                {orderSummary.totalPallets}
              </span>
            </div>
            <div className="border-t pt-2 border-gray-200">
              <div className="flex justify-between items-center p-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl shadow-sm">
                <div className="flex items-center gap-2">
                  <FiDollarSign className="text-green-600 text-xl" />
                  <span className="font-semibold text-black">Total Value</span>
                </div>
                <span className="font-bold text-black text-xl animate-pulse font-ui">
                  {formatCurrency(orderSummary.totalValue)}
                </span>
              </div>
            </div>
            <div className="pt-2">
              <button
                onClick={exportToCSV}
                disabled={orderSummary.itemCount === 0}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-2 rounded-xl hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 text-sm font-medium shadow-md hover:shadow-lg transform hover:scale-105 disabled:hover:scale-100 cursor-pointer"
              >
                <FiDownload />
                Export CSV
              </button>
            </div>
          </div>
        </div>
        {orderSummary.itemCount > 0 && (
          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
            <div className="flex items-center gap-2 mb-4">
              <FiPackage className="text-blue-500 text-xl" />
              <h4 className="font-semibold text-lg text-black">Order Details</h4>
            </div>
            <div className="space-y-3">
              {Array.from(orderItems.values()).map((item, index) => {
                const product = products.find((p) => p.id === item.productId);
                return (
                  <div
                    key={item.productId}
                    className={`p-4 bg-gradient-to-r from-white to-blue-50/50 rounded-xl border-2 border-gray-100 hover:border-blue-300 hover:shadow-md transition-all duration-300 transform hover:scale-105 ${
                      !initialAnimationComplete ? 'animate-fade-in-up' : ''
                    }`}
                    style={
                      !initialAnimationComplete ? { animationDelay: `${index * 100}ms` } : {}
                    }
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-medium text-base text-black break-words flex-1 mr-2">
                        {product?.name}
                      </div>
                      <button
                        onClick={() => updateOrderItemWithScrollPreservation(item.productId, 0)}
                        className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 transform hover:scale-110 cursor-pointer flex-shrink-0"
                        title="Remove item"
                      >
                        <FaTrash className="w-3 h-3" />
                      </button>
                    </div>
                    <div className="text-sm text-gray-700 space-y-1">
                      <div className="flex items-center justify-between">
                        <span>
                          {formatNumber(item.quantity)} {product?.unit}
                        </span>
                        <span className="text-gray-600">×</span>
                        <div>
                        <span>{formatCurrency(item.unitPrice)}</span>
                        </div>
                      </div>
                      <div className="border-t pt-2 border-gray-200">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-700">Total:</span>
                          <span className="font-semibold text-black">
                            {formatCurrency(item.totalPrice)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
    {showMobileSummary && (
      <>
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-md z-50 lg:hidden animate-fade-in"
          onClick={() => setShowMobileSummary(false)}
        />
        <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl rounded-t-2xl z-50 lg:hidden animate-slide-up border-t-2 border-gray-100 shadow-2xl">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <FiShoppingCart className="text-blue-500 text-xl" />
                <h3 className="text-lg font-semibold text-black">Order Summary</h3>
              </div>
              <button
                onClick={() => setShowMobileSummary(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200 cursor-pointer"
              >
                <FiX />
              </button>
            </div>
            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-center p-3 bg-blue-50/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <FiPackage className="text-blue-500" />
                  <span className="text-gray-700 font-medium">Items</span>
                </div>
                <span className="font-semibold text-black font-ui">
                  {orderSummary.itemCount}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-green-50/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 bg-green-500 rounded-full"></span>
                  <span className="text-gray-700 font-medium">Total Weight</span>
                </div>
                <span className="font-semibold text-black font-ui">
                  {orderSummary.totalWeight.toFixed(2)} kg
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-purple-50/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <FiTruck className="text-purple-500" />
                  <span className="text-gray-700 font-medium">Pallets Required</span>
                </div>
                <span className="font-semibold text-black font-ui">
                  {orderSummary.totalPallets}
                </span>
              </div>
              <div className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl shadow-sm">
                <div className="flex items-center gap-2">
                  <FiDollarSign className="text-green-600 text-xl" />
                  <span className="font-semibold text-black">Total Value</span>
                </div>
                <span className="font-bold text-black text-xl font-ui">
                  {formatCurrency(orderSummary.totalValue)}
                </span>
              </div>
            </div>
            {orderSummary.itemCount > 0 && (
              <div className="max-h-48 overflow-y-auto custom-scrollbar">
                <div className="flex items-center gap-2 mb-3">
                  <FiPackage className="text-gray-700" />
                  <h4 className="font-semibold text-gray-900 text-sm">Order Items</h4>
                </div>
                <div className="space-y-2">
                  {Array.from(orderItems.values()).map((item) => {
                    const product = products.find((p) => p.id === item.productId);
                    return (
                      <div
                        key={item.productId}
                        className="p-3 bg-gray-50 rounded-lg border-2 border-gray-100"
                      >
                        <div className="flex items-start justify-between mb-1">
                          <div className="font-medium text-sm text-gray-900 break-words flex-1 mr-2">
                            {product?.name}
                          </div>
                          <button
                            onClick={() => updateOrderItemWithScrollPreservation(item.productId, 0)}
                            className="p-0.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-all duration-200 cursor-pointer flex-shrink-0"
                            title="Remove item"
                          >
                            <FiX className="w-3 h-3" />
                          </button>
                        </div>
                        <div className="text-xs text-gray-600 flex justify-between">
                          <span>
                            {formatNumber(item.quantity)} {product?.unit} ×{' '}
                            {formatCurrency(item.unitPrice)}
                          </span>
                          <span className="font-semibold text-gray-900">
                            {formatCurrency(item.totalPrice)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </>
    )}
  </div>
);
const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<'home' | 'orders'>('home');
  const [products] = useState<Product[]>(sampleProducts);
  const [categories, setCategories] = useState<Map<string, CategoryNode>>(new Map());
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [pageTransition, setPageTransition] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showMobileSummary, setShowMobileSummary] = useState(false);
  const [initialAnimationComplete, setInitialAnimationComplete] = useState(false);
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const mobileContainerRef = useRef<HTMLDivElement>(null);
  const scrollPositionRef = useRef({ top: 0, left: 0 });
  const { orderItems, updateOrderItem, getProductPrice, orderSummary } =
    useInventoryManagement(products);
  const {
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    filteredProducts,
  } = useProductFilters(products);
  useEffect(() => {
    const categoryMap = new Map<string, CategoryNode>();
    products.forEach((product) => {
      if (!categoryMap.has(product.category)) {
        categoryMap.set(product.category, {
          name: product.category,
          subcategories: [],
          expanded: false,
        });
      }
      const category = categoryMap.get(product.category)!;
      if (!category.subcategories.includes(product.subcategory)) {
        category.subcategories.push(product.subcategory);
      }
    });
    setCategories(categoryMap);
  }, [products]);
  useEffect(() => {
    if (currentPage === 'orders' && !initialAnimationComplete) {
      const timer = setTimeout(() => {
        setInitialAnimationComplete(true);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (currentPage === 'home') {
      setInitialAnimationComplete(false);
    }
  }, [currentPage, initialAnimationComplete]);
  useEffect(() => {
    const container = tableContainerRef.current || mobileContainerRef.current;
    if (!container) return;
    const handleScroll = () => {
      scrollPositionRef.current = {
        top: container.scrollTop,
        left: container.scrollLeft,
      };
    };
    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, [currentPage]);
  const saveScrollPosition = useCallback(() => {
    const container = tableContainerRef.current || mobileContainerRef.current;
    if (container) {
      scrollPositionRef.current = {
        top: container.scrollTop,
        left: container.scrollLeft,
      };
    }
  }, []);
  const restoreScrollPosition = useCallback(() => {
    const container = tableContainerRef.current || mobileContainerRef.current;
    if (container && scrollPositionRef.current) {
      container.scrollTo({
        top: scrollPositionRef.current.top,
        left: scrollPositionRef.current.left,
        behavior: 'auto',
      });
      if (container.scrollTop !== scrollPositionRef.current.top) {
        container.scrollTop = scrollPositionRef.current.top;
        container.scrollLeft = scrollPositionRef.current.left;
      }
    }
  }, []);
  const updateOrderItemWithScrollPreservation = useCallback(
    (productId: string, quantity: number) => {
      saveScrollPosition();
      updateOrderItem(productId, quantity);
      requestAnimationFrame(() => {
        restoreScrollPosition();
        setTimeout(() => {
          restoreScrollPosition();
        }, 10);
      });
    },
    [updateOrderItem, saveScrollPosition, restoreScrollPosition],
  );
  const exportToCSV = useCallback(() => {
    const items = Array.from(orderItems.values());
    if (items.length === 0) return;
    const csvContent = [
      ['Product Name', 'Category', 'Quantity', 'Unit Price', 'Total Price', 'Unit'].join(','),
      ...items.map((item) => {
        const product = products.find((p) => p.id === item.productId);
        return [
          product?.name || '',
          product?.category || '',
          item.quantity,
          item.unitPrice.toFixed(2),
          item.totalPrice.toFixed(2),
          product?.unit || '',
        ].join(',');
      }),
    ].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bulk-order-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  }, [orderItems, products]);
  const toggleCategory = useCallback((categoryName: string) => {
    setCategories((prevCategories) => {
      const newCategories = new Map();
      prevCategories.forEach((category, key) => {
        if (key === categoryName) {
          newCategories.set(key, {
            ...category,
            expanded: !category.expanded,
          });
        } else {
          newCategories.set(key, { ...category });
        }
      });
      return newCategories;
    });
  }, []);
  const handlePageTransition = useCallback(
    (newPage: 'home' | 'orders') => {
      if (newPage === currentPage) return;
      setPageTransition(true);
      setTimeout(() => {
        setCurrentPage(newPage);
        setPageTransition(false);
      }, 150);
    },
    [currentPage],
  );
  return (
    <div className="min-h-screen bg-gray-50 relative">
      <nav className="bg-white/95 backdrop-blur-sm border-b border-gray-200 px-4 sm:px-4 lg:px-6 py-4 sticky top-0 z-30 shadow-sm">
        <div className="flex items-center justify-between max-w-9xl mx-auto">
          <div className="flex items-center justify-between w-full gap-4 sm:gap-6 lg:gap-8">
            <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-display">
              B2B Trade Hub
            </h1>
            <div className="flex items-center gap-1 sm:gap-2">
              <button
                onClick={() => handlePageTransition('home')}
                className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl transition-all duration-300 text-sm sm:text-base transform hover:scale-105 ${
                  currentPage === 'home'
                    ? 'bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 shadow-md'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                } cursor-pointer`}
              >
                <FiHome
                  className={`transition-transform duration-300 ${currentPage === 'home' ? 'scale-110' : ''}`}
                />
                <span className="hidden sm:inline">Home</span>
              </button>
              <button
                onClick={() => handlePageTransition('orders')}
                className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl transition-all duration-300 text-sm sm:text-base transform hover:scale-105 ${
                  currentPage === 'orders'
                    ? 'bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 shadow-md'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                } cursor-pointer`}
              >
                <FaStoreAlt
                  className={`transition-transform duration-300 ${currentPage === 'orders' ? 'scale-110' : ''}`}
                />
                <span className="hidden sm:inline">Bulk Orders</span>
              </button>
            </div>
          </div>
          {currentPage === 'orders' && (
            <div className="flex items-center gap-2 lg:hidden">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all duration-200 transform hover:scale-105 cursor-pointer"
              >
                <div className="relative h-4 pl-4 w-4">
                  <FiMenu className={`absolute inset-0 transition-all text-sm duration-300 ${sidebarOpen ? 'opacity-0 rotate-90' : 'opacity-100 rotate-0'}`} />
                  <FiX className={`absolute inset-0 text-sm transition-all duration-300 ${sidebarOpen ? 'opacity-100 rotate-0' : 'opacity-0 -rotate-90'}`} />
                </div>
              </button>
              {orderSummary.itemCount > 0 && (
                <button
                  onClick={() => setShowMobileSummary(!showMobileSummary)}
                  className="relative flex items-center gap-2 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 px-3 py-2 rounded-xl hover:from-blue-200 hover:to-purple-200 transition-all duration-300 cursor-pointer"
                >
                  <FiShoppingCart className="text-sm" />
                  <span className="text-sm font-medium">{orderSummary.itemCount}</span>
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
                </button>
              )}
            </div>
          )}
        </div>
      </nav>
      <div
        className={`transition-all duration-300 ${pageTransition ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}
      >
        {currentPage === 'home' ? <HomePage onStartOrdering={() => handlePageTransition('orders')} /> : <BulkOrderInterface
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            sidebarCollapsed={sidebarCollapsed}
            setSidebarCollapsed={setSidebarCollapsed}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            categories={categories}
            initialAnimationComplete={initialAnimationComplete}
            toggleCategory={toggleCategory}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            tableContainerRef={tableContainerRef}
            mobileContainerRef={mobileContainerRef}
            filteredProducts={filteredProducts}
            orderItems={orderItems}
            updateOrderItemWithScrollPreservation={updateOrderItemWithScrollPreservation}
            getProductPrice={getProductPrice}
            orderSummary={orderSummary}
            exportToCSV={exportToCSV}
            showMobileSummary={showMobileSummary}
            setShowMobileSummary={setShowMobileSummary}
            products={products}
          />}
      </div>
      <style jsx>{`
        * {
          font-family: 'Open Sans', sans-serif !important;
        }
        body {
          font-family: 'Open Sans', sans-serif !important;
          font-feature-settings:
            'kern' 1,
            'liga' 1,
            'calt' 1;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
        h1,
        h2,
        h3,
        h4,
        h5,
        h6 {
          font-family: 'Poppins', sans-serif !important;
          font-feature-settings:
            'kern' 1,
            'liga' 1,
            'calt' 1;
          letter-spacing: -0.02em;
        }
        .font-display {
          font-family: 'Poppins', sans-serif !important;
          font-feature-settings:
            'kern' 1,
            'liga' 1,
            'calt' 1;
        }
        .font-ui {
          font-family: 'Open Sans', sans-serif !important;
          font-feature-settings:
            'kern' 1,
            'liga' 1,
            'calt' 1,
            'tnum' 1;
        }
        .font-mono {
          font-family: 'Open Sans', sans-serif !important;
          font-feature-settings:
            'kern' 1,
            'liga' 1,
            'calt' 1;
        }
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(100%);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
          animation-fill-mode: both;
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
        .animate-slide-down {
          animation: slide-down 0.3s ease-out forwards;
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out forwards;
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
        .animation-delay-200 {
          animation-delay: 200ms;
        }
        .animation-delay-400 {
          animation-delay: 400ms;
        }
        .animation-delay-600 {
          animation-delay: 600ms;
        }
        .animation-delay-800 {
          animation-delay: 800ms;
        }
        .animation-delay-1000 {
          animation-delay: 1000ms;
        }
        .animation-delay-1200 {
          animation-delay: 1200ms;
        }
        .animation-delay-1400 {
          animation-delay: 1400ms;
        }
        .custom-scrollbar {
          scrollbar-width: none;
          scrollbar-color: transparent transparent;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 0px;
          background: transparent;
        }
        ::-webkit-scrollbar {
          width: 0px;
          background: transparent;
        }
        html {
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};
export default App;
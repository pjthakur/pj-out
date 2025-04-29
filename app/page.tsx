"use client";

import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, PieChart, Pie, ResponsiveContainer, Cell, Legend } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, ShoppingBag, Package, Settings, Moon, Sun, Search } from 'lucide-react';
import Link from 'next/link';

const initialSalesData = [
  { name: 'Jan 2023', sales: 100 },
  { name: 'Feb 2023', sales: 105 },
  { name: 'Mar 2023', sales: 110 },
  { name: 'Apr 2023', sales: 115 },
  { name: 'May 2023', sales: 120 },
  { name: 'Jun 2023', sales: 125 },
  { name: 'Jul 2023', sales: 130 },
  { name: 'Aug 2023', sales: 135 },
  { name: 'Sep 2023', sales: 140 },
  { name: 'Oct 2023', sales: 145 },
].filter(item => {
  const [month, year] = item.name.split(' ');
  const itemDate = new Date(`${month} 1, ${year}`);
  const cutoffDate = new Date('October 23, 2023');
  return itemDate <= cutoffDate;
});

const pieData = [
  { name: 'Product A', value: 400 },
  { name: 'Product B', value: 300 },
  { name: 'Product C', value: 300 },
  { name: 'Product D', value: 200 },
];

const initialInventory = [
  { name: 'Product A', quantity: 100 },
  { name: 'Product B', quantity: 50 },
  { name: 'Product C', quantity: 75 },
  { name: 'Product D', quantity: 25 },
];

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'];

const calculateTotalRevenue = (data: typeof initialSalesData) =>
  data.reduce((acc, cur) => acc + cur.sales, 0);

const countOutOfStockItems = (items: typeof initialInventory) =>
  items.filter((item) => item.quantity === 0).length;

export default function Dashboard() {
  const [mode, setMode] = useState<'light' | 'dark'>('light');
  const [search, setSearch] = useState('');
  const [chart, setChart] = useState<'line' | 'pie'>('line');
  const [activeNav, setActiveNav] = useState('Home');
  const [salesData, setSalesData] = useState(initialSalesData);
  const [inventory, setInventory] = useState(initialInventory);
  const [showSalesPopup, setShowSalesPopup] = useState(false);
  const [showInventoryPopup, setShowInventoryPopup] = useState(false);
  const [newSale, setNewSale] = useState({ month: '', year: '', sales: '' });
  const [newProduct, setNewProduct] = useState({ name: '', quantity: '' });
  const [showAllProducts, setShowAllProducts] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [showSettingsPopup, setShowSettingsPopup] = useState(false);
  const [dailySales, setDailySales] = useState(45); // Example daily sales value

  const toggleMode = () => setMode(mode === 'light' ? 'dark' : 'light');
  const toggleChart = () => setChart(chart === 'line' ? 'pie' : 'line');

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const totalRevenue = calculateTotalRevenue(salesData);
  const outOfStock = countOutOfStockItems(inventory);

  const handleAddSale = () => {
    if (newSale.month && newSale.year && newSale.sales) {
      const formattedDate = `${newSale.month} ${newSale.year}`;
      const newSaleAmount = parseInt(newSale.sales);
      
      const existingIndex = salesData.findIndex(item => item.name === formattedDate);
      
      if (existingIndex !== -1) {
        const updatedSalesData = [...salesData];
        updatedSalesData[existingIndex] = {
          ...updatedSalesData[existingIndex],
          sales: newSaleAmount
        };
        setSalesData(updatedSalesData);
        showToast('Sale updated successfully', 'success');
      } else {
        const newSaleData = { name: formattedDate, sales: newSaleAmount };
        
        const dateToSortable = (dateStr: string) => {
          const [month, year] = dateStr.split(' ');
          const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
          const monthIndex = months.indexOf(month);
          return new Date(parseInt(year), monthIndex, 1).getTime();
        };

        const updatedSalesData = [...salesData, newSaleData].sort((a, b) => 
          dateToSortable(a.name) - dateToSortable(b.name)
        );

        setSalesData(updatedSalesData);
        showToast('Sale added successfully', 'success');
      }

      setNewSale({ month: '', year: '', sales: '' });
      setShowSalesPopup(false);
      setActiveNav('Home');
    } else {
      showToast('Please fill all fields', 'error');
    }
  };

  const handleAddProduct = () => {
    if (newProduct.name && newProduct.quantity) {
      setInventory([{ name: newProduct.name, quantity: parseInt(newProduct.quantity) }, ...inventory]);
      setNewProduct({ name: '', quantity: '' });
      setShowInventoryPopup(false);
      setActiveNav('Home');
      showToast('Product added successfully', 'success');
    } else {
      showToast('Please fill all fields', 'error');
    }
  };

  const handleMarkOutOfStock = (productName: string) => {
    setInventory(inventory.map(item => item.name === productName ? { ...item, quantity: 0 } : item));
    showToast(`${productName} marked as out of stock`, 'success');
  };

  const handleRetainProduct = (productName: string) => {
    setInventory(inventory.map(item => item.name === productName ? { ...item, quantity: 100 } : item));
    showToast(`${productName} retained in stock`, 'success');
  };

  const handleMarkAllOutOfStock = () => {
    setInventory(inventory.map(item => ({ ...item, quantity: 0 })));
    showToast('All items marked as out of stock', 'success');
    setShowSettingsPopup(false);
    setActiveNav('Home');
  };

  const handleRetainAllItems = () => {
    setInventory(inventory.map(item => ({ ...item, quantity: 100 })));
    showToast('All items retained in stock', 'success');
    setShowSettingsPopup(false);
    setActiveNav('Home');
  };

  const handleNavClick = (itemName: string) => {
    setActiveNav(itemName);
    if (itemName === 'Sales') {
      setShowSalesPopup(true);
    } else if (itemName === 'Inventory') {
      setShowInventoryPopup(true);
    } else if (itemName === 'Settings') {
      setShowSettingsPopup(true);
    }
  };

  const navItems = [
    { name: 'Home', icon: Home },
    { name: 'Sales', icon: ShoppingBag },
    { name: 'Inventory', icon: Package },
    { name: 'Settings', icon: Settings },
  ];

  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  const years = Array.from({ length: 5 }, (_, i) => (2023 + i).toString());

  return (
    <div className={`min-h-screen flex flex-row ${mode === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-gray-100 text-gray-900'} font-sans transition-colors duration-300`}>
      {/* Sidebar for Desktop */}
      <motion.aside
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.5 }}
        className={`hidden md:block w-64 p-6 ${mode === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-lg min-h-screen`}
      >
        <h1 className="text-2xl font-bold mb-8 flex items-center gap-2">
          <ShoppingBag className="h-6 w-6 text-blue-500" />
          Sales Dashboard
        </h1>
        <nav className="flex flex-col gap-2">
          {navItems.map((item) => (
            <motion.button
              key={item.name}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleNavClick(item.name)}
              className={`flex items-center cursor-pointer gap-3 p-3 rounded-lg text-left transition-colors duration-200 ${
                activeNav === item.name
                  ? 'bg-blue-500 text-white'
                  : mode === 'dark'
                  ? 'hover:bg-gray-700'
                  : 'hover:bg-gray-200'
              }`}
            >
              {item.name === 'Home' ? (
                <Link href="/">
                  <item.icon className="h-5 w-5" />
                </Link>
              ) : (
                <item.icon className="h-5 w-5" />
              )}
              {item.name}
            </motion.button>
          ))}
        </nav>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleMode}
          className={`mt-8 flex items-center cursor-pointer gap-2 px-4 py-2 w-full rounded-lg transition-colors duration-200 ${
            mode === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
          }`}
        >
          {mode === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          {mode === 'light' ? 'Dark Mode' : 'Light Mode'}
        </motion.button>
      </motion.aside>

      <main className="flex-1 p-4 md:p-8 relative">
        {/* Toast Notification */}
        <AnimatePresence>
          {toast && (
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ${
                toast.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
              }`}
            >
              {toast.message}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <div className={`p-6 rounded-xl shadow-lg ${mode === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <ShoppingBag className="h-6 w-6 text-blue-500" />
              Welcome to Your Business Dashboard
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400">Here's a snapshot of your business activity.</p>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <div className={`p-6 rounded-xl shadow-lg text-center ${mode === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
            <p className="text-lg font-semibold">Total Revenue</p>
            <p className="text-3xl font-bold text-green-500">${totalRevenue.toLocaleString()}</p>
          </div>
          <div className={`p-6 rounded-xl shadow-lg text-center ${mode === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
            <p className="text-lg font-semibold">Items Out of Stock</p>
            <p className="text-3xl font-bold text-red-500">{outOfStock}</p>
          </div>
          <div className={`p-6 rounded-xl shadow-lg text-center ${mode === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
            <p className="text-lg font-semibold">Today's Sales</p>
            <p className="text-3xl font-bold text-blue-500">{dailySales}</p>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mb-6"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">Sales Analytics</h3>
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleChart}
                className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
                aria-label={chart === 'line' ? 'Show Pie Chart' : 'Show Line Chart'}
              >
                {chart === 'line' ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6 text-white cursor-pointer hover:text-blue-50 transition-colors"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="4 16 8 12 13 17 20 10" />
                    <path d="M4 20h16" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6 text-white cursor-pointer hover:text-blue-50 transition-colors"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21.21 15.89A10 10 0 1 1 12 2v10z" />
                    <path d="M22 12A10 10 0 0 0 12 2v10z" />
                  </svg>
                )}
              </motion.button>
            </div>
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={chart}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className={`w-full h-80 p-4 rounded-xl shadow-lg ${mode === 'dark' ? 'bg-gray-800' : 'bg-white'}`}
            >
              <ResponsiveContainer width="100%" height="100%">
                {chart === 'line' ? (
                  <LineChart data={salesData} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
                    <Line
                      type="monotone"
                      dataKey="sales"
                      stroke="#3B82F6"
                      strokeWidth={3}
                      dot={{ fill: '#3B82F6', r: 4 }}
                      activeDot={{ r: 8 }}
                    />
                    <XAxis
                      dataKey="name"
                      stroke={mode === 'dark' ? '#fff' : '#000'}
                      tick={{ fill: mode === 'dark' ? '#fff' : '#000' }}
                      tickLine={{ stroke: mode === 'dark' ? '#fff' : '#000' }}
                    />
                    <YAxis
                      stroke={mode === 'dark' ? '#fff' : '#000'}
                      tick={{ fill: mode === 'dark' ? '#fff' : '#000' }}
                      tickLine={{ stroke: mode === 'dark' ? '#fff' : '#000' }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: mode === 'dark' ? '#1F2937' : '#fff',
                        border: 'none',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                        color: mode === 'dark' ? '#fff' : '#000',
                      }}
                      cursor={{ stroke: '#3B82F6', strokeWidth: 2 }}
                    />
                    <Legend />
                  </LineChart>
                ) : (
                  <PieChart margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      innerRadius={60}
                      paddingAngle={5}
                      label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                      labelLine={{ stroke: mode === 'dark' ? '#fff' : '#000' }}
                    >
                      {pieData.map((_, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                          stroke={mode === 'dark' ? '#fff' : '#000'}
                          strokeWidth={2}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: mode === 'dark' ? '#1F2937' : '#fff',
                        border: 'none',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                        color: mode === 'dark' ? '#fff' : '#000',
                      }}
                      labelStyle={{
                        color: mode === 'dark' ? '#fff' : '#000',
                      }}
                      itemStyle={{
                        color: mode === 'dark' ? '#fff' : '#000',
                      }}
                      formatter={(value: number, name: string) => [`${value}`, name]}
                    />
                    <Legend
                      wrapperStyle={{
                        paddingTop: '20px',
                        color: mode === 'dark' ? '#fff' : '#000',
                      }}
                      formatter={(value: string) => (
                        <span style={{ color: mode === 'dark' ? '#fff' : '#000' }}>{value}</span>
                      )}
                    />
                  </PieChart>
                )}
              </ResponsiveContainer>
            </motion.div>
          </AnimatePresence>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">Inventory Overview</h3>
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowAllProducts(!showAllProducts)}
                className="text-blue-500 hover:text-blue-600 cursor-pointer transition-colors duration-200"
              >
                {showAllProducts ? 'Show Less' : 'View All'}
              </motion.button>
            </div>
          </div>
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className={`w-full pl-10 p-3 rounded-lg border transition-colors duration-200 ${
                mode === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
          </div>
          <div className="overflow-x-auto">
            <table className={`min-w-full rounded-lg shadow-lg ${mode === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
              <thead className={mode === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}>
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Product Name</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Quantity</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {(showAllProducts ? inventory : inventory.slice(0, 3))
                  .filter((item) => item.name.toLowerCase().includes(search.toLowerCase()))
                  .map((item, index) => (
                    <motion.tr
                      key={item.name}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className={`border-t ${mode === 'dark' ? 'border-gray-700' : 'border-gray-200'} hover:bg-opacity-50 ${
                        mode === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                      }`}
                    >
                      <td className="px-6 py-4">{item.name}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 rounded-full text-sm ${
                            item.quantity === 0
                              ? 'bg-red-100 text-red-800'
                              : item.quantity < 50
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-green-100 text-green-800'
                          }`}
                        >
                          {item.quantity}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {item.quantity === 0 ? (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleRetainProduct(item.name)}
                            className="text-green-500 hover:text-green-600 cursor-pointer transition-colors duration-200"
                          >
                            Retain
                          </motion.button>
                        ) : (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleMarkOutOfStock(item.name)}
                            className="text-red-500 hover:text-red-600 cursor-pointer transition-colors duration-200"
                            disabled={item.quantity === 0}
                          >
                            Mark Out of Stock
                          </motion.button>
                        )}
                      </td>
                    </motion.tr>
                  ))}
              </tbody>
            </table>
          </div>
        </motion.section>
      </main>

      {/* Bottom Navbar for Mobile and Tablet */}
      <motion.nav
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={`md:hidden fixed bottom-0 left-0 right-0 ${mode === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-lg p-4 flex justify-around items-center`}
      >
        {navItems.map((item) => (
          <motion.button
            key={item.name}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleNavClick(item.name)}
            className={`p-2 rounded-full transition-colors duration-200 ${
              activeNav === item.name
                ? 'bg-blue-500 text-white'
                : mode === 'dark'
                ? 'hover:bg-gray-700'
                : 'hover:bg-gray-200'
            }`}
            aria-label={item.name}
          >
            {item.name === 'Home' ? (
              <Link href="/">
                <item.icon className="h-6 w-6" />
              </Link>
            ) : (
              <item.icon className="h-6 w-6" />
            )}
          </motion.button>
        ))}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={toggleMode}
          className={`p-2 rounded-full transition-colors duration-200 ${
            mode === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
          }`}
          aria-label={mode === 'light' ? 'Dark Mode' : 'Light Mode'}
        >
          {mode === 'light' ? <Moon className="h-6 w-6" /> : <Sun className="h-6 w-6" />}
        </motion.button>
      </motion.nav>

      {/* Sales Popup */}
      <AnimatePresence>
        {showSalesPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              className={`p-6 rounded-xl shadow-lg w-full max-w-md ${mode === 'dark' ? 'bg-gray-800' : 'bg-white'}`}
            >
              <h3 className="text-xl font-bold mb-4">Add New Sale</h3>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Month</label>
                <select
                  value={newSale.month}
                  onChange={(e) => setNewSale({ ...newSale, month: e.target.value })}
                  className={`w-full p-2 rounded-lg border transition-colors duration-200 ${
                    mode === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                >
                  <option value="">Select Month</option>
                  {months.map((month) => (
                    <option key={month} value={month}>{month}</option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Year</label>
                <select
                  value={newSale.year}
                  onChange={(e) => setNewSale({ ...newSale, year: e.target.value })}
                  className={`w-full p-2 rounded-lg border transition-colors duration-200 ${
                    mode === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                >
                  <option value="">Select Year</option>
                  {years.map((year) => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Sales Amount</label>
                <input
                  type="number"
                  value={newSale.sales}
                  onChange={(e) => setNewSale({ ...newSale, sales: e.target.value })}
                  placeholder="Enter sales amount"
                  className={`w-full p-2 rounded-lg border transition-colors duration-200 ${
                    mode === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
              </div>
              <div className="flex justify-end gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setShowSalesPopup(false);
                    setActiveNav('Home');
                  }}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleAddSale}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
                >
                  Add Sale
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Inventory Popup */}
      <AnimatePresence>
        {showInventoryPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              className={`p-6 rounded-xl shadow-lg w-full max-w-md ${mode === 'dark' ? 'bg-gray-800' : 'bg-white'}`}
            >
              <h3 className="text-xl font-bold mb-4">Add New Product</h3>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Product Name</label>
                <input
                  type="text"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  placeholder="Enter product name"
                  className={`w-full p-2 rounded-lg border transition-colors duration-200 ${
                    mode === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Quantity</label>
                <input
                  type="number"
                  value={newProduct.quantity}
                  onChange={(e) => setNewProduct({ ...newProduct, quantity: e.target.value })}
                  placeholder="Enter quantity"
                  className={`w-full p-2 rounded-lg border transition-colors duration-200 ${
                    mode === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
              </div>
              <div className="flex justify-end gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setShowInventoryPopup(false);
                    setActiveNav('Home');
                  }}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleAddProduct}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
                >
                  Add Product
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Settings Popup */}
      <AnimatePresence>
        {showSettingsPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              className={`p-6 rounded-xl shadow-lg w-full max-w-md ${mode === 'dark' ? 'bg-gray-800' : 'bg-white'}`}
            >
              <h3 className="text-xl font-bold mb-4">Settings</h3>
              <div className="space-y-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleMarkAllOutOfStock}
                  className="w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200"
                >
                  Mark All Items Out of Stock
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleRetainAllItems}
                  className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200"
                >
                  Retain All Items
                </motion.button>
              </div>
              <div className="flex justify-end mt-6">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setShowSettingsPopup(false);
                    setActiveNav('Home');
                  }}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200"
                >
                  Close
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
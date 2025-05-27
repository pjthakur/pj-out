"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  Filter,
  Package,
  TrendingUp,
  AlertTriangle,
  MoreVertical,
  RefreshCw,
  Check,
  Flag,
  Info,
  X,
  Menu,
  ShoppingBag,
  Home,
  User,
  Bell,
  Settings,
  ChevronRight,
  Calendar,
  DollarSign,
  Users,
  MapPin,
  Phone,
  Mail,
  Clock,
  Truck,
  CheckCircle,
  XCircle,
  Eye,
  Download,
  Plus,
  Minus,
  Star,
  Heart,
  Share2,
  Archive,
  Moon,
  Globe,
  Shield,
  Trash2,
  CheckCheck,
  Camera,
  Briefcase,
  Edit2,
  ChevronDown,
} from "lucide-react";

interface Order {
  id: string;
  customer: string;
  customerEmail: string;
  customerPhone: string;
  total: number;
  status:
    | "pending"
    | "confirmed"
    | "processing"
    | "shipped"
    | "delivered"
    | "returned"
    | "cancelled";
  date: string;
  items: OrderItem[];
  shippingAddress: string;
  paymentMethod: string;
  trackingNumber?: string;
  estimatedDelivery?: string;
  priority: "low" | "medium" | "high";
}

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  image: string;
}

interface User {
  name: string;
  email: string;
  role: string;
  avatar: string;
  joinDate: string;
  totalOrders: number;
}

interface Notification {
  id: number;
  title: string;
  message: string;
  time: string;
  type: string;
  read: boolean;
}

const OrderManagementDashboard: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<
    "home" | "orders" | "profile" | "notifications" | "settings"
  >("home");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedOrders, setSelectedOrders] = useState<Set<string>>(new Set());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showOrderDetails, setShowOrderDetails] = useState<string | null>(null);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [swipedOrder, setSwipedOrder] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showToast, setShowToast] = useState<string | null>(null);
  const [toastAnimation, setToastAnimation] = useState<"enter" | "exit">(
    "enter"
  );
  const [toastKey, setToastKey] = useState(0);
  const [user, setUser] = useState<User>({
    name: "Alex Thompson",
    email: "alex.thompson@orderflow.com",
    role: "Store Manager",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face&auto=format",
    joinDate: "2023-01-15",
    totalOrders: 1247,
  });

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editedUser, setEditedUser] = useState<User>(user);
  const [drawerAnimation, setDrawerAnimation] = useState<"enter" | "exit">(
    "enter"
  );
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);

  const [pullDistance, setPullDistance] = useState(0);
  const [isPulling, setIsPulling] = useState(false);
  const [startY, setStartY] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | undefined>(undefined);

  // Add CSS to hide scrollbars
  React.useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .scrollbar-hide::-webkit-scrollbar {
        display: none;
      }
      .scrollbar-hide {
        -ms-overflow-style: none;
        scrollbar-width: none;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [searchTerm]);

  useEffect(() => {
    if (!isEditingProfile) {
      setEditedUser(user);
    }
  }, [user, isEditingProfile]);

  useEffect(() => {
    const generateOrders = (): Order[] => {
      const customers = [
        {
          name: "Sarah Johnson",
          email: "sarah.johnson@email.com",
          phone: "+1 (555) 123-4567",
        },
        {
          name: "Michael Chen",
          email: "michael.chen@email.com",
          phone: "+1 (555) 234-5678",
        },
        {
          name: "Emma Davis",
          email: "emma.davis@email.com",
          phone: "+1 (555) 345-6789",
        },
        {
          name: "James Wilson",
          email: "james.wilson@email.com",
          phone: "+1 (555) 456-7890",
        },
        {
          name: "Lisa Anderson",
          email: "lisa.anderson@email.com",
          phone: "+1 (555) 567-8901",
        },
        {
          name: "David Martinez",
          email: "david.martinez@email.com",
          phone: "+1 (555) 678-9012",
        },
        {
          name: "Sophie Taylor",
          email: "sophie.taylor@email.com",
          phone: "+1 (555) 789-0123",
        },
        {
          name: "Ryan Thompson",
          email: "ryan.thompson@email.com",
          phone: "+1 (555) 890-1234",
        },
        {
          name: "Jessica Brown",
          email: "jessica.brown@email.com",
          phone: "+1 (555) 901-2345",
        },
        {
          name: "Daniel White",
          email: "daniel.white@email.com",
          phone: "+1 (555) 012-3456",
        },
      ];

      const products = [
        {
          name: "Wireless Headphones Pro",
          price: 199.99,
          image:
            "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=150&h=150&fit=crop&auto=format",
        },
        {
          name: "Smart Watch Series 5",
          price: 299.99,
          image:
            "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=150&h=150&fit=crop&auto=format",
        },
        {
          name: "Laptop Stand Aluminum",
          price: 89.99,
          image:
            "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=150&h=150&fit=crop&auto=format",
        },
        {
          name: "Coffee Maker Deluxe",
          price: 149.5,
          image:
            "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=150&h=150&fit=crop&auto=format",
        },
        {
          name: "Gaming Keyboard RGB",
          price: 129.99,
          image:
            "https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=150&h=150&fit=crop&auto=format",
        },
      ];

      const statuses: Order["status"][] = [
        "pending",
        "confirmed",
        "processing",
        "shipped",
        "delivered",
        "returned",
        "cancelled",
      ];
      const priorities: Order["priority"][] = ["low", "medium", "high"];

      return customers.map((customer, index) => {
        const orderItems = products
          .slice(0, Math.floor(Math.random() * 3) + 1)
          .map((product, itemIndex) => ({
            id: `item-${index}-${itemIndex}`,
            name: product.name,
            quantity: Math.floor(Math.random() * 3) + 1,
            price: product.price,
            image: product.image,
          }));

        const total = orderItems.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );
        const status = statuses[Math.floor(Math.random() * statuses.length)];
        const priority =
          priorities[Math.floor(Math.random() * priorities.length)];

        return {
          id: `#ORD-${String(index + 1).padStart(3, "0")}`,
          customer: customer.name,
          customerEmail: customer.email,
          customerPhone: customer.phone,
          total,
          status,
          date: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split("T")[0],
          items: orderItems,
          shippingAddress: `${Math.floor(Math.random() * 9999) + 1} Main St, ${
            ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix"][
              Math.floor(Math.random() * 5)
            ]
          }, NY 10001`,
          paymentMethod: ["Credit Card", "PayPal", "Apple Pay", "Google Pay"][
            Math.floor(Math.random() * 4)
          ],
          trackingNumber:
            status === "shipped" || status === "delivered"
              ? `TRK${Math.random().toString(36).substr(2, 9).toUpperCase()}`
              : undefined,
          estimatedDelivery:
            status === "shipped"
              ? new Date(Date.now() + Math.random() * 5 * 24 * 60 * 60 * 1000)
                  .toISOString()
                  .split("T")[0]
              : undefined,
          priority,
        };
      });
    };

    const generateNotifications = (): Notification[] => {
      return [
        {
          id: 1,
          title: "New Order Received",
          message: "Order #ORD-001 has been placed",
          time: "2 minutes ago",
          type: "order",
          read: false,
        },
        {
          id: 2,
          title: "Payment Confirmed",
          message: "Payment for Order #ORD-002 confirmed",
          time: "15 minutes ago",
          type: "payment",
          read: false,
        },
        {
          id: 3,
          title: "Shipment Delayed",
          message: "Order #ORD-003 shipment delayed",
          time: "1 hour ago",
          type: "warning",
          read: true,
        },
        {
          id: 4,
          title: "Customer Review",
          message: "New 5-star review received",
          time: "2 hours ago",
          type: "review",
          read: false,
        },
        {
          id: 5,
          title: "Low Stock Alert",
          message: "Wireless Headphones Pro is running low",
          time: "3 hours ago",
          type: "warning",
          read: true,
        },
      ];
    };

    setTimeout(() => {
      const generatedOrders = generateOrders();
      setOrders(generatedOrders);
      setFilteredOrders(generatedOrders);
      setNotifications(generateNotifications());
      setLoading(false);
    }, 1500);
  }, []);

  useEffect(() => {
    const filtered = orders.filter((order) => {
      const matchesSearch =
        order.customer.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        order.id.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || order.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
    setFilteredOrders(filtered);
  }, [orders, debouncedSearchTerm, statusFilter]);

  const handleTouchStart = (e: React.TouchEvent) => {
    const container = containerRef.current;
    if (!container) return;
    
    // Only start pull-to-refresh if we're at the top of the container
    if (container.scrollTop === 0) {
      setStartY(e.touches[0].clientY);
      setIsPulling(true);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isPulling || !containerRef.current) return;

    const currentY = e.touches[0].clientY;
    const distance = currentY - startY;

    // Only allow pull down when at the top of the scroll
    if (distance > 0 && containerRef.current.scrollTop === 0) {
      e.preventDefault(); // Prevent default scrolling
      setPullDistance(Math.min(distance * 0.5, 120)); // Add resistance
    } else if (distance <= 0) {
      // If user starts scrolling up, cancel pull-to-refresh
      setIsPulling(false);
      setPullDistance(0);
    }
  };

  const handleTouchEnd = () => {
    if (pullDistance > 60) {
      handlePullToRefresh();
    }
    setIsPulling(false);
    setPullDistance(0);
    setStartY(0);
  };

  const showToastWithAnimation = (message: string) => {
    setToastKey((prev) => prev + 1);
    setToastAnimation("enter");
    setShowToast(message);
  };

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => {
        setToastAnimation("exit");
        setTimeout(() => setShowToast(null), 300);
      }, 2700);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  const openOrderDetails = (orderId: string) => {
    setDrawerAnimation("enter");
    setShowOrderDetails(orderId);
  };

  const closeOrderDetails = () => {
    setDrawerAnimation("exit");
    setTimeout(() => {
      setShowOrderDetails(null);
    }, 300);
  };

  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
    confirmed: "bg-blue-100 text-blue-800 border-blue-300",
    processing: "bg-indigo-100 text-indigo-800 border-indigo-300",
    shipped: "bg-purple-100 text-purple-800 border-purple-300",
    delivered: "bg-green-100 text-green-800 border-green-300",
    returned: "bg-orange-100 text-orange-800 border-orange-300",
    cancelled: "bg-red-100 text-red-800 border-red-300",
  };

  const priorityColors = {
    low: "bg-gray-100 text-gray-700 border-gray-300",
    medium: "bg-yellow-100 text-yellow-700 border-yellow-300",
    high: "bg-red-100 text-red-700 border-red-300",
  };

  const stats = {
    pending: orders.filter((o) => o.status === "pending").length,
    processing: orders.filter((o) => o.status === "processing").length,
    shipped: orders.filter((o) => o.status === "shipped").length,
    delivered: orders.filter((o) => o.status === "delivered").length,
    returned: orders.filter((o) => o.status === "returned").length,
    total: orders.length,
    revenue: orders.reduce((sum, order) => sum + order.total, 0),
  };

  const handlePullToRefresh = async () => {
    setIsRefreshing(true);

    // Simulate API call delay
    setTimeout(() => {
      // Regenerate orders with some randomization to show refresh effect
      const generateOrders = (): Order[] => {
        const customers = [
          {
            name: "Sarah Johnson",
            email: "sarah.johnson@email.com",
            phone: "+1 (555) 123-4567",
          },
          {
            name: "Michael Chen",
            email: "michael.chen@email.com",
            phone: "+1 (555) 234-5678",
          },
          {
            name: "Emma Davis",
            email: "emma.davis@email.com",
            phone: "+1 (555) 345-6789",
          },
          {
            name: "James Wilson",
            email: "james.wilson@email.com",
            phone: "+1 (555) 456-7890",
          },
          {
            name: "Lisa Anderson",
            email: "lisa.anderson@email.com",
            phone: "+1 (555) 567-8901",
          },
          {
            name: "David Martinez",
            email: "david.martinez@email.com",
            phone: "+1 (555) 678-9012",
          },
          {
            name: "Sophie Taylor",
            email: "sophie.taylor@email.com",
            phone: "+1 (555) 789-0123",
          },
          {
            name: "Ryan Thompson",
            email: "ryan.thompson@email.com",
            phone: "+1 (555) 890-1234",
          },
          {
            name: "Jessica Brown",
            email: "jessica.brown@email.com",
            phone: "+1 (555) 901-2345",
          },
          {
            name: "Daniel White",
            email: "daniel.white@email.com",
            phone: "+1 (555) 012-3456",
          },
        ];

        const products = [
          {
            name: "Wireless Headphones Pro",
            price: 199.99,
            image:
              "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=150&h=150&fit=crop&auto=format",
          },
          {
            name: "Smart Watch Series 5",
            price: 299.99,
            image:
              "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=150&h=150&fit=crop&auto=format",
          },
          {
            name: "Laptop Stand Aluminum",
            price: 89.99,
            image:
              "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=150&h=150&fit=crop&auto=format",
          },
          {
            name: "Coffee Maker Deluxe",
            price: 149.5,
            image:
              "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=150&h=150&fit=crop&auto=format",
          },
          {
            name: "Gaming Keyboard RGB",
            price: 129.99,
            image:
              "https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=150&h=150&fit=crop&auto=format",
          },
        ];

        const statuses: Order["status"][] = [
          "pending",
          "confirmed",
          "processing",
          "shipped",
          "delivered",
          "returned",
          "cancelled",
        ];
        const priorities: Order["priority"][] = ["low", "medium", "high"];

        return customers.map((customer, index) => {
          const orderItems = products
            .slice(0, Math.floor(Math.random() * 3) + 1)
            .map((product, itemIndex) => ({
              id: `item-${index}-${itemIndex}`,
              name: product.name,
              quantity: Math.floor(Math.random() * 3) + 1,
              price: product.price,
              image: product.image,
            }));

          const total = orderItems.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
          );
          const status = statuses[Math.floor(Math.random() * statuses.length)];
          const priority =
            priorities[Math.floor(Math.random() * priorities.length)];

          return {
            id: `#ORD-${String(index + 1).padStart(3, "0")}`,
            customer: customer.name,
            customerEmail: customer.email,
            customerPhone: customer.phone,
            total,
            status,
            date: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000)
              .toISOString()
              .split("T")[0],
            items: orderItems,
            shippingAddress: `${Math.floor(Math.random() * 9999) + 1} Main St, ${
              ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix"][
                Math.floor(Math.random() * 5)
              ]
            }, NY 10001`,
            paymentMethod: ["Credit Card", "PayPal", "Apple Pay", "Google Pay"][
              Math.floor(Math.random() * 4)
            ],
            trackingNumber:
              status === "shipped" || status === "delivered"
                ? `TRK${Math.random().toString(36).substr(2, 9).toUpperCase()}`
                : undefined,
            estimatedDelivery:
              status === "shipped"
                ? new Date(Date.now() + Math.random() * 5 * 24 * 60 * 60 * 1000)
                    .toISOString()
                    .split("T")[0]
                : undefined,
            priority,
          };
        });
      };

      const newOrders = generateOrders();
      setOrders(newOrders);
      setFilteredOrders(newOrders);
      
      // Also refresh notifications
      const generateNotifications = (): Notification[] => {
        const notificationTypes = [
          {
            title: "New Order Received",
            message: `Order #ORD-${String(Math.floor(Math.random() * 999) + 1).padStart(3, "0")} has been placed`,
            type: "order",
          },
          {
            title: "Payment Confirmed",
            message: `Payment for Order #ORD-${String(Math.floor(Math.random() * 999) + 1).padStart(3, "0")} confirmed`,
            type: "payment",
          },
          {
            title: "Shipment Delayed",
            message: `Order #ORD-${String(Math.floor(Math.random() * 999) + 1).padStart(3, "0")} shipment delayed`,
            type: "warning",
          },
          {
            title: "Customer Review",
            message: `New ${Math.floor(Math.random() * 2) + 4}-star review received`,
            type: "review",
          },
          {
            title: "Low Stock Alert",
            message: "Wireless Headphones Pro is running low",
            type: "warning",
          },
          {
            title: "Order Delivered",
            message: `Order #ORD-${String(Math.floor(Math.random() * 999) + 1).padStart(3, "0")} has been delivered`,
            type: "order",
          },
        ];

        return Array.from({ length: Math.floor(Math.random() * 3) + 3 }, (_, index) => {
          const notification = notificationTypes[Math.floor(Math.random() * notificationTypes.length)];
          const minutesAgo = Math.floor(Math.random() * 120) + 1;
          return {
            id: Date.now() + index,
            title: notification.title,
            message: notification.message,
            time: minutesAgo < 60 ? `${minutesAgo} minutes ago` : `${Math.floor(minutesAgo / 60)} hours ago`,
            type: notification.type,
            read: Math.random() > 0.7, // 30% chance of being read
          };
        });
      };

      setNotifications(generateNotifications());
      setIsRefreshing(false);
      showToastWithAnimation("Data refreshed successfully!");
    }, 1500);
  };

  const handleOrderAction = (orderId: string, action: "shipped" | "flag") => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId
          ? { ...order, status: action === "shipped" ? "shipped" : "returned" }
          : order
      )
    );
    setSwipedOrder(null);
    showToastWithAnimation(
      action === "shipped"
        ? "Order marked as shipped!"
        : "Order flagged for issues!"
    );
  };

  const toggleOrderSelection = (orderId: string) => {
    setSelectedOrders((prev) => {
      const newSelected = new Set(prev);
      if (newSelected.has(orderId)) {
        newSelected.delete(orderId);
      } else {
        newSelected.add(orderId);
      }
      return newSelected;
    });
  };

  const handleBulkAction = (action: string) => {
    if (action === "mark-shipped") {
      setOrders((prev) =>
        prev.map((order) =>
          selectedOrders.has(order.id) ? { ...order, status: "shipped" } : order
        )
      );
      showToastWithAnimation(
        `${selectedOrders.size} orders marked as shipped!`
      );
    } else if (action === "mark-delivered") {
      setOrders((prev) =>
        prev.map((order) =>
          selectedOrders.has(order.id)
            ? { ...order, status: "delivered" }
            : order
        )
      );
      showToastWithAnimation(
        `${selectedOrders.size} orders marked as delivered!`
      );
    } else if (action === "export") {
      showToastWithAnimation(`Exporting ${selectedOrders.size} orders...`);
    }
    setSelectedOrders(new Set());
    setShowBulkActions(false);
  };

  const showComingSoonToast = () => {
    showToastWithAnimation("This feature is coming soon! 🚀");
  };

  const markNotificationAsRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif))
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })));
    showToastWithAnimation("All notifications marked as read!");
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    showToastWithAnimation("All notifications cleared!");
  };

  const LoadingSpinner = () => (
    <div className="flex items-center justify-center py-12">
      <div className="relative">
        <div className="w-12 h-12 rounded-full border-4 border-white/20 border-t-white animate-spin"></div>
        <div className="absolute inset-0 w-12 h-12 rounded-full border-4 border-transparent border-r-indigo-500 animate-ping"></div>
      </div>
    </div>
  );

  const HomeScreen = () => (
    <div
      className="space-y-6 relative overflow-y-auto scrollbar-hide"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{
        transform: `translateY(${pullDistance}px)`,
        transition: isPulling ? "none" : "transform 0.3s ease-out",
        minHeight: "calc(100vh - 200px)",
        maxHeight: "calc(100vh - 200px)",
        scrollbarWidth: "none", // Firefox
        msOverflowStyle: "none", // IE and Edge
      }}
    >
      {pullDistance > 0 && (
        <div
          className="absolute -top-16 left-1/2 transform -translate-x-1/2 flex flex-col items-center text-white/70 z-10"
          style={{ opacity: Math.min(pullDistance / 60, 1) }}
        >
          <div
            className={`transition-transform duration-200 ${
              pullDistance > 60 ? "rotate-180" : ""
            }`}
          >
            <ChevronDown className="h-6 w-6" />
          </div>
          <span className="text-sm mt-1">
            {pullDistance > 60 ? "Release to refresh" : "Pull to refresh"}
          </span>
        </div>
      )}

      <div className="backdrop-blur-xl bg-white/10 rounded-3xl p-6 border border-white/20">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">
              Welcome back, {user.name.split(" ")[0]}!
            </h2>
            <p className="text-white/70">
              Here's what's happening in your store today
            </p>
          </div>
          <div className="p-3 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600">
            <ShoppingBag className="h-8 w-8 text-white" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-4 border border-white/20 hover:bg-white/15 transition-all duration-300 cursor-pointer">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-green-500/20">
              <DollarSign className="h-5 w-5 text-green-400" />
            </div>
            <div>
              <p className="text-xl font-bold text-white">
                ${stats.revenue.toFixed(0)}
              </p>
              <p className="text-xs text-white/70">Total Revenue</p>
            </div>
          </div>
        </div>

        <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-4 border border-white/20 hover:bg-white/15 transition-all duration-300 cursor-pointer">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-blue-500/20">
              <Package className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <p className="text-xl font-bold text-white">{stats.total}</p>
              <p className="text-xs text-white/70">Total Orders</p>
            </div>
          </div>
        </div>
      </div>

      <div className="backdrop-blur-xl bg-white/10 rounded-3xl p-6 border border-white/20">
        <h3 className="text-lg font-semibold text-white mb-4">
          Order Status Overview
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            {
              label: "Pending",
              count: stats.pending,
              color: "yellow",
              icon: Clock,
            },
            {
              label: "Returned",
              count: stats.returned,
              color: "blue",
              icon: Package,
            },
            {
              label: "Shipped",
              count: stats.shipped,
              color: "purple",
              icon: Truck,
            },
            {
              label: "Delivered",
              count: stats.delivered,
              color: "green",
              icon: CheckCircle,
            },
          ].map((stat, index) => (
            <div
              key={stat.label}
              className="text-center p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300 cursor-pointer"
            >
              <div
                className={`p-2 rounded-lg bg-${stat.color}-500/20 inline-flex mb-2`}
              >
                <stat.icon className={`h-4 w-4 text-${stat.color}-400`} />
              </div>
              <p className="text-lg font-bold text-white">{stat.count}</p>
              <p className="text-xs text-white/70">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="backdrop-blur-xl bg-white/10 rounded-3xl p-6 border border-white/20 mb-4">
        <h3 className="text-lg font-semibold text-white mb-4">
          Recent Orders
        </h3>
        <div className="space-y-3">
          {orders.slice(0, 3).map((order, index) => (
            <div
              key={order.id}
              onClick={() => openOrderDetails(order.id)}
              className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300 cursor-pointer transform hover:scale-[1.02]"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {order.customer.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-white">{order.id}</p>
                  <p className="text-sm text-white/70">{order.customer}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-white">
                  ${order.total.toFixed(2)}
                </p>
                <span
                  className={`inline-block px-2 py-1 rounded-full text-xs font-medium border ${
                    statusColors[order.status]
                  }`}
                >
                  {order.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const OrdersScreen = () => (
    <div className="space-y-6 relative">
      <div
        ref={containerRef}
        className="space-y-6 relative overflow-y-auto scrollbar-hide"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          transform: `translateY(${pullDistance}px)`,
          transition: isPulling ? "none" : "transform 0.3s ease-out",
          minHeight: "calc(100vh - 200px)", // Ensure scrollable area
          maxHeight: "calc(100vh - 200px)",
          scrollbarWidth: "none", // Firefox
          msOverflowStyle: "none", // IE and Edge
        }}
      >
        {pullDistance > 0 && (
          <div
            className="absolute -top-16 left-1/2 transform -translate-x-1/2 flex flex-col items-center text-white/70 z-10"
            style={{ opacity: Math.min(pullDistance / 60, 1) }}
          >
            <div
              className={`transition-transform duration-200 ${
                pullDistance > 60 ? "rotate-180" : ""
              }`}
            >
              <ChevronDown className="h-6 w-6" />
            </div>
            <span className="text-sm mt-1">
              {pullDistance > 60 ? "Release to refresh" : "Pull to refresh"}
            </span>
          </div>
        )}

        <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-4 border border-white/20">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/50" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search orders or customers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all duration-200"
                autoComplete="off"
                spellCheck="false"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/50" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-10 pr-8 py-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-white/30 transition-all duration-200 cursor-pointer appearance-none min-w-[140px]"
              >
                <option value="all" className="bg-gray-800">
                  All Status
                </option>
                <option value="pending" className="bg-gray-800">
                  Pending
                </option>
                <option value="confirmed" className="bg-gray-800">
                  Confirmed
                </option>
                <option value="processing" className="bg-gray-800">
                  Processing
                </option>
                <option value="shipped" className="bg-gray-800">
                  Shipped
                </option>
                <option value="delivered" className="bg-gray-800">
                  Delivered
                </option>
                <option value="returned" className="bg-gray-800">
                  Returned
                </option>
                <option value="cancelled" className="bg-gray-800">
                  Cancelled
                </option>
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : (
          <div className="space-y-2 pb-4">
            {filteredOrders.map((order, index) => (
              <OrderCard
                key={order.id}
                order={order}
                onOpenDetails={openOrderDetails}
                onToggleSelection={toggleOrderSelection}
                isSelected={selectedOrders.has(order.id)}
                onAction={handleOrderAction}
                swipedOrder={swipedOrder}
                setSwipedOrder={setSwipedOrder}
                statusColors={statusColors}
                priorityColors={priorityColors}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const OrderCard = ({
    order,
    onOpenDetails,
    onToggleSelection,
    isSelected,
    onAction,
    swipedOrder,
    setSwipedOrder,
    statusColors,
    priorityColors,
  }: any) => {
    const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);
    const [swipeDistance, setSwipeDistance] = useState(0);
    const [isSwiping, setIsSwiping] = useState(false);
    const cardRef = useRef<HTMLDivElement>(null);

    const handleTouchStart = (e: React.TouchEvent) => {
      // Close any other swiped cards first
      if (swipedOrder && swipedOrder !== order.id) {
        setSwipedOrder(null);
      }
      
      const touch = e.touches[0];
      setTouchStart({
        x: touch.clientX,
        y: touch.clientY,
      });
      setIsSwiping(false); // Don't set to true immediately
    };

    const handleTouchMove = (e: React.TouchEvent) => {
      if (!touchStart) return;

      const touch = e.touches[0];
      const deltaX = touchStart.x - touch.clientX;
      const deltaY = Math.abs(touchStart.y - touch.clientY);

      // Only start swiping if horizontal movement is greater than vertical
      if (Math.abs(deltaX) > deltaY && Math.abs(deltaX) > 5) {
        if (!isSwiping) {
          setIsSwiping(true);
        }
        e.preventDefault(); // Prevent scrolling when swiping horizontally
        e.stopPropagation(); // Prevent parent touch events
        const newDistance = Math.min(Math.max(0, deltaX), 120);
        setSwipeDistance(newDistance);
      } else if (deltaY > Math.abs(deltaX) && deltaY > 5) {
        // If vertical movement is greater, don't interfere with scroll/pull-to-refresh
        setTouchStart(null);
        setIsSwiping(false);
        setSwipeDistance(0);
      }
    };

    const handleTouchEnd = () => {
      if (!touchStart) return;

      if (isSwiping && swipeDistance > 30) {
        setSwipedOrder(order.id);
        setSwipeDistance(120);
      } else {
        setSwipeDistance(0);
        if (swipedOrder === order.id) {
          setSwipedOrder(null);
        }
      }
      
      setTouchStart(null);
      setIsSwiping(false);
    };

    const isCurrentlySwiped = swipedOrder === order.id;

    return (
      <div
        ref={cardRef}
        className="backdrop-blur-xl bg-white/10 rounded-xl border border-white/20 overflow-hidden relative"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          touchAction: "pan-y", // Allow vertical scrolling but capture horizontal gestures
        }}
      >
        {isCurrentlySwiped && (
          <div className="absolute right-0 top-0 h-full flex">
            <button
              onClick={() => onAction(order.id, "shipped")}
              className="bg-green-500 text-white px-6 flex items-center justify-center hover:bg-green-600 transition-colors"
            >
              <Check className="h-5 w-5" />
            </button>
            <button
              onClick={() => onAction(order.id, "flag")}
              className="bg-red-500 text-white px-6 flex items-center justify-center hover:bg-red-600 transition-colors"
            >
              <Flag className="h-5 w-5" />
            </button>
          </div>
        )}

        <div
          className={`p-4 transition-transform duration-200 bg-white/10 ${
            isSwiping ? "opacity-90" : "opacity-100"
          }`}
          style={{
            transform: `translateX(-${isCurrentlySwiped ? 120 : swipeDistance}px)`,
            willChange: "transform",
            boxShadow: isSwiping ? "0 4px 20px rgba(0,0,0,0.3)" : "none",
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 flex-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleSelection(order.id);
                }}
                className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all duration-200 ${
                  isSelected
                    ? "bg-indigo-500 border-indigo-500"
                    : "border-white/30 hover:border-white/50"
                }`}
              >
                {isSelected && <Check className="h-3 w-3 text-white" />}
              </button>

              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <span className="text-white text-xs font-medium">
                  {order.customer.charAt(0)}
                </span>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <p className="font-semibold text-white text-sm">{order.id}</p>
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium border ${
                      priorityColors[order.priority]
                    }`}
                  >
                    {order.priority}
                  </span>
                </div>
                <p className="text-xs text-white/70 truncate">
                  {order.customer}
                </p>
              </div>
            </div>

            <div className="text-right ml-3">
              <p className="font-bold text-white text-sm">
                ${order.total.toFixed(2)}
              </p>
              <span
                className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium border ${
                  statusColors[order.status]
                }`}
              >
                {order.status}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between mt-2 text-xs text-white/60">
            <span>
              {order.items.length} items • {order.date}
            </span>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onOpenDetails(order.id)}
                className="p-1 hover:bg-white/10 rounded-lg transition-colors"
              >
                <Eye className="h-3 w-3" />
              </button>
              <div className="text-white/30">
                <ChevronRight className="h-3 w-3" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const ProfileScreen = () => (
    <div className="space-y-6">
      <div className="backdrop-blur-xl bg-white/10 rounded-3xl p-6 border border-white/20">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
            <div className="relative group">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-20 h-20 rounded-2xl object-cover border-4 border-white/20 transition-all duration-300"
              />
            </div>
            <div className="text-center sm:text-left">
              <h2 className="text-2xl font-bold text-white">{user.name}</h2>
              <p className="text-white/70">{user.role}</p>
              <p className="text-sm text-white/50">{user.email}</p>
              <p className="text-sm text-white/50">
                Member since {new Date(user.joinDate).toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className="flex justify-center sm:justify-end w-full sm:w-auto">
            <button
              onClick={showComingSoonToast}
              className="flex items-center space-x-2 px-4 py-2 bg-white/10 border border-white/20 text-white rounded-lg hover:bg-white/20 transition-all duration-300"
            >
              <Edit2 className="h-4 w-4" />
              <span>Edit Profile</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 rounded-xl bg-white/5">
            <p className="text-2xl font-bold text-white">{user.totalOrders}</p>
            <p className="text-sm text-white/70">Orders Managed</p>
          </div>
          <div className="text-center p-4 rounded-xl bg-white/5">
            <p className="text-2xl font-bold text-white">
              {Math.round(user.totalOrders / 30)}
            </p>
            <p className="text-sm text-white/70">Monthly Avg</p>
          </div>
        </div>
      </div>

      <div className="backdrop-blur-xl bg-white/10 rounded-3xl p-6 border border-white/20">
        <h3 className="text-lg font-semibold text-white mb-4">
          Account Settings
        </h3>
        <div className="space-y-3">
          {[
            {
              icon: User,
              label: "Personal Information",
              action: "Edit Profile",
            },
            { icon: Bell, label: "Notifications", action: "Configure" },
            { icon: Settings, label: "Preferences", action: "Customize" },
            { icon: Phone, label: "Contact Support", action: "Get Help" },
          ].map((item, index) => (
            <div
              key={index}
              onClick={showComingSoonToast}
              className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300 cursor-pointer"
            >
              <div className="flex items-center space-x-3">
                <item.icon className="h-5 w-5 text-white/70" />
                <span className="text-white">{item.label}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-white/70">{item.action}</span>
                <ChevronRight className="h-4 w-4 text-white/50" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const NotificationsScreen = () => (
    <div
      className="space-y-4 relative overflow-y-auto scrollbar-hide"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{
        transform: `translateY(${pullDistance}px)`,
        transition: isPulling ? "none" : "transform 0.3s ease-out",
        minHeight: "calc(100vh - 200px)",
        maxHeight: "calc(100vh - 200px)",
        scrollbarWidth: "none", // Firefox
        msOverflowStyle: "none", // IE and Edge
      }}
    >
      {pullDistance > 0 && (
        <div
          className="absolute -top-16 left-1/2 transform -translate-x-1/2 flex flex-col items-center text-white/70 z-10"
          style={{ opacity: Math.min(pullDistance / 60, 1) }}
        >
          <div
            className={`transition-transform duration-200 ${
              pullDistance > 60 ? "rotate-180" : ""
            }`}
          >
            <ChevronDown className="h-6 w-6" />
          </div>
          <span className="text-sm mt-1">
            {pullDistance > 60 ? "Release to refresh" : "Pull to refresh"}
          </span>
        </div>
      )}

      <div className="backdrop-blur-xl bg-white/10 rounded-3xl p-6 border border-white/20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <h2 className="text-xl font-bold text-white">Notifications</h2>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={markAllNotificationsAsRead}
              className="flex-1 sm:flex-none px-3 py-1 rounded-lg bg-blue-500/20 border border-blue-500/30 text-blue-100 hover:bg-blue-500/30 transition-all duration-200 cursor-pointer text-sm whitespace-nowrap"
            >
              <CheckCheck className="h-4 w-4 inline mr-1" />
              Mark All Read
            </button>
            <button
              onClick={clearAllNotifications}
              className="flex-1 sm:flex-none px-3 py-1 rounded-lg bg-red-500/20 border border-red-500/30 text-red-100 hover:bg-red-500/30 transition-all duration-200 cursor-pointer text-sm whitespace-nowrap"
            >
              <Trash2 className="h-4 w-4 inline mr-1" />
              Clear All
            </button>
          </div>
        </div>
        <div className="space-y-3 pb-4">
          {notifications.map((notification, index) => (
            <div
              key={notification.id}
              onClick={() => markNotificationAsRead(notification.id)}
              className={`flex items-start space-x-3 p-4 rounded-xl transition-all duration-300 cursor-pointer ${
                notification.read
                  ? "bg-white/5 hover:bg-white/10"
                  : "bg-white/10 hover:bg-white/15 border border-white/20"
              }`}
            >
              <div
                className={`p-2 rounded-lg ${
                  notification.type === "order"
                    ? "bg-blue-500/20"
                    : notification.type === "payment"
                    ? "bg-green-500/20"
                    : notification.type === "warning"
                    ? "bg-orange-500/20"
                    : "bg-purple-500/20"
                }`}
              >
                {notification.type === "order" && (
                  <Package className="h-4 w-4 text-blue-400" />
                )}
                {notification.type === "payment" && (
                  <DollarSign className="h-4 w-4 text-green-400" />
                )}
                {notification.type === "warning" && (
                  <AlertTriangle className="h-4 w-4 text-orange-400" />
                )}
                {notification.type === "review" && (
                  <Star className="h-4 w-4 text-purple-400" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p
                    className={`font-medium truncate ${
                      notification.read ? "text-white/70" : "text-white"
                    }`}
                  >
                    {notification.title}
                  </p>
                  {!notification.read && (
                    <div className="w-2 h-2 bg-indigo-500 rounded-full flex-shrink-0 ml-2"></div>
                  )}
                </div>
                <p
                  className={`text-sm ${
                    notification.read ? "text-white/50" : "text-white/70"
                  } truncate`}
                >
                  {notification.message}
                </p>
                <p className="text-xs text-white/50 mt-1">
                  {notification.time}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const SettingsScreen = () => (
    <div className="space-y-6">
      <div className="backdrop-blur-xl bg-white/10 rounded-3xl p-6 border border-white/20">
        <h2 className="text-xl font-bold text-white mb-4">Settings</h2>
        <div className="space-y-4">
          {[
            {
              icon: Bell,
              title: "Push Notifications",
              description: "Receive alerts for new orders",
            },
            {
              icon: Moon,
              title: "Dark Mode",
              description: "Toggle dark/light theme",
            },
            {
              icon: Globe,
              title: "Language",
              description: "Choose your preferred language",
            },
            {
              icon: Shield,
              title: "Privacy",
              description: "Manage your privacy settings",
            },
          ].map((setting, index) => (
            <div
              key={index}
              onClick={showComingSoonToast}
              className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300 cursor-pointer"
            >
              <div className="flex items-center space-x-3">
                <setting.icon className="h-5 w-5 text-white/70" />
                <div>
                  <p className="font-medium text-white">{setting.title}</p>
                  <p className="text-sm text-white/70">{setting.description}</p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-white/50" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden pb-20">
      <div className="relative">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.05\'%3E%3Ccircle cx=\'30\' cy=\'30\' r=\'2\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>
        <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
      </div>

      <header className="relative z-10 backdrop-blur-xl bg-white/10 border-b border-white/20 px-4 py-4 sm:px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg">
              <ShoppingBag className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">OrderFlow Pro</h1>
              <p className="text-xs text-white/70">Admin Dashboard</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentScreen("profile")}
              className="p-1 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-200 cursor-pointer"
            >
              <img
                src={user.avatar}
                alt={user.name}
                className="w-8 h-8 rounded-lg object-cover"
              />
            </button>
          </div>
        </div>
      </header>

      <main className="px-4 py-6 sm:px-6 relative">
        {isRefreshing && (
          <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-40">
            <div className="backdrop-blur-xl bg-white/10 rounded-full p-3 border border-white/20 flex items-center space-x-2">
              <RefreshCw className="h-5 w-5 text-white animate-spin" />
              <span className="text-white text-sm">Refreshing...</span>
            </div>
          </div>
        )}

        {currentScreen === "home" && <HomeScreen />}
        {currentScreen === "orders" && <OrdersScreen />}
        {currentScreen === "profile" && <ProfileScreen />}
        {currentScreen === "notifications" && <NotificationsScreen />}
        {currentScreen === "settings" && <SettingsScreen />}
      </main>

      {showOrderDetails && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex">
          <div className="flex-1" onClick={closeOrderDetails}></div>
          <div
            className={`w-full max-w-md bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border-l border-white/20 p-6 overflow-y-auto transition-transform duration-300 ${
              drawerAnimation === "enter" ? "translate-x-0" : "translate-x-full"
            }`}
          >
            {(() => {
              const order = orders.find((o) => o.id === showOrderDetails);
              if (!order) return null;

              return (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-white">
                      Order Details
                    </h3>
                    <button
                      onClick={closeOrderDetails}
                      className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
                    >
                      <X className="h-5 w-5 text-white" />
                    </button>
                  </div>

                  <div className="backdrop-blur-xl bg-white/5 rounded-2xl p-4 border border-white/10">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-white/70">Order ID</span>
                        <span className="font-semibold text-white">
                          {order.id}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-white/70">Status</span>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium border ${
                            statusColors[order.status]
                          }`}
                        >
                          {order.status.charAt(0).toUpperCase() +
                            order.status.slice(1)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-white/70">Date</span>
                        <span className="font-semibold text-white">
                          {order.date}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-white/70">Total</span>
                        <span className="font-bold text-white text-lg">
                          ${order.total.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="backdrop-blur-xl bg-white/5 rounded-2xl p-4 border border-white/10">
                    <h4 className="font-semibold text-white mb-3">
                      Customer Information
                    </h4>
                    <div className="space-y-2">
                      <p className="text-white font-medium">{order.customer}</p>
                      <p className="text-white/70 text-sm">
                        {order.customerEmail}
                      </p>
                      <p className="text-white/70 text-sm">
                        {order.customerPhone}
                      </p>
                      <p className="text-white/70 text-sm">
                        {order.shippingAddress}
                      </p>
                    </div>
                  </div>

                  <div className="backdrop-blur-xl bg-white/5 rounded-2xl p-4 border border-white/10">
                    <h4 className="font-semibold text-white mb-3">
                      Order Items
                    </h4>
                    <div className="space-y-3">
                      {order.items.map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-3 p-3 rounded-xl bg-white/5"
                        >
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                          <div className="flex-1">
                            <p className="font-medium text-white text-sm">
                              {item.name}
                            </p>
                            <p className="text-xs text-white/70">
                              Qty: {item.quantity}
                            </p>
                          </div>
                          <p className="font-semibold text-white text-sm">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {order.trackingNumber && (
                    <div className="backdrop-blur-xl bg-white/5 rounded-2xl p-4 border border-white/10">
                      <h4 className="font-semibold text-white mb-3">
                        Tracking Information
                      </h4>
                      <div className="space-y-2">
                        <p className="text-white/70 text-sm">
                          Tracking:{" "}
                          <span className="text-white font-medium">
                            {order.trackingNumber}
                          </span>
                        </p>
                        {order.estimatedDelivery && (
                          <p className="text-white/70 text-sm">
                            Est. Delivery:{" "}
                            <span className="text-white font-medium">
                              {order.estimatedDelivery}
                            </span>
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="space-y-3">
                    <button
                      onClick={showComingSoonToast}
                      className="w-full py-3 px-4 bg-indigo-500/20 border border-indigo-500/30 text-indigo-100 rounded-xl hover:bg-indigo-500/30 transition-all duration-200 cursor-pointer"
                    >
                      Update Status
                    </button>
                    <button
                      onClick={showComingSoonToast}
                      className="w-full py-3 px-4 bg-green-500/20 border border-green-500/30 text-green-100 rounded-xl hover:bg-green-500/30 transition-all duration-200 cursor-pointer"
                    >
                      Print Invoice
                    </button>
                    <button
                      onClick={showComingSoonToast}
                      className="w-full py-3 px-4 bg-purple-500/20 border border-purple-500/30 text-purple-100 rounded-xl hover:bg-purple-500/30 transition-all duration-200 cursor-pointer"
                    >
                      Contact Customer
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      <nav className="fixed bottom-0 left-0 right-0 backdrop-blur-xl bg-white/10 border-t border-white/20 px-4 py-2 z-50">
        <div className="flex items-center justify-around max-w-md mx-auto">
          {[
            { id: "home", icon: Home, label: "Home" },
            { id: "orders", icon: Package, label: "Orders" },
            { id: "notifications", icon: Bell, label: "Alerts" },
            { id: "profile", icon: User, label: "Profile" },
            { id: "settings", icon: Settings, label: "Settings" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentScreen(item.id as any)}
              className={`flex flex-col items-center space-y-1 p-2 rounded-xl transition-all duration-200 cursor-pointer relative ${
                currentScreen === item.id
                  ? "bg-white/20 text-white"
                  : "text-white/60 hover:text-white hover:bg-white/10"
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-xs font-medium">{item.label}</span>
              {item.id === "notifications" &&
                notifications.filter((n) => !n.read).length > 0 && (
                  <span className="absolute top-0 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                )}
            </button>
          ))}
        </div>
      </nav>

      {selectedOrders.size > 0 && (
        <button
          onClick={() => setShowBulkActions(true)}
          className="fixed bottom-20 right-6 w-14 h-14 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full shadow-lg flex items-center justify-center text-white hover:scale-110 transition-all duration-200 cursor-pointer z-20 animate-pulse"
        >
          <span className="text-sm font-bold">{selectedOrders.size}</span>
        </button>
      )}

      {showBulkActions && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4">
          <div className="backdrop-blur-xl bg-white/10 rounded-t-3xl sm:rounded-3xl w-full max-w-md border border-white/20 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">
                Bulk Actions ({selectedOrders.size} selected)
              </h3>
              <button
                onClick={() => setShowBulkActions(false)}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
              >
                <X className="h-5 w-5 text-white" />
              </button>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => handleBulkAction("mark-shipped")}
                className="w-full p-4 rounded-xl bg-green-500/20 border border-green-500/30 text-green-100 hover:bg-green-500/30 transition-all duration-200 cursor-pointer"
              >
                <Truck className="h-5 w-5 inline mr-2" />
                Mark as Shipped
              </button>
              <button
                onClick={() => handleBulkAction("mark-delivered")}
                className="w-full p-4 rounded-xl bg-blue-500/20 border border-blue-500/30 text-blue-100 hover:bg-blue-500/30 transition-all duration-200 cursor-pointer"
              >
                <CheckCircle className="h-5 w-5 inline mr-2" />
                Mark as Delivered
              </button>
              <button
                onClick={() => handleBulkAction("export")}
                className="w-full p-4 rounded-xl bg-purple-500/20 border border-purple-500/30 text-purple-100 hover:bg-purple-500/30 transition-all duration-200 cursor-pointer"
              >
                <Download className="h-5 w-5 inline mr-2" />
                Export Selected
              </button>
            </div>
          </div>
        </div>
      )}

      {showToast && (
        <div
          key={toastKey}
          className="fixed bottom-20 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 backdrop-blur-xl bg-white/20 border border-white/30 rounded-2xl text-white font-medium shadow-lg transition-all duration-300 max-w-sm mx-4"
          style={{
            transform: `translate(-50%, ${
              toastAnimation === "enter" ? "0" : "100%"
            })`,
            opacity: toastAnimation === "enter" ? 1 : 0,
          }}
        >
          {showToast}
        </div>
      )}
    </div>
  );
};

export default OrderManagementDashboard;
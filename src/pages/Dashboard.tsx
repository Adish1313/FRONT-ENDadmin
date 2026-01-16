import React, { useState, useEffect } from "react";
import {
  Users,
  Package,
  ShoppingCart,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  AlertCircle,
} from "lucide-react";
import { apiCallGet } from "../api/axios";
import { API_URLS } from "../contants/constants";
import { motion } from "framer-motion";

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [lowStock, setLowStock] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const [statsRes, ordersRes, stockRes] = await Promise.all([
          apiCallGet(API_URLS.DASHBOARD_OVERVIEW),
          apiCallGet(API_URLS.DASHBOARD_RECENT_ORDERS, { limit: 5 }),
          apiCallGet(API_URLS.DASHBOARD_LOW_STOCK, { limit: 5 }),
        ]);

        if (statsRes?.data) setStats(statsRes.data);
        if (ordersRes?.data) setRecentOrders(ordersRes.data);
        if (stockRes?.data) setLowStock(stockRes.data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const statCards = [
    {
      title: "Total Revenue",
      value: `$${stats?.totalRevenue || "0.00"}`,
      icon: TrendingUp,
      color: "bg-emerald-500",
      trend: "+12.5%",
      isPositive: true,
    },
    {
      title: "Total Orders",
      value: stats?.totalOrders || "0",
      icon: ShoppingCart,
      color: "bg-blue-500",
      trend: "+8.2%",
      isPositive: true,
    },
    {
      title: "Total Customers",
      value: stats?.totalUsers || "0",
      icon: Users,
      color: "bg-violet-500",
      trend: "+5.4%",
      isPositive: true,
    },
    {
      title: "Active Products",
      value: stats?.totalProducts || "0",
      icon: Package,
      color: "bg-amber-500",
      trend: "-2.1%",
      isPositive: false,
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Dashboard Overview
        </h1>
        <p className="text-slate-500 mt-1">
          Welcome back! Here's what's happening with your store today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div
                className={
                  card.color +
                  " p-3 rounded-xl text-white shadow-lg shadow-opacity-20"
                }
              >
                <card.icon size={24} />
              </div>
              <div
                className={`flex items-center gap-1 text-sm font-medium ${
                  card.isPositive ? "text-emerald-600" : "text-red-600"
                }`}
              >
                {card.trend}
                {card.isPositive ? (
                  <ArrowUpRight size={16} />
                ) : (
                  <ArrowDownRight size={16} />
                )}
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm text-slate-500 font-medium">{card.title}</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">
                {card.value}
              </h3>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Orders Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-slate-900 flex items-center gap-2">
              <Clock size={20} className="text-blue-500" />
              Recent Orders
            </h3>
            <button className="text-sm text-blue-600 font-medium hover:underline">
              View All
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4 font-semibold">Order ID</th>
                  <th className="px-6 py-4 font-semibold">Customer</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-6 py-4 font-medium text-slate-900">
                      #{order.orderNumber}
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {order.user?.name || "Guest"}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold w-fit ${
                            order.status === "DELIVERED"
                              ? "bg-emerald-100 text-emerald-700"
                              : order.status === "CANCELLED"
                              ? "bg-red-100 text-red-700"
                              : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {order.status}
                        </span>
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold w-fit ${
                            order.paymentStatus === "PAID"
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          {order.paymentStatus}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-900">
                      ${order.totalAmount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100">
          <div className="p-6 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 flex items-center gap-2">
              <AlertCircle size={20} className="text-amber-500" />
              Low Stock Alerts
            </h3>
          </div>
          <div className="p-6 space-y-6">
            {lowStock.map((item) => (
              <div key={item.id} className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center overflow-hidden shrink-0">
                  {item.product?.images?.[0] ? (
                    <img
                      src={item.product.images[0].imageUrl}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Package size={20} className="text-slate-400" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-900 truncate">
                    {item.product?.name}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {item.quantity} units remaining
                  </p>
                </div>
                <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-500"
                    style={{ width: `${(item.quantity / 10) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
            {lowStock.length === 0 && (
              <p className="text-center text-slate-400 py-4">
                No low stock alerts
              </p>
            )}
            <button className="w-full py-3 mt-4 text-sm font-bold text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors">
              Manage Inventory
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

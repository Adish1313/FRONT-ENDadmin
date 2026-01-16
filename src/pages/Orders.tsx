import React, { useState, useEffect } from "react";
import { Search, ChevronLeft, ChevronRight, User } from "lucide-react";
import { apiCallGet, apiCallPatch } from "../api/axios";
import { API_URLS } from "../contants/constants";
import { toast } from "react-toastify";

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [pagination, setPagination] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params: any = { page, limit: 10 };
      if (status) params.status = status;
      if (search) params.search = search;

      const res = await apiCallGet(API_URLS.ADMIN_ORDERS, params);
      if (res?.data) {
        setOrders(res.data.orders);
        setPagination(res.data.pagination);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchOrders();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [page, status, search]);

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      const res = await apiCallPatch(API_URLS.ADMIN_ORDER_STATUS(orderId), {
        status: newStatus,
      });
      if (!res.error) {
        toast.success(`Order status updated to ${newStatus}`);
        fetchOrders();
      }
    } catch (error) {
      toast.error("Failed to update order status");
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "DELIVERED":
        return "bg-emerald-100 text-emerald-700";
      case "CANCELLED":
        return "bg-red-100 text-red-700";
      case "SHIPPED":
        return "bg-amber-100 text-amber-700";
      case "PLACED":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  const getPaymentStatusStyle = (status: string) => {
    switch (status) {
      case "PAID":
        return "bg-emerald-100 text-emerald-700";
      case "FAILED":
        return "bg-red-100 text-red-700";
      case "PENDING":
        return "bg-amber-100 text-amber-700";
      case "REFUNDED":
        return "bg-slate-100 text-slate-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Orders</h1>
        <p className="text-slate-500 mt-1">Track and manage customer orders.</p>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search by Order ID or Customer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border-transparent focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-xl text-sm transition-all outline-none"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="px-4 py-2 bg-slate-50 text-slate-600 rounded-xl text-sm font-medium hover:bg-slate-100 transition-colors outline-none border-none"
          >
            <option value="">All Status</option>
            <option value="PLACED">Placed</option>
            <option value="SHIPPED">Shipped</option>
            <option value="DELIVERED">Delivered</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 font-semibold">Order Details</th>
                <th className="px-6 py-4 font-semibold">Customer</th>
                <th className="px-6 py-4 font-semibold">Date</th>
                <th className="px-6 py-4 font-semibold">Amount</th>
                <th className="px-6 py-4 font-semibold">Payment</th>
                <th className="px-6 py-4 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading
                ? Array(5)
                    .fill(0)
                    .map((_, i) => (
                      <tr key={i} className="animate-pulse">
                        <td colSpan={6} className="px-6 py-4">
                          <div className="h-12 bg-slate-100 rounded-lg"></div>
                        </td>
                      </tr>
                    ))
                : orders.map((order) => (
                    <tr
                      key={order.id}
                      className="hover:bg-slate-50 transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-slate-900">
                            #{order.orderNumber}
                          </span>
                          <span className="text-xs text-slate-500">
                            {order.items?.length || 0} items
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                            <User size={14} />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-slate-900">
                              {order.user?.name || "Guest"}
                            </span>
                            <span className="text-xs text-slate-500">
                              {order.user?.email}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-slate-600">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-bold text-slate-900">
                          ${order.totalAmount}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-bold ${getPaymentStatusStyle(
                            order.paymentStatus
                          )}`}
                        >
                          {order.paymentStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={order.status}
                          onChange={(e) =>
                            handleStatusUpdate(order.id, e.target.value)
                          }
                          className={`px-2.5 py-1 rounded-full text-xs font-medium outline-none border-none cursor-pointer ${getStatusStyle(
                            order.status
                          )}`}
                        >
                          <option value="PLACED">PLACED</option>
                          <option value="SHIPPED">SHIPPED</option>
                          <option value="DELIVERED">DELIVERED</option>
                          <option value="CANCELLED">CANCELLED</option>
                        </select>
                        {order.status === "CANCELLED" &&
                          order.cancellationReason && (
                            <p
                              className="text-[10px] text-red-500 mt-1 italic max-w-[150px] truncate"
                              title={order.cancellationReason}
                            >
                              Reason: {order.cancellationReason}
                            </p>
                          )}
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination && (
          <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
            <p className="text-sm text-slate-500">
              Showing{" "}
              <span className="font-medium text-slate-900">
                {(page - 1) * 10 + 1}
              </span>{" "}
              to{" "}
              <span className="font-medium text-slate-900">
                {Math.min(page * 10, pagination.total)}
              </span>{" "}
              of{" "}
              <span className="font-medium text-slate-900">
                {pagination.total}
              </span>{" "}
              orders
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p: number) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={() =>
                  setPage((p: number) => Math.min(pagination.totalPages, p + 1))
                }
                disabled={page === pagination.totalPages}
                className="p-2 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;

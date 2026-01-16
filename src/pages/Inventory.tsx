import React, { useState, useEffect } from "react";
import {
  Search,
  Warehouse,
  AlertTriangle,
  Edit3,
  ChevronLeft,
  ChevronRight,
  Package,
} from "lucide-react";
import { apiCallGet, apiCallPatch } from "../api/axios";
import { API_URLS } from "../contants/constants";
import { toast } from "react-toastify";

const Inventory: React.FC = () => {
  const [inventory, setInventory] = useState<any[]>([]);
  const [pagination, setPagination] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const params: any = { page, limit: 10 };
      if (search) params.search = search;

      const res = await apiCallGet(API_URLS.ADMIN_INVENTORY, params);
      if (res?.data) {
        setInventory(res.data.inventory);
        setPagination(res.data.pagination);
      }
    } catch (error) {
      console.error("Error fetching inventory:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchInventory();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [page, search]);

  const handleUpdateStock = async (productId: string, currentQty: number) => {
    const newQty = prompt("Enter new stock quantity:", currentQty.toString());
    if (newQty === null || isNaN(parseInt(newQty))) return;

    try {
      const res = await apiCallPatch(API_URLS.ADMIN_STOCK_UPDATE(productId), {
        quantity: parseInt(newQty),
      });
      if (!res.error) {
        toast.success("Stock updated successfully");
        fetchInventory();
      }
    } catch (error) {
      toast.error("Failed to update stock");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Inventory Management
        </h1>
        <p className="text-slate-500 mt-1">
          Monitor and update product stock levels.
        </p>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
              <Warehouse size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">
                Total Items in Stock
              </p>
              <h3 className="text-2xl font-bold text-slate-900">
                {inventory.reduce((sum, item) => sum + (item.quantity || 0), 0)}
              </h3>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-amber-100 text-amber-600 rounded-xl">
              <AlertTriangle size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">
                Low Stock Alerts
              </p>
              <h3 className="text-2xl font-bold text-slate-900">
                {
                  inventory.filter(
                    (item) =>
                      (item.quantity || 0) <= (item.lowStockThreshold || 10)
                  ).length
                }
              </h3>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl">
              <Package size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Out of Stock</p>
              <h3 className="text-2xl font-bold text-slate-900">
                {inventory.filter((item) => (item.quantity || 0) === 0).length}
              </h3>
            </div>
          </div>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 border-b border-slate-100">
          <div className="relative w-full max-w-md">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search inventory..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border-transparent focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-xl text-sm transition-all outline-none"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 font-semibold">Product</th>
                <th className="px-6 py-4 font-semibold">SKU</th>
                <th className="px-6 py-4 font-semibold">Current Stock</th>
                <th className="px-6 py-4 font-semibold">Threshold</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
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
                : inventory.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 overflow-hidden">
                            {item.product?.images?.[0] ? (
                              <img
                                src={item.product.images[0].imageUrl}
                                alt=""
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <Package size={20} />
                            )}
                          </div>
                          <span className="text-sm font-bold text-slate-900">
                            {item.product?.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-slate-500 font-mono uppercase">
                          {item.product?.id?.slice(0, 8)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-sm font-bold ${
                              (item.quantity || 0) <=
                              (item.lowStockThreshold || 10)
                                ? "text-amber-600"
                                : "text-slate-900"
                            }`}
                          >
                            {item.quantity || 0}
                          </span>
                          {(item.quantity || 0) <=
                            (item.lowStockThreshold || 10) && (
                            <AlertTriangle
                              size={14}
                              className="text-amber-500"
                            />
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-slate-600">
                          {item.lowStockThreshold || 10}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                            (item.quantity || 0) === 0
                              ? "bg-red-100 text-red-700"
                              : (item.quantity || 0) <=
                                (item.lowStockThreshold || 10)
                              ? "bg-amber-100 text-amber-700"
                              : "bg-emerald-100 text-emerald-700"
                          }`}
                        >
                          {(item.quantity || 0) === 0
                            ? "Out of Stock"
                            : (item.quantity || 0) <=
                              (item.lowStockThreshold || 10)
                            ? "Low Stock"
                            : "In Stock"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() =>
                            handleUpdateStock(
                              item.productId,
                              item.quantity || 0
                            )
                          }
                          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                        >
                          <Edit3 size={18} />
                        </button>
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
              items
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

export default Inventory;

import React, { useState, useEffect } from "react";
import {
  Search,
  UserX,
  UserCheck,
  Mail,
  Phone,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
} from "lucide-react";
import { apiCallGet, apiCallPatch } from "../api/axios";
import { API_URLS } from "../contants/constants";
import { toast } from "react-toastify";

const Users: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [pagination, setPagination] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [isActive, setIsActive] = useState<string>("");

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params: any = { page, limit: 10, search };
      if (isActive !== "") params.isActive = isActive === "true";

      const res = await apiCallGet(API_URLS.ADMIN_USERS, params);
      if (res?.data) {
        setUsers(res.data.users);
        setPagination(res.data.pagination);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchUsers();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [page, search, isActive]);

  const handleBlockToggle = async (user: any) => {
    const url = user.isActive
      ? API_URLS.ADMIN_USER_BLOCK(user.id)
      : API_URLS.ADMIN_USER_UNBLOCK(user.id);

    try {
      const res = await apiCallPatch(url, {});
      if (!res.error) {
        toast.success(
          `User ${user.isActive ? "blocked" : "unblocked"} successfully`
        );
        fetchUsers();
      }
    } catch (error) {
      toast.error("Failed to update user status");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Users</h1>
        <p className="text-slate-500 mt-1">
          Manage customer accounts and permissions.
        </p>
      </div>

      {/* Search & Filters */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search by name, email or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border-transparent focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-xl text-sm transition-all outline-none"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={isActive}
            onChange={(e) => setIsActive(e.target.value)}
            className="px-4 py-2 bg-slate-50 text-slate-600 rounded-xl text-sm font-medium hover:bg-slate-100 transition-colors outline-none border-none"
          >
            <option value="">All Status</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </div>
      </div>

      {/* Users Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {loading
          ? Array(6)
            .fill(0)
            .map((_, i) => (
              <div
                key={i}
                className="bg-white p-6 rounded-2xl border border-slate-100 animate-pulse"
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-slate-100"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-slate-100 rounded w-3/4"></div>
                    <div className="h-3 bg-slate-100 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))
          : users.map((user) => (
            <div
              key={user.id}
              className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all group"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-slate-400 overflow-hidden">
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-xl font-bold text-slate-500">
                        {user.name.charAt(0)}
                      </span>
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 flex items-center gap-2">
                      {user.name}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">
                      Customer
                    </p>
                  </div>
                </div>
                <button className="p-2 text-slate-400 hover:bg-slate-50 rounded-lg transition-colors">
                  <MoreVertical size={18} />
                </button>
              </div>

              <div className="mt-6 space-y-3">
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <Mail size={16} className="text-slate-400" />
                  <span className="truncate">{user.email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <Phone size={16} className="text-slate-400" />
                  <span>{user.phone || "N/A"}</span>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${user.isActive ? "bg-emerald-500" : "bg-red-500"
                      }`}
                  ></div>
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    {user.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
                <button
                  onClick={() => handleBlockToggle(user)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${user.isActive
                    ? "text-red-600 bg-red-50 hover:bg-red-100"
                    : "text-emerald-600 bg-emerald-50 hover:bg-emerald-100"
                    }`}
                >
                  {user.isActive ? (
                    <>
                      <UserX size={14} />
                      Deactivate
                    </>
                  ) : (
                    <>
                      <UserCheck size={14} />
                      Activate
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
      </div>

      {/* Pagination */}
      {pagination && (
        <div className="bg-white px-6 py-4 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
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
            users
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
  );
};

export default Users;

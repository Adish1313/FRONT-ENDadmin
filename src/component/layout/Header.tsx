import React, { useState, useEffect } from "react";
import { Bell, User, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { apiCallGet } from "../../api/axios";
import { API_URLS } from "../../contants/constants";

const Header: React.FC = () => {
  const [admin, setAdmin] = useState<any>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const res = await apiCallGet(API_URLS.ADMIN_PROFILE);
      if (res?.data) {
        setAdmin(res.data);
      }
    };
    fetchProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("admin");
    navigate("/login");
  };

  return (
    <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40 px-8 flex items-center justify-between shadow-sm">
      {/* Search Bar Removed */}
      <div className="w-96"></div>

      {/* Right Actions */}
      <div className="flex items-center gap-6">
        {/* Notifications */}
        <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>

        {/* User Profile */}
        <div className="relative">
          <div
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-3 pl-6 border-l border-slate-200 group cursor-pointer"
          >
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-slate-900 leading-none">
                {admin?.name || "Admin"}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                {admin?.email || "admin@example.com"}
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <User size={20} />
            </div>
            <ChevronDown
              size={16}
              className={`text-slate-400 group-hover:text-slate-600 transition-transform duration-200 ${
                isDropdownOpen ? "rotate-180" : ""
              }`}
            />
          </div>

          {isDropdownOpen && (
            <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden py-1 animate-in fade-in slide-in-from-top-2 duration-200">
              <button
                onClick={() => {
                  setIsDropdownOpen(false);
                  navigate("/profile");
                }}
                className="w-full text-left px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition-colors flex items-center gap-2"
              >
                Change Password
              </button>
              <div className="h-px bg-slate-50 my-1"></div>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;

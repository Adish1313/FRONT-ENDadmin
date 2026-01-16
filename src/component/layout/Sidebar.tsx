import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Warehouse,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { ROUTES } from "../../contants/constants";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, setIsCollapsed }) => {
  const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard, path: ROUTES.DASHBOARD },
    { name: "Products", icon: Package, path: ROUTES.PRODUCTS },
    { name: "Orders", icon: ShoppingCart, path: ROUTES.ORDERS },
    { name: "Users", icon: Users, path: ROUTES.USERS },
    { name: "Inventory", icon: Warehouse, path: ROUTES.INVENTORY },
    { name: "Settings", icon: Settings, path: ROUTES.SETTINGS },
  ];

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-screen bg-slate-900 text-white transition-all duration-300 z-50 flex flex-col shadow-2xl",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      {/* Logo Section */}
      <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800">
        {!isCollapsed && (
          <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
            AdminPanel
          </span>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
        >
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 py-6 px-3 space-y-2 overflow-y-auto">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative",
                isActive
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              )
            }
          >
            <item.icon
              size={22}
              className={cn("shrink-0", isCollapsed ? "mx-auto" : "")}
            />
            {!isCollapsed && <span className="font-medium">{item.name}</span>}

            {/* Tooltip for collapsed state */}
            {isCollapsed && (
              <div className="absolute left-full ml-4 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-[60]">
                {item.name}
              </div>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Logout Section */}
      <div className="p-3 border-t border-slate-800">
        <button
          onClick={() => {
            localStorage.clear();
            window.location.href = ROUTES.LOGIN;
          }}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-500 transition-all duration-200 group relative",
            isCollapsed ? "justify-center" : ""
          )}
        >
          <LogOut size={22} className="shrink-0" />
          {!isCollapsed && <span className="font-medium">Logout</span>}

          {isCollapsed && (
            <div className="absolute left-full ml-4 px-2 py-1 bg-red-500 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-[60]">
              Logout
            </div>
          )}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;

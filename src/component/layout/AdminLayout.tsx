import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

      <div
        className={cn(
          "flex-1 flex flex-col transition-all duration-300",
          isCollapsed ? "ml-20" : "ml-64"
        )}
      >
        <Header />

        <main className="p-8 flex-1">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>

        <footer className="py-6 px-8 text-center text-slate-400 text-sm border-t border-slate-200">
          &copy; {new Date().getFullYear()} E-commerce Admin. All rights
          reserved.
        </footer>
      </div>
    </div>
  );
};

export default AdminLayout;

import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();

  const navigation = [
    { name: "Dashboard", href: "/", icon: "LayoutDashboard" },
    { name: "Active Requests", href: "/requests", icon: "FileText" },
    { name: "Completed", href: "/completed", icon: "CheckCircle" },
    { name: "Services", href: "/services", icon: "Shield" },
    { name: "Reports", href: "/reports", icon: "BarChart3" },
    { name: "Settings", href: "/settings", icon: "Settings" }
  ];

  const NavItem = ({ item }) => {
    const isActive = location.pathname === item.href;
    
    return (
<NavLink
        to={item.href}
        className={cn(
          "flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300 group relative overflow-hidden",
          isActive
            ? "bg-gradient-to-r from-red-500 via-red-600 to-red-700 text-white shadow-lg shadow-red-500/25 transform scale-105"
            : "text-gray-700 hover:bg-gradient-to-r hover:from-red-50 hover:via-pink-50 hover:to-red-100 hover:text-red-700 hover:shadow-md hover:transform hover:scale-102"
        )}
        onClick={() => onClose && onClose()}
      >
        <ApperIcon name={item.icon} className={cn("w-5 h-5 mr-3 transition-transform duration-200", isActive ? "text-white" : "group-hover:scale-110")} />
        <span className="font-medium">{item.name}</span>
        {isActive && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse" />
        )}
      </NavLink>
    );
  };

  // Desktop Sidebar
  const DesktopSidebar = () => (
<div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:border-r lg:border-gray-200/50 lg:bg-white/80 lg:backdrop-blur-md lg:pt-5 lg:shadow-lg">
      <div className="flex flex-col flex-1 min-h-0 px-4">
        <nav className="flex-1 space-y-2 pb-4">
          {navigation.map((item) => (
            <NavItem key={item.name} item={item} />
          ))}
        </nav>

        {/* Footer */}
        <div className="border-t border-gray-200 pt-4 pb-4">
          <div className="flex items-center px-4 py-2">
            <div className="p-2 bg-gradient-to-br from-red-50 to-red-100 rounded-lg">
              <ApperIcon name="User" className="w-5 h-5 text-red-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-700">Admin User</p>
              <p className="text-xs text-gray-500">admin@company.com</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Mobile Sidebar
  const MobileSidebar = () => (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-gray-900 bg-opacity-50 z-40"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "lg:hidden fixed inset-y-0 left-0 z-50 w-64 bg-white transform transition-transform duration-300 ease-in-out border-r border-gray-200",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-red-600 to-red-700 rounded-lg">
                <ApperIcon name="Shield" className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">ComplianceHub</h2>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              <ApperIcon name="X" className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => (
              <NavItem key={item.name} item={item} />
            ))}
          </nav>

          {/* Footer */}
          <div className="border-t border-gray-200 p-4">
            <div className="flex items-center">
              <div className="p-2 bg-gradient-to-br from-red-50 to-red-100 rounded-lg">
                <ApperIcon name="User" className="w-5 h-5 text-red-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700">Admin User</p>
                <p className="text-xs text-gray-500">admin@company.com</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <>
      <DesktopSidebar />
      <MobileSidebar />
    </>
  );
};

export default Sidebar;
import React, { useState } from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import SearchBar from "@/components/molecules/SearchBar";
import Badge from "@/components/atoms/Badge";

const Header = ({ onSearch, onToggleMobileMenu, totalPendingRequests = 0 }) => {
  const [searchValue, setSearchValue] = useState("");

  const handleSearch = (value) => {
    setSearchValue(value);
    onSearch(value);
  };

  return (
<header className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-40 shadow-sm">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Mobile menu button */}
<button
            onClick={onToggleMobileMenu}
            className="lg:hidden p-3 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200 transform hover:scale-105"
          >
            <ApperIcon name="Menu" className="w-6 h-6" />
          </button>

          {/* Logo and title */}
          <div className="flex items-center">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-red-600 to-red-700 rounded-lg">
                <ApperIcon name="Shield" className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent">
                  ComplianceHub
                </h1>
                <p className="text-sm text-gray-600">Verification Dashboard</p>
              </div>
            </div>
          </div>

          {/* Search bar - hidden on mobile */}
          <div className="hidden md:block flex-1 max-w-md mx-8">
            <SearchBar
              value={searchValue}
              onChange={handleSearch}
              placeholder="Search services..."
            />
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {/* Mobile search button */}
<button className="md:hidden p-3 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200 transform hover:scale-105">
              <ApperIcon name="Search" className="w-5 h-5" />
            </button>

            {/* Notifications */}
<div className="relative">
              <button className="p-3 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gradient-to-r hover:from-yellow-50 hover:to-orange-50 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200 transform hover:scale-105">
                <ApperIcon name="Bell" className="w-6 h-6" />
                {totalPendingRequests > 0 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1"
                  >
                    <Badge variant="red" className="px-2 py-1 text-xs min-w-[1.5rem] text-center shadow-lg ring-2 ring-white">
                      {totalPendingRequests > 99 ? "99+" : totalPendingRequests}
                    </Badge>
                  </motion.div>
                )}
              </button>
            </div>

            {/* Settings */}
<button className="p-3 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-violet-50 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200 transform hover:scale-105">
              <ApperIcon name="Settings" className="w-6 h-6" />
            </button>

            {/* Help */}
<button className="p-3 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200 transform hover:scale-105">
              <ApperIcon name="HelpCircle" className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
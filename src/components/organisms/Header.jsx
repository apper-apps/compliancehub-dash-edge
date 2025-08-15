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
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Mobile menu button */}
          <button
            onClick={onToggleMobileMenu}
            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500"
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
            <button className="md:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100">
              <ApperIcon name="Search" className="w-5 h-5" />
            </button>

            {/* Notifications */}
            <div className="relative">
              <button className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500">
                <ApperIcon name="Bell" className="w-6 h-6" />
                {totalPendingRequests > 0 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1"
                  >
                    <Badge variant="red" className="px-1.5 py-0.5 text-xs min-w-[1.25rem] text-center">
                      {totalPendingRequests > 99 ? "99+" : totalPendingRequests}
                    </Badge>
                  </motion.div>
                )}
              </button>
            </div>

            {/* Settings */}
            <button className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500">
              <ApperIcon name="Settings" className="w-6 h-6" />
            </button>

            {/* Help */}
            <button className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500">
              <ApperIcon name="HelpCircle" className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
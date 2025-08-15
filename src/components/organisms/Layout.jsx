import React, { useState } from "react";
import Header from "@/components/organisms/Header";
import Sidebar from "@/components/organisms/Sidebar";

const Layout = ({ children, onSearch, totalPendingRequests }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleToggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleCloseMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
<div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200">
      <Sidebar isOpen={isMobileMenuOpen} onClose={handleCloseMobileMenu} />
      
      <div className="lg:pl-64">
        <Header 
          onSearch={onSearch}
          onToggleMobileMenu={handleToggleMobileMenu}
          totalPendingRequests={totalPendingRequests}
        />
        
        <main className="py-8">
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-sm border border-white/20 p-6 min-h-[calc(100vh-8rem)]">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
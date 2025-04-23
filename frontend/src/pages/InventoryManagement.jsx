import React, { useState } from 'react';
import { Navbar } from '../components/Navbar';
import SideNavbar from '../components/SideNavbar';
import { InventoryManagerDashboard } from './InventoryManagerDashboard';
import { InventoryPage } from './InventoryPage';

const InventoryManagement = () => {
  const [activeComponent, setActiveComponent] = useState('dashboard');
  const [isSidebarHovered, setIsSidebarHovered] = useState(false);

  const renderComponent = () => {
    switch (activeComponent) {
      case 'dashboard':
        return <InventoryManagerDashboard />;
      case 'inventory':
        return <InventoryPage />;
      default:
        return <InventoryManagerDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Fixed Navbar */}
      <div className="fixed top-0 left-0 right-0 z-50 h-16"> {/* Explicit height */}
      <Navbar isSidebarHovered={isSidebarHovered} />

      </div>

      {/* Sidebar - Fixed below navbar */}
      <div className="fixed left-0 z-40 h-[calc(100vh-64px)] top-16"> {/* Positioned below navbar */}
        <SideNavbar 
          setActiveComponent={setActiveComponent} 
          onHoverChange={setIsSidebarHovered}
        />
      </div>

      {/* Main Content */}
      <main 
        className={`transition-all duration-300 ${
          isSidebarHovered ? 'ml-64' : 'ml-16'
        } w-full pt-16`}  // pt-16 matches navbar height
      >
        <div className="p-8">
          <div className={`max-w-7xl mx-auto ${
            isSidebarHovered ? 'pl-4 pr-8' : 'px-8'
          }`}>
            {renderComponent()}
          </div>
        </div>
      </main>
    </div>
  );
};

export default InventoryManagement; 
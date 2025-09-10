import React, { useState } from "react";
import { Outlet } from "react-router";
import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";
import { useLocation } from "react-router";
import { useTheme } from "@/contexts/ThemeContext";

// Responsive Layout: switches between Sidebar (desktop) and Navbar+Drawer (mobile)
const Layout: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const location = useLocation();
  const { theme } = useTheme();

  const handleDrawerToggle = () => setDrawerOpen((open) => !open);
  const toggleSidebar = () => setSidebarCollapsed((collapsed) => !collapsed);

  return (
    <div className={`flex min-h-screen ${theme === 'dark' ? 'dark' : ''}`}>
      <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 dark:from-slate-900 dark:to-slate-800 w-full">
        {/* Sidebar: visible on md+ screens when not collapsed */}
        {!sidebarCollapsed && (
          <Sidebar
            className="hidden md:flex fixed top-0 left-0 h-screen transition-all duration-300 z-30"
            variant="permanent"
            drawerOpen={drawerOpen}
            onDrawerClose={() => setDrawerOpen(false)}
            collapsed={sidebarCollapsed}
            onToggleCollapse={toggleSidebar}
          />
        )}
        
        {/* Mobile Sidebar Drawer */}
        <Sidebar
          className={`fixed inset-0 z-40 md:hidden transition-all duration-300 ease-in-out ${
            drawerOpen ? "translate-x-0" : "-translate-x-full"
          }`}
          variant="drawer"
          drawerOpen={drawerOpen}
          onDrawerClose={() => setDrawerOpen(false)}
          collapsed={false}
        />
        
        {/* Main content container */}
        <div className="flex-1 flex flex-col min-w-0 w-full">
          {/* Navbar: visible on mobile */}
          <Navbar
            className="md:hidden"
            onDrawerToggle={handleDrawerToggle}
            currentPath={location.pathname}
            onSidebarToggle={toggleSidebar}
            sidebarCollapsed={sidebarCollapsed}
          />
          
          {/* Desktop Navbar/Topbar */}
          <Navbar
            className="hidden md:flex"
            onDrawerToggle={handleDrawerToggle}
            currentPath={location.pathname}
            onSidebarToggle={toggleSidebar}
            sidebarCollapsed={sidebarCollapsed}
          />
          
          {/* Main content area - Add left padding when sidebar is visible */}
          <main className={`flex-1 transition-all duration-300 ${
            !sidebarCollapsed ? "md:pl-72" : ""
          }`}>
            <div className="mx-auto w-full">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Layout;
import React from "react";
import { Menu, Bell, User, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavbarProps {
  className?: string;
  onDrawerToggle: () => void;
  currentPath?: string;
  onSidebarToggle?: () => void;
  sidebarCollapsed?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ 
  className = "", 
  onDrawerToggle, 
  currentPath, 
  onSidebarToggle,
  sidebarCollapsed = false 
}) => {
  // Function to format page title from path
  const formatPageTitle = (path: string | undefined) => {
    if (!path || path === '/') return 'Dashboard';
    
    // Remove leading slash and capitalize first letter
    const basePath = path.replace('/', '');
    return basePath.charAt(0).toUpperCase() + basePath.slice(1);
  };

  const pageTitle = formatPageTitle(currentPath);

  return (
    <nav
      className={cn(
        "sticky top-0 z-40 flex items-center justify-between px-6 py-4 bg-white/80 backdrop-blur-md border-b border-slate-200/60 shadow-sm dark:bg-slate-900/80 dark:border-slate-700/60",
        // Add left margin when sidebar is visible on desktop
        !sidebarCollapsed && "md:ml-72",
        "transition-all duration-300", // Smooth transition
        className
      )}
      aria-label="Main navigation"
    >
      <div className="flex items-center gap-4">
        {/* Mobile menu button - always visible on mobile */}
        <button
          aria-label="Open sidebar menu"
          onClick={onDrawerToggle}
          className="p-2 rounded-lg hover:bg-slate-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:hover:bg-slate-800 dark:focus:ring-offset-slate-900 md:hidden"
        >
          <Menu className="w-6 h-6 text-slate-700 dark:text-slate-300" />
        </button>
        
        {/* Desktop sidebar toggle - Only show when sidebar is collapsed */}
        {onSidebarToggle && sidebarCollapsed && (
          <button
            onClick={onSidebarToggle}
            className="hidden p-2 rounded-lg hover:bg-slate-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:hover:bg-slate-800 dark:focus:ring-offset-slate-900 md:flex"
            aria-label="Expand sidebar"
          >
            <ChevronRight className="w-5 h-5 text-slate-700 dark:text-slate-300" />
          </button>
        )}

        {/* Page title - Visible on mobile and when sidebar is collapsed on desktop */}
        <div className={cn(
          "md:hidden", // Show on mobile only
          sidebarCollapsed && "md:block" // Also show on desktop when sidebar is collapsed
        )}>
          <span className="text-lg font-semibold text-slate-800 dark:text-slate-200">
            {pageTitle}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Current page title - Visible on desktop when sidebar is open */}
        <div className={cn(
          "hidden transition-opacity duration-300",
          !sidebarCollapsed && "md:block" // Show on desktop when sidebar is open
        )}>
          <span className="text-sm text-slate-600 font-medium dark:text-slate-400">
            {pageTitle}
          </span>
        </div>
        
        {/* Notification bell */}
        <button 
          className="p-2 rounded-lg hover:bg-slate-100 transition-colors duration-200 dark:hover:bg-slate-800"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5 text-slate-600 dark:text-slate-400" />
        </button>
        
        {/* User avatar */}
        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
          <User className="w-4 h-4 text-white" />
        </div>
      </div>
    </nav>
  );
};

export { Navbar };
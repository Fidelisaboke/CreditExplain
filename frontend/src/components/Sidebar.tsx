import React from "react";
import { NavLink } from "react-router";
import { ROUTES } from "@/routes/paths";
import { Shield, X, ChevronLeft, Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/contexts/ThemeContext";

interface SidebarProps {
  className?: string;
  variant?: "permanent" | "drawer";
  drawerOpen?: boolean;
  onDrawerClose?: () => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  className = "",
  variant = "permanent",
  drawerOpen = false,
  onDrawerClose,
  onToggleCollapse,
}) => {
  const { theme, toggleTheme } = useTheme();

  const drawerOverlay = variant === "drawer" && drawerOpen ? (
    <div
      className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 animate-in fade-in duration-300"
      aria-label="Sidebar overlay"
      tabIndex={-1}
      onClick={onDrawerClose}
    />
  ) : null;

  return (
    <>
      {drawerOverlay}
      <aside
        className={cn(
          "overflow-hidden p-4 flex flex-col min-h-screen bg-white/95 backdrop-blur-md border-r border-slate-200/60 shadow-xl z-40 transition-all duration-300 dark:bg-slate-900/95 dark:border-slate-700/60",
          variant === "drawer" && "fixed inset-y-0 left-0",
          "w-72", // Fixed width, no collapsed width
          className
        )}
        aria-label="Sidebar navigation"
      >
        {/* Header */}
        <div className="flex-shrink-0">
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-purple-400">
              CreditExplain
            </span>
          </div>
          {variant === "drawer" && (
            <button
              onClick={onDrawerClose}
              className="p-1 rounded-lg hover:bg-slate-100 transition-colors dark:hover:bg-slate-800"
            >
              <X className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            </button>
          )}
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto py-2 space-y-2 px-2">
          {ROUTES.map(({ path, label, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 p-4 rounded-xl transition-all duration-200 font-medium group",
                  "hover:bg-blue-50 hover:text-blue-700 hover:shadow-sm dark:hover:bg-blue-900/30 dark:hover:text-blue-300",
                  "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900",
                  isActive
                    ? "bg-blue-100 text-blue-700 shadow-sm border-l-4 border-blue-600 dark:bg-blue-900/40 dark:text-blue-300 dark:border-blue-400"
                    : "text-slate-600 dark:text-slate-400"
                )
              }
              aria-label={label}
              onClick={variant === "drawer" ? onDrawerClose : undefined}
            >
              <Icon className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
              <span className="text-sm">{label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Footer with theme toggle and collapse button */}
        <div className="p-4 flex-shrink-0 mt-auto border-t border-slate-200/60 dark:border-slate-700/60">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className={cn(
              "flex items-center w-full gap-3 p-3 rounded-xl transition-all duration-200 font-medium",
              "hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-300",
              "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
            )}
            aria-label="Toggle theme"
          >
            {theme === 'light' ? (
              <Moon className="w-5 h-5" />
            ) : (
              <Sun className="w-5 h-5" />
            )}
            <span className="text-sm">
              {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
            </span>
          </button>

          {/* Collapse Toggle (desktop only) */}
          {variant === "permanent" && (
            <button
              onClick={onToggleCollapse}
              className={cn(
                "flex items-center w-full gap-3 p-3 rounded-xl transition-all duration-200 font-medium mt-2",
                "hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-300",
                "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
              )}
              aria-label="Collapse sidebar"
            >
              <ChevronLeft className="w-5 h-5" />
              <span className="text-sm">Collapse</span>
            </button>
          )}

          <div className="text-xs text-slate-500 text-center mt-4 dark:text-slate-500">
            v1.0.0 • Secure Compliance Platform
          </div>
        </div>
      </aside>
    </>
  );
};

export { Sidebar };
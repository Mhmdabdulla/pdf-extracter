import { Link, useLocation, Outlet } from "react-router-dom";
import { FolderKanban, LogOut, FileDigit,X,Menu } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { cn } from "@/lib/utils";
import { useState } from "react";

export const Layout = () => {
  const { pathname } = useLocation();
  const { user, logout } = useAuthStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = async () => {
    logout();
  };

   const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const navItems = [
    {
      to: "/extract",
      icon: FileDigit,
      label: "Extract",
      isActive: pathname.includes("extract"),
    },
    {
      to: "/documents",
      icon: FolderKanban,
      label: "Documents",
      isActive: pathname.includes("documents"),
    },
  ];

  return (

    
    <div className="flex h-screen overflow-hidden bg-[#F4F7FB]">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-20 bg-[#001433] text-white flex flex-col items-center py-6 shadow-xl transition-transform duration-300 lg:relative lg:translate-x-0 shrink-0",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="mb-8 flex items-center justify-between w-full px-4 lg:justify-center lg:px-0">
          {/* Mock Logo */}
          <div className="grid grid-cols-2 gap-1 w-8 h-8">
            <div className="bg-violet-500 rounded-sm"></div>
            <div className="bg-pink-500 rounded-sm"></div>
            <div className="bg-blue-500 rounded-sm"></div>
            <div className="bg-green-500 rounded-sm"></div>
          </div>
          <button className="lg:hidden text-white hover:text-gray-300" onClick={toggleSidebar}>
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="flex-1 w-full flex flex-col items-center space-y-2 mt-4">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setIsSidebarOpen(false)}
              className={cn(
                "flex flex-col items-center w-full py-4 transition-colors relative group",
                item.isActive ? "bg-[#1A56DB]" : "hover:bg-white/10"
              )}
            >
              {item.isActive && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand-yellow"></div>
              )}
              <item.icon className="w-6 h-6 mb-1" />
              <span className="text-[10px] px-1 text-center truncate">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="mt-auto w-full">
          <button
            onClick={handleLogout}
            className="flex flex-col items-center w-full py-4 hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
          >
            <LogOut className="w-6 h-6 mb-1" />
            <span className="text-[10px]">Account</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative">

        
        {/* Header */}
        <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 md:px-8 shrink-0">
          <div className="flex items-center gap-4">
            <button className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded" onClick={toggleSidebar}>
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-lg md:text-xl font-bold text-gray-800 truncate">
              {pathname.includes("extract") ? "Extract Pages" : "Documents"}
            </h1>
          </div>
          <div className="flex items-center gap-2 md:gap-4">
             
             <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0">
                {user?.name?.substring(0, 2).toUpperCase() || 'A'}
             </div>
          </div>
        </header>

        {/* Dynamic Content */}
        <div className="flex-1 overflow-auto bg-[#F4F7FB]">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

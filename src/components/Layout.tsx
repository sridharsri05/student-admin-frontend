import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import { Background3D } from "./Background3D";
import { AppBreadcrumbs } from "./ui/AppBreadcrumbs";
import { useAuth } from "@/contexts/AuthContext";

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <Background3D />
      
      <div className="relative z-10 flex">
        <Sidebar 
          collapsed={sidebarCollapsed} 
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
        />
        
        {(() => {
          const desktopClass = sidebarCollapsed ? 'md:ml-16' : 'md:ml-64';
          return (
            <div className={`flex-1 transition-all duration-300 ml-0 ${desktopClass} min-h-screen`}>
              <TopBar />
              <main className="p-3 sm:p-4 lg:p-6">
                <AppBreadcrumbs />
                <div className="max-w-full overflow-x-hidden">
                  {children}
                </div>
              </main>
            </div>
          );
        })()}
      </div>
    </div>
  );
};

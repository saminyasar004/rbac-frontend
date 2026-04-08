"use client";

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { Menu, X, LogOut, LayoutDashboard, Users, ShieldCheck, Key, FileText, CheckCircle, BarChart3, History, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sidebar } from '@/components/layout/Sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAuthenticated, checkAuth } = useAuthStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    let isMounted = true;
    
    const initAuth = async () => {
      try {
        await checkAuth();
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        if (isMounted) setIsChecking(false);
      }
    };

    initAuth();
    
    return () => {
      isMounted = false;
    };
  }, [checkAuth]);

  useEffect(() => {
    if (!isChecking && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isChecking, router]);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  if (isChecking || !isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest animate-pulse">Initializing System...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex overflow-x-hidden">
      {/* Mobile Sidebar Backdrop */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300" 
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar Wrapper */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-auto
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <Sidebar onClose={closeSidebar} />
      </div>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <Header onMenuClick={toggleSidebar} />
        <div className="p-4 md:p-6 lg:p-8 flex-1 overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
}

function Header({ onMenuClick }: { onMenuClick: () => void }) {
  const { user } = useAuthStore();
  const pathname = usePathname();
  
  // Format page title from pathname
  const pageTitle = pathname?.split('/').pop()?.replace(/-/g, ' ') || 'Dashboard';
  const displayTitle = pageTitle === 'dashboard' ? 'Welcome back' : pageTitle;

  return (
    <header className="sticky top-0 bg-white/80 backdrop-blur-md z-30 border-b flex h-16 shrink-0 items-center gap-2 px-4 md:px-6">
      <Button 
        variant="ghost" 
        size="icon" 
        className="lg:hidden shrink-0 h-10 w-10 text-gray-500" 
        onClick={onMenuClick}
      >
        <Menu size={22} strokeWidth={2.5} />
      </Button>
      
      <div className="flex flex-1 items-center justify-between min-w-0">
        <div className="min-w-0">
          <h1 className="text-lg font-bold text-gray-900 capitalize leading-tight truncate">
            {displayTitle === 'Welcome back' ? `Good morning, ${user?.firstName}!` : displayTitle}
          </h1>
          <p className="text-xs text-gray-500 font-medium truncate">
            {displayTitle === 'Welcome back' ? "Here's what's happening today." : `Manage your ${displayTitle} activities`}
          </p>
        </div>
        
        <div className="hidden sm:flex items-center gap-3 bg-gray-50/80 px-3 py-1.5 rounded-full border border-gray-100">
           <div className="text-right">
            <p className="text-[11px] font-bold text-gray-800 leading-none">
              {new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
            </p>
            <p className="text-[10px] font-medium text-gray-400 leading-none mt-1 uppercase">
              {new Date().toLocaleDateString('en-US', { weekday: 'short' })}
            </p>
          </div>
          <div className="w-px h-6 bg-gray-200"></div>
          <p className="text-sm font-bold text-primary tabular-nums">
            {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
      </div>
    </header>
  );
}
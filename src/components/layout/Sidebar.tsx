"use client";

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { 
  LayoutDashboard, 
  Users, 
  ShieldCheck, 
  Key, 
  FileText, 
  CheckCircle, 
  BarChart3, 
  History, 
  Settings, 
  LogOut,
  X,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface SidebarProps {
  className?: string;
  onClose?: () => void;
}

export function Sidebar({ className, onClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, hasPermission, logout } = useAuthStore();

  const menuItems = [
    {
      name: 'Dashboard',
      icon: LayoutDashboard,
      href: '/dashboard',
      permission: 'dashboard.view',
    },
    {
      name: 'Users',
      icon: Users,
      href: '/users',
      permission: 'users.view',
    },
    {
      name: 'Roles',
      icon: ShieldCheck,
      href: '/roles',
      permission: 'roles.view',
    },
    {
      name: 'Permissions',
      icon: Key,
      href: '/permissions',
      permission: 'permissions.view',
    },
    {
      name: 'Leads',
      icon: FileText,
      href: '/leads',
      permission: 'leads.view',
    },
    {
      name: 'Tasks',
      icon: CheckCircle,
      href: '/tasks',
      permission: 'tasks.view',
    },
    {
      name: 'Reports',
      icon: BarChart3,
      href: '/reports',
      permission: 'reports.view',
    },
    {
      name: 'Audit Logs',
      icon: History,
      href: '/audit-logs',
      permission: 'audit_logs.view',
    },
    {
      name: 'Customer Portal',
      icon: LayoutDashboard,
      href: '/customer-portal',
      permission: 'dashboard.view',
    },
    {
      name: 'Settings',
      icon: Settings,
      href: '/settings',
      permission: 'dashboard.view',
    },
  ];

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  return (
    <div className={cn("flex flex-col h-full bg-white border-r", className)}>
      {/* Sidebar Header */}
      <div className="flex items-center justify-between p-6 h-16 shrink-0 border-b">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-lg shadow-primary/20">
            <span className="text-white font-bold text-lg italic">O</span>
          </div>
          <span className="text-lg font-bold text-gray-900 tracking-tight">Oblio</span>
        </div>
        {onClose && (
          <Button variant="ghost" size="icon" onClick={onClose} className="lg:hidden rounded-full">
            <X size={18} />
          </Button>
        )}
      </div>

      {/* User Quick Info */}
      <div className="p-4 mx-3 my-4 bg-gray-50 rounded-xl border border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-white border border-gray-200 flex items-center justify-center text-primary font-bold shadow-sm">
            {user?.firstName?.[0]}{user?.lastName?.[0]}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-gray-900 truncate">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">{user?.role}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 px-3 space-y-1 overflow-y-auto overflow-x-hidden py-2 custom-scrollbar">
        {menuItems.map((item) => {
          if (!hasPermission(item.permission)) return null;
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={(e) => {
                if (window.innerWidth < 1024) onClose?.();
              }}
              className={cn(
                "group flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-200",
                isActive 
                  ? "bg-primary/10 text-primary" 
                  : "text-gray-500 hover:bg-orange-50/50 hover:text-primary"
              )}
            >
              <div className="flex items-center gap-3">
                <Icon size={18} className={cn(
                  "transition-colors",
                  isActive ? "text-primary" : "text-gray-400 group-hover:text-primary"
                )} />
                <span className="text-sm font-bold tracking-tight">{item.name}</span>
              </div>
              {isActive && <div className="w-1.5 h-1.5 rounded-full bg-primary" />}
            </Link>
          );
        })}
      </div>

      {/* Footer / Logout */}
      <div className="p-3 border-t mt-auto">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 text-gray-500 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all font-bold group"
        >
          <LogOut size={18} className="text-gray-400 group-hover:text-red-600 transition-colors" />
          <span className="text-sm tracking-tight">Logout</span>
        </button>
      </div>
    </div>
  );
}

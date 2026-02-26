"use client";
import { Bell, ChevronDown, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";
import type { UserRole } from "@/lib/mgl-data";
import { mockNotifications } from "@/lib/mgl-data";
import { cn } from "@/lib/utils";

interface MGLHeaderProps {
  role: UserRole;
  userName: string;
  onLogout: () => void;
  onMenuToggle?: () => void;
  sidebarOpen?: boolean;
}

export default function MGLHeader({ role, userName, onLogout, onMenuToggle, sidebarOpen }: MGLHeaderProps) {
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const roleNotifs = mockNotifications.filter(
    (n) => n.targetRole === role || n.targetRole === "all"
  );
  const unread = roleNotifs.filter((n) => !n.read).length;

  const roleLabel = role === "mic" ? "Marketing In-Charge (MIC)" : role === "zic" ? "Zone In-Charge (ZIC)" : "Fleet Operator";
  const roleBadgeColor = role === "mic" ? "bg-blue-100 text-blue-700" : role === "zic" ? "bg-amber-100 text-amber-700" : "bg-green-100 text-green-700";

  return (
    <header className="h-14 border-b border-border bg-card flex items-center justify-between px-4 gap-4 shrink-0 z-30 relative">
      {/* Left */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-1.5 rounded-md hover:bg-muted transition-colors"
          aria-label="Toggle sidebar"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
        <span className="text-sm font-medium text-muted-foreground hidden sm:block">
          {roleLabel}
        </span>
        <span className={cn("text-xs font-semibold px-2 py-0.5 rounded-full hidden sm:block", roleBadgeColor)}>
          {role.toUpperCase()}
        </span>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false); }}
            className="relative p-2 rounded-full hover:bg-muted transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5 text-foreground" />
            {unread > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-destructive text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {unread}
              </span>
            )}
          </button>
          {notifOpen && (
            <div className="absolute right-0 top-10 w-80 bg-card border border-border rounded-xl shadow-xl z-50">
              <div className="p-3 border-b border-border flex items-center justify-between">
                <span className="font-semibold text-sm">Notifications</span>
                <span className="text-xs text-muted-foreground">{unread} unread</span>
              </div>
              <div className="max-h-72 overflow-y-auto">
                {roleNotifs.slice(0, 6).map((n) => (
                  <div key={n.id} className={cn("p-3 border-b border-border last:border-0 hover:bg-muted/50 cursor-pointer transition-colors", !n.read && "bg-primary/5")}>
                    <div className="flex items-start gap-2">
                      <span className={cn("w-2 h-2 rounded-full mt-1.5 shrink-0",
                        n.type === "success" ? "bg-green-500" : n.type === "warning" ? "bg-amber-500" : n.type === "error" ? "bg-red-500" : "bg-blue-500"
                      )} />
                      <div>
                        <p className="text-sm font-medium">{n.title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{n.message}</p>
                        <p className="text-xs text-muted-foreground mt-1">{n.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Profile */}
        <div className="relative">
          <button
            onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); }}
            className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-muted transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-bold">
              {userName.charAt(0).toUpperCase()}
            </div>
            <span className="text-sm font-medium hidden sm:block">{userName}</span>
            <ChevronDown className="w-4 h-4 text-muted-foreground hidden sm:block" />
          </button>
          {profileOpen && (
            <div className="absolute right-0 top-11 w-44 bg-card border border-border rounded-xl shadow-xl z-50">
              <div className="p-3 border-b border-border">
                <p className="text-sm font-medium">{userName}</p>
                <p className="text-xs text-muted-foreground">{roleLabel}</p>
              </div>
              <button
                onClick={onLogout}
                className="w-full flex items-center gap-2 p-3 text-sm text-destructive hover:bg-destructive/10 transition-colors rounded-b-xl"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

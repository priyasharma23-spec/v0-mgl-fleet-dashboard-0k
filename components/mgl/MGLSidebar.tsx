"use client";
import {
  LayoutDashboard, Users, Truck, CreditCard, CheckSquare, Clock,
  BarChart2, Settings, HelpCircle, LogOut, ChevronRight, FileText,
  MapPin, Bell, Package, ShieldCheck, UserPlus, Wallet, Gift, 
  ArrowRightLeft, FileSpreadsheet, Activity, Building2
} from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import type { UserRole } from "@/lib/mgl-data";

interface NavItem {
  icon: React.ElementType;
  label: string;
  view: string;
  badge?: number;
}

const micNavItems: NavItem[] = [
  { icon: LayoutDashboard, label: "Dashboard", view: "mic-dashboard" },
  { icon: UserPlus, label: "Register FO", view: "mic-register-fo" },
  { icon: Users, label: "Fleet Operators", view: "mic-operators" },
  { icon: CheckSquare, label: "L1 Approvals", view: "mic-l1-queue", badge: 2 },
  { icon: FileText, label: "MoU Management", view: "mic-mou" },
  { icon: BarChart2, label: "Reports", view: "mic-reports" },
];

const zicNavItems: NavItem[] = [
  { icon: LayoutDashboard, label: "Dashboard", view: "zic-dashboard" },
  { icon: ShieldCheck, label: "L2 Approvals", view: "zic-l2-queue", badge: 1 },
  { icon: Truck, label: "Vehicles", view: "zic-vehicles" },
  { icon: CreditCard, label: "Card Orders", view: "zic-cards" },
  { icon: BarChart2, label: "Reports", view: "zic-reports" },
];

const foNavItems: NavItem[] = [
  { icon: LayoutDashboard, label: "Dashboard", view: "fo-dashboard" },
  { icon: Wallet, label: "Transactions", view: "fo-wallet" },
  { icon: CreditCard, label: "My Cards", view: "fo-cards" },
  { icon: Gift, label: "Fund Management", view: "fo-funds" },
  { icon: Truck, label: "My Vehicles", view: "fo-vehicles" },
  { icon: UserPlus, label: "Add Vehicle", view: "fo-add-vehicle" },
  { icon: MapPin, label: "Card Delivery", view: "fo-delivery" },
  { icon: Bell, label: "Notifications", view: "fo-notifications" },
];

const adminNavItems: NavItem[] = [
  { icon: LayoutDashboard, label: "Dashboard", view: "admin-dashboard" },
  { icon: Building2, label: "Fleet Operators", view: "admin-fo-directory" },
  { icon: Users, label: "User Management", view: "admin-users" },
  { icon: CreditCard, label: "Cards & Wallets", view: "admin-cards" },
  { icon: Gift, label: "Incentives & Offers", view: "admin-incentives" },
  { icon: ArrowRightLeft, label: "Transactions", view: "admin-transactions", badge: 3 },
  { icon: FileSpreadsheet, label: "Settlements", view: "admin-settlements" },
  { icon: FileSpreadsheet, label: "MIS & Reports", view: "admin-reports" },
  { icon: Activity, label: "Analytics", view: "admin-analytics" },
  { icon: Settings, label: "Configuration", view: "admin-config" },
];

interface MGLSidebarProps {
  role: UserRole;
  activeView: string;
  onViewChange: (view: string) => void;
  open: boolean;
  onClose: () => void;
  department?: string;
}

export default function MGLSidebar({ role, activeView, onViewChange, open, onClose, department }: MGLSidebarProps) {
  let navItems = role === "mgl-admin" ? adminNavItems : role === "mic" ? micNavItems : role === "zic" ? zicNavItems : foNavItems;
  
  if (role === "mgl-admin" && department && department !== "admin") {
    const financeItems = ["Dashboard", "Transactions", "Settlements", "Cards & Wallets", "MIS & Reports"];
    const marketingItems = ["Dashboard", "Fleet Operators", "Transactions", "Settlements", "Cards & Wallets", "Incentives & Offers", "MIS & Reports", "Analytics"];
    const allowedItems = department === "finance" ? financeItems : department === "marketing" ? marketingItems : [];
    
    if (allowedItems.length > 0) {
      navItems = adminNavItems.filter(item => allowedItems.includes(item.label));
    }
  }
  
  const roleLabel = role === "mgl-admin" ? "Admin Portal" : role === "mic" ? "MIC Portal" : role === "zic" ? "ZIC Portal" : "Fleet Portal";

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      {/* Sidebar */}
      <aside className={cn(
        "fixed left-0 top-0 h-full w-60 bg-sidebar flex flex-col z-50 transition-transform duration-200",
        "lg:static lg:translate-x-0 lg:z-auto lg:shrink-0",
        open ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Logo */}
        <div className="h-14 flex items-center gap-3 px-4 border-b border-sidebar-border shrink-0">
          <div className="w-8 h-8 rounded-full overflow-hidden bg-white flex items-center justify-center shrink-0">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-agxPFremWBWY82BTBrfdO5RnOzVori.png"
              alt="MGL Logo"
              width={32}
              height={32}
              className="object-contain"
            />
          </div>
          <div>
            <p className="text-sidebar-foreground font-bold text-sm leading-tight">MGL Fleet</p>
            <p className="text-sidebar-foreground/60 text-[10px]">{roleLabel}</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          <p className="text-sidebar-foreground/40 text-[10px] font-semibold uppercase tracking-widest px-2 py-2">Main Menu</p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.view;
            return (
              <button
                key={item.view}
                onClick={() => { onViewChange(item.view); onClose(); }}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150 group",
                  isActive
                    ? "bg-primary text-primary-foreground font-semibold"
                    : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                )}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="flex-1 text-left">{item.label}</span>
                {item.badge ? (
                  <span className={cn("text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center",
                    isActive ? "bg-white/25 text-white" : "bg-primary/20 text-primary"
                  )}>
                    {item.badge}
                  </span>
                ) : (
                  <ChevronRight className={cn("w-3 h-3 transition-opacity", isActive ? "opacity-80" : "opacity-0 group-hover:opacity-40")} />
                )}
              </button>
            );
          })}

          <p className="text-sidebar-foreground/40 text-[10px] font-semibold uppercase tracking-widest px-2 py-2 mt-4">General</p>
          {[
            { icon: Settings, label: "Settings", view: "settings" },
            { icon: HelpCircle, label: "Help & Support", view: "help" },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.view}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-all"
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="flex-1 text-left">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Bottom brand */}
        <div className="p-3 border-t border-sidebar-border">
          <div className="flex items-center gap-2 px-2">
            <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center">
              <Package className="w-3.5 h-3.5 text-primary" />
            </div>
            <div>
              <p className="text-sidebar-foreground/80 text-xs font-medium">Mahanagar Gas Ltd.</p>
              <p className="text-sidebar-foreground/40 text-[10px]">Fleet Platform v2.1</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

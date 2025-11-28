import { Heart, LayoutDashboard, Users, UserCog, X } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const menuItems = [
  { icon: LayoutDashboard, label: "DASHBOARD", path: "/" },
  { icon: Users, label: "USERS", path: "/users" },
  { icon: UserCog, label: "CONSULTANTS", path: "/consultants" },
];

interface AdminSidebarProps {
  onClose?: () => void;
}

export function AdminSidebar({ onClose }: AdminSidebarProps) {
  const location = useLocation();

  return (
    <aside className="w-56 bg-sidebar min-h-screen flex flex-col shrink-0">
      {/* Header with Logo and Close button */}
      <div className="p-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 bg-sidebar-foreground/20 rounded-full flex items-center justify-center">
            <Heart className="w-5 h-5 text-sidebar-foreground" fill="currentColor" />
          </div>
          <span className="text-sidebar-foreground font-semibold text-sm tracking-wide leading-tight">
            Love & Ring<br />Admin
          </span>
        </div>
        {onClose && (
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden text-sidebar-foreground hover:bg-sidebar-foreground/10"
            onClick={onClose}
          >
            <X className="w-5 h-5" />
          </Button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-medium transition-all duration-200",
                isActive
                  ? "bg-sidebar-foreground/20 text-sidebar-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-foreground/10 hover:text-sidebar-foreground"
              )}
            >
              <item.icon className="w-4 h-4" />
              <span className="tracking-wide">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}

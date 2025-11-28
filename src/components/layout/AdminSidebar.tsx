import { Heart, LayoutDashboard, Users, Ticket, Globe, CheckCircle, CreditCard, MessageSquare } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const menuItems = [
  { icon: LayoutDashboard, label: "DASHBOARD", path: "/" },
  { icon: Users, label: "USERS", path: "/users" },
  { icon: Ticket, label: "SUPPORT TICKETS", path: "/support" },
  { icon: Globe, label: "DEMOGRAPHICS", path: "/demographics" },
  { icon: CheckCircle, label: "APPROVALS", path: "/approvals" },
  { icon: CreditCard, label: "PAYMENT", path: "/payment" },
  { icon: MessageSquare, label: "CONTACT", path: "/contact" },
];

export function AdminSidebar() {
  const location = useLocation();

  return (
    <aside className="w-56 bg-sidebar min-h-screen flex flex-col">
      {/* Logo */}
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 bg-sidebar-foreground/20 rounded-full flex items-center justify-center">
          <Heart className="w-5 h-5 text-sidebar-foreground" fill="currentColor" />
        </div>
        <span className="text-sidebar-foreground font-semibold text-lg tracking-wide">
          MatchMate
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-sidebar-foreground/20 text-sidebar-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-foreground/10 hover:text-sidebar-foreground"
              )}
            >
              <item.icon className="w-5 h-5" />
              <span className="tracking-wide">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}

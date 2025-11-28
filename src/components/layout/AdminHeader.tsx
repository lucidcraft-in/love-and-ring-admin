import { Search, Bell, Gift } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export function AdminHeader() {
  return (
    <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6">
      {/* Search */}
      <div className="relative w-80">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search for location..."
          className="pl-10 bg-muted/50 border-0 focus-visible:ring-1 focus-visible:ring-primary/30"
        />
      </div>

      {/* Right section */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="text-primary hover:bg-primary/10">
          <Heart className="w-5 h-5" fill="currentColor" />
        </Button>
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground hover:bg-muted">
          <Gift className="w-5 h-5" />
        </Button>
        <Avatar className="w-9 h-9 border-2 border-primary/20">
          <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face" />
          <AvatarFallback className="bg-primary text-primary-foreground text-sm">JD</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}

function Heart(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  );
}

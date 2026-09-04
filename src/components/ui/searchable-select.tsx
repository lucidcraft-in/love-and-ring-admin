import * as React from "react";
import { useState, useRef, useEffect } from "react";
import { Search, Check, ChevronDown, Plus } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export interface Option {
  _id: string;
  name: string;
}

export interface SearchableSelectProps {
  options: Option[];
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  loading?: boolean;
  disabled?: boolean;
  allowCustom?: boolean;
  customLabel?: string;
  isCustomSelected?: boolean;
  onCustomSelect?: () => void;
  className?: string;
}

export const SearchableSelect: React.FC<SearchableSelectProps> = ({
  options,
  value,
  onValueChange,
  placeholder = "Select option...",
  searchPlaceholder = "Search...",
  loading = false,
  disabled = false,
  allowCustom = true,
  customLabel = "+ Add Custom",
  isCustomSelected = false,
  onCustomSelect,
  className,
}) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when popover opens
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setSearch("");
    }
  }, [open]);

  // Find label for display
  const selectedOption = options.find(
    (opt) => opt._id === value || opt.name.toLowerCase() === value?.toLowerCase()
  );

  let displayLabel = placeholder;
  if (isCustomSelected || value === "OTHER") {
    displayLabel = value && value !== "OTHER" ? value : "Custom Profession";
  } else if (selectedOption) {
    displayLabel = selectedOption.name;
  } else if (value && value !== "OTHER") {
    displayLabel = value;
  }

  const filteredOptions = options.filter((opt) =>
    opt.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild disabled={disabled || loading}>
        <button
          type="button"
          className={cn(
            "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-left",
            className
          )}
        >
          <span className="truncate">
            {loading ? "Loading options..." : displayLabel}
          </span>
          <ChevronDown className="h-4 w-4 shrink-0 opacity-50 ml-2" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="p-0 w-[var(--radix-popover-trigger-width)] min-w-[240px] z-50 bg-popover text-popover-foreground border shadow-md rounded-md overflow-hidden"
        align="start"
      >
        <div className="flex items-center border-b px-3 py-2 bg-muted/30">
          <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
          <input
            ref={inputRef}
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>
        <div className="max-h-60 overflow-y-auto p-1 space-y-0.5">
          {filteredOptions.length === 0 ? (
            <div className="py-4 text-center text-xs text-muted-foreground">
              No matching options found
            </div>
          ) : (
            filteredOptions.map((opt) => {
              const isSelected =
                value === opt._id ||
                (!isCustomSelected && value?.toLowerCase() === opt.name.toLowerCase());
              return (
                <button
                  key={opt._id}
                  type="button"
                  onClick={() => {
                    onValueChange(opt._id);
                    setOpen(false);
                  }}
                  className={cn(
                    "flex w-full items-center justify-between rounded-sm px-3 py-2 text-sm transition-colors text-left hover:bg-accent hover:text-accent-foreground cursor-pointer",
                    isSelected && "bg-accent/50 font-medium"
                  )}
                >
                  <span className="truncate">{opt.name}</span>
                  {isSelected && <Check className="h-4 w-4 text-primary shrink-0 ml-2" />}
                </button>
              );
            })
          )}

          {allowCustom && (
            <button
              type="button"
              onClick={() => {
                if (onCustomSelect) {
                  onCustomSelect();
                } else {
                  onValueChange("OTHER");
                }
                setOpen(false);
              }}
              className="flex w-full items-center gap-2 rounded-sm px-3 py-2 text-sm font-medium text-primary hover:bg-primary/10 transition-colors text-left border-t mt-1 cursor-pointer"
            >
              <Plus className="h-4 w-4 shrink-0" />
              <span>{customLabel}</span>
            </button>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

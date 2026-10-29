import * as React from "react";
import { useState, useRef, useEffect, useMemo } from "react";
import { Search, ChevronDown, Check, X, Globe } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { customArray } from "country-codes-list";
import * as Flags from "country-flag-icons/react/3x2";

export interface CountryItem {
  name: string;
  iso: string;
  dialCode: string;
  flag: string;
}

// Popular / prioritized countries at the top
const POPULAR_ISO_CODES = [
  "IN", // India (+91)
  "US", // United States (+1)
  "GB", // United Kingdom (+44)
  "AE", // United Arab Emirates (+971)
  "CA", // Canada (+1)
  "AU", // Australia (+61)
  "SG", // Singapore (+65)
  "MY", // Malaysia (+60)
  "SA", // Saudi Arabia (+966)
  "QA", // Qatar (+974)
  "KW", // Kuwait (+965)
  "OM", // Oman (+968)
  "BH", // Bahrain (+973)
  "NZ", // New Zealand (+64)
  "DE", // Germany (+49)
  "FR", // France (+33)
];

// Build country list once
const rawCountries: CountryItem[] = customArray({
  name: "{countryNameEn}",
  iso: "{countryCode}",
  dialCode: "+{countryCallingCode}",
  flag: "{flag}",
}) as CountryItem[];

// Deduplicate / ensure unique iso
const ALL_COUNTRIES: CountryItem[] = rawCountries.map((c) => ({
  name: c.name,
  iso: c.iso.toUpperCase(),
  dialCode: c.dialCode.startsWith("+") ? c.dialCode : `+${c.dialCode}`,
  flag: c.flag,
}));

export const POPULAR_COUNTRIES: CountryItem[] = POPULAR_ISO_CODES.map((iso) =>
  ALL_COUNTRIES.find((c) => c.iso === iso)
).filter((c): c is CountryItem => Boolean(c));

export const OTHER_COUNTRIES: CountryItem[] = ALL_COUNTRIES.filter(
  (c) => !POPULAR_ISO_CODES.includes(c.iso)
).sort((a, b) => a.name.localeCompare(b.name));

/**
 * Render an SVG country flag with emoji fallback
 */
export const CountryFlag: React.FC<{
  iso: string;
  flagEmoji?: string;
  className?: string;
  alt?: string;
}> = ({ iso, flagEmoji, className, alt }) => {
  const FlagComponent = (Flags as Record<string, React.ComponentType<any>>)[
    iso?.toUpperCase()
  ];

  if (FlagComponent) {
    return (
      <FlagComponent
        title={alt || iso}
        className={cn(
          "w-5 h-3.5 object-cover rounded-[2px] shadow-[0_0_1px_rgba(0,0,0,0.4)] shrink-0 inline-block",
          className
        )}
      />
    );
  }

  if (flagEmoji) {
    return <span className={cn("text-base leading-none shrink-0", className)}>{flagEmoji}</span>;
  }

  return <Globe className={cn("w-4 h-4 text-muted-foreground shrink-0", className)} />;
};

export interface CountryCodeSelectProps {
  value?: string;
  onChange?: (dialCode: string, country?: CountryItem) => void;
  selectedIso?: string;
  onIsoChange?: (iso: string) => void;
  disabled?: boolean;
  className?: string;
  buttonClassName?: string;
  popoverClassName?: string;
  placeholder?: string;
  defaultIso?: string;
  align?: "start" | "center" | "end";
}

export const CountryCodeSelect: React.FC<CountryCodeSelectProps> = ({
  value = "+91",
  onChange,
  selectedIso,
  onIsoChange,
  disabled = false,
  className,
  buttonClassName,
  popoverClassName,
  placeholder = "+91",
  defaultIso = "IN",
  align = "start",
}) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Normalize incoming value (e.g., "91" -> "+91")
  const normalizedValue = useMemo(() => {
    if (!value) return "";
    const trimmed = String(value).trim();
    if (!trimmed) return "";
    return trimmed.startsWith("+") ? trimmed : `+${trimmed}`;
  }, [value]);

  // Keep track of user's chosen country ISO locally to disambiguate shared codes (+1 for US vs CA)
  const [localIso, setLocalIso] = useState<string>(selectedIso || defaultIso);

  useEffect(() => {
    if (selectedIso) {
      setLocalIso(selectedIso.toUpperCase());
    }
  }, [selectedIso]);

  // Determine currently active country
  const currentCountry = useMemo(() => {
    // 1. If explicit ISO matches, use it
    if (localIso) {
      const match = ALL_COUNTRIES.find((c) => c.iso === localIso.toUpperCase());
      if (match && (!normalizedValue || match.dialCode === normalizedValue)) {
        return match;
      }
    }

    // 2. Otherwise find by dial code (prioritizing popular countries first)
    if (normalizedValue) {
      const popMatch = POPULAR_COUNTRIES.find((c) => c.dialCode === normalizedValue);
      if (popMatch) return popMatch;

      const otherMatch = OTHER_COUNTRIES.find((c) => c.dialCode === normalizedValue);
      if (otherMatch) return otherMatch;
    }

    // 3. Fallback to default country (e.g. India)
    return (
      ALL_COUNTRIES.find((c) => c.iso === defaultIso.toUpperCase()) ||
      ALL_COUNTRIES[0]
    );
  }, [localIso, normalizedValue, defaultIso]);

  // Focus search input when popover opens
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 60);
    } else {
      setSearch("");
    }
  }, [open]);

  // Filter countries by search term (country name, ISO code, or dial code)
  const filteredCountries = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return null;

    const cleanQ = q.startsWith("+") ? q.slice(1) : q;

    return ALL_COUNTRIES.filter((c) => {
      const nameMatch = c.name.toLowerCase().includes(q);
      const isoMatch = c.iso.toLowerCase().includes(q);
      const codeMatch =
        c.dialCode.toLowerCase().includes(q) ||
        c.dialCode.replace("+", "").includes(cleanQ);
      return nameMatch || isoMatch || codeMatch;
    });
  }, [search]);

  const handleSelect = (country: CountryItem) => {
    setLocalIso(country.iso);
    onIsoChange?.(country.iso);
    onChange?.(country.dialCode, country);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild disabled={disabled}>
        <button
          type="button"
          aria-label="Select country code"
          aria-expanded={open}
          className={cn(
            "flex h-10 items-center justify-between gap-1.5 rounded-md border border-input bg-background px-2.5 py-2 text-sm ring-offset-background transition-colors",
            "hover:bg-accent/40 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
            "disabled:cursor-not-allowed disabled:opacity-50 select-none",
            "min-w-[92px]",
            buttonClassName,
            className
          )}
        >
          <div className="flex items-center gap-1.5 min-w-0">
            {currentCountry && (
              <CountryFlag
                iso={currentCountry.iso}
                flagEmoji={currentCountry.flag}
                alt={currentCountry.name}
              />
            )}
            <span className="font-medium text-xs sm:text-sm text-foreground">
              {currentCountry?.dialCode || normalizedValue || placeholder}
            </span>
          </div>
          <ChevronDown
            className={cn(
              "h-3.5 w-3.5 shrink-0 opacity-50 transition-transform duration-200",
              open && "rotate-180"
            )}
          />
        </button>
      </PopoverTrigger>

      <PopoverContent
        className={cn(
          "p-0 w-[300px] sm:w-[320px] max-w-[92vw] z-50 bg-popover text-popover-foreground border shadow-lg rounded-lg overflow-hidden",
          popoverClassName
        )}
        align={align}
        sideOffset={6}
      >
        {/* Search Header */}
        <div className="flex items-center gap-2 border-b px-3 py-2.5 bg-muted/40">
          <Search className="h-4 w-4 shrink-0 opacity-50" />
          <input
            ref={inputRef}
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search country or code..."
            className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="p-0.5 rounded-full hover:bg-muted text-muted-foreground"
              aria-label="Clear search"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Countries List */}
        <div className="max-h-64 overflow-y-auto divide-y divide-border/20 text-sm">
          {filteredCountries !== null ? (
            // Search Results
            filteredCountries.length > 0 ? (
              <div className="p-1">
                {filteredCountries.map((country) => {
                  const isSelected =
                    currentCountry?.iso === country.iso ||
                    (!currentCountry && normalizedValue === country.dialCode);
                  return (
                    <button
                      key={country.iso}
                      type="button"
                      onClick={() => handleSelect(country)}
                      className={cn(
                        "w-full flex items-center justify-between gap-2 px-2.5 py-2 rounded-md text-left transition-colors",
                        "hover:bg-accent hover:text-accent-foreground cursor-pointer",
                        isSelected && "bg-accent/70 font-medium"
                      )}
                    >
                      <div className="flex items-center gap-2.5 min-w-0 flex-1">
                        <CountryFlag
                          iso={country.iso}
                          flagEmoji={country.flag}
                          alt={country.name}
                        />
                        <span className="truncate text-xs sm:text-sm">
                          {country.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="font-mono text-xs text-muted-foreground bg-muted/70 px-1.5 py-0.5 rounded">
                          {country.dialCode}
                        </span>
                        {isSelected && (
                          <Check className="h-3.5 w-3.5 text-primary shrink-0" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="py-6 text-center text-xs text-muted-foreground">
                No country found for &ldquo;{search}&rdquo;
              </div>
            )
          ) : (
            // Default View with Popular & All Countries
            <>
              {POPULAR_COUNTRIES.length > 0 && (
                <div className="p-1">
                  <div className="px-2.5 py-1 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                    Popular
                  </div>
                  {POPULAR_COUNTRIES.map((country) => {
                    const isSelected = currentCountry?.iso === country.iso;
                    return (
                      <button
                        key={`pop-${country.iso}`}
                        type="button"
                        onClick={() => handleSelect(country)}
                        className={cn(
                          "w-full flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-md text-left transition-colors",
                          "hover:bg-accent hover:text-accent-foreground cursor-pointer",
                          isSelected && "bg-accent/70 font-medium"
                        )}
                      >
                        <div className="flex items-center gap-2.5 min-w-0 flex-1">
                          <CountryFlag
                            iso={country.iso}
                            flagEmoji={country.flag}
                            alt={country.name}
                          />
                          <span className="truncate text-xs sm:text-sm">
                            {country.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="font-mono text-xs text-muted-foreground bg-muted/70 px-1.5 py-0.5 rounded">
                            {country.dialCode}
                          </span>
                          {isSelected && (
                            <Check className="h-3.5 w-3.5 text-primary shrink-0" />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              <div className="p-1">
                <div className="px-2.5 py-1 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                  All Countries
                </div>
                {OTHER_COUNTRIES.map((country) => {
                  const isSelected = currentCountry?.iso === country.iso;
                  return (
                    <button
                      key={`all-${country.iso}`}
                      type="button"
                      onClick={() => handleSelect(country)}
                      className={cn(
                        "w-full flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-md text-left transition-colors",
                        "hover:bg-accent hover:text-accent-foreground cursor-pointer",
                        isSelected && "bg-accent/70 font-medium"
                      )}
                    >
                      <div className="flex items-center gap-2.5 min-w-0 flex-1">
                        <CountryFlag
                          iso={country.iso}
                          flagEmoji={country.flag}
                          alt={country.name}
                        />
                        <span className="truncate text-xs sm:text-sm">
                          {country.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="font-mono text-xs text-muted-foreground bg-muted/70 px-1.5 py-0.5 rounded">
                          {country.dialCode}
                        </span>
                        {isSelected && (
                          <Check className="h-3.5 w-3.5 text-primary shrink-0" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

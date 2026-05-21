"use client";

import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, ChevronDown, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface MultiSelectFilterProps {
  label: string;
  options: string[];
  selected: string[];
  onChange: (values: string[]) => void;
  /** Shown when nothing selected. Defaults to "All {label}s" */
  placeholder?: string;
  className?: string;
}

/**
 * Compact filter-bar button that opens a popover with a scrollable checkbox list.
 * - Shows selected count in the button
 * - Each option has a visible checkbox
 * - "Select all" / "Clear all" controls
 * - X on the button itself clears instantly without opening the popover
 */
export function MultiSelectFilter({
  label,
  options,
  selected,
  onChange,
  placeholder,
  className,
}: MultiSelectFilterProps) {
  const [open, setOpen] = useState(false);

  const toggle = (value: string) => {
    onChange(
      selected.includes(value)
        ? selected.filter((v) => v !== value)
        : [...selected, value],
    );
  };

  const displayText =
    selected.length === 0
      ? (placeholder ?? `All ${label}s`)
      : selected.length === 1
        ? selected[0]
        : `${selected.length} ${label}s selected`;

  const hasSelection = selected.length > 0;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            "flex items-center gap-2 bg-card border border-border rounded-lg px-3 py-2 text-sm hover:border-foreground/20 transition-colors",
            hasSelection && "border-[#0763d8]/50 bg-[#0763d8]/5",
            className,
          )}
        >
          <span className="text-xs text-muted-foreground font-medium whitespace-nowrap">
            {label}:
          </span>
          <span
            className={cn(
              "text-sm truncate max-w-[150px]",
              hasSelection ? "text-foreground font-medium" : "text-muted-foreground",
            )}
          >
            {displayText}
          </span>
          {hasSelection ? (
            <span
              role="button"
              aria-label={`Clear ${label} filter`}
              onClick={(e) => {
                e.stopPropagation();
                onChange([]);
              }}
              className="ml-0.5 text-muted-foreground hover:text-foreground flex-shrink-0"
            >
              <X className="w-3 h-3" />
            </span>
          ) : (
            <ChevronDown
              className={cn(
                "w-3 h-3 text-muted-foreground flex-shrink-0 transition-transform duration-150",
                open && "rotate-180",
              )}
            />
          )}
        </button>
      </PopoverTrigger>

      <PopoverContent align="start" className="w-56 p-0 shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between px-3 py-2 border-b border-border bg-muted/30">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            {label}
            {hasSelection && (
              <span className="ml-1.5 text-[#0763d8] normal-case font-normal">
                ({selected.length} selected)
              </span>
            )}
          </span>
          {hasSelection && (
            <button
              type="button"
              onClick={() => onChange([])}
              className="text-xs text-[#0763d8] hover:underline"
            >
              Clear
            </button>
          )}
        </div>

        {/* Option list */}
        <div className="max-h-64 overflow-y-auto py-1">
          {options.length === 0 ? (
            <p className="text-xs text-muted-foreground px-3 py-2">No options available.</p>
          ) : (
            options.map((option) => {
              const isSelected = selected.includes(option);
              return (
                <div
                  key={option}
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => toggle(option)}
                  className={cn(
                    "flex items-center gap-2.5 px-3 py-2 cursor-pointer hover:bg-muted transition-colors select-none",
                    isSelected && "bg-[#0763d8]/10",
                  )}
                >
                  {/* Custom checkbox */}
                  <div
                    className={cn(
                      "w-4 h-4 rounded border flex-shrink-0 flex items-center justify-center transition-colors",
                      isSelected
                        ? "bg-[#0763d8] border-[#0763d8]"
                        : "border-border",
                    )}
                  >
                    {isSelected && <Check className="w-2.5 h-2.5 text-white stroke-[3]" />}
                  </div>
                  <span className={cn("text-sm", isSelected && "font-medium")}>
                    {option}
                  </span>
                </div>
              );
            })
          )}
        </div>

        {/* Footer: select all */}
        {options.length > 1 && (
          <div className="border-t border-border px-3 py-1.5 flex items-center justify-between">
            <button
              type="button"
              onClick={() => onChange([...options])}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors hover:underline"
            >
              Select all
            </button>
            <span className="text-xs text-muted-foreground">
              {selected.length} / {options.length}
            </span>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}

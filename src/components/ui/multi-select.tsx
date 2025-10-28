"use client";

import * as React from "react";
import { X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Command as CommandPrimitive } from "cmdk";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Button } from "./button";
import { cn } from "@/lib/utils";
import { Checkbox } from "./checkbox";

interface MultiSelectProps {
  options: { label: string; value: string }[];
  onValueChange: (value: string[]) => void;
  defaultValue?: string[];
  placeholder?: string;
  className?: string;
}

const MultiSelect = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive>,
  MultiSelectProps
>(
  (
    {
      options,
      onValueChange,
      defaultValue = [],
      placeholder = "Pilih...",
      className,
    },
    ref
  ) => {
    const [selectedValues, setSelectedValues] =
      React.useState<string[]>(defaultValue);
    const [isOpen, setIsOpen] = React.useState(false);

    React.useEffect(() => {
      onValueChange(selectedValues);
    }, [selectedValues, onValueChange]);

    const handleSelect = (value: string) => {
      setSelectedValues((prev) =>
        prev.includes(value)
          ? prev.filter((v) => v !== value)
          : [...prev, value]
      );
    };

    const getSelectedLabels = () => {
      if (selectedValues.length === 0) return placeholder;
      return options
        .filter((option) => selectedValues.includes(option.value))
        .map((option) => option.label)
        .join(", ");
    };

    return (
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={isOpen}
            className={cn("w-full justify-between", className)}
            onClick={() => setIsOpen(!isOpen)}
          >
            <span className="truncate">{getSelectedLabels()}</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[250px] p-0">
          {/* 2. Teruskan 'ref' ke komponen Command */}
          <Command ref={ref}>
            <CommandList>
              <CommandGroup>
                {options.map((option) => (
                  <CommandItem
                    key={option.value}
                    onSelect={() => handleSelect(option.value)}
                    className="cursor-pointer"
                  >
                    <Checkbox
                      checked={selectedValues.includes(option.value)}
                      className="mr-2"
                    />
                    {option.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
          {selectedValues.length > 0 && (
            <div className="p-2 border-t">
              <div className="flex flex-wrap gap-1">
                {selectedValues.map((value) => {
                  const option = options.find((o) => o.value === value);
                  return (
                    <Badge
                      key={value}
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      {option?.label}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelect(value);
                        }}
                      />
                    </Badge>
                  );
                })}
              </div>
            </div>
          )}
        </PopoverContent>
      </Popover>
    );
  }
);

MultiSelect.displayName = "MultiSelect";

export { MultiSelect };
import { useRef, useState } from "react";
import type { SearchInputProps } from "../types";

export function SearchInput({
  icon,
  placeholder,
  value,
  onChange,
  suggestions = [],
  onSelectSuggestion,
  className = "",
}: SearchInputProps) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={wrapperRef}
      className={`relative w-full ${className}`}
      onKeyDown={(e) => {
        if (e.key === "Escape") setOpen(false);
      }}
    >
      <div className="flex items-center gap-3 w-full bg-gradient-to-r from-black/10 to-muted-fg/20 border border-muted-fg/20 rounded-2xl px-4 py-3 lg:py-3">
        <span className="flex items-center justify-center">{icon}</span>
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onFocus={() => setOpen(true)}
          onChange={(e) => {
            onChange(e.target.value);
            setOpen(true);
          }}
          onBlur={(e) => {
            requestAnimationFrame(() => {
              if (!wrapperRef.current?.contains(document.activeElement)) {
                setOpen(false);
              }
            });
          }}
          className="w-full bg-transparent outline-none border-none text-sm lg:text-base placeholder:text-muted-fg/70 text-foreground placeholder:font-sans"
          aria-expanded={open}
          aria-autocomplete="list"
        />
      </div>

      {open && suggestions.length > 0 && (
        <ul
          role="listbox"
          className="absolute z-20 mt-2 w-full rounded-2xl border border-muted-fg/20 bg-black/90 backdrop-blur-md text-sm max-h-60 overflow-y-auto"
        >
          {suggestions.map((item) => (
            <li
              role="option"
              key={item}
              onMouseDown={(e) => {
                e.preventDefault();
                onSelectSuggestion?.(item);
                setOpen(false);
              }}
              className="px-4 py-2 cursor-pointer hover:bg-white/5"
            >
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

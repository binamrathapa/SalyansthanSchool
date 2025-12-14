"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SearchFilterBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  filter: string;
  onFilterChange: (value: string) => void;
  filterOptions?: { label: string; value: string }[];
}

const ALL_VALUE = "__all__";

const SearchFilterBar = ({
  search,
  onSearchChange,
  filter,
  onFilterChange,
  filterOptions = [],
}: SearchFilterBarProps) => {
  return (
    <div className="w-full flex justify-end mb-4 gap-3">
      {/* Search */}
      <input
        type="text"
        placeholder="Search..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        className="
          h-10 w-64 rounded-md border border-gray-300 bg-white px-3 text-sm
          focus:outline-none focus:ring-2
          focus:ring-[var(--brand-600)]
          focus:border-[var(--brand-700)]
        "
      />

      {/* Filter */}
      {filterOptions.length > 0 && (
        <Select
          value={filter || ALL_VALUE}
          onValueChange={onFilterChange}
        >
          <SelectTrigger
            className="
              h-10 w-40 border border-gray-300 bg-white text-sm
              focus:ring-2 focus:ring-[var(--brand-600)]
              focus:border-[var(--brand-700)]
            "
          >
            <SelectValue placeholder="All" />
          </SelectTrigger>

          <SelectContent >
            <SelectItem value={ALL_VALUE}>All</SelectItem>

            {filterOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value} className="hover:bg-gray-950">
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );
};

export default SearchFilterBar;

"use client";

interface SearchFilterBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  filter: string;
  onFilterChange: (value: string) => void;
  filterOptions?: { label: string; value: string }[];
}

const SearchFilterBar = ({
  search,
  onSearchChange,
  filter,
  onFilterChange,
  filterOptions = [],
}: SearchFilterBarProps) => {
  return (
    <div className="w-full flex justify-end mb-4 gap-2">
      <input
        type="text"
        placeholder="Search..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        className="border px-3 py-2 rounded-md w-64"
      />

      {filterOptions.length > 0 && (
        <select
          className="border px-3 py-2 rounded-md"
          value={filter}
          onChange={(e) => onFilterChange(e.target.value)}
        >
          <option value="">All</option>
          {filterOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      )}
    </div>
  );
};

export default SearchFilterBar;

import React, { useState, useMemo } from "react";
import * as icons from "lucide-react";
import iconNodes from "lucide-static/icon-nodes.json";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Convert kebab-case keys to PascalCase
const iconNames = Object.keys(iconNodes).map((kebabName) =>
  kebabName
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("")
);

const ICONS_PER_PAGE = 20;

export interface IconPickerProps {
  setIconName?: (n: string) => void;
}

const IconPicker = ({ setIconName }: IconPickerProps) => {
  const [search, setSearch] = useState("Folder");
  const [page, setPage] = useState(1);

  // Filter icons based on search (default to "Folder" if empty)
  const filteredIcons = useMemo(() => {
    const searchTerm = search.trim() || "Folder";
    const searchLower = searchTerm.toLowerCase();
    return iconNames.filter((name) => name.toLowerCase().includes(searchLower));
  }, [search]);

  // Pagination
  const totalPages = Math.ceil(filteredIcons.length / ICONS_PER_PAGE);
  const startIndex = (page - 1) * ICONS_PER_PAGE;
  const endIndex = startIndex + ICONS_PER_PAGE;
  const paginatedIcons = filteredIcons.slice(startIndex, endIndex);

  const goToNextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

  const goToPrevPage = () => {
    if (page > 1) setPage(page - 1);
  };

  return (
    <div className="w-full mx-auto">
      {/* Search Bar */}
      <input
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1);
        }}
        placeholder="Search icons..."
        className="bg-muted w-full text-sm h-10 px-4 py-2 rounded-full mb-4 border focus:outline-none focus:ring-2 focus:ring-primary"
      />
      {/* Icon Count */}
      <p className="text-sm opacity-75 mb-4">
        Showing {startIndex + 1}-{Math.min(endIndex, filteredIcons.length)} of{" "}
        {filteredIcons.length} icons
        <span className="text-xs italic"> (total 1.6k)</span>
      </p>
      {/* Render Icons */}
      <div
        className={`grid ${filteredIcons.length === 0 ? "flex items-center justify-center" : "grid-cols-10 gap-1"} min-h-24 max-h-24 `}
      >
        {paginatedIcons.map((name) => {
          const Icon = (icons as unknown as Record<string, icons.LucideIcon>)[
            name
          ];

          return (
            <div
              key={name}
              className={`hover:bg-primary/30 hover:text-primary flex flex-col items-center justify-center p-3 rounded-lg  transition-colors duration-200 group cursor-pointer`}
              title={name}
              onClick={() => {
                setIconName?.(name);
              }}
            >
              <Icon className="w-6 h-6" />
            </div>
          );
        })}

        {/* No results */}
        {filteredIcons.length === 0 && (
          <p className="text-center min-h- text-gray-500">
            No icons found for &apos;{search}&apos;
          </p>
        )}
      </div>
      {/* Pagination */}
      <div
        className={`flex items-center justify-between gap-4 mt-4 ${page > 1 ? "opacity-100" : "opacity-50"}`}
      >
        <button
          onClick={goToPrevPage}
          disabled={page === 1 || !filteredIcons.length}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </button>

        <span className="text-sm text-gray-600">
          Page {page} of {totalPages}
        </span>

        <button
          onClick={goToNextPage}
          disabled={page === totalPages || !filteredIcons.length}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default IconPicker;

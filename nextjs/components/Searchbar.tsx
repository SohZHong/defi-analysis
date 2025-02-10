"use client";

import { useState } from "react";
import SearchIcon from "./SearchIcon";

interface CustomSearchbarProps {
  onSearch: (query: string) => void; // Function type definition
}

export const CustomSearchbar: React.FC<CustomSearchbarProps> = ({ onSearch }) => {
  const [query, setQuery] = useState<string>("");

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onSearch(query); // Call function with the query value
    }
  };

  return (
    <div className="border border-lightgrey p-4 rounded-full flex items-center justify-center gap-2 min-w-full">
      <SearchIcon className="fill-white" />
      <input
        type="text"
        className="p-2 w-full outline-none bg-transparent font-bold"
        placeholder="Enter a wallet public address"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown} // Detect Enter key
      />
    </div>
  );
};
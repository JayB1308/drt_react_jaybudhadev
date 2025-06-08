import { useState } from "react";
import type { KeyboardEvent } from "react";

interface SearchProps {
  onSearch: (searchTerm: string) => void;
  loading?: boolean;
}

export default function Search({ onSearch, loading }: SearchProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onSearch(searchTerm);
    }
  };

  return (
    <div className="flex-1">
      <input
        type="text"
        placeholder="Search by Name or NORAD ID"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyDown={handleKeyDown}
        className="w-full mt-1 px-3 py-2 border-2 rounded-md focus:outline-none focus:ring-0 focus:glow-intense"
        disabled={loading}
      />
    </div>
  );
} 
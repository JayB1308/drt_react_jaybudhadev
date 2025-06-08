import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import type { SatelliteObject } from "../home/types";

const STORAGE_KEY = "selected_satellites";

export default function SelectedItems() {
  const [selectedSatellites, setSelectedSatellites] = useState<SatelliteObject[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setSelectedSatellites(JSON.parse(saved));
    }
  }, []);

  const handleBack = () => {
    navigate("/");
  };

  return (
    <div className="h-[100vh] overflow-hidden px-4 bg-navy text-white">
      <div className="flex items-center justify-between mb-4 border-b-2 mt-2 py-4">
        <h1 className="text-2xl font-bold pb-3">Selected Satellites</h1>
        <button
          onClick={handleBack}
          className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors"
        >
          Back to Selection
        </button>
      </div>
      
      <div className="p-4">
        {selectedSatellites.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No satellites selected</p>
        ) : (
          <div className="grid gap-4">
            {selectedSatellites.map((sat) => (
              <div
                key={sat.noradCatId}
                className="bg-white/10 p-4 rounded-lg border border-white/20 hover:bg-white/20 transition-colors hover:glow-intense focus-within:bg-white/20"
                tabIndex={0}
              >
                <h3 className="font-medium text-lg text-white mb-2">{sat.name}</h3>
                <div className="text-gray-300">
                  <span className="text-sm font-medium text-gray-400">NORAD ID:</span>
                  <span className="ml-2">{sat.noradCatId}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

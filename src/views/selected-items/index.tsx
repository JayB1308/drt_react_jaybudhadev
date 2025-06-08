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
    <div className="h-[100vh] overflow-hidden px-4">
      <div className="flex items-center justify-between py-4">
        <h1 className="text-2xl font-bold">Selected Satellites</h1>
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
                className="bg-white p-4 rounded-lg shadow border"
              >
                <h3 className="font-medium text-lg">{sat.name}</h3>
                <p className="text-gray-600">NORAD ID: {sat.noradCatId}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

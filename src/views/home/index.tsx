import DataTable from "@components/datatable";
import { useState } from "react";

import useSatelliteData from "./use-satellite";
import useColumns from "./columns";
import type { SatelliteObject } from "./types";
import Dropdown, { type SelectValue } from "@components/select";
import Search from "@components/search";
import {
  ATTR_OPTIONS,
  OBJECT_TYPE_OPTIONS,
  ORBIT_CODE_OPTIONS,
} from "./constants";

const MAX_SELECTION = 10;

export default function Home() {
  const {
    loading,
    satData,
    handleDropdown,
    filterData,
    applyFilters,
    handleSearch,
  } = useSatelliteData();

  const [selectedAttributes, setSelectedAttributes] = useState<SelectValue[]>(
    filterData.attributes || []
  );
  const [selectedSatellites, setSelectedSatellites] = useState<SatelliteObject[]>([]);
  const [selectionError, setSelectionError] = useState<string>("");
  const cols = useColumns(selectedAttributes);

  const handleAttributesChange = (
    value: SelectValue | SelectValue[] | null
  ) => {
    handleDropdown("attributes", (value as SelectValue[]) || []);
  };

  const handleApplyFilters = async () => {
    await applyFilters();
    setSelectedAttributes(filterData.attributes || []);
  };

  const handleRowSelect = (selected: SatelliteObject[]) => {
    if (selected.length > MAX_SELECTION) {
      setSelectionError(`You can only select up to ${MAX_SELECTION} satellites at a time`);
      setSelectedSatellites(selected.slice(0, MAX_SELECTION));
      setTimeout(() => setSelectionError(""), 3000);
      return;
    }
    setSelectionError("");
    setSelectedSatellites(selected);
  };

  return (
    <div className="h-[100vh] overflow-hidden px-4">
      <h1 className="text-2xl font-bold mb-4 ml-4 mt-4">
        Create My Asset List
      </h1>
      {selectionError && (
        <div className="px-4 py-2 bg-red-50 border-b border-red-200">
          <p className="text-sm text-red-700">{selectionError}</p>
        </div>
      )}
      {selectedSatellites.length > 0 && (
        <div className="px-4 py-2 bg-blue-50 border-b">
          <p className="text-sm text-blue-700">
            {selectedSatellites.length} satellite{selectedSatellites.length !== 1 ? 's' : ''} selected
            {selectedSatellites.length === MAX_SELECTION && ` (Maximum limit reached)`}
          </p>
        </div>
      )}
      <div className="p-4 space-y-4">
        <div className="flex gap-4">
          <div className="flex-1">
            <Search onSearch={handleSearch} loading={loading} />
          </div>
          <div className="flex-1">
            <Dropdown
              options={OBJECT_TYPE_OPTIONS}
              isMulti
              value={filterData.objectTypes as SelectValue[]}
              onChange={(value) =>
                handleDropdown("objectTypes", value as SelectValue[])
              }
            />
          </div>
          <div className="flex-1">
            <Dropdown
              options={ORBIT_CODE_OPTIONS}
              isMulti
              value={filterData.orbitCodes as SelectValue[]}
              onChange={(value) =>
                handleDropdown("orbitCodes", value as SelectValue[])
              }
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={handleApplyFilters}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors disabled:bg-blue-300"
              disabled={loading}
            >
              Apply Filters
            </button>
          </div>
        </div>
        <div className="flex-1">
          <Dropdown
            options={ATTR_OPTIONS}
            isMulti
            value={filterData.attributes as SelectValue[]}
            onChange={handleAttributesChange}
          />
        </div>
      </div>
      <div className="p-4 max-h-[90%]">
        <DataTable<SatelliteObject>
          data={satData}
          columns={cols}
          loading={loading}
          selectedRows={selectedSatellites}
          onRowSelect={handleRowSelect}
          maxSelection={MAX_SELECTION}
        />
      </div>
    </div>
  );
}

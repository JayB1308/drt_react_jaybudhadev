import DataTable from "@components/datatable";
import useSatelliteData from "./use-satellite";
import type { SatelliteObject } from "./types";
import Dropdown, { type SelectValue } from "@components/select";
import Search from "@components/search";
import { useNavigate } from "react-router";
import {
  ATTR_OPTIONS,
  OBJECT_TYPE_OPTIONS,
  ORBIT_CODE_OPTIONS,
} from "./constants";

export default function Home() {
  const navigate = useNavigate();
  const {
    loading,
    satData,
    columns,
    filterData,
    selectedAttributes,
    selectedSatellites,
    selectionError,
    fetchError,
    maxSelection,
    handleDropdown,
    handleSearch,
    handleAttributesChange,
    handleApplyFilters,
    handleRowSelect,
  } = useSatelliteData();

  const handleProceed = () => {
    navigate("/selected-items");
  };

  return (
    <div className="h-[100vh] overflow-hidden px-4 bg-navy text-white">
      <div className="flex justify-between items-center mb-4 border-b-2 mt-2 py-4">
        <h1 className="text-2xl font-bold pb-3">
          Create My Asset List
        </h1>
        <div className="flex items-center gap-4">
          {selectedSatellites.length > 0 && (
            <button
              onClick={handleProceed}
              className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors text-sm whitespace-nowrap"
            >
              Proceed to Selected Items
            </button>
          )}
          <div className="w-80">
            <Search onSearch={handleSearch} loading={loading} />
          </div>
        </div>
      </div>
      {selectionError && (
        <div className="px-4 py-2 bg-red-50 border-b border-red-200">
          <p className="text-sm text-red-700">{selectionError}</p>
        </div>
      )}
      {fetchError && (
        <div className="px-4 py-2 bg-red-50 border-b border-red-200">
          <p className="text-sm text-red-700">{fetchError}</p>
        </div>
      )}
      <div className="p-4 space-y-4">
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Object Type
            </label>
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
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Orbit Code
            </label>
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
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Attributes
          </label>
          <Dropdown
            options={ATTR_OPTIONS}
            isMulti
            value={selectedAttributes}
            onChange={handleAttributesChange}
          />
        </div>
      </div>
      <div className="p-4 max-h-[90%]">
        <DataTable<SatelliteObject>
          data={satData}
          columns={columns}
          loading={loading}
          selectedRows={selectedSatellites}
          onRowSelect={handleRowSelect}
          maxSelection={maxSelection}
        />
      </div>
    </div>
  );
}

import DataTable from "@components/datatable";

import useSatelliteData from "./use-satellite";
import Columns from "./columns";
import type { SatelliteObject } from "./types";
import Dropdown, { type SelectValue } from "@components/select";
import {
  ATTR_OPTIONS,
  OBJECT_TYPE_OPTIONS,
  ORBIT_CODE_OPTIONS,
} from "./constants";

export default function Home() {
  const { loading, satData, handleDropdown, filterData, applyFilters } =
    useSatelliteData();
  const cols = Columns();

  return (
    <div className="h-[100vh] overflow-hidden">
      <h1>Create My Asset List</h1>
      <Dropdown
        options={OBJECT_TYPE_OPTIONS}
        isMulti
        value={filterData.objectTypes as SelectValue[]}
        onChange={(value) =>
          handleDropdown("objectTypes", value as SelectValue[])
        }
      />
      <Dropdown
        options={ATTR_OPTIONS}
        isMulti
        value={filterData.attributes as SelectValue[]}
        onChange={(value) =>
          handleDropdown("attributes", value as SelectValue[])
        }
      />
      <Dropdown
        options={ORBIT_CODE_OPTIONS}
        isMulti
        value={filterData.orbitCodes as SelectValue[]}
        onChange={(value) =>
          handleDropdown("orbitCodes", value as SelectValue[])
        }
      />
      <button
        onClick={applyFilters}
        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors disabled:bg-blue-300"
        disabled={loading}
      >
        Apply Filters
      </button>
      <div className="p-4 max-h-[90%]">
        <DataTable<SatelliteObject>
          data={satData}
          columns={cols}
          loading={loading}
        />
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import { useAxios } from "@hooks/use-axios";
import type { FilterData, SatelliteObject } from "./types";
import type { SelectValue } from "@components/select";

export default function useSatelliteData() {
  const [satData, setSatData] = useState<SatelliteObject[]>([]);
  const [filterData, setFilterData] = useState<Partial<FilterData>>({});
  const { loading, get } = useAxios();

  const getSatelliteData = async () => {
    const params = Object.entries(filterData).reduce((acc, [key, values]) => {
      if (key === "orbitCodes") return acc;
      if (Array.isArray(values) && values.length > 0) {
        acc[key] = values.map((v: SelectValue) => v.value).join(",");
      }
      return acc;
    }, {} as Record<string, string>);

    const { data } = await get({
      url: "/satellites",
      params,
    });
    let results = Array.isArray(data) ? data : [];

    const orbitSelections = filterData.orbitCodes?.map((o) => o.value) || [];
    if (orbitSelections.length) {
      const allowSet = new Set(orbitSelections);
      results = results.filter((sat) => allowSet.has(sat.orbitCode));
    }

    setSatData(results);
  };

  const applyFilters = async () => {
    await getSatelliteData();
  };

  const handleDropdown = (key: string, value: SelectValue[]) => {
    setFilterData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  useEffect(() => {
    getSatelliteData();
  }, []);

  console.log(satData);

  return {
    loading,
    satData,
    filterData,
    handleDropdown,
    applyFilters,
  };
}

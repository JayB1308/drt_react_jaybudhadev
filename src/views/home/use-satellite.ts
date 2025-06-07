import { useEffect, useState } from "react";

import { useAxios } from "@hooks/use-axios";
import type { FilterData, SatelliteObject } from "./types";
import type { SelectValue } from "@components/select";

export default function useSatelliteData() {
  const [satData, setSatData] = useState<SatelliteObject[]>([]);
  const [filterData, setFilterData] = useState<Partial<FilterData>>({});

  const { loading, get } = useAxios();

  const getSatelliteData = async () => {
    const params = Object.keys(filterData).reduce((acc, key) => {
      const values = filterData[key];
      if (Array.isArray(values) && values.length > 0) {
        acc[key] = values.map((item: SelectValue) => item.value).join(",");
      }
      return acc;
    }, {} as Record<string, string>);

    const { data } = await get({
      url: "/satellites",
      params,
    });

    setSatData(data);
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

  return {
    loading,
    satData,
    handleDropdown,
    filterData,
    applyFilters,
  };
}

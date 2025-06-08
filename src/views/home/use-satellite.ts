import { useEffect, useState, useMemo } from "react";
import { useAxios } from "@hooks/use-axios";
import type { FilterData, SatelliteObject } from "./types";
import type { SelectValue } from "@components/select";
import { ATTR_OPTIONS } from "./constants";

const DEFAULT_ATTRIBUTES = [
  "name",
  "noradCatId",
  "orbitCode",
  "objectType",
  "countryCode",
  "launchDate",
].map(attr => ATTR_OPTIONS.find(opt => opt.value === attr)!);

export default function useSatelliteData() {
  const [satData, setSatData] = useState<SatelliteObject[]>([]);
  const [filterData, setFilterData] = useState<Partial<FilterData>>({
    attributes: DEFAULT_ATTRIBUTES,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const { loading, get } = useAxios();

  const getSatelliteData = async () => {
    const params = Object.entries(filterData).reduce((acc, [key, values]) => {
      if (key === "orbitCodes") return acc;
      if (Array.isArray(values) && values.length > 0) {
        acc[key] = values.map((v: SelectValue) => v.value).join(",");
      }
      return acc;
    }, {} as Record<string, string>);

    params.attributes = (filterData.attributes?.length 
      ? filterData.attributes 
      : DEFAULT_ATTRIBUTES).map(v => v.value).join(",");

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

  const filteredData = useMemo(() => {
    if (!searchTerm) return satData;

    const searchLower = searchTerm.toLowerCase();
    return satData.filter(sat => 
      sat.name.toLowerCase().includes(searchLower) ||
      sat.noradCatId.toLowerCase().includes(searchLower)
    );
  }, [satData, searchTerm]);

  const applyFilters = async () => {
    if (!filterData.attributes?.length) {
      setFilterData(prev => ({
        ...prev,
        attributes: DEFAULT_ATTRIBUTES,
      }));
    }
    await getSatelliteData();
  };

  const handleDropdown = (key: string, value: SelectValue[]) => {
    setFilterData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  useEffect(() => {
    getSatelliteData();
  }, []);

  return {
    loading,
    satData: filteredData,
    filterData,
    handleDropdown,
    applyFilters,
    handleSearch,
  };
}

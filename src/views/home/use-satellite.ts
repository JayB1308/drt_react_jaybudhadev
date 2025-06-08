import { useEffect, useState, useMemo } from "react";
import { useAxios } from "@hooks/use-axios";
import type { FilterData, SatelliteObject } from "./types";
import type { SelectValue } from "@components/select";
import { ATTR_OPTIONS } from "./constants";
import useColumns from "./columns";

const DEFAULT_ATTRIBUTES = [
  "name",
  "noradCatId",
  "orbitCode",
  "objectType",
  "countryCode",
  "launchDate",
].map(attr => ATTR_OPTIONS.find(opt => opt.value === attr)!);

const MAX_SELECTION = 10;
const STORAGE_KEY = "selected_satellites";

export default function useSatelliteData() {
  const [satData, setSatData] = useState<SatelliteObject[]>([]);
  const [filterData, setFilterData] = useState<Partial<FilterData>>({
    attributes: DEFAULT_ATTRIBUTES,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSatellites, setSelectedSatellites] = useState<SatelliteObject[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });
  const [selectionError, setSelectionError] = useState<string>("");
  const [selectedAttributes, setSelectedAttributes] = useState<SelectValue[]>(
    DEFAULT_ATTRIBUTES
  );
  const { loading, get } = useAxios();

  const cols = useColumns(selectedAttributes);

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

  const handleDropdown = (key: string, value: SelectValue[]) => {
    setFilterData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handleRowSelect = (selected: SatelliteObject[]) => {
    if (selected.length > MAX_SELECTION) {
      setSelectionError(`You can only select up to ${MAX_SELECTION} satellites at a time`);
      const limitedSelection = selected.slice(0, MAX_SELECTION);
      setSelectedSatellites(limitedSelection);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(limitedSelection));
      setTimeout(() => setSelectionError(""), 3000);
      return;
    }
    setSelectionError("");
    setSelectedSatellites(selected);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(selected));
  };

  const handleAttributesChange = (value: SelectValue | SelectValue[] | null) => {
    const newAttributes = (value as SelectValue[]) || [];
    handleDropdown("attributes", newAttributes);
    setSelectedAttributes(newAttributes);
  };

  const handleApplyFilters = async () => {
    if (!filterData.attributes?.length) {
      setFilterData(prev => ({
        ...prev,
        attributes: DEFAULT_ATTRIBUTES,
      }));
      setSelectedAttributes(DEFAULT_ATTRIBUTES);
    }
    await getSatelliteData();
  };

  useEffect(() => {
    getSatelliteData();
  }, []);

  useEffect(() => {
    setSelectedSatellites([]);
    localStorage.removeItem(STORAGE_KEY);
  }, [satData]);

  useEffect(() => {
    if (filterData.attributes) {
      setSelectedAttributes(filterData.attributes);
    }
  }, [filterData.attributes]);

  return {
    // Data
    loading,
    satData: filteredData,
    columns: cols,
    
    // Filter state
    filterData,
    selectedAttributes,
    
    // Selection state
    selectedSatellites,
    selectionError,
    maxSelection: MAX_SELECTION,
    
    // Handlers
    handleDropdown,
    handleSearch,
    handleAttributesChange,
    handleApplyFilters,
    handleRowSelect,
  };
}

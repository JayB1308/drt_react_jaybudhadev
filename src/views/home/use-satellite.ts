import { useEffect, useState, useMemo, useRef } from "react";
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
].map((attr) => ATTR_OPTIONS.find((opt) => opt.value === attr)!);

const MAX_SELECTION = 10;
const STORAGE_KEY = "selected_satellites";

export default function useSatelliteData() {
  const [satData, setSatData] = useState<SatelliteObject[]>([]);
  const [filterData, setFilterData] = useState<Partial<FilterData>>({
    attributes: DEFAULT_ATTRIBUTES,
  });
  const [tempAttributes, setTempAttributes] = useState<SelectValue[]>(DEFAULT_ATTRIBUTES);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSatellites, setSelectedSatellites] = useState<SatelliteObject[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });
  const [selectionError, setSelectionError] = useState<string>("");
  const [fetchError, setFetchError] = useState<string>("");
  const [selectedAttributes, setSelectedAttributes] = useState<SelectValue[]>(DEFAULT_ATTRIBUTES);
  const { loading, get } = useAxios();
  const initialFetchDone = useRef(false);

  const cols = useColumns(selectedAttributes);

  const getSatelliteData = async (forceFetch = false) => {
    if (!initialFetchDone.current || forceFetch) {
      if (!forceFetch) {
        initialFetchDone.current = true;
      }
      setFetchError("");
      
      try {
        const params = Object.entries(filterData).reduce((acc, [key, values]) => {
          if (key === "orbitCodes") return acc;
          if (Array.isArray(values) && values.length > 0) {
            acc[key] = values.map((v: SelectValue) => v.value).join(",");
          }
          return acc;
        }, {} as Record<string, string>);

        params.attributes = (
          filterData.attributes?.length ? filterData.attributes : DEFAULT_ATTRIBUTES
        )
          .map((v) => v.value)
          .join(",");

        const { data } = await get({
          url: "/satellites",
          params,
        });

        if (!data) {
          throw new Error("Failed to fetch satellite data");
        }

        let results = Array.isArray(data) ? data : [];

        const orbitSelections = filterData.orbitCodes?.map((o) => o.value) || [];
        if (orbitSelections.length) {
          const allowSet = new Set(orbitSelections);
          results = results.filter((sat) => allowSet.has(sat.orbitCode));
        }

        setSatData(results);
      } catch (error) {
        setFetchError(error instanceof Error ? error.message : "Failed to fetch satellite data");
        setSatData([]);
      }
    }
  };

  const filteredData = useMemo(() => {
    if (!searchTerm) return satData;

    const searchLower = searchTerm.toLowerCase();
    return satData.filter(
      (sat) =>
        sat.name.toLowerCase().includes(searchLower) ||
        sat.noradCatId.toLowerCase().includes(searchLower)
    );
  }, [satData, searchTerm]);

  const handleDropdown = (key: string, value: SelectValue[]) => {
    if (key === "attributes") {
      setTempAttributes(value);
    } else {
      setFilterData((prev) => ({
        ...prev,
        [key]: value,
      }));
    }
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handleRowSelect = (selected: SatelliteObject[]) => {
    if (selected.length > MAX_SELECTION) {
      setSelectionError(
        `You can only select up to ${MAX_SELECTION} satellites at a time`
      );
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
    setTempAttributes(newAttributes);
  };

  const handleApplyFilters = async () => {
    if (!tempAttributes.length) {
      setFilterData(prev => ({
        ...prev,
        attributes: DEFAULT_ATTRIBUTES,
      }));
      setSelectedAttributes(DEFAULT_ATTRIBUTES);
    } else {
      setFilterData(prev => ({
        ...prev,
        attributes: tempAttributes,
      }));
      setSelectedAttributes(tempAttributes);
    }
    await getSatelliteData(true);
  };

  useEffect(() => {
    getSatelliteData();
  }, []);

  useEffect(() => {
    setSelectedSatellites([]);
    localStorage.removeItem(STORAGE_KEY);
  }, [satData]);

  useEffect(() => {
    setTempAttributes(filterData.attributes || DEFAULT_ATTRIBUTES);
  }, [filterData.attributes]);

  return {
    // Data
    loading,
    satData: filteredData,
    columns: cols,
    fetchError,

    // Filter state
    filterData,
    selectedAttributes: tempAttributes,

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

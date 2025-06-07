import { useEffect, useState } from "react";

import { useAxios } from "@hooks/use-axios";
import type { SatelliteObject } from "./types";

export default function useSatelliteData() {
  const [satData, setSatData] = useState<SatelliteObject[]>([]);

  const { loading, get } = useAxios();

  const getSatelliteData = async () => {
    const { data } = await get({
      url: "/satellites",
    });

    setSatData(data);
  };

  useEffect(() => {
    getSatelliteData();
  }, []);

  return {
    loading,
    satData,
  };
}

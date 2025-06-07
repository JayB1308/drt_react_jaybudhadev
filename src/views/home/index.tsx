import DataTable from "@components/datatable";

import useSatelliteData from "./use-satellite";
import Columns from "./columns";
import type { SatelliteObject } from "./types";

export default function Home() {
  const { loading, satData } = useSatelliteData();
  const cols = Columns();

  return (
    <div>
      <DataTable<SatelliteObject>
        data={satData}
        columns={cols}
        loading={loading}
      />
    </div>
  );
}

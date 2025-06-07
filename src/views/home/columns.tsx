import { createColumnHelper } from "@tanstack/react-table";
import type { SatelliteObject } from "./types";

export default function Columns() {
  const columnHelper = createColumnHelper<SatelliteObject>();

  return [
    columnHelper.accessor("noradCatId", {
      id: "noradCatId",
      header: "NORAD ID",
      cell: (info) => info.getValue(),
      enableSorting: true,
    }),
    columnHelper.accessor("intlDes", {
      header: "Intl Designator",
      cell: (info) => info.getValue() ?? "-",
    }),
    columnHelper.accessor("name", {
      header: "Object Name",
      cell: (info) => info.getValue(),
    }),
  ];
}

import { createColumnHelper } from "@tanstack/react-table";
import type { SatelliteObject } from "./types";
import type { SelectValue } from "@components/select";

type ColumnDefinition = {
  id: string;
  header: string;
  accessor: (row: SatelliteObject) => unknown;
  enableSorting?: boolean;
};


const ALL_COLUMNS: Record<string, ColumnDefinition> = {
  name: {
    id: "name",
    header: "Name",
    accessor: (row: SatelliteObject) => row.name,
    enableSorting: true,
  },
  noradCatId: {
    id: "noradCatId",
    header: "NORAD ID",
    accessor: (row: SatelliteObject) => row.noradCatId,
    enableSorting: true,
  },
  orbitCode: {
    id: "orbitCode",
    header: "Orbit Code",
    accessor: (row: SatelliteObject) => row.orbitCode ?? "-",
  },
  objectType: {
    id: "objectType",
    header: "Object Type",
    accessor: (row: SatelliteObject) => row.objectType ?? "-",
  },
  countryCode: {
    id: "countryCode",
    header: "Country Code",
    accessor: (row: SatelliteObject) => row.countryCode ?? "-",
    enableSorting: true,
  },
  launchDate: {
    id: "launchDate",
    header: "Launch Date",
    accessor: (row: SatelliteObject) => row.launchDate ?? "-",
    enableSorting: true,
  },
  intlDes: {
    id: "intlDes",
    header: "Intl Designator",
    accessor: (row: SatelliteObject) => row.intlDes ?? "-",
  },
  decayDate: {
    id: "decayDate",
    header: "Decay Date",
    accessor: (row: SatelliteObject) => row.decayDate ?? "-",
  },
  launchSiteCode: {
    id: "launchSiteCode",
    header: "Launch Site Code",
    accessor: (row: SatelliteObject) => row.launchSiteCode ?? "-",
  },
};

const DEFAULT_COLUMNS = ["name", "noradCatId", "orbitCode", "objectType", "countryCode", "launchDate"];

export default function useColumns(selectedAttributes?: SelectValue[]) {
  const columnHelper = createColumnHelper<SatelliteObject>();

  const columnsToShow = selectedAttributes?.length
    ? selectedAttributes.map(attr => attr.value)
    : DEFAULT_COLUMNS;

  return columnsToShow
    .filter(colId => ALL_COLUMNS[colId as keyof typeof ALL_COLUMNS])
    .map(colId => {
      const colDef = ALL_COLUMNS[colId as keyof typeof ALL_COLUMNS];
      return columnHelper.accessor(colDef.accessor, {
        id: colDef.id,
        header: colDef.header,
        enableSorting: colDef.enableSorting ?? false,
      });
    });
}

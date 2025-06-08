import { useRef, useState } from "react";
import {
  useReactTable,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";

interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T, unknown>[];
  loading?: boolean;
  height?: number;
  selectedRows?: T[];
  onRowSelect?: (selectedRows: T[]) => void;
  maxSelection?: number;
}

export default function DataTable<T>({
  data,
  columns,
  loading,
  height = 550,
  selectedRows = [],
  onRowSelect,
  maxSelection,
}: DataTableProps<T>) {
  const [sortingState, setSortingState] = useState<SortingState>([]);
  const tableContainerRef = useRef<HTMLDivElement>(null);

  const selectionColumn: ColumnDef<T, unknown> = {
    id: "select",
    header: ({ table }) => {
      const isAllSelected = table.getIsAllRowsSelected();
      const isSomeSelected = table.getIsSomeRowsSelected();
      const isMaxReached = maxSelection !== undefined && selectedRows.length >= maxSelection;

      return (
        <div className="flex items-center gap-1.5">
          <input
            type="checkbox"
            checked={isAllSelected}
            ref={(input) => {
              if (input) {
                input.indeterminate = isSomeSelected;
              }
            }}
            onChange={(e) => {
              if (maxSelection !== undefined) {
                if (e.target.checked) {
                  const rowsToSelect = data.slice(0, maxSelection);
                  const newSelection = rowsToSelect.reduce((acc, _, index) => {
                    acc[index] = true;
                    return acc;
                  }, {} as Record<number, boolean>);
                  table.setRowSelection(newSelection);
                } else {
                  table.toggleAllRowsSelected(false);
                }
              } else {
                table.toggleAllRowsSelected(e.target.checked);
              }
            }}
            disabled={isMaxReached && !isAllSelected}
            className="h-4 w-4 rounded border-gray-300"
          />
          <span className="text-sm text-gray-600">Select All</span>
        </div>
      );
    },
    cell: ({ row }) => {
      const isMaxReached = maxSelection !== undefined && selectedRows.length >= maxSelection;
      const isSelected = row.getIsSelected();

      return (
        <div className="flex justify-start">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={(e) => {
              if (isMaxReached && !isSelected) {
                return;
              }
              row.toggleSelected(e.target.checked);
            }}
            disabled={isMaxReached && !isSelected}
            className="h-4 w-4 rounded border-gray-300"
          />
        </div>
      );
    },
    size: 16,
  };

  const table = useReactTable({
    data,
    columns: [selectionColumn, ...columns],
    state: {
      sorting: sortingState,
      rowSelection: selectedRows.reduce((acc, row) => {
        const index = data.findIndex((item) => item === row);
        if (index !== -1) {
          acc[index] = true;
        }
        return acc;
      }, {} as Record<number, boolean>),
    },
    onSortingChange: setSortingState,
    onRowSelectionChange: (updater) => {
      if (onRowSelect) {
        const newSelection = typeof updater === 'function' 
          ? updater(table.getState().rowSelection)
          : updater;
        
        const selectedItems = Object.keys(newSelection)
          .map(Number)
          .map(index => data[index]);
        
        onRowSelect(selectedItems);
      }
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    enableRowSelection: true,
  });

  const { rows } = table.getRowModel();

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    estimateSize: () => 500,
    getScrollElement: () => tableContainerRef.current,
    measureElement:
      typeof window !== "undefined" &&
      navigator.userAgent.indexOf("Firefox") === -1
        ? (el) => el?.getBoundingClientRect().height
        : undefined,
    overscan: 50,
  });

  const virtualRows = rowVirtualizer.getVirtualItems();

  return (
    <div>
      {loading ? (
        <p className="p-4 text-center">Loading...</p>
      ) : (
        <>
          <div className="flex justify-between items-center mb-3 px-3 py-2 bg-gray-50 rounded-md border border-gray-200">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-500">Total Rows:</span>
              <span className="text-sm font-semibold text-navy bg-white px-2 py-0.5 rounded border border-gray-200">
                {data.length}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-500">Selected Rows:</span>
              <span className="text-sm font-semibold text-navy bg-white px-2 py-0.5 rounded border border-gray-200">
                {selectedRows.length}
              </span>
            </div>
          </div>
          <div
            ref={tableContainerRef}
            className="relative overflow-auto border rounded-md"
            style={{ height }}
          >
            <table className="grid min-w-full">
              <thead className="sticky top-0 z-[1] grid bg-white border-b border-navy">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id} className="flex w-full bg-white">
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        onClick={header.column.getToggleSortingHandler()}
                        className="flex-1 p-2 text-left text-sm font-medium text-gray-700"
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {{
                          asc: " 🔼",
                          desc: " 🔽",
                        }[header.column.getIsSorted() as string] ?? null}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>

              <tbody
                className="grid relative"
                style={{
                  height: `${rowVirtualizer.getTotalSize()}px`,
                }}
              >
                {virtualRows.map((virtualRow) => {
                  const row = rows[virtualRow.index];
                  return (
                    <tr
                      key={row.id}
                      data-index={virtualRow.index}
                      ref={(el) => rowVirtualizer.measureElement(el)}
                      className={`flex w-full absolute hover:bg-gray-50 hover:text-navy transition-colors ${
                        row.getIsSelected() ? 'bg-blue-50 text-navy' : ''
                      }`}
                      style={{
                        transform: `translateY(${virtualRow.start}px)`,
                      }}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <td key={cell.id} className="flex-1 p-2 text-sm border-b group-hover:text-navy">
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

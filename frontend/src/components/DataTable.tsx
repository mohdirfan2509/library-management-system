import React from 'react';

export interface Column<T> {
  header: string;
  accessor: keyof T | ((item: T) => React.ReactNode);
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  emptyMessage?: string;
  rowKey?: (item: T) => string;
}

export function DataTable<T>({ data, columns, loading, emptyMessage = 'No data available', rowKey }: DataTableProps<T>) {
  if (loading) {
    return <div className="p-4 text-center">Loading...</div>;
  }

  if (data.length === 0) {
    return <div className="p-4 text-center text-gray-500">{emptyMessage}</div>;
  }

  return (
    <div className="overflow-x-auto shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
      <table className="min-w-full divide-y divide-gray-300">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((col, idx) => (
              <th key={idx} className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {data.map((item, rowIdx) => (
            <tr key={rowKey ? rowKey(item) : rowIdx}>
              {columns.map((col, colIdx) => (
                <td key={colIdx} className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  {typeof col.accessor === 'function' ? col.accessor(item) : String(item[col.accessor] as any)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

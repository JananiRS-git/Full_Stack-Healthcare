import React from 'react';
interface Column<T> {
  header: string;
  accessor: keyof T;
  render?: (item: T) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  emptyMessage?: string;
}

function DataTable<T>({columns, data, emptyMessage }: DataTableProps<T>) {
  if (data.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 dark:text-gray-600 mb-2">
          <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <p className="text-gray-500 dark:text-gray-400 text-lg">{emptyMessage || 'No records found.'}</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
      <table className="min-w-full table-auto">
        <thead>
          <tr className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 border-b-2 border-gray-200 dark:border-gray-600">
            {columns.map((col) => (
              <th key={col.header} className="px-6 py-4 text-left text-sm font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider whitespace-nowrap">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {data.map((row, idx) => (
            <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150 even:bg-gray-50/50 dark:even:bg-gray-800/30">
              {columns.map((col) => (
                <td key={col.header} className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100 whitespace-nowrap">
                  {col.render ? col.render(row) : (row[col.accessor] as any)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DataTable;

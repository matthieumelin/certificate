import { useState } from 'react';
import { LuArrowUpDown } from 'react-icons/lu';

interface Column<T> {
    key: keyof T;
    label: string;
    sortable?: boolean;
    render?: (value: T[keyof T], row: T) => React.ReactNode;
}

interface DataTableProps<T extends Record<string, any>> {
    data: T[];
    columns: Column<T>[];
    keyField: keyof T;
}

interface SortConfig<T> {
    key: keyof T | null;
    direction: 'asc' | 'desc';
}

function DataTable<T extends Record<string, any>>({
    data,
    columns,
    keyField
}: DataTableProps<T>) {
    const [sortConfig, setSortConfig] = useState<SortConfig<T>>({ key: null, direction: 'asc' });
    const [sortedData, setSortedData] = useState<T[]>(data);

    const handleSort = (key: keyof T) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });

        const sorted = [...sortedData].sort((a, b) => {
            const aVal = a[key];
            const bVal = b[key];

            if (aVal < bVal) return direction === 'asc' ? -1 : 1;
            if (aVal > bVal) return direction === 'asc' ? 1 : -1;
            return 0;
        });
        setSortedData(sorted);
    };

    return (
        <div className="bg-neutral-950">
            <div className="w-full mx-auto">
                <div className="bg-neutral-900 rounded-lg border border-neutral-800 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-neutral-800 bg-neutral-900">
                                    {columns.map((column) => (
                                        <th key={String(column.key)} className="px-6 py-4 text-left whitespace-nowrap">
                                            {column.sortable !== false ? (
                                                <button
                                                    onClick={() => handleSort(column.key)}
                                                    className="flex items-center gap-2 text-neutral-300 font-medium hover:text-white transition-colors"
                                                >
                                                    {column.label}
                                                    <LuArrowUpDown className="w-4 h-4" />
                                                </button>
                                            ) : (
                                                <span className="text-neutral-300 font-medium">
                                                    {column.label}
                                                </span>
                                            )}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {sortedData.map((row) => (
                                    <tr
                                        key={String(row[keyField])}
                                        className="border-b border-neutral-800 hover:bg-neutral-800/50 transition-colors"
                                    >
                                        {columns.map((column) => (
                                            <td key={String(column.key)} className="px-6 py-4 text-neutral-300 whitespace-nowrap">
                                                {column.render
                                                    ? column.render(row[column.key], row)
                                                    : String(row[column.key])
                                                }
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default DataTable;
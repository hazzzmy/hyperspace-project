import React from "react";
import { TreeFeature, Location } from "@/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ColumnDef, flexRender, Table as ReactTable} from "@tanstack/react-table";

interface PlantationTableProps {
    table: ReactTable<TreeFeature>;
    columns: ColumnDef<TreeFeature>[];
}

const PlantationTable: React.FC<PlantationTableProps> = ({ table, columns}) => {
    return (
        <div className="h-full overflow-auto rounded-md border w-full">
            <Table className="bg-card w-full">
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup:any) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header:any) => (
                                <TableHead key={header.id} className="max-w-[10px]">
                                    {header.isPlaceholder
                                        ? null
                                        : flexRender(
                                            header.column.columnDef.header,
                                            header.getContext()
                                        )}
                                </TableHead>
                            ))}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {table.getRowModel().rows.length ? (
                        table.getRowModel().rows.map((row:any) => (
                            <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                                {row.getVisibleCells().map((cell:any) => (
                                    <TableCell key={cell.id} className="max-w-[10px]">
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={columns.length} className="h-24 text-center">
                                No results.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
};

export default PlantationTable;

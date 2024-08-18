import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { capitalize } from "lodash";

interface FilterPlantationTableProps {
    selectedColumn: string;
    setSelectedColumn: React.Dispatch<React.SetStateAction<string>>;
    inputValue: string;
    handleChangeInput: (e: React.ChangeEvent<HTMLInputElement>, column: string) => void;
    columns: any;
    countData: number;
}

const FilterPlantationTable: React.FC<FilterPlantationTableProps> = ({ selectedColumn, setSelectedColumn, inputValue, handleChangeInput, columns, countData }) => {
    return (
        <div className="flex flex-row gap-2 w-full items-center">
            <Select onValueChange={value => setSelectedColumn(value)}>
                <SelectTrigger className="w-1/4">
                    <SelectValue placeholder={selectedColumn} />
                </SelectTrigger>
                <SelectContent>
                    {columns.map((column: any) => (
                        <SelectItem key={column.id} value={column.id}>
                            {capitalize(column.id)}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <Input
                placeholder={`Filter by ${selectedColumn}`}
                value={inputValue}
                onChange={(e) => handleChangeInput(e, selectedColumn)}
                className="w-2/4"
            />
            <div className="flex w-1/4 bg-white dark:bg-black border justify-center items-center p-2 rounded-md">
                <p className="dark:text-white text-md">Count : {countData}</p>
            </div>
        </div>
    );
};

export default FilterPlantationTable;

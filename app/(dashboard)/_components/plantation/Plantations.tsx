"use client"
import React, { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import { useQuery } from "@tanstack/react-query";
import SkeletonWrapper from "@/components/SkeletonWrapper";
import { TreeFeature, Location } from "@/types";
import {
    useReactTable,
    SortingState,
    ColumnFiltersState,
    VisibilityState,
    getCoreRowModel,
    getFilteredRowModel,
    getSortedRowModel
} from "@tanstack/react-table";
import FilterPlantationTable from "./FilterPlantationTable";
import PlantationTable from "./PlantationTable";
import { PlantationColumnDef } from "./PlantationColumnDef";

interface PlantationsProps {
    onGeoDataChange: (data: any) => void;
    onCenterMapChange: (location: Location) => void;
}

const Plantations: React.FC<PlantationsProps> = ({ onGeoDataChange, onCenterMapChange }) => {
    const [data, setData] = useState<TreeFeature[]>([]);
    const [selectedColumn, setSelectedColumn] = useState<string>("type");
    const [inputValue, setInputValue] = useState<string>("");
    const debouncedInputValue = useDebounce(inputValue, 1000);
    const [countData, setCountData] = useState<number>(0);
    const [sorting, setSorting] = useState<SortingState>([{ id: "id", desc: false }]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = useState({});

    const handleZoomToLocations = (location: Location) => {
        onCenterMapChange(location);
    };

    const columns = PlantationColumnDef({ onZoomToLocation: handleZoomToLocations });

    const dataQuery = useQuery({
        queryKey: ["content", "plantations"],
        queryFn: async () => {
            const url = `/api/content/plantations`;
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        },
    });

    useEffect(() => {
        if (dataQuery.data) {
            const compiledFeatures: TreeFeature[] = dataQuery.data.features.map((feature: any) => {
                const [longitude, latitude] = feature.geometry.coordinates;
                return { ...feature.properties, longitude, latitude };
            });
            if (compiledFeatures.length > 0) {
                setData(compiledFeatures);
                setCountData(compiledFeatures.length);
                onGeoDataChange(dataQuery.data);
            }
        }
    }, [dataQuery.data]);

    const table = useReactTable({
        data: data,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    });

    const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>, column: string) => {
        const newValue = e.target.value;
        setInputValue(newValue);
        table.getColumn(column)?.setFilterValue(newValue);
    };

    useEffect(() => {
        if (debouncedInputValue[0] && dataQuery.data) {
            const filteredData = data.filter((row: any) => {
                return row[selectedColumn]?.toString().toLowerCase().includes(debouncedInputValue[0].toLowerCase()) as any;
            });

            const filteredFeatures = dataQuery.data.features.filter((feature: any) => {
                return feature.properties[selectedColumn]?.toString().toLowerCase().includes(debouncedInputValue[0].toLowerCase());
            });

            const filteredGeoJson = {
                type: "FeatureCollection",
                features: filteredFeatures,
            };
            onGeoDataChange(filteredGeoJson as any);
            setCountData(filteredData.length);

            return () => {
                onGeoDataChange(dataQuery.data);
                setCountData(data.length);
            };
        }
    }, [debouncedInputValue[0], dataQuery.data]);

    if (dataQuery.isLoading) {
        return (
            <SkeletonWrapper isLoading={true}>
                <div className="h-full mt-4">Loading...</div>
            </SkeletonWrapper>
        );
    }

    return (
        <SkeletonWrapper isLoading={dataQuery.isLoading}>
            <div className="flex flex-col gap-2 w-full h-[70vh] bg-[rgba(50,50,50,0.8)] p-2 mt-2 rounded">
                <FilterPlantationTable
                    selectedColumn={selectedColumn}
                    setSelectedColumn={setSelectedColumn}
                    inputValue={inputValue}
                    handleChangeInput={handleChangeInput}
                    columns={table.getAllColumns()}
                    countData={countData}
                />
                <PlantationTable table={table} columns={columns} />
            </div>
        </SkeletonWrapper>
    );
};

export default Plantations;

import { ColumnDef } from "@tanstack/react-table";
import { TreeFeature, Location } from "@/types";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, Send } from "lucide-react";
import { capitalize } from "lodash";

interface ColumnProps {
    onZoomToLocation: (location: Location) => void;
}

export const PlantationColumnDef = ({ onZoomToLocation }: ColumnProps): ColumnDef<TreeFeature>[] => [
    {
        accessorKey: "id",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                No
                <ArrowUpDown className="ml-1 h-2 w-2" />
            </Button>
        ),
        cell: ({ row }) => <div className="lowercase">{row.getValue("id")}</div>,
    },
    {
        accessorKey: "type",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Type
                <ArrowUpDown className="ml-1 h-2 w-2" />
            </Button>
        ),
        cell: ({ row }) => <div>{row.getValue("type") as string}</div>,
    },
    {
        accessorKey: "age",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Age
                <ArrowUpDown className="ml-1 h-2 w-2" />
            </Button>
        ),
        cell: ({ row }) => <div>{row.getValue("age") as number}</div>,
    },
    {
        accessorKey: "health",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Health
                <ArrowUpDown className="ml-1 h-2 w-2" />
            </Button>
        ),
        cell: ({ row }) => {
            const healthValue = row.getValue("health") as string;
            const colorClass = getColorByHealth(healthValue);
            return <div className={colorClass}>{capitalize(healthValue)}</div>;
        },
    },
    {
        id: "actions",
        enableHiding: false,
        header: () => <div>Actions</div>,
        cell: ({ row }) => {
            const site = row.original;
            return (
                <Button
                    onClick={() =>
                        onZoomToLocation({ longitude: site.longitude, latitude: site.latitude })
                    }
                    variant="ghost"
                    className="h-8 w-8 p-0"
                >
                    <span className="sr-only">Open menu</span>
                    <Send className="h-3 w-3" />
                </Button>
            );
        },
    },
];

export const getColorByHealth = (health: string) => {
    switch (health.toLowerCase()) {
        case "critical":
            return "text-red-500";
        case "poor":
            return "text-orange-500";
        case "fair":
            return "text-yellow-500";
        case "good":
            return "text-green-200";
        case "excellent":
            return "text-green-800";
        default:
            return "text-gray-500";
    }
};

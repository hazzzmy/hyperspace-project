"use client";

import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const tabOptions = [
    { value: "plantation", label: "Plantation" },
    { value: "wildlife", label: "Wildlife" },
    { value: "ship-tracking", label: "Ship Tracking" },
];

const TabsMenu = ({ setSelectedTab }: { setSelectedTab: (tabValue: string) => void }) => {
    const [tab, setTab] = useState<string>("plantation");

    const handleTabChange = (tabValue: string) => {
        setSelectedTab(tabValue);
        setTab(tabValue);
    };

    return (
        <Tabs defaultValue={tab} className="w-full" onValueChange={handleTabChange}>
            <TabsList className="grid w-full grid-cols-3 bg-[rgba(50,50,50,0.8)] gap-2">
                {tabOptions.map(({ value, label }) => (
                    <TabsTrigger key={value} value={value}>
                        {label}
                    </TabsTrigger>
                ))}
            </TabsList>
        </Tabs>
    );
};

export default TabsMenu;

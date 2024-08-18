"use client"

import React, {useState } from 'react'
import {
    Tabs,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import Dock from './Dock';
import Ship from './Ship';
import { FeatureCollection, GeoJsonProperties, Geometry } from 'geojson';
import { Location } from '@/types';


type ShipTrackingProps = {
    onDockDataChange: (data: FeatureCollection<Geometry, GeoJsonProperties>) => void
    onShipDataChange: (data: FeatureCollection<Geometry, GeoJsonProperties>) => void
    onCenterMapChange: (location: Location) => void
}

const ShipTracking: React.FC<ShipTrackingProps> = ({ onDockDataChange, onShipDataChange,  onCenterMapChange }) => {
    const [tab, setTab] = useState<string>('dock')

    const handleTabChange = (tabValue: string) => {
        setTab(tabValue);
    };

    return (
            <div className="flex flex-col h-[70vh] mt-2 bg-[rgba(50,50,50,0.8)] rounded p-2 gap-2">
                <Tabs defaultValue={tab} className="w-full" onValueChange={handleTabChange}>
                    <TabsList className="grid w-full grid-cols-2 bg-[rgba(50,50,50,0.8)] gap-2">
                        <TabsTrigger
                            value="dock"
                        >
                            Dock
                        </TabsTrigger>
                        <TabsTrigger
                            value="ship"
                        >
                            Ship
                        </TabsTrigger>
                    </TabsList>
                </Tabs>
                {tab === 'dock' && <Dock onDataChange={onDockDataChange} onCenterMapChange={onCenterMapChange}/>}
                {tab === 'ship' && <Ship onDataChange={onShipDataChange} onCenterMapChange={onCenterMapChange}/>}
            </div>
    )
}

export default ShipTracking

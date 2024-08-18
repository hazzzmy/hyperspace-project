"use client" 

import React, { useState } from "react";
import Plantations from "./plantation/Plantations";
import Wildlife from "./wildlife/Wildlife";
import ShipTracking from "./ship-tracking/ShipTracking";
import WildlifeMap from "./wildlife/WildlifeMap";
import ShipTrackingMap from "./ship-tracking/ShipTrackingMap";
import TabsMenu from "./TabsMenu";
import { Location, WildlifeType } from '@/types'; 
import { FeatureCollection, GeoJsonProperties, Geometry } from 'geojson';
import PlantationMap from "./plantation/PlantationMap";

const MainContainer = () => {
    // State hooks for managing component data
    const [content, setContent] = useState<string>("plantation");
    const [activeChapter, setActiveChapter] = useState<string>('serengeti');
    const [dockData, setDockData] = useState<FeatureCollection<Geometry, GeoJsonProperties>>({ type: "FeatureCollection", features: [] });
    const [shipData, setShipData] = useState<FeatureCollection<Geometry, GeoJsonProperties>>({ type: "FeatureCollection", features: [] });
    const [wildlifeData, setWildLifeData] = useState<WildlifeType[]>([]);
    const [plantationData, setPlantationData] = useState<FeatureCollection<Geometry, GeoJsonProperties>>({ type: "FeatureCollection", features: [] });
    const [centerMap, setCenterMap] = useState<Location>({ longitude: 106.779904, latitude: -6.584033 });

    // Handlers for updating state
    const handleChangeTabs = (tab: string) => setContent(tab);
    const handleChangeWildlifeData = (data: WildlifeType[]) => setWildLifeData(data);
    const handleGeoChangeData = (data: FeatureCollection<Geometry, GeoJsonProperties>) => setPlantationData(data);
    const handleCenterMapChange = (location: Location) => setCenterMap(location);
    const handleChangeDockData = (data: any) => setDockData(data);
    const handleChangeShipData = (data: any) => setShipData(data);

    return (
        <div className="border-b bg-hyperspace bg-cover w-full h-full" style={{ backgroundImage: "url('/bg.png')" }}>
            <div className="flex flex-col gap-4 p-6 h-full">
                <div className="flex flex-row gap-4 w-full h-full">
                    <div className="w-5/12 h-full flex-col gap-4">
                        <div className="flex items-center justify-center w-full">
                            <TabsMenu setSelectedTab={handleChangeTabs} />
                        </div>
                        {content === "plantation" && <Plantations onGeoDataChange={handleGeoChangeData} onCenterMapChange={handleCenterMapChange} />}
                        {content === "wildlife" && <Wildlife onDataChange={handleChangeWildlifeData} activeChapter={activeChapter} setActiveChapter={setActiveChapter} />}
                        {content === "ship-tracking" && <ShipTracking onDockDataChange={handleChangeDockData} onShipDataChange={handleChangeShipData} onCenterMapChange={handleCenterMapChange} />}
                    </div>
                    <div className="w-7/12 h-full">
                        {content === "plantation" && <PlantationMap data={plantationData} centerMap={centerMap} />}
                        {content === "wildlife" && <WildlifeMap activeChapter={activeChapter} setActiveChapter={setActiveChapter} data={wildlifeData} />}
                        {content === "ship-tracking" && <ShipTrackingMap dockData={dockData} shipData={shipData} centerMap={centerMap} />}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MainContainer;

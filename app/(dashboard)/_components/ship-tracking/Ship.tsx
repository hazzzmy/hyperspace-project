"use client"

import SkeletonWrapper from '@/components/SkeletonWrapper';
import { Button } from '@/components/ui/button';
import { Card, CardContent} from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { MoveRightIcon, Send } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import TimePlayer from './TimePlayer';
import { FeatureCollection, GeoJsonProperties, Geometry } from 'geojson';
import { Location } from '@/types';

type ShipProps = {
    onDataChange: (data: FeatureCollection<Geometry, GeoJsonProperties>) => void
    onCenterMapChange: (location: Location) => void;
}

const Ship: React.FC<ShipProps> = ({ onDataChange, onCenterMapChange }) => {
    const [timeList, setTimeList] = useState<string[]>([])
    const [activeData, setActiveData] = useState<any[]>([])

    const handleZoomToLocations = (location: Location) => {
        onCenterMapChange(location)
    }

    const dataQuery = useQuery({
        queryKey: ["content", "dock"],
        queryFn: async () => {
            const url = `/api/content/ship_log`

            const response = await fetch(
                url
            );
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            return response.json() as Promise<any>;
        },
    });

    useEffect(() => {
        if (dataQuery.data) {
            const timeList = [...new Set(dataQuery.data.features.map((feature: any) => feature.properties.timestamp))]
            setTimeList(timeList as string[])
            const filteredData = dataQuery.data.features.filter((feature: any) => feature.properties.timestamp === timeList[0])
            setActiveData(filteredData)
        }
    }, [dataQuery.data])

    const handlePlayEvent = (timestamp: string) => {
        if (dataQuery.data) {
            const filteredData = dataQuery.data.features.filter((feature: any) => feature.properties.timestamp === timestamp)
            onDataChange( {
                "type": 'FeatureCollection',
                "features": filteredData
                }
            )

            setActiveData(filteredData)
        }
    };


    if (dataQuery.isLoading) {
        return (
            <SkeletonWrapper isLoading={true}>
                <div className="h-full mt-4">Loading...</div>
            </SkeletonWrapper>
        );
    }

    if (dataQuery.error) {
        return <div>Error: {dataQuery.error.message}</div>;
    }

    return (
        <SkeletonWrapper isLoading={false}>
            <div className="flex flex-col h-full w-full gap-4">
                <TimePlayer timestamps={timeList} onPlayEvent={handlePlayEvent} />
                <div className="flex flex-col w-full gap-1 h-full">
                    {activeData?.length > 0 &&
                        activeData.map((data: any, index: number) => {
                            return (
                                <Card
                                    key={index}
                                    className="w-full bg-[rgba(25,25,25,0.8)] rounded-lg shadow-lg"
                                >
                                    <CardContent className="flex flex-row justify-between items-center p-4">
                                        <div className="flex flex-col w-full">
                                            <div className='flex w-full flex-row justify-between'>
                                                <h4 className="text-lg font-semibold text-white">{data.properties.shipName}</h4>
                                                <div className='flex flex-row items-center gap-2'>
                                                    <p className="text-xs text-gray-300">Status: {data.properties.status}</p> 
                                                    |
                                                    <p className={`text-xs flex flex-row items-center ${data.properties.signal === 1 ? "text-green-500" : "text-red-500"} min-w-[80px]`}>
                                                        Signal: {data.properties.signal === 1 ? "Good" : "Bad"}
                                                    </p>
                                                    |
                                                    <Button onClick={() => handleZoomToLocations({ longitude: data.geometry.coordinates[0], latitude: data.geometry.coordinates[1] })} variant="ghost" className="h-5 w-5 p-0">
                                                        <Send className="h-3 w-3" />
                                                    </Button>
                                                </div>
                                            </div>
                                            <div className='flex flex-row items-center gap-2'>
                                                <p className="text-xs text-gray-300">Max Capacity: {data.properties.maxCapacity}</p>

                                                <p className="text-xs text-gray-300">Current Capacity: {data.properties.currentCapacity}</p>
                                            </div>
                                            <p className="text-xs text-gray-300 flex items-center">
                                                {data.properties.origin}
                                                {data.properties.destination &&
                                                    <>
                                                        <MoveRightIcon className='text-gray-400 w-4 h-4 mx-1' />
                                                        {data.properties.destination}
                                                    </>
                                                }
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })
                    }
                </div>
            </div>
        </SkeletonWrapper>
    )
}

export default Ship
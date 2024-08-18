"use client"

import SkeletonWrapper from '@/components/SkeletonWrapper';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Location } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { Send } from 'lucide-react';
import React, { useEffect} from 'react'
import { FeatureCollection, GeoJsonProperties, Geometry } from 'geojson';


type DockProps = {
    onDataChange: (data: FeatureCollection<Geometry, GeoJsonProperties>) => void
    onCenterMapChange: (location: Location) => void;
}

const Dock: React.FC<DockProps> = ({ onDataChange,  onCenterMapChange }) => {
    
    const handleZoomToLocations = (location: Location) => {
        onCenterMapChange(location)
    }

    const dockData = useQuery({
        queryKey: ["content", "dock"],
        queryFn: async () => {
            const url = `/api/content/dock`

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
        if (dockData.data) {
            onDataChange(dockData.data)
        }
    }, [dockData.data])


    if (dockData.isLoading) {
        return (
            <SkeletonWrapper isLoading={true}>
                <div className="h-full mt-4">Loading...</div>
            </SkeletonWrapper>
        );
    }

    if (dockData.error) {
        return <div>Error: {dockData.error.message}</div>;
    }

    return (
        <SkeletonWrapper isLoading={false}>
        <div className="h-full w-full overflow-y-scroll overflow-y-hidden gap-4 pr-2">
            {dockData?.data?.features?.map((feature: any, index: number) => (
                <Card key={index} className='w-full p-0 mb-1 bg-[rgba(25,25,25,0.8)]'>
                    <CardContent className="flex flex-row justify-between item-center p-4 w-full">
                        <div className='flex flex-col w-full h-full'>
                            <h4 className="text-white text-sm">{feature.properties.name}</h4>
                            <div className='flex flex-row h-full gap-2'>
                                <p className='text-xs text-gray-400'>{feature.properties.country}</p>
                                <p className='text-xs text-gray-400'>|</p>
                                <p className='text-xs text-gray-400'>{feature.properties.city}</p>
                                <p className='text-xs text-gray-400'>|</p>
                                <p className='text-xs text-gray-400'>Capacity: {feature.properties.capacity}</p>
                            </div>
                        </div>

                        <Button onClick={() => handleZoomToLocations({ longitude: feature.geometry.coordinates[0], latitude: feature.geometry.coordinates[1] })} variant="ghost" className="h-8 w-8 p-0">
                            <Send className="h-3 w-3" />
                        </Button>
                    </CardContent>
                </Card>
            ))}
        </div>
    </SkeletonWrapper>
    )
}

export default Dock
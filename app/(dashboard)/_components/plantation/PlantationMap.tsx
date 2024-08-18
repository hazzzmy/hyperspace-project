"use client"

import { useEffect, useRef, useState } from 'react';
import maplibregl, { GeoJSONSource } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import CustomButtonControl from '../../../../components/map-components/CustomButtonControlOptions';
import { Radius } from 'lucide-react';
import * as turf from '@turf/turf';
import {GeoJsonFeature, Location, SourceGeoJSON, SourceTile } from '@/types';
import { FeatureCollection, GeoJsonProperties, Geometry } from 'geojson';
import { genMarkerImages, getUniqueColors } from '@/lib/utils';

interface MapProps {
    data: FeatureCollection<Geometry, GeoJsonProperties>;
    centerMap: Location;
}

type Source = SourceGeoJSON | SourceTile;

const sourceList: Source[] = [
    {
        name: "measure-geojson",
        type: "geojson",
        minZoom: 6,
        maxZoom: 20,
        data: {
            type: 'FeatureCollection',
            features: []
        },
    },
    {
        name: "tree-geojson",
        type: "geojson",
        minZoom: 6,
        maxZoom: 20,
        data: {
            type: 'FeatureCollection',
            features: []
        },
    },
];

const PlantationMap: React.FC<MapProps> = ({ data, centerMap }) => {

    const mapContainer = useRef<HTMLDivElement | null>(null);
    const mapInstance = useRef<maplibregl.Map | null>(null);
    const measureRef = useRef<boolean>(false);
    const [distance, setDistance] = useState<string>("");

    const geojson = useRef({
        type: 'FeatureCollection',
        features: [] as any[]
    });
    const linestring = useRef({
        type: 'Feature',
        geometry: {
            type: 'LineString',
            coordinates: [] as any[]
        }
    });

    useEffect(() => {
        if (!mapContainer.current) return;

        mapInstance.current = new maplibregl.Map({
            container: mapContainer.current,
            center: [106.779867, -6.585057],
            zoom: 14,
            pitch: 0,
            style: {
                version: 8,
                glyphs: `https://api.maptiler.com/fonts/{fontstack}/{range}.pbf?key=${process.env.NEXT_PUBLIC_MAPTILER_KEY}`,
                sources: {
                    osm: {
                        type: "raster",
                        tiles: [
                            "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
                        ],
                        tileSize: 256,
                        attribution: "&copy; OpenStreetMap Contributors",
                        maxzoom: 20,
                    },
                    terrainSource: {
                        type: "raster-dem",
                        url: `https://api.maptiler.com/tiles/terrain-rgb/tiles.json?key=${process.env.NEXT_PUBLIC_MAPTILER_KEY}`,
                        tileSize: 256,
                    },
                },
                layers: [
                    {
                        id: "osm",
                        type: "raster",
                        source: "osm",
                    }
                ],
                terrain: {
                    source: "terrainSource",
                    exaggeration: 1,
                },
            },
            maxZoom: 20,
            maxPitch: 85,
        });

        mapInstance.current.addControl(new maplibregl.FullscreenControl());
        mapInstance.current.addControl(
            new maplibregl.NavigationControl({
                visualizePitch: true,
                showZoom: true,
                showCompass: true,
            })
        );

        mapInstance.current.addControl(
            new maplibregl.TerrainControl({
                source: 'terrainSource',
                exaggeration: 1,
            })
        );

        const measureControl = new CustomButtonControl({
            onClick: () => {
                measureRef.current = !measureRef.current;

                if (!measureRef.current) {
                    geojson.current.features = [];
                    linestring.current.geometry.coordinates = [];
                    (mapInstance.current?.getSource("measure-geojson") as GeoJSONSource).setData(geojson.current as any);
                }
                setDistance('');
            },
            initialActive: measureRef.current,
            icon: <Radius />,
        });

        mapInstance.current.addControl(measureControl);

        mapInstance.current.on('load', async () => {
            sourceList.forEach((source) => {
                if (source.type === "geojson") {
                    mapInstance.current?.addSource(source.name, {
                        type: source.type,
                        data: source.data,
                    });
                } else if (source.type === "vector") {
                    mapInstance.current?.addSource(source.name, {
                        type: source.type,
                        tiles: source.tiles,
                        minzoom: source.minZoom,
                        maxzoom: source.maxZoom,
                    });
                }
            });

            mapInstance.current?.addLayer({
                id: 'measure-points',
                type: 'circle',
                source: 'measure-geojson',
                paint: {
                    'circle-radius': 5,
                    'circle-color': 'blue',
                },
                filter: ['in', '$type', 'Point'],
            });

            mapInstance.current?.addLayer({
                id: 'measure-lines',
                type: 'line',
                source: 'measure-geojson',
                layout: {
                    'line-cap': 'round',
                    'line-join': 'round',
                },
                paint: {
                    'line-color': 'red',
                    'line-width': 2.5,
                    'line-dasharray': [0.5, 2.5],
                },
                filter: ['in', '$type', 'LineString'],
            });

            mapInstance.current?.on('click', (e: any) => {
                if (measureRef.current) {
                    const features = mapInstance.current?.queryRenderedFeatures(e.point, {
                        layers: ['measure-points']
                    });

                    if (geojson.current.features.length > 1) geojson.current.features.pop();
                    setDistance('');

                    if (features?.length) {
                        const id = features[0].properties?.id;
                        geojson.current.features = geojson.current.features.filter((point) => point.properties.id !== id);
                    } else {
                        const point = {
                            type: 'Feature',
                            geometry: {
                                type: 'Point',
                                coordinates: [e.lngLat.lng, e.lngLat.lat]
                            },
                            properties: {
                                id: String(new Date().getTime())
                            }
                        };

                        geojson.current.features.push(point);
                    }

                    if (geojson.current.features.length > 1) {
                        linestring.current.geometry.coordinates = geojson.current.features.map(point => point.geometry.coordinates);
                        geojson.current.features.push(linestring.current);
                        const totalDistance = turf.length(linestring.current as any, { units: 'meters' }).toFixed(1);
                        setDistance(`Total distance: ${(Number(totalDistance)).toLocaleString('en-US')} m`);

                    }

                    (mapInstance.current?.getSource("measure-geojson") as any).setData(geojson.current as any);
                }
            });

            mapInstance.current?.on('mousemove', (e) => {
                if (measureRef.current) {
                    const features = mapInstance.current?.queryRenderedFeatures(e.point, {
                        layers: ['measure-points']
                    });
                    if (mapInstance.current) {
                        mapInstance.current.getCanvas().style.cursor = features?.length ? 'pointer' : 'crosshair';
                    }
                } else {
                    if (mapInstance.current) {
                        mapInstance.current.getCanvas().style.cursor = 'pointer';
                    }
                }
            });

            if (data?.features.length > 0) {
                (mapInstance.current?.getSource("tree-geojson") as any).setData(data as any);
                const colors = getUniqueColors(data.features as GeoJsonFeature[]);
                if (colors.length > 0) {
                    colors.map(async (color) => {
                        const img = await mapInstance.current?.loadImage(genMarkerImages(color))
                        if (img) {
                            mapInstance.current?.addImage(color, img.data)
                        }
                    })
                }
                mapInstance.current?.addLayer({
                    id: 'tree-points',
                    type: 'symbol',
                    source: 'tree-geojson',
                    layout: {
                        'icon-image': ['get', 'color'],
                        'text-field': ['get', 'type'],
                        'text-font': [
                            'Open Sans Semibold',
                            'Arial Unicode MS Bold'
                        ],
                        'text-size': 8,
                        'text-offset': [0, 1.25],
                        'text-anchor': 'top'
                    },
                    paint: {
                        'text-halo-color': 'rgba(255,255,255,1)', // Shadow to enhance effect
                        'text-halo-width': 1 // Width of halo
                    },
                    filter: ['in', '$type', 'Point'],
                });

                const popup = new maplibregl.Popup({
                    closeButton: false,
                    closeOnClick: false
                });


                mapInstance.current?.on('click', (e: any) => {
                    if (mapInstance.current && mapInstance.current.getLayer('center-circle') && mapInstance.current.getSource('center-circle-source')) {
                        mapInstance.current.removeLayer('center-circle');
                        mapInstance.current.removeSource('center-circle-source');
                    }
                });

                mapInstance.current?.on('click', 'tree-points', (e: any) => {
                    if (mapInstance.current) {
                        mapInstance.current.flyTo({
                            center: e.features[0].geometry.coordinates,
                            zoom: 18
                        });

                        if (mapInstance.current.getSource('center-circle-source')) {
                            (mapInstance.current.getSource('center-circle-source') as GeoJSONSource).setData({
                                type: 'FeatureCollection',
                                features: [
                                    {
                                        type: 'Feature',
                                        geometry: {
                                            type: 'Point',
                                            coordinates: e.features[0].geometry.coordinates,
                                        },
                                    },
                                ] as any,
                            });
                        } else {
                            mapInstance.current.addSource('center-circle-source', {
                                type: 'geojson',
                                data: {
                                    type: 'FeatureCollection',
                                    features: [
                                        {
                                            type: 'Feature',
                                            geometry: {
                                                type: 'Point',
                                                coordinates: e.features[0].geometry.coordinates,
                                            },
                                        },
                                    ] as any,
                                },
                            });

                            mapInstance.current.addLayer({
                                id: 'center-circle',
                                type: 'circle',
                                source: 'center-circle-source',
                                paint: {
                                    'circle-radius': 10,
                                    'circle-color': 'rgba(255, 255, 255, 0.1)',
                                    'circle-stroke-width': 2,
                                    'circle-stroke-color': '#ffffff',
                                },
                            });
                        }
                    }
                });

                mapInstance.current?.on('mouseenter', 'tree-points', (e: any) => {
                    if (mapInstance.current) {
                        mapInstance.current.getCanvas().style.cursor = 'pointer';
                    }

                    const popupContent = `
                        <div class="popup" style="
                            background-color: ${e.features[0].properties.color}; 
                            display: flex; 
                            flex-direction: row;
                            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); 
                            overflow: hidden; 
                            max-width: 300px;
                            font-family: 'Arial', sans-serif;
                            color: #333;
                        ">
                            <img 
                                src="${e.features[0].properties.type}.jpg" 
                                alt="Tree Image" 
                                class="popup-image"
                                style="
                                    width: 100px; 
                                    height: 100px; 
                                    object-fit: cover;
                                "
                            />
                            <div class="popup-content" style="
                                padding: 10px; 
                                display: flex; 
                                flex-direction: column; 
                                justify-content: center;
                            ">
                                <p class="popup-description" style="margin: 0; font-weight: bold; font-size: 14px;">${e.features[0].properties.type}</p>
                                <p class="popup-description" style="margin: 4px 0; font-size: 13px;">${e.features[0].properties.age} years</p>
                                <p class="popup-description" style="margin: 0; font-size: 13px;">Health: ${e.features[0].properties.health}</p>
                            </div>
                        </div>
                    `;


                    const coordinates = e.features[0].geometry.coordinates.slice();
                    const description = e.features[0].properties.type;

                    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
                    }
                    if (mapInstance.current) {
                        popup.setLngLat(coordinates).setHTML(popupContent).addTo(mapInstance.current);
                    }
                });

                mapInstance.current?.on('mouseleave', 'tree-points', () => {
                    if (mapInstance.current) {
                        mapInstance.current.getCanvas().style.cursor = '';
                    }
                    popup.remove();
                });

            }
        }
        );
        return () => {
            if (mapInstance.current) {
                mapInstance.current.remove();
            }
        };

    }, [data]);

    useEffect(() => {
        if (mapInstance.current && mapInstance.current.isStyleLoaded() && centerMap) {
            if (centerMap) {
                mapInstance.current.flyTo({
                    center: [centerMap.longitude, centerMap.latitude],
                    zoom: 18,
                });

                if (mapInstance.current.getSource('center-circle-source')) {
                    (mapInstance.current.getSource('center-circle-source') as GeoJSONSource).setData({
                        type: 'FeatureCollection',
                        features: [
                            {
                                type: 'Feature',
                                geometry: {
                                    type: 'Point',
                                    coordinates: [centerMap.longitude, centerMap.latitude],
                                },
                            },
                        ] as any,
                    });
                } else {
                    mapInstance.current.addSource('center-circle-source', {
                        type: 'geojson',
                        data: {
                            type: 'FeatureCollection',
                            features: [
                                {
                                    type: 'Feature',
                                    geometry: {
                                        type: 'Point',
                                        coordinates: [centerMap.longitude, centerMap.latitude],
                                    },
                                },
                            ] as any,
                        },
                    });

                    mapInstance.current.addLayer({
                        id: 'center-circle',
                        type: 'circle',
                        source: 'center-circle-source',
                        paint: {
                            'circle-radius': 10,
                            'circle-color': 'rgba(255, 255, 255, 0.1)',
                            'circle-stroke-width': 2,
                            'circle-stroke-color': '#ffffff',
                        },
                    });
                }
            }
        }
    }, [centerMap]);

    return <div className='relative h-full rounded p-2 bg-[rgba(50,50,50,0.8)]'>
        <div id="plantationMap" ref={mapContainer} style={{ width: '100%', height: '100%' }} />
        {distance && <div
            style={{
                position: 'absolute',
                top: 10,
                left: 10,
                margin: 'auto',
                width: 'max-content',
                background: 'rgba(0, 0, 0, 0.5)',
                color: 'white',
                padding: '0.5rem 1rem',
                zIndex: 10,
                borderRadius: '0.5rem',
            }}
        >
            {distance}
        </div>}
    </div>
};

export default PlantationMap;
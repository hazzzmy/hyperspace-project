export type TreeFeature = {
    id: number;
    type: string;
    age: number;
    health: 'critical' | 'poor' | 'good' | 'fair' | 'excellent';
    longitude: number;
    latitude: number;
    color: string;
};

export type WildlifeType = {
    location: string;
    bearing: number;
    center: [number, number];
    zoom: number;
    pitch?: number;
    description: string;
    duration?: number;
    speed?: number;
    wildlife: string[];
};

// dock data
// ship data

export interface Location {
    longitude: number;
    latitude: number;
}

export type SourceGeoJSON = {
    name: string;
    type: 'geojson';
    data: {
        type: 'FeatureCollection';
        features: any[];
    };
    minZoom?: number;
    maxZoom?: number;
};

export type SourceTile = {
    name: string;
    type: 'vector';
    tiles: string[];
    minZoom?: number;
    maxZoom?: number;
};

export interface GeoJsonFeature {
    type: "Feature";
    geometry: {
        type: "Point";
        coordinates: [number, number];
    };
    properties: {
        id: number;
        type: string;
        age: number;
        health: 'critical' | 'poor' | 'good' | 'fair' | 'excellent';
        longitude: number;
        latitude: number;
        color: string;
    };
}
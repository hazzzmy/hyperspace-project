import { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { WildlifeType } from '@/types';
import { capitalize } from 'lodash';

interface MapProps {
  activeChapter: string;
  setActiveChapter: (chapterName: string) => void;
  data: WildlifeType[];
}

const WildlifeMap: React.FC<MapProps> = ({ activeChapter, setActiveChapter, data }) => {

  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapInstance = useRef<maplibregl.Map | null>(null);
  const markerRef = useRef<maplibregl.Marker | null>(null);
  const popupRef = useRef<maplibregl.Popup | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    mapInstance.current = new maplibregl.Map({
      container: mapContainer.current,
      center: [34.8233, -2.3333],
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

    markerRef.current = new maplibregl.Marker().setLngLat([34.8233, -2.3333]).addTo(mapInstance.current);
    popupRef.current = new maplibregl.Popup({ offset: 25 });
    return () => {
      mapInstance.current?.remove();
    };
  }, []);

  useEffect(() => {
    if (mapInstance.current && mapInstance.current.isStyleLoaded() &&markerRef.current && popupRef.current) {
      const activeLocation = data.find((location: any) => location.location === activeChapter);
  
      if (activeLocation) {
        markerRef.current.setLngLat([activeLocation.center[0], activeLocation.center[1]]);
  
        popupRef.current
          .setLngLat([activeLocation.center[0], activeLocation.center[1]])
          .setHTML(`
            <div style="font-family: Arial, sans-serif; padding: 10px;">
              <p style="margin: 0; font-size: 16px; font-weight: bold; color: #000; width: 100%; margin-bottom: 10px">${capitalize(activeLocation.location)} Wildlife</p>  
              <ul style="list-style-type: none; padding: 0; margin: 0; display: flex; flex-wrap: wrap;">
                ${activeLocation.wildlife.map(
                  (animal: string) => `
                  <li style="
                    color: #4a4a4a;
                    background-color: #f0f0f0;
                    margin-right: 10px;
                    margin-bottom: 5px;
                    padding: 5px 10px;
                    border-radius: 8px;
                    font-weight: bold;
                    display: flex;
                    align-items: center;
                  ">
                    <span style="background-color: #88c0d0; width: 8px; height: 8px; border-radius: 50%; margin-right: 8px;"></span>
                    ${animal}
                  </li>`
                ).join('')}
              </ul>
            </div>
          `)
          .addTo(mapInstance.current);
  
        markerRef.current.setPopup(popupRef.current).togglePopup();

        mapInstance.current.flyTo({
          center: [activeLocation.center[0], activeLocation.center[1]],
          zoom: activeLocation.zoom,
          essential: true, // Ensure this animation is always completed
        });
      }
    }
  }, [activeChapter, data]);
  

  return <div className='relative h-full rounded p-2 bg-[rgba(50,50,50,0.8)]'>
    <div id="map" ref={mapContainer} style={{ width: '100%', height: '100%', background: 'black'}} />
  </div>
};

export default WildlifeMap;
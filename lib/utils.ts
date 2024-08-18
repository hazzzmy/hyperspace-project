import { GeoJsonFeature } from "@/types";
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function toTitleCase(str: string) {
  return str.toLowerCase().replace(/\b\w/g, function(char) {
    return char.toUpperCase();
  });
}


export function capitalize(str: string): string {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export const getColorByHealth = (health: string) : string => {
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

export const genMarkerImages = (color: string): string => {
  const imgColor = color.replace('#', '');
  const imgUrl = `https://img.icons8.com/ios-filled/20/${imgColor}/visit.png`;
  return imgUrl;
}

export function getUniqueColors(geoJsonFeatures: GeoJsonFeature[]): string[] {
  const uniqueColors = new Set<string>();

  geoJsonFeatures.forEach((feature) => {
      const color = feature.properties.color;
      uniqueColors.add(color);
  });

  return Array.from(uniqueColors);
}
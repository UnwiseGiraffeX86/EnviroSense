'use server'

import { createClient } from "@/utils/supabase/server";

// Helper to calculate distance between two points in km
function getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2 - lat1);
  var dLon = deg2rad(lon2 - lon1);
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c; // Distance in km
  return d;
}

function deg2rad(deg: number) {
  return deg * (Math.PI / 180);
}

// Helper to calculate centroid of a polygon
const getCentroid = (coordinates: number[][]): [number, number] => {
  let latSum = 0;
  let lngSum = 0;
  const numPoints = coordinates.length;
  
  coordinates.forEach(coord => {
    lngSum += coord[0]; // GeoJSON is [lng, lat]
    latSum += coord[1];
  });
  
  return [latSum / numPoints, lngSum / numPoints]; // Returns [lat, lng]
};

export async function getAirQuality(lat: number, lon: number) {
  try {
    const supabase = await createClient();
    
    // Fetch all sectors from Supabase
    const { data: sectors, error } = await supabase
      .from("air_quality_public")
      .select("*");

    if (error) {
      console.error("Supabase Fetch Error:", error);
      throw new Error(error.message);
    }

    if (!sectors || sectors.length === 0) {
      return null;
    }

    let closestSector = null;
    let minDistance = Infinity;

    for (const sector of sectors) {
      if (sector.boundary_geojson && sector.boundary_geojson.coordinates) {
        // Assuming Polygon type with coordinates[0] as the outer ring
        const polygonCoords = sector.boundary_geojson.coordinates[0];
        const [sectorLat, sectorLon] = getCentroid(polygonCoords);
        
        const distance = getDistanceFromLatLonInKm(lat, lon, sectorLat, sectorLon);
        
        if (distance < minDistance) {
          minDistance = distance;
          closestSector = {
            ...sector,
            distance: distance
          };
        }
      }
    }

    // Return the closest sector if within a reasonable range (e.g., 50km)
    // If the user says they live "near" one, it should be very close.
    // But we return the closest regardless, and let the UI decide.
    return closestSector;

  } catch (error) {
    console.error("Server Action Fetch Error:", error);
    return null;
  }
}

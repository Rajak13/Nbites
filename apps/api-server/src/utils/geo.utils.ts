import * as turf from '@turf/turf';

export interface Coordinates {
  lat: number;
  lng: number;
}

/**
 * Calculates straight-line distance in kilometers between two lat/lng coordinates.
 */
export function calculateDistanceKm(
  from: Coordinates,
  to: Coordinates
): number {
  const fromPoint = turf.point([from.lng, from.lat]);
  const toPoint = turf.point([to.lng, to.lat]);
  return turf.distance(fromPoint, toPoint, { units: 'kilometers' });
}

/**
 * Calculates bearing in degrees between two points (0 - 360).
 */
export function calculateBearing(
  from: Coordinates,
  to: Coordinates
): number {
  const fromPoint = turf.point([from.lng, from.lat]);
  const toPoint = turf.point([to.lng, to.lat]);
  return turf.bearing(fromPoint, toPoint);
}

/**
 * Checks if a destination point is within Kathmandu Valley operational service area radius.
 */
export function isWithinServiceRadius(
  restaurantCoords: Coordinates,
  deliveryCoords: Coordinates,
  maxRadiusKm = 12
): boolean {
  const distance = calculateDistanceKm(restaurantCoords, deliveryCoords);
  return distance <= maxRadiusKm;
}

import * as turf from '@turf/turf';
import { calculateDistanceKm, calculateBearing, Coordinates } from '../utils/geo.utils';

export interface DriverCandidate {
  driverId: string;
  name: string;
  phone: string;
  vehiclePlate: string;
  coords: Coordinates;
  rating: number;
  isOnline: boolean;
}

export interface DispatchMatchResult {
  matchedDriver: DriverCandidate;
  distanceToPickupKm: number;
  estimatedArrivalMinutes: number;
  bearing: number;
}

export class DispatchService {
  // Average Kathmandu urban motorbike traffic speed in km/h
  private averageUrbanSpeedKmH = 22;

  /**
   * Finds the closest available online driver to a restaurant pickup point using Turf.js.
   */
  public findNearestDriver(
    pickupCoords: Coordinates,
    candidates: DriverCandidate[],
    maxSearchRadiusKm = 7.5
  ): DispatchMatchResult | null {
    const onlineCandidates = candidates.filter(
      (c) => c.isOnline && c.coords.lat && c.coords.lng
    );

    if (onlineCandidates.length === 0) {
      return null;
    }

    const pickupPoint = turf.point([pickupCoords.lng, pickupCoords.lat]);

    // Construct feature collection of driver points with properties
    const driverFeatures = onlineCandidates.map((driver) =>
      turf.point([driver.coords.lng, driver.coords.lat], { driver })
    );

    const featureCollection = turf.featureCollection(driverFeatures);

    // Turf nearestPoint calculation
    const nearest = turf.nearestPoint(pickupPoint, featureCollection);

    if (!nearest) {
      return null;
    }

    const matchedDriver = nearest.properties.driver as DriverCandidate;
    const distanceKm = calculateDistanceKm(pickupCoords, matchedDriver.coords);

    if (distanceKm > maxSearchRadiusKm) {
      return null;
    }

    const travelTimeHours = distanceKm / this.averageUrbanSpeedKmH;
    const estimatedArrivalMinutes = Math.max(
      3,
      Math.ceil(travelTimeHours * 60 + 2) // +2 min buffer for pickup parking
    );

    const bearing = calculateBearing(matchedDriver.coords, pickupCoords);

    return {
      matchedDriver,
      distanceToPickupKm: parseFloat(distanceKm.toFixed(2)),
      estimatedArrivalMinutes,
      bearing: parseFloat(bearing.toFixed(1)),
    };
  }

  /**
   * Computes total route ETA for customer delivery (Pickup Prep + Rider Transit).
   */
  public calculateTotalDeliveryEta(
    prepTimeMinutes: number,
    pickupCoords: Coordinates,
    deliveryCoords: Coordinates
  ): { totalEtaMinutes: number; deliveryDistanceKm: number } {
    const deliveryDistanceKm = calculateDistanceKm(pickupCoords, deliveryCoords);
    const transitHours = deliveryDistanceKm / this.averageUrbanSpeedKmH;
    const transitMinutes = Math.ceil(transitHours * 60);

    return {
      totalEtaMinutes: prepTimeMinutes + transitMinutes,
      deliveryDistanceKm: parseFloat(deliveryDistanceKm.toFixed(2)),
    };
  }
}

export const dispatchService = new DispatchService();

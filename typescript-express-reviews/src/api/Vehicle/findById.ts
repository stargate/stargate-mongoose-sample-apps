import express, { Request, Response } from 'express';
import Vehicle from '../../models/vehicle';
import Review from '../../models/review';

async function last5(request: Request, response: Response): Promise<void> {
  let limit = 5;
  if (request.query?.limit != null) {
    limit = parseInt(request.query.limit.toString(), 10);
  }

  const vehicleId: string | null = typeof request.query._id === 'string' ? request.query._id : null;
  if (vehicleId == null) {
    throw new Error('vehicleId must be a string');
  }

  const vehicle = await Vehicle.
    findOne({ id: request.query?._id }).
    setOptions({ sanitizeFilter: true });
  const reviews = await Review.
    find({ vehicle_id: vehicleId }).
    sort({ created_at: -1 }).
    limit(limit).
    //populate('user').
    //populate('vehicle').
    setOptions({ sanitizeFilter: true });

  response.status(200).json({
    vehicle: vehicle,
    reviews: reviews
  });
}

export default last5;

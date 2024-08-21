import express, { Request, Response } from 'express';
import Review from '../../models/review';
import Vehicle from '../../models/vehicle';

async function create(request: Request, response: Response): Promise<void> {
  const [review] = await Review.insertMany({
    text: request.body.text,
    rating: request.body.rating,
    user_id: request.body.userId,
    vehicle_id: request.body.vehicleId
  });

  const vehicle = await Vehicle.findOne({ id: request.body.vehicleId }).orFail();

  response.status(200).json({ vehicle: vehicle, review: review });
}

export default create;

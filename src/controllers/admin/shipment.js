import express from "express";
import { Shipment } from "../../models/shipment-model";
import { errorResponse, successResponse } from "../../configs/response";

const router = express.Router();

// Create Shipment

export const createShipment = async (req, res) => {
  try {
    const { origin_country, destination_country } = req.body;
    const shipment = new Shipment({ origin_country, destination_country });
    await shipment.save();
    return successResponse(res, 201, "Shipment created", shipment);
  } catch (error) {
    console.error(error);
    return errorResponse(res, 500, "Internal Server Error", { error: error.message });
  }
};

// List all shipments

export const listShipments = async (req, res) => {
  try {
    const shipments = await Shipment.find();
    return successResponse(res, 200, "Listing shipments", shipments);
  } catch (error) {
    console.error(error);
    return errorResponse(res, 500, "Internal Server Error", { error: error.message });
  }
};

export default router;

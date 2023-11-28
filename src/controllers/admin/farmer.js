import { Farmer } from "../../models/farmer-model";
import bcrypt from "bcrypt";
import { successResponse, errorResponse } from "../../configs/response";

// Create Farmer

export const createFarmer = async (req, res) => {
  try {
    const { name, email, phone_number, country, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const farmer = new Farmer({ name, email, phone_number, country, password: hashedPassword });
    await farmer.save();
    return successResponse(res, 201, "Farmer created", farmer);
  } catch (error) {
    console.error(error);
    return errorResponse(res, 500, "Internal Server Error", { error: error.message });
  }
};

// List All Farmers

export const listFarmers = async (req, res) => {
  try {
    const farmers = await Farmer.find().select("-password");
    return successResponse(res, 200, "Listing farmers", farmers);
  } catch (error) {
    console.error(error);
    return errorResponse(res, 500, "Internal Server Error", { error: error.message });
  }
};

// Get a Specific farmer details

export const getFarmer = async (req, res) => {
  try {
    const { id } = req.params;
    const farmer = await Farmer.findById(id).select("-password");
    if (!farmer) {
      return errorResponse(res, 404, "Farmer not found", {});
    }
    return successResponse(res, 200, "Farmer details", farmer);
  } catch (error) {
    console.error(error);
    return errorResponse(res, 500, "Internal Server Error", { error: error.message });
  }
};

// Update Farmer

export const updateFarmer = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedFields = req.body;
    const updatedFarmer = await Farmer.findByIdAndUpdate(id, updatedFields, { new: true }).select("-password");
    if (!updatedFarmer) {
      return errorResponse(res, 404, "Farmer not found", {});
    }
    return successResponse(res, 200, "Farmer updated", updatedFarmer);
  } catch (error) {
    console.error(error);
    return errorResponse(res, 500, "Internal Server Error", { error: error.message });
  }
};

// Delete Farmer

export const deleteFarmer = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedFarmer = await Farmer.findByIdAndDelete(id).select("-password");
    if (!deletedFarmer) {
      return errorResponse(res, 404, "Farmer not found", {});
    }
    return successResponse(res, 200, "Farmer deleted", deletedFarmer);
  } catch (error) {
    console.error(error);
    return errorResponse(res, 500, "Internal Server Error", { error: error.message });
  }
};

// Search Farmer by name, email, phone_number, country

export const searchFarmer = async (req, res) => {
  try {
    const { name, email, phone_number, country } = req.query;

    const farmers = {};
    if (name) {
      farmers.name = new RegExp(name, "i");
    }
    if (email) {
      farmers.email = new RegExp(email, "i");
    }
    if (phone_number) {
      farmers.phone_number = phone_number;
    }
    if (country) {
      farmers.country = country;
    }

    if (!name && !email && !phone_number && !country) {
      const allFarmers = await Farmer.find().select("-password");
      return successResponse(res, 200, "All farmers listed", allFarmers);
    }

    const findFarmer = await Farmer.find({ $and: [farmers] }).select("-password");

    if (findFarmer.length == 0) {
      return errorResponse(res, 404, "Farmers not found", {});
    }
    return successResponse(res, 200, "Farmers listed", findFarmer);
  } catch (error) {
    console.error(error);
    return errorResponse(res, 500, "Internal Server Error", { error: error.message });
  }
};

import { Admin } from "../models/admin-model";
import { Farmer } from "../models/farmer-model";
import { Buyer } from "../models/buyer-model";
import jwt from "jsonwebtoken";
import { errorResponse } from "../configs/response";

export const authTokenForAdmin = async (req, res, next) => {
  const token = req.header("Authorization");
  try {
    if (!token) {
      return errorResponse(res, 401, "Access Denied. No token provided", {});
    }
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const admin = await Admin.findById(decoded.id);
    if (admin == null) {
      return errorResponse(res, 404, "Admin not found", {});
    }
    if (!decoded) {
      return errorResponse(res, 403, "Forbidden", {});
    }
    next();
  } catch (error) {
    console.error(error);
    return errorResponse(res, 401, "Invalid Token", {});
  }
};

export const authTokenForFarmer = async (req, res, next) => {
  const token = req.header("Authorization");
  try {
    if (!token) {
      return errorResponse(res, 401, "Access Denied. No token provided", {});
    }
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const farmer = await Farmer.findById(decoded.id);
    if (farmer == null) {
      return errorResponse(res, 404, "Farmer not found", {});
    } else if (!decoded) {
      return errorResponse(res, 403, "Forbidden", {});
    } else if (decoded.email !== farmer.email) {
      return errorResponse(res, 401, "Invalid token", {});
    }
    next();
  } catch (error) {
    console.error(error);
    return errorResponse(res, 500, "Internal Server Error", { error: error.message });
  }
};

export const authTokenForBuyer = async (req, res, next) => {
  const token = req.header("Authorization");
  try {
    if (!token) {
      return errorResponse(res, 401, "Access Denied. No token provided", {});
    }
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const buyer = await Buyer.findById(decoded.id);
    if (buyer == null) {
      return errorResponse(res, 404, "Buyer not found", {});
    } else if (!decoded) {
      return errorResponse(res, 403, "Forbidden", {});
    } else if (decoded.email !== buyer.email) {
      return errorResponse(res, 401, "Invalid token", {});
    }
    next();
  } catch (error) {
    console.error(error);
    return errorResponse(res, 500, "Internal Server Error", { error: error.message });
  }
};

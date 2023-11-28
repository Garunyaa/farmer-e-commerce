import { Buyer } from "../../models/buyer-model";
import { successResponse, errorResponse } from "../../configs/response";
import { mailSender } from "../../services/send-mail";

// Approve/Reject KYC

export const verifyKYC = async (req, res) => {
  try {
    const { id } = req.params;
    const buyer = await Buyer.findById(id);
    if (!buyer) {
      return errorResponse(res, 404, "Buyer not found", {});
    }
    const kycVerification = await Buyer.findByIdAndUpdate(id, req.body, { new: true }).select("-password");
    if (kycVerification) {
      const subject = "Your KYC verification is Completed";
      const text = `Verification details: ${kycVerification.kyc_verified}`;
      return mailSender(buyer.email, subject, text);
    }
    if (kycVerification.kyc_verified === 1) {
      return successResponse(res, 200, "KYC Approved", kycVerification);
    }
    return errorResponse(res, 400, "KYC Rejected", kycVerification);
  } catch (error) {
    console.error(error);
    return errorResponse(res, 500, "Internal Server Error", { error: error.message });
  }
};

// List All Buyers

export const listBuyers = async (req, res) => {
  try {
    const buyers = await Buyer.find().select("-password");
    return successResponse(res, 200, "Listing all buyers", buyers);
  } catch (error) {
    console.error(error);
    return errorResponse(res, 500, "Internal Server Error", { error: error.message });
  }
};

// List KYC pending users

export const listKycPending = async (req, res) => {
  try {
    const buyers = await Buyer.find({ kyc_verified: 2 }).select("-password");
    return successResponse(res, 200, "Listing KYC pending buyers", buyers);
  } catch (error) {
    console.error(error);
    return errorResponse(res, 500, "Internal Server Error", { error: error.message });
  }
};

// Get a Specific Buyer Details

export const getBuyer = async (req, res) => {
  try {
    const { id } = req.params;
    const buyer = await Buyer.findById(id).select("-password");
    return successResponse(res, 200, "Buyer details", buyer);
  } catch (error) {
    console.error(error);
    return errorResponse(res, 500, "Internal Server Error", { error: error.message });
  }
};

// Delete buyer

export const deleteBuyer = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedBuyer = await Buyer.findByIdAndDelete(id).select("-password");
    if (!deletedBuyer) {
      return errorResponse(res, 404, "Buyer not found", {});
    }
    return successResponse(res, 200, "Buyer deleted", deletedBuyer);
  } catch (error) {
    console.error(error);
    return errorResponse(res, 500, "Internal Server Error", { error: error.message });
  }
};

// Block buyer

export const blockBuyer = async (req, res) => {
  try {
    const { id } = req.params;

    const buyer = await Buyer.findById(id).select("-password");
    if (!buyer) {
      return errorResponse(res, 404, "Buyer not found", {});
    }
    if (buyer.status == 1) {
      buyer.status = 0;
      await buyer.save();
    } else {
      return errorResponse(res, 400, "Buyer already blocked", {});
    }
    return successResponse(res, 200, "Buyer blocked", buyer);
  } catch (error) {
    console.error(error);
    return errorResponse(res, 500, "Internal Server Error", { error: error.message });
  }
};

// Unblock buyer

export const unblockBuyer = async (req, res) => {
  try {
    const { id } = req.params;
    const buyer = await Buyer.findById(id).select("-password");
    if (!buyer) {
      return errorResponse(res, 404, "Buyer not found", {});
    }
    if (buyer.status != 1) {
      buyer.status = 1;
      await buyer.save();
    } else {
      return errorResponse(res, 400, "Buyer not blocked", {});
    }
    return successResponse(res, 200, "Buyer unblocked", buyer);
  } catch (error) {
    console.error(error);
    return errorResponse(res, 500, "Internal Server Error", { error: error.message });
  }
};

// Search Buyer by name, email, phone_number, country

export const searchBuyer = async (req, res) => {
  try {
    const { name, email, phone_number, country } = req.query;

    const buyers = {};
    if (name) {
      buyers.name = new RegExp(name, "i");
    }
    if (email) {
      buyers.email = new RegExp(email, "i");
    }
    if (phone_number) {
      buyers.phone_number = phone_number;
    }
    if (country) {
      buyers.country = country;
    }

    if (!name && !email && !phone_number && !country) {
      const allBuyers = await Buyer.find().select("-password");
      return successResponse(res, 200, "All buyers listed", allBuyers);
    }

    const findBuyer = await Buyer.find({ $and: [buyers] }).select("-password");

    if (findBuyer.length == 0) {
      return errorResponse(res, 404, "Buyers not found", {});
    }
    return successResponse(res, 200, "Buyers listed", findBuyer);
  } catch (error) {
    console.error(error);
    return errorResponse(res, 500, "Internal Server Error", { error: error.message });
  }
};

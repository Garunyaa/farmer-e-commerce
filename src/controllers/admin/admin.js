import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { Admin } from "../../models/admin-model";
import { successResponse, errorResponse } from "../../configs/response";

// Create Admin

export const createAdmin = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = new Admin({ name, email, role, password: hashedPassword });
    await admin.save();
    return successResponse(res, 201, "Admin created", admin);
  } catch (error) {
    console.error(error);
    return errorResponse(res, 500, "Internal Server Error", { error: error.message });
  }
};

// Admin Login

export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return errorResponse(res, 400, "Please add email or password", {});
    }
    const admin = await Admin.findOne({ email: email });
    if (!admin) {
      return errorResponse(res, 404, "Admin not found", {});
    }
    const authToken = jwt.sign({ name: admin.name, email: admin.email, id: admin._id }, process.env.SECRET_KEY);
    const passwordMatch = await bcrypt.compare(password, admin.password);
    if (passwordMatch) {
      admin.password = undefined;
      return successResponse(res, 200, "Login Successful", { admin, auth_token: authToken });
    } else {
      return errorResponse(res, 401, "Invalid email or password", {});
    }
  } catch (error) {
    console.error(error);
    return errorResponse(res, 500, "Internal Server Error", { error: error.message });
  }
};

// Create Subadmin

export const createSubadmin = async (req, res) => {
  try {
    const { name, email, role, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const subadmin = new Admin({ name, email, role, password: hashedPassword });
    await subadmin.save();
    return successResponse(res, 201, "Subadmin Created", subadmin);
  } catch (error) {
    console.error(error);
    return errorResponse(res, 500, "Internal Server Error", { error: error.message });
  }
};

// List All Subadmins

export const listSubadmins = async (req, res) => {
  try {
    const subadmins = await Admin.find({ role: "Subadmin" }).select("-password");
    return successResponse(res, 200, "Listing subadmins", subadmins);
  } catch (error) {
    console.error(error);
    return errorResponse(res, 500, "Internal Server Error", { error: error.message });
  }
};

// Get a Specific subadmin details

export const getSubadmin = async (req, res) => {
  try {
    const { id } = req.params;
    const subadmin = await Admin.findById(id).select("-password");
    if (!subadmin) {
      return errorResponse(res, 404, "Subadmin not found", {});
    }
    return successResponse(res, 200, "Subadmin details", subadmin);
  } catch (error) {
    console.error(error);
    return errorResponse(res, 500, "Internal Server Error", { error: error.message });
  }
};

// Update Subadmin

export const updateSubadmin = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedFields = req.body;
    const updatedSubadmin = await Admin.findByIdAndUpdate(id, updatedFields, { new: true }).select("-password");
    if (!updatedSubadmin) {
      return errorResponse(res, 404, "Subadmin not found", {});
    }
    return successResponse(res, 200, "Subadmin updated", updatedSubadmin);
  } catch (error) {
    console.error(error);
    return errorResponse(res, 500, "Internal Server Error", { error: error.message });
  }
};

// Delete Subadmin

export const deleteSubadmin = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedSubadmin = await Admin.findByIdAndDelete(id).select("-password");
    if (!deletedSubadmin) {
      return errorResponse(res, 404, "Subadmin not found", {});
    }
    return successResponse(res, 200, "Subadmin deleted", deletedSubadmin);
  } catch (error) {
    console.error(error);
    return errorResponse(res, 500, "Internal Server Error", { error: error.message });
  }
};

import Joi from "joi";
import { errorResponse } from "../../configs/response";
import { idValidator } from "../../helpers/id-validator";

// Subadmin
const subadminUpdate = Joi.object({
  name: Joi.string().min(3).max(20),
  email: Joi.string().email(),
  password: Joi.string().min(6),
});

export const subadminValidator = async (req, res, next) => {
  try {
    const { error } = subadminUpdate.validate(req.body);
    if (error) {
      return errorResponse(res, 400, "Validation failed", { error: error.details[0].message });
    }
    if ((await idValidator(req.params.id)) == true) {
      next();
    }
  } catch (error) {
    console.error(error);
    return errorResponse(res, 500, "Internal Server Error", { error: error.message });
  }
};

// Farmer
const farmerUpdate = Joi.object({
  name: Joi.string().min(3).max(20),
  email: Joi.string().email(),
  password: Joi.string().min(6),
  phone_number: Joi.number(),
  country: Joi.string(),
});

export const farmerUpdateValidator = async (req, res, next) => {
  try {
    const { error } = farmerUpdate.validate(req.body);
    if (error) {
      return errorResponse(res, 400, "Validation failed", { error: error.details[0].message });
    }
    if ((await idValidator(req.params.id)) == true) {
      next();
    }
  } catch (error) {
    console.error(error);
    return errorResponse(res, 500, "Internal Server Error", { error: error.message });
  }
};

// Category
const categoryUpdate = Joi.object({
  category: Joi.string(),
  description: Joi.string(),
});

export const categoryUpdateValidator = async (req, res, next) => {
  try {
    const { error } = categoryUpdate.validate(req.body);
    if (error) {
      return errorResponse(res, 400, "Validation failed", { error: error.details[0].message });
    }
    if ((await idValidator(req.params.id)) == true) {
      next();
    }
  } catch (error) {
    console.error(error);
    return errorResponse(res, 500, "Internal Server Error", { error: error.message });
  }
};

// Product
const productUpdate = Joi.object({
  product_name: Joi.string(),
  price: Joi.string(),
});

export const productUpdateValidator = async (req, res, next) => {
  try {
    const { error } = productUpdate.validate(req.body);
    if (error) {
      return errorResponse(res, 400, "Validation failed", { error: error.details[0].message });
    }
    if ((await idValidator(req.params.id)) == true) {
      next();
    }
  } catch (error) {
    console.error(error);
    return errorResponse(res, 500, "Internal Server Error", { error: error.message });
  }
};

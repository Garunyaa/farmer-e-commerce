import Joi from "joi";
import { errorResponse } from "../../configs/response";
import { idValidator } from "../../helpers/id-validator";

const farmerValidation = Joi.object({
  name: Joi.string().min(3).max(20).required(),
  email: Joi.string().email().required(),
  phone_number: Joi.number().required(),
  country: Joi.string().required(),
  password: Joi.string().min(6).required(),
  status: Joi.number().default(1),
  created_at: Joi.date().default(new Date()),
});

export const farmerValidator = (req, res, next) => {
  try {
    const { error } = farmerValidation.validate(req.body);
    if (error) {
      return errorResponse(res, 400, "Validation failed", { error: error.details[0].message });
    }
    next();
  } catch (error) {
    console.error(error);
    return errorResponse(res, 500, "Internal Server Error", { error: error.message });
  }
};

export const farmerIdValidator = async (req, res, next) => {
  try {
    if ((await idValidator(req.params.id)) == true) {
      next();
    } else {
      return errorResponse(res, 400, "Invalid Farmer ID", {});
    }
  } catch (error) {
    console.error(error);
    return errorResponse(res, 500, "Internal Server Error", { error: error.message });
  }
};

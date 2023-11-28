import Joi from "joi";
import { errorResponse } from "../../configs/response";

const loginValidation = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

export const loginValidator = (req, res, next) => {
  try {
    const { error } = loginValidation.validate(req.body);
    if (error) {
      return errorResponse(res, 400, "Validation failed", { error: error.details[0].message });
    }
    next();
  } catch (error) {
    console.error(error);
    return errorResponse(res, 500, "Internal Server Error", { error: error.message });
  }
};

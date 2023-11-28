import Joi from "joi";
import { errorResponse } from "../../configs/response";

const shipmentValidation = Joi.object({
  origin_country: Joi.string().required(),
  destination_country: Joi.string().required(),
  available: Joi.number().default(1),
  status: Joi.number().default(1),
  created_at: Joi.date().default(new Date()),
});

export const shipmentValidator = (req, res, next) => {
  try {
    const { error } = shipmentValidation.validate(req.body);
    if (error) {
      return errorResponse(res, 400, "Validation failed", { error: error.details[0].message });
    }
    next();
  } catch (error) {
    console.error(error);
    return errorResponse(res, 500, "Internal Server Error", { error: error.message });
  }
};

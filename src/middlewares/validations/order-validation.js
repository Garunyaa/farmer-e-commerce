import Joi from "joi";
import objectId from "joi-objectid";
import { errorResponse } from "../../configs/response";
Joi.objectId = objectId(Joi);

const orderValidation = Joi.object({
  buyer: Joi.objectId().required(),
  product: Joi.objectId().required(),
  quantity: Joi.number().required(),
  total_price: Joi.number(),
  farmer: Joi.objectId().required(),
  origin_country: Joi.string(),
  destination_country: Joi.string(),
  status: Joi.number().default(1),
  created_at: Joi.date().default(new Date()),
});

export const orderValidator = (req, res, next) => {
  try {
    const { error } = orderValidation.validate(req.body);
    if (error) {
      return errorResponse(res, 400, "Validation failed", { error: error.details[0].message });
    }
    next();
  } catch (error) {
    console.error(error);
    return errorResponse(res, 500, "Internal Server Error", { error: error.message });
  }
};

import Joi from "joi";
import objectId from "joi-objectid";
import { errorResponse } from "../../configs/response";
import { idValidator } from "../../helpers/id-validator";
Joi.objectId = objectId(Joi);

const productValidation = Joi.object({
  product_name: Joi.string().required(),
  price: Joi.string().required(),
  category: Joi.objectId().required(),
  status: Joi.number().default(1),
  created_at: Joi.date().default(new Date()),
});

export const productValidator = (req, res, next) => {
  try {
    const { error } = productValidation.validate(req.body);
    if (error) {
      return errorResponse(res, 400, "Validation failed", { error: error.details[0].message });
    }
    next();
  } catch (error) {
    console.error(error);
    return errorResponse(res, 500, "Internal Server Error", { error: error.message });
  }
};

export const productIdValidator = async (req, res, next) => {
  try {
    if ((await idValidator(req.params.id)) == true) {
      next();
    } else {
      return errorResponse(res, 400, "Invalid Product ID", {});
    }
  } catch (error) {
    console.error(error);
    return errorResponse(res, 500, "Internal Server Error", { error: error.message });
  }
};

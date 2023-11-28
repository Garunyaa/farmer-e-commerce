import express from "express";
import { authTokenForFarmer } from "../middlewares/auth-middleware";
import { createProduct, farmerLogin, getProduct, listOrders, listProducts } from "../controllers/farmer/farmer-controller";
import { loginValidator } from "../middlewares/validations/login-validation";
import { productIdValidator } from "../middlewares/validations/product-validation";
import { farmerProductValidator } from "../middlewares/validations/farmer-product-validation";
import { farmerIdValidator } from "../middlewares/validations/farmer-validation"

const router = express.Router();

router.post("/login", loginValidator, farmerLogin);
router.get("/list-products", authTokenForFarmer, listProducts);
router.get("/get-product/:id", authTokenForFarmer, productIdValidator, getProduct);
router.post("/create-product", authTokenForFarmer, farmerProductValidator, createProduct);
router.get("/list-orders/:id", authTokenForFarmer, farmerIdValidator, listOrders);

export default router;

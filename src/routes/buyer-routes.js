import express from "express";
import { authTokenForBuyer } from "../middlewares/auth-middleware";
import { buyerSignup, buyerLogin, listProducts, getProduct, placeOrder, listOrders, uploadKYC } from "../controllers/buyer/buyer-controller";
import { buyerIdValidator, buyerValidator } from "../middlewares/validations/buyer-validation";
import { loginValidator } from "../middlewares/validations/login-validation";
import { orderValidator } from "../middlewares/validations/order-validation";
import { farmProductIdValidator } from "../middlewares/validations/farmer-product-validation";

const router = express.Router();

router.post("/buyer-signup", buyerValidator, buyerSignup);
router.post("/upload-kyc/:id", buyerIdValidator, uploadKYC);
router.post("/login", loginValidator, buyerLogin);
router.get("/list-products", authTokenForBuyer, listProducts);
router.get("/get-product/:id", authTokenForBuyer, farmProductIdValidator, getProduct);
router.post("/place-order", authTokenForBuyer, orderValidator, placeOrder);
router.get("/list-orders/:id", authTokenForBuyer, buyerIdValidator, listOrders);

export default router;

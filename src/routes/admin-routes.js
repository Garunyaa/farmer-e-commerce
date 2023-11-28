import express from "express";
import { authTokenForAdmin } from "../middlewares/auth-middleware";
import { createAdmin, adminLogin, createSubadmin, listSubadmins, getSubadmin, updateSubadmin, deleteSubadmin } from "../controllers/admin/admin";
import { createFarmer, listFarmers, getFarmer, updateFarmer, deleteFarmer, searchFarmer } from "../controllers/admin/farmer";
import { verifyKYC, listBuyers, listKycPending, getBuyer, deleteBuyer, blockBuyer, unblockBuyer, searchBuyer } from "../controllers/admin/buyer";
import { createCategory, listCategories, getCategory, updateCategory, deleteCategory } from "../controllers/admin/category";
import { createProduct, listProducts, getProduct, updateProduct, deleteProduct, verifyProducts } from "../controllers/admin/product";
import { createShipment, listShipments } from "../controllers/admin/shipment";
import { adminValidator, adminIdValidator } from "../middlewares/validations/admin-validation";
import { loginValidator } from "../middlewares/validations/login-validation";
import { subadminValidator, farmerUpdateValidator } from "../middlewares/validations/update-validation";
import { farmerValidator, farmerIdValidator } from "../middlewares/validations/farmer-validation";
import { buyerIdValidator } from "../middlewares/validations/buyer-validation";
import { categoryValidator, categoryIdValidator } from "../middlewares/validations/category-validation";
import { categoryUpdateValidator, productUpdateValidator } from "../middlewares/validations/update-validation";
import { productIdValidator, productValidator } from "../middlewares/validations/product-validation";
import { shipmentValidator } from "../middlewares/validations/shipment-validation";

const router = express.Router();

// Admin
router.post("/create-admin", adminValidator, createAdmin);
router.post("/admin-login", loginValidator, adminLogin);

// Subadmins
router.post("/create-subadmin", authTokenForAdmin, adminValidator, createSubadmin);
router.get("/list-subadmins", authTokenForAdmin, listSubadmins);
router.get("/get-subadmin/:id", authTokenForAdmin, adminIdValidator, getSubadmin);
router.patch("/update-subadmin/:id", authTokenForAdmin, subadminValidator, updateSubadmin);
router.delete("/delete-subadmin/:id", authTokenForAdmin, adminIdValidator, deleteSubadmin);

// Farmers
router.post("/create-farmer", authTokenForAdmin, farmerValidator, createFarmer);
router.get("/list-farmers", authTokenForAdmin, farmerIdValidator, listFarmers);
router.get("/get-farmer/:id", authTokenForAdmin, getFarmer);
router.patch("/update-farmer/:id", authTokenForAdmin, farmerUpdateValidator, updateFarmer);
router.delete("/delete-farmer/:id", authTokenForAdmin, farmerIdValidator, deleteFarmer);
router.get("/search-farmer", authTokenForAdmin, searchFarmer);

// Buyers
router.patch("/verify-kyc/:id", authTokenForAdmin, buyerIdValidator, verifyKYC);
router.get("/list-buyers", authTokenForAdmin, listBuyers);
router.get("/list-kyc-pending", authTokenForAdmin, listKycPending);
router.get("/get-buyer/:id", authTokenForAdmin, buyerIdValidator, getBuyer);
router.patch("/block-buyer/:id", authTokenForAdmin, buyerIdValidator, blockBuyer);
router.patch("/unblock-buyer/:id", authTokenForAdmin, buyerIdValidator, unblockBuyer);
router.delete("/delete-buyer/:id", authTokenForAdmin, buyerIdValidator, deleteBuyer);
router.get("/search-buyer", authTokenForAdmin, searchBuyer);

// Categories
router.post("/create-category", authTokenForAdmin, categoryValidator, createCategory);
router.get("/list-categories", authTokenForAdmin, listCategories);
router.get("/get-category/:id", authTokenForAdmin, categoryIdValidator, getCategory);
router.patch("/update-category/:id", authTokenForAdmin, categoryUpdateValidator, updateCategory);
router.delete("/delete-category/:id", authTokenForAdmin, categoryIdValidator, deleteCategory);

// Products
router.post("/create-product", authTokenForAdmin, productValidator, createProduct);
router.get("/list-products", authTokenForAdmin, listProducts);
router.get("/get-product/:id", authTokenForAdmin, productIdValidator, getProduct);
router.patch("/update-product/:id", authTokenForAdmin, productUpdateValidator, updateProduct);
router.delete("/delete-product/:id", authTokenForAdmin, productIdValidator, deleteProduct);
router.patch("/verify-product/:id", authTokenForAdmin, productIdValidator, verifyProducts);

// Shipments
router.post("/create-shipment", authTokenForAdmin, shipmentValidator, createShipment);
router.get("/list-shipments", authTokenForAdmin, listShipments);

export default router;

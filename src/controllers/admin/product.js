import { Product } from "../../models/product-model";
import { farmerProduct } from "../../models/farmer-product-model";
import { successResponse, errorResponse } from "../../configs/response";

// Create Product

export const createProduct = async (req, res) => {
  try {
    const { product_name, price, category } = req.body;
    const product = new Product({ product_name, price, category });
    await product.save();
    return successResponse(res, 201, "Product created", product);
  } catch (error) {
    console.error(error);
    return errorResponse(res, 500, "Internal Server Error", { error: error.message });
  }
};

// List All Products

export const listProducts = async (req, res) => {
  try {
    const products = await Product.find();
    return successResponse(res, 200, "Listing all products", products);
  } catch (error) {
    console.error(error);
    return errorResponse(res, 500, "Internal Server Error", { error: error.message });
  }
};

// Get a Specific Product details

export const getProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
      return errorResponse(res, 404, "Product not found", {});
    }
    return successResponse(res, 200, "Product details", product);
  } catch (error) {
    console.error(error);
    return errorResponse(res, 500, "Internal Server Error", { error: error.message });
  }
};

// Update Product

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedFields = req.body;
    const updatedProduct = await Product.findByIdAndUpdate(id, updatedFields, { new: true });
    if (!updatedProduct) {
      return errorResponse(res, 404, "Product not found", {});
    }
    return successResponse(res, 200, "Product updated", updatedProduct);
  } catch (error) {
    console.error(error);
    return errorResponse(res, 500, "Internal Server Error", { error: error.message });
  }
};

// Delete Product

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) {
      return errorResponse(res, 404, "Product not found", {});
    }
    await farmerProduct.deleteMany({ product: req.params.id });
    return successResponse(res, 200, "Product and related farmer products deleted", deletedProduct);
  } catch (error) {
    console.error(error);
    return errorResponse(res, 500, "Internal Server Error", { error: error.message });
  }
};

// Approve/Reject Farmer Products

export const verifyProducts = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await farmerProduct.findById(id);
    if (!product) {
      return errorResponse(res, 404, "Farmer product not found", {});
    }
    const farmerProducts = await farmerProduct.findByIdAndUpdate(id, req.body, { new: true });
    farmerProducts.created_by.password = undefined;
    if (farmerProducts.approved === 1) {
      return successResponse(res, 200, "Product approved", farmerProducts);
    }
    return errorResponse(res, 400, "Product rejected", farmerProducts);
  } catch (error) {
    console.error(error);
    return errorResponse(res, 500, "Internal Server Error", { error: error.message });
  }
};

import { Farmer } from "../../models/farmer-model";
import { Product } from "../../models/product-model";
import { farmerProduct } from "../../models/farmer-product-model";
import { Order } from "../../models/order-model";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { successResponse, errorResponse } from "../../configs/response";

// Farmer Login

export const farmerLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return errorResponse(res, 400, "Please add email or password", {});
    }
    const farmer = await Farmer.findOne({ email: email });
    if (!farmer) {
      return errorResponse(res, 404, "Farmer not found", {});
    }
    const authToken = jwt.sign({ name: farmer.name, email: farmer.email, id: farmer._id }, process.env.SECRET_KEY);
    const passwordMatch = await bcrypt.compare(password, farmer.password);
    if (passwordMatch) {
      farmer.password = undefined;
      return successResponse(res, 200, "Login Successful", { farmer, auth_token: authToken });
    } else {
      return errorResponse(res, 401, "Invalid email or password", {});
    }
  } catch (error) {
    console.error(error);
    return errorResponse(res, 500, "Internal Server Error", { error: error.message });
  }
};

// List Products

export const listProducts = async (req, res) => {
  try {
    const { category, product_name } = req.query;

    if (!product_name && !category) {
      const allProducts = await Product.find().populate('category');
      return successResponse(res, 200, 'All products listed', allProducts);
    }

    const products = {};

    if (product_name) {
      products.product_name = product_name;
    }

    const foundProducts = await Product.find(products).populate('category');

    if (foundProducts.length === 0) {
      return errorResponse(res, 404, 'Products not found', {});
    }

    if (category) {
      const productsByCategory = foundProducts.filter((product) => product.category.category === category);
      return successResponse(res, 200, 'Listing products by category', productsByCategory);
    } else {
      return successResponse(res, 200, 'Listing products', foundProducts);
    }
  } catch (error) {
    console.error(error);
    return errorResponse(res, 500, 'Internal Server Error', { error: error.message });
  }
};

// Get Product

export const getProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id).populate("category");
    if (!product) {
      return errorResponse(res, 404, "Product not found", {});
    }
    return successResponse(res, 200, "Product details", product);
  } catch (error) {
    console.error(error);
    return errorResponse(res, 500, "Internal Server Error", { error: error.message });
  }
};

// Create Farmer Product

export const createProduct = async (req, res) => {
  try {
    const { product, category, quantity, created_by } = req.body;
    const newProduct = new farmerProduct({ product, category, quantity, created_by });
    await newProduct.save();
    return successResponse(res, 201, "Farmer Product created", newProduct);
  } catch (error) {
    console.error(error);
    return errorResponse(res, 500, "Internal Server Error", { error: error.message });
  }
};

// List orders

export const listOrders = async (req, res) => {
  try {
    const { id } = req.params;
    const orders = await Order.find({ farmer: id }).populate({
      path: 'product',
      populate: {
        path: 'product'
      }
    });
    if (!orders) {
      return errorResponse(res, 404, "No orders found for the farmer", {});
    }
    return successResponse(res, 200, "Listing orders", orders);
  } catch (error) {
    console.error(error);
    return errorResponse(res, 500, "Internal Server Error", { error: error.message });
  }
};

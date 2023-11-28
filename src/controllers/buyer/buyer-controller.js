import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Buyer } from "../../models/buyer-model";
import { successResponse, errorResponse } from "../../configs/response";
import { uploadImage } from "../../services/upload-image";
import { farmerProduct } from "../../models/farmer-product-model";
import { Shipment } from "../../models/shipment-model";
import { Order } from "../../models/order-model";
import { Farmer } from "../../models/farmer-model";
import { mailSender } from "../../services/send-mail";

// Buyer Signup

export const buyerSignup = async (req, res) => {
  try {
    const { name, email, phone_number, country, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const buyer = new Buyer({ name, email, phone_number, country, password: hashedPassword });
    await buyer.save();
    return successResponse(res, 201, "Signup successful", buyer);
  } catch (error) {
    console.error(error);
    return errorResponse(res, 500, "Internal Server Error", { error: error.message });
  }
};

// Upload KYC

export const uploadKYC = async (req, res) => {
  try {
    const { id } = req.params;
    const buyer = await Buyer.findById(id);
    if (!buyer) {
      return errorResponse(res, 404, 'Buyer not found', {});
    }
    
    uploadImage(req, res);

    buyer.kyc_document = req.files.sampleFile.name;
    await buyer.save();
  } catch (error) {
    console.error(error);
    return errorResponse(res, 500, 'Internal Server Error', { error: error.message });
  }
};

//   Buyer Login

export const buyerLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return errorResponse(res, 400, "Please add email or password", {});
    }
    const buyer = await Buyer.findOne({ email: email });
    if (!buyer) {
      return errorResponse(res, 404, "Buyer not found", {});
    }
    const authToken = jwt.sign({ name: buyer.name, email: buyer.email, id: buyer._id }, process.env.SECRET_KEY);
    const passwordMatch = await bcrypt.compare(password, buyer.password);
    if (passwordMatch && buyer.kyc_verified === 1) {
      buyer.password = undefined;
      return successResponse(res, 200, "Login Successful", { buyer, auth_token: authToken });
    } else {
      return errorResponse(res, 401, "Invalid email / password or KYC not verified", {});
    }
  } catch (error) {
    console.error(error);
    return errorResponse(res, 500, "Internal Server Error", { error: error.message });
  }
};

// List Farmer Products

export const listProducts = async (req, res) => {
  try {
    const { category, product_name, farmer_name } = req.query;

    if (!category && !product_name && !farmer_name) {
      const allProducts = await farmerProduct.find().populate("product").populate("category").populate("created_by");
      return successResponse(res, 200, "All products listed", allProducts)
    }

    const products = {};

    const findProduct = await farmerProduct.find(products).populate("product").populate("category").populate("created_by");
    if (findProduct.length == 0) {
      return errorResponse(res, 404, "Products not found", {});
    }

    if (product_name) {
      const productsByName = findProduct.filter((product) => product.product.product_name === product_name);
      return successResponse(res, 200, 'Listing products by product name', productsByName);
    }
    if (farmer_name) {
      const productsByFarmer = findProduct.filter((product) => product.created_by.name === farmer_name);
      return successResponse(res, 200, 'Listing products by farmer name', productsByFarmer);
    }
    if (category) {
      const productsByCategory = findProduct.filter((product) => product.category.category === category);
      return successResponse(res, 200, 'Listing products by category', productsByCategory);
    }
  } catch (error) {
    console.error(error);
    return errorResponse(res, 500, "Internal Server Error", { error: error.message });
  }
};

// Get Farmer product

export const getProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await farmerProduct.findById(id);
    if (!product) {
      return errorResponse(res, 404, "Product not found", {});
    }
    return successResponse(res, 200, "Farmer Product details", product);
  } catch (error) {
    console.error(error);
    return errorResponse(res, 500, "Internal Server Error", { error: error.message });
  }
};

// Place an order and manage quantity deduction

export const placeOrder = async (req, res) => {
  try {
    let { buyer, product, quantity, farmer } = req.body;

    if (!buyer || !farmer || !product || quantity === undefined) {
      return errorResponse(res, 400, "Please provide buyer ID, farmer ID, product ID and quantity", {});
    }

    const findBuyer = await Buyer.findById(buyer);
    const findFarmer = await Farmer.findById(farmer);

    const shipment = await Shipment.findOne({ origin_country: findFarmer.country, destination_country: findBuyer.country });
    if (!shipment) {
      return errorResponse(res, 404, "Shipment not available for the country", {});
    }

    let findProduct = await farmerProduct.findById(product).populate("product");

    if (!findProduct || findProduct.quantity < quantity) {
      return errorResponse(res, 400, "Please check the available quantity", {});
    }

    findProduct.quantity -= quantity;
    await findProduct.save();

    const totalPrice = findProduct.product.price * quantity;

    const order = new Order({
      buyer,
      product,
      quantity,
      total_price: totalPrice,
      farmer,
      origin_country: findFarmer.country,
      destination_country: findBuyer.country
    });

    if (order) {
      const buyerSubject = "Order placed successfully";
      const buyerText = `An order for ${quantity} units of ${findProduct.product.product_name} has been placed`;
      await mailSender(findBuyer.email, buyerSubject, buyerText);

      const farmerSubject = "Received a new order";
      const buyerName = findBuyer && findBuyer.name ? findBuyer.name : 'Unknown Buyer';
      const farmerText = `A new order for ${quantity} units of ${findProduct.product.product_name} has been placed by ${buyerName}`;
      await mailSender(findFarmer.email, farmerSubject, farmerText);
    }
    await order.save();
    return successResponse(res, 201, "Order placed", order);
  } catch (error) {
    console.error(error);
    return errorResponse(res, 500, "Internal Server Error", { error: error.message });
  }
};

// List Orders

export const listOrders = async (req, res) => {
  try {
    const { id } = req.params;
    const orders = await Order.find({ buyer: id }).populate({
      path : 'product',
      populate : {
        path : 'product'
      }
    });
    if (!orders) {
      return errorResponse(res, 404, "No orders found for the buyer", {});
    }
    return successResponse(res, 200, "Listing orders", orders);
  } catch (error) {
    console.error(error);
    return errorResponse(res, 500, "Internal Server Error", { error: error.message });
  }
};

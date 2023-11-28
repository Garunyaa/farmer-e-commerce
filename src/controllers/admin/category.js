import { Category } from "../../models/category-model";
import { Product } from "../../models/product-model";
import { successResponse, errorResponse } from "../../configs/response";
import { farmerProduct } from "../../models/farmer-product-model";

// Create Category

export const createCategory = async (req, res) => {
  try {
    const { category, description } = req.body;
    const newCategory = new Category({ category, description });
    await newCategory.save();
    return successResponse(res, 201, "Category created", newCategory);
  } catch (error) {
    console.error(error);
    return errorResponse(res, 500, "Internal Server Error", { error: error.message });
  }
};

// List All Categories

export const listCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    return successResponse(res, 200, "Listing all categories", categories);
  } catch (error) {
    console.error(error);
    return errorResponse(res, 500, "Internal Server Error", { error: error.message });
  }
};

// Get a Specific Category details

export const getCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id);
    return successResponse(res, 200, "Category details", category);
  } catch (error) {
    console.error(error);
    return errorResponse(res, 500, "Internal Server Error", { error: error.message });
  }
};

// Update Category

export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedFields = req.body;
    const updatedCategory = await Category.findByIdAndUpdate(id, updatedFields, { new: true });
    if (!updatedCategory) {
      return errorResponse(res, 404, "Category not found", {});
    }
    return successResponse(res, 200, "Category updated", updatedCategory);
  } catch (error) {
    console.error(error);
    return errorResponse(res, 500, "Internal Server Error", { error: error.message });
  }
};

// Delete Category

export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCategory = await Category.findByIdAndDelete(id);
    if (!deletedCategory) {
      return errorResponse(res, 404, "Category not found", {});
    }
    await Product.deleteMany({ category: req.params.id });
    await farmerProduct.deleteMany({ category: req.params.id });

    return successResponse(res, 200, "Category and related products deleted", deletedCategory);
  } catch (error) {
    console.error(error);
    return errorResponse(res, 500, "Internal Server Error", { error: error.message });
  }
};

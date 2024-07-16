import Category from "../models/Category.js";

export const createNewCategory = async (req, res) => {
  let { name, wholesale, superWholeSale } = req.body;

  // Normalize input
  name = name.toLowerCase().trim();
  wholesale = Number(wholesale);
  superWholeSale = Number(superWholeSale);
  console.log(name, wholesale, superWholeSale);

  try {
    let category = await Category.findOne({ name: name });

    if (category) {
      // Category already exists, check if details match
      if (
        category.wholesale === wholesale &&
        category.superWholeSale === superWholeSale
      ) {
        return res.status(201).json({
          success: false,
          msg: "Category already exists with the same details",
        });
      }

      // Update existing category
      category.wholesale = wholesale;
      category.superWholeSale = superWholeSale;
      await category.save();
      return res.status(200).json({
        success: true,
        msg: "Category updated successfully",
        category: category,
      });
    } else {
      // Create new category
      category = await Category.create({ name, wholesale, superWholeSale });
      return res.status(200).json({
        success: true,
        msg: "New category created successfully",
        category: category,
      });
    }
  } catch (error) {
    console.error("Error creating/updating category:", error);
    return res.status(500).json({
      success: false,
      msg: "Server error",
    });
  }
};

export const getAllCategories = async (req, res) => {
  try {
    let categories = await Category.find();

    if (!categories || categories.length === 0) {
      return res.status(404).json({
        success: false,
        msg: "No categories found",
      });
    }

    return res.status(200).json({
      success: true,
      msg: "Categories found",
      categories: categories,
    });
  } catch (error) {
    console.error("Error retrieving categories:", error);
    return res.status(500).json({
      success: false,
      msg: "Server error",
    });
  }
};

export default createNewCategory;

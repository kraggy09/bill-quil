import express from "express";
import createNewCategory, {
  getAllCategories,
} from "../controllers/Category.js";
const router = express.Router();

router.route("/newCategory").post(createNewCategory);
router.route("/getAllCategories").get(getAllCategories);

export default router;

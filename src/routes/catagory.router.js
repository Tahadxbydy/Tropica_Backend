import { authMiddleware } from "../middleWare/authMiddleware.js";
import { Router } from "express";
import {
  createCatagory,
  deleteCatagory,
  getAllCatagory,
  updateCatagory,
} from "../controllers/catagory.controllers.js";

const router = Router();

router.route("/getAllCatagory").get(getAllCatagory);

// secured routes
router.route("/createCatagory").post(createCatagory);
router.route("/updateCatagory").post(authMiddleware, updateCatagory);
router.route("/deleteCatagory").post(authMiddleware, deleteCatagory);

export default router;

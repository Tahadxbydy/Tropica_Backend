import { authMiddleware } from "../middleWare/authMiddleware.js";
import { Router } from "express";
import { checkRoleMiddleware } from "../middleWare/checkRoleMiddleware.js";
import {
  createCatagory,
  deleteCatagory,
  getAllCatagory,
  updateCatagory,
} from "../controllers/catagory.controllers.js";

const router = Router();

router.route("/getAllCatagory").get(getAllCatagory);

// secured routes
router
  .route("/createCatagory")
  .post(authMiddleware, checkRoleMiddleware, createCatagory);
router
  .route("/updateCatagory")
  .patch(authMiddleware, checkRoleMiddleware, updateCatagory);
router
  .route("/deleteCatagory")
  .delete(authMiddleware, checkRoleMiddleware, deleteCatagory);

export default router;

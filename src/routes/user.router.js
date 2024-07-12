import { authMiddleware } from "../middleWare/authMiddleware.js";
import { Router } from "express";
import {
  createUser,
  deleteUser,
  getUserDetails,
  updateUser,
  login,
  logout,
} from "../controllers/user.controllers.js";

const router = Router();

router.route("/createUser").get(createUser);

router.route("/login").post(login);

// secured routes
router.route("/updateUser").post(authMiddleware, updateUser);
router.route("/deleteUser").post(authMiddleware, deleteUser);
router.route("/getUserDetails").post(authMiddleware, getUserDetails);
router.route("/logout").post(authMiddleware, logout);

export default router;

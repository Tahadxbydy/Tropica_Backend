import { authMiddleware } from "../middleWare/authMiddleware.js";
import { Router } from "express";
import {
  createUser,
  deleteUser,
  getUserDetails,
  updateUser,
  login,
  logout,
  updateProfilePic,
} from "../controllers/user.controllers.js";
import { upload } from "../middleWare/fileupload.middleware.js";

const router = Router();

router.route("/createUser").post(upload.single("image"), createUser);

router.route("/login").get(login);

// secured routes
router.route("/updateUser").post(authMiddleware, updateUser);
router.route("/deleteUser").delete(authMiddleware, deleteUser);
router.route("/getUserDetails").get(authMiddleware, getUserDetails);
router.route("/logout").get(authMiddleware, logout);

router
  .route("/updateProfilePic")
  .patch(authMiddleware, upload.single("image"), updateProfilePic);

export default router;

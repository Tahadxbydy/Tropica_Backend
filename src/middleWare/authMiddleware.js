import { userModel } from "../models/user.model.js";
import { ApiError } from "../utills/apiError.js";
import { asyncHandler } from "../utills/asyncHandler.js";
// import { ApiError } from "../utills/apiError.js";
import jwt from "jsonwebtoken";
// import { userModel } from "../models/user.model.js";

const authMiddleware = asyncHandler(async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization").replace("Bearer ", "");
    if (!token) {
      throw new ApiError(401, "Not Authorized");
    }
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findById(decodedToken.id);
    if (!user) {
      throw new ApiError(404, "can't find user");
    }

    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, "Token is invalid");
  }
});

export { authMiddleware };

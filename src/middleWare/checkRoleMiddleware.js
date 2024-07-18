import { ApiError } from "../utills/apiError.js";
import { asyncHandler } from "../utills/asyncHandler.js";

const checkRoleMiddleware = asyncHandler(async (req, res, next) => {
  // Check if user has admin role
  if (req.user.role !== "admin") {
    throw new ApiError(401, "Not Authorized");
  }

  next();
});

export { checkRoleMiddleware };

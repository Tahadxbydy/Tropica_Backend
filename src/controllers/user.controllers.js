import { userModel } from "../models/user.model.js";
import { ApiError } from "../utills/apiError.js";
import { ApiResponse } from "../utills/apiResponse.js";
import { asyncHandler } from "../utills/asyncHandler.js";
import { uploadOnCloudinary } from "../utills/cloudinary.js";

const generateAccessAndRefreshToken = async (userId) => {
  const user = await userModel.findById(userId);
  const accessToken = await user.getSignedJwtToken();
  const refreshToken = await user.generateRefreshToken();
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });
  return { accessToken, refreshToken };
};

const createUser = asyncHandler(async (req, res) => {
  const { name, email, password, address, mobileNumber } = req.body;

  var existingUser = await userModel.findOne({
    $or: { email: email, mobileNumber: mobileNumber },
  });
  if (existingUser) {
    throw new ApiError(409, "User Email or mobile number already exists");
  }

  let image = null;
  if (req.file) {
    // If image is provided, get its local path
    const imageLocalPath = req.file?.path;
    // Upload the image to cloudinary and get the public_id
    image = await uploadOnCloudinary(imageLocalPath);
  }

  const createdUser = await userModel.create({
    name,
    email,
    image: image.url,
    password,
    mobileNumber,
    address,
  });
  res.status(201).json(new ApiResponse(201, createdUser, "User created"));
});

const deleteUser = asyncHandler(async (req, res) => {
  const user = await userModel.findByIdAndDelete(req.user.id);

  if (!user) {
    throw new ApiError(404, "User not found");
  }
  const options = {
    httpOnly: true,
    secure: true,
  };
  res
    .status(204)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .end();
});

const getUserDetails = asyncHandler(async (req, res) => {
  res.status(200).json(new ApiResponse(200, req.user, "your details"));
});

const updateUser = asyncHandler(async (req, res) => {
  //  const {name, email, address, mobileNumber} = req.body;
  const updatedUser = await userModel.findByIdAndUpdate(req.user.id, req.body, {
    new: true,
  });
  if (!updatedUser) {
    throw new ApiError(404, "User not found");
  }
  res.status(200).json(new ApiResponse(200, updatedUser, "User updated"));
});

const updateProfilePic = asyncHandler(async (req, res) => {
  const imageLocalPath = req.file?.path;
  if (!imageLocalPath) {
    throw new ApiError(400, "Profile image not provided");
  }
  // If image is provided, get its local path
  // Upload the image to cloudinary and get the public_id
  const image = await uploadOnCloudinary(imageLocalPath);
  const updatedUser = await userModel.findByIdAndUpdate(
    req.user.id,
    { image: image.url },
    { new: true }
  );
  if (!updatedUser) {
    throw new ApiError(404, "User not found");
  }
  res
    .status(200)
    .json(new ApiResponse(200, updatedUser, "Profile picture updated"));
});

const login = asyncHandler(async (req, res) => {
  const { mobileNumber, email, password } = req.body;
  if (!mobileNumber && !email) {
    throw new ApiError(401, "mobileNumber or email not provided");
  }
  if (!password) {
    throw new ApiError(401, "password not provided");
  }
  const user = await userModel.findOne({ $or: [{ mobileNumber }, { email }] });

  if (!user) {
    throw new ApiError(401, "Invalid credentials");
  }
  const isPasswordCorrect = await user.matchPassword(password);
  if (!isPasswordCorrect) {
    new ApiError(401, "password not correct");
  }
  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );

  const options = {
    secure: true,

    httpOnly: true,
  };

  user.refreshToken = refreshToken;
  res
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(200, { user, accessToken }, "Logged in successfully")
    );
});

const logout = asyncHandler(async (req, res) => {
  req.user.refreshToken = undefined;
  await req.user.save({ validateBeforeSave: false });
  const options = {
    httpOnly: true,
    secure: true,
  };
  res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, "Bye Bye", "user Logged Out"));
});

export {
  createUser,
  deleteUser,
  getUserDetails,
  updateUser,
  login,
  logout,
  updateProfilePic,
};

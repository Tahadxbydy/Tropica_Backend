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
  const { name, email, image, password, address, mobileNumber } = req.body;

  var existingUser = await userModel.findOne({ email: email });
  if (existingUser) {
    throw new ApiError(409, "User Email already exists");
  }
  existingUser = await userModel.findOne({ mobileNumber: mobileNumber });
  if (existingUser) {
    throw new ApiError(409, "User mobile number already exists");
  }

  if (image) {
    // If image is provided, get its local path
    const imageLocalPath = req.file;
    console.log(imageLocalPath);
    // Upload the image to cloudinary and get the public_id
    image = await uploadOnCloudinary(imageLocalPath);
  }

  const createdUser = await userModel.create({
    name,
    email,
    image,
    password,
    mobileNumber,
    address,
  });
  res.status(201).json(new ApiResponse(201, createdUser, "User created"));
});

const deleteUser = asyncHandler(async (req, res) => {
  //   const { id } = req.params;
  //   await catagoryModel.findByIdAndDelete(id);
  //   res.status(204).send();
});

const getUserDetails = asyncHandler(async (req, res) => {
  //   const catagories = await catagoryModel.find({});
  //   res.json(catagories);
});

const updateUser = asyncHandler(async (req, res) => {});

const login = asyncHandler(async (req, res) => {});

const logout = asyncHandler(async (req, res) => {});

export { createUser, deleteUser, getUserDetails, updateUser, login, logout };

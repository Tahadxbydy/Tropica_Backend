import { catagoryModel } from "../models/catagory.model.js";
import { ApiError } from "../utills/apiError.js";
import { ApiResponse } from "../utills/apiResponse.js";
import { asyncHandler } from "../utills/asyncHandler.js";
import { uploadOnCloudinary } from "../utills/cloudinary.js";

const createCatagory = asyncHandler(async (req, res) => {
  const { catagoryName, description } = req.body;

  const imageLocalPath = req.file?.path;
  var cloudinaryimage;
  if (!imageLocalPath) {
    cloudinaryimage = await uploadOnCloudinary(imageLocalPath);
  }

  const catagory = await catagoryModel.create({
    catagoryName,
    description,
    image: cloudinaryimage?.url,
  });
  res.status(201).json(ApiResponse(201, catagory, "Created catagory"));
});

const deleteCatagory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await catagoryModel.findByIdAndDelete(id);
  res.status(204).send();
});

const getAllCatagory = asyncHandler(async (req, res) => {
  const catagories = await catagoryModel.find({});
  res.json(catagories);
});

const updateCatagory = asyncHandler(async (req, res) => {
  const { _id, catagoryName, description } = req.body;
  const updatedCatagory = await catagoryModel.findByIdAndUpdate(
    _id,
    { catagoryName, description },
    { new: true }
  );
  if (!updatedCatagory) {
    throw new ApiResponse(404, "Catagory not found");
  }
  res
    .status(200)
    .json(new ApiResponse(200, updatedCatagory, "catagory Updated"));
});

const updateCatagoryImage = asyncHandler(async (req, res) => {
  const { _id } = req.body;

  const imageLocalPath = req.files?.path;

  if (imageLocalPath) {
    throw new ApiError(401, "No image provided");
  }
  const cloudinaryimage = await uploadOnCloudinary(imageLocalPath);

  const updatedCatagory = await catagoryModel.findByIdAndUpdate(
    _id,
    { image: cloudinaryimage },
    { new: true }
  );
  if (!updatedCatagory) {
    throw new ApiResponse(404, "Catagory not found");
  }
  res
    .status(200)
    .json(new ApiResponse(200, updatedCatagory, "catagory Updated"));
});

export {
  createCatagory,
  deleteCatagory,
  getAllCatagory,
  updateCatagory,
  updateCatagoryImage,
};

import { catagoryModel } from "../models/catagory.model.js";
import { ApiResponse } from "../utills/apiResponse.js";
import { asyncHandler } from "../utills/asyncHandler.js";

const createCatagory = asyncHandler(async (req, res) => {
  const { catagoryName, description, image } = req.body;
  const catagory = await catagoryModel.create({
    catagoryName,
    description,
    image,
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

const updateCatagory = asyncHandler(async (req, res) => {});

export { createCatagory, deleteCatagory, getAllCatagory, updateCatagory };

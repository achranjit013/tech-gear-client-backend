import FavouriteSchema from "./FavouriteSchema.js";

// crud operation

// create favourite
export const createFavourite = (favouriteObj) => {
  return FavouriteSchema(favouriteObj).save();
};

// create favourite
export const createManyFavourite = (favourites) => {
  return FavouriteSchema.insertMany(favourites);
};

// read favourite by userId
export const getAllFavouriteByUserId = (userId) => {
  const projection = {
    createdAt: 0,
    updatedAt: 0,
    __v: 0,
  };
  return FavouriteSchema.find({ userId }, projection);
};

// delete favourite
export const deleteFavouriteById = (filter) => {
  return FavouriteSchema.findOneAndDelete(filter);
};

import mongoose from "mongoose";

const countrySchema = new mongoose.Schema({
  country: { type: String, required: true },
  countryCode: { type: String, required: true },
  deletedAt: Date,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const CountryModel = mongoose.model("tora_countries", countrySchema);

export default CountryModel;

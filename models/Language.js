import mongoose from "mongoose";

const languageSchema = new mongoose.Schema({
  language: { type: String, required: true },
  langCode: { type: String, required: true },
  userId: { type: String, required: true }, // Assuming userId is a string
  deletedAt: Date,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const LanguageModel = mongoose.model('tora_languages', languageSchema);

export default LanguageModel;

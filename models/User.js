import mongoose from "mongoose";

// Defining Schema 
const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    thumbnail: String,
    gender: { type: String, enum: ['male', 'female'] },
    phone: Number,
    countryid: { type: mongoose.Schema.Types.ObjectId, ref: 'tora_countries' }, // Reference to the "tora_countries" collection
    preferredLang: { type: mongoose.Schema.Types.ObjectId, ref: 'tora_languages' }, // Reference to the "tora_languages" collection
    status: { type: String, enum: ['active', 'inactive'] },
    role: { type: String, enum: ['admin', 'speaker'] },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  });

const UserModel = mongoose.model("tora_users", userSchema);

export default UserModel;
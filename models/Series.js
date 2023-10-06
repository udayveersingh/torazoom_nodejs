import mongoose from 'mongoose';

const seriesSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String },
  thumbnail: { type: String },
  parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'tora_series' },
  order: { type: Number },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'tora_users' },
  lang: { type: String },
  relationId: { type: mongoose.Schema.Types.ObjectId },
  status: { type: String, enum: ['draft', 'publish', 'trash'], default: 'draft' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const SeriesModel = mongoose.model('tora_series', seriesSchema);

export default SeriesModel;

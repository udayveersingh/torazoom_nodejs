import mongoose from 'mongoose';

const toraFeaturesSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  taxonomy_name: {
    type: String,
    required: true,
  },
  taxonomy_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  langcode: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const ToraFeaturesModel = mongoose.model('tora_features', toraFeaturesSchema);

export default ToraFeaturesModel;

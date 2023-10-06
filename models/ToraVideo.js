import mongoose from 'mongoose';

// Define the schema
const toraVideoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  slug: String,
  thumbnail: String,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  lang: String,
  recordLocation: String,
  recordedAt: Date,
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
  vimeoId: String,
  shortVideo: Number,
  uploadType: {
    type: String,
    enum: ['single_video', 'url', 'merge_video'], // Add the allowed values for UploadType
  },
  videoSource: String,
  audioLink: String,
  visible: {
    type: String,
    enum: ['mobile', 'desktop', 'both', 'none'],
  },
  status: { 
    type: String, 
    enum: ['draft', 'publish', 'trash'], default: 'draft' 
  },
  publishedAt: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: Date,
});

// Create the model
const ToraVideoModel = mongoose.model('tora_videos', toraVideoSchema);

export default ToraVideoModel;

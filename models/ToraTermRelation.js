import mongoose from 'mongoose';

// Define the schema
const toraTermRelationSchema = new mongoose.Schema({
  objectType: {
    type: String,
    enum: ['video', 'dedicationMonth'],
    required: true,
  },
  objectId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  termId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  termName: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: Date,
});

// Create the model
const ToraTermRelationModel = mongoose.model('tora_term_relations', toraTermRelationSchema);

export default ToraTermRelationModel;
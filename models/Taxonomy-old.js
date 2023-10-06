import mongoose from 'mongoose';

const translationSchema = new mongoose.Schema({
    languageCode: {
      type: String,
      required: true,
    },
    translation: {
      type: String,
      required: true,
    },
  });
  
// Define the Taxonomy schema
const taxonomySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true
    },
    description: String,
    thumbnail: String,
    type: {
        type: String,
        enum: ['topic', 'series', 'organization', 'dedicationMonth','category_slider'],
        required: true
    },
    parentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TaxonomyModel' // Reference to the same model for parent-child relationships
    },
    order: Number,
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    lang: String,
    relationlId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TaxonomyModel' // Reference to the same model for relationships
    },
    status: {
        type: String,
        enum: ['draft', 'publish', 'trash'],
        default: 'draft'
    },
    details: {
        type: mongoose.Schema.Types.Mixed // Storing JSON data as a mixed type
    },

    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
});

// Create the Taxonomy model
const TaxonomyModel = mongoose.model('tora_taxonomy', taxonomySchema);

export default TaxonomyModel;

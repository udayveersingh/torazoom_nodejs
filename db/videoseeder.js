import CountryModel from '../models/Country.js';
import LanguageModel from '../models/Language.js';
import connectDB from './connectdb.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import SeriesModel from '../models/Series.js';
import TaxonomyModel from '../models/Taxonomy.js';
import ToraVideoModel from '../models/ToraVideo.js';
import ToraTermRelationModel from '../models/ToraTermRelation.js';
import UserModel from '../models/User.js';
dotenv.config();
const DATABASE_URI = process.env.DATABASE_URL;

connectDB(DATABASE_URI);

// Define dummy data



  // Insert dummy data into collections
  // async function seedData() {
  //   try {
  //       let topic_ids = ['651666c49dde9f458551a8ca','651abc3f4bc42263463416bb'];
  //       for (const topic_id of topic_ids) {
  //         const tora_temrm = new ToraTermRelationModel({
  //           objectType: 'video', // Replace with the appropriate user ID
  //           objectId: "651e596f77b66c56fe87d6d4",
  //           termId: topic_id,
  //           termName: 'topic',
  //         });
  //         const savedToraTerms = await tora_temrm.save();
  //       }
  //     console.log('Dummy user inserted successfully.');
  //   } catch (error) {
  //     console.error('Error inserting dummy data:', error);
  //   } finally {
  //     mongoose.disconnect();
  //   }
  // }

  // Insert dummy data into collections
  async function seedDataUser() {
    try {
        let user_ids = ['65118a686cd915d6963a6354','65118a686cd915d6963a6354'];
        for (const user_id of user_ids) {
          const tora_temrm = new ToraTermRelationModel({
            objectType: 'video', // Replace with the appropriate user ID
            objectId: "651e596f77b66c56fe87d6d4",
            termId: user_id,
            termName: 'user',
          });
          const savedToraTerms = await tora_temrm.save();
        }
      console.log('Dummy user inserted successfully.');
    } catch (error) {
      console.error('Error inserting dummy data:', error);
    } finally {
      mongoose.disconnect();
    }
  }

  // Call the seedData function to start the seeding process
// seedData();
seedDataUser();
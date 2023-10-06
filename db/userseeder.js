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
import bcrypt from 'bcrypt';

dotenv.config();
const DATABASE_URI = process.env.DATABASE_URL;

connectDB(DATABASE_URI);

// Define dummy data



  // Insert dummy data into collections
  async function seedData() {
    try {
        const salt = await bcrypt.genSalt(10);
        const userData = [
            { firstName: 'Varun', lastName: 'Kumar', email:"varun@example.com",password:await bcrypt.hash('varun1234', salt), gender:"male", preferredLang:"6511880e8999b3af04ae11fb", role:"speaker", status:"active" },
            { firstName: 'Anuj', lastName: 'Pathania', email:"anuj@example.com", password:await bcrypt.hash('anuj1234', salt), gender:"male", preferredLang:"6511880e8999b3af04ae11fb", role:"speaker", status:"active" },
            ];
      await UserModel.create(userData);
      console.log('Dummy user inserted successfully.');
    } catch (error) {
      console.error('Error inserting dummy data:', error);
    } finally {
      mongoose.disconnect();
    }
  }

  // Call the seedData function to start the seeding process
seedData();
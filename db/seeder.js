import CountryModel from '../models/Country.js';
import LanguageModel from '../models/Language.js';
import connectDB from './connectdb.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import SeriesModel from '../models/Series.js';
import TaxonomyModel from '../models/Taxonomy.js';
import ToraVideoModel from '../models/ToraVideo.js';
import ToraTermRelationModel from '../models/ToraTermRelation.js';
dotenv.config();
const DATABASE_URI = process.env.DATABASE_URL;

connectDB(DATABASE_URI);

// Define dummy data

const countriesData = [
  { country: 'United State', countryCode: 'US', /* ... other country properties */ },
  { country: 'India', countryCode: 'IND', /* ... other country properties */ },
  // Add more country data objects as needed
];

const languagesData = [
  { language: 'English', langCode: 'en', userId: '65117e2831e976738455fb4c', /* ... other language properties */ },
  { language: 'Spanish', langCode: 'es', userId: '65117e2831e976738455fb4c', /* ... other language properties */ },
  { language: 'עברית', langCode: 'he', userId: '65117e2831e976738455fb4c', /* ... other language properties */ },
  { language: 'אידיש', langCode: 'yi', userId: '65117e2831e976738455fb4c', /* ... other language properties */ },
  // Add more language data objects as needed
];

const seriesData = [
  { _id: new mongoose.Types.ObjectId(), title: "Birkat Kohanim", slug: "birkat-kohanim", description: "", thumbnail: "https://cdn.torazoom.com/wp-content/uploads/2022/05/13101129/4-1.jpg", order: 1, userId: "65118a686cd915d6963a6354", lang: "en", relationId: new mongoose.Types.ObjectId(), status:  'publish'
  },
  { _id: new mongoose.Types.ObjectId(), title: "Chovas Halevavos", slug: "chovas-halevavos", description: "", thumbnail: "https://cdn.torazoom.com/wp-content/uploads/2022/05/13101129/4-1.jpg", order: 2, userId: "65118a686cd915d6963a6354", lang: "en", relationId: new mongoose.Types.ObjectId(), status:  'publish'
  },
  { _id: new mongoose.Types.ObjectId(), title: "Eben Shelema - Gaon De Vilna", slug: "eben-shelema-gaon-de-vilna", description: "", thumbnail: "https://cdn.torazoom.com/wp-content/uploads/2022/05/13101129/4-1.jpg", order: 1, userId: "65118a686cd915d6963a6354", lang: "en", relationId: new mongoose.Types.ObjectId(), status:  'publish'
  },
  { _id: new mongoose.Types.ObjectId(), title: "Derej Hashem", slug: "derej-hashem", description: "", thumbnail: "https://cdn.torazoom.com/wp-content/uploads/2022/05/13101129/4-1.jpg", order: 1, userId: "65118a686cd915d6963a6354", lang: "en", relationId: new mongoose.Types.ObjectId(), status:  'publish',
  },
  { _id: new mongoose.Types.ObjectId(), title: "Educacion De Hijos", slug: "educacion-de-hijos", description: "", thumbnail: "https://cdn.torazoom.com/wp-content/uploads/2022/05/13101129/4-1.jpg", order: 1, userId: "65118a686cd915d6963a6354", lang: "en", relationlId: new mongoose.Types.ObjectId(), status:  'publish'
  },
  { _id: new mongoose.Types.ObjectId(), title: "Jasidut", slug: "jasidut", description: "", thumbnail: "https://cdn.torazoom.com/wp-content/uploads/2022/05/13101129/4-1.jpg", order: 1, userId: "65118a686cd915d6963a6354", lang: "en", relationlId: new mongoose.Types.ObjectId(), status:  'publish'
  }
]

const seriesSingle = [
  { _id: new mongoose.Types.ObjectId(), title: "26 Pasos A La Spanish", slug: "26-pasos-a-la-spanish", description: "", thumbnail: "https://cdn.torazoom.com/wp-content/uploads/2022/05/13101129/4-1.jpg", order: 1, userId: "65118a686cd915d6963a6354", lang: "es", relationlId: '651662e80506bc80821a877c', status:  'publish', type: "series"
  },
]

const video_seeder = [
  {_id: new mongoose.Types.ObjectId(),title:"Early Start of the Day...",description:"",slug:"",thumbnail:"https://i.vimeocdn.com/video/1457335392-fa80766a0bbd6315f80344308995d05970b8ec7c51a9f4ba6761ed3f6a44d047-d_295x166?r=pad",userId:"65118a686cd915d6963a6354",lang:"en",recordLocation:"United State",recordedAt:"2023-08-04",vimeoId:"723822731",shortVideo:1,uploadType:"single_video",videoSource:"vimeo",audioLink:"",visible:"both",status:"publish",publishedAt:""}
]

// await LanguageModel.create(languagesData, { maxTimeMS: 30000 }); 

// Insert dummy data into collections
async function seedData() {
    console.log("--- seeder is running ====");
  try {
    // await CountryModel.create(countriesData);
    // await LanguageModel.create(languagesData);
    // await SeriesModel.create(seriesData);
    // await TaxonomyModel.create(seriesSingle);
    
    var video = await ToraVideoModel.create(video_seeder);
    
    console.log(video);
    console.log("=== video details ====");
    const videoId = video[0]._id;
    console.log(videoId);
    if (video && videoId) {
      let series_ids = ['651662e80506bc80821a877c','651664cfc2a6616e07d64038','651665d515cfd97476319cad'];
      for (const series_id of series_ids) {
        const tora_temrm = new ToraTermRelationModel({
          objectType: 'video', // Replace with the appropriate user ID
          objectId: videoId,
          termId: series_id,
          termName: 'series',
        });
        const savedToraTerms = await tora_temrm.save();
      }
    }
    // const doc = new LanguageModel({ language: 'English', langCode: 'en', userId: '65117e2831e976738455fb4c'});
    // await doc.save();
    console.log('Dummy data inserted successfully.');
  } catch (error) {
    console.error('Error inserting dummy data:', error);
  } finally {
    mongoose.disconnect();
  }
}

// Update all existing documents to set a default value for "area"
// CountryModel.updateMany({}, { $set: { area: "Default Area Value" } }, (err) => {
//   if (err) {
//     console.error("Error updating documents:", err);
//   } else {
//     console.log("Updated existing documents with default area value.");
//   }
// });

// Call the seedData function to start the seeding process
seedData();

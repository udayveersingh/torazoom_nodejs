import mongoose from 'mongoose';
import TaxonomyModel from "../../models/Taxonomy.js";
import ToraFeaturesModel from '../../models/ToraFeatures.js';

class TopicApiController{
    static get_home_topics = async (req, res) =>{
        try {
            const pageNumber = req.query.page;
            const pageSize = 5; // Specify the number of documents per page

            const skipCount = (pageNumber - 1) * pageSize;

            // Query to retrieve data for the current page
            // const series = await SeriesModel.find()
            var current_lang;
            if(req.query.current_lang == "es" || req.query.current_lang == "he" || req.query.current_lang == "yi"){
              current_lang = req.query.current_lang;
            }else{
              current_lang = 'en';
            }

            const topics = await TaxonomyModel.find({ $and: [
              {type: 'topic'},
              {lang: current_lang}
            ] })
            .skip(skipCount) // Skip the initial documents
            .limit(pageSize); // Limit the number of documents returned

            // Total number of documents (for calculating total pages, etc.)
            const totalDocuments = await TaxonomyModel.countDocuments({ $and: [{ type: 'topic' }, {lang: 'en'}] });

            // Calculate total pages based on the total number of documents and page size
            const totalPages = Math.ceil(totalDocuments / pageSize);
            
            // Send the data as JSON
            res.status(200).json({ status: "success", data: topics, totalPages: totalPages });
          } catch (error) {
            console.error('Error fetching series data:', error);
            res.status(500).json({ status: "error", message: "Internal server error" });
          }
    }

    static create_topics = async (req, res) =>{
      try {
        const {name, slug, parentTopic, description, position, language} = req.body;

          // Get the uploaded file from the request
        const file = req.file;

        console.log("file data");
        console.log(file);

          // Check if a file was uploaded
        if (!file) {
            return res.status(400).json({ error: 'No image uploaded.' });
        }

        var uploaded_path;
        if(file.path)
        {
          uploaded_path =  file.path.replace('public\\', '');
        }

        var topic_id = new mongoose.Types.ObjectId();
          const topic_doc = new TaxonomyModel({
              _id:topic_id,
              title:name,
              slug:slug,
              // parentId:parentTopic, 
              description:description, 
              type:'topic',
              order:position, 
              lang:language, 
              relationlId:topic_id,
              userId: "65118a686cd915d6963a6354",
              status:'publish',
               // Add the image file details to the model
              thumbnail: uploaded_path, // Assuming 'file.path' contains the path to the uploaded image
          });

          if (parentTopic) {
            topic_doc.parentId = parentTopic;
          }

          const result = await topic_doc.save();
           // Return the saved series data as a response
            res.status(201).json({ status: 'success', data: result });
        }
      catch (error) {
        console.log(error);
        // return res.status(500).json({ error: 'Failed to create a new series.' });
        return res.status(500).json({ error: error });
      }
    }

    static view_single_topic = async (req, res)=>{
      try{
        const result = await TaxonomyModel.findById(req.params.id);
        console.log(result);
        res.status(200).json({ status: "success", data: result });
      }  catch (error) {
        console.error('Error fetching topic data:', error);
      }
    }

    static update_topic = async (req, res) =>{
      try {
        const {name, slug, parentTopic, description, position, language, spanish, hebrew, yiddish} = req.body;

        // Get the uploaded file from the request
        const file = req.file;
        console.log('file name ');
        console.log(file);

        var uploaded_path;
        if (file && file.path && file.path !== "undefined") 
        {
          uploaded_path =  file.path.replace('public\\', '');
        }

        const topic_doc = {
          title:name,
          slug:slug,
        //   parentId:parentTopic, 
          description:description, 
          translations: [
            { languageCode: 'en', languageName:"english", translation: name },
            { languageCode: 'es', languageName:"spanish", translation: spanish },
            { languageCode: 'he', languageName:"hebrew", translation: hebrew },
            { languageCode: 'yi', languageName:"yiddish",translation: yiddish },
          ],
          order:position, 
          lang:language, 
          status:'publish',
           // Add the image file details to the model
          thumbnail: uploaded_path, // Assuming 'file.path' contains the path to the uploaded image
      };

      if (parentTopic) {
        topic_doc.parentId = parentTopic;
      }

      console.log(topic_doc);
      console.log("cheking document =====");

      console.log(req.params);
      console.log("param error ====");

        const result = await TaxonomyModel.findByIdAndUpdate(req.params.id, topic_doc);

        res.status(201).json({ status: 'success', data: result });
      } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Failed to update Topic.' });
      }
    }

    static delete_topic = async (req, res) =>{
      try {
        const result = await TaxonomyModel.findByIdAndRemove(req.params.id);
        res.status(201).json({ status: 'success', data: result });
      } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Failed to delete series.' });
      }
      
    }

    static translate_topic = async (req, res) =>{
      console.log(req.body);
      const {topic_id, translate_text, lang_code} = req.body;  
      const result = await TaxonomyModel.findOneAndUpdate(
       {
         $and: [
           { relationlId: topic_id },
           { lang: lang_code },
           { type: 'topic' }
         ]
       },
       {
         $set: { title: translate_text }
       },
       { new: true } // This option returns the updated document
     );

     console.log("=== result ====");
     console.log(result);

     if(result){
       res.status(201).json({ status: 'success', data: result });
     }else{
         const eng_result = await TaxonomyModel.findById(topic_id);
         console.log(eng_result);

         const topic_doc = new TaxonomyModel({
           title:translate_text,
           slug: eng_result.slug,
           // parentId:parentSeries, 
           description:eng_result.description, 
           type:'topic',
           order:eng_result.position, 
           lang:lang_code, 
           relationlId:eng_result._id,
           userId: "65118a686cd915d6963a6354",
           status:'publish',
           // Add the image file details to the model
           thumbnail: eng_result.thumbnail, // Assuming 'file.path' contains the path to the uploaded image
       });

       const new_result = await topic_doc.save();

       res.status(201).json({ status: 'success', data: new_result });

       console.log("=== english data =====");
     }
    }

    // static category_home_slider = async(req, res) =>{
    //   const lang = req.params.lang; // Access the language code from req.params.lang
    //   res.json({ key: lang });
    //   // res.send(req);

    // }

    static category_home_slider = async(req, res) =>{
      var current_lang = req.params.lang || 'en';

      const results = await ToraFeaturesModel.aggregate([
        {
          $match: {
            'taxonomy_name': 'category_slider',
          },
        },
        {
          $lookup: {
            from: 'tora_taxonomies',
            localField: 'taxonomy_id',
            foreignField: '_id',
            as: 'taxonomyData',
          },
        },
        {
          $unwind: '$taxonomyData',
        },
        {
          $lookup: {
            from: 'tora_term_relations',
            localField: 'taxonomy_id',
            foreignField: 'termId',
            as: 'termRelations',
          },
        },
        {
          $unwind: '$termRelations',
        },
        {
          $lookup: {
            from: 'tora_videos',
            localField: 'termRelations.objectId',
            foreignField: '_id',
            as: 'videos',
          },
        },
        {
          $unwind: '$videos',
        },
        {
          $group: {
            _id: '$_id',
            taxonomyData: { $first: '$taxonomyData.translations' },
            termRelations: { $push: '$termRelations' },
            videos: { $push: '$videos' },
          },
        },
        {
          $project: {
            termRelations: 0, // Exclude the termRelations array from the result
          },
        },
        {
          $addFields: {
            'taxonomyData': {
              $filter: {
                input: '$taxonomyData',
                as: 'translation',
                cond: { $eq: ['$$translation.languageCode', current_lang] },
              },
            },
          },
        },
      ]);

      res.send(results);
    }
    
}

export default TopicApiController;

import mongoose from 'mongoose';
import SeriesModel from "../../models/Series.js";
import TaxonomyModel from "../../models/Taxonomy.js";
import ToraFeaturesModel from '../../models/ToraFeatures.js';

class SeriesApiController{
    static get_home_series = async (req, res) =>{
        try {
            const pageNumber = req.query.page;
            const pageSize = 10; // Specify the number of documents per page

            const skipCount = (pageNumber - 1) * pageSize;

  

            var current_lang;
            // req.query.current_lang = null;
            if(req.query.current_lang == "es" || req.query.current_lang == "he" || req.query.current_lang == "yi"){
              current_lang = req.query.current_lang;
            }else{
              current_lang = 'en';
            }

            console.log("current language value =====");
            console.log(current_lang);
            console.log(req.query.current_lang);
            const series = await TaxonomyModel.find({ $and: [
              {type: 'series'},
              {lang: current_lang}
            ] })
            .skip(skipCount) // Skip the initial documents
            .limit(pageSize); // Limit the number of documents returned

            // Total number of documents (for calculating total pages, etc.)
            const totalDocuments = await TaxonomyModel.countDocuments({ $and: [
              {type: 'series'},
              {lang: current_lang}
            ] });

            console.log(totalDocuments);
            console.log("=== document number =====");

            // Calculate total pages based on the total number of documents and page size
            const totalPages = Math.ceil(totalDocuments / pageSize);
            
            // Send the data as JSON
            res.status(200).json({ status: "success", data: series, totalPages: totalPages });
          } catch (error) {
            console.error('Error fetching series data:', error);
            res.status(500).json({ status: "error", message: "Internal server error" });
          }
    }

    static create_series = async (req, res) =>{
      try {
        // console.log(req.body);
        // res.send( req.body);
        const {name, slug, parentSeries, description, position, language, spanish, hebrew, yiddish} = req.body;

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

        var series_id = new mongoose.Types.ObjectId();

        console.log(req.body);
        console.log("parent series =====");

          const series_doc = new TaxonomyModel({
              _id:series_id,
              title:name,
              slug:slug,
              // parentId:parentSeries, 
              description:description, 
              translations: [
                { languageCode: 'en', languageName:"english", translation: name },
                { languageCode: 'es', languageName:"spanish", translation: spanish },
                { languageCode: 'he', languageName:"hebrew", translation: hebrew },
                { languageCode: 'yi', languageName:"yiddish",translation: yiddish },
              ],
              type:'series',
              order:position, 
              lang:language, 
              relationlId:series_id,
              userId: "65118a686cd915d6963a6354",
              status:'publish',
               // Add the image file details to the model
              thumbnail: uploaded_path, // Assuming 'file.path' contains the path to the uploaded image
          });

          if (parentSeries) {
            console.log("you are in ====");
            series_doc.parentId = parentSeries;
          }

          console.log(series_doc);
          console.log("parent series fds=====");

          const result = await series_doc.save();
           // Return the saved series data as a response
            res.status(201).json({ status: 'success', data: result });
        }
      catch (error) {
        console.log(error);
        // return res.status(500).json({ error: 'Failed to create a new series.' });
        return res.status(500).json({ error: error });
      }
    }

    static view_single_series = async (req, res)=>{
      try{
        const result = await SeriesModel.findById(req.params.id);
        console.log(result);
        res.status(200).json({ status: "success", data: result });
      }  catch (error) {
        console.error('Error fetching series data:', error);
      }
    }

    static update_series = async (req, res) =>{
      try {
        const {name, slug, parentSeries, description, position, language, spanish, hebrew, yiddish} = req.body;

        // Get the uploaded file from the request
        const file = req.file;
        console.log('file name ');
        console.log(file);

        var uploaded_path;
        if (file && file.path && file.path !== "undefined") 
        {
          uploaded_path =  file.path.replace('public\\', '');
        }

        const series_doc = {
          title:name,
          slug:slug,
          // parentId:parentSeries, 
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

      if (parentSeries) {
        series_doc.parentId = parentSeries;
      }

        console.log(req.params);
        console.log("param error ====");

        const result = await TaxonomyModel.findByIdAndUpdate(req.params.id, series_doc);

        res.status(201).json({ status: 'success', data: result });
      } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Failed to update series.' });
      }
    }

    static delete_series = async (req, res) =>{
      try {
        const result = await TaxonomyModel.findByIdAndRemove(req.params.id);
        res.status(201).json({ status: 'success', data: result });
      } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Failed to delete series.' });
      }
      
    }

    static translate_series = async (req, res) =>{
       console.log(req.body);

       res.send(req.body);

       const {series_id, translate_text, lang_code} = req.body;  
       const result = await TaxonomyModel.findOneAndUpdate(
        {
          $and: [
            { relationlId: series_id },
            { lang: lang_code },
            { type: 'series' }
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
          const eng_result = await TaxonomyModel.findById(series_id);
          console.log(eng_result);

          const series_doc = new TaxonomyModel({
            title:translate_text,
            slug: eng_result.slug,
            // parentId:parentSeries, 
            description:eng_result.description, 
            type:'series',
            order:eng_result.position, 
            lang:lang_code, 
            relationlId:eng_result._id,
            userId: "65118a686cd915d6963a6354",
            status:'publish',
            // Add the image file details to the model
            thumbnail: eng_result.thumbnail, // Assuming 'file.path' contains the path to the uploaded image
        });

        const new_result = await series_doc.save();

        res.status(201).json({ status: 'success', data: new_result });

        console.log("=== english data =====");
      }

    }

    static home_series = async (req, res) =>{
      var current_lang = req.params.lang || 'en';

      // const results = await ToraFeaturesModel.aggregate([
      //   {
      //     $match: {
      //       'taxonomy_name': 'series', // Filter by taxonomy_name
      //       // 'tora_term_relations.termName':'topic'
      //     },
      //   },
      //   {
      //     $lookup: {
      //       from: 'tora_taxonomies', // The name of the other collection
      //       localField: 'taxonomy_id', // Field from tora_features collection
      //       foreignField: '_id', // Field from tora_taxonomies collection
      //       as: 'taxonomyData', // Alias for the joined data
      //     },
      //   },
      //   {
      //     $unwind: '$taxonomyData',
      //   },
      //     {
      //       $lookup: {
      //         from: 'tora_term_relations', // The name of the other collection
      //         localField: 'taxonomy_id', // Field from tora_features collection
      //         foreignField: 'termId', // Field from tora_term_relations collection
      //         as: 'videoCounts', // Alias for the joined data
      //       },
      //     },
      //     {
      //       $lookup: {
      //         from: 'tora_users', // The name of the other collection
      //         localField: 'videoCounts.taxonomy_id', // Field from tora_features collection
      //         foreignField: '_id', // Field from tora_term_relations collection
      //         as: 'userCount', // Alias for the joined data
      //       },
      //     },
      //     {
      //       $addFields: {
      //         videoCount: { $size: '$videoCounts' },
      //         // userCount: { $first: '$userCount' },
      //         'taxonomyData': {
      //           $filter: {
      //             input: '$taxonomyData.translations',
      //             as: 'translation',
      //             cond: {
      //               $eq: ['$$translation.languageCode', current_lang] // Include only English translations
      //             },
      //           },
      //         },
      //       },
      //     },
      //   {  
      //     $project: {
      //       videoCounts: 0, // Exclude the videoCounts array from the result
      //     },
      //   },
      // ]);

    //   const results = await ToraFeaturesModel.aggregate([
    //   {
    //     $match: {
    //       'taxonomy_name': 'series', // Filter by taxonomy_name
    //     },
    //   },
    //   {
    //     $lookup: {
    //       from: 'tora_taxonomies', // The name of the other collection
    //       localField: 'taxonomy_id', // Field from tora_features collection
    //       foreignField: '_id', // Field from tora_taxonomies collection
    //       as: 'taxonomyData', // Alias for the joined data
    //     },
    //   },
    //   {
    //     $lookup: {
    //       from: 'tora_term_relations', // The name of the other collection
    //       localField: 'taxonomy_id', // Field from tora_features collection
    //       foreignField: 'termId', // Field from tora_term_relations collection
    //       as: 'videoCounts', // Alias for the joined data
    //     },
    //   },
    //   {
    //     $group: {
    //       _id: '$taxonomyData._id', // Group by taxonomyData._id
    //       taxonomyData: { $first: '$taxonomyData' }, // Preserve the taxonomyData
    //       videoCount: { $videoCounts:{$count: {}} }, // Count the number of videos
    //     },
    //   },
    // ]);

    const results = await ToraFeaturesModel.aggregate([
      {
        $match: {
          'taxonomy_name': 'series',
          // 'tora_taxonomies.status':"publish"
        },
      },
      {
        $lookup: {
          from: 'tora_taxonomies',
          // localField: 'taxonomy_id',
          // foreignField: '_id',
          let: { taxonomyId: '$taxonomy_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$_id', '$$taxonomyId'] }, // Match the taxonomy_id field
                    { $eq: ['$status', 'publish'] }   // Match the status field
                    // { $eq: ['$translations'] }   // Match the status field
                  ]
                }
              }
            }
          ],
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
          taxonomyName: { $first: '$taxonomyData.translations' },
          taxonomy: { $first: '$taxonomyData' },
          termRelations: { $push: '$termRelations' },
          videos: { $push: '$videos' },
          users: { $push: '$videos.userId' },
        },
      },
      {
        $addFields: {
          'taxonomyName': {
            $filter: {
              input: '$taxonomyName',
              as: 'translation',
              cond: { $eq: ['$$translation.languageCode', current_lang] },
            },
          },
         'videoCount': { $size: '$videos' }, // Add a field 'videoCount' with the size of 'videos' array
         'uniqueUserCount': {
            $size: {
              $setUnion: '$users' // Count unique user IDs using $setUnion
            }
          }
        },
      },
      {
        $project: {
          termRelations: 0, // Exclude the termRelations array from the result
          videos:0,
          users:0,
          'taxonomy.translations': 0, // Exclude the translations field
        },
      },
    ]);


    
      

        res.send(results);
    }
    
}

export default SeriesApiController;

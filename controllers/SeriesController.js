import LanguageModel from "../models/Language.js";
import SeriesModel from "../models/Series.js";
import TaxonomyModel from "../models/Taxonomy.js";
import ToraFeaturesModel from "../models/ToraFeatures.js";
import UserModel from "../models/User.js";

class SeriesController{
    static get_home_series = async (req, res) =>{
        try {
            const all_cookies = req.cookies; 
            var current_lang = 'en';
            if(all_cookies.current_lang){
              var current_lang = all_cookies.current_lang;
            }

            let user = await UserModel.findById(req.session.userId);
            const series = await TaxonomyModel.find( {
              $and: [
                { type: 'series' },
                { lang: current_lang }
              ]
            });
            const languages = await LanguageModel.find();
            // localStorage.setItem('current_lang', 'en');
            // const storedValue = localStorage.getItem('current_lang'); // Replace 'key' with your actual key
            res.render('series',{user, series, languages, current_lang });
          } catch (error) {
            console.error('Error fetching series data:', error);
            res.status(500).json({ status: "error", message: "Internal server error" });
          }
    }

    static edit_series = async (req, res) =>{
        try{
          const all_cookies = req.cookies; 
          var current_lang = 'en';
          if(all_cookies.current_lang){
            var current_lang = all_cookies.current_lang;
          }
          
          // const result = await TaxonomyModel.findById(req.params.id);
          const result = await TaxonomyModel.findOne({ $and: [
            {_id: req.params.id},
            {lang: current_lang}
          ] });
          // const result_lang = await TaxonomyModel.find({ _id: { $ne: req.params.id }, relationlId:req.params.id }, '_id title lang relationlId');
          const result_lang = await TaxonomyModel.find({ $and: [
            {relationlId: req.params.id},
            {lang: {$ne: current_lang}}
          ] }, '_id title lang relationlId');

          // res.send(result.translations);
          // const result_lang = await TaxonomyModel.find({ _id: { $ne: req.params.id } }, '_id title lang');
          // console.log(result);
          // const series = await TaxonomyModel.find();
          const series = await TaxonomyModel.find({ _id: { $ne: req.params.id }, type: 'series' });

          console.log("all series ====");
          console.log(result_lang);
          const langauges = await LanguageModel.find();
          res.render('series-edit',{series, langauges, result, result_lang });
        }  catch (error) {
          console.error('Error fetching series data:', error);
        }
    }

    static series_translation = async(req, res) =>{
      // const series = await TaxonomyModel.find( {type: 'series' });
      // // res.render('series-translaton', {series});

      // // Assuming `seriesData` contains your MongoDB documents
      // const groupedData = {};

      // series.forEach((item) => {
      //     const { relationlId, lang, title } = item;
          
      //     if (!groupedData[relationlId]) {
      //         groupedData[relationlId] = {};
      //     }

      //     groupedData[relationlId][lang] = title;
      // });

      const pipeline = [
        {
          $match: {
            type: 'series',
          },
        },
        {
          $group: {
            _id: {
              relationlId: '$relationlId',
              lang: '$lang',
            },
            titles: {
              $push: '$title',
            },
          },
        },
        {
          $group: {
            _id: '$_id.relationlId',
            translations: {
              $push: {
                lang: '$_id.lang',
                titles: '$titles',
              },
            },
          },
        },
        {
          $project: {
            _id: 0,
            relationlId: {
              $toString: '$_id',
            },
            translations: 1,
          },
        },
        {
          $sort: {
            relationlId: 1, // Sort in ascending order by relationlId
          },
        },
      ];
      
      const groupedData = await TaxonomyModel.aggregate(pipeline);
      


      console.log(groupedData);
      console.log("=== group value s====");
      // Now you have a groupedData object with data organized by relationlId and language


      res.render('series-translation', { groupedData });

    }

    static feature = async(req, res) =>{
        const all_cookies = req.cookies; 
        var current_lang = 'en';
        if(all_cookies.current_lang){
          var current_lang = all_cookies.current_lang;
        }
        let message = req.session.message;
        delete req.session.message;
        let series = await TaxonomyModel.find({
          $and: [
            { type: 'series' },
            { lang: current_lang }
          ]
        });
        let topic = await TaxonomyModel.find({
          $and: [
            { type: 'topic' },
            { lang: current_lang }
          ]
        });

        // Perform the aggregation using $lookup
        // Perform the aggregation using $lookup
        // const results = await ToraFeaturesModel.aggregate([
        //   {
        //     $lookup: {
        //       from: 'tora_taxonomies', // The name of the other collection
        //       localField: 'taxonomy_id', // Field from tora_features collection
        //       foreignField: '_id', // Field from tora_taxonomies collection
        //       as: 'taxonomyData', // Alias for the joined data
        //     },
        //   },
        //   {
        //     $match: {
        //       'taxonomy_name': 'series', // Filter by taxonomy_name
        //     },
        //   },
        // ]);
        // const results = await ToraFeaturesModel.find({ taxonomy_name: 'series' });
        const series_results = await ToraFeaturesModel.find({ taxonomy_name: 'series' }).select('taxonomy_id');
        const seriesIds = series_results.map(result => result.taxonomy_id);
        const topic_results = await ToraFeaturesModel.find({ taxonomy_name: 'topic' }).select('taxonomy_id');
        const topicIds = topic_results.map(result => result.taxonomy_id);
        const category_results = await ToraFeaturesModel.find({ taxonomy_name: 'category_slider' }).select('taxonomy_id');
        const categoryIds = category_results.map(result => result.taxonomy_id);
        console.log("=== result detial ===");

        res.render('feature', {series, topic, current_lang, seriesIds, topicIds,categoryIds, message});
    }

    static feature_data = async (req, res) =>{
      try{
        const {series, topic, category_slider} = req.body;
        const postData = {
          series,
          topic,
          category_slider
        };
        
        let torafeature = await ToraFeaturesModel.deleteMany();
      // Iterate through the postData object
        for (const taxonomyName in postData) {
          if (postData.hasOwnProperty(taxonomyName)) {
            const taxonomyIds = postData[taxonomyName];

            console.log("taxonomy ids ====");
            console.log(taxonomyIds);


            console.log(torafeature);
            console.log("=== torafeature =====");
            
            // Ensure taxonomyIds is always an array
            const taxonomyIdsArray = Array.isArray(taxonomyIds) ? taxonomyIds : [taxonomyIds];
            // Create and save a tora_features document for each taxonomyName and taxonomyId
            // taxonomyIds.forEach(async (taxonomyId) => {
            for (const taxonomyId of taxonomyIdsArray) {
              const toraFeature = new ToraFeaturesModel({
                userId: '65117e2831e976738455fb4c', // Replace with the appropriate user ID
                taxonomy_name: taxonomyName,
                taxonomy_id: taxonomyId,
                langcode: "en", // Replace with the appropriate langcode
              });

              console.log("--- feature details =====");
              console.log(toraFeature);
              console.log("== feature ids =====");
              console.log(taxonomyId);

                const savedToraFeature = await toraFeature.save();
                console.log(`Saved: ${taxonomyName} - ${taxonomyId}`);
                console.log(`Saved: savedToraFeature`);
            };

          }
        }

        req.session.message = 'Feature updated.';

        res.redirect("/feature");
      }
      catch (error) {
        console.error("Error:", error);
        res.status(500).send("Internal Server Error");
      }
    }
}

export default SeriesController;

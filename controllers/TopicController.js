import LanguageModel from "../models/Language.js";
import TaxonomyModel from "../models/Taxonomy.js";
import UserModel from "../models/User.js";

class TopicController{
    static get_home_topics = async (req, res) =>{
        try {
            const all_cookies = req.cookies; 
            var current_lang = 'en';
            if(all_cookies.current_lang){
              var current_lang = all_cookies.current_lang;
            }

            let user = await UserModel.findById(req.session.userId);
            const topics = await TaxonomyModel.find({ type: 'topic' });
            const langauges = await LanguageModel.find();
            res.render('topics',{user, topics, langauges, current_lang });
          } catch (error) {
            console.error('Error fetching series data:', error);
            res.status(500).json({ status: "error", message: "Internal server error" });
          }
    }

    static edit_topic = async (req, res) =>{
        try{
          const result = await TaxonomyModel.findById(req.params.id);
          console.log(result);
          console.log("topic value ====");
          const topics = await TaxonomyModel.find({ _id: { $ne: req.params.id }, type: 'topic' });
          const langauges = await LanguageModel.find();
          console.log(topics);
          console.log("topic dddd ====");
          res.render('topic-edit',{topics, langauges, result });
        }  catch (error) {
          console.error('Error fetching series data:', error);
        }
    }

    static add_new_topic = async (req, res) =>{
      try {
        const all_cookies = req.cookies; 
        var current_lang = 'en';
        if(all_cookies.current_lang){
          var current_lang = all_cookies.current_lang;
        }

        const topics = await TaxonomyModel.find({ type: 'topic' });
        const languages = await LanguageModel.find();
        res.render('topic/topic-add',{ topics, languages, current_lang });
      } catch (error) {
        console.log(error);
        res.send(error);
      } 
    }

    static topic_translation = async (req, res) =>{
      const pipeline = [
        {
          $match: {
            type: 'topic',
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

      res.render('topic-translation', { groupedData });
    }
}

export default TopicController;

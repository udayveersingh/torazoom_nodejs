import express from 'express';
import SeriesApiController from "../controllers/Api/SeriesApiController.js";
import TopicApiController from "../controllers/Api/TopicApiController.js"
import multer from 'multer';
import path from 'path';
const router = express.Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      // Specify the directory where uploaded files will be stored
      cb(null, './public/uploads');
      // const uploadDir = path.join(path.resolve(), 'public', 'uploads'); // Construct an absolute path
      // cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
       // Generate a unique filename based on the current date and time
            const dateNow = new Date().toISOString().replace(/:/g, '-');
            const filename = dateNow + '-' + file.originalname;
            cb(null, filename);
    },
  });

  // Create a multer instance with the defined storage strategy
const upload = multer({ storage: storage });

router.get('/series', SeriesApiController.get_home_series);
router.post('/series', upload.single('image'), SeriesApiController.create_series);
router.get('/series/view/:id', SeriesApiController.view_single_series);
router.post('/series/update/:id', upload.single('image'), SeriesApiController.update_series);
router.post('/series/delete/:id', SeriesApiController.delete_series); 
router.post('/series/translate', SeriesApiController.translate_series); 
router.get('/:lang?/series-home', SeriesApiController.home_series); 

router.get('/topics', TopicApiController.get_home_topics);
router.post('/topic', upload.single('image'), TopicApiController.create_topics);
router.get('/topic/view/:id', TopicApiController.view_single_topic);
router.post('/topic/update/:id', upload.single('image'), TopicApiController.update_topic);
router.post('/topic/translate', TopicApiController.translate_topic); 
router.get('/:lang?/category-home-slider', TopicApiController.category_home_slider); 

export default router;



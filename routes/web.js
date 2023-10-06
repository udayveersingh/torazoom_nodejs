import express from 'express';
const router = express.Router();
import SeriesController from '../controllers/SeriesController.js';
import TopicController from '../controllers/TopicController.js';

// router.get('/', StudentController.getAllDoc);
// router.post('/', StudentController.getAllDoc);
// router.get('/:id', StudentController.getSingleDocById);
// router.put('/:id', StudentController.UpdateDocById);
// router.delete('/:id', StudentController.DeleteDocById);

router.get('/series', SeriesController.get_home_series);
router.get('/series/edit/:id', SeriesController.edit_series);
router.get('/series/translation', SeriesController.series_translation);

router.get('/topics', TopicController.get_home_topics);
router.get('/topic/add', TopicController.add_new_topic);
router.get('/topic/edit/:id', TopicController.edit_topic);
router.get('/topic/translation', TopicController.topic_translation);

router.get('/feature', SeriesController.feature);
router.post('/feature', SeriesController.feature_data);

export default router;



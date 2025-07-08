import express from 'express';
import { getNews, createNews } from '../controllers/newsController';

const router = express.Router();

router.get('/', getNews);
router.post('/', createNews);

export default router;

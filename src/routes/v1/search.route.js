import express from 'express';
import searchController from '../../controllers/search.controller';
import filter from '../../middlewares/search.middleware';

const { searchFilterCheck } = filter;
const { searchFilter } = searchController;
const router = express.Router();
router.get('/', searchFilterCheck, searchFilter);
export default router;

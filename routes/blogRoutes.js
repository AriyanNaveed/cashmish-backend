import express from 'express';
import {
    getPublishedBlogs,
    getBlogById,
    getAllBlogs,
    createBlog,
    updateBlog,
    deleteBlog,
} from '../controllers/blogController.js';

const router = express.Router();

// Public routes
router.get('/published', getPublishedBlogs);

// Admin routes
router.get('/all', getAllBlogs);
router.post('/', createBlog);
router.put('/:id', updateBlog);
router.delete('/:id', deleteBlog);

// Public single blog (after /all to avoid conflict)
router.get('/:id', getBlogById);

export default router;

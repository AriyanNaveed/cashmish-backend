import express from 'express';
import ChatSession from '../models/chatModel.js';

const router = express.Router();

// Get all active chat sessions for the admin panel
router.get('/sessions', async (req, res) => {
    try {
        const chats = await ChatSession.find().sort({ lastActive: -1 });
        res.json(chats);
    } catch (error) {
        res.status(500).json({ error: 'Server error fetching chats' });
    }
});

// Get specific chat history for a session
router.get('/:sessionId', async (req, res) => {
    try {
        const chat = await ChatSession.findOne({ sessionId: req.params.sessionId });
        if (!chat) {
            return res.json({ messages: [] });
        }
        res.json(chat);
    } catch (error) {
        res.status(500).json({ error: 'Server error fetching chat session' });
    }
});

export default router;

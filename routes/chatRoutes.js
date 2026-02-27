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

// Update chat session status (e.g., mark as closed)
router.put('/:sessionId/status', async (req, res) => {
    try {
        const { status } = req.body;
        const chat = await ChatSession.findOneAndUpdate(
            { sessionId: req.params.sessionId },
            { status },
            { new: true }
        );
        if (!chat) {
            return res.status(404).json({ error: 'Chat session not found' });
        }
        res.json(chat);
    } catch (error) {
        res.status(500).json({ error: 'Server error updating chat status' });
    }
});

// Delete a chat session
router.delete('/:sessionId', async (req, res) => {
    try {
        const chat = await ChatSession.findOneAndDelete({ sessionId: req.params.sessionId });
        if (!chat) {
            return res.status(404).json({ error: 'Chat session not found' });
        }
        res.json({ message: 'Chat session deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Server error deleting chat session' });
    }
});

export default router;

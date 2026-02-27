import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
    sender: { type: String, enum: ['user', 'admin'], required: true },
    text: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
});

const chatSessionSchema = new mongoose.Schema({
    sessionId: { type: String, required: true, unique: true },
    userName: { type: String, default: null },
    userEmail: { type: String, default: null },
    status: { type: String, enum: ['active', 'closed'], default: 'active' },
    messages: [messageSchema],
    lastActive: { type: Date, default: Date.now }
}, { timestamps: true });

const ChatSession = mongoose.model('ChatSession', chatSessionSchema);
export default ChatSession;

import ChatSession from './models/chatModel.js';

export const initializeSocket = (io) => {
    io.on('connection', (socket) => {
        console.log(`[Socket] Client connected: ${socket.id}`);

        // Join specific room for a user session
        socket.on('join_chat', (sessionId) => {
            socket.join(sessionId);
            console.log(`[Socket] Joined chat session: ${sessionId}`);
        });

        // Admin joins the global support room to listen to ALL chats
        socket.on('join_admin_dashboard', () => {
            socket.join('support_admin');
            console.log('[Socket] Admin joined support dashboard');
        });

        // Handle User sending a message
        socket.on('send_message', async ({ sessionId, text }) => {
            try {
                let session = await ChatSession.findOne({ sessionId });
                if (!session) {
                    session = new ChatSession({ sessionId, messages: [] });
                }

                const newMessage = { sender: 'user', text };
                session.messages.push(newMessage);
                session.lastActive = new Date();
                await session.save();

                // Echo back to user (to sync across multiple tabs/devices)
                io.to(sessionId).emit('receive_message', newMessage);

                // Broadcast to admin dashboard
                io.to('support_admin').emit('receive_message_admin', { sessionId, message: newMessage, session });
            } catch (error) {
                console.error('[Socket] Error handling send_message:', error);
            }
        });

        // Handle Admin replying to a user
        socket.on('admin_reply', async ({ sessionId, text }) => {
            try {
                let session = await ChatSession.findOne({ sessionId });
                if (session) {
                    const newReply = { sender: 'admin', text };
                    session.messages.push(newReply);
                    session.lastActive = new Date();
                    await session.save();

                    // Send reply specifically to that user's session room
                    io.to(sessionId).emit('receive_message', newReply);
                }
            } catch (error) {
                console.error('[Socket] Error handling admin_reply:', error);
            }
        });

        socket.on('disconnect', () => {
            console.log(`[Socket] Client disconnected: ${socket.id}`);
        });
    });
};

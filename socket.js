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
        socket.on('send_message', async ({ sessionId, text, userName, userEmail }) => {
            try {
                let session = await ChatSession.findOne({ sessionId });

                // If the session was resolved, archive it to start a fresh chat with the same ID
                if (session && session.status === 'closed') {
                    session.sessionId = `${session.sessionId}_archived_${Date.now()}`;
                    await session.save();
                    session = null; // force creation below
                }

                if (!session) {
                    session = new ChatSession({
                        sessionId,
                        userName: userName || null,
                        userEmail: userEmail || null,
                        messages: []
                    });
                } else if (!session.userName && userName) {
                    // Update session with user info if they magically logged in mid-chat
                    session.userName = userName;
                    session.userEmail = userEmail;
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

        // Handle Admin actions (resolve/delete)
        socket.on('admin_action', ({ sessionId, action }) => {
            // Forward this to the user's specific room
            io.to(sessionId).emit('chat_ended', { action });
        });

        socket.on('disconnect', () => {
            console.log(`[Socket] Client disconnected: ${socket.id}`);
        });
    });
};

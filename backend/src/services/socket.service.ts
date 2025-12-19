import { Server as HTTPServer } from 'http';
import { Server as SocketServer } from 'socket.io';
import jwt from 'jsonwebtoken';

export const initializeSocket = (httpServer: HTTPServer): SocketServer => {
    const io = new SocketServer(httpServer, {
        cors: {
            origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
            credentials: true,
        },
    });

    // Authentication middleware for socket connections
    io.use((socket, next) => {
        const token = socket.handshake.auth.token;

        if (!token) {
            return next(new Error('Authentication error'));
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
            socket.data.userId = decoded.userId;
            next();
        } catch (error) {
            next(new Error('Authentication error'));
        }
    });

    io.on('connection', (socket) => {
        console.log(`User connected: ${socket.data.userId}`);

        // Join user to their own room for targeted notifications
        socket.join(socket.data.userId);

        socket.on('disconnect', () => {
            console.log(`User disconnected: ${socket.data.userId}`);
        });
    });

    return io;
};

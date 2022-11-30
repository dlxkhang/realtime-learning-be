import http from 'http'
import { Server } from 'socket.io'

class SocketService {
    private io: Server

    init(httpServer: http.Server) {
        this.io = new Server(httpServer, {
            cors: {
                origin: [
                    'http://localhost:3000',
                    'https://realtime-learning-fe.vercel.app',
                    'https://realtime-learning-fe-midterm.vercel.app',
                ],
                methods: 'GET, POST, PUT, DELETE',
                credentials: true,
            },
        })
        this.io.on('connection', (socket) => {
            console.log(`User ${socket.id} connected`)
            socket.on('disconnecting', () => {
                console.log(`User ${socket.id} disconnected`)
            })
        })
    }
}

export default new SocketService()

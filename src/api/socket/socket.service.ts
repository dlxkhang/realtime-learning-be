import http from 'http'
import { Server } from 'socket.io'
import { corsOptions } from '../../config'

class SocketService {
    private io: Server

    init(httpServer: http.Server) {
        this.io = new Server(httpServer, {
            cors: corsOptions,
        })
        this.io.on('connection', (socket) => {
            console.log(`User ${socket.id} connected`)
            socket.on('disconnecting', () => {
                console.log(`User ${socket.id} disconnected`)
            })
        })
    }

    broadcastToRoom(roomId: string, event: string, message: any) {
        this.io.to(roomId).emit(event, message)
    }
}

export default new SocketService()

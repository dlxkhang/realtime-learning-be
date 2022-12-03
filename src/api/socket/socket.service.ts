import http from 'http'
import { Server } from 'socket.io'
import { corsOptions } from '../../config'
import { SocketEvent } from './event'

class SocketService {
    private io: Server

    init(httpServer: http.Server) {
        this.io = new Server(httpServer, {
            cors: corsOptions,
        })
        this.io.on('connection', (socket) => {
            socket.on('disconnecting', () => {})

            socket.on(SocketEvent.JOIN_ROOM, (message) => {
                const { roomId } = message
                socket.join(`${roomId}`)
            })
        })
    }

    broadcastToRoom(roomId: string, event: string, message?: any) {
        this.io.to(roomId).emit(event, message)
    }
}

export default new SocketService()

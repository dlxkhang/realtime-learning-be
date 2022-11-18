#!/usr/bin/env node

/**
 * Module dependencies.
 */
import mongoose, { ConnectOptions } from 'mongoose'
import * as http from 'http'

import dotenv from 'dotenv'
import app from '../app'

dotenv.config()

/**
 * Get port from environment and store in Express.
 */

const port = normalizePort(process.env.PORT || '5000')
app.set('port', port)

/**
 * Create HTTP server.
 */

mongoose
    .connect(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true } as ConnectOptions)
    .then(() => console.log('DB connected'))
    .catch((err) => console.log('Failed to connect to DB'))
const db = mongoose.connection
db.on('error', console.error.bind(console, 'MongoDB connection error:'))
const server = http.createServer(app)

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port)
server.on('error', onError)
server.on('listening', onListening)

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val: string) {
    const port = parseInt(val, 10)

    if (isNaN(port)) {
        // named pipe
        return val
    }

    if (port >= 0) {
        // port number
        return port
    }

    return false
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error: any) {
    if (error.syscall !== 'listen') {
        throw error
    }

    const bind = typeof port === 'string' ? `Pipe ${port}` : `Port ${port}`

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(`${bind} requires elevated privileges`)
            process.exit(1)
            break
        case 'EADDRINUSE':
            console.error(`${bind} is already in use`)
            process.exit(1)
            break
        default:
            throw error
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
    const addr = server.address()
    const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr.port}`
    console.log(`Listening on ${bind}`)
}

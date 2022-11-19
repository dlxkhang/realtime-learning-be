import createError from 'http-errors'
import express from 'express'
import path from 'path'
import cookieParser from 'cookie-parser'
import logger from 'morgan'
import cors from 'cors'

import route from './route'

const app = express()

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

// Cors option
const options = {
    origin: ['http://localhost:3000', 'https://19ktpm2-registration-fe.vercel.app'],
    methods: 'GET, POST, PUT, DELETE',
    credentials: true,
}

app.use(cors(options))

//routes init
route(app)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404))
})

export default app

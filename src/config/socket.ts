import path from 'path'
import { Server } from 'socket.io'
import { createServer } from 'http'
import express, { Express } from 'express'

import { envVars } from './vars'

const app: Express = express()

const server = createServer(app)
const io = new Server(server)

app.get('/socket', (req, res) => {
  res.sendFile(path.join(__dirname, '/test.html'))
})

io.on('connection', (socket) => {
  console.log('a user connected')
  socket.on('disconnect', () => {
    console.log('user disconnected')
  })
  socket.on('chat message', (msg) => {
    console.log('message: ' + msg)
  })
})

server.listen(envVars.SOCKET_PORT, () => {
  console.log('socket listening on: ', envVars.SOCKET_PORT)
})

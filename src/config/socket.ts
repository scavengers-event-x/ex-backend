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

global.onlineUsers = new Map()

io.on('connection', (socket) => {
  global.chatSocket = socket

  socket.on('add-user', (userId) => {
    global.onlineUsers.set(userId, socket.id)
  })

  socket.on('send-msg', (data) => {
    const sendUserSocket = global.onlineUsers.get(data.to)
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit('msg-receive', { message: data.message, senderSelf: false, createdAt: new Date(Date.now()) })
    }
  })

  socket.on('disconnect', () => {
    console.log('user disconnected')
  })
})

server.listen(envVars.SOCKET_PORT, () => {
  console.log('socket listening on: ', envVars.SOCKET_PORT)
})

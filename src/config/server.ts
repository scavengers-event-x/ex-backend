import cors from 'cors'
import express, {Express, RequestHandler} from 'express'

import { envVars } from './vars'

const server: Express = express()

const PORT = envVars.PORT

server.use(cors())

server.use(express.urlencoded({ extended: true }) as RequestHandler)
server.use(express.json())

// Loading Files
server.use(express.static('files'))

/* eslint-disable */
try{
  server.listen(PORT, () => {
    console.log('Server listening at port: ' + PORT)
  })
}catch (e) {
  console.log('Error listening at port ' + PORT, e)
}
/* eslint-enable */

export { server as app }

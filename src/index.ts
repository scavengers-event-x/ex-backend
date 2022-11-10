import { app } from './config'
import { makeErrorObject } from './utils'
import { commonResponse, responseCode } from './utils/constants'
import { allRouter } from './app.route'

app.use('/api', allRouter)

app.use((err, req, res, next) => {
  res.status(err.status || responseCode.INTERNAL_SERVER).send(makeErrorObject(err.message || commonResponse.error.INTERNAL_SERVER))
})

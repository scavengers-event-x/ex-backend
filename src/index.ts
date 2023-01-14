import { app } from './config'
import { allRouter } from './app.route'
import { makeErrorObject } from './utils'
import { allAdminRouter } from './app.admin.route'
import { commonResponse, responseCode } from './utils/constants'

app.get('/', (req, res) => {
  res.send('Welcome to Event X api')
})

app.use('/api', allRouter)
app.use('/admin', allAdminRouter)

app.use((err, req, res, next) => {
  console.error({ error: err })
  res.status(err.status || responseCode.INTERNAL_SERVER).send(makeErrorObject(err.message || commonResponse.error.INTERNAL_SERVER))
})

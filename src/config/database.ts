import mongoose from 'mongoose'

import { envVars } from './vars'

const dbname = envVars.DB_NAME
const useCloudDatabase = true

const dbOptions = useCloudDatabase
  ? {
      pass: envVars.DB_PASS,
      user: envVars.DB_USER
    }
  : {}

const databaseUrl = useCloudDatabase ? envVars.DB_URL : 'mongodb://localhost:27017'

const databaseName = envVars.DB_NAME

mongoose.connect(databaseUrl + '/' + dbname, dbOptions, (err) => {
  /* eslint-disable */
    if (err) console.log('Error connecting to database.')
    else console.log(`Server connected to database: ${databaseName}.`)
    /* eslint-enable */
})

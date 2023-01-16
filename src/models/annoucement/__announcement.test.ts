import * as mongoose from 'mongoose'
import { describe, expect, it, beforeAll } from '@jest/globals'

import { envVars } from '../../config'
import { AnnouncementModel } from './announcementModel'

// TESTING MONGO CONNECTION
beforeAll(async () => {
  const res = await mongoose.connect(`${envVars.DB_URL}/${envVars.DB_NAME}`)
  if (res) {
    console.log('server connected to database')
  }
})

// TEST CASES FOR ANNOUNCEMENT SCHEMA
describe('announcement schema test', () => {
  // TESTING CREATE OPERATION
  it('create new announcement', () => {
    const SAMPLE_MESSAGE = 'SAMPLE_MESSAGE'
    const announcementToInsert = { title: 'Sample announcement', message: SAMPLE_MESSAGE }

    return AnnouncementModel.create(announcementToInsert)
      .then((announcement) => {
        expect(announcement.message).toEqual(SAMPLE_MESSAGE)
      })
  })

  // SAVING ANNOUNCEMENT OBJECT ID TO TEST UPDATE
  let toUpdateAnnouncementId:mongoose.ObjectId

  // TESTING READ OPERATION
  it('get tested announcement', () => {
    return AnnouncementModel.find({})
      .then((data) => {
        toUpdateAnnouncementId = data[0]._id
        expect(data.length).toBeGreaterThanOrEqual(1)
      })
  })

  // TESTING UPDATE OPERATION
  it('update tested announcement', () => {
    const UPDATE_MESSAGE = 'UPDATE_MESSAGE'
    const toUpdateData = { message: UPDATE_MESSAGE }

    return AnnouncementModel.findByIdAndUpdate(toUpdateAnnouncementId, { $set: toUpdateData }, { returnDocument: 'after', returnOriginal: false })
      .then((data) => {
        expect(data.message).toEqual(UPDATE_MESSAGE)
      })
  })

  // TESTING DELETE OPERATION
  it('delete tested announcement', () => {
    return AnnouncementModel.findByIdAndUpdate(toUpdateAnnouncementId, { $set: { deleted: true } }, { returnDocument: 'after', returnOriginal: false })
      .then((data) => {
        expect(data.delete).toBeTruthy()
      })
  })
})

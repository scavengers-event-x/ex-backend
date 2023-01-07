import * as mongoose from 'mongoose'
import { describe, expect, it, beforeAll } from '@jest/globals'

import { envVars } from '../../config'
import { ChatModel } from './chatModel'
import { UserCategory } from './chat.types'

// TESTING MONGO CONNECTION
beforeAll(async () => {
  await mongoose.connect(`${envVars.DB_URL}/${envVars.DB_NAME}`)
})

// TEST CASES FOR USER SCHEMA
describe('user schema test', () => {
  // TESTING CREATE OPERATION
  it('create new user', () => {
    const product = { category: UserCategory.CUSTOMER, email: 'abc@gmail.com', password: 'test@123', profile: { fullName: 'test user' } }

    return ChatModel.create(product)
      .then((user) => {
        expect(user.email).toEqual('abc@gmail.com')
      })
  })

  // SAVING USER OBJECT ID TO TEST UPDATE
  let userId:mongoose.ObjectId

  // TESTING READ OPERATION
  it('get tested user', () => {
    return ChatModel.findOne({ email: 'abc@gmail.com' })
      .then((data) => {
        userId = data._id
        expect(data.profile.fullName).toEqual('test user')
      })
  })

  // TESTING UPDATE OPERATION
  it('update tested user', () => {
    const toUpdateData = { profile: { fullName: 'user testing' } }

    return ChatModel.findByIdAndUpdate(userId, { $set: toUpdateData }, { returnDocument: 'after', returnOriginal: false })
      .then((data) => {
        expect(data.profile.fullName).toEqual('user testing')
      })
  })

  // TESTING DELETE OPERATION
  it('delete tested user', () => {
    return ChatModel.deleteOne({ email: 'abc@gmail.com' })
      .then((data) => {
        expect(data.deletedCount).toEqual(1)
      })
  })
})

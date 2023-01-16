import * as mongoose from 'mongoose'
import { describe, expect, it } from '@jest/globals'

import { CakeModel } from './cakeModel'

// TEST CASES FOR CAKE SCHEMA
describe('cake schema test', () => {
  // TESTING CREATE OPERATION
  it('create new cake', () => {
    const SAMPLE_PRICE = 5000
    const cakeToInsert = { name: 'Sample cake', description: 'sample description', price: SAMPLE_PRICE }

    return CakeModel.create(cakeToInsert)
      .then((cake) => {
        expect(cake.price).toEqual(SAMPLE_PRICE)
      })
  })

  // SAVING CAKE OBJECT ID TO TEST UPDATE
  let toUpdateCakeId:mongoose.ObjectId

  // TESTING READ OPERATION
  it('get tested cake', () => {
    return CakeModel.find({})
      .then((data) => {
        toUpdateCakeId = data[0]._id
        expect(data.length).toBeGreaterThanOrEqual(1)
      })
  })

  // TESTING UPDATE OPERATION
  it('update tested cake', () => {
    const UPDATE_PRICE = 1000
    const toUpdateData = { price: UPDATE_PRICE }

    return CakeModel.findByIdAndUpdate(toUpdateCakeId, { $set: toUpdateData }, { returnDocument: 'after', returnOriginal: false })
      .then((data) => {
        expect(data.price).toEqual(UPDATE_PRICE)
      })
  })

  // TESTING DELETE OPERATION
  it('delete tested cake', () => {
    return CakeModel.findByIdAndUpdate(toUpdateCakeId, { $set: { deleted: true } }, { returnDocument: 'after', returnOriginal: false })
      .then((data) => {
        expect(data.delete).toBeTruthy()
      })
  })
})

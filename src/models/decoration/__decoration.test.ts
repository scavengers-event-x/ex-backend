import * as mongoose from 'mongoose'
import { describe, expect, it } from '@jest/globals'

import { DecorationModel } from './decorationModel'

// TEST CASES FOR DECORATION SCHEMA
describe('decoration schema test', () => {
  // TESTING CREATE OPERATION
  it('create new decoration', () => {
    const SAMPLE_PRICE = 200
    const decorationToInsert = { name: 'Sample decoration', description: 'sample description', price: SAMPLE_PRICE, type: 'Sample type' }

    return DecorationModel.create(decorationToInsert)
      .then((decoration) => {
        expect(decoration.price).toEqual(SAMPLE_PRICE)
      })
  })

  // SAVING DECORATION OBJECT ID TO TEST UPDATE
  let toUpdateDecorationId:mongoose.ObjectId

  // TESTING READ OPERATION
  it('get tested decoration', () => {
    return DecorationModel.find({})
      .then((data) => {
        toUpdateDecorationId = data[0]._id
        expect(data.length).toBeGreaterThanOrEqual(1)
      })
  })

  // TESTING UPDATE OPERATION
  it('update tested decoration', () => {
    const UPDATE_PRICE = 500
    const toUpdateData = { price: UPDATE_PRICE }

    return DecorationModel.findByIdAndUpdate(toUpdateDecorationId, { $set: toUpdateData }, { returnDocument: 'after', returnOriginal: false })
      .then((data) => {
        expect(data.price).toEqual(UPDATE_PRICE)
      })
  })

  // TESTING DELETE OPERATION
  it('delete tested decoration', () => {
    return DecorationModel.findByIdAndUpdate(toUpdateDecorationId, { $set: { deleted: true } }, { returnDocument: 'after', returnOriginal: false })
      .then((data) => {
        expect(data.delete).toBeTruthy()
      })
  })
})

import * as mongoose from 'mongoose'
import { describe, expect, it } from '@jest/globals'

import { DrinkModel } from './drinkModel'
import { EDrinkCategory } from './drink.types'

// TEST CASES FOR DRINK SCHEMA
describe('drink schema test', () => {
  // TESTING CREATE OPERATION
  it('create new drink', () => {
    const drinkToInsert = { name: 'Sample drink', description: 'sample description', price: 500, alcoholic: false, category: EDrinkCategory.SOFT }

    return DrinkModel.create(drinkToInsert)
      .then((drink) => {
        expect(drink.category).toEqual(EDrinkCategory.SOFT)
      })
  })

  // SAVING DRINK OBJECT ID TO TEST UPDATE
  let toUpdateDrinkId:mongoose.ObjectId

  // TESTING READ OPERATION
  it('get tested drink', () => {
    return DrinkModel.find({})
      .then((data) => {
        toUpdateDrinkId = data[0]._id
        expect(data.length).toBeGreaterThanOrEqual(1)
      })
  })

  // TESTING UPDATE OPERATION
  it('update tested drink', () => {
    const UPDATE_PRICE = 500
    const toUpdateData = { price: UPDATE_PRICE }

    return DrinkModel.findByIdAndUpdate(toUpdateDrinkId, { $set: toUpdateData }, { returnDocument: 'after', returnOriginal: false })
      .then((data) => {
        expect(data.price).toEqual(UPDATE_PRICE)
      })
  })

  // TESTING DELETE OPERATION
  it('delete tested drink', () => {
    return DrinkModel.findByIdAndUpdate(toUpdateDrinkId, { $set: { deleted: true } }, { returnDocument: 'after', returnOriginal: false })
      .then((data) => {
        expect(data.delete).toBeTruthy()
      })
  })
})

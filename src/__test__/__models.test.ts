import * as mongoose from 'mongoose'
import { describe, expect, beforeAll, it } from '@jest/globals'

import { envVars } from '../config'
import { CakeModel } from '../models/cake/cakeModel'
import { UserModel } from '../models/user/userModel'
import { DrinkModel } from '../models/drink/drinkModel'
import { ThemeModel } from '../models/theme/themeModel'
import { EDrinkCategory, UserCategory } from '../models'
import { DecorationModel } from '../models/decoration/decorationModel'
import { AnnouncementModel } from '../models/annoucement/announcementModel'

// TESTING MONGO CONNECTION
beforeAll(async () => {
  await mongoose.connect(`${envVars.DB_URL}/${envVars.DB_NAME}`)
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

// TEST CASES FOR THEME SCHEMA
describe('theme schema test', () => {
  // TESTING CREATE OPERATION
  it('create new theme', () => {
    const SAMPLE_NAME = 'SAMPLE_NAME'
    const themeToInsert = { name: SAMPLE_NAME, description: 'sample description', speciality: ['special 1', 'special 2'] }

    return ThemeModel.create(themeToInsert)
      .then((theme) => {
        expect(theme.name).toEqual(SAMPLE_NAME)
      })
  })

  // SAVING THEME OBJECT ID TO TEST UPDATE
  let toUpdateThemeId:mongoose.ObjectId

  // TESTING READ OPERATION
  it('get tested theme', () => {
    return ThemeModel.find({})
      .then((data) => {
        toUpdateThemeId = data[0]._id
        expect(data.length).toBeGreaterThanOrEqual(1)
      })
  })

  // TESTING UPDATE OPERATION
  it('update tested theme', () => {
    const UPDATE_NAME = 'UPDATE_NAME'
    const toUpdateData = { name: UPDATE_NAME }

    return ThemeModel.findByIdAndUpdate(toUpdateThemeId, { $set: toUpdateData }, { returnDocument: 'after', returnOriginal: false })
      .then((data) => {
        expect(data.name).toEqual(UPDATE_NAME)
      })
  })

  // TESTING DELETE OPERATION
  it('delete tested theme', () => {
    return ThemeModel.findByIdAndUpdate(toUpdateThemeId, { $set: { deleted: true } }, { returnDocument: 'after', returnOriginal: false })
      .then((data) => {
        expect(data.delete).toBeTruthy()
      })
  })
})

// TEST CASES FOR USER SCHEMA
describe('user schema test', () => {
  // TESTING CREATE OPERATION
  it('create new user', () => {
    const product = { category: UserCategory.CUSTOMER, email: 'abc@gmail.com', password: 'test@123', profile: { fullName: 'test user' } }

    return UserModel.create(product)
      .then((user) => {
        expect(user.email).toEqual('abc@gmail.com')
      })
  })

  // SAVING USER OBJECT ID TO TEST UPDATE
  let userId:mongoose.ObjectId

  // TESTING READ OPERATION
  it('get tested user', () => {
    return UserModel.findOne({ email: 'abc@gmail.com' })
      .then((data) => {
        userId = data._id
        expect(data.profile.fullName).toEqual('test user')
      })
  })

  // TESTING UPDATE OPERATION
  it('update tested user', () => {
    const toUpdateData = { profile: { fullName: 'user testing' } }

    return UserModel.findByIdAndUpdate(userId, { $set: toUpdateData }, { returnDocument: 'after', returnOriginal: false })
      .then((data) => {
        expect(data.profile.fullName).toEqual('user testing')
      })
  })

  // TESTING DELETE OPERATION
  it('delete tested user', () => {
    return UserModel.deleteOne({ email: 'abc@gmail.com' })
      .then((data) => {
        expect(data.deletedCount).toEqual(1)
      })
  })
})

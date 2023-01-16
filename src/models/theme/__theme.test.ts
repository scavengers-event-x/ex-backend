import * as mongoose from 'mongoose'
import { describe, expect, it } from '@jest/globals'

import { ThemeModel } from './themeModel'

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

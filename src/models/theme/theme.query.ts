import { ObjectId } from 'mongoose'

import { getRegexObj } from '../../utils'
import { ThemeModel } from './themeModel'
import { ITheme, IThemeMain } from './theme.types'
import { COMMON_UN_PROJECTION } from '../../utils/constants'

const fetchAllThemes = (searchValue?: string) => {
  const findObject = { deleted: false }
  searchValue && Object.assign(findObject, { name: getRegexObj(searchValue) })
  return ThemeModel.find({ ...findObject }, { ...COMMON_UN_PROJECTION })
}

const fetchThemeById = (id: ObjectId) => {
  return ThemeModel.find<IThemeMain>({ deleted: false, _id: id }, { ...COMMON_UN_PROJECTION })
}

const insertTheme = (data: ITheme) => {
  const newTheme = new ThemeModel(data)

  return newTheme.save({ validateBeforeSave: true })
}

const updateTheme = (id: ObjectId, data: ITheme) => {
  return ThemeModel.findByIdAndUpdate(id, { $set: data }, { projection: { ...COMMON_UN_PROJECTION }, returnDocument: 'after', returnOriginal: false })
}

const deleteTheme = (id: ObjectId) => {
  return ThemeModel.findByIdAndUpdate(id, { $set: { deleted: true } })
}

export {
  fetchAllThemes,
  fetchThemeById,
  insertTheme,
  updateTheme,
  deleteTheme
}

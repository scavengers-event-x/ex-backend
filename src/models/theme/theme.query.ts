import { ObjectId } from 'mongoose'

import { ThemeModel } from './themeModel'
import { ITheme, IThemeMain } from './theme.types'

const themeProjection = { name: 1, description: 1, speciality: 1 }

const fetchAllThemes = () => {
  return ThemeModel.find({ deleted: false })
}

const fetchThemeById = (id: ObjectId) => {
  return ThemeModel.find<IThemeMain>({ deleted: false, _id: id }, { ...themeProjection })
}

const insertTheme = (data: ITheme) => {
  const newTheme = new ThemeModel(data)

  return newTheme.save({ validateBeforeSave: true })
}

const updateTheme = (id: ObjectId, data: ITheme) => {
  return ThemeModel.findByIdAndUpdate(id, { $set: data }, { projection: { ...themeProjection }, returnDocument: 'after', returnOriginal: false })
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

import { ObjectId } from 'mongoose'

interface ITheme {
  name: string,
  speciality: string[]
  description?: string,
}

interface IThemeMain extends ITheme{
  _id: ObjectId,
  deleted: boolean
}

export {
  ITheme,
  IThemeMain
}

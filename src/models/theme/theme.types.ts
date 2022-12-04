import { ObjectId } from 'mongoose'
import {IImageBody} from "../../utils";

interface ITheme {
  name: string,
  speciality: string[]
  description?: string,
  image?: IImageBody
}

interface IThemeMain extends ITheme{
  _id: ObjectId,
  deleted: boolean
}

export {
  ITheme,
  IThemeMain
}

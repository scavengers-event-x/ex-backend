import { ObjectId } from 'mongoose'
import { IImageBody } from '../../utils'

interface ICake {
  name: string,
  price: number,
  description?: string,
  available?: boolean,
  image?: IImageBody
}

interface ICakeMain extends ICake{
  _id: ObjectId,
  available: boolean,
  deleted: boolean
}

export {
  ICake,
  ICakeMain
}

import { ObjectId } from 'mongoose'
import { IImageBody } from '../../utils'

interface IDecoration {
  name: string,
  price: number,
  type: string,
  description?: string,
  available?: boolean,
  image?: IImageBody
}

interface IDecorationMain extends IDecoration{
  _id: ObjectId,
  deleted: boolean
}

export {
  IDecoration,
  IDecorationMain
}

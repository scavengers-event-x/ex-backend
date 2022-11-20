import { ObjectId } from 'mongoose'

interface IDecoration {
  name: string,
  price: number,
  description?: string,
  available?: boolean,
}

interface IDecorationMain extends IDecoration{
  _id: ObjectId,
  deleted: boolean
}

export {
  IDecoration,
  IDecorationMain
}

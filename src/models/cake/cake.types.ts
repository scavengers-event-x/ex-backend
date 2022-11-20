import { ObjectId } from 'mongoose'

interface ICake {
  name: string,
  price: number,
  description?: string,
  available?: boolean,
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

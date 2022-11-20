import { ObjectId } from 'mongoose'

interface IVenue {
  name: string,
  location: string,
  contact: number[],
  capacity: {
    max: number,
    min?: number
  },
  price: {
    paxRange: {
      from: number,
      to: number,
    },
    amount: number
  }[]
}

interface IVenueMain extends IVenue{
  _id: ObjectId,
  verified: boolean,
  inContract: boolean,
  deleted: boolean
}

export {
  IVenue,
  IVenueMain
}

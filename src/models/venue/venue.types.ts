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

interface IBookedDate {
  date: Date,
  eventId: ObjectId
}

interface IVenueMain extends IVenue{
  _id: ObjectId,
  bookedDates: IBookedDate[]
  verified: boolean,
  inContract: boolean,
  deleted: boolean
}

export {
  IVenue,
  IVenueMain
}

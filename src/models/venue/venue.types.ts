import { ObjectId } from 'mongoose'
import { IImageBody } from '../../utils'

enum EVenueType {
  BANQUET = 'BANQUET',
  PARTY_PALACE = 'PARTY_PALACE',
  RESTAURANT = 'RESTAURANT',
  HOTEL = 'HOTEL'
}

interface IVenue {
  name?: string,
  location?: string,
  contact?: number[],
  capacity?: {
    max: number,
    min?: number
  },
  price?: {
    paxRange: {
      from: number,
      to: number,
    },
    amount: number
  }[],
  remarks?: string[],
  established?: number,
  spaceIndoor?: boolean,
  spaceOutdoor?: boolean,
  venueType?: EVenueType,
  additionalService?: {
    dj?: number,
    spaceOnly?: number
  },
  image?: IImageBody
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
  IVenueMain,
  EVenueType
}

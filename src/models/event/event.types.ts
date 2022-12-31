import { ObjectId } from 'mongoose'
import { IImageBody } from '../../utils'

interface IEventDrink {
  _id: ObjectId,
  quantity: number
}

interface IEventCake {
  _id: ObjectId,
  pound: number
}

interface ICustomCake {
  image: IImageBody,
  pound: number
}

interface IEvent {
  eventType: string,
  venue: ObjectId,
  date: Date,
  numberOfPeople: number,
  theme?: ObjectId,
  drinks?: IEventDrink[]
  cakes?: IEventCake[],
  decorations?: ObjectId[],
  payment?: {
    token: string,
    idx: string
  },
  customCake?: ICustomCake
}

interface IEventMain extends IEvent{
  _id: ObjectId,
  assignedStaff: ObjectId,
  userId: ObjectId,
  active: boolean,
  completed: boolean,
  deleted: boolean,
}

export {
  IEvent,
  IEventMain
}

import { IEvent } from '../event.types'

export const eventMapping = (data2: IEvent): IEvent => {
  const data1: IEvent = {} as IEvent
  if (data2) {
    if (data2.eventType) data1.eventType = data2.eventType
    if (data2.cakes) data1.cakes = data2.cakes
    if (data2.date) data1.date = data2.date
    if (data2.decorations) data1.decorations = data2.decorations
    if (data2.numberOfPeople) data1.numberOfPeople = data2.numberOfPeople
    if (data2.theme) data1.theme = data2.theme
    if (data2.drinks) data1.drinks = data2.drinks
    if (data2.venue) data1.venue = data2.venue
    if (data2.payment) {
      if (data2.payment.token) data1.payment = { ...data1.payment, token: data2.payment.token }
      if (data2.payment.idx) data1.payment = { ...data1.payment, idx: data2.payment.idx }
    }
  }

  return data1
}

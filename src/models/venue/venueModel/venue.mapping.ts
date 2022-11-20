import { IVenue } from '../venue.types'

export const venueMapping = (data2: IVenue): IVenue => {
  const data1: IVenue = {} as IVenue
  if (data2) {
    if (data2.name) data1.name = data2.name
    if (data2.location) data1.location = data2.location
    if (data2.contact) data1.contact = data2.contact
    if (data2.capacity?.max) data1.capacity.max = data2.capacity.max
    if (data2.capacity?.min) data1.capacity.min = data2.capacity.min
    if (data2.price) data1.price = data2.price
  }

  return data1
}

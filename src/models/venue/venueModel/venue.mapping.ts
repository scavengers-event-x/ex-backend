import { IVenue } from '../venue.types'

export const venueMapping = (data2: IVenue): IVenue => {
  const data1: IVenue = {} as IVenue
  if (data2) {
    if (data2.name) data1.name = data2.name
    if (data2.location) data1.location = data2.location
    if (data2.contact) data1.contact = data2.contact
    if (data2.capacity?.max) data1.capacity = { max: data2.capacity.max }
    if (data2.capacity?.min) data1.capacity = { ...data1.capacity, min: data2.capacity.min }
    if (data2.price) data1.price = data2.price
    if (data2.remarks) data1.remarks = data2.remarks
    if (data2.established) data1.established = data2.established
    if (typeof data2.spaceOutdoor === 'boolean') data1.spaceOutdoor = data2.spaceOutdoor
    if (typeof data2.spaceIndoor === 'boolean') data1.spaceIndoor = data2.spaceIndoor
    if (data2.venueType) data1.venueType = data2.venueType
    if (data2.additionalService?.dj) data1.additionalService = { dj: data2.additionalService.dj }
    if (data2.additionalService?.spaceOnly) data1.additionalService = { ...data2.additionalService, spaceOnly: data2.additionalService.spaceOnly }
  }

  return data1
}

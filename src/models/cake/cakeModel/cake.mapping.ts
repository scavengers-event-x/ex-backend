import { ICake } from '../cake.types'

export const cakeMapping = (data2: ICake): ICake => {
  const data1: ICake = {} as ICake
  if (data2) {
    if (data2.name) data1.name = data2.name
    if (data2.price) data1.price = data2.price
    if (data2.description) data1.description = data2.description
  }

  return data1
}

import { IDecoration } from '../decoration.types'

export const decorationMapping = (data2: IDecoration): IDecoration => {
  const data1: IDecoration = {} as IDecoration
  if (data2) {
    if (data2.name) data1.name = data2.name
    if (data2.price) data1.price = data2.price
    if (data2.description) data1.description = data2.description
  }

  return data1
}

import { ObjectId } from 'mongoose'
import { IImageBody } from '../../utils'

export enum EDrinkCategory {
  WHISKEY= 'WHISKEY',
  BEER= 'BEER',
  RUM= 'RUM',
  VODKA= 'VODKA',
  WINE= 'WINE',
  SOFT= 'SOFT',
  GIN= 'GIN'
}

interface IDrink {
  name: string,
  price: number,
  alcoholic: boolean,
  imported: boolean,
  category: EDrinkCategory
  description?: string,
  available?: boolean,
  image?: IImageBody
}

interface IDrinkMain extends IDrink{
  _id: ObjectId,
  deleted: boolean
}

export {
  IDrink,
  IDrinkMain
}

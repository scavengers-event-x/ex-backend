import { ObjectId } from 'mongoose'

export enum EDrinkCategory {
  WHISKEY= 'WHISKEY',
  BEER= 'BEER',
  RUM= 'RUM',
  VODKA= 'VODKA',
  WINE= 'WINE',
  SOFT= 'SOFT'
}

interface IDrink {
  name: string,
  price: number,
  alcoholic: boolean,
  category: EDrinkCategory
  description?: string,
  available?: boolean,
}

interface IDrinkMain extends IDrink{
  _id: ObjectId,
  deleted: boolean
}

export {
  IDrink,
  IDrinkMain
}

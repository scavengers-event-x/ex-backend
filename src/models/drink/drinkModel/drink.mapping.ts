import { IDrink } from '../drink.types'

export const drinkMapping = (data2: IDrink): IDrink => {
  const data1: IDrink = {} as IDrink
  if (data2) {
    if (data2.name) data1.name = data2.name
    if (data2.price) data1.price = data2.price
    if (data2.category) data1.category = data2.category
    if (data2.alcoholic) data1.alcoholic = data2.alcoholic
    if (data2.description) data1.description = data2.description
  }

  return data1
}

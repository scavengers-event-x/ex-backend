import { ObjectId } from 'mongoose'

import { DrinkModel } from './drinkModel'
import { IDrink, IDrinkMain } from './drink.types'
import { COMMON_UN_PROJECTION } from '../../utils/constants'

const fetchAllDrinks = () => {
  return DrinkModel.find({ deleted: false }, { ...COMMON_UN_PROJECTION })
}

const fetchAllAvailableDrinks = () => {
  return DrinkModel.find({ deleted: false, available: true }, { ...COMMON_UN_PROJECTION })
}

const fetchDrinkById = (id: ObjectId) => {
  return DrinkModel.find<IDrinkMain>({ deleted: false, _id: id }, { ...COMMON_UN_PROJECTION })
}

const insertDrink = (data: IDrink) => {
  const newDrink = new DrinkModel(data)

  return newDrink.save({ validateBeforeSave: true })
}

const updateDrink = (id: ObjectId, data: IDrink) => {
  return DrinkModel.findByIdAndUpdate(id, { $set: data }, { projection: { ...COMMON_UN_PROJECTION }, returnDocument: 'after', returnOriginal: false })
}

const updateDrinkAvailability = (id: ObjectId) => {
  return DrinkModel.findByIdAndUpdate(id, [{ $set: { available: { $eq: [false, '$available'] } } }], { projection: { ...COMMON_UN_PROJECTION }, returnDocument: 'after', returnOriginal: false })
}

const deleteDrink = (id: ObjectId) => {
  return DrinkModel.findByIdAndUpdate(id, { $set: { deleted: true } }, { projection: { ...COMMON_UN_PROJECTION }, returnDocument: 'after', returnOriginal: false })
}

export {
  fetchAllAvailableDrinks,
  fetchAllDrinks,
  fetchDrinkById,
  insertDrink,
  updateDrink,
  deleteDrink,
  updateDrinkAvailability
}

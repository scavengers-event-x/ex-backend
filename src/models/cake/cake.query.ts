import { ObjectId } from 'mongoose'

import { CakeModel } from './cakeModel'
import { ICake, ICakeMain } from './cake.types'

const cakeProjection = { name: 1, description: 1, price: 1, available: 1 }

const fetchAllCakes = () => {
  return CakeModel.find({ deleted: false }, { ...cakeProjection })
}

const fetchAllAvailableCakes = () => {
  return CakeModel.find({ deleted: false, available: true }, { ...cakeProjection })
}

const fetchCakeById = (id: ObjectId) => {
  return CakeModel.find<ICakeMain>({ deleted: false, _id: id }, { ...cakeProjection })
}

const insertCake = (data: ICake) => {
  const newCake = new CakeModel(data)

  return newCake.save({ validateBeforeSave: true })
}

const updateCake = (id: ObjectId, data: ICake) => {
  return CakeModel.findByIdAndUpdate(id, { $set: data }, { projection: { ...cakeProjection }, returnDocument: 'after', returnOriginal: false })
}

const updateCakeAvailability = (id: ObjectId) => {
  return CakeModel.findByIdAndUpdate(id, [{ $set: { available: { $eq: [false, '$available'] } } }], { projection: { ...cakeProjection }, returnDocument: 'after', returnOriginal: false })
}

const deleteCake = (id: ObjectId) => {
  return CakeModel.findByIdAndUpdate(id, { $set: { deleted: true } }, { projection: { ...cakeProjection }, returnDocument: 'after', returnOriginal: false })
}

export {
  fetchAllAvailableCakes,
  fetchAllCakes,
  fetchCakeById,
  insertCake,
  updateCake,
  deleteCake,
  updateCakeAvailability
}

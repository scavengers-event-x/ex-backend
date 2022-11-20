import { ObjectId } from 'mongoose'

import { CakeModel } from './cakeModel'
import { ICake, ICakeMain } from './cake.types'
import { COMMON_UN_PROJECTION } from '../../utils/constants'

const fetchAllCakes = () => {
  return CakeModel.find({ deleted: false }, { ...COMMON_UN_PROJECTION })
}

const fetchAllAvailableCakes = () => {
  return CakeModel.find({ deleted: false, available: true }, { ...COMMON_UN_PROJECTION })
}

const fetchCakeById = (id: ObjectId) => {
  return CakeModel.find<ICakeMain>({ deleted: false, _id: id }, { ...COMMON_UN_PROJECTION })
}

const insertCake = (data: ICake) => {
  const newCake = new CakeModel(data)

  return newCake.save({ validateBeforeSave: true })
}

const updateCake = (id: ObjectId, data: ICake) => {
  return CakeModel.findByIdAndUpdate(id, { $set: data }, { projection: { ...COMMON_UN_PROJECTION }, returnDocument: 'after', returnOriginal: false })
}

const updateCakeAvailability = (id: ObjectId) => {
  return CakeModel.findByIdAndUpdate(id, [{ $set: { available: { $eq: [false, '$available'] } } }], { projection: { ...COMMON_UN_PROJECTION }, returnDocument: 'after', returnOriginal: false })
}

const deleteCake = (id: ObjectId) => {
  return CakeModel.findByIdAndUpdate(id, { $set: { deleted: true } }, { projection: { ...COMMON_UN_PROJECTION }, returnDocument: 'after', returnOriginal: false })
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

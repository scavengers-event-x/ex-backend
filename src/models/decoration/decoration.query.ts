import { ObjectId } from 'mongoose'

import { getRegexObj } from '../../utils'
import { DecorationModel } from './decorationModel'
import { COMMON_UN_PROJECTION } from '../../utils/constants'
import { IDecoration, IDecorationMain } from './decoration.types'

const fetchAllDecorations = (type?: string, searchValue?: string) => {
  const findObject = { deleted: false }
  type && Object.assign(findObject, { type })
  searchValue && Object.assign(findObject, { name: getRegexObj(searchValue) })
  return DecorationModel.find({ ...findObject }, { ...COMMON_UN_PROJECTION })
}

const fetchAllAvailableDecorations = () => {
  return DecorationModel.find({ deleted: false, available: true }, { ...COMMON_UN_PROJECTION })
}

const fetchDecorationById = (id: ObjectId) => {
  return DecorationModel.find<IDecorationMain>({ deleted: false, _id: id }, { ...COMMON_UN_PROJECTION })
}

const insertDecoration = (data: IDecoration) => {
  const newDecoration = new DecorationModel(data)

  return newDecoration.save({ validateBeforeSave: true })
}

const updateDecoration = (id: ObjectId, data: IDecoration) => {
  return DecorationModel.findByIdAndUpdate(id, { $set: data }, { projection: { ...COMMON_UN_PROJECTION }, returnDocument: 'after', returnOriginal: false })
}

const updateDecorationAvailability = (id: ObjectId) => {
  return DecorationModel.findByIdAndUpdate(id, [{ $set: { available: { $eq: [false, '$available'] } } }], { projection: { ...COMMON_UN_PROJECTION }, returnDocument: 'after', returnOriginal: false })
}

const deleteDecoration = (id: ObjectId) => {
  return DecorationModel.findByIdAndUpdate(id, { $set: { deleted: true } }, { projection: { ...COMMON_UN_PROJECTION }, returnDocument: 'after', returnOriginal: false })
}

export {
  fetchAllAvailableDecorations,
  fetchAllDecorations,
  fetchDecorationById,
  insertDecoration,
  updateDecoration,
  deleteDecoration,
  updateDecorationAvailability
}

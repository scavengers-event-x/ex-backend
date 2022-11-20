import { ObjectId } from 'mongoose'

import { DecorationModel } from './decorationModel'
import { IDecoration, IDecorationMain } from './decoration.types'

const decorationProjection = { name: 1, description: 1, price: 1, available: 1 }

const fetchAllDecorations = () => {
  return DecorationModel.find({ deleted: false }, { ...decorationProjection })
}

const fetchAllAvailableDecorations = () => {
  return DecorationModel.find({ deleted: false, available: true }, { ...decorationProjection })
}

const fetchDecorationById = (id: ObjectId) => {
  return DecorationModel.find<IDecorationMain>({ deleted: false, _id: id }, { ...decorationProjection })
}

const insertDecoration = (data: IDecoration) => {
  const newDecoration = new DecorationModel(data)

  return newDecoration.save({ validateBeforeSave: true })
}

const updateDecoration = (id: ObjectId, data: IDecoration) => {
  return DecorationModel.findByIdAndUpdate(id, { $set: data }, { projection: { ...decorationProjection }, returnDocument: 'after', returnOriginal: false })
}

const updateDecorationAvailability = (id: ObjectId) => {
  return DecorationModel.findByIdAndUpdate(id, [{ $set: { available: { $eq: [false, '$available'] } } }], { projection: { ...decorationProjection }, returnDocument: 'after', returnOriginal: false })
}

const deleteDecoration = (id: ObjectId) => {
  return DecorationModel.findByIdAndUpdate(id, { $set: { deleted: true } }, { projection: { ...decorationProjection }, returnDocument: 'after', returnOriginal: false })
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

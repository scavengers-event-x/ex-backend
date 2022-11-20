import { ObjectId } from 'mongoose'

interface FieldTypeEventType {
  name: string,
  description?: string,
}

interface FieldTypeEventTypeMain extends FieldTypeEventType{
  _id: ObjectId,
  deleted: boolean
}

export {
  FieldTypeEventType,
  FieldTypeEventTypeMain
}

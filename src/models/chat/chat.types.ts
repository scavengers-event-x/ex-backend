import { ObjectId } from 'mongoose'

interface FieldTypeChatInsert {
  from: ObjectId,
  to: ObjectId,
  message: string
}

interface FieldTypeMessage {
  text: string,
}

interface FieldTypeChat {
  message: FieldTypeMessage,
  users: ObjectId[]
  sender: ObjectId,
}

interface FieldTypeChatMain extends FieldTypeChat{
  _id: ObjectId,
  createdAt: Date,
}

interface FieldTypeChatGet {
  senderSelf: boolean,
  message: string,
  createdAt: Date,
}

export {
  FieldTypeChat,
  FieldTypeChatGet,
  FieldTypeChatMain,
  FieldTypeChatInsert
}

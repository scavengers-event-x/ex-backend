import { ObjectId } from 'mongoose'

import { ChatModel } from './chatModel'
import { FieldTypeChat } from './chat.types'

const fetchAllChats = (from: ObjectId, to: ObjectId) => {
  return ChatModel.find({ users: { $all: [from, to] } }, {}, { sort: { updatedAt: 1 } })
}
const insertChat = (data: FieldTypeChat) => {
  const newChat = new ChatModel(data)

  return newChat.save({ validateBeforeSave: true })
}

export {
  fetchAllChats,
  insertChat
}

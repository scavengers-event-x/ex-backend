import { ObjectId } from 'mongoose'

import { ChatModel } from './chatModel'
import { COMMON_UN_PROJECTION } from '../../utils/constants'
import { FieldTypeChat } from './chat.types'

const fetchAllChats = (from: ObjectId, to: ObjectId) => {
  return ChatModel.find({ users: { $all: [from, to] } }, { ...COMMON_UN_PROJECTION }, { sort: { updatedAt: 1 } })
}
const insertChat = (data: FieldTypeChat) => {
  const newChat = new ChatModel(data)

  return newChat.save({ validateBeforeSave: true })
}

export {
  fetchAllChats,
  insertChat
}

import { Model, model, Schema } from 'mongoose'

import { CollectionNames } from '../../../config'
import { FieldTypeChatMain } from '../chat.types'

const chatSchema = new Schema<FieldTypeChatMain>({
  message: {
    text: {
      type: String,
      required: true
    }
  },
  users: Array,
  sender: {
    type: Schema.Types.ObjectId,
    ref: CollectionNames.USER,
    required: true
  }
}, {
  timestamps: {
    createdAt: true,
    updatedAt: 'modifiedAt'
  }
})

const ChatModel: Model<FieldTypeChatMain> = model(CollectionNames.CHAT, chatSchema)

export { ChatModel }

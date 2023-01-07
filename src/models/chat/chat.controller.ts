import { makeSuccessObject } from '../../utils'
import * as chatQuery from './chat.query'
import { FieldTypeChatInsert, FieldTypeChatGet } from './chat.types'
import { commonResponse, chatResponse, responseCode } from '../../utils/constants'
import { FieldTypeUserJWT } from '../user'
import { insertChatUser } from '../user/user.query'

const conFetchAllChats = async (req, res, next) => {
  const { userId } = req.loggedInUser as FieldTypeUserJWT
  const { to } = req.query
  try {
    const chats = await chatQuery.fetchAllChats(userId, to)
    res.status(responseCode.OK)
      .send(makeSuccessObject<FieldTypeChatGet[]>(chats.map((chat) => ({ message: chat.message.text, senderSelf: (chat.sender.toString() === userId.toString()), createdAt: chat.createdAt })), chatResponse.success.FETCH_ALL))
  } catch (_err) {
    next({ message: chatResponse.error.FETCH_ALL, status: responseCode.BAD_REQUEST })
  }
}

const conInsertNewChat = async (req, res, next) => {
  const { userId } = req.loggedInUser as FieldTypeUserJWT
  const { message, to } = req.body as FieldTypeChatInsert
  if (!userId || !to || !message) {
    return next({ message: commonResponse.error.INVALID_BODY, status: responseCode.BAD_REQUEST })
  }
  try {
    await insertChatUser(userId, to)
    const insertRes = await chatQuery.insertChat({ message: { text: message }, users: [userId, to], sender: userId })
    if (insertRes) {
      res.status(responseCode.OK)
        .send(makeSuccessObject<FieldTypeChatGet>({ message: insertRes.message.text, senderSelf: true, createdAt: insertRes.createdAt }, chatResponse.success.INSERT))
    }
  } catch (_err) {
    next({ message: chatResponse.error.INSERT, status: responseCode.BAD_REQUEST })
  }
}
export {
  conFetchAllChats,
  conInsertNewChat
}

import { sign, verify } from 'jsonwebtoken'

import { Nullable } from './genericTypes'
import { JWT_EXPIRE_TIME, JWT_SECRET_KEY } from '../config'
import { FieldTypeUserJWT, FieldTypeUserMain } from '../models/user/user.types'


const generateJWT = (user: FieldTypeUserMain):string => {
  const jwtPayload: FieldTypeUserJWT = {
    accountStatus: user.accountStatus,
    category: user.category,
    email: user.email,
    userId: user._id
  }
  return sign(jwtPayload, JWT_SECRET_KEY, { expiresIn: JWT_EXPIRE_TIME })
}

const verifyJWT = (token: string): Promise<FieldTypeUserJWT> => {
  return new Promise<Nullable<FieldTypeUserJWT>>((resolve, reject) => {
    verify(token, JWT_SECRET_KEY, (err, done: FieldTypeUserJWT) => {
      if (err) reject(err)
      else resolve(done)
    })
  })
}

export {
  generateJWT,
  verifyJWT
}

import { FieldTypeUserUpdate } from '../user.types'

export const userProfileMapping = (data2: FieldTypeUserUpdate): FieldTypeUserUpdate => {
  const data1: FieldTypeUserUpdate = {} as FieldTypeUserUpdate
  if (data2) {
    if (data2.fullName) (data1 as FieldTypeUserUpdate).fullName = data2.fullName
    if (data2.email) (data1 as FieldTypeUserUpdate).email = data2.email
  }

  return data1
}

import { FieldTypeUserProfile } from '../user.types'
import { FunctionWithParamAndReturn } from '../../../utils'

export const userProfileMapping:FunctionWithParamAndReturn<FieldTypeUserProfile, { profile: FieldTypeUserProfile }> = (data2) => {
  const data1: FieldTypeUserProfile = {} as FieldTypeUserProfile
  if (data2) {
    if (data2.fullName) (data1 as FieldTypeUserProfile).fullName = data2.fullName
    if (data2.gender) (data1 as FieldTypeUserProfile).gender = data2.gender
    if (data2.address) (data1 as FieldTypeUserProfile).address = data2.address
    if (data2.phone) (data1 as FieldTypeUserProfile).phone = data2.phone
  }

  return ({ profile: data1 })
}

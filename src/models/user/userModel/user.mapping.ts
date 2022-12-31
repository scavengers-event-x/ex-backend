import { FieldTypeUserProfile } from '../user.types'

export const userProfileMapping = (data2: FieldTypeUserProfile): { profile: FieldTypeUserProfile } => {
  const data1: FieldTypeUserProfile = {} as FieldTypeUserProfile
  if (data2) {
    if (data2.fullName) (data1 as FieldTypeUserProfile).fullName = data2.fullName
    if (data2.gender) (data1 as FieldTypeUserProfile).gender = data2.gender
    if (data2['address.tole']) data1.address = { ...data1.address, tole: data2['address.tole'] }
    if (data2['address.city']) data1.address = { ...data1.address, city: data2['address.city'] }
    if (data2['address.ward']) data1.address = { ...data1.address, ward: data2['address.ward'] }
    if (data2['address.province']) data1.address = { ...data1.address, province: data2['address.province'] }
    if (data2.phone) (data1 as FieldTypeUserProfile).phone = data2.phone
    if (data2.citizenship) (data1 as FieldTypeUserProfile).citizenship = data2.citizenship
    if (data2.pan) (data1 as FieldTypeUserProfile).pan = data2.pan
  }

  return ({ profile: data1 })
}

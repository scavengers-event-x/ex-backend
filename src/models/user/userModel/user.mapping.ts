import { FieldTypeUserProfile } from '../user.types'

export const userProfileMapping = (data2: FieldTypeUserProfile): { profile: FieldTypeUserProfile } => {
  const data1: FieldTypeUserProfile = {} as FieldTypeUserProfile
  if (data2) {
    if (data2.fullName) (data1 as FieldTypeUserProfile).fullName = data2.fullName
    if (data2.gender) (data1 as FieldTypeUserProfile).gender = data2.gender
    if (data2.address) {
      const add = (data2 as FieldTypeUserProfile).address
      if (add.tole) data1.address = { ...data1.address, tole: add.tole }
      if (add.city) data1.address = { ...data1.address, city: add.city }
      if (add.ward) data1.address = { ...data1.address, ward: add.ward }
      if (add.province) data1.address = { ...data1.address, province: add.province }
    }
    if (data2.phone) (data1 as FieldTypeUserProfile).phone = data2.phone
    if (data2.citizenship) (data1 as FieldTypeUserProfile).citizenship = data2.citizenship
    if (data2.pan) (data1 as FieldTypeUserProfile).pan = data2.pan
  }

  return ({ profile: data1 })
}

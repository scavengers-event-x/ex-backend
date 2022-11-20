import { ITheme } from '../theme.types'

export const themeMapping = (data2: ITheme): ITheme => {
  const data1: ITheme = {} as ITheme
  if (data2) {
    if (data2.name) data1.name = data2.name
    if (data2.speciality) data1.speciality = data2.speciality
    if (data2.description) data1.description = data2.description
  }

  return data1
}

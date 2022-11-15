import { OTP_EXPIRY_REGISTER } from './constants'
import { FieldTypeOTP } from '../models'
import { FunctionWithNoParamButReturn, FunctionWithParamAndReturn } from './genericTypes'

const generateDisplayEmail:FunctionWithParamAndReturn<string, string> = username => {
  const atIndex = username.indexOf('@')

  return `${username.slice(0, 3)}****${username.slice(atIndex)}`
}

const capitalizeFirstLetterOfEachWord:FunctionWithParamAndReturn<string, string> =
    sentence => sentence.split(' ').map(word => `${word.charAt(0).toUpperCase()}${word.slice(1)}`).join(' ')

const getYearList:FunctionWithNoParamButReturn<string[]> = () => {
  const currentYear = new Date().getFullYear()
  const years:string[] = [] as string[]
  Array.from(Array(150)).forEach((_, i) => {
    years.push((currentYear - i).toString())
  })

  return years
}

const getDateAndTime:FunctionWithParamAndReturn<number, { date: string, time: string, timeZone: string }> = epoch => {
  const date = new Date(epoch).toLocaleDateString()
  const time = new Date(epoch).toLocaleTimeString()
  const timeZone = new Date(epoch).toString().match(/([A-Z]+[+-][0-9]+)/)

  return { date, time, timeZone: timeZone && timeZone.length > 0 ? timeZone[1] : '' }
}

const isNumber:FunctionWithParamAndReturn<string, boolean> = str => /^-?[\d.]+(?:e-?\d+)?$/.test(str)

const generateOTPCode:FunctionWithNoParamButReturn<FieldTypeOTP> = () => {
  const randomNumber = Math.random().toString()
  const otpCode = randomNumber.slice(randomNumber.length - 6, randomNumber.length)
  const otpExpiry = new Date(Date.now() + OTP_EXPIRY_REGISTER)

  return {
    otpCode,
    otpExpiry
  }
}

export {
  capitalizeFirstLetterOfEachWord,
  generateDisplayEmail,
  getDateAndTime,
  getYearList,
  generateOTPCode,
  isNumber
}

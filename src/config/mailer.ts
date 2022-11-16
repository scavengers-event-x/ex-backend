import { SendMailOptions, createTransport } from 'nodemailer'
import { envVars } from './vars'
import { UserOperations } from '../models/user'
import { FunctionWithParamAndReturn } from '../utils'
import { OTP_EXPIRY_REGISTER, OTP_EXPIRY_RESET_PASSWORD } from '../utils/constants'

export const mailer = createTransport({
  auth: {
    pass: envVars.MAILER_PASS,
    user: envVars.MAILER_USER
  },
  port: envVars.MAILER_PORT,
  host: envVars.MAILER_HOST
})

interface prepareOtpMailPropTypes {
  emailId: string,
  otpCode: string,
  fullName: string,
  operation: UserOperations
}

export const prepareOtpMail:FunctionWithParamAndReturn<prepareOtpMailPropTypes, SendMailOptions> = ({ emailId, otpCode, fullName, operation }) => {
  let mailOptions = {
    expiry: '',
    operationMessage: '',
    subject: ''
  }

  switch (operation) {
    case UserOperations.REGISTER:
      mailOptions = {
        expiry: `${OTP_EXPIRY_REGISTER / 60000} minutes`,
        operationMessage: 'Thank you for joining with us. \n please use the code provided below to complete verification.',
        subject: 'Email Verification'
      }
      break
    case UserOperations.FORGOT_PASSWORD:
      mailOptions = {
        expiry: `${OTP_EXPIRY_RESET_PASSWORD / 60000} minutes`,
        operationMessage: 'Please use the code below to reset your password.',
        subject: 'Forgot Password'
      }
      break
    default:
      break
  }

  return ({
    from: `Event-X <noreply@eventx.com>`,
    html: `
      <html>
          <head>
            <style>
            h2{
                background: rgba(231, 231, 231, 0.5);
                border: 1px solid #dbdbdb;
                border-radius: 5px;
                display: inline;
                padding: 7px 15px;
                margin-right: 10px;
            }
            </style>
          </head>
          <body>
              <p>Hello ${fullName},</p>
              <p>${mailOptions.operationMessage}</p>
              </br>
              <h2>${otpCode.charAt(0)}</h2>
              <h2>${otpCode.charAt(1)}</h2>
              <h2>${otpCode.charAt(2)}</h2>
              <h2>${otpCode.charAt(3)}</h2>
              <h2>${otpCode.charAt(4)}</h2>
              <h2>${otpCode.charAt(5)}</h2>
              ${mailOptions.expiry ? `<p>This code will expire in ${mailOptions.expiry} and can be used only once.</p>` : ''}
              </br>
              <p>If you didn't request this mail, please ignore and delete this message.</p>
              <p>Thank You</p>
              <p>Event-X Pvt. Ltd.</p>
          </body>
      </html>
    `,
    subject: mailOptions.subject,
    to: emailId
  })
}

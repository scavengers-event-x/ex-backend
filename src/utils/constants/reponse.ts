import { CollectionNames } from '../../config'
import { generateDisplayEmail } from '../utilFunctions'

const responseCode = {
  ACCEPTED: 202,
  BAD_REQUEST: 400,
  CREATED: 201,
  FORBIDDEN: 403,
  INTERNAL_SERVER: 500,
  METHOD_NOT_ALLOWED: 405,
  NOT_ACCEPTABLE: 406,
  NOT_FOUND: 404,
  NO_CONTENT: 204,
  OK: 200,
  PARTIAL_CONTENT: 206,
  UNAUTHORIZED: 401
}

const commonResponse = {
  error: {
    INTERNAL_SERVER: 'Internal server error.',
    INVALID_IMAGE_TYPE: 'Please provide image with format: jpg/jpeg/png only.',
    INVALID_BODY: 'The data you have provided is incorrect or insufficient.',
    NO_DATA_TO_UPDATE: (name) => `No data was provided to update ${name}.`,
    UNAUTHORIZED_ACCESS: 'You are not authorized to access this route.'
  }
}

const userResponse = {
  error: {
    ACTIVATION: 'User activation process failed.',
    ALREADY_REGISTERED: 'The email has already registered in our system.',
    CHANGE_PASSWORD: 'Changing password failed.',
    COUNT: 'Error counting users data.',
    DEACTIVATION: 'User deactivation process failed.',
    ACCESS_REVOKE: 'User access revocation process failed.',
    ACCESS_GRANT: 'User access granting process failed.',
    FETCH_ALL: 'Users cannot be fetched at the moment.',
    INVALID_OPERATION: 'The operation you wish to perform is invalid.',
    INVALID_PASSWORD: 'Previous password is incorrect.',
    JWT_TOKEN: 'You are not authorized in the system.',
    GENERATE_JWT: 'System was unable to generate JWT Token.',
    UNKNOWN_EMAIL: 'Please use valid user email for JWT Token.',
    REGISTER: 'You have not been registered.',
    INVITE_USER: 'Error while inviting new user to the system.',
    RESET_PASSWORD: 'Error occurred while setting new password',
    UNVERIFIED_LOGIN: 'User has not been verified yet, please complete the verification process.',
    USER_CREDENTIALS: 'Error fetching user credentials.',
    USER_INACTIVE: 'User cannot access the system (INACTIVE).',
    USER_NOT_FOUND: 'User was not found in the system.',
    USER_PROFILE: 'Error fetching user profile.',
    USER_UPDATE: 'We are unable to update the user at the time.',
    USER_DELETE: 'We are unable to delete the user at the time.',
    LOGIN: 'Please use valid credential for login.',
    NO_ACCESS: 'Your account access has been revoked, please contact admin.',
    ADD_STAFF: 'Adding new staff has been failed.',
    OTP_EXPIRED: 'The provided OTP code has been expired. Please try sending new OTP.',
    OTP_INVALID: 'Please enter valid OTP code.',
    OTP_SENT: (email) => `We were unable to send OTP code to ${generateDisplayEmail(email)}`,
    RESET_REQUEST: 'Failed to mark reset password request.',
    PASSWORD_DEFAULT: 'Failed to set default password.',
    ONLY_STAFF_REQ: 'This request can only be made by staff',
    RESET_REQUEST_TIME: 'You can only request to reset the password after 24 hrs of last request.',
    ALREADY_RESET_REQUESTED: 'A similar request is already present and is in pending.'
  },
  success: {
    ACTIVATION: 'User has been activated successfully.',
    CHANGE_PASSWORD: 'Password has been changed successfully.',
    COUNT: 'User has been counted successfully',
    DEACTIVATION: 'User has been deactivated successfully.',
    ACCESS_REVOKED: 'User access has been revoked successfully.',
    ACCESS_GRANTED: 'User access has been granted successfully.',
    FETCH_ALL: 'All users have been fetched successfully.',
    JWT_TOKEN: 'JWT token has been successfully generated.',
    INVITE_USER: 'You have successfully invited a new user.',
    USER_PROFILE: 'User profile has been fetched successfully.',
    USER_UPDATED: 'User has been updated successfully.',
    RESET_REQUEST: 'Your reset password request has been marked.',
    LOGIN: 'You have been successfully logged in to the system',
    ADD_STAFF: 'New staff has been added successfully.',
    OTP_SENT: (email) => `An OTP code has been sent to ${generateDisplayEmail(email)}`,
    OTP_VERIFIED: 'The OTP code has been verified successfully.',
    REGISTER: 'You have been registered successfully.',
    RESET_PASSWORD: 'You have successfully set new password',
    USER_CREDENTIALS: 'User credentials has been fetched successfully.',
    PASSWORD_DEFAULT: "User's password has been set to default"
  }
}

const mappedResponse = {
  [CollectionNames.ANNOUNCEMENT]: {
    TITLE: 'Announcement',
    LOWER: 'announcement'
  },
  [CollectionNames.VENUE]: {
    TITLE: 'Venue',
    LOWER: 'venue'
  },
  [CollectionNames.THEME]: {
    TITLE: 'Theme',
    LOWER: 'theme'
  },
  [CollectionNames.CAKE]: {
    TITLE: 'Cake',
    LOWER: 'cake'
  },
  [CollectionNames.DECORATION]: {
    TITLE: 'Decoration',
    LOWER: 'decoration'
  },
  [CollectionNames.DRINK]: {
    TITLE: 'Drink',
    LOWER: 'drink'
  },
  [CollectionNames.EVENT]: {
    TITLE: 'Event',
    LOWER: 'event'
  },
  [CollectionNames.CHAT]: {
    TITLE: 'Chat',
    LOWER: 'chat'
  }
}

const getModelResponse = (model: CollectionNames) => {
  return ({
    error: {
      DELETE: `Error on deleting the ${mappedResponse[model].LOWER}.`,
      FETCH_ALL: `${mappedResponse[model].TITLE}s cannot be fetched at the moment.`,
      FETCH_BY_ID: `${mappedResponse[model].TITLE} cannot be fetched at the moment.`,
      INSERT: `Error on inserting new ${mappedResponse[model].LOWER}.`,
      UPDATE: `Error on updating the ${mappedResponse[model].LOWER}.`,
      NOT_FOUND: `${mappedResponse[model].TITLE} of provided id is not found in the system.`,
      AVAILABILITY: `Error on updating the availability of ${mappedResponse[model].LOWER}.`
    },
    success: {
      DELETE: `${mappedResponse[model].TITLE} has been deleted successfully.`,
      FETCH_ALL: `All ${mappedResponse[model].LOWER}s has been fetched successfully.`,
      FETCH_BY_ID: `The ${mappedResponse[model].LOWER} has been fetched successfully.`,
      INSERT: `New ${mappedResponse[model].LOWER} has been inserted successfully.`,
      UPDATE: `${mappedResponse[model].TITLE} has been updated successfully.`,
      AVAILABILITY: `Availability of ${mappedResponse[model].LOWER} has been updated successfully.`
    }
  })
}

const themeResponse = getModelResponse(CollectionNames.THEME)

const venueResponse = getModelResponse(CollectionNames.VENUE)

const cakeResponse = getModelResponse(CollectionNames.CAKE)

const decorationResponse = getModelResponse(CollectionNames.DECORATION)

const drinkResponse = getModelResponse(CollectionNames.DRINK)

const chatResponse = getModelResponse(CollectionNames.CHAT)

const eventResponse = {
  success: {
    ...getModelResponse(CollectionNames.EVENT).success,
    ASSIGN: 'Event has been successfully assigned.'
  },
  error: {
    ...getModelResponse(CollectionNames.EVENT).error,
    ASSIGN: 'Failed to assign event.'
  }
}

const announcementResponse = {
  success: {
    ...getModelResponse(CollectionNames.ANNOUNCEMENT).success,
    READ: 'Announcement has been successfully marked as read.'
  },
  error: {
    ...getModelResponse(CollectionNames.ANNOUNCEMENT).error,
    READ: 'Failed to mark the announcement as read.',
    ALREADY_PUBLISHED: 'The announcement has already been published.'
  }
}

const fileResponse = {
  error: {
    UPLOAD: 'Error uploading file to cloud.'
  }
}

export { commonResponse, responseCode, userResponse, announcementResponse, themeResponse, venueResponse, cakeResponse, decorationResponse, drinkResponse, eventResponse, fileResponse, chatResponse }

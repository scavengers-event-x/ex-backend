import { ECloudFolderName, getBodyWithFileUrl, makeSuccessObject, Nullable } from '../../utils'
import * as themeQuery from './theme.query'
import { themeMapping } from './themeModel'
import { ITheme, IThemeMain } from './theme.types'
import { commonResponse, themeResponse, responseCode, fileResponse } from '../../utils/constants'
import { UploadApiResponse } from 'cloudinary'
import { destroyImage, uploadImage } from '../../middleware'

const conFetchAllThemes = async (req, res, next) => {
  const { searchValue } = req.query
  try {
    const themes = await themeQuery.fetchAllThemes(searchValue)
    res.status(responseCode.OK)
      .send(makeSuccessObject<IThemeMain[]>(themes, themeResponse.success.FETCH_ALL))
  } catch (_err) {
    next({ message: themeResponse.error.FETCH_ALL, status: responseCode.BAD_REQUEST })
  }
}

const conFetchThemeById = async (req, res, next) => {
  const themeId = req.params.id

  try {
    const theme = await themeQuery.fetchThemeById(themeId)
    if (!theme) {
      return next({ message: themeResponse.error.FETCH_BY_ID, status: responseCode.BAD_REQUEST })
    } else {
      res.status(theme ? responseCode.OK : responseCode.OK)
        .send(makeSuccessObject<IThemeMain>(theme[0], themeResponse.success.FETCH_BY_ID))
    }
  } catch (_err) {
    next({ message: themeResponse.error.FETCH_BY_ID, status: responseCode.BAD_REQUEST })
  }
}

const conUpdateTheme = async (req, res, next) => {
  const themeId = req.params.id

  const mappedTheme = themeMapping(req.body)
  if (!mappedTheme) {
    return next({ message: themeResponse.error.UPDATE, status: responseCode.BAD_REQUEST })
  }

  let fileDetail:Nullable<UploadApiResponse> = null
  try {
    if (req.file?.path) {
      fileDetail = await uploadImage(req.file?.path, ECloudFolderName.THEME)
      if (!fileDetail) {
        return next({ message: fileResponse.error.UPLOAD, status: responseCode.INTERNAL_SERVER })
      }
    }
    const themeInSystem = await themeQuery.fetchThemeById(themeId)
    if (!themeInSystem.length) {
      return next({ message: themeResponse.error.NOT_FOUND, status: responseCode.BAD_REQUEST })
    }
    if (themeInSystem[0].image.public_id && fileDetail) { await destroyImage(themeInSystem[0].image.public_id) }
    const updatedTheme = await themeQuery.updateTheme(themeId, getBodyWithFileUrl(mappedTheme, fileDetail))
    if (updatedTheme) {
      res.status(responseCode.ACCEPTED).send(makeSuccessObject<ITheme>(updatedTheme, themeResponse.success.UPDATE))
    }
  } catch (err) {
    next({ message: themeResponse.error.UPDATE, status: responseCode.BAD_REQUEST })
  }
}

const conInsertNewTheme = async (req, res, next) => {
  const { name, speciality, ...remainingBody } = req.body as ITheme
  if (!name || !speciality) {
    return next({ message: commonResponse.error.INVALID_BODY, status: responseCode.BAD_REQUEST })
  }
  let fileDetail:Nullable<UploadApiResponse> = null
  try {
    if (req.file?.path) {
      fileDetail = await uploadImage(req.file?.path, ECloudFolderName.THEME)
      if (!fileDetail) {
        return next({ message: fileResponse.error.UPLOAD, status: responseCode.INTERNAL_SERVER })
      }
    }
    const insertRes = await themeQuery.insertTheme(getBodyWithFileUrl({ name, speciality, ...remainingBody }, fileDetail))
    if (insertRes) {
      const response = await themeQuery.fetchThemeById(insertRes._id)
      res.status(response ? responseCode.OK : responseCode.INTERNAL_SERVER)
        .send(makeSuccessObject<ITheme>(response[0], themeResponse.success.INSERT))
    }
  } catch (_err) {
    next({ message: themeResponse.error.INSERT, status: responseCode.BAD_REQUEST })
  }
}

const conDeleteTheme = async (req, res, next) => {
  const { id } = req.params
  if (!id) {
    return next({ message: commonResponse.error.INVALID_BODY, status: responseCode.BAD_REQUEST })
  }
  try {
    const response = await themeQuery.deleteTheme(id)
    res.status(response ? responseCode.OK : responseCode.INTERNAL_SERVER)
      .send(makeSuccessObject<string>(response._id.toString(), themeResponse.success.DELETE))
  } catch (_err) {
    next({ message: themeResponse.error.DELETE, status: responseCode.BAD_REQUEST })
  }
}

export {
  conFetchAllThemes,
  conUpdateTheme,
  conFetchThemeById,
  conInsertNewTheme,
  conDeleteTheme
}

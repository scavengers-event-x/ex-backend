import { makeSuccessObject } from '../../utils'
import * as decorationQuery from './decoration.query'
import { decorationMapping } from './decorationModel'
import { IDecoration, IDecorationMain } from './decoration.types'
import { commonResponse, decorationResponse, responseCode } from '../../utils/constants'

const conFetchAllDecorations = async (req, res, next) => {
  try {
    const decorations = await decorationQuery.fetchAllDecorations()
    res.status(responseCode.OK)
      .send(makeSuccessObject<IDecorationMain[]>(decorations, decorationResponse.success.FETCH_ALL))
  } catch (_err) {
    next({ message: decorationResponse.error.FETCH_ALL, status: responseCode.BAD_REQUEST })
  }
}

const conFetchAllAvailableDecorations = async (req, res, next) => {
  try {
    const decorations = await decorationQuery.fetchAllAvailableDecorations()
    res.status(responseCode.OK)
      .send(makeSuccessObject<IDecorationMain[]>(decorations, decorationResponse.success.FETCH_ALL))
  } catch (_err) {
    next({ message: decorationResponse.error.FETCH_ALL, status: responseCode.BAD_REQUEST })
  }
}

const conFetchDecorationById = async (req, res, next) => {
  const decorationId = req.params.id

  try {
    const decoration = await decorationQuery.fetchDecorationById(decorationId)
    if (!decoration) {
      return next({ message: decorationResponse.error.FETCH_BY_ID, status: responseCode.BAD_REQUEST })
    } else {
      res.status(decoration ? responseCode.OK : responseCode.OK)
        .send(makeSuccessObject<IDecorationMain>(decoration[0], decorationResponse.success.FETCH_BY_ID))
    }
  } catch (_err) {
    next({ message: decorationResponse.error.FETCH_BY_ID, status: responseCode.BAD_REQUEST })
  }
}

const conUpdateDecoration = async (req, res, next) => {
  const decorationId = req.params.id

  const mappedDecoration = decorationMapping(req.body)
  if (!mappedDecoration) {
    return next({ message: decorationResponse.error.UPDATE, status: responseCode.BAD_REQUEST })
  }

  try {
    const decorationInSystem = await decorationQuery.fetchDecorationById(decorationId)
    if (!decorationInSystem.length) {
      return next({ message: decorationResponse.error.NOT_FOUND, status: responseCode.BAD_REQUEST })
    }
    const updatedDecoration = await decorationQuery.updateDecoration(decorationId, mappedDecoration)
    if (updatedDecoration) {
      res.status(responseCode.ACCEPTED).send(makeSuccessObject<IDecoration>(updatedDecoration, decorationResponse.success.UPDATE))
    }
  } catch (err) {
    next({ message: decorationResponse.error.UPDATE, status: responseCode.BAD_REQUEST })
  }
}

const conInsertNewDecoration = async (req, res, next) => {
  const { name, price, ...remainingBody } = req.body as IDecoration
  if (!name || !price) {
    return next({ message: commonResponse.error.INVALID_BODY, status: responseCode.BAD_REQUEST })
  }
  try {
    const insertRes = await decorationQuery.insertDecoration({ name, price, ...remainingBody })
    if (insertRes) {
      const response = await decorationQuery.fetchDecorationById(insertRes._id)
      res.status(response ? responseCode.OK : responseCode.INTERNAL_SERVER)
        .send(makeSuccessObject<IDecoration>(response[0], decorationResponse.success.INSERT))
    }
  } catch (_err) {
    next({ message: decorationResponse.error.INSERT, status: responseCode.BAD_REQUEST })
  }
}

const conDeleteDecoration = async (req, res, next) => {
  const { id } = req.params
  if (!id) {
    return next({ message: commonResponse.error.INVALID_BODY, status: responseCode.BAD_REQUEST })
  }
  try {
    const response = await decorationQuery.deleteDecoration(id)
    res.status(response ? responseCode.OK : responseCode.INTERNAL_SERVER)
      .send(makeSuccessObject<string>(response._id.toString(), decorationResponse.success.DELETE))
  } catch (_err) {
    next({ message: decorationResponse.error.DELETE, status: responseCode.BAD_REQUEST })
  }
}

const conToggleDecorationAvailability = async (req, res, next) => {
  const decorationId = req.params.id

  try {
    const decorationInSystem = await decorationQuery.fetchDecorationById(decorationId)
    if (!decorationInSystem.length) {
      return next({ message: decorationResponse.error.NOT_FOUND, status: responseCode.BAD_REQUEST })
    }
    const updatedDecoration = await decorationQuery.updateDecorationAvailability(decorationId)
    if (updatedDecoration) {
      res.status(responseCode.ACCEPTED).send(makeSuccessObject<IDecoration>(updatedDecoration, decorationResponse.success.AVAILABILITY))
    }
  } catch (err) {
    next({ message: decorationResponse.error.AVAILABILITY, status: responseCode.BAD_REQUEST })
  }
}

export {
  conFetchAllDecorations,
  conUpdateDecoration,
  conFetchDecorationById,
  conInsertNewDecoration,
  conDeleteDecoration,
  conFetchAllAvailableDecorations,
  conToggleDecorationAvailability
}

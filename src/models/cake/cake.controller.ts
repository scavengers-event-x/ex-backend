import { makeSuccessObject } from '../../utils'
import * as cakeQuery from './cake.query'
import { cakeMapping } from './cakeModel'
import { ICake, ICakeMain } from './cake.types'
import { commonResponse, cakeResponse, responseCode } from '../../utils/constants'

const conFetchAllCakes = async (req, res, next) => {
  try {
    const cakes = await cakeQuery.fetchAllCakes()
    res.status(responseCode.OK)
      .send(makeSuccessObject<ICakeMain[]>(cakes, cakeResponse.success.FETCH_ALL))
  } catch (_err) {
    next({ message: cakeResponse.error.FETCH_ALL, status: responseCode.BAD_REQUEST })
  }
}

const conFetchAllAvailableCakes = async (req, res, next) => {
  try {
    const cakes = await cakeQuery.fetchAllAvailableCakes()
    res.status(responseCode.OK)
      .send(makeSuccessObject<ICakeMain[]>(cakes, cakeResponse.success.FETCH_ALL))
  } catch (_err) {
    next({ message: cakeResponse.error.FETCH_ALL, status: responseCode.BAD_REQUEST })
  }
}

const conFetchCakeById = async (req, res, next) => {
  const cakeId = req.params.id

  try {
    const cake = await cakeQuery.fetchCakeById(cakeId)
    if (!cake) {
      return next({ message: cakeResponse.error.FETCH_BY_ID, status: responseCode.BAD_REQUEST })
    } else {
      res.status(cake ? responseCode.OK : responseCode.OK)
        .send(makeSuccessObject<ICakeMain>(cake[0], cakeResponse.success.FETCH_BY_ID))
    }
  } catch (_err) {
    next({ message: cakeResponse.error.FETCH_BY_ID, status: responseCode.BAD_REQUEST })
  }
}

const conUpdateCake = async (req, res, next) => {
  const cakeId = req.params.id

  const mappedCake = cakeMapping(req.body)
  if (!mappedCake) {
    return next({ message: cakeResponse.error.UPDATE, status: responseCode.BAD_REQUEST })
  }

  try {
    const cakeInSystem = await cakeQuery.fetchCakeById(cakeId)
    if (!cakeInSystem.length) {
      return next({ message: cakeResponse.error.NOT_FOUND, status: responseCode.BAD_REQUEST })
    }
    const updatedCake = await cakeQuery.updateCake(cakeId, mappedCake)
    if (updatedCake) {
      res.status(responseCode.ACCEPTED).send(makeSuccessObject<ICake>(updatedCake, cakeResponse.success.UPDATE))
    }
  } catch (err) {
    next({ message: cakeResponse.error.UPDATE, status: responseCode.BAD_REQUEST })
  }
}

const conInsertNewCake = async (req, res, next) => {
  const { name, price, ...remainingBody } = req.body as ICake
  if (!name || !price) {
    return next({ message: commonResponse.error.INVALID_BODY, status: responseCode.BAD_REQUEST })
  }
  try {
    const insertRes = await cakeQuery.insertCake({ name, price, ...remainingBody })
    if (insertRes) {
      const response = await cakeQuery.fetchCakeById(insertRes._id)
      res.status(response ? responseCode.OK : responseCode.INTERNAL_SERVER)
        .send(makeSuccessObject<ICake>(response[0], cakeResponse.success.INSERT))
    }
  } catch (_err) {
    next({ message: cakeResponse.error.INSERT, status: responseCode.BAD_REQUEST })
  }
}

const conDeleteCake = async (req, res, next) => {
  const { id } = req.params
  if (!id) {
    return next({ message: commonResponse.error.INVALID_BODY, status: responseCode.BAD_REQUEST })
  }
  try {
    const response = await cakeQuery.deleteCake(id)
    res.status(response ? responseCode.OK : responseCode.INTERNAL_SERVER)
      .send(makeSuccessObject<string>(response._id.toString(), cakeResponse.success.DELETE))
  } catch (_err) {
    next({ message: cakeResponse.error.DELETE, status: responseCode.BAD_REQUEST })
  }
}

const conToggleCakeAvailability = async (req, res, next) => {
  const cakeId = req.params.id

  try {
    const cakeInSystem = await cakeQuery.fetchCakeById(cakeId)
    if (!cakeInSystem.length) {
      return next({ message: cakeResponse.error.NOT_FOUND, status: responseCode.BAD_REQUEST })
    }
    const updatedCake = await cakeQuery.updateCakeAvailability(cakeId)
    if (updatedCake) {
      res.status(responseCode.ACCEPTED).send(makeSuccessObject<ICake>(updatedCake, cakeResponse.success.AVAILABILITY))
    }
  } catch (err) {
    next({ message: cakeResponse.error.AVAILABILITY, status: responseCode.BAD_REQUEST })
  }
}

export {
  conFetchAllCakes,
  conUpdateCake,
  conFetchCakeById,
  conInsertNewCake,
  conDeleteCake,
  conFetchAllAvailableCakes,
  conToggleCakeAvailability
}

import { makeSuccessObject } from '../../utils'
import * as drinkQuery from './drink.query'
import { drinkMapping } from './drinkModel'
import { IDrink, IDrinkMain } from './drink.types'
import { commonResponse, drinkResponse, responseCode } from '../../utils/constants'

const conFetchAllDrinks = async (req, res, next) => {
  const { category, searchValue, imported, alcoholic } = req.query
  try {
    const drinks = await drinkQuery.fetchAllDrinks(category, searchValue, imported, alcoholic)
    res.status(responseCode.OK)
      .send(makeSuccessObject<IDrinkMain[]>(drinks, drinkResponse.success.FETCH_ALL))
  } catch (_err) {
    next({ message: drinkResponse.error.FETCH_ALL, status: responseCode.BAD_REQUEST })
  }
}

const conFetchAllAvailableDrinks = async (req, res, next) => {
  try {
    const drinks = await drinkQuery.fetchAllAvailableDrinks()
    res.status(responseCode.OK)
      .send(makeSuccessObject<IDrinkMain[]>(drinks, drinkResponse.success.FETCH_ALL))
  } catch (_err) {
    next({ message: drinkResponse.error.FETCH_ALL, status: responseCode.BAD_REQUEST })
  }
}

const conFetchDrinkById = async (req, res, next) => {
  const drinkId = req.params.id

  try {
    const drink = await drinkQuery.fetchDrinkById(drinkId)
    if (!drink) {
      return next({ message: drinkResponse.error.FETCH_BY_ID, status: responseCode.BAD_REQUEST })
    } else {
      res.status(drink ? responseCode.OK : responseCode.OK)
        .send(makeSuccessObject<IDrinkMain>(drink[0], drinkResponse.success.FETCH_BY_ID))
    }
  } catch (_err) {
    next({ message: drinkResponse.error.FETCH_BY_ID, status: responseCode.BAD_REQUEST })
  }
}

const conUpdateDrink = async (req, res, next) => {
  const drinkId = req.params.id

  const mappedDrink = drinkMapping(req.body)
  if (!mappedDrink) {
    return next({ message: drinkResponse.error.UPDATE, status: responseCode.BAD_REQUEST })
  }

  try {
    const drinkInSystem = await drinkQuery.fetchDrinkById(drinkId)
    if (!drinkInSystem.length) {
      return next({ message: drinkResponse.error.NOT_FOUND, status: responseCode.BAD_REQUEST })
    }
    const updatedDrink = await drinkQuery.updateDrink(drinkId, mappedDrink)
    if (updatedDrink) {
      res.status(responseCode.ACCEPTED).send(makeSuccessObject<IDrink>(updatedDrink, drinkResponse.success.UPDATE))
    }
  } catch (err) {
    next({ message: drinkResponse.error.UPDATE, status: responseCode.BAD_REQUEST })
  }
}

const conInsertNewDrink = async (req, res, next) => {
  const { name, price, ...remainingBody } = req.body as IDrink
  if (!name || !price) {
    return next({ message: commonResponse.error.INVALID_BODY, status: responseCode.BAD_REQUEST })
  }
  try {
    const insertRes = await drinkQuery.insertDrink({ name, price, ...remainingBody })
    if (insertRes) {
      const response = await drinkQuery.fetchDrinkById(insertRes._id)
      res.status(response ? responseCode.OK : responseCode.INTERNAL_SERVER)
        .send(makeSuccessObject<IDrink>(response[0], drinkResponse.success.INSERT))
    }
  } catch (_err) {
    next({ message: drinkResponse.error.INSERT, status: responseCode.BAD_REQUEST })
  }
}

const conDeleteDrink = async (req, res, next) => {
  const { id } = req.params
  if (!id) {
    return next({ message: commonResponse.error.INVALID_BODY, status: responseCode.BAD_REQUEST })
  }
  try {
    const response = await drinkQuery.deleteDrink(id)
    res.status(response ? responseCode.OK : responseCode.INTERNAL_SERVER)
      .send(makeSuccessObject<string>(response._id.toString(), drinkResponse.success.DELETE))
  } catch (_err) {
    next({ message: drinkResponse.error.DELETE, status: responseCode.BAD_REQUEST })
  }
}

const conToggleDrinkAvailability = async (req, res, next) => {
  const drinkId = req.params.id

  try {
    const drinkInSystem = await drinkQuery.fetchDrinkById(drinkId)
    if (!drinkInSystem.length) {
      return next({ message: drinkResponse.error.NOT_FOUND, status: responseCode.BAD_REQUEST })
    }
    const updatedDrink = await drinkQuery.updateDrinkAvailability(drinkId)
    if (updatedDrink) {
      res.status(responseCode.ACCEPTED).send(makeSuccessObject<IDrink>(updatedDrink, drinkResponse.success.AVAILABILITY))
    }
  } catch (err) {
    next({ message: drinkResponse.error.AVAILABILITY, status: responseCode.BAD_REQUEST })
  }
}

export {
  conFetchAllDrinks,
  conUpdateDrink,
  conFetchDrinkById,
  conInsertNewDrink,
  conDeleteDrink,
  conFetchAllAvailableDrinks,
  conToggleDrinkAvailability
}

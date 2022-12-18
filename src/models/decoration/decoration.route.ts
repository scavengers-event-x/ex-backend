import { Router } from 'express'

import * as decorationController from './decoration.controller'

const router = Router()

router.get('/', decorationController.conFetchAllDecorations)

router.get('/available', decorationController.conFetchAllAvailableDecorations)

router.get('/:id', decorationController.conFetchDecorationById)

export { router as decorationRouter }

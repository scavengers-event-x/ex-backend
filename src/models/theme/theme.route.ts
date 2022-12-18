import { Router } from 'express'

import * as themeController from './theme.controller'

const router = Router()

router.get('/', themeController.conFetchAllThemes)

router.get('/:id', themeController.conFetchThemeById)

export { router as themeRouter }

import { Router } from 'express'

import * as themeController from './theme.controller'

const router = Router()

router.route('/')
  .get(themeController.conFetchAllThemes)
  .post(themeController.conInsertNewTheme)

router.route('/:id')
  .get(themeController.conFetchThemeById)
  .put(themeController.conUpdateTheme)
  .delete(themeController.conDeleteTheme)

export { router as themeRouter }

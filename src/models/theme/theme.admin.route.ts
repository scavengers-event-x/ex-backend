import { Router } from 'express'

import { multerSingleImage } from '../../middleware'
import * as themeController from './theme.controller'

const router = Router()

router.route('/')
  .get(themeController.conFetchAllThemes)
  .post(multerSingleImage(), themeController.conInsertNewTheme)

router.route('/:id')
  .get(themeController.conFetchThemeById)
  .put(multerSingleImage(), themeController.conUpdateTheme)
  .delete(themeController.conDeleteTheme)

export { router as themeAdminRouter }

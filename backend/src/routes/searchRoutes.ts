import {Router} from 'express'
import { validateRequest } from '../middleware/validateRequest'
import * as searchController from '../controllers/searchControllers'
import { searchQueryDto } from '../dtos/dtos'

const router = Router()

router.get('/:query/:provider', validateRequest(searchQueryDto, 'params'), searchController.searchQuery)








export default router
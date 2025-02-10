import { Router } from 'express'
import * as store from '../controllers/store.js'
import * as auth from '../middlewares/auth.js'

const router = Router()
router.post('/', store.create)

export default router

import { Router } from 'express'
import * as store from '../controllers/store.js'
import * as auth from '../middlewares/auth.js'
import upload from '../middlewares/upload.js'

const router = Router()
router.post('/', auth.jwt, auth.admin, upload, store.create)
router.get('/', store.get)
router.get('/all', auth.jwt, auth.admin, store.getAll)
router.get('/:id', store.getId)
router.patch('/:id', auth.jwt, auth.admin, upload, store.edit)

export default router

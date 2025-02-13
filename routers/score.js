import { Router } from 'express'
import * as score from '../controllers/score.js'
import * as auth from '../middlewares/auth.js'
import upload from '../middlewares/upload.js'

const router = Router()
//新增評價
router.post('/', auth.jwt, auth.login, upload, score.create)
// 所有評價
router.get('/all', score.get)
// 單店家評價
router.get('/getstore/:id', score.getstore)
// 單會員評價
router.get('/getuser/:id', auth.jwt, auth.login, score.getuser)
// 更改評價
router.patch('/:id', auth.jwt, auth.login, upload, score.edit)
// 刪除評價
router.delete('/:id', auth.jwt, auth.login, score.del)

export default router

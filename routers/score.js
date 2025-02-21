import { Router } from 'express'
import * as score from '../controllers/score.js'
import * as auth from '../middlewares/auth.js'
import upload from '../middlewares/upload.js'

const router = Router()
//新增評價
router.post('/', auth.jwt, upload, score.create)
// // 所有評價
router.get('/all', auth.jwt, auth.admin, score.getAll)
// // 單店家評價
router.get('/getstore/:storeid', score.getstore)
// // 單店家單會員評價
router.get('/getuser/:storeid/:userid', auth.jwt, score.getuser)
// // 單會員所有評價
router.get('/getuserall/:userid', auth.jwt, score.getuserall)
// // 更改評價
router.patch('/:id', auth.jwt, upload, score.edit)
// // 刪除評價
router.delete('/:id', auth.jwt, auth.admin, score.del)

export default router

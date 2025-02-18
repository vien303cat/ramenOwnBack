import { Router } from 'express'
import * as score from '../controllers/score.js'
import * as auth from '../middlewares/auth.js'
import upload from '../middlewares/upload.js'

const router = Router()
//新增評價 如果加驗證登入會報錯auth.logi 問下翔翔
router.post('/', auth.jwt, upload, score.create)
// // 所有評價
// router.get('/all', score.get)
// // 單店家評價
router.get('/getstore/:storeid', score.getstore)
// // 單會員評價
router.get('/getuser/:storeid/:userid', auth.jwt, score.getuser)
// // 更改評價
router.patch('/:id', auth.jwt, upload, score.edit)
// TODO:
// // 刪除評價
// router.delete('/:id', auth.jwt, auth.login, score.del)

export default router

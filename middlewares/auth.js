import passport from 'passport'
import { StatusCodes } from 'http-status-codes'

export const login = (req, res, next) => {
  // session: false 停用cookie
  passport.authenticate('login', { session: false }, (error, user, info) => {
    // 到了passpost.js裡的login完成done()之後再繼續跑這
    if (!user || error) {
      // local驗證策略的錯誤,名稱固定
      if (info.message === 'Missing credentials') {
        return res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: 'requestFormatError',
        })
      }
    }
    req.user = user
    next()
  })(req, res, next)
  // ^^^^^^需要立即執行因為passport.authenticate只是定義一個func 每次呼叫auth時只有定義並沒什麼用
}

import passport from 'passport'
import { StatusCodes } from 'http-status-codes'
import jsonwebtoken from 'jsonwebtoken'

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

export const jwt = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (error, data, info) => {
    console.log(error, data, info)
    if (error || !data) {
      // 是不是 JWT 錯誤，可能是過期、格式不對、secret 驗證失敗
      if (info instanceof jsonwebtoken.JsonWebTokenError) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: 'userTokenInvalid',
        })
      }
      // 伺服器錯誤，可能是打錯字或出 bug
      else if (info.message === 'serverError') {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          success: false,
          message: info.message,
        })
      }
      // 其他錯誤，可能是找不到使用者、使用者沒有這個 jwt
      else {
        return res.status(StatusCodes.UNAUTHORIZED).json({
          success: false,
          message: info.message,
        })
      }
    }
    // 將查詢到的使用者放入 req 中給後續的 controller 或 middleware 使用
    req.user = data.user
    req.token = data.token
    // 繼續下一步
    next()
  })(req, res, next)
}

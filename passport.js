import passport from 'passport'
import passportLocal from 'passport-local'
import User from './models/user.js'
import bcrypt from 'bcrypt'
import passportJWT from 'passport-jwt'

// 引用passportLocal 驗證策略
// 編寫 login 驗證方式
// new 策略(設定,完成後執行的function)
passport.use(
  'login',
  new passportLocal.Strategy(
    {
      usernameField: 'account',
      passwordField: 'password',
    },
    async (account, password, done) => {
      try {
        const user = await User.findOne({ account: account, ishidden: false }).orFail(
          new Error('ACCOUNT'),
        )

        if (!bcrypt.compareSync(password, user.password)) {
          throw new Error('PASSWORD')
        }
        // 完成驗證之後帶入下一步處理 done(錯誤,資料,info)
        return done(null, user, null)
      } catch (error) {
        console.log(error)
        if (error.message === 'ACCOUNT') {
          return done(null, null, { message: '未找到使用者' })
        } else if (error.message === 'PASSWORD') {
          return done(null, null, { message: '密碼不正確' })
        } else {
          return done(null, null, { message: '伺服器錯誤' })
        }
      }
    },
  ),
)

// 引用passportJWT 驗證策略
// 編寫jwt 驗證方式
passport.use(
  'jwt',
  new passportJWT.Strategy(
    {
      // jwt從哪裡取得
      jwtFromRequest: passportJWT.ExtractJwt.fromAuthHeaderAsBearerToken(),
      // jwt的secret
      secretOrKey: process.env.JWT_SECRET,
      //  讓後面的function可以取得req
      passReqToCallback: true,
      // 允許過期JWT通過驗證
      ignoreExpiration: true,
    },
    // req = 請求資訊, 有設定 passReqToCallback 才能用
    // plyload = jwt解碼後的資料
    // done = 完成後執行的function
    async (req, payload, done) => {
      try {
        // 自己取的原始的jwt方法
        // const token = req.headers.authorization.split(' ')[1]

        // 因為沒有提供原始的jwt , 所以利用套件語法取得
        const token = passportJWT.ExtractJwt.fromAuthHeaderAsBearerToken()(req)

        // 手動檢查jwt是否過期
        // 只允許refresh 和 logout 允許過期的jwt
        // payload.exp = jwt的過期時間,單位是秒
        // new Date().getTime() = 現在時間,單位是毫秒
        // jwt的過期時間 * 1000 < 現在時間 (毫秒)
        const expired = payload.exp * 1000 < new Date().getTime()
        // 請求路徑
        // http://localhost:4000/user/test?aaa=111&bbb=222
        // req.originUrl = /user/test?aaa=111&bbb=222
        // req.baseUrl = /user
        // req.path = /test
        // req.query = { aaa: 111, bbb: 222 }
        const url = req.baseUrl + req.path
        if (expired && url !== '/user/refresh' && url !== '/user/logout') {
          // token過期
          throw new Error('EXPIRED')
        }
        // 用解碼的資料查詢有沒有這個使用者
        const user = await User.findById(payload._id).orFail(new Error('USER'))
        // 找到使用者後,檢查資料庫有沒有這個jwt
        if (!user.tokens.includes(token)) {
          throw new Error('TOKEN')
        }
        // 都沒問題,下一步
        return done(null, { user, token }, null)
      } catch (error) {
        console.log(error)
        if (error.message === 'USER') {
          return done(null, null, { message: '未找到使用者' })
        } else if (error.message === 'TOKEN') {
          return done(null, null, { message: '找不到TOKEN' })
        } else if (error.message === 'EXPIRED') {
          return done(null, null, { message: 'TOKEN 過期' })
        } else {
          return done(null, null, { message: '伺服器錯誤' })
        }
      }
    },
  ),
)

import passport from 'passport'
import passportLocal from 'passport-local'
import User from './models/user.js'
import bcrypt from 'bcrypt'

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

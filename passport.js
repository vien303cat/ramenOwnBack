import passport from 'passport'
import passportLocal from 'passport-local'
import User from './models/user.js'
import bcrypt from 'bcrypt'

// 引用passportLocal 驗證策略
// 編寫 login 驗證方式

passport.use('login', new passportLocal.Strategy({}))

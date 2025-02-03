import { Schema, model, ObjectId, Error } from 'mongoose'
import validator from 'validator'
import bcrypt from 'bcrypt'
import UserPermission from '../enums/UserPermission.js'

const schema = new Schema(
  {
    account: {
      type: String,
      description: '帳號',
      required: [true, '使用者帳號必填'],
      minlength: [4, '帳號長度過短'],
      maxlength: [20, '帳號長度過短'],
      unique: true,
      validate: {
        // 判斷是否為英數字
        validator(value) {
          return validator.isAlphanumeric(value)
        },
        message: '帳號須為英數字',
      },
    },
    password: {
      type: String,
      description: '密碼',
      required: [true, '使用者密碼必填'],
    },
    email: {
      type: String,
      description: '信箱',
      required: [true, '信箱必填'],
      unique: true,
      validate: {
        // 判斷是否為信箱格式
        validator(value) {
          return validator.isEmail(value)
        },
        message: '信箱格式錯誤',
      },
    },
    image: {
      type: String,
    },
    tokens: {
      type: [String],
      description: 'TOKEN',
      default: [],
    },
    name: {
      type: String,
      description: '暱稱',
      required: [true, '暱稱必填'],
      minlength: [1, '暱稱長度過短'],
      maxlength: [10, '帳號長度過長'],
      unique: true,
    },
    permission: {
      type: Number,
      description: '權限:0-會員,1-管理員,99-超級管理員',
      enum: {
        value: [0, 1, 99],
        message: '權限錯誤',
      },
      default: UserPermission.USER,
    },
    ishidden: {
      type: Boolean,
      description: '是否刪除:0-未刪除,1-已刪除',
      default: false,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
)

//  mongoose 驗證後,存入資料庫前執行動作
schema.pre('save', function (next) {
  const user = this
  // 密碼欄位有修改再處理
  if (user.isModified('password')) {
    // 自己寫驗證
    if (user.password.length < 4) {
      const error = new Error.ValidationError()
      error.addError('password', new Error.ValidatorError({ message: '密碼過短' }))
      next(error)
    } else if (user.password.length > 20) {
      const error = new Error.ValidationError()
      error.addError('password', new Error.ValidatorError({ message: '密碼太長' }))
      next(error)
    } else {
      user.password = bcrypt.hashSync(user.password, 10)
    }
  }
  next()
})

export default model('users', schema)

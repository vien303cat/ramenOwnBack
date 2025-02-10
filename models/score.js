import { Schema, model, ObjectId } from 'mongoose'

const schema = new Schema(
  {
    user: {
      type: ObjectId,
      description: '使用者ID',
      ref: 'users',
      required: [true, 'USERID必填'],
    },
    store: {
      type: ObjectId,
      description: '店家ID',
      ref: 'stores',
      required: [true, 'STOREID必填'],
    },
    star: {
      type: Number,
      description: '分數',
      min: [1, '分數不能小於1'],
      max: [10, '分數不能大於10'],
      default: 1,
    },
    image: {
      type: String,
      description: '圖片',
    },
    depiction: {
      type: String,
      description: '描述',
      required: [true, '描述必填'],
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

export default model('scores', schema)

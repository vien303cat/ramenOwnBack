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
    type: {
      type: Number,
      description: '類型:0-反應,1-申請管理員',
      enum: {
        values: [0, 1],
        message: '類型錯誤',
      },
      required: [true, '類型必填'],
    },
    depiction: {
      type: String,
      description: '描述',
      required: [true, '描述必填'],
    },
    checked: {
      type: Number,
      description: '審核:0-未審核,1-審核成功,2-審核失敗',
      enum: {
        values: [0, 1, 2],
        message: '審核值錯誤',
      },
      default: 0,
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

export default model('feedbacks', schema)

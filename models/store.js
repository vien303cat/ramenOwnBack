import { Schema, model } from 'mongoose'
import validator from 'validator'

const schema = new Schema(
  {
    name: {
      type: String,
      description: '名稱',
      required: [true, '店家名稱必填'],
      unique: true,
    },
    depiction: {
      type: String,
      description: '敘述',
    },
    timetxt: {
      type: String,
      description: '營業時間',
    },
    adress: {
      type: String,
      description: '地址',
    },
    image: {
      type: String,
      description: '圖片',
    },
    sort: {
      type: Number,
      description: '排序',
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

export default model('stores', schema)

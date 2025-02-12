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
      required: [true, '敘述必填'],
    },
    timetxt: {
      type: String,
      description: '營業時間',
      required: [true, '營業時間必填'],
    },
    adress: {
      type: String,
      description: '地址',
      required: [true, '地址必填'],
    },
    image: {
      type: String,
      description: '圖片',
      required: [true, '圖片必填'],
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

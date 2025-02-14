import Score from '../models/score.js'
import Store from '../models/store.js'
import { StatusCodes } from 'http-status-codes'
import validator from 'validator'

export const create = async (req, res) => {
  try {
    req.body.image = req.file?.path || ''
    const result = await Store.create(req.body)

    res.status(StatusCodes.OK).json({
      success: true,
      message: '',
      result: result,
    })
  } catch (error) {
    console.log('controller score create:', error)
    if (error.name === 'MongoServerError' && error.code === 11000) {
      res.status(StatusCodes.CONFLICT).json({
        success: false,
        message: '錯誤請求',
      })
    } else if (error.name === 'ValidationError') {
      const key = Object.keys(error.errors)[0]
      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: '錯誤請求:' + error.errors[key].message,
      })
    } else {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: '未知錯誤',
      })
    }
  }
}

// TODO: 0214 下面的func都還做到一伴而已還沒確認是否可行
export const getuser = async (req, res) => {
  console.log('getuser:', req.params)
  try {
    if (!validator.isMongoId(req.params.storeid)) throw new Error('ID')
    if (!validator.isMongoId(req.params.userid)) throw new Error('ID')
    const result = await Score.find({ user: req.user._id }).orFail(new Error('NOT FOUND'))
    res.status(StatusCodes.OK).json({
      success: true,
      message: '',
      result,
    })
  } catch (error) {
    console.log(error)
    if (error.name === 'CastError' || error.message === 'ID') {
      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'ID格式不符',
      })
    } else if (error.message === 'NOT FOUND') {
      res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: '',
      })
    } else {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'serverError',
      })
    }
  }
}

export const get = async (req, res) => {}
export const getstore = async (req, res) => {}
export const edit = async (req, res) => {}
export const del = async (req, res) => {}

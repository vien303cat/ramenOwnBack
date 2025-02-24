import Score from '../models/score.js'
import { StatusCodes } from 'http-status-codes'
import validator from 'validator'

export const create = async (req, res) => {
  try {
    req.body.image = req.file?.path || ''
    const result = await Score.create(req.body)

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

export const getAll = async (req, res) => {
  try {
    const result = await Score.find()
      .populate('user', ['account', 'name'])
      .populate('store', ['name', 'image'])
    res.status(StatusCodes.OK).json({
      success: true,
      message: '',
      result,
    })
    console.log('result:', result)
  } catch (error) {
    console.log('controller score getAll:', error)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'serverError',
    })
  }
}

export const allscoressimple = async (req, res) => {
  try {
    const result = await Score.find({ ishidden: false, image: { $ne: '' } }).select('image store')
    res.status(StatusCodes.OK).json({
      success: true,
      message: '',
      result,
    })
    console.log('allscoressimple result:', result)
  } catch (error) {
    console.log('controller allscoressimple err:', error)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'serverError',
    })
  }
}

export const getuser = async (req, res) => {
  const getData = req.method === 'POST' ? req.body : req.query
  console.log('getuserDATA:', getData, req.params)
  try {
    if (!validator.isMongoId(req.params.storeid)) throw new Error('ID')
    if (!validator.isMongoId(req.params.userid)) throw new Error('ID')
    const result = await Score.findOne({
      user: req.params.userid,
      store: req.params.storeid,
    }).orFail(new Error('NOT FOUND'))
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

export const getusernew = async (req, res) => {
  const getData = req.method === 'POST' ? req.body : req.query
  console.log('getuserNewDATA:', getData, req.params)
  try {
    if (!validator.isMongoId(req.params.userid)) throw new Error('ID')
    const result = await Score.findOne({
      user: req.params.userid,
    })
      .sort({ updatedAt: -1 }) // 按照 updatedAt 字段降序排序
      .populate('store', ['name', 'image'])
      .select('store star depiction') // 指定要返回的欄位
      .orFail(new Error('NOT FOUND'))
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

export const getuserall = async (req, res) => {
  const getData = req.method === 'POST' ? req.body : req.query
  console.log('getuserallDATA:', getData, req.params)
  try {
    if (!validator.isMongoId(req.params.userid)) throw new Error('ID')
    const result = await Score.find({
      user: req.params.userid,
    })
      .populate('store', ['name', 'image', 'adress'])
      .orFail(new Error('NOT FOUND'))
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

export const getstore = async (req, res) => {
  try {
    // const getData = req.method === 'POST' ? req.body : req.query
    // console.log('getstoreDATA:', req.params)
    if (!validator.isMongoId(req.params.storeid)) throw new Error('ID')

    const result = await Score.find({ store: req.params.storeid, ishidden: false }).populate(
      'user',
      ['name'],
    )

    // const result = await Score.aggregate([
    //   {
    //     $match: {
    //       ishidden: false,
    //       store: req.params.storeid,
    //     },
    //   },
    //   {
    //     $lookup: {
    //       from: 'scores',
    //       foreignField: 'scores',
    //       localField: 'user',
    //       as: 'user',
    //     },
    //   },
    //   { $unwind: '$user' },
    //   {
    //     $group: {
    //       _id: '$user._id',
    //       name: { $first: '$user.name' },
    //       scores: { $sum: 1 }, // 計算該 user 在 Score 表內的紀錄數量
    //     },
    //   },
    // ])
    console.log('getstore result:', result)

    res.status(StatusCodes.OK).json({
      success: true,
      message: '',
      result,
    })
  } catch (error) {
    console.log('controller getstore :', error)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'serverError',
    })
  }
}

export const edit = async (req, res) => {
  try {
    if (!validator.isMongoId(req.params.id)) throw new Error('ID')

    req.body.image = req.file?.path
    console.log('editDATA:', req.params.id)
    const result = await Score.findByIdAndUpdate(req.params.id, req.body, {
      runValidators: true,
      new: true,
    }).orFail(new Error('NOT FOUND'))

    res.status(StatusCodes.OK).json({
      success: true,
      message: '',
      result,
    })
  } catch (error) {
    console.log('controller score edit:', error)
    if (error.name === 'CastError' || error.message === 'ID') {
      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: '',
      })
    } else if (error.message === 'NOT FOUND') {
      res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: '',
      })
    } else if (error.name === 'ValidationError') {
      const key = Object.keys(error.errors)[0]
      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: error.errors[key].message,
      })
    } else {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'serverError',
      })
    }
  }
}

export const del = async (req, res) => {
  try {
    if (!validator.isMongoId(req.params.id)) throw new Error('ID')
    const result = await Score.findByIdAndDelete(req.params.id).orFail(new Error('NOT FOUND'))

    res.status(StatusCodes.OK).json({
      success: true,
      message: '刪除成功',
      result,
    })
    console.log('刪除成功:', req.params.id)
  } catch (error) {
    console.log('controller score del:', error)
    if (error.name === 'CastError' || error.message === 'ID') {
      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: '',
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

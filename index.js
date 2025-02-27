import 'dotenv/config'
import express from 'express'
import mongoose from 'mongoose'
import { StatusCodes } from 'http-status-codes'
import routerUser from './routers/user.js'
import routerStore from './routers/store.js'
import routerScore from './routers/score.js'

import cors from 'cors'

// 這個import會直接執行
import './passport.js'

mongoose
  .connect(process.env.DB_URL)
  .then(() => {
    console.log('資料庫連線成功')
  })
  .catch((error) => {
    console.log('資料庫連線失敗')
    console.log(error)
  })

const app = express()

// 處理跨域請求
app.use(
  cors({
    origin(origin, callback) {
      console.log(origin)
      if (
        // postman 的 origin 預設是 undefined
        origin === undefined ||
        origin.includes('localhost') ||
        origin.includes('127.0.0.1') ||
        origin.includes('github.io')
      ) {
        callback(null, true)
      } else {
        callback(new Error('CORS'), false)
      }
    },
  }),
)

app.use(express.json())
app.use((error, req, res, next) => {
  res.status(
    StatusCodes.BAD_REQUEST.json({
      success: false,
      message: '請求格式錯誤',
    }),
  )
})

// 根目錄的get請求處理
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>404</title>
    </head>
    <body>
      <h1 style="text-align:center;">你在找拉麵嗎 厲害喔:3</h1>
      <iframe width="100%" height="800" src="https://www.youtube.com/embed/VIDPlxBC5Xk?si=cuPI2LP8PmfOWUVa&amp;start=48" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
    </body>
    </html>
  `)
})

app.use('/user', routerUser)
app.use('/store', routerStore)
app.use('/score', routerScore)

app.listen(process.env.PORT || 4000, () => {
  console.log('伺服器啟動')
})

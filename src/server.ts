import express, { Application } from 'express'
import morgan from 'morgan'
import 'reflect-metadata'
import router from './routes'
import swaggerUi from 'swagger-ui-express'
import { createConnection } from 'typeorm'
import dbConfig from './config/database'

const cors = require('cors')
const PORT = process.env.PORT || 8000

const app: Application = express()

app.use(express.json())
app.use(morgan('tiny'))
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))
app.use(cors())

app.use(
  '/docs',
  swaggerUi.serve,
  swaggerUi.setup(undefined, {
    swaggerOptions: {
      url: '/swagger.json'
    }
  })
)

createConnection(dbConfig)
  .then((connection) => {
    app.listen(PORT, () => {
      console.log(`Server is running on PORT ${PORT}`)
    })

    app.use(router)
  })
  .catch((err) => {
    console.log(`Unable to connect to db ${err}`)
    process.exit(1)
  })

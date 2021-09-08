import express from 'express'
import CategoryRouter from '../routes/category.route'
import OpnameRouter from '../routes/opname.route'
import PaperRouter from '../routes/paper.route'
import ReportRouter from '../routes/report.route'

const router = express.Router()

router.get('/ping', async (req, res) => {
  res.send({ message: 'test' })
})

router.use('/category', CategoryRouter)
router.use('/paper', PaperRouter)
router.use('/opname', OpnameRouter)
router.use('/report', ReportRouter)

export default router

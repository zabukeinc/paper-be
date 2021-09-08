import express, { Request, Response, NextFunction } from 'express'
import { PaperReportController } from '../infrastructures/paper/paper-report.controller'

const router = express.Router()

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const controller = new PaperReportController()

    const params = {
      limit: Number(req.query.limit),
      page: Number(req.query.page),
      date_start: req.query.date_start,
      date_end: req.query.date_end
    }

    const response = (await controller.report(
      params.page,
      params.limit,
      params.date_start as any,
      params.date_end as any
    )) as any

    return res.status(200).json({ data: response.data, count: response.count })
  } catch (err) {
    return res.json(err)
  }
})

router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const controller = new PaperReportController()

    const response = await controller.show(req.params.id)
    return res.status(200).json({
      data: response
    })
  } catch (err) {
    console.log(err)
    return res.status(400).json({ error: err.message })
  }
})

export default router

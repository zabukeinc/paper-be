import express, { Request, Response, NextFunction } from 'express'
import { FilterDTO } from '../base/infrasturctures/filter-dto'
import { OpnameController } from '../infrastructures/opname/opname.controller'

const router = express.Router()

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const controller = new OpnameController()

    const params: FilterDTO = {
      limit: Number(req.query.limit),
      page: Number(req.query.page)
    }

    const response = (await controller.index(params.page, params.limit)) as any

    return res.status(200).json({ data: response.data, count: response.count })
  } catch (err) {
    return res.json(err)
  }
})

router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const controller = new OpnameController()

    const response = await controller.show(req.params.id)
    return res.status(200).json({
      data: response
    })
  } catch (err) {
    console.log(err)
    return res.json({ error: err.message })
  }
})

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const controller = new OpnameController()

    const response = await controller.create(req.body)
    return res.status(200).json({
      data: response
    })
  } catch (err) {
    console.log(err)
    return res.json({ error: err.message })
  }
})

router.delete('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const controller = new OpnameController()

    await controller.delete(req.body)

    return res.status(200).json({
      data: 'Data succesfully deleted.'
    })
  } catch (err) {
    return res.json({ error: err.message })
  }
})

router.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const controller = new OpnameController()

    const response = await controller.update(req.params.id, req.body)
    return res.status(200).json({
      data: response
    })
  } catch (err) {
    return res.json({ error: err.message })
  }
})

router.put(
  '/:id/check',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const controller = new OpnameController()

      const response = await controller.check(req.params.id)
      return res.status(200).json({
        data: response
      })
    } catch (err) {
      console.log(err)
      return res.status(400).json({ error: err.message })
    }
  }
)

export default router

import { BaseOrchestrator } from '../../base/infrasturctures/base.orchestrator'
import { OpnameModel } from '../../data/models/opname/opname.model'
import { PaperModel } from '../../data/models/paper/paper.model'
import { OpnameDataService } from '../../data/services/opname-data.service'
import {
  OpnameDTO,
  OpnameEntity,
  OpnameResult,
  OpnameStatus
} from '../../entities/opname/opname.entity'
import { CodeGenerator } from '../validator/code.generator'

export class OpnameOrchestrator extends BaseOrchestrator<OpnameModel> {
  constructor() {
    super(new OpnameDataService().build())
  }

  relations = ['items', 'items.paper', 'items.paper.category']

  public async create(body: OpnameDTO): Promise<OpnameEntity> {
    const code = await new CodeGenerator()
      .setPrefix('SOP')
      .setDate(new Date())
      .setRepository(this.repository)
      .generate()

    Object.assign(body, {
      code,
      date: new Date()
    })

    return await this.repository.save(body)
  }

  public async update(
    id: number,
    updatedData: OpnameDTO
  ): Promise<OpnameEntity> {
    const data = await this.repository.findOneOrFail(id, {
      relations: this.relations
    })

    Object.assign(data, updatedData)

    return await this.repository.save(data)
  }

  public async check(id: number): Promise<OpnameEntity> {
    let data = await this.repository.findOneOrFail(id, {
      relations: this.relations
    })

    if (data.status === OpnameStatus.CHECKED) {
      throw new Error(`Opname ${data.code} already checked.`)
    }

    data.items = await Promise.all(
      data.items.map(async (item) => {
        const paperRepo = this.repository.manager.getRepository(PaperModel)

        const paper = await paperRepo.findOne(item.paper_id)

        if (!paper) throw new Error(`Paper with id ${id} is not found`)

        item.quantity_system = paper.stock

        paper.stock = item.quantity

        await paperRepo.save(paper)

        return item
      })
    )

    const hasDifference = data.items.find(
      (item) => item.quantity_system !== item.quantity
    )

    data.result = hasDifference ? OpnameResult.NOT_MATCH : OpnameResult.MATCH
    data.status = OpnameStatus.CHECKED

    return await this.repository.save(data)
  }

  public async delete(ids: number[]): Promise<void> {
    await Promise.all(
      ids.map(async (id: number) => {
        const opname = await this.show(id)

        if (opname.status === OpnameStatus.DRAFT) {
          await this.repository.delete(id)
        }
      })
    )
  }
}

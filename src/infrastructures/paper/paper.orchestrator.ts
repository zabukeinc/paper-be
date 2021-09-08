import { BaseOrchestrator } from '../../base/infrasturctures/base.orchestrator'
import { FilterDTO } from '../../base/infrasturctures/filter-dto'
import { OpnameItemModel } from '../../data/models/opname/opname-item.model'
import { PaperModel } from '../../data/models/Paper/Paper.model'
import { PaperDataService } from '../../data/services/paper-data.service'
import { PaperDTO, PaperEntity } from '../../entities/paper/paper.entity'
import { CodeGenerator } from '../validator/code.generator'
import { NameValidator } from '../validator/name.validator'

export class PaperOrchestrator extends BaseOrchestrator<PaperModel> {
  constructor() {
    super(new PaperDataService().build())
  }

  relations = ['category', 'opname_items']

  async index(params: FilterDTO): Promise<any> {
    let page = params.page ?? 0
    let limit = params.limit ?? 10

    const [results, total] = await this.repository.findAndCount({
      relations: this.relations,
      skip: page,
      take: limit
    })

    return {
      data: results.reverse(),
      count: total
    }
  }

  public async create(body: PaperDTO): Promise<PaperEntity> {
    await new NameValidator(this.repository, body.name).execute()

    const code = await new CodeGenerator()
      .setPrefix('PP')
      .setDate(new Date())
      .setRepository(this.repository)
      .generate()

    Object.assign(body, {
      code
    })

    return await this.repository.save(body)
  }

  public async update(id: number, updatedData: PaperDTO): Promise<PaperEntity> {
    await new NameValidator(this.repository, updatedData.name, id).execute()

    const data = await this.repository.findOneOrFail(id)

    Object.assign(data, updatedData)

    return await this.repository.save(data)
  }

  public async delete(ids: number[]): Promise<void> {
    await Promise.all(
      ids.map(async (id: number) => {
        const paper = await this.repository.manager
          .getRepository(OpnameItemModel)
          .findOne({ where: { paper_id: id } })

        if (paper) {
          throw new Error(`Paper with id ${id} has relation.`)
        }
      })
    )
    await this.repository.delete(ids)
  }
}

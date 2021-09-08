import { BaseOrchestrator } from '../../base/infrasturctures/base.orchestrator'
import { CategoryModel } from '../../data/models/category/category.model'
import { PaperModel } from '../../data/models/paper/paper.model'
import { CategoryDataService } from '../../data/services/category-data.service'
import {
  CategoryDTO,
  CategoryEntity
} from '../../entities/category/category.entity'
import { CodeGenerator } from '../validator/code.generator'
import { NameValidator } from '../validator/name.validator'

export class CategoryOrchestrator extends BaseOrchestrator<CategoryModel> {
  constructor() {
    super(new CategoryDataService().build())
  }

  public async create(body: CategoryDTO): Promise<CategoryEntity> {
    await new NameValidator(this.repository, body.name).execute()

    const code = await new CodeGenerator()
      .setPrefix('CAT')
      .setDate(new Date())
      .setRepository(this.repository)
      .generate()

    Object.assign(body, {
      code
    })

    return await this.repository.save(body)
  }

  public async update(
    id: number,
    updatedData: CategoryDTO
  ): Promise<CategoryEntity> {
    await new NameValidator(this.repository, updatedData.name, id).execute()

    const data = await this.repository.findOneOrFail(id)

    Object.assign(data, updatedData)

    return await this.repository.save(data)
  }

  public async delete(ids: number[]): Promise<void> {
    await Promise.all(
      ids.map(async (id: number) => {
        const paper = await this.repository.manager
          .getRepository(PaperModel)
          .findOne({ where: { category_id: id } })

        if (paper) {
          throw new Error(`Category with id ${id} has relation.`)
        }
      })
    )
    await this.repository.delete(ids)
  }
}

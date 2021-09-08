import { Column, Entity, OneToMany } from 'typeorm'
import { BaseModel } from '../../../base/model/base.model'
import { CategoryEntity } from '../../../entities/category/category.entity'
import { PaperModel } from '../paper/paper.model'

@Entity({ name: 'categories' })
export class CategoryModel extends BaseModel implements CategoryEntity {
  @Column('varchar', { name: 'name' })
  name: string

  @Column('varchar', { name: 'code' })
  code: string

  @OneToMany(() => PaperModel, (model) => model.category)
  papers: PaperModel[]
}

import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm'
import { BaseModel } from '../../../base/model/base.model'
import { PaperEntity } from '../../../entities/paper/paper.entity'
import { CategoryModel } from '../category/category.model'
import { OpnameItemModel } from '../opname/opname-item.model'

@Entity({ name: 'papers' })
export class PaperModel extends BaseModel implements PaperEntity {
  @Column('varchar', { name: 'name' })
  name: string

  @Column('varchar', { name: 'code' })
  code: string

  @Column('int', { name: 'stock', default: 0 })
  stock: number

  @Column('int', { name: 'category_id' })
  category_id: number

  @ManyToOne(() => CategoryModel, (model) => model.papers)
  @JoinColumn({ name: 'category_id' })
  category: CategoryModel

  @OneToMany(() => OpnameItemModel, (model) => model.paper)
  opname_items: OpnameItemModel[]

  public getQuantityIn(): number {
    return this.opname_items.reduce((total: number, item: OpnameItemModel) => {
      return (total += item.quantity)
    }, 0)
  }

  public getQuantityOut(): number {
    return this.opname_items.reduce((total: number, item: OpnameItemModel) => {
      return (total += item.quantity - item.quantity_system)
    }, 0)
  }
}

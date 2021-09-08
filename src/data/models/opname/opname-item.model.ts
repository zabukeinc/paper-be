import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'
import { BaseModel } from '../../../base/model/base.model'
import { OpnameItemEntity } from '../../../entities/opname/opname.entity'
import { PaperModel } from '../paper/paper.model'
import { OpnameModel } from './opname.model'

@Entity({ name: 'opname_items' })
export class OpnameItemModel extends BaseModel implements OpnameItemEntity {
  @Column('int', { name: 'quantity', nullable: true })
  quantity: number

  @Column('int', { name: 'quantity_system', nullable: true })
  quantity_system: number

  @Column('int', { name: 'opname_id', nullable: true })
  opname_id: number

  @Column('int', { name: 'paper_id', nullable: true })
  paper_id: number

  @ManyToOne(() => OpnameModel, (model) => model.items, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  })
  @JoinColumn({ name: 'opname_id' })
  opname: OpnameModel

  @ManyToOne(() => PaperModel, (model) => model.opname_items)
  @JoinColumn({ name: 'paper_id' })
  paper: PaperModel
}

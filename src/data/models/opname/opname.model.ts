import { Column, Entity, OneToMany } from 'typeorm'
import { BaseModel } from '../../../base/model/base.model'
import {
  OpnameEntity,
  OpnameResult,
  OpnameStatus
} from '../../../entities/opname/opname.entity'
import { OpnameItemModel } from './opname-item.model'

@Entity({ name: 'opnames' })
export class OpnameModel extends BaseModel implements OpnameEntity {
  @Column('varchar', { name: 'code' })
  code: string

  @Column('varchar', { name: 'date' })
  date: Date

  @Column('enum', { name: 'status', enum: OpnameStatus })
  status: OpnameStatus

  @Column('enum', { name: 'result', enum: OpnameResult })
  result: OpnameResult

  @OneToMany(() => OpnameItemModel, (model) => model.opname, {
    cascade: true
  })
  items: OpnameItemModel[]
}

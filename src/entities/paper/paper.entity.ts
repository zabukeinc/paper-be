import { CategoryEntity } from '../category/category.entity'
import { OpnameItemEntity } from '../opname/opname.entity'

export interface PaperDTO {
  name: string
  stock: number
  category: CategoryEntity
}

export interface PaperEntity {
  id: number
  name: string
  code: string
  stock: number
  category: CategoryEntity
  opname_items?: OpnameItemEntity[]
}

import { getConnection, getRepository } from 'typeorm'
import { CategoryModel } from '../models/category/category.model'

export class CategoryDataService {
  constructor() {}

  build() {
    return getConnection('paper_connection').getRepository(CategoryModel)
  }
}

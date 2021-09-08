import { getConnection } from 'typeorm'
import { PaperModel } from '../models/paper/paper.model'

export class PaperDataService {
  constructor() {}

  build() {
    return getConnection('paper_connection').getRepository(PaperModel)
  }
}

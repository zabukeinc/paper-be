import { getConnection } from 'typeorm'
import { OpnameModel } from '../models/opname/opname.model'

export class OpnameDataService {
  constructor() {}

  build() {
    return getConnection('paper_connection').getRepository(OpnameModel)
  }
}

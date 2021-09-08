import { ConnectionOptions } from 'typeorm'
import { CategoryModel } from '../data/models/category/category.model'
import { OpnameItemModel } from '../data/models/opname/opname-item.model'
import { OpnameModel } from '../data/models/opname/opname.model'
import { PaperModel } from '../data/models/paper/paper.model'

const dbConfig: ConnectionOptions = {
  type: 'mysql',
  name: 'paper_connection',
  host: process.env.MYSQL_HOST || 'localhost',
  port: Number(process.env.PORT) || 3306,
  username: process.env.MYSQL_USERNAME || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  database: process.env.MYSQL_DATABASE || 'db_paper',
  entities: [PaperModel, CategoryModel, OpnameModel, OpnameItemModel],
  synchronize: true
}

export default dbConfig

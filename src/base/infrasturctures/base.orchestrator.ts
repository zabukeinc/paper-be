import { Repository } from 'typeorm'
import { Responses } from '../../helpers/responses'
import { FilterDTO } from './filter-dto'

export class BaseOrchestrator<Entity> {
  constructor(repo: Repository<Entity>) {
    this.repository = repo
  }

  protected readonly repository: Repository<Entity>

  protected readonly responses: Responses = new Responses()

  protected relations: string[] = []

  async index(params: FilterDTO): Promise<any> {
    let page = params.page ?? 0
    let limit = params.limit ?? 10

    const [results, total] = await this.repository.findAndCount({
      relations: this.relations,
      skip: page,
      take: limit
    })

    
    // @ts-ignore
    let data = results.sort((prev, next) => next.id - prev.id)

    return {
      data: data,
      count: total
    }
  }

  async show(id: number): Promise<Entity> {
    const data = await this.repository.findOne({
      where: { id },
      relations: this.relations
    })

    if (!data) {
      throw new Error(`Theres no entity with id ${id}`)
    }

    return data
  }
}

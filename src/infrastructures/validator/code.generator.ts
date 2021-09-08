import { Repository } from 'typeorm'

export class CodeGenerator {
  protected prefix: string
  protected date: string

  protected repository: Repository<any>

  public setRepository(repo: Repository<any>): this {
    this.repository = repo

    return this
  }

  public setPrefix(prefix: string): this {
    this.prefix = prefix

    return this
  }

  public setDate(date: Date): this {
    const day = date.toJSON().slice(0,10).split('-')[1]
    const month = date.toJSON().slice(0,10).split('-')[2]
    this.date = `${day}${month}`

    return this
  }

  public async generate(): Promise<string> {
    const latestId = String(await this.getLatestId()).padStart(4, '0')

    return `${String(this.prefix)}-${this.date}-${latestId}`
  }

  protected async getLatestId(): Promise<number> {
    const entity = await this.repository.findOne({
      order: { id: 'DESC' }
    })

    return entity ? entity.id + 1 : 1
  }
}

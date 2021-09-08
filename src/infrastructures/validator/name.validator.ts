import { Repository } from 'typeorm'

export class NameValidator<Entity extends { id: number; name: string }> {
  constructor(
    protected readonly repository: Repository<Entity>,
    protected readonly name: string,
    protected readonly entityId?: number
  ) {}

  protected data: Entity

  async execute(): Promise<void | Error> {
    await this.preProcess()

    if (!this.data) return

    if (this.isNameEqual() && !this.entityId) {
      throw new Error(`Name already exist`)
    }

    if (this.isNameEqual() && this.entityId !== this.data.id) {
      throw new Error(`Name already exist`)
    }
  }

  async preProcess(): Promise<void> {
    const data = await this.repository.findOne({
      where: { name: this.name }
    })

    Object.assign(this, { data })
  }

  protected isNameEqual(): boolean {
    return this.data.name === this.name
  }
}

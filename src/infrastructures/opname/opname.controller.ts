import { Body, Delete, Get, Path, Post, Put, Query, Route, Tags } from 'tsoa'
import { FilterDTO } from '../../base/infrasturctures/filter-dto'
import { OpnameDTO, OpnameEntity } from '../../entities/opname/opname.entity'
import { Responses } from '../../helpers/responses'
import { OpnameOrchestrator } from './opname.orchestrator'

@Route('opname')
@Tags('Stock Opname')
export class OpnameController {
  constructor() {
    this.orchestrator = new OpnameOrchestrator()
  }

  protected orchestrator: OpnameOrchestrator
  protected readonly responses: Responses = new Responses()

  @Get('/')
  public async index(
    @Query() page: number,
    @Query() limit: number
  ): Promise<OpnameEntity[]> {
    const params = { page, limit }
    return await this.orchestrator.index(params)
  }

  @Post('/')
  public async create(@Body() body: OpnameDTO): Promise<OpnameEntity> {
    return await this.orchestrator.create(body)
  }

  @Delete('/')
  public async delete(@Body() ids: number[]): Promise<void> {
    await this.orchestrator.delete(ids)
  }

  @Put('/:id/check')
  public async check(@Path() id: string): Promise<OpnameEntity> {
    return await this.orchestrator.check(Number(id))
  }

  @Put('/:id')
  public async update(
    @Path() id: string,
    @Body() body: OpnameDTO
  ): Promise<OpnameEntity> {
    return await this.orchestrator.update(Number(id), body)
  }

  @Get('/:id')
  public async show(@Path() id: string): Promise<OpnameEntity> {
    return await this.orchestrator.show(Number(id))
  }
}

import { Body, Delete, Get, Path, Post, Put, Query, Route, Tags } from 'tsoa'
import { PaperDTO, PaperEntity } from '../../entities/paper/paper.entity'
import { Responses } from '../../helpers/responses'
import { PaperOrchestrator } from './paper.orchestrator'

@Route('paper')
@Tags('Papers')
export class PaperController {
  constructor() {
    this.orchestrator = new PaperOrchestrator()
  }

  protected orchestrator: PaperOrchestrator
  protected readonly responses: Responses = new Responses()

  @Get('/')
  public async index(
    @Query('page') page: number,
    @Query('limit') limit: number
  ): Promise<PaperEntity[]> {
    const params = { page, limit }
    return await this.orchestrator.index(params)
  }

  @Post('/')
  public async create(@Body() body: PaperDTO): Promise<PaperEntity> {
    return await this.orchestrator.create(body)
  }

  @Delete('/')
  public async delete(@Body() ids: number[]): Promise<void> {
    await this.orchestrator.delete(ids)
  }

  @Put('/:id')
  public async update(
    @Path() id: string,
    @Body() body: PaperDTO
  ): Promise<PaperEntity> {
    return await this.orchestrator.update(Number(id), body)
  }

  @Get('/:id')
  public async show(@Path() id: string): Promise<PaperEntity> {
    return await this.orchestrator.show(Number(id))
  }
}

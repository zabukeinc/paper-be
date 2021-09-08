import { Body, Delete, Get, Path, Post, Put, Query, Route, Tags } from 'tsoa'
import { FilterDTO } from '../../base/infrasturctures/filter-dto'
import {
  CategoryDTO,
  CategoryEntity
} from '../../entities/category/category.entity'
import { Responses } from '../../helpers/responses'
import { CategoryOrchestrator } from './category.orchestrator'

@Route('category')
@Tags('Categories')
export class CategoryController {
  constructor() {
    this.orchestrator = new CategoryOrchestrator()
  }

  protected orchestrator: CategoryOrchestrator
  protected readonly responses: Responses = new Responses()

  @Get('/')
  public async index(
    @Query() page: number,
    @Query() limit: number
  ): Promise<CategoryEntity[]> {
    const params = {
      page,
      limit
    }
    return await this.orchestrator.index(params)
  }

  @Post('/')
  public async create(@Body() body: CategoryDTO): Promise<CategoryEntity> {
    return await this.orchestrator.create(body)
  }

  @Delete('/')
  public async delete(@Body() ids: number[]): Promise<void> {
    await this.orchestrator.delete(ids)
  }

  @Put('/:id')
  public async update(
    @Path() id: string,
    @Body() body: CategoryDTO
  ): Promise<CategoryEntity> {
    return await this.orchestrator.update(Number(id), body)
  }

  @Get('/:id')
  public async show(@Path() id: string): Promise<CategoryEntity> {
    return await this.orchestrator.show(Number(id))
  }
}

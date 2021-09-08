import { Body, Delete, Get, Path, Post, Put, Query, Route, Tags } from 'tsoa'
import { PaperDataService } from '../../data/services/paper-data.service'
import { PaperDTO, PaperEntity } from '../../entities/paper/paper.entity'
import { ReportEntity } from '../../entities/paper/report.entity'
import { Responses } from '../../helpers/responses'
import { PaperReportOrchestrator } from './paper-report.orchestrator'
import { PaperOrchestrator } from './paper.orchestrator'

@Route('report')
@Tags('Reports')
export class PaperReportController {
  constructor() {
    this.orchestrator = new PaperReportOrchestrator(
      new PaperDataService().build()
    )
  }

  protected orchestrator: PaperReportOrchestrator
  protected readonly responses: Responses = new Responses()

  @Get('/')
  public async report(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('date_start') date_start?: string,
    @Query('date_end') date_end?: string
  ): Promise<ReportEntity[]> {
    const params = { page, limit, date_start, date_end }
    return await this.orchestrator.getReports(params)
  }

  @Get('/:id')
  public async show(@Path() id: string): Promise<ReportEntity> {
    return await this.orchestrator.show(Number(id))
  }
}

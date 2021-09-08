import { Repository, SelectQueryBuilder } from 'typeorm'
import { FilterDTO } from '../../base/infrasturctures/filter-dto'
import { PaperModel } from '../../data/models/paper/paper.model'
import { OpnameStatus } from '../../entities/opname/opname.entity'
import {
  ReportDetailEntity,
  ReportEntity
} from '../../entities/paper/report.entity'

export class PaperReportOrchestrator {
  constructor(protected readonly repository: Repository<PaperModel>) {}

  async getReports(params: FilterDTO): Promise<any> {
    const [papers, total] = await this.repository
      .createQueryBuilder('paper')
      .leftJoinAndSelect('paper.category', 'category')
      .innerJoinAndSelect('paper.opname_items', 'opname_items')
      .innerJoinAndSelect('opname_items.opname', 'opname')
      .where((qb: SelectQueryBuilder<PaperModel>) => {
        qb.where('opname.status = :opnameStatus', {
          opnameStatus: OpnameStatus.CHECKED
        })
        if (params.date_start && params.date_end) {
          qb.where('opname.date BETWEEN :dateStart AND :dateEnd', {
            dateStart: new Date(params.date_start),
            dateEnd: new Date(params.date_end)
          })
        }
      })
      .orderBy('opname_items.id', 'DESC')
      .skip(params.page)
      .take(params.limit)
      .getManyAndCount()

    const results: ReportEntity[] = papers.map((paper) => {
      const details: ReportDetailEntity[] = paper.opname_items.map((item) => {
        const isMinus: boolean = item.quantity - item.quantity_system < 0

        return {
          opname_code: item.opname.code,
          opname_date: item.opname.date,
          in: item.quantity,
          out: isMinus ? item.quantity - item.quantity_system : 0
        }
      })

      const totalIn: number = details.reduce(
        (total: number, detail: ReportDetailEntity) => {
          return (total += detail.in)
        },
        0
      )

      const totalOut: number = details.reduce(
        (total: number, detail: ReportDetailEntity) => {
          return (total += detail.out)
        },
        0
      )

      return {
        paper_code: paper.code,
        id: paper.id,
        paper_name: paper.name,
        total_in: totalIn,
        total_out: totalOut,
        total_quantity: Math.abs(totalIn) - Math.abs(totalOut),
        category_id: paper.category_id,
        category_code: paper.category.code,
        category_name: paper.category.name,
        details: details
      }
    })

    return { data: results, count: total }
  }

  async show(id: number): Promise<ReportEntity> {
    const paper: any = await this.repository
      .createQueryBuilder('paper')
      .leftJoinAndSelect('paper.category', 'category')
      .innerJoinAndSelect('paper.opname_items', 'opname_items')
      .innerJoinAndSelect('opname_items.opname', 'opname')
      .where((qb: SelectQueryBuilder<PaperModel>) => {
        qb.where('opname.status = :opnameStatus', {
          opnameStatus: OpnameStatus.CHECKED
        })
        qb.andWhere('paper.id = :paperId', { paperId: id })
      })
      .orderBy('opname_items.id', 'DESC')
      .getOne()

    // @ts-ignore
    const details: ReportDetailEntity[] = paper.opname_items.map((item) => {
      const isMinus: boolean = item.quantity - item.quantity_system < 0

      return {
        opname_code: item.opname.code,
        opname_date: item.opname.date,
        physic: item.quantity,
        in: !isMinus ? Math.abs(item.quantity - item.quantity_system) : 0,
        out: isMinus ? item.quantity - item.quantity_system : 0
      }
    })

    const totalIn: number = details.reduce(
      (total: number, detail: ReportDetailEntity) => {
        return (total += detail.in)
      },
      0
    )

    const totalOut: number = details.reduce(
      (total: number, detail: ReportDetailEntity) => {
        return (total += detail.out)
      },
      0
    )

    // @ts-ignore
    return {
      paper_code: paper.code,
      id: paper.id,
      paper_name: paper.name,
      total_in: totalIn,
      total_out: totalOut,
      total_quantity: Math.abs(totalIn) - Math.abs(totalOut),
      category_id: paper.category_id,
      category_code: paper.category.code,
      category_name: paper.category.name,
      details: details
    }
  }
}

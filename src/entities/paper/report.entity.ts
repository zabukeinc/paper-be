export interface ReportEntity {
  id: number
  paper_code: string
  paper_name: string
  total_in: number
  total_out: number
  total_quantity: number
  category_name: string
  category_code: string
  category_id: number
  details: ReportDetailEntity[]
}

export interface ReportDetailEntity {
  in: number
  out: number
  opname_code: string
  opname_date: Date
}

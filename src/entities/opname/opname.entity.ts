export interface OpnameDTO {
  items: OpnameItemDTO[]
}

export interface OpnameItemDTO {
  paper_id: number
  quantity: number
}

export enum OpnameStatus {
  DRAFT = 'draft',
  CHECKED = 'checked'
}

export enum OpnameResult {
  MATCH = 'match',
  NOT_MATCH = 'not_match'
}

export interface OpnameEntity {
  id: number
  code: string
  date: Date
  result: OpnameResult
  items: OpnameItemEntity[]
}

export interface OpnameItemEntity {
  id: number
  paper_id: number
  quantity: number
  quantity_system: number
  opname?: OpnameEntity
}

import { ResponseEntity } from '../entities/response.entity'

export class Responses {
  constructor() {}

  json(status: number, data: any, error: any = null): ResponseEntity {
    return { status, data, error: error }
  }
}

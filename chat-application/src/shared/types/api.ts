export interface ApiSuccessResponse<T> {
  data: T
  status: number
}

export interface ApiErrorResponse {
  message: string
  status: number
}

export class ApiError extends Error {
  public readonly status: number
  public readonly data: { message: string }

  constructor(status: number, message: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.data = { message }
  }
}

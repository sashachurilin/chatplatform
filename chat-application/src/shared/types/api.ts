export class ApiError extends Error {
  readonly status: number
  readonly data: { message: string }

  constructor(status: number, message: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.data = { message }
  }
}

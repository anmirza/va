import { Request, Response, NextFunction } from 'express'

export interface AppError extends Error {
  status?: number
}

export function errorHandler(err: AppError, req: Request, res: Response, _next: NextFunction): void {
  const status = err.status ?? 500
  const message = status === 500 ? 'Internal server error' : err.message
  if (status === 500) console.error('[Error]', err)
  res.status(status).json({ error: message })
}

export function notFound(req: Request, res: Response): void {
  res.status(404).json({ error: `Route not found: ${req.method} ${req.path}` })
}

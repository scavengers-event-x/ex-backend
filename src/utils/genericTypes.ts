import Express from 'express'
import { Send } from 'express-serve-static-core'

/** A high-level generic object. */
export type GenericObject<T = unknown> = { [key: string]: T }

/** Generic type to allow null. */
export type Nullable<T> = T | null

/** Common success object. */
export interface SuccessObject<T> {
  success: boolean,
  message: string,
  data: Nullable<T>,
}

/** Common error object. */
export interface ErrorObject {
  success: boolean,
  message: string,
  data: null,
}

/** Function with single parameter returning void */
export type FunctionWithParam<T> = (p: T) => void

/** Function with single parameter and return */
export type FunctionWithParamAndReturn<T, R> = (p: T) => R

/** Function with single parameter returning void */
export type FunctionWithNoParam = () => void

/** Function with single parameter with return */
export type FunctionWithNoParamButReturn<R> = () => R

/** Express request with typed body */
export interface TypedRequestBody<T> extends Express.Request {
  body: T
}

/** Express request with typed query */
export interface TypedRequestQuery<T> extends Express.Request {
  query: T
}

interface TypedSend<T> extends Send {
  body: T
}

/** Express response with typed body */
export interface TypedResponse<ResBody> extends Express.Response {
  json: TypedSend<ResBody>;
}

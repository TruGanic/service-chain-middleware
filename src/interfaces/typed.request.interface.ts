import { Request } from 'express';

export interface TypedRequest<T> extends Request {
  body: T;
  file?: Express.Multer.File; 
}
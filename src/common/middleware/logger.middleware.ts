import { NextFunction, Request, Response } from 'express';

export function logger(req: Request, _res: Response, next: NextFunction) {
  console.log('*****Start Request*****');
  console.log(`Request arrived: ${new Date(Date.now()).toISOString()}`);
  console.log(`Request Body:\n ${JSON.stringify(req.body)}`);
  console.log(`Request Headers:\n ${JSON.stringify(req.headers)}`);
  console.log('*****End Request.*****\n');
  next();
}

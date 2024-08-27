import * as express from 'express';
import { validParam } from '@/utils/middleware';
import parameter from '@/@types/parameter';
import { loginVerify, question } from './login';

// eslint-disable-next-line new-cap
const router = express.Router();

router.post(
  '/login',
  (req: express.Request, res: express.Response, next: express.NextFunction) =>
    validParam(req, res, next, parameter.loginVerify),
  loginVerify,
);

router.post(
  '/question',
  (req: express.Request, res: express.Response, next: express.NextFunction) =>
    validParam(req, res, next, parameter.question),
  question,
);

// 路由入口
const index = (app: express.Application) =>
  app.use('/', (req: express.Request, res: express.Response, next: express.NextFunction) => router(req, res, next));

export default index;

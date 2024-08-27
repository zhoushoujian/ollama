import * as express from 'express';
import utils from '../utils/utils';
import logger from '../utils/logger';
import { llamaGenerate } from '@/utils/llama';
import { qwen2Generate } from '@/utils/qwen2';

export async function loginVerify(req: express.Request, res: express.Response) {
  try {
    const { username, pwd } = req.body;
    logger.info('login_verify username pwd', username, pwd);
    //put yor code here
    return utils.writeResponse(req, res, { data: 'put yor code here' });
  } catch (err: any) {
    logger.error('loginVerify err', err.stack || err.toString());
    return utils.reportError(req, res, err);
  }
}

export async function question(req: express.Request, res: express.Response) {
  try {
    const { prompt } = req.body;
    logger.info('question prompt', prompt);
    const qwen2 = qwen2Generate(prompt);
    const llama = llamaGenerate(prompt);
    return await Promise.all([qwen2, llama]).then((result) => {
      logger.info('question result', result);
      return utils.writeResponse(req, res, { qwen2: result[0], llama: result[1] });
    });
  } catch (err: any) {
    logger.error('question err', err.stack || err.toString());
    return utils.reportError(req, res, err);
  }
}

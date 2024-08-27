import * as WebSocket from 'ws';
import CONF from '@/config';
import { httpServer } from '@/server';
import logger from '@/utils/logger';
import qwen2 from './qwen2';
import llama from './llama';

function socketVerify(_info: any) {
  return true;
}

export const connections: { [k: string]: any } = {};

const wsServerConfig: any = {
  server: httpServer,
  perMessageDeflate: true,
  handleProtocols: 'file',
  verifyClient: socketVerify,
};

export const wss = new WebSocket.Server(wsServerConfig);

interface IMessage {
  type: string;
  userId: string;
  data: any;
}

wss.on('connection', function connection(ws, _req) {
  let userId: string;

  wss.on('ping', () => {
    logger.debug('receive pong');
  });

  ws.on('message', async function incoming(message: string) {
    try {
      const data: IMessage = JSON.parse(message);
      logger.debug('websocket connection data', data);
      if (data.type === CONF.WEBSOCKET_TYPE.TRY_CONNECT) {
        // logger.debug('received: ', JSON.stringify(message));
        connections[data.userId] = ws;
        userId = data.userId;
        writeWSResponse(Date.now(), data.userId);
      } else if (data.type === CONF.WEBSOCKET_TYPE.CHECK_CONNECT) {
        if (data.data === CONF.WEBSOCKET_TYPE.PING) {
          writeWSResponse(Date.now(), data.userId);
        }
      } else if (data.type === CONF.WEBSOCKET_TYPE.QUESTION) {
        logger.info('QUESTION received data', data);
        //这里的prompt是请求方发送的问题，data.data必须是一个对象，便须后续传参字段扩展
        const { prompt } = data.data;
        qwen2(prompt, (chunk: string) => {
          return writeWSResponse({ fullResponseOutput: chunk }, data.userId);
        });
        llama(prompt, (chunk: string) => {
          return writeWSResponse({ fullResponseOutput: chunk }, data.userId);
        });
      }
    } catch (err) {
      logger.error('incoming err', err);
    }
  });
  ws.on('close', (_code: number, _msg: string) => {
    delete connections[userId];
    ws.terminate();
  });
});

wss.on('error', function (error: Error) {
  logger.error('wss error', error.stack || error.toString());
});

const writeWSResponse = (data: unknown, userId: string) => {
  try {
    const response = Object.assign({
      status: 200,
      data,
    });
    connections[userId].send(Buffer.from(JSON.stringify(response)), {
      binary: false,
    });
  } catch (err) {
    logger.error('writeWSResponse err', err);
  }
};

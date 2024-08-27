import { Ollama } from 'ollama-node';
import logger from './logger';

const ollama = new Ollama();
ollama.setModel('qwen2').then(() => {
  logger.info('qwen2 init success');
});

const qwen2 = async (question: string, callback: (chunk: string) => void) => {
  logger.info('qwen2 get question', question);
  await ollama.streamingGenerate(
    question,
    (_responseOutput) => {
      // logger.info('qwen2 responseOutput', responseOutput);
    },
    (contextOutput) => {
      logger.info('qwen2 contextOutput', contextOutput);
    },
    callback,
    (statsOutput) => {
      logger.info('qwen2 statsOutput', statsOutput);
    },
  );
  logger.info('qwen2 streamingGenerate success');
};

export const qwen2Generate = async (question: string) => {
  qwen2(question, (chunk) => {
    logger.info('qwen2 chunk', chunk);
  });
  // return Promise.resolve('qwen2');
  const result = await ollama.generate(question);
  return result;
};

export default qwen2;

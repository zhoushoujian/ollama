import { Ollama } from 'ollama-node';
import logger from './logger';

const ollama = new Ollama();
ollama.setModel('llama3.1').then(() => {
  logger.info('llama3.1 init success');
});

const llama = async (question: string, callback: (chunk: string) => void) => {
  logger.info('llama get question', question);
  await ollama.streamingGenerate(
    question,
    (responseOutput) => {
      logger.info('llama responseOutput', responseOutput);
    },
    (contextOutput) => {
      logger.info('llama contextOutput', contextOutput);
    },
    callback,
    (statsOutput) => {
      logger.info('llama statsOutput', statsOutput);
    },
  );
  logger.info('llama streamingGenerate success');
};

export const llamaGenerate = async (question: string) => {
  const result = await ollama.generate(question);
  return result;
  // return Promise.resolve('llama');
};

export default llama;

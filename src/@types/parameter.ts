import { ParameterRules } from 'parameter';

export default {
  loginVerify: {
    username: 'string',
    pwd: 'string',
  } as ParameterRules<any>,
  question: {
    prompt: 'string',
  } as ParameterRules<any>,
};

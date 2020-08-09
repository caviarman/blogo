import { Environment } from './interface';

declare var require: any;
const env = require('./config.json');

export const environment: Environment = {
  production: true,
  ...env
};

import './overloads';
import path from 'node:path';
import fs from 'node:fs';
import settings from './settings';
import App from './app';

(() => {
  const statics = path.resolve(process.cwd(), '..', 'client');
  if (!fs.existsSync(statics)) {
    fs.mkdirSync(statics);
  }
  const dependencies = [
    {
      method: async (args) => new Promise((resolve, reject)=> resolve('one')),
      args: [settings]
    },
    {
      method: async () => new Promise((resolve, reject)=> resolve('two')),
      args: []
    }
  ];

  const app = new App({ dependencies, settings });
  app.start();

})();
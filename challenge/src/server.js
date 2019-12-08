import http from 'http';
import sirv from 'sirv';
import polka from 'polka';
import { json } from 'body-parser';
import compression from 'compression';
import * as sapper from '@sapper/server';

import api from './api';

const { PORT, NODE_ENV } = process.env;
const dev = NODE_ENV === 'development';

const server = http.createServer();
const app = polka({ server });

app.use(json(), compression({ threshold: 0 }), sirv('static', { dev }));

app.use('/api', api);

app.get('/*', sapper.middleware());

app.listen(PORT, (err) => {
  if (err) console.log('error', err);
});

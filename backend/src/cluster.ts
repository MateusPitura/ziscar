import { cpus } from 'os';
import cluster from 'node:cluster';
import { Logger } from '@nestjs/common';
import { bootstrap } from './main';
import { isProduction } from './constants';

const MAX_WORKERS = 2;

async function start() {
  if (cluster.isPrimary) {
    const numCPUs = isProduction ? cpus().length : MAX_WORKERS;
    Logger.log(`Primary process is running. Forking ${numCPUs} workers...`);

    for (let i = 0; i < numCPUs; i++) {
      cluster.fork();
    }

    cluster.on('exit', (worker) => {
      Logger.warn(`Worker ${worker.process.pid} died. Forking a new one...`);
      cluster.fork();
    });
  } else {
    await bootstrap();
  }
}

start();

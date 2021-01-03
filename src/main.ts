import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// import * as killPort from 'kill-port';

import * as sh from 'shell-exec';
import { INestApplication } from '@nestjs/common';

async function bootstrap(k: number | null = null) {
  // await killPort(3000);
  const apps: INestApplication[] = [];
  apps[k] = await NestFactory.create(AppModule);
  await apps[k]
    .listen((k && 3000 + k) || process.env.HTTP_PORT || 3000)
    .catch(() => null);
}

(async () => {
  for (let i = 0; i < parseInt(process.env.kmax || '3'); i++) {
    process.env.kp &&
      (await sh(
        `lsof -i tcp:${
          3000 + i
        } | grep LISTEN | awk '{print $2}' | xargs kill -9`,
      ).catch(() => console.log('Next one')));
    await bootstrap(i).catch(() => null);
  }
})();

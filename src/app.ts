import Koa from 'koa';
import ratelimit from 'koa-ratelimit';
import { createHttpTerminator } from 'http-terminator';
import { Server } from 'http';

const app = new Koa();

/***
 * Simple, simple, rate limiting
 * * Use db stored in memory, so this is unique to this process.
 * * Limit things to `max` requests per `duration`.
 ***/
const storage = new Map();
app.use(
  ratelimit({
    driver: 'memory',
    db: storage,
    duration: 1000,
    max: 3,
  }),
);

app.use((ctx) => {
  ctx.body = 'hello, world';
});

export async function start(): Promise<void> {
  const port = process.env['APP_PORT'] || 3000;
  // There may be additional checks we want to do before
  // starting up our service. This would be the place to
  // put them.
  const server = app.listen(port, () => {
    console.log(`Listening on port ${port}`);
  });

  prepareShutdown(server);
}

function prepareShutdown(server: Server): void {
  const terminator = createHttpTerminator({ server });
  process.on('SIGINT', async () => {
    // Put anything here that is needed to shut down gracefully.
    // Do you have any database connections that you need to release?
    // This is th eplace to do it.
    console.log('caught SIGINT, exiting gracefully');
    await terminator.terminate();
  });
}

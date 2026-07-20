import Redis from "ioredis";

const globalForRedis = globalThis as unknown as { redis?: Redis };

function createClient() {
  let client: Redis;
  if (process.env.REDIS_URL) {
    client = new Redis(process.env.REDIS_URL, { maxRetriesPerRequest: 1, connectTimeout: 1000 });
  } else {
    client = new Redis({
      host: process.env.REDIS_HOST || "127.0.0.1",
      port: Number(process.env.REDIS_PORT) || 6379,
      password: process.env.REDIS_PASSWORD,
      maxRetriesPerRequest: 1,
      connectTimeout: 1000,
    });
  }

  client.on("error", (err) => {
    console.warn("Redis client connection error (suppressed):", err.message);
  });

  return client;
}

let activeClient: Redis | null = null;

function getClient(): Redis {
  if (activeClient) return activeClient;

  if (globalForRedis.redis) {
    activeClient = globalForRedis.redis;
    return activeClient;
  }

  const client = createClient();
  activeClient = client;

  // Save to globalThis in both development and production to reuse connections across serverless warm containers
  globalForRedis.redis = client;

  return client;
}

export const redis = new Proxy({} as Redis, {
  get(target, prop, receiver) {
    const client = getClient();
    const value = Reflect.get(client, prop, receiver);
    if (typeof value === "function") {
      return value.bind(client);
    }
    return value;
  },
});

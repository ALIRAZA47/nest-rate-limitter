import { RateLimitStorage } from '../interfaces/rate-limit-strategy.interface';

export interface RedisOptions {
  host?: string;
  port?: number;
  password?: string;
  db?: number;
  keyPrefix?: string;
  // Allow passing a Redis instance directly
  client?: any;
}

export class RedisStorage implements RateLimitStorage {
  private client: any;
  private keyPrefix: string;

  constructor(options: RedisOptions = {}) {
    this.keyPrefix = options.keyPrefix || 'rate-limit:';

    if (options.client) {
      this.client = options.client;
    } else {
      // Try to import ioredis
      try {
        const Redis = require('ioredis');
        this.client = new Redis({
          host: options.host || 'localhost',
          port: options.port || 6379,
          password: options.password,
          db: options.db || 0,
        });
      } catch (error) {
        throw new Error(
          'ioredis is required for Redis storage. Install it with: npm install ioredis',
        );
      }
    }
  }

  private getKey(key: string): string {
    return `${this.keyPrefix}${key}`;
  }

  async get(key: string): Promise<string | null> {
    const result = await this.client.get(this.getKey(key));
    return result || null;
  }

  async set(key: string, value: string, ttl?: number): Promise<void> {
    const fullKey = this.getKey(key);
    if (ttl) {
      await this.client.setex(fullKey, ttl, value);
    } else {
      await this.client.set(fullKey, value);
    }
  }

  async increment(key: string, ttl?: number): Promise<number> {
    const fullKey = this.getKey(key);
    const result = await this.client.incr(fullKey);
    if (ttl && result === 1) {
      // Set TTL only on first increment
      await this.client.expire(fullKey, ttl);
    }
    return result;
  }

  async delete(key: string): Promise<void> {
    await this.client.del(this.getKey(key));
  }

  async exists(key: string): Promise<boolean> {
    const result = await this.client.exists(this.getKey(key));
    return result === 1;
  }
}


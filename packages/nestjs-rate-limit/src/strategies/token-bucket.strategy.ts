import { RateLimitStrategy, RateLimitStorage } from '../interfaces/rate-limit-strategy.interface';

interface TokenBucketData {
  tokens: number; // Current number of tokens
  lastRefillTime: number; // Last time tokens were refilled
}

export class TokenBucketStrategy implements RateLimitStrategy {
  constructor(
    private readonly capacity: number,
    private readonly refillRate: number, // tokens per second
  ) {
    if (capacity <= 0) {
      throw new Error('Capacity must be greater than 0');
    }
    if (refillRate <= 0) {
      throw new Error('Refill rate must be greater than 0');
    }
  }

  async check(key: string, storage: RateLimitStorage): Promise<boolean> {
    const now = Date.now() / 1000; // Convert to seconds
    const storageKey = `token:${key}`;

    const data = await storage.get(storageKey);
    let bucket: TokenBucketData;

    if (data) {
      try {
        bucket = JSON.parse(data);
      } catch {
        bucket = { tokens: this.capacity, lastRefillTime: now };
      }
    } else {
      bucket = { tokens: this.capacity, lastRefillTime: now };
    }

    // Refill tokens based on time passed
    const timePassed = now - bucket.lastRefillTime;
    const tokensToAdd = timePassed * this.refillRate;
    bucket.tokens = Math.min(this.capacity, bucket.tokens + tokensToAdd);
    bucket.lastRefillTime = now;

    // Check if we have tokens available
    if (bucket.tokens < 1) {
      // Update storage even if request is rejected (to track refill)
      await storage.set(storageKey, JSON.stringify(bucket), 3600); // 1 hour TTL
      return false;
    }

    // Consume one token
    bucket.tokens -= 1;
    await storage.set(storageKey, JSON.stringify(bucket), 3600);

    return true;
  }

  async getRemaining(key: string, storage: RateLimitStorage): Promise<number> {
    const now = Date.now() / 1000;
    const storageKey = `token:${key}`;

    const data = await storage.get(storageKey);
    if (!data) {
      return this.capacity;
    }

    try {
      const bucket: TokenBucketData = JSON.parse(data);
      const timePassed = now - bucket.lastRefillTime;
      const tokensToAdd = timePassed * this.refillRate;
      const currentTokens = Math.min(this.capacity, bucket.tokens + tokensToAdd);
      return Math.max(0, Math.floor(currentTokens));
    } catch {
      return this.capacity;
    }
  }

  async getResetTime(key: string, storage: RateLimitStorage): Promise<number> {
    const now = Date.now() / 1000;
    const storageKey = `token:${key}`;

    const data = await storage.get(storageKey);
    if (!data) {
      return now;
    }

    try {
      const bucket: TokenBucketData = JSON.parse(data);
      const timePassed = now - bucket.lastRefillTime;
      const tokensToAdd = timePassed * this.refillRate;
      const currentTokens = Math.min(this.capacity, bucket.tokens + tokensToAdd);

      if (currentTokens >= 1) {
        return now;
      }

      // Calculate when next token will be available
      const tokensNeeded = 1 - currentTokens;
      const secondsUntilToken = tokensNeeded / this.refillRate;
      return now + secondsUntilToken;
    } catch {
      return now;
    }
  }
}

